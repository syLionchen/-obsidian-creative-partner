import { App, PluginSettingTab, Setting } from "obsidian";
import type CreativePartnerPlugin from "./main";
import { ProviderConfig } from "./ai/protocols/types";

/** "mock" | a ProviderConfig.id */
export type ActiveBackend = string;

export interface CreativePartnerSettings {
	activeBackend: ActiveBackend;
	providers: ProviderConfig[];
}

export const DEFAULT_SETTINGS: CreativePartnerSettings = {
	activeBackend: "mock",
	providers: [],
};

/**
 * Only the wire-format shapes are listed here - these are real, mutually
 * incompatible HTTP protocols, not vendor preferences. There is no vendor
 * list and no default URL/model: whoever this API belongs to, the user
 * supplies every value themselves. Picking a shape only decides which
 * adapter runs and how the URL field below gets interpreted.
 */
const SHAPE_OPTIONS: { value: ProviderConfig["shape"]; label: string }[] = [
	{ value: "openai", label: "OpenAI 兼容格式 (/chat/completions)" },
	{ value: "anthropic", label: "Anthropic 格式 (/v1/messages, 如 Claude)" },
	{ value: "gemini", label: "Gemini 格式 (generateContent)" },
	{ value: "custom", label: "完全自定义（任意 URL / 请求体 / 响应路径）" },
];

