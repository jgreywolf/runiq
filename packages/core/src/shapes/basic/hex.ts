import type { ShapeDefinition } from '../../types/index.js';
import { calculateSimpleBounds } from '../utils/calculate-bounds.js';
import { calculateRectangularAnchors } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

export const hexShape: ShapeDefinition = {
  id: 'hexagon',
  bounds(ctx) {
    return calculateSimpleBounds(ctx, {
      widthPaddingMultiplier: 3,
      minWidth: 100,
      minHeight: 60,
    });
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const cx = x + bounds.width / 2;
    const cy = y + bounds.height / 2;
    const offsetX = bounds.width * 0.15; // Inset for hex shape

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const label = ctx.node.label || ctx.node.id;

    // Hexagon points
    const points = [
      `${x + offsetX},${y}`, // top-left
      `${x + bounds.width - offsetX},${y}`, // top-right
      `${x + bounds.width},${cy}`, // right
      `${x + bounds.width - offsetX},${y + bounds.height}`, // bottom-right
      `${x + offsetX},${y + bounds.height}`, // bottom-left
      `${x},${cy}`, // left
    ].join(' ');

    return `
      <polygon points="${points}" 
               fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, label, cx, cy)}
    `;
  },
};
