import type { ShapeDefinition } from '../../types.js';

/**
 * UML Deletion shape
 * Large X mark indicating object destruction
 * Placed at the end of a lifeline in sequence diagrams
 */
export const deletionShape: ShapeDefinition = {
  id: 'deletion',

  bounds() {
    // Deletion X is a fixed size
    const size = 24;
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
    const w = bounds.width;
    const h = bounds.height;
    
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = 2; // Thicker for visibility
    
    let svg = `<g class="deletion-shape">`;
    
    // X mark: two diagonal lines
    // Line from top-left to bottom-right
    svg += `<line x1="${x}" y1="${y}" x2="${x + w}" y2="${y + h}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" />`;
    
    // Line from top-right to bottom-left
    svg += `<line x1="${x + w}" y1="${y}" x2="${x}" y2="${y + h}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" />`;
    
    svg += `</g>`;
    return svg;
  },
};
