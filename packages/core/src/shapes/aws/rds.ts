import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * AWS RDS (Relational Database Service) shape
 * Represented as a database cylinder
 */
export const awsRdsShape: ShapeDefinition = {
  id: 'awsRds',

  bounds(ctx: ShapeRenderContext) {
    const iconWidth = 60;
    const iconHeight = 70;
    const padding = ctx.style.padding || 12;
    const labelHeight = ctx.node.label ? ctx.style.fontSize || 14 : 0;
    const spacing = ctx.node.label ? 8 : 0;

    const textMeasure = ctx.node.label
      ? ctx.measureText(ctx.node.label, ctx.style)
      : { width: 0, height: 0 };
    const width = Math.max(iconWidth, textMeasure.width) + padding * 2;
    const height = iconHeight + spacing + labelHeight + padding * 2;

    return { width, height };
  },

  anchors(ctx: ShapeRenderContext) {
    const bounds = this.bounds(ctx);
    const halfWidth = bounds.width / 2;
    const halfHeight = bounds.height / 2;

    return [
      { x: halfWidth, y: 0, direction: 'top' },
      { x: bounds.width, y: halfHeight, direction: 'right' },
      { x: halfWidth, y: bounds.height, direction: 'bottom' },
      { x: 0, y: halfHeight, direction: 'left' },
    ];
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }): string {
    const bounds = this.bounds(ctx);
    const padding = ctx.style.padding || 12;
    const dbWidth = 60;
    const dbHeight = 70;
    const fillColor = (ctx.node.data?.fillColor as string) || '#3F5BE7'; // RDS blue
    const strokeColor = (ctx.node.data?.strokeColor as string) || '#232F3E';
    const textColor = (ctx.node.data?.textColor as string) || '#232F3E';

    const iconX = position.x + (bounds.width - dbWidth) / 2;
    const iconY = position.y + padding;

    const ellipseRy = dbHeight / 6;

    let result = `<g>`;

    // Top ellipse
    result += `<ellipse cx="${iconX + dbWidth / 2}" cy="${iconY + ellipseRy}" 
                   rx="${dbWidth / 2}" ry="${ellipseRy}" 
                   fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>`;

    // Cylinder body
    result += `<rect x="${iconX}" y="${iconY + ellipseRy}" 
                   width="${dbWidth}" height="${dbHeight - ellipseRy * 2}" 
                   fill="${fillColor}" stroke="none"/>`;

    // Left edge
    result += `<line x1="${iconX}" y1="${iconY + ellipseRy}" 
                   x2="${iconX}" y2="${iconY + dbHeight - ellipseRy}" 
                   stroke="${strokeColor}" stroke-width="2"/>`;

    // Right edge
    result += `<line x1="${iconX + dbWidth}" y1="${iconY + ellipseRy}" 
                   x2="${iconX + dbWidth}" y2="${iconY + dbHeight - ellipseRy}" 
                   stroke="${strokeColor}" stroke-width="2"/>`;

    // Middle bands (database rings)
    const band1Y = iconY + dbHeight * 0.4;
    const band2Y = iconY + dbHeight * 0.6;

    result += `<ellipse cx="${iconX + dbWidth / 2}" cy="${band1Y}" 
                   rx="${dbWidth / 2}" ry="${ellipseRy}" 
                   fill="none" stroke="${strokeColor}" stroke-width="1"/>`;

    result += `<ellipse cx="${iconX + dbWidth / 2}" cy="${band2Y}" 
                   rx="${dbWidth / 2}" ry="${ellipseRy}" 
                   fill="none" stroke="${strokeColor}" stroke-width="1"/>`;

    // Bottom ellipse
    result += `<ellipse cx="${iconX + dbWidth / 2}" cy="${iconY + dbHeight - ellipseRy}" 
                   rx="${dbWidth / 2}" ry="${ellipseRy}" 
                   fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>`;

    // Label
    if (ctx.node.label) {
      const labelY = iconY + dbHeight + 16 + (ctx.style.fontSize || 14);
      const labelStyle = { ...ctx.style, color: textColor };
      result += renderShapeLabel(
        { ...ctx, style: labelStyle },
        ctx.node.label,
        position.x + bounds.width / 2,
        labelY
      );
    }

    result += `</g>`;
    return result;
  },
};
