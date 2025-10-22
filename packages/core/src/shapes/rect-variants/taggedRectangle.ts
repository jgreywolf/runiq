import type { ShapeDefinition } from '../../types.js';

/**
 * Tagged rectangle - for tagged/labeled processes
 * Rectangle with small triangular tag in corner
 * Used to indicate special tagged or flagged operations
 */
export const taggedRectangleShape: ShapeDefinition = {
  id: 'taggedRectangle',

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
    const tagSize = 12; // Size of corner tag

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const font = ctx.style.font || 'sans-serif';
    const fontSize = ctx.style.fontSize || 14;

    const textX = x + w / 2;
    const textY = y + h / 2;

    // Draw rectangle and corner tag
    return `
      <rect x="${x}" y="${y}" width="${w}" height="${h}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <polygon points="${x + w},${y} ${x + w - tagSize},${y} ${x + w},${y + tagSize}"
               fill="${stroke}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${textX}" y="${textY}"
            text-anchor="middle" dominant-baseline="middle"
            font-family="${font}" font-size="${fontSize}">
        ${ctx.node.label || ''}
      </text>
    `;
  },
};
