import type { ShapeDefinition } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Notched pentagon (loop limit) - for loop boundaries
 * Pentagon shape with notch at top for loop start/end markers
 * Used in flowcharts to indicate loop limits or iteration boundaries
 */
export const notchedPentagonShape: ShapeDefinition = {
  id: 'notchedPentagon',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const padding = ctx.style.padding || 12;

    const width = Math.max(textSize.width + padding * 2, 80);
    const height = Math.max(textSize.height + padding * 2, 60);

    return { width, height };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;
    const notchDepth = h * 0.2;

    return [
      { x: w / 2, y: notchDepth, name: 'top' }, // Below the notch
      { x: w, y: h / 2, name: 'right' },
      { x: w / 2, y: h, name: 'bottom' },
      { x: 0, y: h / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;
    const notchDepth = h * 0.2; // Depth of top notch
    const notchWidth = w * 0.3; // Width of notch opening

    // Pentagon with notch at top center
    const points = [
      `${x + w / 2 - notchWidth / 2},${y}`, // Top left of notch
      `${x + w / 2 - notchWidth / 2},${y + notchDepth}`, // Bottom left of notch
      `${x + w / 2 + notchWidth / 2},${y + notchDepth}`, // Bottom right of notch
      `${x + w / 2 + notchWidth / 2},${y}`, // Top right of notch
      `${x + w},${y + notchDepth}`, // Top right corner
      `${x + w},${y + h}`, // Bottom right
      `${x},${y + h}`, // Bottom left
      `${x},${y + notchDepth}`, // Top left corner
    ].join(' ');

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const label = ctx.node.label || '';

    const textX = x + w / 2;
    const textY = y + h / 2;

    return `
      <polygon points="${points}"
               fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, label, textX, textY)}
    `;
  },
};
