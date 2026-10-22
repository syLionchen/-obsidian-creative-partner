import { ItemView, WorkspaceLeaf } from "obsidian";
import { countChars, getFilesByType, getFrontmatter } from "../data/vaultData";

export const HOME_VIEW_TYPE = "novelos-home";

export class HomeView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return HOME_VIEW_TYPE;
	}

	getDisplayText() {
		return "Creative Partner Home";
	}

	getIcon() {
		return "home";
	}

	async onOpen() {
		this.registerEvent(this.app.metadataCache.on("changed", () => this.render()));
		this.registerEvent(this.app.vault.on("delete", () => this.render()));
		this.registerEvent(this.app.vault.on("rename", () => this.render()));
		this.render();
	}

	private openFile(path: string) {
		this.app.workspace.openLinkText(path, "", false);
	}

	private renderLinkList(container: HTMLElement, items: { path: string; label: string }[], emptyText: string) {
		if (items.length === 0) {
			container.createEl("p", { text: emptyText, cls: "novelos-empty" });
			return;
		}
		const ul = container.createEl("ul");
		for (const item of items) {
			const li = ul.createEl("li");
			const a = li.createEl("a", { text: item.label, href: "#" });
			a.onclick = (evt) => {
				evt.preventDefault();
				this.openFile(item.path);
			};
		}
	}

	private async render() {
		const container = this.containerEl.children[1];
		container.empty();
		container.createEl("h2", { text: "Creative Partner" });

		const core = getFilesByType(this.app, "core_problem")[0];
		const endState = getFilesByType(this.app, "end_state")[0];

		const anchorSection = container.createDiv({ cls: "novelos-section" });
		anchorSection.createEl("h3", { text: "Core Problem" });
		if (core) {
			const fm = getFrontmatter(this.app, core);
			this.renderLinkList(anchorSection, [{ path: core.path, label: fm.title || core.basename }], "");
		} else {
			anchorSection.createEl("p", { text: "(未设定，见 00_Core/Core Problem.md)", cls: "novelos-empty" });
		}

		anchorSection.createEl("h3", { text: "End State" });
		if (endState) {
			const fm = getFrontmatter(this.app, endState);
			this.renderLinkList(anchorSection, [{ path: endState.path, label: fm.title || endState.basename }], "");
		} else {
			anchorSection.createEl("p", { text: "(未设定，见 00_Core/End State.md)", cls: "novelos-empty" });
		}

		const chapters = getFilesByType(this.app, "chapter").sort((a, b) => a.basename.localeCompare(b.basename));
		const counts = await Promise.all(chapters.map((f) => this.app.vault.cachedRead(f).then(countChars)));
		const totalWords = counts.reduce((a, b) => a + b, 0);

		const chaptersSection = container.createDiv({ cls: "novelos-section" });
		chaptersSection.createEl("h3", { text: `Chapters (${chapters.length}) · 共 ${totalWords} 字` });
		this.renderLinkList(
			chaptersSection,
			chapters.map((f, idx) => {
				const fm = getFrontmatter(this.app, f);
				return { path: f.path, label: `${fm.title || f.basename} [${fm.status || "no status"}] · ${counts[idx]} 字` };
			}),
			"还没有 Chapter，去 01_Chapters/ 新建一个开始写。"
		);

		const scenes = getFilesByType(this.app, "scene");
		const scenesSection = container.createDiv({ cls: "novelos-section" });
		scenesSection.createEl("h3", { text: `Scenes (${scenes.length})` });
		this.renderLinkList(
			scenesSection,
			scenes.map((f) => ({ path: f.path, label: getFrontmatter(this.app, f).title || f.basename })),
			"暂无跨章节的 Scene 卡片，见 08_Scenes/README.md。"
		);

		const questions = getFilesByType(this.app, "question").filter(
			(f) => getFrontmatter(this.app, f).status !== "resolved"
		);
		const qSection = container.createDiv({ cls: "novelos-section" });
		qSection.createEl("h3", { text: `Open Questions (${questions.length})` });
		this.renderLinkList(
			qSection,
			questions.map((f) => ({ path: f.path, label: getFrontmatter(this.app, f).title || f.basename })),
			"暂无未解决的 Question。"
		);

		const unknowns = getFilesByType(this.app, "unknown");
		const uSection = container.createDiv({ cls: "novelos-section" });
		uSection.createEl("h3", { text: `Unknowns (${unknowns.length})` });
		this.renderLinkList(
			uSection,
			unknowns.map((f) => ({ path: f.path, label: getFrontmatter(this.app, f).title || f.basename })),
			"暂无 Unknown。"
		);

		const feedback = getFilesByType(this.app, "editor_feedback");
		const fSection = container.createDiv({ cls: "novelos-section" });
		fSection.createEl("h3", { text: `Editor Feedback (${feedback.length})` });
		this.renderLinkList(
			fSection,
			feedback.map((f) => ({ path: f.path, label: f.basename })),
			"暂无 Editor Feedback。"
		);
	}

	async onClose() {}
}
