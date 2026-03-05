import type { ShapeDefinition } from '../../types/index.js';
import {
  calculateRectangularAnchors,
  extractBasicStyles,
} from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Text block - Simple text container for comments/notes
 * Rectangle with dashed border and transparent/light fill
 */
export const textBlockShape: ShapeDefinition = {
  id: 'textBlock',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 16; // Extra padding for readability

    return {
      width: Math.max(textSize.width + padding * 2, 100),
      height: Math.max(textSize.height + padding * 2, 40),
    };
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#fffef0', // Very light yellow tint for notes
      defaultStroke: '#999', // Lighter gray for comments
    });
    const label = ctx.node.label || ctx.node.id;
    const centerX = x + bounds.width / 2;
    const centerY = y + bounds.height / 2;

    // Use custom style for lighter gray text
    const labelStyle = { ...ctx.style, color: stroke };

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"
            stroke-dasharray="4 2" />
      ${renderShapeLabel({ ...ctx, style: labelStyle }, label, centerX, centerY)}
    `;
  },
};
