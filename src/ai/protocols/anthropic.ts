import { requestUrl } from "obsidian";
import { PlainMessage, ProtocolAdapter, ProviderConfig } from "./types";

/** Anthropic Messages API (Claude). url e.g. https://api.anthropic.com */
export const anthropicAdapter: ProtocolAdapter = {
	async call(config: ProviderConfig, systemText: string, messages: PlainMessage[]): Promise<string> {
		const url = `${config.url.replace(/\/$/, "")}/v1/messages`;
		const body = {
			model: config.model,
			max_tokens: 4096,
			temperature: config.temperature,
			system: systemText || undefined,
			messages: messages.map((m) => ({ role: m.role, content: m.content })),
		};

		const res = await requestUrl({
			url,
			method: "POST",
			contentType: "application/json",
			headers: {
				"x-api-key": config.apiKey,
				"anthropic-version": "2023-06-01",
			},
			body: JSON.stringify(body),
		});

		const blocks = res.json?.content;
		const text = Array.isArray(blocks)
			? blocks
					.filter((b: any) => b?.type === "text")
					.map((b: any) => b.text)
					.join("")
			: undefined;
		if (typeof text !== "string" || !text) {
			throw new Error(`Claude 响应里没找到 content[].text: ${res.text.slice(0, 300)}`);
		}
		return text;
	},
};
