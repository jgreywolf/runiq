import type { ShapeDefinition } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Internal storage - rectangle divided into window-pane pattern
 * Used for internal memory or buffer storage
 * Has cross division creating 4 sections
 */
export const internalStorageShape: ShapeDefinition = {
  id: 'internalStorage',

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

    return [
      { x: w / 2, y: 0, name: 'top' },
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
    const vDivide = w * 0.25; // Vertical line at 25% from left
    const hDivide = y + h * 0.25; // Horizontal line at 25% from top

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const label = ctx.node.label || '';

    const textX = x + w / 2;
    const textY = y + h / 2;

    return `
      <rect x="${x}" y="${y}" width="${w}" height="${h}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <!-- Vertical division line -->
      <line x1="${x + vDivide}" y1="${y}" x2="${x + vDivide}" y2="${y + h}"
            stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <!-- Horizontal division line -->
      <line x1="${x}" y1="${hDivide}" x2="${x + w}" y2="${hDivide}"
            stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, label, textX, textY)}
    `;
  },
};
