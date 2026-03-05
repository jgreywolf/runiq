import type { ShapeDefinition } from '../../types/index.js';
import { calculateSimpleBounds } from '../utils/calculate-bounds.js';
import {
  calculateRectangularAnchors,
  extractBasicStyles,
} from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

export const actorShape: ShapeDefinition = {
  id: 'user',
  bounds(ctx) {
    return calculateSimpleBounds(ctx, {
      extraHeight: 30, // extra for head circle
      minWidth: 60,
    });
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const cx = x + bounds.width / 2;
    const headRadius = 15;
    const bodyTop = y + headRadius * 2 + 5;
    const textY = bodyTop + (bounds.height - headRadius * 2 - 10) / 2;

    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx);
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
