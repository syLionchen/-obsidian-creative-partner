import { App, TFile } from "obsidian";
import { ChatMessage, FeedbackItem } from "../ai/types";

const EDITOR_FOLDER = "07_Editor";

/**
 * Append-only per-chapter log of what the AI Editor actually said, so the
 * "thinking process" survives an Obsidian restart even though the panel
 * itself only keeps chat/feedback in memory. This is intentionally a
 * write-only diary for humans to read back later - it does not get parsed
 * back into the panel's live state.
 */

function formatTimestamp(ts: number): string {
	const d = new Date(ts);
	return d.toLocaleString("zh-CN", { hour12: false });
}

async function ensureLogFile(app: App, chapterFile: TFile): Promise<TFile> {
	if (!app.vault.getAbstractFileByPath(EDITOR_FOLDER)) {
		await app.vault.createFolder(EDITOR_FOLDER);
	}
	const path = `${EDITOR_FOLDER}/${chapterFile.basename}.md`;
	const existing = app.vault.getAbstractFileByPath(path);
	if (existing instanceof TFile) return existing;

	const header = [
		"---",
		"type: editor_feedback",
		`chapter: "[[${chapterFile.basename}]]"`,
		"---",
		"",
		`# AI Editor Log: ${chapterFile.basename}`,
		"",
		"> AI Editor 对话与反馈的自动存档，供回看思路用。AI Editor 不会修改正文，这份日志也一样，只追加不改写。",
		"",
	].join("\n");
	return app.vault.create(path, header);
}

export async function logChatExchange(app: App, chapterFile: TFile, authorText: string, aiReply: ChatMessage): Promise<void> {
	const file = await ensureLogFile(app, chapterFile);
	const entry = `\n## ${formatTimestamp(aiReply.timestamp)} · Chat\n\n**You:** ${authorText}\n\n**AI Editor:** ${aiReply.text}\n`;
	await app.vault.append(file, entry);
}

export async function logFeedback(app: App, chapterFile: TFile, item: FeedbackItem): Promise<void> {
	const file = await ensureLogFile(app, chapterFile);
	const icon = item.severity === "warning" ? "⚠" : "ℹ";
	const entry = `\n## ${formatTimestamp(item.timestamp)} · Feedback: ${item.category}\n\n${icon} ${item.summary}\n\n${item.detail}\n`;
	await app.vault.append(file, entry);
}

export async function logResolved(app: App, chapterFile: TFile, item: FeedbackItem): Promise<void> {
	const file = await ensureLogFile(app, chapterFile);
	const entry = `\n## ${formatTimestamp(Date.now())} · Resolved: ${item.category}\n\n"${item.summary}" 已标记为已解决。\n`;
	await app.vault.append(file, entry);
}
