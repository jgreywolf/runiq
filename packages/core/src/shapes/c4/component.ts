import type { ShapeDefinition } from '../../types/index.js';
import {
  calculateRectangularAnchors,
  extractBasicStyles,
} from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * C4 Model: Component
 * Represents a grouping of related functionality (code module, service, etc.)
 * Smaller rectangle with title and component type
 */
export const c4Component: ShapeDefinition = {
  id: 'c4Component',
  bounds(ctx) {
    const labelSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;
    const minWidth = 120;
    const minHeight = 60;

    return {
      width: Math.max(labelSize.width + padding * 2, minWidth),
      height: Math.max(labelSize.height + padding * 2, minHeight),
    };
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#85BBF0', // C4 component lighter blue
      defaultStroke: '#5A9BD5',
      defaultStrokeWidth: 1.5,
    });
    const textColor = ctx.style.textColor || '#000000'; // Dark text for lighter background
    const rx = ctx.style.rx || 6;

    const labelStyle = {
      ...ctx.style,
      fontSize: ctx.style.fontSize || 13,
      fontWeight: '600',
      color: textColor,
    };
    const labelSvg = renderShapeLabel(
      { ...ctx, style: labelStyle },
      ctx.node.label || ctx.node.id,
      x + bounds.width / 2,
      y + bounds.height / 2
    );

    return `
      <!-- C4 Component -->
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
            rx="${rx}" ry="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />

      <!-- Label -->
      ${labelSvg}
    `;
  },
};
