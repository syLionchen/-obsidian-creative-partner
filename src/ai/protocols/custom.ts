import { requestUrl } from "obsidian";
import { PlainMessage, ProtocolAdapter, ProviderConfig } from "./types";

/**
 * Escape hatch for anything that isn't shaped like OpenAI/Anthropic/Gemini.
 * The three built-in adapters cover the vast majority of real services
 * (practically everything either speaks OpenAI-compatible chat completions,
 * or imitates Claude's or Gemini's wire format) - but the author asked for
 * genuinely arbitrary, so this adapter is fully templated: URL, method,
 * headers and body are all user-authored strings with placeholders filled
 * in at call time, and the reply is pulled out of the parsed JSON response
 * by a user-supplied path. No vendor is hardcoded here.
 *
 * Placeholders (available in url, customHeaders, customBodyTemplate):
 *   {{apiKey}}        - raw, unescaped
 *   {{model}}         - raw, unescaped
 *   {{systemText}}    - raw system prompt text, unescaped (careful in JSON)
 *   {{systemJSON}}    - system prompt as a JSON *string literal* (quotes included)
 *   {{messagesJSON}}  - [{"role":"user"|"assistant","content":"..."}] as a JSON array literal
 *   {{lastMessageJSON}} - the latest message's content as a JSON string literal
 *
 * customResponsePath supports dot and [index] access into the parsed JSON
 * response, e.g. "choices[0].message.content" or "output.0.text".
 */
export const customAdapter: ProtocolAdapter = {
	async call(config: ProviderConfig, systemText: string, messages: PlainMessage[]): Promise<string> {
		if (!config.url) throw new Error("自定义 Provider 缺少 URL。");
		if (!config.customBodyTemplate) throw new Error("自定义 Provider 缺少请求体模板。");
		if (!config.customResponsePath) throw new Error("自定义 Provider 缺少响应取值路径。");

		const lastMessage = messages[messages.length - 1]?.content ?? "";
		const vars: Record<string, string> = {
			apiKey: config.apiKey,
			model: config.model,
			systemText,
			systemJSON: JSON.stringify(systemText),
			messagesJSON: JSON.stringify(messages.map((m) => ({ role: m.role, content: m.content }))),
			lastMessageJSON: JSON.stringify(lastMessage),
		};

		const url = fillTemplate(config.url, vars);
		const method = config.customMethod || "POST";
		const headers = parseHeaderTemplate(config.customHeaders ?? "", vars);
		const bodyText = fillTemplate(config.customBodyTemplate, vars);

		// Fail fast on a malformed template rather than sending garbage over the wire.
		try {
			JSON.parse(bodyText);
		} catch (err) {
			throw new Error(`自定义请求体模板填完占位符后不是合法 JSON: ${err instanceof Error ? err.message : err}`);
		}

		const res = await requestUrl({
			url,
			method,
			contentType: headers["Content-Type"] ? undefined : "application/json",
			headers,
			body: bodyText,
		});

		return extractPath(res.json, config.customResponsePath);
	},
};

function fillTemplate(template: string, vars: Record<string, string>): string {
	return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => vars[key] ?? "");
}

function parseHeaderTemplate(raw: string, vars: Record<string, string>): Record<string, string> {
	const headers: Record<string, string> = {};
	for (const line of raw.split("\n")) {
		const idx = line.indexOf(":");
		if (idx === -1) continue;
		const key = line.slice(0, idx).trim();
		const value = fillTemplate(line.slice(idx + 1).trim(), vars);
		if (key) headers[key] = value;
	}
	return headers;
}

function extractPath(obj: unknown, path: string): string {
	const tokens = path
		.replace(/\[(\d+)\]/g, ".$1")
		.split(".")
		.filter(Boolean);

	let cur: unknown = obj;
	for (const token of tokens) {
		if (cur == null) break;
		cur = (cur as Record<string, unknown>)[token];
	}
	if (typeof cur !== "string") {
		throw new Error(`响应路径 "${path}" 对应的值不是字符串: ${JSON.stringify(cur)?.slice(0, 300)}`);
	}
	return cur;
}
