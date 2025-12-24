import type { ShapeDefinition } from '../../types/index.js';
import { calculateSimpleBounds } from '../utils/calculate-bounds.js';
import {
  calculateRectangularAnchors,
  extractBasicStyles,
} from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Monitor shape - display screen with small stand/base
 */
export const monitorShape: ShapeDefinition = {
  id: 'monitor',

  bounds(ctx) {
    return calculateSimpleBounds(ctx);
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx);
    const label = ctx.node.label || ctx.node.id;

    // Screen area and stand
    const screenHeight = Math.max(bounds.height - 16, 24);
    const standY = y + screenHeight;
    const standWidth = Math.max(bounds.width * 0.4, 24);
    const standX = x + (bounds.width - standWidth) / 2;

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${screenHeight}" rx="6" ry="6"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />

      <!-- Stand -->
      <rect x="${standX}" y="${standY}" width="${standWidth}" height="8" fill="${stroke}" rx="2" />
      <rect x="${x + bounds.width * 0.2}" y="${standY + 8}" width="${bounds.width * 0.6}" height="4" fill="${stroke}" rx="2" />

      ${renderShapeLabel(ctx, label, x + bounds.width / 2, y + bounds.height - 6)}
    `;
  },
};
