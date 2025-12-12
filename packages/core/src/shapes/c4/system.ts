import { ShapeDefaults } from '../../constants.js';
import type { ShapeDefinition } from '../../types/index.js';
import { renderMultilineText } from '../../types/index.js';
import {
  calculateRectangularAnchors,
  extractBasicStyles,
} from '../utils/index.js';

/**
 * C4 Model: Software System
 * Represents a high-level software system
 * Large rounded rectangle with title and optional description
 */
export const c4System: ShapeDefinition = {
  id: 'c4System',
  bounds(ctx) {
    const labelSize = ctx.measureText(ctx.node.label || ctx.node.id, {
      ...ctx.style,
      fontSize: (ctx.style.fontSize || 14) + 2, // Slightly larger
    });
    const padding = ctx.style.padding ?? ShapeDefaults.PADDING_LARGE;
    const minWidth = 160;
    const minHeight = 100;

    // TODO: Support description text (multiline)
    const descHeight = 0; // Reserved for future description support

    return {
      width: Math.max(labelSize.width + padding * 2, minWidth),
      height: Math.max(labelSize.height + padding * 2 + descHeight, minHeight),
    };
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#1168BD', // C4 system blue
      defaultStroke: '#0B4884',
      defaultStrokeWidth: 2,
    });
    const textColor = ctx.style.textColor || '#ffffff';
    const rx = ctx.style.rx || 8;

    const titleSvg: string = renderMultilineText(
      ctx.node.label || ctx.node.id,
      x + bounds.width / 2,
      y + bounds.height / 2,
      {
        textAnchor: 'middle' as const,
        dominantBaseline: 'middle',
        fontFamily: (ctx.style.font || 'sans-serif') as string,
        fontSize: ((ctx.style.fontSize || 14) + 2) as number,
        fill: textColor as string,
        fontWeight: 'bold' as string,
      }
    );

    return `
      <!-- C4 Software System -->
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
            rx="${rx}" ry="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />

      <!-- Title -->
      ${titleSvg}

      <!-- TODO: Add description text below title -->
    `;
  },
};
