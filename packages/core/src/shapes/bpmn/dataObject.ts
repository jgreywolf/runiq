import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

/**
 * BPMN Data Object shape - represents information or data used in a process.
 * Rendered as a document with a folded corner.
 */
export const bpmnDataObjectShape: ShapeDefinition = {
	id: 'bpmnDataObject',

	bounds(ctx: ShapeRenderContext) {
		const padding = ctx.style.padding || 12;
		const labelMetrics = ctx.measureText(ctx.node.label || '', ctx.style);

		const minWidth = 60;
		const minHeight = 80;

		const width = Math.max(minWidth, labelMetrics.width + padding * 2);
		const height = Math.max(minHeight, labelMetrics.height + padding * 3);

		return { width, height };
	},

	anchors(ctx: ShapeRenderContext) {
		const bounds = this.bounds(ctx);
		const halfWidth = bounds.width / 2;
		const halfHeight = bounds.height / 2;

		return [
			{ x: halfWidth, y: 0, name: 'top' },
			{ x: bounds.width, y: halfHeight, name: 'right' },
			{ x: halfWidth, y: bounds.height, name: 'bottom' },
			{ x: 0, y: halfHeight, name: 'left' }
		];
	},

	render(ctx: ShapeRenderContext, position: { x: number; y: number }) {
		const bounds = this.bounds(ctx);
		const { x, y } = position;

		const fill = ctx.style.fill || '#ffffff';
		const stroke = ctx.style.stroke || '#000000';
		const strokeWidth = ctx.style.strokeWidth || 1.5;

		const foldSize = 12; // Size of the folded corner

		// Document shape with folded corner
		const path = `
			M ${x},${y}
			L ${x + bounds.width - foldSize},${y}
			L ${x + bounds.width},${y + foldSize}
			L ${x + bounds.width},${y + bounds.height}
			L ${x},${y + bounds.height}
			Z
		`.trim();

		const foldLine = `M ${x + bounds.width - foldSize},${y} L ${x + bounds.width},${y + foldSize}`;

		let svg = `<path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
		svg += `<path d="${foldLine}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;

		// Label (centered)
		const label = ctx.node.label || '';
		const textX = x + bounds.width / 2;
		const textY = y + bounds.height / 2 + (ctx.style.fontSize || 14) / 3;
		svg += `<text x="${textX}" y="${textY}" text-anchor="middle" font-family="${ctx.style.fontFamily || 'Arial'}" font-size="${ctx.style.fontSize || 14}" fill="#000000">${label}</text>`;

		return svg;
	}
};
