import type { ShapeDefinition } from '../../types/index.js';
import { calculateRectangularAnchors } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Tagged rectangle - for tagged/labeled processes
 * Rectangle with small triangular tag in corner
 * Used to indicate special tagged or flagged operations
 */
export const taggedRectangleShape: ShapeDefinition = {
  id: 'taggedRectangle',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const padding = ctx.style.padding || 12;

    const width = textSize.width + padding * 2;
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
    const tagSize = 12; // Size of corner tag

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const label = ctx.node.label || '';

    const textX = x + w / 2;
    const textY = y + h / 2;

    // Calculate tag fill color (slightly darker than main fill)
    const tagFill = ctx.style.tagFill || stroke;

    // Draw rectangle and corner tag
    return `
      <rect x="${x}" y="${y}" width="${w}" height="${h}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <polygon points="${x + w},${y} ${x + w - tagSize},${y} ${x + w},${y + tagSize}"
               fill="${tagFill}" stroke="${stroke}" stroke-width="${strokeWidth / 2}" />
      
      ${renderShapeLabel(ctx, label, textX, textY)}
    `;
  },
};
