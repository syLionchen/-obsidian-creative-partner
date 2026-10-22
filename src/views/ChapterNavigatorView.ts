import { ItemView, WorkspaceLeaf } from "obsidian";
import { countChars, getFilesByType, getFrontmatter } from "../data/vaultData";

export const CHAPTER_NAV_VIEW_TYPE = "novelos-chapter-navigator";

export class ChapterNavigatorView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return CHAPTER_NAV_VIEW_TYPE;
	}

	getDisplayText() {
		return "Chapter Navigator";
	}

	getIcon() {
		return "list-ordered";
	}

	async onOpen() {
		this.registerEvent(this.app.metadataCache.on("changed", () => this.render()));
		this.registerEvent(this.app.vault.on("delete", () => this.render()));
		this.registerEvent(this.app.vault.on("rename", () => this.render()));
		this.render();
	}

	private async render() {
		const container = this.containerEl.children[1];
		container.empty();
		container.createEl("h2", { text: "Chapter Navigator" });

		const chapters = getFilesByType(this.app, "chapter").sort((a, b) => a.basename.localeCompare(b.basename));

		if (chapters.length === 0) {
			container.createEl("p", { text: "还没有 Chapter，去 01_Chapters/ 新建一个开始写。", cls: "novelos-empty" });
			return;
		}

		const counts = await Promise.all(chapters.map((f) => this.app.vault.cachedRead(f).then(countChars)));

		const table = container.createEl("table", { cls: "novelos-scene-table" });
		const head = table.createEl("tr");
		head.createEl("th", { text: "#" });
		head.createEl("th", { text: "Title" });
		head.createEl("th", { text: "Status" });
		head.createEl("th", { text: "POV" });
		head.createEl("th", { text: "字数" });

		chapters.forEach((f, idx) => {
			const fm = getFrontmatter(this.app, f);
			const row = table.createEl("tr");
			row.createEl("td", { text: String(idx + 1) });
			const titleCell = row.createEl("td");
			const a = titleCell.createEl("a", { text: fm.title || f.basename, href: "#" });
			a.onclick = (evt) => {
				evt.preventDefault();
				this.app.workspace.openLinkText(f.path, "", false);
			};
			row.createEl("td", { text: fm.status || "" });
			row.createEl("td", { text: fm.pov || "" });
			row.createEl("td", { text: String(counts[idx]) });
		});

		const total = counts.reduce((a, b) => a + b, 0);
		container.createEl("p", { text: `全书共 ${chapters.length} 章 / ${total} 字`, cls: "novelos-empty" });
	}

	async onClose() {}
}
