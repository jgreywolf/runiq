import type { ShapeDefinition } from '../types.js';

/**
 * Stored data (bow-tie) - for sequential access storage
 * Rectangle with inward-curving sides (bow-tie or hourglass shape)
 * Used for tape or sequential storage media
 */
export const storedDataShape: ShapeDefinition = {
  id: 'bow-tie',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const padding = ctx.style.padding || 12;

    const width = Math.max(textSize.width + padding * 2, 80);
    const height = Math.max(textSize.height + padding * 2, 60);

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
    const curveDepth = w * 0.15; // How much the sides curve inward

    // Create bow-tie shape with inward curves on left and right
    const path = [
      `M ${x},${y}`, // Top left
      `Q ${x + curveDepth},${y + h * 0.5} ${x},${y + h}`, // Left curve (inward)
      `L ${x + w},${y + h}`, // Bottom edge
      `Q ${x + w - curveDepth},${y + h * 0.5} ${x + w},${y}`, // Right curve (inward)
      `Z`,
    ].join(' ');

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const font = ctx.style.font || 'sans-serif';
    const fontSize = ctx.style.fontSize || 14;

    const textX = x + w / 2;
    const textY = y + h / 2;

    return `
      <path d="${path}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${textX}" y="${textY}"
            text-anchor="middle" dominant-baseline="middle"
            font-family="${font}" font-size="${fontSize}">
        ${ctx.node.label || ''}
      </text>
    `;
  },
};
