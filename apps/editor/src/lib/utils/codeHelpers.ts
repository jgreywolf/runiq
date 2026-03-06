/**
 * Code Generation Helpers
 * Utilities for generating DSL code from diagram elements
 */

export interface ElementData {
	id: string | null;
	shape?: string;
	label?: string;
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
	if (item.type === 'node') {
		const shape =
			typeof item.data.shape === 'string' && item.data.shape.length > 0
				? item.data.shape
				: 'rectangle';
		const labelSource =
			typeof item.data.label === 'string' && item.data.label.length > 0
				? item.data.label
				: `Copy of ${item.id}`;
		return `shape ${newId} as @${shape} label:"${escapeLabel(labelSource)}"`;
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
	const id = element.getAttribute(`data-${type}-id`);
	const data: ElementData = { id };
	if (type === 'node') {
		const shape = element.getAttribute('data-node-shape');
		if (shape) {
			data.shape = shape;
		}
		const labelText = element.querySelector('text')?.textContent?.trim();
		if (labelText) {
			data.label = labelText;
		}
	}
	return {
		...data
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
