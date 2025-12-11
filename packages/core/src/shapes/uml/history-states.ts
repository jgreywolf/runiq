import type { ShapeDefinition } from '../../types/index.js';

/**
 * UML Shallow History Pseudo-state
 * Circle with "H" representing shallow history
 * Returns to the most recently active direct substate
 */
export const historyShallowShape: ShapeDefinition = {
  id: 'historyShallow',

  bounds() {
    const diameter = 30;
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

    let svg = `<g class="historyShallow-shape">`;

    // Outer circle
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // "H" text
    svg += `<text x="${cx}" y="${cy + 5}" `;
    svg += `text-anchor="middle" font-size="${bounds.width * 0.6}" `;
    svg += `font-family="Arial" font-weight="bold" fill="${stroke}">`;
    svg += `H</text>`;

    svg += `</g>`;
    return svg;
  },
};

/**
 * UML Deep History Pseudo-state
 * Circle with "H*" representing deep history
 * Returns to the most recently active nested substate at any depth
 */
export const historyDeepShape: ShapeDefinition = {
  id: 'historyDeep',

  bounds() {
    const diameter = 30;
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

    let svg = `<g class="historyDeep-shape">`;

    // Outer circle
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // "H*" text
    svg += `<text x="${cx}" y="${cy + 5}" `;
    svg += `text-anchor="middle" font-size="${bounds.width * 0.5}" `;
    svg += `font-family="Arial" font-weight="bold" fill="${stroke}">`;
    svg += `H*</text>`;

    svg += `</g>`;
    return svg;
  },
};
