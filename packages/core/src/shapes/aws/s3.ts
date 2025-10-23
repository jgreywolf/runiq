import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

/**
 * AWS S3 (Simple Storage Service) bucket shape
 * Represented as a bucket/cylinder icon
 */
export const awsS3Shape: ShapeDefinition = {
  id: 'awsS3',

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
    const iconSize = 60;
    const bucketWidth = iconSize;
    const bucketHeight = iconSize;
    const fillColor = (ctx.node.data?.fillColor as string) || '#569A31'; // S3 green
    const strokeColor = (ctx.node.data?.strokeColor as string) || '#232F3E';
    const textColor = (ctx.node.data?.textColor as string) || '#232F3E';

    const iconX = position.x + (bounds.width - bucketWidth) / 2;
    const iconY = position.y + padding;

    // Bucket shape (simplified cylinder/bucket)
    const ellipseRy = bucketHeight / 6;

    let result = `<g>`;

    // Top ellipse
    result += `<ellipse cx="${iconX + bucketWidth / 2}" cy="${iconY + ellipseRy}" 
                   rx="${bucketWidth / 2}" ry="${ellipseRy}" 
                   fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>`;

    // Body
    result += `<rect x="${iconX}" y="${iconY + ellipseRy}" 
                   width="${bucketWidth}" height="${bucketHeight - ellipseRy * 2}" 
                   fill="${fillColor}" stroke="none"/>`;

    // Left side
    result += `<line x1="${iconX}" y1="${iconY + ellipseRy}" 
                   x2="${iconX}" y2="${iconY + bucketHeight - ellipseRy}" 
                   stroke="${strokeColor}" stroke-width="2"/>`;

    // Right side
    result += `<line x1="${iconX + bucketWidth}" y1="${iconY + ellipseRy}" 
                   x2="${iconX + bucketWidth}" y2="${iconY + bucketHeight - ellipseRy}" 
                   stroke="${strokeColor}" stroke-width="2"/>`;

    // Bottom ellipse
    result += `<ellipse cx="${iconX + bucketWidth / 2}" cy="${iconY + bucketHeight - ellipseRy}" 
                   rx="${bucketWidth / 2}" ry="${ellipseRy}" 
                   fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>`;

    // Label
    if (ctx.node.label) {
      const labelY = iconY + bucketHeight + 16 + (ctx.style.fontSize || 14);
      result += `<text x="${position.x + bounds.width / 2}" y="${labelY}" 
                      text-anchor="middle" 
                      fill="${textColor}" 
                      font-size="${ctx.style.fontSize || 14}" 
                      font-family="${ctx.style.fontFamily || 'Arial'}">${ctx.node.label}</text>`;
    }

    result += `</g>`;
    return result;
  },
};
