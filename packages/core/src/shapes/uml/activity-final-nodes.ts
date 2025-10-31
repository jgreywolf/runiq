import type { ShapeDefinition } from '../../types.js';

/**
 * UML Activity Final Node shape
 * Bull's eye (outer circle with filled inner circle)
 * UML 2.5: Terminates the entire activity - all flows stop
 */
export const activityFinalShape: ShapeDefinition = {
  id: 'activityFinal',

  bounds() {
    return { width: 24, height: 24 };
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
    const strokeWidth = ctx.style.strokeWidth || 1.5;

    const centerX = x + w / 2;
    const centerY = y + h / 2;
    const outerRadius = w / 2 - strokeWidth;
    const innerRadius = outerRadius * 0.5; // Inner circle is about 50% of outer

    let svg = `<g class="activity-final-shape">`;

    // Outer circle (unfilled)
    svg += `<circle cx="${centerX}" cy="${centerY}" r="${outerRadius}" `;
    svg += `fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Inner circle (filled - bull's eye)
    svg += `<circle cx="${centerX}" cy="${centerY}" r="${innerRadius}" `;
    svg += `fill="${stroke}" />`;

    svg += `</g>`;
    return svg;
  },
};

/**
 * UML Flow Final Node shape
 * Circle with X inside
 * UML 2.5: Terminates a single flow - other concurrent flows can continue
 */
export const flowFinalShape: ShapeDefinition = {
  id: 'flowFinal',

  bounds() {
    return { width: 20, height: 20 };
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
    const strokeWidth = ctx.style.strokeWidth || 1.5;

    const centerX = x + w / 2;
    const centerY = y + h / 2;
    const radius = w / 2 - strokeWidth;

    // X dimensions (slightly smaller than circle)
    const xSize = radius * 0.6;
    const x1 = centerX - xSize;
    const x2 = centerX + xSize;
    const y1 = centerY - xSize;
    const y2 = centerY + xSize;

    let svg = `<g class="flow-final-shape">`;

    // Circle (unfilled)
    svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" `;
    svg += `fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // X mark (two diagonal lines)
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;
    svg += `<line x1="${x2}" y1="${y1}" x2="${x1}" y2="${y2}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    svg += `</g>`;
    return svg;
  },
};
