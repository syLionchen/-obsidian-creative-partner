import { App, TFile } from "obsidian";

/**
 * Thin read layer over the vault. NovelOS keeps no database of its own in
 * V1 - it reads frontmatter live from Obsidian's metadataCache every time.
 * This is the only place that should know how to reach into the cache, so
 * a future index/cache can be introduced here without touching the views.
 */

export function getFrontmatter(app: App, file: TFile): Record<string, any> {
	return app.metadataCache.getFileCache(file)?.frontmatter ?? {};
}

export function getFilesByType(app: App, type: string): TFile[] {
	return app.vault
		.getMarkdownFiles()
		.filter((f) => getFrontmatter(app, f).type === type);
}

export function asStringArray(value: unknown): string[] {
	if (!value) return [];
	if (Array.isArray(value)) return value.map((v) => String(v));
	return [String(value)];
}

/** Strips [[wikilink]] / [[wikilink|alias]] syntax down to the link target. */
export function linkTarget(raw: string): string {
	const m = raw.match(/^\[\[([^\]|]+)/);
	return m ? m[1] : raw;
}

/** Strips a leading YAML frontmatter block (--- ... ---), if present. */
export function stripFrontmatter(raw: string): string {
	if (!raw.startsWith("---")) return raw;
	const end = raw.indexOf("\n---", 3);
	if (end === -1) return raw;
	return raw.slice(end + 4).replace(/^\s*\n/, "");
}

/**
 * Chinese-novel-style 字数: frontmatter stripped, then every non-whitespace
 * character counted (punctuation included, same convention most Chinese
 * writing tools use) - a plain Latin "word count" would undercount CJK text
 * that has no spaces between characters.
 */
export function countChars(raw: string): number {
	return stripFrontmatter(raw).replace(/\s/g, "").length;
}
