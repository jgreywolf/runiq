import type { ShapeDefinition } from '../../types/index.js';
import {
  calculateRectangularAnchors,
  extractBasicStyles,
} from '../utils/index.js';

/**
 * UML Activation shape
 * Thin vertical rectangle placed on a lifeline
 * Represents a period when an object is performing an action
 */
export const activationShape: ShapeDefinition = {
  id: 'activation',

  bounds(ctx) {
    // Activation boxes are narrow
    const width = 16;
    const height = (ctx.node.data?.height as number) || 60;

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

    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#ffffff',
      defaultStroke: '#000000',
    });

    let svg = `<g class="activation-shape">`;

    // Thin vertical rectangle
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    svg += `</g>`;
    return svg;
  },
};
