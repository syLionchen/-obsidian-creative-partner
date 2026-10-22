import { App, FileSystemAdapter } from "obsidian";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { readWritingProfileBody } from "../data/writingProfile";
import { asStringArray, getFilesByType, getFrontmatter, linkTarget } from "../data/vaultData";
import { DEFAULT_METHODOLOGY } from "./defaultMethodology";

/**
 * Shared "system context" every AIEditor backend should prepend to its very
 * first prompt in a conversation. HTTP providers are stateless - there is no
 * remote thread that could remember novel-editor/SKILL.md on its own - so
 * this reads SKILL.md + the accumulated Writing Profile explicitly, every
 * time, for every backend. This is the "memory closed loop" - the only
 * persisted memory is plain files in the vault, not a remote session.
 *
 * On top of that, the author writes continuously, one Chapter file per
 * chapter - so a single chapter's text is not enough for the AI to judge
 * causality/continuity across the book. `currentChapterPath` lets this
 * function also attach a compact cross-chapter "story index" (chapter
 * list, open/resolved Questions, Characters/Entities, Scene cross-refs)
 * plus the immediately preceding chapter's full text. The index stays
 * cheap (titles/status only); only one extra chapter's prose is ever sent
 * in full, not the whole book, so cost stays bounded as the novel grows.
 */
export async function buildSystemContext(app: App, currentChapterPath?: string): Promise<string> {
	const parts: string[] = [];

	parts.push(readSkillFile(app) ?? DEFAULT_METHODOLOGY);

	const profile = await readWritingProfileBody(app);
	if (profile) parts.push(`[作者的 Writing Profile - 持续累积的写作模式]\n\n${profile}`);

	const index = buildStoryIndex(app, currentChapterPath);
	if (index) parts.push(index);

	const prevChapter = await previousChapterExcerpt(app, currentChapterPath);
	if (prevChapter) parts.push(prevChapter);

	return parts.join("\n\n---\n\n");
}

/**
 * A vault can drop its own `novel-editor/SKILL.md` to override the bundled
 * default below (e.g. a richer or more personal set of coaching principles).
 * Most vaults won't have one, so this falling through to null - and the
 * caller falling back to DEFAULT_METHODOLOGY - is the common case, not an
 * error.
 */
function readSkillFile(app: App): string | null {
	const basePath = app.vault.adapter instanceof FileSystemAdapter ? app.vault.adapter.getBasePath() : undefined;
	if (!basePath) return null;
	const skillPath = join(basePath, "novel-editor", "SKILL.md");
	if (!existsSync(skillPath)) return null;
	try {
		return readFileSync(skillPath, "utf8");
	} catch {
		return null;
	}
}

function sortedChapters(app: App) {
	return getFilesByType(app, "chapter").sort((a, b) => a.basename.localeCompare(b.basename));
}

/**
 * Cheap cross-chapter skeleton: chapter list, open/resolved Questions,
 * Characters/Entities, and the Scene registry (which chapters a recurring
 * scene touches). All of this is read fresh from frontmatter on every call
 * - no caching - so it always reflects the vault's current state. Nothing
 * here sends full prose except via previousChapterExcerpt() below.
 */
function buildStoryIndex(app: App, currentChapterPath?: string): string {
	const chapters = sortedChapters(app);
	if (chapters.length <= 1) return "";

	const lines: string[] = ["[故事索引 - 每次调用都重新读取 vault，不是缓存]", "", "## 章节列表"];
	for (const f of chapters) {
		const fm = getFrontmatter(app, f);
		const marker = f.path === currentChapterPath ? " ← 当前分析的章节" : "";
		lines.push(`- ${fm.title || f.basename}${fm.status ? ` [${fm.status}]` : ""}${marker}`);
	}

	const questions = getFilesByType(app, "question");
	const open = questions.filter((f) => getFrontmatter(app, f).status !== "resolved");
	const resolved = questions.filter((f) => getFrontmatter(app, f).status === "resolved");
	if (open.length > 0) {
		lines.push("", "## 未解决的 Question");
		for (const f of open) lines.push(`- ${getFrontmatter(app, f).title || f.basename}`);
	}
	if (resolved.length > 0) {
		lines.push("", "## 已解决的 Question");
		for (const f of resolved) lines.push(`- ${getFrontmatter(app, f).title || f.basename}`);
	}

	const entities = getFilesByType(app, "entity");
	if (entities.length > 0) {
		lines.push("", "## 人物 / 实体");
		for (const f of entities) {
			const fm = getFrontmatter(app, f);
			const label = fm.name || f.basename;
			const extra = [fm.entity_type, fm.status].filter(Boolean).join(", ");
			lines.push(`- ${label}${extra ? ` (${extra})` : ""}`);
		}
	}

	const scenes = getFilesByType(app, "scene");
	if (scenes.length > 0) {
		lines.push("", "## 场景索引（跨章节关联，见 08_Scenes/）");
		for (const f of scenes) {
			const fm = getFrontmatter(app, f);
			const chapterLinks = asStringArray(fm.chapters).map(linkTarget);
			lines.push(`- ${fm.title || f.basename}：${chapterLinks.join("、") || "(未关联章节)"}`);
		}
	}

	return lines.join("\n");
}

/** The immediately preceding chapter's full text, for verbatim near-term continuity. */
async function previousChapterExcerpt(app: App, currentChapterPath?: string): Promise<string> {
	if (!currentChapterPath) return "";
	const chapters = sortedChapters(app);
	const idx = chapters.findIndex((f) => f.path === currentChapterPath);
	if (idx <= 0) return "";

	const prev = chapters[idx - 1];
	const fm = getFrontmatter(app, prev);
	const body = await app.vault.cachedRead(prev);
	return `[上一章《${fm.title || prev.basename}》全文，供衔接参考]\n\n${body}`;
}