function newProviderId(): string {
	return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function urlFieldDesc(shape: ProviderConfig["shape"]): string {
	switch (shape) {
		case "openai":
			return "不带 /chat/completions 末尾路径，例如 https://api.deepseek.com/v1，adapter 会自动拼接。";
		case "anthropic":
			return "不带 /v1/messages 末尾路径，例如 https://api.anthropic.com，adapter 会自动拼接。";
		case "gemini":
			return "不带 /v1beta/models/... 末尾路径，例如 https://generativelanguage.googleapis.com，adapter 会自动拼接。";
		case "custom":
			return "完整请求地址，原样发送，不会自动拼接任何路径；支持占位符 {{apiKey}} {{model}} 等。";
	}
}

export class CreativePartnerSettingTab extends PluginSettingTab {
	constructor(app: App, private plugin: CreativePartnerPlugin) {
		super(app, plugin);
	}

	display(): void {
		this.render();
	}

	private render(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", { text: "Creative Partner: AI Editor 后台" });
		containerEl.createEl("p", {
			text:
				"选哪个后台只影响「大脑」怎么产生反馈，不影响 AI Editor 的硬约束——任何后台都只读 Chapter 文件来拼 prompt" +
				"（Scene 只作为跨章节的轻量索引附带提供），永远不会写入正文。换后台后需要重新打开一次 AI Editor 面板才会生效。",
			cls: "setting-item-description",
		});

		this.renderBackendPicker(containerEl);

		containerEl.createEl("h3", { text: "Provider 列表" });
		containerEl.createEl("p", {
			text:
				"每个 Provider 对应一个 URL + API Key + 一种请求格式。插件不预设任何厂商、模型或网址——" +
				"选一种请求格式（协议），其余全部自己填。API Key 存在本插件的本地 data.json 里，不会被 git 提交。",
			cls: "setting-item-description",
		});

		for (const provider of this.plugin.settings.providers) {
			this.renderProviderEditor(containerEl, provider);
		}

		this.renderAddProvider(containerEl);
	}

	private async save(): Promise<void> {
		await this.plugin.saveSettings();
		this.plugin.rebuildAIEditor();
	}

	private renderBackendPicker(containerEl: HTMLElement): void {
		new Setting(containerEl)
			.setName("当前使用的后台")
			.setDesc("Mock 用于不联网测试，不花钱；真正要用 AI 反馈，请在下面加一个 Provider 并在这里选中它。")
			.addDropdown((dropdown) => {
				dropdown.addOption("mock", "Mock（假数据，不联网）");
				for (const provider of this.plugin.settings.providers) {
					dropdown.addOption(provider.id, `${provider.label} (${shapeLabel(provider.shape)})`);
				}
				dropdown.setValue(this.plugin.settings.activeBackend);
				dropdown.onChange(async (value) => {
					this.plugin.settings.activeBackend = value;
					await this.save();
				});
			});
	}

	private renderAddProvider(containerEl: HTMLElement): void {
		let selectedShape: ProviderConfig["shape"] = "openai";
		new Setting(containerEl)
			.setName("新增 Provider")
			.setDesc("选这个 API 说的是哪种协议——不是选厂商，URL/Model/Key 都留空，添加后自己填。")
			.addDropdown((dropdown) => {
				for (const opt of SHAPE_OPTIONS) dropdown.addOption(opt.value, opt.label);
				dropdown.setValue(selectedShape);
				dropdown.onChange((value) => (selectedShape = value as ProviderConfig["shape"]));
			})
			.addButton((button) =>
				button
					.setButtonText("添加")
					.setCta()
					.onClick(async () => {
						const provider: ProviderConfig = {
							id: newProviderId(),
							label: "新 Provider",
							shape: selectedShape,
							url: "",
							model: "",
							apiKey: "",
							customMethod: "POST",
							customHeaders: "",
							customBodyTemplate: "",
							customResponsePath: "",
						};
						this.plugin.settings.providers.push(provider);
						await this.save();
						this.render();
					})
			);
	}

	private renderProviderEditor(containerEl: HTMLElement, provider: ProviderConfig): void {
		const details = containerEl.createEl("details", { cls: "novelos-provider-editor" });
		details.createEl("summary", { text: `${provider.label} (${shapeLabel(provider.shape)})` });

		new Setting(details).setName("名称").addText((text) =>
			text.setValue(provider.label).onChange(async (value) => {
				provider.label = value;
				await this.save();
			})
		);

		new Setting(details).setName("请求格式").addDropdown((dropdown) => {
			for (const opt of SHAPE_OPTIONS) dropdown.addOption(opt.value, opt.label);
			dropdown.setValue(provider.shape);
			dropdown.onChange(async (value) => {
				provider.shape = value as ProviderConfig["shape"];
				await this.save();
				this.render();
			});
		});

		new Setting(details)
			.setName("URL")
			.setDesc(urlFieldDesc(provider.shape))
			.addText((text) =>
				text.setValue(provider.url).onChange(async (value) => {
					provider.url = value;
					await this.save();
				})
			);
		if (!provider.url) {
			details.createEl("p", {
				text: "⚠ URL 为空，这个 Provider 还不能用。",
				cls: "setting-item-description novelos-provider-warning",
			});
		}

		new Setting(details).setName("Model").addText((text) =>
			text.setValue(provider.model).onChange(async (value) => {
				provider.model = value;
				await this.save();
			})
		);
		if (!provider.model && provider.shape !== "custom") {
			details.createEl("p", {
				text: "⚠ Model 为空，这个 Provider 还不能用。",
				cls: "setting-item-description novelos-provider-warning",
			});
		}

		new Setting(details).setName("API Key").addText((text) => {
			text.inputEl.type = "password";
			text.setValue(provider.apiKey).onChange(async (value) => {
				provider.apiKey = value;
				await this.save();
			});
		});

		if (provider.shape === "custom") {
			this.renderCustomFields(details, provider);
		}

		new Setting(details).addButton((button) =>
			button
				.setButtonText("删除这个 Provider")
				.setWarning()
				.onClick(async () => {
					this.plugin.settings.providers = this.plugin.settings.providers.filter((p) => p.id !== provider.id);
					if (this.plugin.settings.activeBackend === provider.id) {
						this.plugin.settings.activeBackend = "mock";
					}
					await this.save();
					this.render();
				})
		);
	}

	private renderCustomFields(details: HTMLElement, provider: ProviderConfig): void {
		details.createEl("p", {
			text:
				"占位符（URL、Headers、Body 都能用）：{{apiKey}} {{model}} {{systemText}} {{systemJSON}} {{messagesJSON}} {{lastMessageJSON}}。" +
				"Body 填完占位符后必须是合法 JSON。",
			cls: "setting-item-description",
		});

		new Setting(details).setName("Method").addText((text) =>
			text.setValue(provider.customMethod ?? "POST").onChange(async (value) => {
				provider.customMethod = value;
				await this.save();
			})
		);

		new Setting(details).setName("Headers").setDesc("一行一个，格式 Key: Value。").addTextArea((text) => {
			text.inputEl.rows = 3;
			text.setValue(provider.customHeaders ?? "").onChange(async (value) => {
				provider.customHeaders = value;
				await this.save();
			});
		});

		new Setting(details).setName("请求体模板（JSON）").addTextArea((text) => {
			text.inputEl.rows = 5;
			text.setValue(provider.customBodyTemplate ?? "").onChange(async (value) => {
				provider.customBodyTemplate = value;
				await this.save();
			});
		});

		new Setting(details)
			.setName("响应取值路径")
			.setDesc('例如 choices[0].message.content 或 candidates[0].content.parts[0].text')
			.addText((text) =>
				text.setValue(provider.customResponsePath ?? "").onChange(async (value) => {
					provider.customResponsePath = value;
					await this.save();
				})
			);
	}
}

function shapeLabel(shape: ProviderConfig["shape"]): string {
	switch (shape) {
		case "openai":
			return "OpenAI 兼容";
		case "anthropic":
			return "Anthropic/Claude 格式";
		case "gemini":
			return "Gemini 格式";
		case "custom":
			return "自定义";
	}
}
