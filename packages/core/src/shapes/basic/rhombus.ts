import type { ShapeDefinition } from '@runiq/core';

export const rhombusShape: ShapeDefinition = {
  id: 'rhombus',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    // Diamond shape needs extra space
    return {
      width: Math.max(textSize.width + padding * 3, 80),
      height: Math.max(textSize.height + padding * 2, 60),
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
    const cx = x + bounds.width / 2;
    const cy = y + bounds.height / 2;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    // Diamond points
    const points = [
      `${cx},${y}`, // top
      `${x + bounds.width},${cy}`, // right
      `${cx},${y + bounds.height}`, // bottom
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
