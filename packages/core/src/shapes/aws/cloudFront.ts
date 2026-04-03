import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { calculateRectangularAnchors } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

export const awsCloudFrontShape: ShapeDefinition = {
  id: 'awsCloudFront',

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
    const fillColor = (ctx.node.data?.fillColor as string) || '#8C4FFF';
    const strokeColor = (ctx.node.data?.strokeColor as string) || '#232F3E';
    const textColor = (ctx.node.data?.textColor as string) || '#232F3E';
    const iconX = position.x + (bounds.width - iconSize) / 2;
    const iconY = position.y + padding;
    const centerX = iconX + iconSize / 2;
    const centerY = iconY + iconSize / 2;

    let result = '<g>';
    result += `<circle cx="${centerX}" cy="${centerY}" r="${iconSize / 3}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>`;
    result += `<circle cx="${centerX}" cy="${centerY}" r="${iconSize / 2 - 4}" fill="none" stroke="${fillColor}" stroke-width="4" opacity="0.5"/>`;
    result += `<circle cx="${centerX}" cy="${centerY}" r="${iconSize / 2 - 12}" fill="none" stroke="${fillColor}" stroke-width="2" opacity="0.7"/>`;
    result += `<path d="M ${centerX} ${centerY - 8} L ${centerX + 6} ${centerY} L ${centerX} ${centerY + 8} L ${centerX - 6} ${centerY} Z" fill="white"/>`;

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
