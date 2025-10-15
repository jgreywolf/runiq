import type { ShapeDefinition } from '../types.js';

/**
 * Lean-left parallelogram - for output data (mirror of lean-right)
 * Used in flowcharts for data output operations
 * Leans to the left (top-right lower than top-left)
 */
export const leanLeftShape: ShapeDefinition = {
  id: 'lean-l',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const padding = ctx.style.padding || 12;
    const skew = 15; // pixels to skew left

    const width = textSize.width + padding * 2 + skew * 2;
    const height = textSize.height + padding * 2;

    return { width, height };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;
    const skew = 15;

    return [
      { x: w / 2, y: 0, name: 'top' },
      { x: w - skew, y: h / 2, name: 'right' }, // Adjusted for skew
      { x: w / 2, y: h, name: 'bottom' },
      { x: skew, y: h / 2, name: 'left' }, // Adjusted for skew
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;
    const skew = 15;

    // Create parallelogram leaning left
    // Top-left higher than top-right (opposite of lean-right)
    const points = [
      `${x + skew},${y}`, // Top left (forward)
      `${x + w},${y + h * 0}`, // Top right (at edge, but visually lower due to skew)
      `${x + w - skew},${y + h}`, // Bottom right (back)
      `${x},${y + h}`, // Bottom left (at edge)
    ].join(' ');

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const font = ctx.style.font || 'sans-serif';
    const fontSize = ctx.style.fontSize || 14;

    const textX = x + w / 2;
    const textY = y + h / 2;

    return `
      <polygon points="${points}"
               fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${textX}" y="${textY}"
            text-anchor="middle" dominant-baseline="middle"
            font-family="${font}" font-size="${fontSize}">
        ${ctx.node.label || ''}
      </text>
    `;
  },
};
