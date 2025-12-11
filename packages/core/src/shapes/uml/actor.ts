import type { ShapeDefinition } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

export const actorShape: ShapeDefinition = {
  id: 'user',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    // Actor shape is a circle on top of a rectangle (stick figure)
    const minWidth = Math.max(textSize.width + padding * 2, 60);
    const height = textSize.height + padding * 2 + 30; // extra for head circle

    return { width: minWidth, height };
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
    const headRadius = 15;
    const bodyTop = y + headRadius * 2 + 5;
    const textY = bodyTop + (bounds.height - headRadius * 2 - 10) / 2;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const label = ctx.node.label || ctx.node.id;

    return `
      <!-- Actor head -->
      <circle cx="${cx}" cy="${y + headRadius}" r="${headRadius}" 
              fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <!-- Actor body -->
      <rect x="${x + 5}" y="${bodyTop}" width="${bounds.width - 10}" height="${bounds.height - headRadius * 2 - 10}"
            rx="5" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <!-- Label -->
      ${renderShapeLabel(ctx, label, cx, textY)}
    `;
  },
};
