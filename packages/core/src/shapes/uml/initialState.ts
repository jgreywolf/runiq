import type { ShapeDefinition } from '../../types/index.js';
import { calculateRectangularAnchors } from '../utils/index.js';

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
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
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
