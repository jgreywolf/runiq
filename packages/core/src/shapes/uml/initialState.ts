import type { ShapeDefinition } from '../../types.js';

/**
 * UML Initial State shape
 * Filled circle indicating the starting point of a state machine
 * Typically small (16-20px diameter)
 */
export const initialStateShape: ShapeDefinition = {
  id: 'initialState',

  bounds() {
    const size = 18;
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
    const radius = bounds.width / 2;

    const cx = x + radius;
    const cy = y + radius;

    let svg = `<g class="initial-state-shape">`;

    // Filled black circle
    svg += `<circle cx="${cx}" cy="${cy}" r="${radius}" `;
    svg += `fill="#000000" stroke="none" />`;

    svg += `</g>`;
    return svg;
  },
};
