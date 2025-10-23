import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

/**
 * BPMN Message shape - represents a message being sent or received.
 * Rendered as an envelope.
 */
export const bpmnMessageShape: ShapeDefinition = {
	id: 'bpmnMessage',

	bounds(ctx: ShapeRenderContext) {
		const padding = ctx.style.padding || 8;
		const labelMetrics = ctx.measureText(ctx.node.label || '', ctx.style);

		const minWidth = 60;
		const minHeight = 40;

		const width = Math.max(minWidth, labelMetrics.width + padding * 2);
		// Envelope has 2:3 aspect ratio
		const height = Math.max(minHeight, width * 0.66);

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

		// Envelope body (rectangle)
		let svg = `<rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;

		// Envelope flap (triangle)
		const centerX = x + bounds.width / 2;
		const flapPath = `M ${x},${y} L ${centerX},${y + bounds.height / 2} L ${x + bounds.width},${y}`;
		svg += `<path d="${flapPath}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;

		// Optional label below the envelope
		if (ctx.node.label) {
			const textY = y + bounds.height + 16;
			svg += `<text x="${centerX}" y="${textY}" text-anchor="middle" font-family="${ctx.style.fontFamily || 'Arial'}" font-size="${(ctx.style.fontSize || 14) * 0.85}" fill="#000000">${ctx.node.label}</text>`;
		}

		return svg;
	}
};
