import type { ShapeDefinition } from '../../types.js';

/**
 * UML Activity Initial shape
 * Small filled circle representing the starting point in activity diagrams
 * Identical to state machine initial state
 */
export const activityInitialShape: ShapeDefinition = {
  id: 'activityInitial',

  bounds() {
    const diameter = 18;
    return { width: diameter, height: diameter };
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
    
    let svg = `<g class="activity-initial-shape">`;
    svg += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="#000000" />`;
    svg += `</g>`;
    
    return svg;
  },
};
