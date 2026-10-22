import { ChatMessage, FeedbackItem, HistoryEvent } from "./types";

/**
 * Backend-agnostic seam between the AI Editor panel and whatever actually
 * does the thinking. V1 ships a MockAIEditor; later this can be backed by
 * Codex, Claude, the OpenAI API, a local model, or an MCP server without
 * the panel code changing at all.
 *
 * `chapterId` is the Chapter file's vault path - stable, unique, and already
 * available wherever a TFile is.
 *
 * The four methods below are the core contract the panel is built around.
 * `getChatHistory` / `resolveFeedback` / `recordAuthorEdit` exist only to
 * support the UI (listing a thread, toggling a status, logging a local
 * edit) and are trivial for any backend to implement.
 */
export interface AIEditor {
	/**
	 * Runs a fresh analysis pass over the chapter, returning only the items
	 * this pass generated (not the full accumulated list - use getFeedback()
	 * for that). Callers that want to log "what just happened" rely on this
	 * being just the new items.
	 */
	analyzeChapter(chapterId: string): Promise<FeedbackItem[]>;

	/** Sends an author chat message and returns the AI's reply. */
	sendMessage(chapterId: string, message: string): Promise<ChatMessage>;

	/** Current feedback items for a chapter (does not trigger new analysis). */
	getFeedback(chapterId: string): Promise<FeedbackItem[]>;

	/** Chronological log of notable events for a chapter (feedback, chat, edits). */
	getHistory(chapterId: string): Promise<HistoryEvent[]>;

	/** Full chat thread for a chapter. */
	getChatHistory(chapterId: string): Promise<ChatMessage[]>;

	/** Author marks a feedback item as resolved - never changes the chapter text. */
	resolveFeedback(chapterId: string, feedbackId: string): Promise<void>;

	/** Local bookkeeping hook: call when the chapter file itself was edited. */
	recordAuthorEdit(chapterId: string): void;
}
