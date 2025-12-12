import type { ShapeDefinition } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';
import { calculateSimpleBounds } from '../utils/calculate-bounds.js';

/**
 * Parallelogram (Lean Right) - Data input/output flowing in
 * Aliases: lean-r, lean-right, parallelogram, data, in-out
 */
export const parallelogramShape: ShapeDefinition = {
  id: 'parallelogram',
  bounds(ctx) {
    const skew = 15; // pixels of horizontal skew
    return calculateSimpleBounds(ctx, {
      extraWidth: skew * 2,
    });
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;
    const skew = 15;

    return [
      { x: w / 2, y: 0, name: 'top' },
      { x: w - skew, y: h / 2, name: 'right' },
      { x: w / 2, y: h, name: 'bottom' },
      { x: skew, y: h / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const skew = 15;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const label = ctx.node.label || ctx.node.id;

    // Parallelogram: lean right
    const points = [
      `${x + skew},${y}`, // top left (shifted right)
      `${x + bounds.width},${y}`, // top right
      `${x + bounds.width - skew},${y + bounds.height}`, // bottom right (shifted left)
      `${x},${y + bounds.height}`, // bottom left
    ].join(' ');

    return `
      <polygon points="${points}" 
               fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, label, x + bounds.width / 2, y + bounds.height / 2)}
    `;
  },
};
