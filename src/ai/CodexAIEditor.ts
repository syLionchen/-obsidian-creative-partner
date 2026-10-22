import { App, FileSystemAdapter, TFile } from "obsidian";
import { execFile } from "child_process";
import { promisify } from "util";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { AIEditor } from "./AIEditor";
import { ChatMessage, FeedbackItem, HistoryEvent } from "./types";
import { locateCodexExe } from "./codexLocator";
import { buildSystemContext } from "./context";

const execFileAsync = promisify(execFile);

interface ChapterState {
	chat: ChatMessage[];
	feedback: FeedbackItem[];
	history: HistoryEvent[];
}

export interface CodexAIEditorOptions {
	/** The Creative Partner-dedicated Codex thread id (forked once from an existing conversation). */
	threadId: string;
	/** Override for codexLocator's auto-detected path, mainly for testing. */
	exePath?: string;
	/** A real model call can legitimately take a while. */
	timeoutMs?: number;
}

const FEEDBACK_SCHEMA = {
	type: "object",
	properties: {
		items: {
			type: "array",
			items: {
				type: "object",
				properties: {
					category: { type: "string" },
					severity: { type: "string", enum: ["info", "warning"] },
					summary: { type: "string" },
					detail: { type: "string" },
				},
				required: ["category", "severity", "summary", "detail"],
				additionalProperties: false,
			},
		},
	},
	required: ["items"],
	additionalProperties: false,
};

let counter = 0;
function nextId(prefix: string): string {
	counter += 1;
	return `${prefix}-${Date.now()}-${counter}`;
}

/**
 * Real backend: every call shells out to the local `codex` CLI and resumes
 * the single Creative Partner thread recorded in .novelos/config/config.json
 * as codexThreadId (forked once, outside this plugin, from an existing
 * Codex conversation about the novel). Every chapter shares that one thread
 * so Codex keeps accumulating real context across the whole book; this
 * class only keeps a local per-chapter log of what was sent/received so the
 * panel can render it the same way it renders MockAIEditor's data.
 *
 * Hard rule this class must never violate: it only ever *reads* the chapter
 * file to build a prompt. It never calls anything that writes to a chapter.
 */
export class CodexAIEditor implements AIEditor {
	private chapters = new Map<string, ChapterState>();
	private exePath: string | null;
	private timeoutMs: number;
	/** Serializes CLI calls so two requests never resume the same thread concurrently. */
	private queue: Promise<unknown> = Promise.resolve();

	constructor(private app: App, private options: CodexAIEditorOptions) {
		this.exePath = options.exePath ?? locateCodexExe();
		this.timeoutMs = options.timeoutMs ?? 120_000;
	}

	private state(chapterId: string): ChapterState {
		let s = this.chapters.get(chapterId);
		if (!s) {
			s = { chat: [], feedback: [], history: [] };
			this.chapters.set(chapterId, s);
		}
		return s;
	}

	private pushHistory(chapterId: string, label: string) {
		this.state(chapterId).history.push({ id: nextId("h"), label, timestamp: Date.now() });
	}

	private vaultBasePath(): string | undefined {
		return this.app.vault.adapter instanceof FileSystemAdapter
			? this.app.vault.adapter.getBasePath()
			: undefined;
	}

	private async chapterContext(chapterId: string): Promise<{ title: string; body: string }> {
		const file = this.app.vault.getAbstractFileByPath(chapterId);
		if (!(file instanceof TFile)) return { title: chapterId, body: "" };
		const fm = this.app.metadataCache.getFileCache(file)?.frontmatter;
		const body = await this.app.vault.cachedRead(file);
		return { title: (fm && fm.title) || file.basename, body };
	}

	private enqueue<T>(task: () => Promise<T>): Promise<T> {
		const result = this.queue.then(task, task);
		this.queue = result.then(
			() => undefined,
			() => undefined
		);
		return result;
	}

