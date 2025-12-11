import type { ShapeDefinition } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Card (punched card) - Rectangle with one corner cut
 * Represents punched card input/output
 */
export const cardShape: ShapeDefinition = {
  id: 'card',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: Math.max(textSize.width + padding * 2, 80),
      height: Math.max(textSize.height + padding * 2, 60),
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);

    return [
      { x: bounds.width / 2, y: 0, name: 'top' },
      { x: bounds.width, y: bounds.height / 2, name: 'right' },
      { x: bounds.width / 2, y: bounds.height, name: 'bottom' },
      { x: 0, y: bounds.height / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;
    const cutSize = 12;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const label = ctx.node.label || ctx.node.id;

    // Rectangle with top-left corner cut
    const points = [
      `${x + cutSize},${y}`, // Top left (after cut)
      `${x + w},${y}`, // Top right
      `${x + w},${y + h}`, // Bottom right
      `${x},${y + h}`, // Bottom left
      `${x},${y + cutSize}`, // Left side (before cut)
    ].join(' ');

    return `
      <polygon points="${points}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, label, x + w / 2, y + h / 2)}
    `;
  },
};
