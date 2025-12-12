import type { ShapeDefinition } from '../../types/index.js';
import { renderMultilineText } from '../../types/index.js';
import { calculateRectangularAnchors } from '../utils/index.js';

/**
 * C4 Model: Person
 * Represents a human user - actor, role, or persona
 * Styled as a rounded rectangle with icon/pictogram above label
 */
export const c4Person: ShapeDefinition = {
  id: 'c4Person',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 16;
    const iconHeight = 30; // Space for person icon
    const minWidth = 120;

    return {
      width: Math.max(textSize.width + padding * 2, minWidth),
      height: textSize.height + padding * 2 + iconHeight,
    };
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const fill = ctx.style.fill || '#08427B'; // C4 person blue
    const stroke = ctx.style.stroke || '#052E56';
    const strokeWidth = ctx.style.strokeWidth || 2;
    const textColor = ctx.style.textColor || '#ffffff';
    const rx = ctx.style.rx || 8;

    const iconX = x + bounds.width / 2;
    const iconY = y + 20;
    const labelY = y + 45;

    const labelSvg: string = renderMultilineText(
      ctx.node.label || ctx.node.id,
      x + bounds.width / 2,
      labelY,
      {
        textAnchor: 'middle' as const,
        dominantBaseline: 'middle',
        fontFamily: (ctx.style.font || 'sans-serif') as string,
        fontSize: (ctx.style.fontSize || 14) as number,
        fill: textColor as string,
        fontWeight: 'bold' as string,
      }
    );

    return `
      <!-- C4 Person Container -->
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
            rx="${rx}" ry="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />

      <!-- Person Icon (simple stick figure) -->
      <circle cx="${iconX}" cy="${iconY}" r="6" fill="${textColor}" />
      <line x1="${iconX}" y1="${iconY + 6}" x2="${iconX}" y2="${iconY + 14}" stroke="${textColor}" stroke-width="2" />
      <line x1="${iconX - 8}" y1="${iconY + 10}" x2="${iconX + 8}" y2="${iconY + 10}" stroke="${textColor}" stroke-width="2" />
      <line x1="${iconX}" y1="${iconY + 14}" x2="${iconX - 6}" y2="${iconY + 22}" stroke="${textColor}" stroke-width="2" />
      <line x1="${iconX}" y1="${iconY + 14}" x2="${iconX + 6}" y2="${iconY + 22}" stroke="${textColor}" stroke-width="2" />

      <!-- Label -->
      ${labelSvg}
    `;
  },
};
