/** One normalized chat message, independent of any vendor's wire format. */
export interface PlainMessage {
	role: "user" | "assistant";
	content: string;
}

/**
 * Everything a protocol adapter needs to make one call. `shape` picks which
 * adapter runs; the custom* fields only matter when shape === "custom".
 * `url`/model/apiKey are reused by every shape - switching shape never loses
 * the value the user typed, and there is exactly one URL field in the
 * settings UI no matter which shape is selected. openai/anthropic/gemini
 * adapters treat it as a base (they append their own fixed endpoint path);
 * the custom adapter treats it as the full, template-filled request URL.
 */
export interface ProviderConfig {
	id: string;
	label: string;
	shape: "openai" | "anthropic" | "gemini" | "custom";
	url: string;
	model: string;
	apiKey: string;
	temperature?: number;

	/** shape === "custom" only - see protocols/custom.ts for the placeholder language. */
	customMethod?: string;
	customHeaders?: string;
	customBodyTemplate?: string;
	customResponsePath?: string;
}

export interface ProtocolAdapter {
	/** Sends systemText + the message history, returns the model's reply text (raw - callers parse JSON out of it themselves if needed). */
	call(config: ProviderConfig, systemText: string, messages: PlainMessage[]): Promise<string>;
}
