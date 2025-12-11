import type { ShapeDefinition } from '../../types/index.js';

/**
 * UML Join shape
 * Thick horizontal bar for merging concurrent states back into one
 * Used in state machine diagrams (identical to fork visually)
 */
export const joinShape: ShapeDefinition = {
  id: 'join',

  bounds(ctx) {
    const width = (ctx.node.data?.width as number) || 80;
    const height = 8; // Thick bar

    return { width, height };
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
    const w = bounds.width;
    const h = bounds.height;

    let svg = `<g class="join-shape">`;

    // Thick filled horizontal bar
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" `;
    svg += `fill="#000000" stroke="none" />`;

    svg += `</g>`;
    return svg;
  },
};
