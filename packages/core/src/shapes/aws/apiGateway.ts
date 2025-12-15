import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { calculateRectangularAnchors } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * AWS API Gateway shape
 * Represented as a gateway/router icon
 */
export const awsApiGatewayShape: ShapeDefinition = {
  id: 'awsApiGateway',

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
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }): string {
    const bounds = this.bounds(ctx);
    const padding = ctx.style.padding || 12;
    const iconSize = 60;
    const fillColor = (ctx.node.data?.fillColor as string) || '#945BB3'; // API Gateway purple
    const strokeColor = (ctx.node.data?.strokeColor as string) || '#232F3E';
    const textColor = (ctx.node.data?.textColor as string) || '#232F3E';

    const iconX = position.x + (bounds.width - iconSize) / 2;
    const iconY = position.y + padding;

    let result = `<g>`;

    // Hexagon shape (gateway)
    const hexRadius = iconSize / 2;
    const hexCenterX = iconX + iconSize / 2;
    const hexCenterY = iconY + iconSize / 2;

    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = hexCenterX + hexRadius * Math.cos(angle);
      const y = hexCenterY + hexRadius * Math.sin(angle);
      points.push(`${x},${y}`);
    }

    result += `<polygon points="${points.join(' ')}" 
                   fill="${fillColor}" 
                   stroke="${strokeColor}" 
                   stroke-width="2"/>`;

    // Gateway icon: arrows pointing inward to center
    const arrowSize = iconSize * 0.15;
    const centerDist = iconSize * 0.2;

    // Left arrow (pointing right)
    result += `<path d="M ${hexCenterX - centerDist - arrowSize} ${hexCenterY} 
                        L ${hexCenterX - centerDist} ${hexCenterY - arrowSize / 2} 
                        L ${hexCenterX - centerDist} ${hexCenterY + arrowSize / 2} Z" 
                   fill="white"/>`;

    // Right arrow (pointing left)
    result += `<path d="M ${hexCenterX + centerDist + arrowSize} ${hexCenterY} 
                        L ${hexCenterX + centerDist} ${hexCenterY - arrowSize / 2} 
                        L ${hexCenterX + centerDist} ${hexCenterY + arrowSize / 2} Z" 
                   fill="white"/>`;

    // Center circle
    result += `<circle cx="${hexCenterX}" cy="${hexCenterY}" r="${arrowSize}" fill="white"/>`;

    // Label
    if (ctx.node.label) {
      const labelY = iconY + iconSize + 16 + (ctx.style.fontSize || 14);
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
