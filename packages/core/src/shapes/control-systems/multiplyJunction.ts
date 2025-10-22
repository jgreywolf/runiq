import type { ShapeDefinition } from '../../types.js';

/**
 * Multiply Junction - Circle with × sign
 * Used for multiplication operations in block diagrams
 */
export const multiplyJunctionShape: ShapeDefinition = {
  id: 'multiplyJunction',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
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

    // Calculate × sign lines (two diagonals)
    const lineLength = r * 0.6;

    return `
      <circle cx="${cx}" cy="${cy}" r="${r}"
              fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <line x1="${cx - lineLength}" y1="${cy - lineLength}" 
            x2="${cx + lineLength}" y2="${cy + lineLength}"
            stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <line x1="${cx - lineLength}" y1="${cy + lineLength}" 
            x2="${cx + lineLength}" y2="${cy - lineLength}"
            stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${cx}" y="${cy + r + 16}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};
