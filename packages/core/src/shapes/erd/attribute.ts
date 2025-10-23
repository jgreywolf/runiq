import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

/**
 * ERD Attribute shape - represents an attribute of an entity
 * Rendered as an ellipse
 */
export const erdAttributeShape: ShapeDefinition = {
	id: 'erdAttribute',

	bounds(ctx: ShapeRenderContext) {
		const padding = ctx.style.padding || 12;
		const labelMetrics = ctx.measureText(ctx.node.label || '', ctx.style);

		const minWidth = 80;
		const minHeight = 50;

		const width = Math.max(minWidth, labelMetrics.width + padding * 2);
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
		const fillColor = (ctx.node.data?.fillColor as string) || '#E8F5E9';
		const strokeColor = (ctx.node.data?.strokeColor as string) || '#388E3C';
		const textColor = (ctx.node.data?.textColor as string) || '#000000';

		const centerX = position.x + bounds.width / 2;
		const centerY = position.y + bounds.height / 2;
		const rx = bounds.width / 2;
		const ry = bounds.height / 2;

		let result = `<g>`;

		// Ellipse
		result += `<ellipse cx="${centerX}" cy="${centerY}" 
                   rx="${rx}" ry="${ry}" 
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
                      font-family="${ctx.style.fontFamily || 'Arial'}">${ctx.node.label}</text>`;
		}

		result += `</g>`;
		return result;
	}
};
