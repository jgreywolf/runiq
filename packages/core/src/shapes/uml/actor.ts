import type { ShapeDefinition } from '@runiq/core';

export const actorShape: ShapeDefinition = {
  id: 'actor',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    // Actor shape is a circle on top of a rectangle (stick figure)
    const minWidth = Math.max(textSize.width + padding * 2, 60);
    const height = textSize.height + padding * 2 + 30; // extra for head circle

    return { width: minWidth, height };
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const cx = x + bounds.width / 2;
    const headRadius = 15;
    const bodyTop = y + headRadius * 2 + 5;
    const textY = bodyTop + (bounds.height - headRadius * 2 - 10) / 2;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    return `
      <!-- Actor head -->
      <circle cx="${cx}" cy="${y + headRadius}" r="${headRadius}" 
              fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <!-- Actor body -->
      <rect x="${x + 5}" y="${bodyTop}" width="${bounds.width - 10}" height="${bounds.height - headRadius * 2 - 10}"
            rx="5" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <!-- Label -->
      <text x="${cx}" y="${textY}" text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};
