import type { ShapeDefinition } from '../../types/index.js';
import { calculateRectangularAnchors } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Divided rectangle - for processes with distinct sections
 * Rectangle divided vertically into two sections
 * Used to show parallel operations or dual-phase processes
 */
export const dividedRectangleShape: ShapeDefinition = {
  id: 'dividedRectangle',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const padding = ctx.style.padding || 12;

    // Allow customization of minimum width via data
    const data = ctx.node.data as any;
    const minWidth = data?.minWidth !== undefined ? data.minWidth : 80;

    const width = Math.max(textSize.width + padding * 2, minWidth);
    const height = textSize.height + padding * 2;

    return { width, height };
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;
    const divideRatio = 0.3; // Left section is 30% of width

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const label = ctx.node.label || '';

    const textX = x + w / 2;
    const textY = y + h / 2;
    const divideX = x + w * divideRatio;

    return `
      <rect x="${x}" y="${y}" width="${w}" height="${h}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <line x1="${divideX}" y1="${y}" x2="${divideX}" y2="${y + h}"
            stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, label, textX, textY)}
    `;
  },
};
