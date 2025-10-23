import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

/**
 * AWS VPC (Virtual Private Cloud) container shape
 * Represented as a cloud boundary/container
 */
export const awsVpcShape: ShapeDefinition = {
  id: 'awsVpc',

  bounds(ctx: ShapeRenderContext) {
    const width = (ctx.node.data?.width as number) || 400;
    const height = (ctx.node.data?.height as number) || 300;

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
    const fillColor = (ctx.node.data?.fillColor as string) || '#E6F3FF'; // Light blue
    const strokeColor = (ctx.node.data?.strokeColor as string) || '#147EB8'; // VPC blue
    const textColor = (ctx.node.data?.textColor as string) || '#147EB8';

    let result = `<g>`;

    // Dashed border rectangle
    result += `<rect x="${position.x}" y="${position.y}" 
                   width="${bounds.width}" height="${bounds.height}" 
                   fill="${fillColor}" 
                   stroke="${strokeColor}" 
                   stroke-width="2" 
                   stroke-dasharray="10,5" 
                   rx="8" ry="8"/>`;

    // Small cloud icon in top-left corner
    const cloudSize = 30;
    const cloudX = position.x + 15;
    const cloudY = position.y + 15;

    // Simplified cloud shape
    result += `<circle cx="${cloudX + 10}" cy="${cloudY + 15}" r="8" fill="${strokeColor}"/>`;
    result += `<circle cx="${cloudX + 20}" cy="${cloudY + 10}" r="10" fill="${strokeColor}"/>`;
    result += `<circle cx="${cloudX + 30}" cy="${cloudY + 15}" r="8" fill="${strokeColor}"/>`;
    result += `<rect x="${cloudX + 10}" y="${cloudY + 15}" width="20" height="8" fill="${strokeColor}"/>`;

    // Label
    if (ctx.node.label) {
      const labelX = cloudX + cloudSize + 15;
      const labelY = position.y + 25;

      result += `<text x="${labelX}" y="${labelY}" 
                      fill="${textColor}" 
                      font-size="${(ctx.style.fontSize || 14) + 2}" 
                      font-weight="bold" 
                      font-family="${ctx.style.fontFamily || 'Arial'}">${ctx.node.label}</text>`;
    }

    result += `</g>`;
    return result;
  },
};
