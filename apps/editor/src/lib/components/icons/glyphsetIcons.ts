import { glyphsetShapeIcons } from './glyphsetIconData';

export { glyphsetShapeIcons };

/**
 * Check if an ID is a glyphset shape
 */
export function isGlyphsetShape(shapeId: string): boolean {
	return shapeId in glyphsetShapeIcons;
}

/**
 * Get glyphset shape icon SVG
 */
export function getGlyphsetShapeIcon(shapeId: string, size: number): string | null {
	const icon = glyphsetShapeIcons[shapeId];
	if (!icon) {
		return null;
	}

	const svgResult = `
		<svg 
			width="${size}" 
			height="${size}" 
			viewBox="0 0 40 40"
			xmlns="http://www.w3.org/2000/svg"
			style="display: block;"
		>
			${icon}
		</svg>
	`;

	return svgResult;
}
