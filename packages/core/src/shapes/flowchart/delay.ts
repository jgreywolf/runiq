import type { ShapeDefinition } from '../types.js';

/**
 * Delay - Rounded rectangle with one curved side
 * Aliases: delay
 */
export const delayShape: ShapeDefinition = {
  id: 'delay',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: textSize.width + padding * 2,
      height: textSize.height + padding * 2,
    };
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

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    // Delay shape: rectangle with rounded right side
    const path = [
      `M ${x},${y}`, // start top left
      `L ${x + bounds.width - bounds.height / 2},${y}`, // line to near top right
      `Q ${x + bounds.width},${y} ${x + bounds.width},${y + bounds.height / 2}`, // curve to middle right
      `Q ${x + bounds.width},${y + bounds.height} ${x + bounds.width - bounds.height / 2},${y + bounds.height}`, // curve to bottom
      `L ${x},${y + bounds.height}`, // line to bottom left
      `Z`, // close path
    ].join(' ');

    return `
      <path d="${path}" 
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${x + bounds.width / 2}" y="${y + bounds.height / 2}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};
