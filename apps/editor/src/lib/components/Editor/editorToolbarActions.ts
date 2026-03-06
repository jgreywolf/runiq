export function applyThemeToDsl(code: string, themeId: string): string {
	const lines = code.split('\n');
	if (lines.length === 0) return code;
	const themeLine = `  theme ${themeId}`;

	// Find the top-level profile declaration opening line (first "{").
	const rootStartIndex = lines.findIndex((line) => line.includes('{'));
	if (rootStartIndex < 0) return code;

	// Track top-level depth to find an existing top-level theme directive.
	let depth = 0;
	let existingThemeIndex = -1;
	for (let i = rootStartIndex; i < lines.length; i += 1) {
		const line = lines[i];
		const trimmed = line.trim();
		if (i > rootStartIndex && depth === 1 && trimmed.startsWith('theme ')) {
			existingThemeIndex = i;
			break;
		}

		for (const char of line) {
			if (char === '{') depth += 1;
			if (char === '}') depth -= 1;
		}
		if (i > rootStartIndex && depth <= 0) break;
	}

	if (existingThemeIndex >= 0) {
		lines[existingThemeIndex] = themeLine;
	} else {
		lines.splice(rootStartIndex + 1, 0, themeLine);
	}

	return lines.join('\n');
}

export interface SvgDimensions {
	width: number;
	height: number;
}

export function extractSvgDimensions(svgOutput: string): SvgDimensions | null {
	const parser = new DOMParser();
	const svgDoc = parser.parseFromString(svgOutput, 'image/svg+xml');
	const svgElement = svgDoc.querySelector('svg');
	if (!svgElement) return null;

	let width = 0;
	let height = 0;
	const viewBox = svgElement.getAttribute('viewBox');
	if (viewBox) {
		const [, , w, h] = viewBox.split(' ').map(Number);
		width = w;
		height = h;
	} else {
		width = parseFloat(svgElement.getAttribute('width') || '0');
		height = parseFloat(svgElement.getAttribute('height') || '0');
	}

	if (width <= 0 || height <= 0) return null;
	return { width, height };
}
