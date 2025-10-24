import type { ShapeDefinition } from '../../types.js';

/**
 * Brace right (right-facing curly brace) - For grouping right side
 * Tall curly brace } shape for indicating grouped items
 */
export const braceRightShape: ShapeDefinition = {
  id: 'braceRight',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: Math.max(textSize.width + padding * 2, 40), // Narrower
      height: Math.max(textSize.height + padding * 4, 80), // Tall for grouping
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);

    return [
      { x: bounds.width / 2, y: 0, name: 'top' },
      { x: bounds.width, y: bounds.height / 2, name: 'right' },
      { x: bounds.width / 2, y: bounds.height, name: 'bottom' },
      { x: 0, y: bounds.height / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;

    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 2;

    // Right-facing curly brace } shape (mirror of left brace)
    // Start from top-left, curve to middle-right point, curve to bottom-left
    const midY = y + h / 2;
    const rightPoint = x + w * 0.85; // Point of the brace (more pronounced)
    const leftEdge = x + w * 0.3; // Left edge closer to center
    const controlOffset = w * 0.4; // Control point offset

    const path = [
      `M ${leftEdge} ${y}`, // Top left
      `Q ${leftEdge + controlOffset} ${y + h * 0.2} ${leftEdge + controlOffset} ${y + h * 0.4}`, // Top curve inward
      `Q ${leftEdge + controlOffset * 0.5} ${y + h * 0.45} ${rightPoint} ${midY}`, // Curve to middle point
      `Q ${leftEdge + controlOffset * 0.5} ${y + h * 0.55} ${leftEdge + controlOffset} ${y + h * 0.6}`, // Curve from middle
      `Q ${leftEdge + controlOffset} ${y + h * 0.8} ${leftEdge} ${y + h}`, // Bottom curve
    ].join(' ');

    return `
      <path d="${path}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${x + w / 2}" y="${midY}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};
