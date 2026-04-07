import type { ShapeDefinition } from '../../types/index.js';
import { extractBasicStyles } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

export const c4DeploymentNode: ShapeDefinition = {
  id: 'c4DeploymentNode',
  bounds(ctx) {
    const labelSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 16;
    const minWidth = 150;
    const minHeight = 90;
    const depth = 12;

    return {
      width: Math.max(labelSize.width + padding * 2, minWidth) + depth,
      height: Math.max(labelSize.height + padding * 2, minHeight) + depth,
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    return [
      { x: bounds.width / 2, y: 0, name: 'top' },
      { x: bounds.width, y: bounds.height / 2, name: 'right' },
      { x: bounds.width / 2, y: bounds.height, name: 'bottom' },
      { x: 0, y: bounds.height / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const depth = 12;
    const frontWidth = bounds.width - depth;
    const frontHeight = bounds.height - depth;

    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#dbeafe',
      defaultStroke: '#2563eb',
      defaultStrokeWidth: 2,
    });
    const sideFill = '#bfdbfe';
    const topFill = '#eff6ff';
    const textColor = ctx.style.textColor || '#0f172a';

    const labelSvg = renderShapeLabel(
      {
        ...ctx,
        style: {
          ...ctx.style,
          fontSize: ctx.style.fontSize || 13,
          fontWeight: 'bold',
          color: textColor,
        },
      },
      ctx.node.label || ctx.node.id,
      x + frontWidth / 2,
      y + frontHeight / 2 + depth / 2
    );

    return `
      <polygon points="${x},${y + depth} ${x + depth},${y} ${x + bounds.width},${y} ${x + frontWidth},${y + depth}"
               fill="${topFill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <polygon points="${x + frontWidth},${y + depth} ${x + bounds.width},${y} ${x + bounds.width},${y + frontHeight} ${x + frontWidth},${y + bounds.height}"
               fill="${sideFill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <rect x="${x}" y="${y + depth}" width="${frontWidth}" height="${frontHeight}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      ${labelSvg}
    `;
  },
};
