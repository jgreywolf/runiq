import type { ShapeDefinition } from '../../types.js';

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
    
    const fill = ctx.style.fill || '#ffffff';
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1;
    
    let svg = `<g class="activation-shape">`;
    
    // Thin vertical rectangle
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
    
    svg += `</g>`;
    return svg;
  },
};
