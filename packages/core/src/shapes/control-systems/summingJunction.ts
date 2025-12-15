import type { ShapeDefinition } from '../../types/index.js';
import { extractBasicStyles } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Summing junction - Circle with plus sign inside
 * Used for summing or junction points
 */
export const summingJunctionShape: ShapeDefinition = {
  id: 'summingJunction',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    // Circle needs diameter to fit text diagonally
    const diameter = Math.max(
      textSize.width * 1.4 + padding * 2,
      textSize.height * 1.4 + padding * 2,
      50 // minimum circle size
    );

    return {
      width: diameter,
      height: diameter,
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const r = bounds.width / 2;

    return [
      { x: r, y: 0, name: 'top' },
      { x: bounds.width, y: r, name: 'right' },
      { x: r, y: bounds.height, name: 'bottom' },
      { x: 0, y: r, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const cx = x + bounds.width / 2;
    const cy = y + bounds.height / 2;
    const r = bounds.width / 2;

    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx);

    // Calculate plus sign lines (shorter than circle diameter)
    const plusLength = r * 0.6;
    const label = ctx.node.label || ctx.node.id;

    return `
      <circle cx="${cx}" cy="${cy}" r="${r}"
              fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <line x1="${cx - plusLength}" y1="${cy}" x2="${cx + plusLength}" y2="${cy}"
            stroke="${stroke}" stroke-width="${strokeWidth}" />
      <line x1="${cx}" y1="${cy - plusLength}" x2="${cx}" y2="${cy + plusLength}"
            stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, label, cx, cy + r + 16)}
    `;
  },
};
