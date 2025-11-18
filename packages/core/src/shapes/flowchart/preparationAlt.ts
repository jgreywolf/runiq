import type { ShapeDefinition } from '../../types.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Preparation alternative - Elongated hexagon (horizontal orientation)
 * More elongated than standard hexagon for preparation steps
 */
export const preparationAltShape: ShapeDefinition = {
  id: 'preparation',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: Math.max(textSize.width + padding * 4, 100), // Wider for elongated look
      height: Math.max(textSize.height + padding * 2, 50),
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

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const label = ctx.node.label || ctx.node.id;

    const indent = 15; // Smaller indent for more elongated shape

    const points = [
      `${x + indent},${y}`, // Top left
      `${x + w - indent},${y}`, // Top right
      `${x + w},${y + h / 2}`, // Right point
      `${x + w - indent},${y + h}`, // Bottom right
      `${x + indent},${y + h}`, // Bottom left
      `${x},${y + h / 2}`, // Left point
    ].join(' ');

    return `
      <polygon points="${points}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, label, x + w / 2, y + h / 2)}
    `;
  },
};
