/**
 * Diagram Profile Shape Icons
 * SVG icon definitions for diagram profile shapes
 */

export const diagramShapeIcons: Record<string, string> = {
	// Special icons (not in shape registry)
	container: '📦',
	containerStyled: '📦',
	group: '🗂️'
};

/**
 * Check if an ID should use a diagram shape icon
 */
export function isDiagramSpecialIcon(shapeId: string): boolean {
	return shapeId in diagramShapeIcons;
}

/**
 * Get diagram shape icon SVG
 */
export function getDiagramShapeIcon(shapeId: string, size: number): string | null {
	const icon = diagramShapeIcons[shapeId];
	if (!icon) return null;

	return `<svg width="${size}" height="${size}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" style="display: block;"><text x="20" y="28" text-anchor="middle" font-size="24">${icon}</text></svg>`;
}
