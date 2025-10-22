import type { ShapeDefinition } from '../types.js';

/**
 * Ellipse (Wide/Horizontal) - Oval shape for UML use cases
 * Wider than tall, typically used to represent use cases in UML diagrams
 */
export const ellipseWideShape: ShapeDefinition = {
  id: 'ellipseWide',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    // Use case ovals are typically ~1.8-2x wider than tall
    // Need extra room since text rectangle fits inside ellipse
    const width = Math.max(
      textSize.width * 1.5 + padding * 2,
      80 // minimum width
    );

    const height = Math.max(
      textSize.height * 1.5 + padding * 2,
      40 // minimum height
    );

    return { width, height };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const cx = bounds.width / 2;
    const cy = bounds.height / 2;

    return [
      { x: cx, y: 0, name: 'top' },
      { x: bounds.width, y: cy, name: 'right' },
      { x: cx, y: bounds.height, name: 'bottom' },
      { x: 0, y: cy, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const cx = x + bounds.width / 2;
    const cy = y + bounds.height / 2;
    const rx = bounds.width / 2;
    const ry = bounds.height / 2;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    return `
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"
               fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};
