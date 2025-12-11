import type { ShapeDefinition } from '../../types/index.js';

/**
 * Gain Block
 * Right-pointing triangle for amplification/gain
 * Label shows gain value (K, 0.5, etc.)
 */
export const gainShape: ShapeDefinition = {
  id: 'gain',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    // Triangle: width = 1.5 * height for good proportions
    const height = Math.max(textSize.height + padding * 2, 50);
    const width = height * 1.5;

    return { width, height };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);

    return [
      { x: 0, y: bounds.height / 2, name: 'in' }, // Left point
      { x: bounds.width, y: bounds.height / 2, name: 'out' }, // Right point (tip)
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 2;

    // Right-pointing triangle: left base to right tip
    const points = [
      `${x},${y}`, // Top-left
      `${x},${y + bounds.height}`, // Bottom-left
      `${x + bounds.width},${y + bounds.height / 2}`, // Right tip
    ].join(' ');

    const cx = x + bounds.width * 0.4; // Center text slightly left of center
    const cy = y + bounds.height / 2;

    return `
      <polygon points="${points}"
               fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${cx}" y="${cy}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" 
            font-size="${ctx.style.fontSize || 14}"
            font-weight="bold">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};
