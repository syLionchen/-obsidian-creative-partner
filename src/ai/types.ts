export interface ChatMessage {
	id: string;
	role: "author" | "ai";
	text: string;
	timestamp: number;
}

export interface FeedbackItem {
	id: string;
	category: string; // "Psychology" | "Dialogue" | "Continuity" | "Plot" | ... - free text on purpose
	severity: "info" | "warning";
	summary: string;
	detail: string;
	status: "open" | "resolved";
	timestamp: number;
	/**
	 * Reserved for future inline text annotation (feedback anchored to a
	 * specific quote in the scene, e.g. "她突然很害怕。"). Unused by the V1
	 * UI - present now so the shape doesn't need to change later.
	 */
	anchor?: string;
}

export interface HistoryEvent {
	id: string;
	label: string;
	timestamp: number;
}
