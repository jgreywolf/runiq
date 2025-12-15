import type { ShapeDefinition } from '../../types/index.js';
import { calculateSimpleBounds } from '../utils/calculate-bounds.js';
import {
  calculateTriangleAnchors,
  extractBasicStyles,
} from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Triangle - Upward-pointing triangle for extract/merge operations
 * Aliases: tri, triangle, extract
 */
export const triangleShape: ShapeDefinition = {
  id: 'triangle',
  bounds(ctx) {
    return calculateSimpleBounds(ctx, {
      widthPaddingMultiplier: 3,
      minWidth: 80,
      minHeight: 70,
    });
  },

  anchors(ctx) {
    return calculateTriangleAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx);
    const label = ctx.node.label || ctx.node.id;

    // Triangle points: top center, bottom right, bottom left
    const points = [
      `${x + bounds.width / 2},${y}`, // top
      `${x + bounds.width},${y + bounds.height}`, // bottom right
      `${x},${y + bounds.height}`, // bottom left
    ].join(' ');

    return `
      <polygon points="${points}" 
               fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, label, x + bounds.width / 2, y + bounds.height * 0.6)}
    `;
  },
};
