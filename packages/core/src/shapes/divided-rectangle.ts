import type { ShapeDefinition } from '../types.js';

/**
 * Divided rectangle - for processes with distinct sections
 * Rectangle divided vertically into two sections
 * Used to show parallel operations or dual-phase processes
 */
export const dividedRectangleShape: ShapeDefinition = {
  id: 'dividedRectangle',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const padding = ctx.style.padding || 12;

    const width = Math.max(textSize.width + padding * 2, 80); // Wider for division
    const height = textSize.height + padding * 2;

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
    const divideRatio = 0.3; // Left section is 30% of width

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const font = ctx.style.font || 'sans-serif';
    const fontSize = ctx.style.fontSize || 14;

    const textX = x + w / 2;
    const textY = y + h / 2;
    const divideX = x + w * divideRatio;

    return `
      <rect x="${x}" y="${y}" width="${w}" height="${h}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <line x1="${divideX}" y1="${y}" x2="${divideX}" y2="${y + h}"
            stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${textX}" y="${textY}"
            text-anchor="middle" dominant-baseline="middle"
            font-family="${font}" font-size="${fontSize}">
        ${ctx.node.label || ''}
      </text>
    `;
  },
};
