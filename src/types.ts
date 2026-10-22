/**
 * V1 data model. These mirror the frontmatter fields documented in
 * .novelos/schema/*.md. All fields are optional on purpose: the vault's
 * Markdown files are the source of truth, and writers should never be
 * blocked by an "incomplete" frontmatter block.
 */

export type CreativePartnerType =
	| "core_problem"
	| "end_state"
	| "chapter"
	| "scene"
	| "entity"
	| "question"
	| "unknown"
	| "resolution"
	| "editor_feedback";

/** The actual writing unit: one file per chapter, written continuously. */
export interface ChapterFrontmatter {
	type: "chapter";
	title?: string;
	status?: string;
	pov?: string;
	question?: string;
	purpose?: string;
	characters?: string[];
	entities?: string[];
}

/**
 * A lightweight connector card, not a prose container - links together the
 * chapters where the same in-story scene/beat recurs. Most scenes only ever
 * appear in one chapter and never need one of these; create one only when a
 * scene is worth tracking across chapters.
 */
export interface SceneFrontmatter {
	type: "scene";
	title?: string;
	chapters?: string[];
	characters?: string[];
	entities?: string[];
}

export interface EntityFrontmatter {
	type: "entity";
	entity_type?: string;
	name?: string;
	status?: string;
	first_appearance?: string;
}

export interface QuestionFrontmatter {
	type: "question";
	title?: string;
	status?: string;
	related_scenes?: string[];
	resolution?: string;
}

export interface UnknownFrontmatter {
	type: "unknown";
	title?: string;
	status?: string;
	first_appearance?: string;
	notes?: string;
}

export interface ResolutionFrontmatter {
	type: "resolution";
	title?: string;
	resolves?: string;
	scene?: string;
}

export interface CoreFrontmatter {
	type: "core_problem" | "end_state";
	title?: string;
}
