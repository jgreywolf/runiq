import type { ShapeDefinition } from '../types.js';

/**
 * Triangle - Upward-pointing triangle for extract/merge operations
 * Aliases: tri, triangle, extract
 */
export const triangleShape: ShapeDefinition = {
  id: 'triangle',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: Math.max(textSize.width + padding * 3, 80),
      height: Math.max(textSize.height + padding * 2, 70),
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;

    return [
      { x: w / 2, y: 0, name: 'top' },
      { x: w, y: h, name: 'right' },
      { x: w / 2, y: h, name: 'bottom' },
      { x: 0, y: h, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    // Triangle points: top center, bottom right, bottom left
    const points = [
      `${x + bounds.width / 2},${y}`, // top
      `${x + bounds.width},${y + bounds.height}`, // bottom right
      `${x},${y + bounds.height}`, // bottom left
    ].join(' ');

    return `
      <polygon points="${points}" 
               fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${x + bounds.width / 2}" y="${y + bounds.height * 0.6}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};
