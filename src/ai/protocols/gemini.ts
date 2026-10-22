import { requestUrl } from "obsidian";
import { PlainMessage, ProtocolAdapter, ProviderConfig } from "./types";

/** Google Gemini generateContent API. url e.g. https://generativelanguage.googleapis.com */
export const geminiAdapter: ProtocolAdapter = {
	async call(config: ProviderConfig, systemText: string, messages: PlainMessage[]): Promise<string> {
		const url =
			`${config.url.replace(/\/$/, "")}/v1beta/models/${encodeURIComponent(config.model)}:generateContent` +
			`?key=${encodeURIComponent(config.apiKey)}`;

		const body = {
			systemInstruction: systemText ? { parts: [{ text: systemText }] } : undefined,
			contents: messages.map((m) => ({
				role: m.role === "assistant" ? "model" : "user",
				parts: [{ text: m.content }],
			})),
			generationConfig: config.temperature !== undefined ? { temperature: config.temperature } : undefined,
		};

		const res = await requestUrl({
			url,
			method: "POST",
			contentType: "application/json",
			body: JSON.stringify(body),
		});

		const text = res.json?.candidates?.[0]?.content?.parts?.[0]?.text;
		if (typeof text !== "string") {
			throw new Error(`Gemini 响应里没找到 candidates[0].content.parts[0].text: ${res.text.slice(0, 300)}`);
		}
		return text;
	},
};
