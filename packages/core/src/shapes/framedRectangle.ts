import type { ShapeDefinition } from '../types.js';

/**
 * Framed rectangle - for subroutines/subprocesses
 * Rectangle with vertical lines on left and right sides
 * Common in flowcharts to indicate predefined process or subroutine call
 */
export const framedRectangleShape: ShapeDefinition = {
  id: 'framedRectangle',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const padding = ctx.style.padding || 12;
    const frameWidth = 6; // Width of frame/inset

    const width = textSize.width + padding * 2 + frameWidth * 2;
    const height = textSize.height + padding * 2;

    return { width, height };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;

    // Anchors on outer rectangle
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
    const frameWidth = 6;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const font = ctx.style.font || 'sans-serif';
    const fontSize = ctx.style.fontSize || 14;

    const textX = x + w / 2;
    const textY = y + h / 2;

    // Render outer rectangle and two vertical frame lines
    return `
      <rect x="${x}" y="${y}" width="${w}" height="${h}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <line x1="${x + frameWidth}" y1="${y}" x2="${x + frameWidth}" y2="${y + h}"
            stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <line x1="${x + w - frameWidth}" y1="${y}" x2="${x + w - frameWidth}" y2="${y + h}"
            stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${textX}" y="${textY}"
            text-anchor="middle" dominant-baseline="middle"
            font-family="${font}" font-size="${fontSize}">
        ${ctx.node.label || ''}
      </text>
    `;
  },
};
