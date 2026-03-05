import type { ShapeDefinition } from '../../types/index.js';
import { calculateSimpleBounds } from '../utils/calculate-bounds.js';
import {
  calculateRectangularAnchors,
  extractBasicStyles,
} from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Delay - Rounded rectangle with one curved side
 * Aliases: delay
 */
export const delayShape: ShapeDefinition = {
  id: 'delay',
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
      
      ${renderShapeLabel(ctx, label, x + bounds.width / 2, y + bounds.height / 2)}
    `;
  },
};
