import { AIEditor } from "./AIEditor";
import { ChatMessage, FeedbackItem, HistoryEvent } from "./types";

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

const FEEDBACK_TEMPLATES: Array<Pick<FeedbackItem, "category" | "severity" | "summary" | "detail">> = [
	{
		category: "Psychology",
		severity: "warning",
		summary: "这里可能存在“直接解释情绪”的问题。",
		detail: "建议思考：\n人物有没有可以观察到的行为？她的身体发生了什么？她有没有试图隐藏？",
	},
	{
		category: "Dialogue",
		severity: "info",
		summary: "这段对话信息量偏低，两句话在说同一件事。",
		detail: "建议思考：\n能不能让其中一句话同时透露一个新信息或态度？",
	},
	{
		category: "Continuity",
		severity: "warning",
		summary: "这里提到的时间，和前一场戏结尾的时间点可能对不上。",
		detail: "建议检查：\n上一场戏结束时是什么时间？这场戏开始时过去了多久？",
	},
];

/**
 * V1 mock backend: deterministic canned content, no real model behind it.
 * This is the only place that knows there's no real AI yet - swap the
 * single instantiation in main.ts for a real implementation later and
 * nothing else in the plugin needs to change.
 */
export class MockAIEditor implements AIEditor {
	private chapters = new Map<string, ChapterState>();

	private state(chapterId: string): ChapterState {
		let s = this.chapters.get(chapterId);
		if (!s) {
			s = { chat: [], feedback: [], history: [] };
			this.chapters.set(chapterId, s);
			this.seed(s);
		}
		return s;
	}

	private seed(s: ChapterState) {
		const now = Date.now();
		s.chat.push(
			{ id: nextId("m"), role: "author", text: "我觉得这里的人物反应不太自然。", timestamp: now },
			{
				id: nextId("m"),
				role: "ai",
				text:
					"我暂时不会修改正文。\n\n我认为这里可能涉及人物动机。\n我们可以先检查：\n为什么人物必须在这个时候做出这个反应？",
				timestamp: now + 1,
			}
		);
		const template = FEEDBACK_TEMPLATES[0];
		s.feedback.push({ id: nextId("fb"), status: "open", timestamp: now, ...template });
		s.history.push({ id: nextId("h"), label: `${template.category} feedback`, timestamp: now });
	}

	private pushHistory(chapterId: string, label: string) {
		this.state(chapterId).history.push({ id: nextId("h"), label, timestamp: Date.now() });
	}

	async analyzeChapter(chapterId: string): Promise<FeedbackItem[]> {
		const s = this.state(chapterId);
		const template = FEEDBACK_TEMPLATES[s.feedback.length % FEEDBACK_TEMPLATES.length];
		const item: FeedbackItem = { id: nextId("fb"), status: "open", timestamp: Date.now(), ...template };
		s.feedback = [item, ...s.feedback];
		this.pushHistory(chapterId, `${template.category} feedback`);
		return [item];
	}

	async sendMessage(chapterId: string, message: string): Promise<ChatMessage> {
		const s = this.state(chapterId);
		s.chat.push({ id: nextId("m"), role: "author", text: message, timestamp: Date.now() });

		const reply: ChatMessage = {
			id: nextId("m"),
			role: "ai",
			text: mockReply(message),
			timestamp: Date.now(),
		};
		s.chat.push(reply);
		this.pushHistory(chapterId, "Chat exchange");
		return reply;
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
		if (last && last.label === "Author revised" && Date.now() - last.timestamp < 60_000) {
			return;
		}
		this.pushHistory(chapterId, "Author revised");
	}
}

function mockReply(message: string): string {
	const excerpt = message.length > 40 ? `${message.slice(0, 40)}...` : message;
	return `我暂时不会修改正文。\n\n关于“${excerpt}”，我认为这里可能涉及人物动机。\n我们可以先检查：\n为什么人物必须在这个时候做出这个反应？`;
}
