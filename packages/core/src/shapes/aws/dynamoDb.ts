import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { calculateRectangularAnchors } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

export const awsDynamoDbShape: ShapeDefinition = {
  id: 'awsDynamoDb',

  bounds(ctx: ShapeRenderContext) {
    const iconSize = 60;
    const padding = ctx.style.padding || 12;
    const labelHeight = ctx.node.label ? ctx.style.fontSize || 14 : 0;
    const spacing = ctx.node.label ? 8 : 0;
    const textMeasure = ctx.node.label
      ? ctx.measureText(ctx.node.label, ctx.style)
      : { width: 0, height: 0 };
    const width = Math.max(iconSize, textMeasure.width) + padding * 2;
    const height = iconSize + spacing + labelHeight + padding * 2;
    return { width, height };
  },

  anchors(ctx: ShapeRenderContext) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }): string {
    const bounds = this.bounds(ctx);
    const padding = ctx.style.padding || 12;
    const iconSize = 60;
    const fillColor = (ctx.node.data?.fillColor as string) || '#3B48CC';
    const strokeColor = (ctx.node.data?.strokeColor as string) || '#232F3E';
    const textColor = (ctx.node.data?.textColor as string) || '#232F3E';
    const iconX = position.x + (bounds.width - iconSize) / 2;
    const iconY = position.y + padding;
    const ellipseRy = iconSize / 8;

    let result = '<g>';
    result += `<ellipse cx="${iconX + iconSize / 2}" cy="${iconY + ellipseRy}" rx="${iconSize / 2}" ry="${ellipseRy}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>`;
    result += `<rect x="${iconX}" y="${iconY + ellipseRy}" width="${iconSize}" height="${iconSize - ellipseRy * 2}" fill="${fillColor}" stroke="none"/>`;
    result += `<ellipse cx="${iconX + iconSize / 2}" cy="${iconY + iconSize - ellipseRy}" rx="${iconSize / 2}" ry="${ellipseRy}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>`;
    result += `<line x1="${iconX}" y1="${iconY + iconSize / 2}" x2="${iconX + iconSize}" y2="${iconY + iconSize / 2}" stroke="white" stroke-width="2" opacity="0.75"/>`;
    result += `<line x1="${iconX}" y1="${iconY + iconSize / 3}" x2="${iconX + iconSize}" y2="${iconY + iconSize / 3}" stroke="white" stroke-width="1.5" opacity="0.6"/>`;

    if (ctx.node.label) {
      const labelY = iconY + iconSize + 16 + (ctx.style.fontSize || 14);
      result += renderShapeLabel(
        { ...ctx, style: { ...ctx.style, color: textColor } },
        ctx.node.label,
        position.x + bounds.width / 2,
        labelY
      );
    }

    result += '</g>';
    return result;
  },
};
