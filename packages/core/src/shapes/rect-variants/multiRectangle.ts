import type { ShapeDefinition } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Multi rectangle (stacked) - for repeated/loop processes
 * Shows depth with multiple offset rectangles
 * Common in flowcharts to indicate iterative processes
 */
export const multiRectangleShape: ShapeDefinition = {
  id: 'multiRectangle',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const padding = ctx.style.padding || 12;
    // Allow customization via data, with defaults
    const data = ctx.node.data as any;
    const offset = data?.offset || 4; // Offset for each stacked rectangle
    const stackCount = data?.stackCount || 2; // Number of rectangles to show

    const width = textSize.width + padding * 2 + offset * stackCount;
    const height = textSize.height + padding * 2 + offset * stackCount;

    return { width, height };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;
    // Allow customization via data, with defaults
    const data = ctx.node.data as any;
    const offset = data?.offset || 4;
    const stackCount = data?.stackCount || 2;
    const totalOffset = offset * stackCount;

    // Anchors on the front (top-most) rectangle
    return [
      { x: w / 2, y: 0, name: 'top' },
      { x: w - totalOffset, y: h / 2 - totalOffset, name: 'right' },
      { x: w / 2, y: h - totalOffset, name: 'bottom' },
      { x: totalOffset, y: h / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    // Allow customization via data, with defaults
    const data = ctx.node.data as any;
    const offset = data?.offset || 4;
    const stackCount = data?.stackCount || 2;
    const totalOffset = offset * stackCount;

    const rectWidth = bounds.width - totalOffset;
    const rectHeight = bounds.height - totalOffset;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const label = ctx.node.label || '';

    const textX = x + bounds.width / 2;
    const textY = y + (bounds.height - totalOffset) / 2;

    // Render back rectangles first, then front
    let rects = '';
    for (let i = stackCount - 1; i >= 0; i--) {
      const rectX = x + offset * i;
      const rectY = y + offset * i;
      rects += `
        <rect x="${rectX}" y="${rectY}" width="${rectWidth}" height="${rectHeight}"
              fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
    }

    return `
      ${rects}
      
      ${renderShapeLabel(ctx, label, textX, textY)}
    `;
  },
};
