import { App, TFile } from "obsidian";
import { FeedbackItem } from "../ai/types";
import { stripFrontmatter } from "./vaultData";

const PROFILE_PATH = "00_Core/Writing Profile.md";
const REPEAT_THRESHOLD = 3;
const MARKER = "<!-- novelos:writing-profile:end-of-auto-section -->";

/**
 * The "memory closed loop" data file. Unlike 07_Editor/*.md (append-only,
 * write-only diaries - see that folder's README), this file is both
 * written AND read back: every AIEditor backend injects its body into the
 * system context on every call (see ai/context.ts). It is the one place
 * cross-chapter coaching continuity actually lives, so it survives an
 * Obsidian restart, a thread reset, or switching to a completely different
 * AI provider.
 *
 * Two zones, split by MARKER:
 *  - above: auto-generated from `pattern_counts` (tracked in frontmatter
 *    as a JSON string - plain YAML would also work but a flat JSON blob
 *    is trivial to round-trip without a YAML writer).
 *  - below: free-form author notes, preserved verbatim on every rewrite.
 *    Writing something here is effectively a persistent instruction to
 *    the AI, since it gets read back into context every time.
 */

interface ProfileState {
	counts: Record<string, number>;
	authorNotes: string;
}

async function readState(app: App): Promise<{ file: TFile | null; state: ProfileState }> {
	const abstract = app.vault.getAbstractFileByPath(PROFILE_PATH);
	if (!(abstract instanceof TFile)) {
		return { file: null, state: { counts: {}, authorNotes: "" } };
	}

	const fm = app.metadataCache.getFileCache(abstract)?.frontmatter;
	let counts: Record<string, number> = {};
	if (fm && typeof fm.pattern_counts === "string") {
		try {
			counts = JSON.parse(fm.pattern_counts);
		} catch {
			counts = {};
		}
	}

	const raw = await app.vault.cachedRead(abstract);
	const body = stripFrontmatter(raw);
	const markerIdx = body.indexOf(MARKER);
	const authorNotes = markerIdx >= 0 ? body.slice(markerIdx + MARKER.length).replace(/^\s*\n/, "") : "";

	return { file: abstract, state: { counts, authorNotes } };
}

function render(state: ProfileState): string {
	const sorted = Object.entries(state.counts).sort((a, b) => b[1] - a[1]);
	const patternLines = sorted
		.filter(([, count]) => count >= REPEAT_THRESHOLD)
		.map(
			([category, count]) =>
				`- **${category}**（累计出现 ${count} 次）— 这不是某一场戏的偶然问题，是你反复出现的写作模式，` +
				"下次动笔前可以先想一下这一点。"
		);

	const body = [
		"# Writing Profile",
		"",
		"> 由 AI Editor 自动维护：记录你在多个章节里反复出现的写作问题类别。" +
			"每次 AI Editor 分析或对话都会把这份文件读回去当上下文，所以即使换了 AI 后台，或者重启了 Obsidian，" +
			"它都不会\"失忆\"。",
		"> 「反复出现的模式」和「原始计数」两段是自动生成的，下次分析会整段覆盖，别手动改这两段。" +
			"下面 `手记` 区你可以随便写，AI Editor 不会覆盖它——写在这里的东西会被当成你给 AI 的持续性说明。",
		"",
		"## 反复出现的模式",
		"",
		patternLines.length > 0
			? patternLines.join("\n")
			: `(暂无达到阈值的重复模式——同一类问题要累计出现 ${REPEAT_THRESHOLD} 次以上才会列在这里。)`,
		"",
		"## 原始计数（调试用）",
		"",
		sorted.length > 0 ? sorted.map(([c, n]) => `- ${c}: ${n}`).join("\n") : "(暂无记录)",
		"",
		MARKER,
		state.authorNotes || "\n(这里可以写你自己的观察或给 AI 的长期说明。)\n",
	].join("\n");

	const countsJson = JSON.stringify(state.counts).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
	const frontmatter = [
		"---",
		"type: writing_profile",
		`updated: "${new Date().toISOString()}"`,
		`pattern_counts: "${countsJson}"`,
		"---",
		"",
	].join("\n");

	return `${frontmatter}\n${body}\n`;
}

/** Returns the current profile body (no frontmatter) for injecting into an AI prompt. Empty string if nothing recorded yet. */
export async function readWritingProfileBody(app: App): Promise<string> {
	const { file } = await readState(app);
	if (!file) return "";
	const raw = await app.vault.cachedRead(file);
	return stripFrontmatter(raw).trim();
}

/** Tallies each feedback item's category and rewrites the profile file. Call after every analyzeChapter(). */
export async function recordFeedback(app: App, items: FeedbackItem[]): Promise<void> {
	if (items.length === 0) return;

	const { file, state } = await readState(app);
	for (const item of items) {
		state.counts[item.category] = (state.counts[item.category] ?? 0) + 1;
	}
	const content = render(state);

	if (file) {
		await app.vault.modify(file, content);
	} else {
		if (!app.vault.getAbstractFileByPath("00_Core")) {
			await app.vault.createFolder("00_Core");
		}
		await app.vault.create(PROFILE_PATH, content);
	}
}
