import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { calculateRectangularAnchors } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * ERD Entity shape - represents a strong entity
 * Rendered as a rectangle
 */
export const erdEntityShape: ShapeDefinition = {
  id: 'erdEntity',

  bounds(ctx: ShapeRenderContext) {
    const padding = ctx.style.padding || 12;
    const labelMetrics = ctx.measureText(ctx.node.label || '', ctx.style);

    const minWidth = 100;
    const minHeight = 60;

    const width = Math.max(minWidth, labelMetrics.width + padding * 2);
    const height = Math.max(minHeight, labelMetrics.height + padding * 2);

    return { width, height };
  },

  anchors(ctx: ShapeRenderContext) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }): string {
    const bounds = this.bounds(ctx);
    const fillColor = (ctx.node.data?.fillColor as string) || '#E8F4FD';
    const strokeColor = (ctx.node.data?.strokeColor as string) || '#1976D2';
    const textColor = (ctx.node.data?.textColor as string) || '#000000';

    let result = `<g>`;

    // Rectangle
    result += `<rect x="${position.x}" y="${position.y}" 
                   width="${bounds.width}" height="${bounds.height}" 
                   fill="${fillColor}" 
                   stroke="${strokeColor}" 
                   stroke-width="2"/>`;

    // Label
    if (ctx.node.label) {
      const labelStyle = { ...ctx.style, color: textColor, fontWeight: 'bold' };
      result += renderShapeLabel(
        { ...ctx, style: labelStyle },
        ctx.node.label,
        position.x + bounds.width / 2,
        position.y + bounds.height / 2 + (ctx.style.fontSize || 14) / 3
      );
    }

    result += `</g>`;
    return result;
  },
};
