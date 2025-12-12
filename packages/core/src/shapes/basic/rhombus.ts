import type { ShapeDefinition } from '../../types/index.js';
import { calculateSimpleBounds } from '../utils/calculate-bounds.js';
import { calculateDiamondAnchors } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

export const rhombusShape: ShapeDefinition = {
  id: 'rhombus',
  bounds(ctx) {
    return calculateSimpleBounds(ctx, {
      widthPaddingMultiplier: 3,
      minWidth: 80,
      minHeight: 60,
    });
  },

  anchors(ctx) {
    return calculateDiamondAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const cx = x + bounds.width / 2;
    const cy = y + bounds.height / 2;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    // Diamond points
    const points = [
      `${cx},${y}`, // top
      `${x + bounds.width},${cy}`, // right
      `${cx},${y + bounds.height}`, // bottom
      `${x},${cy}`, // left
    ].join(' ');

    const label = ctx.node.label || ctx.node.id;

    return `
      <polygon points="${points}"
               fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, label, cx, cy)}
    `;
  },
};
