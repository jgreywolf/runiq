import type { ShapeDefinition } from '../../types/index.js';

/**
 * UML Final State shape
 * Bullseye (outer circle with inner filled circle) indicating the end of a state machine
 * Typically 20-24px diameter
 */
export const finalStateShape: ShapeDefinition = {
  id: 'finalState',

  bounds() {
    const size = 22;
    return { width: size, height: size };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;

    return [
      { x: w / 2, y: 0, name: 'top' },
      { x: w, y: h / 2, name: 'right' },
      { x: w / 2, y: h, name: 'bottom' },
      { x: 0, y: h / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const outerRadius = bounds.width / 2;
    const innerRadius = outerRadius * 0.55;

    const cx = x + outerRadius;
    const cy = y + outerRadius;

    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1.5;

    let svg = `<g class="final-state-shape">`;

    // Outer circle (hollow)
    svg += `<circle cx="${cx}" cy="${cy}" r="${outerRadius}" `;
    svg += `fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Inner circle (filled)
    svg += `<circle cx="${cx}" cy="${cy}" r="${innerRadius}" `;
    svg += `fill="#000000" stroke="none" />`;

    svg += `</g>`;
    return svg;
  },
};
