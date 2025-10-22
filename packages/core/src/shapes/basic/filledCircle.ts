import type { ShapeDefinition } from '../../types.js';

/**
 * Filled circle - Solid dark circle with contrasting text
 * Used for solid states or endpoints (like filled bullet points)
 */
export const filledCircleShape: ShapeDefinition = {
  id: 'filledCircle',

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

    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    // Use stroke color as fill for dark filled effect
    const fillColor = stroke;

    return `
      <circle cx="${cx}" cy="${cy}" r="${r}"
              fill="${fillColor}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}"
            fill="#fff">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};
