import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * ERD Weak Entity shape - represents an entity dependent on another entity
 * Rendered as a double rectangle
 */
export const erdWeakEntityShape: ShapeDefinition = {
  id: 'erdWeakEntity',

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
    const bounds = this.bounds(ctx);
    const halfWidth = bounds.width / 2;
    const halfHeight = bounds.height / 2;

    return [
      { x: halfWidth, y: 0, name: 'top' },
      { x: bounds.width, y: halfHeight, name: 'right' },
      { x: halfWidth, y: bounds.height, name: 'bottom' },
      { x: 0, y: halfHeight, name: 'left' },
    ];
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }): string {
    const bounds = this.bounds(ctx);
    const fillColor = (ctx.node.data?.fillColor as string) || '#FFF9E6';
    const strokeColor = (ctx.node.data?.strokeColor as string) || '#F57C00';
    const textColor = (ctx.node.data?.textColor as string) || '#000000';

    const offset = 4; // Spacing between double rectangles

    let result = `<g>`;

    // Outer rectangle
    result += `<rect x="${position.x}" y="${position.y}" 
                   width="${bounds.width}" height="${bounds.height}" 
                   fill="${fillColor}" 
                   stroke="${strokeColor}" 
                   stroke-width="2"/>`;

    // Inner rectangle
    result += `<rect x="${position.x + offset}" y="${position.y + offset}" 
                   width="${bounds.width - offset * 2}" height="${bounds.height - offset * 2}" 
                   fill="none" 
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
