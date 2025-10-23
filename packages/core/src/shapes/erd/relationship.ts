import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

/**
 * ERD Relationship shape - represents a relationship between entities
 * Rendered as a diamond
 */
export const erdRelationshipShape: ShapeDefinition = {
	id: 'erdRelationship',

	bounds(ctx: ShapeRenderContext) {
		const padding = ctx.style.padding || 12;
		const labelMetrics = ctx.measureText(ctx.node.label || '', ctx.style);

		const minWidth = 90;
		const minHeight = 60;

		const width = Math.max(minWidth, labelMetrics.width + padding * 3);
		const height = Math.max(minHeight, labelMetrics.height + padding * 2);

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

	render(ctx: ShapeRenderContext, position: { x: number; y: number }): string {
		const bounds = this.bounds(ctx);
		const fillColor = (ctx.node.data?.fillColor as string) || '#F3E5F5';
		const strokeColor = (ctx.node.data?.strokeColor as string) || '#7B1FA2';
		const textColor = (ctx.node.data?.textColor as string) || '#000000';

		const centerX = position.x + bounds.width / 2;
		const centerY = position.y + bounds.height / 2;

		// Diamond points
		const points = [
			`${centerX},${position.y}`, // top
			`${position.x + bounds.width},${centerY}`, // right
			`${centerX},${position.y + bounds.height}`, // bottom
			`${position.x},${centerY}` // left
		];

		let result = `<g>`;

		// Diamond
		result += `<polygon points="${points.join(' ')}" 
                   fill="${fillColor}" 
                   stroke="${strokeColor}" 
                   stroke-width="2"/>`;

		// Label
		if (ctx.node.label) {
			result += `<text x="${centerX}" 
                      y="${centerY + (ctx.style.fontSize || 14) / 3}" 
                      text-anchor="middle" 
                      fill="${textColor}" 
                      font-size="${ctx.style.fontSize || 14}" 
                      font-style="italic" 
                      font-family="${ctx.style.fontFamily || 'Arial'}">${ctx.node.label}</text>`;
		}

		result += `</g>`;
		return result;
	}
};
