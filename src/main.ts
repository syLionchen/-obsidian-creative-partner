import { Plugin, TFile, WorkspaceLeaf } from "obsidian";
import { HOME_VIEW_TYPE, HomeView } from "./views/HomeView";
import { CHAPTER_NAV_VIEW_TYPE, ChapterNavigatorView } from "./views/ChapterNavigatorView";
import { STORY_GRAPH_VIEW_TYPE, StoryGraphView } from "./views/StoryGraphView";
import { EDITOR_PANEL_VIEW_TYPE, EditorPanelView } from "./views/EditorPanelView";
import { getFilesByType, getFrontmatter } from "./data/vaultData";
import { AIEditor } from "./ai/AIEditor";
import { MockAIEditor } from "./ai/MockAIEditor";
import { HTTPAIEditor } from "./ai/HTTPAIEditor";
import { DEFAULT_SETTINGS, CreativePartnerSettings, CreativePartnerSettingTab } from "./settings";

export default class CreativePartnerPlugin extends Plugin {
	// Single seam for the whole plugin: swap the implementation behind this
	// property for a different backend later. Nothing else needs to change -
	// every view only talks to the AIEditor interface. Views read it off the
	// plugin instance (not a value captured at construction time) so
	// switching backends in Settings takes effect without a reload.
	aiEditor: AIEditor = new MockAIEditor();
	settings: CreativePartnerSettings = DEFAULT_SETTINGS;

	async onload() {
		await this.loadSettings();
		this.aiEditor = this.createAIEditor();
		this.addSettingTab(new CreativePartnerSettingTab(this.app, this));

		this.registerView(HOME_VIEW_TYPE, (leaf) => new HomeView(leaf));
		this.registerView(CHAPTER_NAV_VIEW_TYPE, (leaf) => new ChapterNavigatorView(leaf));
		this.registerView(STORY_GRAPH_VIEW_TYPE, (leaf) => new StoryGraphView(leaf));
		this.registerView(EDITOR_PANEL_VIEW_TYPE, (leaf) => new EditorPanelView(leaf, this));

		this.registerEvent(
			this.app.vault.on("modify", (file) => {
				if (file instanceof TFile && getFrontmatter(this.app, file).type === "chapter") {
					this.aiEditor.recordAuthorEdit(file.path);
				}
			})
		);

		this.addRibbonIcon("home", "Creative Partner Home", () => this.activateView(HOME_VIEW_TYPE, "tab"));
		this.addRibbonIcon("list-ordered", "Chapter Navigator", () => this.activateView(CHAPTER_NAV_VIEW_TYPE, "tab"));
		this.addRibbonIcon("git-fork", "Story Graph", () => this.activateView(STORY_GRAPH_VIEW_TYPE, "tab"));
		this.addRibbonIcon("bot", "Creative Partner Workspace (Chapter + AI Editor)", () => this.openWorkspace());

		this.addCommand({
			id: "open-home",
			name: "Open Creative Partner Home",
			callback: () => this.activateView(HOME_VIEW_TYPE, "tab"),
		});
		this.addCommand({
			id: "open-chapter-navigator",
			name: "Open Chapter Navigator",
			callback: () => this.activateView(CHAPTER_NAV_VIEW_TYPE, "tab"),
		});
		this.addCommand({
			id: "open-story-graph",
			name: "Open Story Graph",
			callback: () => this.activateView(STORY_GRAPH_VIEW_TYPE, "tab"),
		});
		this.addCommand({
			id: "open-editor-panel",
			name: "Open AI Editor Panel",
			callback: () => this.activateView(EDITOR_PANEL_VIEW_TYPE, "right"),
		});
		this.addCommand({
			id: "open-workspace",
			name: "Open Creative Partner Workspace (Chapter + AI Editor)",
			callback: async () => this.openWorkspace(),
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	/** Re-reads settings.activeBackend and swaps this.aiEditor. Safe to call any time - views always read aiEditor off the plugin instance, never cache it. */
	rebuildAIEditor(): void {
		this.aiEditor = this.createAIEditor();
	}

	/**
	 * Picks the backend named by settings.activeBackend:
	 *  - "mock": MockAIEditor (no network).
	 *  - anything else: looked up in settings.providers by id and handed to
	 *    HTTPAIEditor - this is the bring-your-own-API seam, and the only
	 *    real backend this plugin ships (no local-CLI integration, since
	 *    that can't be made to work the same way on every machine).
	 * Falls back to MockAIEditor on any misconfiguration so the plugin
	 * never fails to load over an AI backend problem.
	 */
	private createAIEditor(): AIEditor {
		const backend = this.settings.activeBackend;

		if (backend === "mock") return new MockAIEditor();

		const provider = this.settings.providers.find((p) => p.id === backend);
		if (provider) return new HTTPAIEditor(this.app, provider);

		return new MockAIEditor();
	}

	/** Lays out the left/right split described in the design: a Chapter open
	 * in the main editor, AI Editor panel on the right. */
	async openWorkspace() {
		const { workspace } = this.app;
		let file = workspace.getActiveFile();
		if (!file || getFrontmatter(this.app, file).type !== "chapter") {
			const chapters = getFilesByType(this.app, "chapter").sort((a, b) => a.basename.localeCompare(b.basename));
			file = chapters[0] ?? null;
		}
		if (file) {
			await workspace.getLeaf("tab").openFile(file);
		}
		await this.activateView(EDITOR_PANEL_VIEW_TYPE, "right");
	}

	async activateView(viewType: string, placement: "tab" | "right") {
		const { workspace } = this.app;
		let leaf: WorkspaceLeaf | null = workspace.getLeavesOfType(viewType)[0] ?? null;
		if (!leaf) {
			leaf = placement === "right" ? workspace.getRightLeaf(false) : workspace.getLeaf("tab");
			if (leaf) await leaf.setViewState({ type: viewType, active: true });
		}
		if (leaf) workspace.revealLeaf(leaf);
	}
}
