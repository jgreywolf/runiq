import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { calculateRectangularAnchors } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * AWS Lambda serverless function shape
 * Represented with the lambda (λ) symbol
 */
export const awsLambdaShape: ShapeDefinition = {
  id: 'awsLambda',

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
    const fillColor = (ctx.node.data?.fillColor as string) || '#FF9900'; // AWS orange
    const strokeColor = (ctx.node.data?.strokeColor as string) || '#232F3E';
    const textColor = (ctx.node.data?.textColor as string) || '#232F3E';

    const iconX = position.x + (bounds.width - iconSize) / 2;
    const iconY = position.y + padding;

    let result = `<g>`;

    // Background square with rounded corners
    result += `<rect x="${iconX}" y="${iconY}" 
                   width="${iconSize}" height="${iconSize}" 
                   rx="8" ry="8" 
                   fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"/>`;

    // Lambda symbol (λ)
    const lambdaSize = iconSize * 0.6;

    result += `<text x="${iconX + iconSize / 2}" y="${iconY + iconSize / 2 + lambdaSize / 3}" 
                   text-anchor="middle" 
                   fill="white" 
                   font-size="${lambdaSize}" 
                   font-weight="bold" 
                   font-family="Arial">λ</text>`;

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
