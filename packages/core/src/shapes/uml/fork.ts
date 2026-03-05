import type { ShapeDefinition } from '../../types/index.js';
import { calculateRectangularAnchors } from '../utils/index.js';

/**
 * UML Fork shape
 * Thick horizontal bar for splitting transitions into concurrent states
 * Used in state machine diagrams
 */
export const forkShape: ShapeDefinition = {
  id: 'fork',

  bounds(ctx) {
    const width = (ctx.node.data?.width as number) || 80;
    const height = 8; // Thick bar

    return { width, height };
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;

    let svg = `<g class="fork-shape">`;

    // Thick filled horizontal bar
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" `;
    svg += `fill="#000000" stroke="none" />`;

    svg += `</g>`;
    return svg;
  },
};
