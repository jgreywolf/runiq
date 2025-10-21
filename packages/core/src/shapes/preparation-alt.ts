import type { ShapeDefinition } from '../types.js';

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
      
      <text x="${x + w / 2}" y="${y + h / 2}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};
