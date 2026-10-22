import { ItemView, WorkspaceLeaf } from "obsidian";
import { asStringArray, getFilesByType, getFrontmatter, linkTarget } from "../data/vaultData";

export const STORY_GRAPH_VIEW_TYPE = "novelos-story-graph";

/**
 * Deliberately the simplest possible version: a grouped list of
 * chapter -> character/entity/question links, built by reading frontmatter.
 * No graph-drawing library, no layout algorithm - just enough to see how
 * things connect. Can be replaced with a real visual graph later without
 * touching how chapters/entities are authored.
 */
export class StoryGraphView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return STORY_GRAPH_VIEW_TYPE;
	}

	getDisplayText() {
		return "Story Graph";
	}

	getIcon() {
		return "git-fork";
	}

	async onOpen() {
		this.registerEvent(this.app.metadataCache.on("changed", () => this.render()));
		this.registerEvent(this.app.vault.on("delete", () => this.render()));
		this.registerEvent(this.app.vault.on("rename", () => this.render()));
		this.render();
	}

	private link(container: HTMLElement, label: string, path?: string) {
		if (!path) {
			container.createSpan({ text: label });
			return;
		}
		const a = container.createEl("a", { text: label, href: "#" });
		a.onclick = (evt) => {
			evt.preventDefault();
			this.app.workspace.openLinkText(path, "", false);
		};
	}

	private render() {
		const container = this.containerEl.children[1];
		container.empty();
		container.createEl("h2", { text: "Story Graph" });
		container.createEl("p", {
			text: "按 Chapter 分组显示关联的人物 / 实体 / Question；下方另列 Scene 索引跨章节的关联。",
			cls: "novelos-empty",
		});

		const chapters = getFilesByType(this.app, "chapter").sort((a, b) => a.basename.localeCompare(b.basename));
		const entityByName = new Map(
			getFilesByType(this.app, "entity").map((f) => [f.basename, f])
		);
		const questionByName = new Map(
			getFilesByType(this.app, "question").map((f) => [f.basename, f])
		);

		if (chapters.length === 0) {
			container.createEl("p", { text: "还没有 Chapter。", cls: "novelos-empty" });
		}

		for (const chapter of chapters) {
			const fm = getFrontmatter(this.app, chapter);
			const block = container.createDiv({ cls: "novelos-graph-block" });
			const heading = block.createEl("h4");
			this.link(heading, fm.title || chapter.basename, chapter.path);

			const linked: string[] = [
				...asStringArray(fm.characters),
				...asStringArray(fm.entities),
			].map(linkTarget);
			const question = fm.question ? linkTarget(fm.question) : null;

			const ul = block.createEl("ul");
			if (question) {
				const li = ul.createEl("li");
				li.createSpan({ text: "Question: " });
				this.link(li, question, questionByName.get(question)?.path);
			}
			for (const name of linked) {
				const li = ul.createEl("li");
				li.createSpan({ text: "Entity: " });
				this.link(li, name, entityByName.get(name)?.path);
			}
			if (!question && linked.length === 0) {
				ul.createEl("li", { text: "(暂无关联)", cls: "novelos-empty" });
			}
		}

		this.renderSceneIndex(container, chapterByName(chapters));
	}

	private renderSceneIndex(container: Element, chapterByBasename: Map<string, { path: string; title: string }>) {
		const scenes = getFilesByType(this.app, "scene").sort((a, b) => a.basename.localeCompare(b.basename));
		container.createEl("h3", { text: "Scenes（跨章节关联）" });
		if (scenes.length === 0) {
			container.createEl("p", { text: "还没有 Scene 卡片，见 08_Scenes/README.md。", cls: "novelos-empty" });
			return;
		}

		for (const scene of scenes) {
			const fm = getFrontmatter(this.app, scene);
			const block = container.createDiv({ cls: "novelos-graph-block" });
			const heading = block.createEl("h4");
			this.link(heading, fm.title || scene.basename, scene.path);

			const chapterLinks = asStringArray(fm.chapters).map(linkTarget);
			const ul = block.createEl("ul");
			if (chapterLinks.length === 0) {
				ul.createEl("li", { text: "(未关联章节)", cls: "novelos-empty" });
			}
			for (const name of chapterLinks) {
				const li = ul.createEl("li");
				li.createSpan({ text: "Chapter: " });
				this.link(li, name, chapterByBasename.get(name)?.path);
			}
		}
	}

	async onClose() {}
}

function chapterByName(chapters: { path: string; basename: string }[]): Map<string, { path: string; title: string }> {
	return new Map(chapters.map((f) => [f.basename, { path: f.path, title: f.basename }]));
}
