import type { ShapeDefinition } from '@runiq/core';

export const docShape: ShapeDefinition = {
  id: 'doc',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: textSize.width + padding * 2,
      height: textSize.height + padding * 2 + 10, // extra for document fold
    };
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const foldSize = 10;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    // Document shape with folded corner
    const path = [
      `M ${x} ${y}`,
      `L ${x + bounds.width - foldSize} ${y}`,
      `L ${x + bounds.width} ${y + foldSize}`,
      `L ${x + bounds.width} ${y + bounds.height}`,
      `L ${x} ${y + bounds.height}`,
      `Z`,
      // Fold line
      `M ${x + bounds.width - foldSize} ${y}`,
      `L ${x + bounds.width - foldSize} ${y + foldSize}`,
      `L ${x + bounds.width} ${y + foldSize}`,
    ].join(' ');

    return `
      <path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${x + bounds.width / 2}" y="${y + bounds.height / 2}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};
