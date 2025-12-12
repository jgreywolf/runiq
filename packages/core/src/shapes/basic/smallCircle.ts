import type { ShapeDefinition } from '../../types/index.js';
import { extractBasicStyles } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Small circle - Compact circle for minimal notation
 * Smaller than standard circle (30px min vs 50px)
 */
export const smallCircleShape: ShapeDefinition = {
  id: 'smallCircle',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 8; // Less padding for small circle

    // Smaller diameter than standard circle
    const diameter = Math.max(
      textSize.width * 1.2 + padding * 2,
      textSize.height * 1.2 + padding * 2,
      30 // minimum small circle size (vs 50 for standard)
    );

    return {
      width: diameter,
      height: diameter,
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const r = bounds.width / 2;

    return [
      { x: r, y: 0, name: 'top' },
      { x: bounds.width, y: r, name: 'right' },
      { x: r, y: bounds.height, name: 'bottom' },
      { x: 0, y: r, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const cx = x + bounds.width / 2;
    const cy = y + bounds.height / 2;
    const r = bounds.width / 2;
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx);
    const label = ctx.node.label || ctx.node.id;

    return `
      <circle cx="${cx}" cy="${cy}" r="${r}"
              fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, label, cx, cy)}
    `;
  },
};
