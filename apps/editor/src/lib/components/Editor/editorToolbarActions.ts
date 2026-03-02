export function applyThemeToDsl(code: string, themeId: string): string {
	const lines = code.split('\n');
	if (lines.length === 0) return code;

	if (lines.length > 1 && lines[1].trim().startsWith('theme ')) {
		lines[1] = `  theme ${themeId}`;
	} else {
		lines.splice(1, 0, `  theme ${themeId}`);
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

