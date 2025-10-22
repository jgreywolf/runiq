import type { ShapeDefinition } from '../../types.js';

/**
 * Paper tape shape (flag) - for legacy I/O operations
 * Used in flowcharts for tape or sequential storage input/output
 * Has wavy bottom edge to represent paper tape
 */
export const paperTapeShape: ShapeDefinition = {
  id: 'flag',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const padding = ctx.style.padding || 12;
    const waveHeight = 8; // Height of wavy edge

    const width = Math.max(textSize.width + padding * 2, 80);
    const height = textSize.height + padding * 2 + waveHeight;

    return { width, height };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;
    const waveHeight = 8;

    return [
      { x: w / 2, y: 0, name: 'top' },
      { x: w, y: h / 2, name: 'right' },
      { x: w / 2, y: h - waveHeight / 2, name: 'bottom' }, // Adjusted for wave
      { x: 0, y: h / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;
    const waveHeight = 8;
    const waveWidth = w / 4; // 4 waves across bottom

    // Create path with straight top/sides and wavy bottom
    const path = [
      `M ${x},${y}`, // Top left
      `L ${x + w},${y}`, // Top right
      `L ${x + w},${y + h - waveHeight}`, // Right side down to wave
      // Wavy bottom (4 curves)
      `Q ${x + w - waveWidth * 0.5},${y + h} ${x + w - waveWidth},${y + h - waveHeight}`,
      `Q ${x + w - waveWidth * 1.5},${y + h - waveHeight * 2} ${x + w - waveWidth * 2},${y + h - waveHeight}`,
      `Q ${x + w - waveWidth * 2.5},${y + h} ${x + w - waveWidth * 3},${y + h - waveHeight}`,
      `Q ${x + w - waveWidth * 3.5},${y + h - waveHeight * 2} ${x},${y + h - waveHeight}`,
      `Z`, // Close to top left
    ].join(' ');

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const font = ctx.style.font || 'sans-serif';
    const fontSize = ctx.style.fontSize || 14;

    const textX = x + w / 2;
    const textY = y + (h - waveHeight) / 2; // Center in non-wavy area

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
