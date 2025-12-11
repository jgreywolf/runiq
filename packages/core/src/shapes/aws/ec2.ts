import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';

/**
 * AWS EC2 (Elastic Compute Cloud) instance shape
 * Represented as a 3D cube/server icon
 */
export const awsEc2Shape: ShapeDefinition = {
  id: 'awsEc2',

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
    const fillColor = (ctx.node.data?.fillColor as string) || '#FF9900'; // AWS orange
    const strokeColor = (ctx.node.data?.strokeColor as string) || '#232F3E'; // AWS dark
    const textColor = (ctx.node.data?.textColor as string) || '#232F3E';

    // Center icon horizontally
    const iconX = position.x + (bounds.width - iconSize) / 2;
    const iconY = position.y + padding;

    // 3D cube representation (EC2 instance)
    const cubeTop = `M ${iconX + iconSize / 2} ${iconY} 
                       L ${iconX + iconSize} ${iconY + iconSize / 4} 
                       L ${iconX + iconSize} ${iconY + (iconSize * 3) / 4} 
                       L ${iconX + iconSize / 2} ${iconY + iconSize} 
                       L ${iconX} ${iconY + (iconSize * 3) / 4} 
                       L ${iconX} ${iconY + iconSize / 4} Z`;

    const cubeFront = `M ${iconX + iconSize / 2} ${iconY + iconSize} 
                         L ${iconX + iconSize} ${iconY + (iconSize * 3) / 4} 
                         L ${iconX + iconSize} ${iconY + iconSize} 
                         L ${iconX + iconSize / 2} ${iconY + iconSize + iconSize / 4} Z`;

    const cubeSide = `M ${iconX} ${iconY + (iconSize * 3) / 4} 
                        L ${iconX + iconSize / 2} ${iconY + iconSize} 
                        L ${iconX + iconSize / 2} ${iconY + iconSize + iconSize / 4} 
                        L ${iconX} ${iconY + iconSize} Z`;

    let result = `<g>`;

    // Cube faces
    result += `<path d="${cubeTop}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>`;
    result += `<path d="${cubeFront}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2" opacity="0.8"/>`;
    result += `<path d="${cubeSide}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2" opacity="0.6"/>`;

    // Label
    if (ctx.node.label) {
      const labelY = iconY + iconSize + 16 + (ctx.style.fontSize || 14);
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
