/**
 * Attempts to repair mojibake where UTF-8 text was interpreted as Latin-1.
 * Returns the original string if no repair was needed or decoding fails.
 */
export function repairMojibake(value: string): string {
	if (!value) return value;

	// Quick guard: skip work when we do not detect common mojibake markers.
	if (!/[ÃÂâð]/.test(value)) {
		return value;
	}

	try {
		const bytes = new Uint8Array(value.length);
		for (let i = 0; i < value.length; i += 1) {
			bytes[i] = value.charCodeAt(i) & 0xff;
		}
		return new TextDecoder('utf-8').decode(bytes);
	} catch {
		return value;
	}
}

