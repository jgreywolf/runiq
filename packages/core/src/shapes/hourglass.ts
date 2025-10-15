import type { ShapeDefinition } from '../types.js';

/**
 * Hourglass shape (collate) - two triangles meeting at center point
 * Used in flowcharts for collating or merging operations
 * Forms an hourglass or bow-tie shape
 */
export const hourglassShape: ShapeDefinition = {
  id: 'hourglass',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const padding = ctx.style.padding || 12;

    // Hourglass is roughly square
    const size = Math.max(
      textSize.width + padding * 2,
      textSize.height + padding * 2,
      70
    );

    return { width: size, height: size };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;

    return [
      { x: w / 2, y: 0, name: 'top' }, // Top point
      { x: w, y: h / 2, name: 'right' }, // Right side
      { x: w / 2, y: h, name: 'bottom' }, // Bottom point
      { x: 0, y: h / 2, name: 'left' }, // Left side
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;

    // Two triangles meeting at center
    // Top triangle: top-left, top-right, center
    // Bottom triangle: center, bottom-right, bottom-left
    const path = [
      `M ${x},${y}`, // Top left
      `L ${x + w},${y}`, // Top right
      `L ${x + w / 2},${y + h / 2}`, // Center point
      `L ${x + w},${y + h}`, // Bottom right
      `L ${x},${y + h}`, // Bottom left
      `L ${x + w / 2},${y + h / 2}`, // Back to center
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
