import type { ShapeDefinition } from '../../types.js';

/**
 * Lined rectangle - for processes with multiple steps/phases
 * Rectangle with horizontal dividing lines
 * Used to show segmented or multi-phase operations
 */
export const linedRectangleShape: ShapeDefinition = {
  id: 'linedRectangle',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const padding = ctx.style.padding || 12;

    const width = textSize.width + padding * 2;
    const height = Math.max(textSize.height + padding * 2, 60); // Taller for lines

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
    const lineCount = 2; // Number of dividing lines

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const font = ctx.style.font || 'sans-serif';
    const fontSize = ctx.style.fontSize || 14;

    const textX = x + w / 2;
    const textY = y + h / 2;

    // Draw horizontal lines dividing the rectangle
    let lines = '';
    for (let i = 1; i <= lineCount; i++) {
      const lineY = y + (h / (lineCount + 1)) * i;
      lines += `
        <line x1="${x}" y1="${lineY}" x2="${x + w}" y2="${lineY}"
              stroke="${stroke}" stroke-width="${strokeWidth}" />`;
    }

    return `
      <rect x="${x}" y="${y}" width="${w}" height="${h}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      ${lines}
      
      <text x="${textX}" y="${textY}"
            text-anchor="middle" dominant-baseline="middle"
            font-family="${font}" font-size="${fontSize}">
        ${ctx.node.label || ''}
      </text>
    `;
  },
};
