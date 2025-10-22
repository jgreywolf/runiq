import type { ShapeDefinition } from '@runiq/core';

export const hexShape: ShapeDefinition = {
  id: 'hexagon',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: Math.max(textSize.width + padding * 3, 100),
      height: Math.max(textSize.height + padding * 2, 60),
    };
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const cx = x + bounds.width / 2;
    const cy = y + bounds.height / 2;
    const offsetX = bounds.width * 0.15; // Inset for hex shape

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    // Hexagon points
    const points = [
      `${x + offsetX},${y}`, // top-left
      `${x + bounds.width - offsetX},${y}`, // top-right
      `${x + bounds.width},${cy}`, // right
      `${x + bounds.width - offsetX},${y + bounds.height}`, // bottom-right
      `${x + offsetX},${y + bounds.height}`, // bottom-left
      `${x},${cy}`, // left
    ].join(' ');

    return `
      <polygon points="${points}" 
               fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};
