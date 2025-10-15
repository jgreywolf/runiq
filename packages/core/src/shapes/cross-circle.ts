import type { ShapeDefinition } from '../types.js';

/**
 * Cross circle (X inside) - Circle with X for cancellation or rejection
 * Used for cancel, reject, or exclusion operations
 */
export const crossCircleShape: ShapeDefinition = {
  id: 'x-circ',

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

    // Calculate diagonal line positions (X marks the spot)
    const crossInset = r * 0.3; // X doesn't touch edge
    const x1 = cx - r + crossInset;
    const y1 = cy - r + crossInset;
    const x2 = cx + r - crossInset;
    const y2 = cy + r - crossInset;

    return `
      <circle cx="${cx}" cy="${cy}" r="${r}"
              fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
            stroke="${stroke}" stroke-width="${strokeWidth}" />
      <line x1="${x2}" y1="${y1}" x2="${x1}" y2="${y2}"
            stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};
