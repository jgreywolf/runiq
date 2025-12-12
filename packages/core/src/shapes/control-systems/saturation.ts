import type { ShapeDefinition } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Saturation Block
 * Nonlinear block showing saturation limits
 * Displays saturation curve with upper/lower bounds
 */
export const saturationShape: ShapeDefinition = {
  id: 'saturation',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || 'SAT', ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: Math.max(textSize.width + padding * 2, 80),
      height: Math.max(textSize.height + padding * 2, 60),
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);

    return [
      { x: 0, y: bounds.height / 2, name: 'in' },
      { x: bounds.width, y: bounds.height / 2, name: 'out' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const fill = ctx.style.fill || '#fff9c4';
    const stroke = ctx.style.stroke || '#f57f17';
    const strokeWidth = ctx.style.strokeWidth || 2;

    const cx = x + bounds.width / 2;
    const cy = y + bounds.height / 2;

    // Draw saturation curve
    const curveWidth = bounds.width * 0.6;
    const curveHeight = bounds.height * 0.5;
    const startX = cx - curveWidth / 2;
    const endX = cx + curveWidth / 2;
    const satY1 = cy - curveHeight / 2; // Upper saturation
    const satY2 = cy + curveHeight / 2; // Lower saturation

    // Saturation curve: flat at top, linear in middle, flat at bottom
    const path = `
      M ${startX} ${satY1}
      L ${startX + curveWidth * 0.2} ${satY1}
      L ${endX - curveWidth * 0.2} ${satY2}
      L ${endX} ${satY2}
    `;

    const label = ctx.node.label || 'SAT';
    const labelStyle = {
      ...ctx.style,
      fontSize: (ctx.style.fontSize || 14) - 2,
    };

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <path d="${path}" 
            fill="none" stroke="${stroke}" stroke-width="${strokeWidth * 0.7}" />
      
      ${renderShapeLabel({ ...ctx, style: labelStyle }, label, cx, y + bounds.height - 8)}
    `;
  },
};
