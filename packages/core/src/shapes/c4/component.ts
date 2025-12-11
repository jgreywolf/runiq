import type { ShapeDefinition } from '../../types/index.js';
import { renderMultilineText } from '../../types/index.js';

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
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;

    return [
      { x: w / 2, y: 0, name: 'top' },
      { x: w, y: h / 2, name: 'right' },
      { x: w / 2, y: h, name: 'bottom' },
      { x: 0, y: h / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const fill = ctx.style.fill || '#85BBF0'; // C4 component lighter blue
    const stroke = ctx.style.stroke || '#5A9BD5';
    const strokeWidth = ctx.style.strokeWidth || 1.5;
    const textColor = ctx.style.textColor || '#000000'; // Dark text for lighter background
    const rx = ctx.style.rx || 6;

    const labelSvg: string = renderMultilineText(
      ctx.node.label || ctx.node.id,
      x + bounds.width / 2,
      y + bounds.height / 2,
      {
        textAnchor: 'middle' as const,
        dominantBaseline: 'middle',
        fontFamily: (ctx.style.font || 'sans-serif') as string,
        fontSize: (ctx.style.fontSize || 13) as number,
        fill: textColor as string,
        fontWeight: '600' as string,
      }
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
