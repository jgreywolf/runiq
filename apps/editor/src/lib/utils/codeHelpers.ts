/**
 * Code Generation Helpers
 * Utilities for generating DSL code from diagram elements
 */

export interface ElementData {
	id: string | null;
	// Additional properties will be added as needed
	[key: string]: unknown;
}

export interface ClipboardItem {
	type: 'node' | 'edge';
	id: string;
	data: ElementData;
}

/**
 * Generate DSL code for a shape/element
 * @param item - The clipboard item containing element data
 * @param newId - The new ID for the generated shape
 * @returns DSL code string
 */
export function generateShapeCode(item: ClipboardItem, newId: string): string {
	// This is a simplified version - in a real implementation,
	// you would generate proper DSL syntax based on the element's properties
	if (item.type === 'node') {
		return `shape ${newId} as @rectangle label:"Copy of ${item.id}"`;
	} else {
		return `${item.id} -> ${newId}`;
	}
}

/**
 * Extract element data from SVG element
 * @param element - The SVG element
 * @param type - The type of element ('node' or 'edge')
 * @returns Element data object
 */
export function extractElementData(element: Element, type: 'node' | 'edge'): ElementData {
	// This is a simplified version - in a real implementation,
	// you would extract all the node/edge properties from the AST
	return {
		id: element.getAttribute(`data-${type}-id`)
		// Additional properties would be extracted here
	};
}

/**
 * Escape special characters in labels
 * @param label - The label text to escape
 * @returns Escaped label text
 */
export function escapeLabel(label: string): string {
	return label
		.replace(/\\/g, '\\\\') // Escape backslashes
		.replace(/"/g, '\\"') // Escape quotes
		.replace(/\n/g, '\\n'); // Escape newlines
}

/**
 * Format a property value for DSL output
 * @param value - The property value
 * @returns Formatted string value
 */
export function formatPropertyValue(value: unknown): string {
	if (typeof value === 'string') {
		return `"${escapeLabel(value)}"`;
	}
	if (typeof value === 'number') {
		return String(value);
	}
	if (typeof value === 'boolean') {
		return value ? 'true' : 'false';
	}
	return String(value);
}
