import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { calculateRectangularAnchors } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

export const awsSqsShape: ShapeDefinition = {
  id: 'awsSqs',

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
    const fillColor = (ctx.node.data?.fillColor as string) || '#D86613';
    const strokeColor = (ctx.node.data?.strokeColor as string) || '#232F3E';
    const textColor = (ctx.node.data?.textColor as string) || '#232F3E';
    const iconX = position.x + (bounds.width - iconSize) / 2;
    const iconY = position.y + padding;

    let result = '<g>';
    result += `<rect x="${iconX + 8}" y="${iconY + 8}" width="44" height="32" rx="4" ry="4" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>`;
    result += `<path d="M ${iconX + 14} ${iconY + 18} L ${iconX + 24} ${iconY + 18} L ${iconX + 24} ${iconY + 14} L ${iconX + 34} ${iconY + 20} L ${iconX + 24} ${iconY + 26} L ${iconX + 24} ${iconY + 22} L ${iconX + 14} ${iconY + 22} Z" fill="white" opacity="0.85"/>`;
    result += `<path d="M ${iconX + 28} ${iconY + 30} L ${iconX + 38} ${iconY + 30} L ${iconX + 38} ${iconY + 26} L ${iconX + 48} ${iconY + 32} L ${iconX + 38} ${iconY + 38} L ${iconX + 38} ${iconY + 34} L ${iconX + 28} ${iconY + 34} Z" fill="white" opacity="0.6"/>`;

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
