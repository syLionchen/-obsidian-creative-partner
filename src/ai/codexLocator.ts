import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";

/**
 * The codex.exe bundled with the OpenAI Codex desktop app lives under a
 * version-hashed folder that changes on every app update
 * (%LOCALAPPDATA%\OpenAI\Codex\bin\<hash>\codex.exe) - there is no stable
 * path to hardcode. This picks the most recently modified codex.exe found
 * under the known install location.
 */
export function locateCodexExe(): string | null {
	const localAppData = process.env.LOCALAPPDATA;
	if (!localAppData) return null;

	const binDir = join(localAppData, "OpenAI", "Codex", "bin");
	if (!existsSync(binDir)) return null;

	const candidates: string[] = [];
	for (const entry of readdirSync(binDir)) {
		const exePath = join(binDir, entry, "codex.exe");
		if (existsSync(exePath)) candidates.push(exePath);
	}
	if (candidates.length === 0) return null;

	candidates.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
	return candidates[0];
}
