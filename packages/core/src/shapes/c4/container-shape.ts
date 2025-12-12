import type { ShapeDefinition } from '../../types/index.js';
import { extractBasicStyles } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * C4 Model: Container
 * Represents an application or data store (web app, database, mobile app, etc.)
 * Medium rounded rectangle with title and technology label
 */
export const c4Container: ShapeDefinition = {
  id: 'c4Container',
  bounds(ctx) {
    const labelSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 16;
    const minWidth = 140;
    const minHeight = 80;

    // Reserve space for technology label (smaller text)
    const techHeight = 18;

    return {
      width: Math.max(labelSize.width + padding * 2, minWidth),
      height: Math.max(labelSize.height + padding * 2 + techHeight, minHeight),
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

    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#438DD5', // C4 container light blue
      defaultStroke: '#2E6295',
      defaultStrokeWidth: 2,
    });
    const textColor = ctx.style.textColor || '#ffffff';
    const rx = ctx.style.rx || 8;

    // Extract technology from label or use custom property
    // Format: "Web Application\n[JavaScript, React]" or just "Web Application"
    const label = ctx.node.label || ctx.node.id;
    const lines = label.split('\\n');
    const title = lines[0];
    const technology = lines[1] || '';

    const titleY = y + bounds.height / 2 - (technology ? 8 : 0);
    const techY = y + bounds.height / 2 + 12;

    const titleStyle = {
      ...ctx.style,
      fontSize: ctx.style.fontSize || 14,
      fontWeight: 'bold',
      color: textColor,
    };
    const titleSvg = renderShapeLabel(
      { ...ctx, style: titleStyle },
      title,
      x + bounds.width / 2,
      titleY
    );

    const techStyle = {
      ...ctx.style,
      fontSize: (ctx.style.fontSize || 14) - 2,
      fontStyle: 'italic' as const,
      color: textColor,
    };
    const techSvg = technology
      ? renderShapeLabel(
          { ...ctx, style: techStyle },
          technology,
          x + bounds.width / 2,
          techY
        )
      : '';

    return `
      <!-- C4 Container -->
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
            rx="${rx}" ry="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />

      <!-- Title -->
      ${titleSvg}

      ${technology ? `<!-- Technology Label -->\n      ${techSvg}` : ''}
    `;
  },
};