	/** Runs `codex exec resume <threadId> <prompt>` and returns the agent's last message. */
	private async runCodex(prompt: string, options: { schema?: object } = {}): Promise<string> {
		if (!this.exePath) {
			throw new Error("找不到本机的 codex.exe，请确认 OpenAI Codex 已安装。");
		}
		const workDir = mkdtempSync(join(tmpdir(), "creative-partner-codex-"));
		const outFile = join(workDir, "out.txt");
		const args = ["exec", "resume", this.options.threadId, prompt, "-o", outFile];
		if (options.schema) {
			const schemaFile = join(workDir, "schema.json");
			writeFileSync(schemaFile, JSON.stringify(options.schema));
			args.push("--output-schema", schemaFile);
		}
		try {
			await execFileAsync(this.exePath, args, {
				cwd: this.vaultBasePath(),
				timeout: this.timeoutMs,
				maxBuffer: 20 * 1024 * 1024,
			});
			return readFileSync(outFile, "utf8");
		} catch (err: any) {
			const stderr = err?.stderr ? String(err.stderr).slice(0, 500) : "";
			throw new Error(`Codex CLI 调用失败: ${err?.message ?? err}${stderr ? `\n${stderr}` : ""}`);
		} finally {
			rmSync(workDir, { recursive: true, force: true });
		}
	}

	async analyzeChapter(chapterId: string): Promise<FeedbackItem[]> {
		return this.enqueue(async () => {
			const { title, body } = await this.chapterContext(chapterId);
			const systemText = await buildSystemContext(this.app, chapterId);
			const prompt = [
				...(systemText ? [systemText, "---", ""] : []),
				`[Creative Partner] 分析章节《${title}》。`,
				"只指出问题、解释原因、给出修改方向，不要重写正文。",
				"给 1~3 条你认为最值得关注的反馈，严格按 JSON Schema 返回，不要输出 JSON 以外的任何文字。",
				"",
				"章节正文：",
				body || "(空)",
			].join("\n");

			const raw = await this.runCodex(prompt, { schema: FEEDBACK_SCHEMA });
			const parsed = JSON.parse(raw) as {
				items: Array<Pick<FeedbackItem, "category" | "severity" | "summary" | "detail">>;
			};

			const s = this.state(chapterId);
			const newItems: FeedbackItem[] = parsed.items.map((item) => ({
				id: nextId("fb"),
				status: "open",
				timestamp: Date.now(),
				...item,
			}));
			s.feedback = [...newItems, ...s.feedback];
			this.pushHistory(chapterId, `Codex analysis (${newItems.length} items)`);
			return newItems;
		});
	}

	async sendMessage(chapterId: string, message: string): Promise<ChatMessage> {
		return this.enqueue(async () => {
			const s = this.state(chapterId);
			s.chat.push({ id: nextId("m"), role: "author", text: message, timestamp: Date.now() });

			const { title, body } = await this.chapterContext(chapterId);
			const systemText = await buildSystemContext(this.app, chapterId);
			const prompt = [
				...(systemText ? [systemText, "---", ""] : []),
				`[Creative Partner · 章节《${title}》当前正文]`,
				body || "(空)",
				"",
				"[作者]",
				message,
			].join("\n");

			const replyText = await this.runCodex(prompt);
			const reply: ChatMessage = { id: nextId("m"), role: "ai", text: replyText.trim(), timestamp: Date.now() };
			s.chat.push(reply);
			this.pushHistory(chapterId, "Chat exchange");
			return reply;
		});
	}

	async getFeedback(chapterId: string): Promise<FeedbackItem[]> {
		return this.state(chapterId).feedback;
	}

	async getHistory(chapterId: string): Promise<HistoryEvent[]> {
		return [...this.state(chapterId).history].sort((a, b) => b.timestamp - a.timestamp);
	}

	async getChatHistory(chapterId: string): Promise<ChatMessage[]> {
		return this.state(chapterId).chat;
	}

	async resolveFeedback(chapterId: string, feedbackId: string): Promise<void> {
		const item = this.state(chapterId).feedback.find((f) => f.id === feedbackId);
		if (item && item.status !== "resolved") {
			item.status = "resolved";
			this.pushHistory(chapterId, `${item.category} marked resolved`);
		}
	}

	recordAuthorEdit(chapterId: string): void {
		const s = this.state(chapterId);
		const last = s.history[s.history.length - 1];
		if (last && last.label === "Author revised" && Date.now() - last.timestamp < 60_000) return;
		this.pushHistory(chapterId, "Author revised");
	}
}
