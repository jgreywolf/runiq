import type { ShapeDefinition } from '../../types/index.js';
import { extractBasicStyles } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

export const c4ContainerInstance: ShapeDefinition = {
  id: 'c4ContainerInstance',
  bounds(ctx) {
    const labelSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 16;
    const minWidth = 140;
    const minHeight = 80;
    const techHeight = 18;

    return {
      width: Math.max(labelSize.width + padding * 2, minWidth),
      height: Math.max(labelSize.height + padding * 2 + techHeight, minHeight),
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
    const { fill, stroke, strokeWidth, strokeDasharray } = extractBasicStyles(ctx, {
      defaultFill: '#438DD5',
      defaultStroke: '#2E6295',
      defaultStrokeWidth: 2,
    });
    const dashAttr = ` stroke-dasharray="${strokeDasharray || '6 4'}"`;
    const textColor = ctx.style.textColor || '#ffffff';
    const rx = ctx.style.rx || 8;

    const label = ctx.node.label || ctx.node.id;
    const lines = label.split('\\n');
    const title = lines[0];
    const technology = lines[1] || '';

    const titleSvg = renderShapeLabel(
      {
        ...ctx,
        style: {
          ...ctx.style,
          fontSize: ctx.style.fontSize || 14,
          fontWeight: 'bold',
          color: textColor,
        },
      },
      title,
      x + bounds.width / 2,
      y + bounds.height / 2 - (technology ? 8 : 0)
    );

    const techSvg = technology
      ? renderShapeLabel(
          {
            ...ctx,
            style: {
              ...ctx.style,
              fontSize: (ctx.style.fontSize || 14) - 2,
              fontStyle: 'italic' as const,
              color: textColor,
            },
          },
          technology,
          x + bounds.width / 2,
          y + bounds.height / 2 + 12
        )
      : '';

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
            rx="${rx}" ry="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"${dashAttr} />
      <text x="${x + 10}" y="${y + 18}" font-size="10" font-family="Arial, sans-serif" fill="${textColor}">instance</text>
      ${titleSvg}
      ${techSvg}
    `;
  },
};
