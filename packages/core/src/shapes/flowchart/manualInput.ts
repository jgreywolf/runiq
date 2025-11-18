import type { ShapeDefinition } from '../../types.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Manual Input - Sloped rectangle for manual data entry
 * Aliases: sl-rect, manual-input, sloped-rect
 */
export const manualInputShape: ShapeDefinition = {
  id: 'manualInput',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: textSize.width + padding * 2,
      height: textSize.height + padding * 2.5,
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;
    const slope = h * 0.2;

    return [
      { x: w / 2, y: slope, name: 'top' },
      { x: w, y: h / 2, name: 'right' },
      { x: w / 2, y: h, name: 'bottom' },
      { x: 0, y: h / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const slope = bounds.height * 0.2; // Top edge slopes down

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const label = ctx.node.label || ctx.node.id;

    // Sloped top rectangle
    const points = [
      `${x},${y + slope}`, // top left (lower)
      `${x + bounds.width},${y}`, // top right (higher)
      `${x + bounds.width},${y + bounds.height}`, // bottom right
      `${x},${y + bounds.height}`, // bottom left
    ].join(' ');

    return `
      <polygon points="${points}" 
               fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, label, x + bounds.width / 2, y + bounds.height / 2 + slope / 2)}
    `;
  },
};
