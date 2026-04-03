import type { ShapeDefinition } from '../../types/index.js';
import { extractBasicStyles } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

export const c4SystemInstance: ShapeDefinition = {
  id: 'c4SystemInstance',
  bounds(ctx) {
    const labelSize = ctx.measureText(ctx.node.label || ctx.node.id, {
      ...ctx.style,
      fontSize: (ctx.style.fontSize || 14) + 2,
    });
    const padding = ctx.style.padding || 20;
    const minWidth = 160;
    const minHeight = 100;

    return {
      width: Math.max(labelSize.width + padding * 2, minWidth),
      height: Math.max(labelSize.height + padding * 2, minHeight),
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
      defaultFill: '#1168BD',
      defaultStroke: '#0B4884',
      defaultStrokeWidth: 2,
    });
    const dashAttr = ` stroke-dasharray="${strokeDasharray || '6 4'}"`;
    const textColor = ctx.style.textColor || '#ffffff';
    const rx = ctx.style.rx || 8;

    const labelSvg = renderShapeLabel(
      {
        ...ctx,
        style: {
          ...ctx.style,
          fontSize: (ctx.style.fontSize || 14) + 2,
          fontWeight: 'bold',
          color: textColor,
        },
      },
      ctx.node.label || ctx.node.id,
      x + bounds.width / 2,
      y + bounds.height / 2
    );

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
            rx="${rx}" ry="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"${dashAttr} />
      <text x="${x + 12}" y="${y + 20}" font-size="10" font-family="Arial, sans-serif" fill="${textColor}">instance</text>
      ${labelSvg}
    `;
  },
};
