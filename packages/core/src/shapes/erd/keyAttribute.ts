import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';

/**
 * ERD Key Attribute shape - represents a primary key attribute
 * Rendered as an ellipse with underlined text
 */
export const erdKeyAttributeShape: ShapeDefinition = {
  id: 'erdKeyAttribute',

  bounds(ctx: ShapeRenderContext) {
    const padding = ctx.style.padding || 12;
    const labelMetrics = ctx.measureText(ctx.node.label || '', ctx.style);

    const minWidth = 80;
    const minHeight = 50;

    const width = Math.max(minWidth, labelMetrics.width + padding * 2);
    const height = Math.max(minHeight, labelMetrics.height + padding * 2);

    return { width, height };
  },

  anchors(ctx: ShapeRenderContext) {
    const bounds = this.bounds(ctx);
    const halfWidth = bounds.width / 2;
    const halfHeight = bounds.height / 2;

    return [
      { x: halfWidth, y: 0, name: 'top' },
      { x: bounds.width, y: halfHeight, name: 'right' },
      { x: halfWidth, y: bounds.height, name: 'bottom' },
      { x: 0, y: halfHeight, name: 'left' },
    ];
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }): string {
    const bounds = this.bounds(ctx);
    const fillColor = (ctx.node.data?.fillColor as string) || '#FFF3E0';
    const strokeColor = (ctx.node.data?.strokeColor as string) || '#E65100';
    const textColor = (ctx.node.data?.textColor as string) || '#000000';

    const centerX = position.x + bounds.width / 2;
    const centerY = position.y + bounds.height / 2;
    const rx = bounds.width / 2;
    const ry = bounds.height / 2;

    let result = `<g>`;

    // Ellipse
    result += `<ellipse cx="${centerX}" cy="${centerY}" 
                   rx="${rx}" ry="${ry}" 
                   fill="${fillColor}" 
                   stroke="${strokeColor}" 
                   stroke-width="2"/>`;

    // Label with underline
    if (ctx.node.label) {
      const fontSize = ctx.style.fontSize || 14;
      const textY = centerY + fontSize / 3;

      result += `<text x="${centerX}" 
                      y="${textY}" 
                      text-anchor="middle" 
                      fill="${textColor}" 
                      font-size="${fontSize}" 
                      font-weight="bold" 
                      font-family="${ctx.style.fontFamily || 'Arial'}">${ctx.node.label}</text>`;

      // Underline
      const labelWidth = ctx.measureText(ctx.node.label, ctx.style).width;
      const underlineY = textY + 3;
      result += `<line x1="${centerX - labelWidth / 2}" y1="${underlineY}" 
                       x2="${centerX + labelWidth / 2}" y2="${underlineY}" 
                       stroke="${textColor}" 
                       stroke-width="1.5"/>`;
    }

    result += `</g>`;
    return result;
  },
};
