import { ItemView, Notice, TFile, WorkspaceLeaf } from "obsidian";
import type CreativePartnerPlugin from "../main";
import { ChatMessage, FeedbackItem, HistoryEvent } from "../ai/types";
import { getFrontmatter } from "../data/vaultData";
import { logChatExchange, logFeedback, logResolved } from "../data/editorLog";
import { recordFeedback } from "../data/writingProfile";

export const EDITOR_PANEL_VIEW_TYPE = "novelos-editor-panel";

function formatTime(ts: number): string {
	return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * The right-hand AI Editor workspace: current chapter, a chat thread, and a
 * feedback list, all backed by an AIEditor implementation (mock for now).
 *
 * Hard rule this view must never violate: nothing here writes to the
 * chapter's own file. It only talks to the AIEditor abstraction and renders
 * whatever comes back.
 */
export class EditorPanelView extends ItemView {
	private chapterFile: TFile | null = null;
	private chatInput = "";

	constructor(leaf: WorkspaceLeaf, private plugin: CreativePartnerPlugin) {
		super(leaf);
	}

	/** Always read off the plugin instance, never cached - lets Settings swap the backend without reopening this view. */
	private get aiEditor() {
		return this.plugin.aiEditor;
	}

	getViewType() {
		return EDITOR_PANEL_VIEW_TYPE;
	}

	getDisplayText() {
		return "AI Editor";
	}

	getIcon() {
		return "bot";
	}

	async onOpen() {
		this.registerEvent(
			this.app.workspace.on("active-leaf-change", () => {
				this.chatInput = "";
				this.render();
			})
		);
		await this.render();
	}

	private currentChapterFile(): TFile | null {
		const file = this.app.workspace.getActiveFile();
		if (file && getFrontmatter(this.app, file).type === "chapter") return file;
		return null;
	}

	private async render() {
		this.chapterFile = this.currentChapterFile();
		const container = this.containerEl.children[1];
		container.empty();
		container.addClass("novelos-editor-panel");

		container.createEl("h2", { text: "AI Editor" });
		container.createEl("p", {
			text: "分析 → 指出问题 → 解释 → 给出修改方向。AI Editor 不会直接修改正文。",
			cls: "novelos-empty",
		});
		container.createEl("p", {
			text: "即使人工智能能够生成万千答案，人类依然拥有某种无法被穷尽的光。这种光，叫作创意。",
			cls: "novelos-empty novelos-quote",
		});

		this.renderUsageGuide(container);

		this.renderCurrentChapter(container);

		if (!this.chapterFile) {
			return;
		}
		const chapterId = this.chapterFile.path;

		await this.renderChat(container, chapterId);
		await this.renderFeedback(container, chapterId);
		await this.renderHistory(container, chapterId);
	}

	private renderUsageGuide(container: Element) {
		const details = container.createEl("details", { cls: "novelos-section novelos-usage-guide" });
		details.createEl("summary", { text: "使用说明" });

		const list = details.createEl("ol");
		list.createEl("li", {
			text: "先打开一个 Chapter 文件（带 type: chapter 的正文）。这个面板只在打开 Chapter 时显示 Chat / Feedback / History，没打开时下面是空的。",
		});
		list.createEl("li", {
			text: "Chat：直接跟 AI Editor 聊。它只读当前 Chapter 正文 + 一份跨章节索引（章节列表、未解决 Question、Scene 关联）来回复，从不会改你的正文。",
		});
		list.createEl("li", {
			text: "Analyze Current Chapter：按成熟的叙事方法论生成诊断式反馈卡片；每条反馈可以点 Discuss 丢进 Chat 继续聊，或 Mark resolved 标记已处理。",
		});
		list.createEl("li", {
			text: "对话和反馈会自动记进 07_Editor/ 对应文件，时间线能在下面的 Editor History 里看。",
		});
		list.createEl("li", {
			text: "想换 AI 后台（Mock 测试 / 自己配的 OpenAI 兼容・Claude・Gemini・自定义 API）——去插件设置里配 Provider，配完重新打开一次这个面板才生效。",
		});
	}

	private renderCurrentChapter(container: Element) {
		const section = container.createDiv({ cls: "novelos-section" });
		section.createEl("h3", { text: "Current Chapter" });
		if (!this.chapterFile) {
			section.createEl("p", { text: "(没有打开的 Chapter)", cls: "novelos-empty" });
			return;
		}
		const fm = getFrontmatter(this.app, this.chapterFile);
		section.createEl("p", { text: `${fm.title || this.chapterFile.basename} [${fm.status || "no status"}]` });
	}

	private async renderChat(container: Element, chapterId: string) {
		const section = container.createDiv({ cls: "novelos-section" });
		section.createEl("h3", { text: "Chat" });

		const messages = await this.aiEditor.getChatHistory(chapterId);
		const thread = section.createDiv({ cls: "novelos-chat-thread" });
		if (messages.length === 0) {
			thread.createEl("p", { text: "还没有对话。", cls: "novelos-empty" });
		}
		for (const msg of messages) {
			this.renderChatMessage(thread, msg);
		}

		const inputRow = section.createDiv({ cls: "novelos-chat-input-row" });
		const textarea = inputRow.createEl("textarea", { cls: "novelos-chat-input" });
		textarea.value = this.chatInput;
		textarea.placeholder = "和 AI Editor 说点什么...";
		textarea.rows = 2;
		textarea.oninput = () => {
			this.chatInput = textarea.value;
		};

		const sendButton = inputRow.createEl("button", { text: "Send" });
		sendButton.onclick = async () => {
			const text = this.chatInput.trim();
			const chapterFile = this.chapterFile;
			if (!text || !chapterFile) return;
			sendButton.disabled = true;
			sendButton.setText("Thinking...");
			try {
				const reply = await this.aiEditor.sendMessage(chapterId, text);
				await logChatExchange(this.app, chapterFile, text, reply);
				this.chatInput = "";
				await this.render();
			} catch (err) {
				new Notice(`Creative Partner: ${err instanceof Error ? err.message : String(err)}`, 10000);
				sendButton.disabled = false;
				sendButton.setText("Send");
			}
		};
	}

	private renderChatMessage(container: Element, msg: ChatMessage) {
		const line = container.createDiv({ cls: `novelos-chat-message novelos-chat-${msg.role}` });
		line.createEl("div", { text: msg.role === "author" ? "You" : "AI Editor", cls: "novelos-chat-speaker" });
		const body = line.createEl("div", { cls: "novelos-chat-text" });
		for (const part of msg.text.split("\n")) {
			body.createEl("div", { text: part || " " });
		}
	}

	private async renderFeedback(container: Element, chapterId: string) {
		const section = container.createDiv({ cls: "novelos-section" });
		const header = section.createDiv({ cls: "novelos-feedback-header" });
		header.createEl("h3", { text: "Editor Feedback" });
		const analyzeButton = header.createEl("button", { text: "Analyze Current Chapter" });
		analyzeButton.onclick = async () => {
			const chapterFile = this.chapterFile;
			if (!chapterFile) return;
			analyzeButton.disabled = true;
			analyzeButton.setText("Analyzing...");
			try {
				const newItems = await this.aiEditor.analyzeChapter(chapterId);
				for (const item of newItems) {
					await logFeedback(this.app, chapterFile, item);
				}
				await recordFeedback(this.app, newItems);
				await this.render();
			} catch (err) {
				new Notice(`Creative Partner: ${err instanceof Error ? err.message : String(err)}`, 10000);
				analyzeButton.disabled = false;
				analyzeButton.setText("Analyze Current Chapter");
			}
		};

		const items = await this.aiEditor.getFeedback(chapterId);
		if (items.length === 0) {
			section.createEl("p", { text: "暂无反馈。点击上方按钮生成一次分析。", cls: "novelos-empty" });
			return;
		}

		for (const item of items) {
			this.renderFeedbackItem(section, chapterId, item);
		}
	}

	private renderFeedbackItem(container: Element, chapterId: string, item: FeedbackItem) {
		const card = container.createDiv({ cls: `novelos-feedback-card novelos-feedback-${item.status}` });
		const title = card.createEl("div", { cls: "novelos-feedback-title" });
		title.createSpan({ text: item.severity === "warning" ? "⚠ " : "ℹ " });
		title.createSpan({ text: item.category });
		if (item.status === "resolved") {
			title.createSpan({ text: " (resolved)", cls: "novelos-empty" });
		}

		card.createEl("p", { text: item.summary });
		for (const line of item.detail.split("\n")) {
			card.createEl("p", { text: line, cls: "novelos-empty" });
		}

		const actions = card.createDiv({ cls: "novelos-feedback-actions" });
		const discussButton = actions.createEl("button", { text: "Discuss" });
		discussButton.onclick = () => {
			this.chatInput = `关于 "${item.summary}"，`;
			this.render();
		};

		const resolveButton = actions.createEl("button", { text: "Mark resolved" });
		resolveButton.disabled = item.status === "resolved";
		resolveButton.onclick = async () => {
			const chapterFile = this.chapterFile;
			if (!chapterFile) return;
			try {
				await this.aiEditor.resolveFeedback(chapterId, item.id);
				await logResolved(this.app, chapterFile, item);
				await this.render();
			} catch (err) {
				new Notice(`Creative Partner: ${err instanceof Error ? err.message : String(err)}`, 10000);
			}
		};
	}

	private async renderHistory(container: Element, chapterId: string) {
		const details = container.createEl("details", { cls: "novelos-section novelos-history" });
		details.createEl("summary", { text: "Editor History" });

		const events = await this.aiEditor.getHistory(chapterId);
		if (events.length === 0) {
			details.createEl("p", { text: "暂无历史记录。", cls: "novelos-empty" });
			return;
		}
		const list = details.createEl("ul");
		for (const event of events) {
			this.renderHistoryEvent(list, event);
		}
	}

	private renderHistoryEvent(container: Element, event: HistoryEvent) {
		const li = container.createEl("li");
		li.createSpan({ text: formatTime(event.timestamp), cls: "novelos-history-time" });
		li.createSpan({ text: ` ${event.label}` });
	}

	async onClose() {}
}
