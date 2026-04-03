import type { ShapeDefinition } from '../../types/index.js';
import { calculateDiamondAnchors, extractBasicStyles } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Sort - diamond with a horizontal divider
 */
export const sortShape: ShapeDefinition = {
  id: 'sort',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: Math.max(textSize.width + padding * 3, 90),
      height: Math.max(textSize.height + padding * 2, 64),
    };
  },

  anchors(ctx) {
    return calculateDiamondAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx);
    const label = ctx.node.label || ctx.node.id;
    const path = [
      `M ${x + bounds.width / 2},${y}`,
      `L ${x + bounds.width},${y + bounds.height / 2}`,
      `L ${x + bounds.width / 2},${y + bounds.height}`,
      `L ${x},${y + bounds.height / 2}`,
      'Z',
    ].join(' ');
    const lineInset = bounds.width * 0.22;
    const lineY = y + bounds.height / 2;

    return `
      <path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <line x1="${x + lineInset}" y1="${lineY}" x2="${x + bounds.width - lineInset}" y2="${lineY}"
            stroke="${stroke}" stroke-width="${strokeWidth}" />
      ${renderShapeLabel(ctx, label, x + bounds.width / 2, y + bounds.height * 0.3)}
    `;
  },
};
