import type { ShapeDefinition } from '../../types.js';

/**
 * UML Activity Join shape
 * Thick horizontal bar for merging parallel flows in activity diagrams
 * Identical to state machine join and activity fork, but semantically different
 */
export const activityJoinShape: ShapeDefinition = {
  id: 'activityJoin',

  bounds(ctx) {
    const width = (ctx.node.data?.width as number) || 80;
    const height = 8;
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
    
    const fill = '#000000';
    
    let svg = `<g class="activity-join-shape">`;
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" />`;
    svg += `</g>`;
    
    return svg;
  },
};
