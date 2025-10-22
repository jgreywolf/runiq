import type { ShapeDefinition } from '../../types.js';

/**
 * UML Activity Final shape
 * Bullseye (outer circle with filled inner circle) representing the end in activity diagrams
 * Identical to state machine final state
 */
export const activityFinalShape: ShapeDefinition = {
  id: 'activityFinal',

  bounds() {
    const diameter = 22;
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
    const outerRadius = bounds.width / 2;
    const innerRadius = outerRadius * 0.55;
    const cx = x + outerRadius;
    const cy = y + outerRadius;
    
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 2;
    
    let svg = `<g class="activity-final-shape">`;
    
    // Outer circle (hollow)
    svg += `<circle cx="${cx}" cy="${cy}" r="${outerRadius}" `;
    svg += `fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
    
    // Inner circle (filled)
    svg += `<circle cx="${cx}" cy="${cy}" r="${innerRadius}" fill="#000000" />`;
    
    svg += `</g>`;
    
    return svg;
  },
};
