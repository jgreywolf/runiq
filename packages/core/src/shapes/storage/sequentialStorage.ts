import type { ShapeDefinition } from '../../types.js';

/**
 * Sequential access storage - Curved rectangle (rounded on left side only)
 * Half-stadium shape for sequential access like tape storage
 */
export const sequentialStorageShape: ShapeDefinition = {
  id: 'sequentialStorage',

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
    const radius = h / 2;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    // Half-stadium: curved left side, straight right side
    const path = [
      `M ${x + radius} ${y}`,
      `L ${x + w} ${y}`, // Top straight line
      `L ${x + w} ${y + h}`, // Right straight line
      `L ${x + radius} ${y + h}`, // Bottom straight line
      `A ${radius} ${radius} 0 0 1 ${x + radius} ${y}`, // Left arc
      `Z`,
    ].join(' ');

    return `
      <path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${x + w / 2}" y="${y + h / 2}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};
