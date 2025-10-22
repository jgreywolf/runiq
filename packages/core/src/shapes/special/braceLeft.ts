import type { ShapeDefinition } from '../../types.js';

/**
 * Brace left (left-facing curly brace) - For grouping left side
 * Tall curly brace { shape for indicating grouped items
 */
export const braceLeftShape: ShapeDefinition = {
  id: 'braceLeft',

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

    // Left-facing curly brace { shape
    // Start from top-right, curve to middle-left point, curve to bottom-right
    const midY = y + h / 2;
    const leftPoint = x + w * 0.2; // Point of the brace
    const rightEdge = x + w * 0.8;

    const path = [
      `M ${rightEdge} ${y}`, // Top right
      `Q ${x + w * 0.5} ${y + h * 0.1} ${x + w * 0.5} ${y + h * 0.25}`, // Top curve inward
      `Q ${x + w * 0.3} ${y + h * 0.4} ${leftPoint} ${midY}`, // Curve to middle point
      `Q ${x + w * 0.3} ${y + h * 0.6} ${x + w * 0.5} ${y + h * 0.75}`, // Curve from middle
      `Q ${x + w * 0.5} ${y + h * 0.9} ${rightEdge} ${y + h}`, // Bottom curve
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
