import type { ShapeDefinition } from '../../types.js';

/**
 * Off-page connector - Pentagon pointing down (home plate shape)
 * Connects to another page or section
 */
export const offPageConnectorShape: ShapeDefinition = {
  id: 'offPageConnector',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: Math.max(textSize.width + padding * 2, 60),
      height: Math.max(textSize.height + padding * 2, 60),
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);

    return [
      { x: bounds.width / 2, y: 0, name: 'top' },
      { x: bounds.width, y: bounds.height * 0.4, name: 'right' },
      { x: bounds.width / 2, y: bounds.height, name: 'bottom' },
      { x: 0, y: bounds.height * 0.4, name: 'left' },
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

    // Home plate pentagon pointing down
    const points = [
      `${x},${y}`, // Top left
      `${x + w},${y}`, // Top right
      `${x + w},${y + h * 0.6}`, // Right side
      `${x + w / 2},${y + h}`, // Bottom point
      `${x},${y + h * 0.6}`, // Left side
    ].join(' ');

    return `
      <polygon points="${points}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${x + w / 2}" y="${y + h * 0.4}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};
