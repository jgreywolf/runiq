import type { ShapeDefinition } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Flipped triangle - downward-pointing triangle
 * Used in flowcharts for manual file operations or inverted merge/extract
 */
export const flippedTriangleShape: ShapeDefinition = {
  id: 'flippedTriangle',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const padding = ctx.style.padding || 12;

    const width = Math.max(textSize.width + padding * 2, 80);
    const height = Math.max(textSize.height + padding * 2, 70);

    return { width, height };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;

    return [
      { x: w / 2, y: 0, name: 'top' }, // Top center
      { x: w, y: 0, name: 'right' }, // Top right corner
      { x: w / 2, y: h, name: 'bottom' }, // Bottom point
      { x: 0, y: 0, name: 'left' }, // Top left corner
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;

    // Downward-pointing triangle: top-left, top-right, bottom-center
    const points = [
      `${x},${y}`, // Top left
      `${x + w},${y}`, // Top right
      `${x + w / 2},${y + h}`, // Bottom center (point)
    ].join(' ');

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const label = ctx.node.label || '';

    const textX = x + w / 2;
    const textY = y + h * 0.4; // Position text at 40% (higher up in triangle)

    return `
      <polygon points="${points}"
               fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, label, textX, textY)}
    `;
  },
};
