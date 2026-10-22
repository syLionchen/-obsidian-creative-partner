import { requestUrl } from "obsidian";
import { PlainMessage, ProtocolAdapter, ProviderConfig } from "./types";

/**
 * OpenAI-compatible /chat/completions. This single adapter covers most of
 * the market as-is - OpenAI, DeepSeek, Moonshot/Kimi, Qwen/DashScope,
 * Groq, Together, local Ollama/LM Studio/vLLM - because they all imitate
 * this exact wire format. Only url/model/apiKey change between them, and
 * none of those are hardcoded here - the user supplies all three.
 *
 * Deliberately does NOT rely on provider-specific structured-output
 * features (response_format json_schema) - support for that is
 * inconsistent across this list. Callers that need JSON instead instruct
 * the model via the prompt and parse leniently.
 */
export const openaiAdapter: ProtocolAdapter = {
	async call(config: ProviderConfig, systemText: string, messages: PlainMessage[]): Promise<string> {
		const url = `${config.url.replace(/\/$/, "")}/chat/completions`;
		const body = {
			model: config.model,
			temperature: config.temperature,
			messages: [
				...(systemText ? [{ role: "system", content: systemText }] : []),
				...messages.map((m) => ({ role: m.role, content: m.content })),
			],
		};

		const res = await requestUrl({
			url,
			method: "POST",
			contentType: "application/json",
			headers: { Authorization: `Bearer ${config.apiKey}` },
			body: JSON.stringify(body),
		});

		const text = res.json?.choices?.[0]?.message?.content;
		if (typeof text !== "string") {
			throw new Error(`OpenAI 兼容响应里没找到 choices[0].message.content: ${res.text.slice(0, 300)}`);
		}
		return text;
	},
};
