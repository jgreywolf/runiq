import type { ShapeDefinition } from '../../types.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Chevron Shape - Arrow pointing right
 * Used for progressive lists and directional flows.
 * Aliases: chevron, arrow-right
 */
export const chevronShape: ShapeDefinition = {
  id: 'chevron',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;
    const arrowSize = 20; // pixels for arrow point

    return {
      width: textSize.width + padding * 2 + arrowSize,
      height: textSize.height + padding * 2,
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;

    return [
      { x: w / 2, y: 0, name: 'top' },
      { x: w, y: h / 2, name: 'right' }, // Arrow tip
      { x: w / 2, y: h, name: 'bottom' },
      { x: 0, y: h / 2, name: 'left' }, // Indented left side
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const h = bounds.height;
    const w = bounds.width;
    const arrowSize = 20; // horizontal depth of arrow point

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const label = ctx.node.label || ctx.node.id;

    // Chevron: rectangle with arrow point on right only (no indent on left)
    // Points go clockwise from top-left
    const points = [
      `${x},${y}`, // top left (straight edge)
      `${x + w - arrowSize},${y}`, // top right (before arrow)
      `${x + w},${y + h / 2}`, // arrow tip (middle right)
      `${x + w - arrowSize},${y + h}`, // bottom right (before arrow)
      `${x},${y + h}`, // bottom left (straight edge)
    ].join(' ');

    return `
      <polygon points="${points}" 
               fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, label, x + (w - arrowSize / 2) / 2, y + h / 2)}
    `;
  },
};
