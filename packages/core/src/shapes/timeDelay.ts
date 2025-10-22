import type { ShapeDefinition } from '../types.js';

/**
 * Time Delay Block (e^-sT) for Block Diagrams
 * Time delay block for control systems
 * Shows "e^-sT" or "z^-n" notation
 * Different from flowchart delay shape
 */
export const timeDelayShape: ShapeDefinition = {
  id: 'timeDelay',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || 'e^-sT', ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: Math.max(textSize.width + padding * 2, 80),
      height: Math.max(textSize.height + padding * 2, 50),
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);

    return [
      { x: 0, y: bounds.height / 2, name: 'in' },
      { x: bounds.width, y: bounds.height / 2, name: 'out' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const fill = ctx.style.fill || '#fce4ec';
    const stroke = ctx.style.stroke || '#c2185b';
    const strokeWidth = ctx.style.strokeWidth || 2;

    const cx = x + bounds.width / 2;
    const cy = y + bounds.height / 2;

    // Use "e^-sT" unless label specifies otherwise
    const label = ctx.node.label || 'e^-sT';

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${cx}" y="${cy}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" 
            font-size="${ctx.style.fontSize || 14}"
            font-style="italic">
        ${label}
      </text>
    `;
  },
};
