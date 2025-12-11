import type { ShapeDefinition } from '../../types/index.js';

/**
 * Compare Junction - Circle with comparison operator
 * Used for comparison operations in Control system diagrams (=, >, <, ≥, ≤)
 */
export const compareJunctionShape: ShapeDefinition = {
  id: 'compareJunction',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || '=', ctx.style);
    const padding = ctx.style.padding || 12;

    // Circle needs diameter to fit text diagonally
    const diameter = Math.max(
      textSize.width * 1.4 + padding * 2,
      textSize.height * 1.4 + padding * 2,
      50 // minimum circle size
    );

    return {
      width: diameter,
      height: diameter,
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const r = bounds.width / 2;

    return [
      { x: r, y: 0, name: 'top' },
      { x: bounds.width, y: r, name: 'right' },
      { x: r, y: bounds.height, name: 'bottom' },
      { x: 0, y: r, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const cx = x + bounds.width / 2;
    const cy = y + bounds.height / 2;
    const r = bounds.width / 2;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    // Use label or default to '=' comparison
    const label = ctx.node.label || '=';

    return `
      <circle cx="${cx}" cy="${cy}" r="${r}"
              fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${cx}" y="${cy}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" 
            font-size="${(ctx.style.fontSize || 14) + 4}"
            font-weight="bold">
        ${label}
      </text>
      
      <text x="${cx}" y="${cy + r + 16}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" font-size="${(ctx.style.fontSize || 14) - 2}">
        ${ctx.node.id}
      </text>
    `;
  },
};
