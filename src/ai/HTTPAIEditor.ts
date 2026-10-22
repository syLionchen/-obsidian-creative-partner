import { App, TFile } from "obsidian";
import { AIEditor } from "./AIEditor";
import { ChatMessage, FeedbackItem, HistoryEvent } from "./types";
import { buildSystemContext } from "./context";
import { openaiAdapter } from "./protocols/openai";
import { anthropicAdapter } from "./protocols/anthropic";
import { geminiAdapter } from "./protocols/gemini";
import { customAdapter } from "./protocols/custom";
import { PlainMessage, ProtocolAdapter, ProviderConfig } from "./protocols/types";

const ADAPTERS: Record<ProviderConfig["shape"], ProtocolAdapter> = {
	openai: openaiAdapter,
	anthropic: anthropicAdapter,
	gemini: geminiAdapter,
	custom: customAdapter,
};

interface ChapterState {
	chat: ChatMessage[];
	feedback: FeedbackItem[];
	history: HistoryEvent[];
}

let counter = 0;
function nextId(prefix: string): string {
	counter += 1;
	return `${prefix}-${Date.now()}-${counter}`;
}

/**
 * Bring-your-own-AI backend: any HTTP API, picked by `config.shape`. Unlike
 * CodexAIEditor there is no remote thread to resume - the provider's HTTP
 * endpoint is stateless, so this class resends the full per-chapter chat
 * history on every call, and explicitly prepends SKILL.md + the Writing
 * Profile (via buildSystemContext) as the system prompt every time. That
 * is the only "memory" there is for this backend - it lives entirely in
 * vault files, not on the provider's servers, so switching providers mid
 * novel does not lose coaching continuity.
 *
 * Same hard rule as CodexAIEditor: only ever reads the chapter file to
 * build a prompt, never writes to it.
 */
export class HTTPAIEditor implements AIEditor {
	private chapters = new Map<string, ChapterState>();
	private queue: Promise<unknown> = Promise.resolve();

	constructor(private app: App, private config: ProviderConfig) {}

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

	private async call(systemText: string, messages: PlainMessage[]): Promise<string> {
		const adapter = ADAPTERS[this.config.shape];
		try {
			return await adapter.call(this.config, systemText, messages);
		} catch (err) {
			throw new Error(`[${this.config.label}] 调用失败: ${err instanceof Error ? err.message : String(err)}`);
		}
	}

	async analyzeChapter(chapterId: string): Promise<FeedbackItem[]> {
		return this.enqueue(async () => {
			const { title, body } = await this.chapterContext(chapterId);
			const systemText = await buildSystemContext(this.app, chapterId);
			const prompt = [
				`[Creative Partner] 分析章节《${title}》。`,
				"只指出问题、解释原因、给出修改方向，不要重写正文。",
				"给 1~3 条你认为最值得关注的反馈。严格只输出下面这个 JSON 结构，不要有任何多余文字、不要用代码块包裹：",
				'{"items":[{"category":"string","severity":"info 或 warning","summary":"string","detail":"string"}]}',
				"",
				"章节正文：",
				body || "(空)",
			].join("\n");

			const raw = await this.call(systemText, [{ role: "user", content: prompt }]);
			const parsed = parseFeedbackJSON(raw);

			const s = this.state(chapterId);
			const newItems: FeedbackItem[] = parsed.map((item) => ({
				id: nextId("fb"),
				status: "open",
				timestamp: Date.now(),
				...item,
			}));
			s.feedback = [...newItems, ...s.feedback];
			this.pushHistory(chapterId, `${this.config.label} analysis (${newItems.length} items)`);
			return newItems;
		});
	}

	async sendMessage(chapterId: string, message: string): Promise<ChatMessage> {
		return this.enqueue(async () => {
			const s = this.state(chapterId);
			s.chat.push({ id: nextId("m"), role: "author", text: message, timestamp: Date.now() });

			const { title, body } = await this.chapterContext(chapterId);
			const systemText = [
				await buildSystemContext(this.app, chapterId),
				`[章节《${title}》当前正文]\n${body || "(空)"}`,
			]
				.filter(Boolean)
				.join("\n\n---\n\n");

			const history: PlainMessage[] = s.chat.map((m) => ({
				role: m.role === "author" ? "user" : "assistant",
				content: m.text,
			}));

			const replyText = await this.call(systemText, history);
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

type RawFeedbackItem = Pick<FeedbackItem, "category" | "severity" | "summary" | "detail">;

/** Models - especially via a custom adapter - don't always obey "no extra text" perfectly, so pull the first {...} block out before parsing instead of assuming raw is pure JSON. */
function parseFeedbackJSON(raw: string): RawFeedbackItem[] {
	const start = raw.indexOf("{");
	const end = raw.lastIndexOf("}");
	const jsonText = start !== -1 && end !== -1 ? raw.slice(start, end + 1) : raw;
	try {
		const parsed = JSON.parse(jsonText) as { items?: RawFeedbackItem[] };
		return Array.isArray(parsed.items) ? parsed.items : [];
	} catch (err) {
		throw new Error(`模型返回的内容不是预期的 JSON 格式: ${err instanceof Error ? err.message : err}\n原始返回: ${raw.slice(0, 300)}`);
	}
}
