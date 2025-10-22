import type { ShapeDefinition } from '../types.js';

/**
 * Parallelogram (Lean Right) - Data input/output flowing in
 * Aliases: lean-r, lean-right, parallelogram, data, in-out
 */
export const parallelogramShape: ShapeDefinition = {
  id: 'parallelogram',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;
    const skew = 15; // pixels of horizontal skew

    return {
      width: textSize.width + padding * 2 + skew * 2,
      height: textSize.height + padding * 2,
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;
    const skew = 15;

    return [
      { x: w / 2, y: 0, name: 'top' },
      { x: w - skew, y: h / 2, name: 'right' },
      { x: w / 2, y: h, name: 'bottom' },
      { x: skew, y: h / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const skew = 15;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    // Parallelogram: lean right
    const points = [
      `${x + skew},${y}`, // top left (shifted right)
      `${x + bounds.width},${y}`, // top right
      `${x + bounds.width - skew},${y + bounds.height}`, // bottom right (shifted left)
      `${x},${y + bounds.height}`, // bottom left
    ].join(' ');

    return `
      <polygon points="${points}" 
               fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${x + bounds.width / 2}" y="${y + bounds.height / 2}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};
