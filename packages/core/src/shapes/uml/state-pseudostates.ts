import type { ShapeDefinition } from '../../types.js';

/**
 * UML Junction Pseudo-state
 * Filled black circle for junction (static conditional branch)
 */
export const junctionShape: ShapeDefinition = {
  id: 'junction',

  bounds() {
    const diameter = 16;
    return { width: diameter, height: diameter };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const r = bounds.width / 2;

    return [
      { x: r, y: 0, name: 'top' },
      { x: bounds.width, y: r, name: 'right' },
      { x: r, y: bounds.height, name: 'bottom' },
      { x: 0, y: r, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const r = bounds.width / 2;
    const cx = x + r;
    const cy = y + r;

    const fill = ctx.style.fill || '#000000'; // Default to filled black

    let svg = `<g class="junction-shape">`;
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" />`;
    svg += `</g>`;
    return svg;
  },
};

/**
 * UML Entry Point Pseudo-state
 * Small circle on the boundary of a composite state
 */
export const entryPointShape: ShapeDefinition = {
  id: 'entry-point',

  bounds() {
    const diameter = 12;
    return { width: diameter, height: diameter };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const r = bounds.width / 2;

    return [
      { x: r, y: 0, name: 'top' },
      { x: bounds.width, y: r, name: 'right' },
      { x: r, y: bounds.height, name: 'bottom' },
      { x: 0, y: r, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const r = bounds.width / 2;
    const cx = x + r;
    const cy = y + r;

    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1.5;
    const fill = ctx.style.fill || '#ffffff';

    let svg = `<g class="entry-point-shape">`;
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
    svg += `</g>`;
    return svg;
  },
};

/**
 * UML Exit Point Pseudo-state
 * Small circle with X on the boundary of a composite state
 */
export const exitPointShape: ShapeDefinition = {
  id: 'exit-point',

  bounds() {
    const diameter = 12;
    return { width: diameter, height: diameter };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const r = bounds.width / 2;

    return [
      { x: r, y: 0, name: 'top' },
      { x: bounds.width, y: r, name: 'right' },
      { x: r, y: bounds.height, name: 'bottom' },
      { x: 0, y: r, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const r = bounds.width / 2;
    const cx = x + r;
    const cy = y + r;

    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1.5;
    const fill = ctx.style.fill || '#ffffff';

    let svg = `<g class="exit-point-shape">`;
    
    // Circle
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // X mark
    const xSize = r * 0.6;
    svg += `<line x1="${cx - xSize}" y1="${cy - xSize}" `;
    svg += `x2="${cx + xSize}" y2="${cy + xSize}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth * 0.7}" />`;
    svg += `<line x1="${cx + xSize}" y1="${cy - xSize}" `;
    svg += `x2="${cx - xSize}" y2="${cy + xSize}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth * 0.7}" />`;

    svg += `</g>`;
    return svg;
  },
};

/**
 * UML Terminate Pseudo-state
 * Circle with X indicating state machine termination
 */
export const terminateShape: ShapeDefinition = {
  id: 'terminate',

  bounds() {
    const diameter = 20;
    return { width: diameter, height: diameter };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const r = bounds.width / 2;

    return [
      { x: r, y: 0, name: 'top' },
      { x: bounds.width, y: r, name: 'right' },
      { x: r, y: bounds.height, name: 'bottom' },
      { x: 0, y: r, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const r = bounds.width / 2;
    const cx = x + r;
    const cy = y + r;

    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1.5;
    const fill = ctx.style.fill || '#ffffff';

    let svg = `<g class="terminate-shape">`;
    
    // Circle
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // X mark (slightly larger than exit point)
    const xSize = r * 0.7;
    svg += `<line x1="${cx - xSize}" y1="${cy - xSize}" `;
    svg += `x2="${cx + xSize}" y2="${cy + xSize}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;
    svg += `<line x1="${cx + xSize}" y1="${cy - xSize}" `;
    svg += `x2="${cx - xSize}" y2="${cy + xSize}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    svg += `</g>`;
    return svg;
  },
};
