import type { ShapeDefinition } from '../../types.js';

/**
 * Notched rectangle - for special processes with cut corners
 * Rectangle with top corners notched/cut
 * Used for interface or connection points
 */
export const notchedRectangleShape: ShapeDefinition = {
  id: 'notchedRectangle',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const padding = ctx.style.padding || 12;

    const width = textSize.width + padding * 2;
    const height = textSize.height + padding * 2;

    return { width, height };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;
    const notchSize = 8;

    return [
      { x: w / 2, y: notchSize, name: 'top' }, // Below the notch
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
    const notchSize = 8; // Size of corner notch

    // Create polygon with notched top corners
    const points = [
      `${x + notchSize},${y}`, // Top left (after notch)
      `${x + w - notchSize},${y}`, // Top right (before notch)
      `${x + w},${y + notchSize}`, // Right top (after notch)
      `${x + w},${y + h}`, // Bottom right
      `${x},${y + h}`, // Bottom left
      `${x},${y + notchSize}`, // Left top (after notch)
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
