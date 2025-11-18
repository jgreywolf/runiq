import type { ShapeDefinition } from '../../types.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Display shape - curved trapezoid for display output
 * Common in flowcharts for showing output to displays/screens
 * Wider at bottom, narrower at top, with curved sides
 */
export const displayShape: ShapeDefinition = {
  id: 'display',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const padding = ctx.style.padding || 12;

    const width = Math.max(textSize.width + padding * 2, 80);
    const height = Math.max(textSize.height + padding * 2, 60);

    return { width, height };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;
    const inset = w * 0.15; // 15% narrower at top

    return [
      { x: w / 2, y: 0, name: 'top' },
      { x: w - inset * 0.5, y: h / 2, name: 'right' }, // Adjust for curve
      { x: w / 2, y: h, name: 'bottom' },
      { x: inset * 0.5, y: h / 2, name: 'left' }, // Adjust for curve
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;
    const inset = w * 0.15;

    // Create curved trapezoid path
    // Top narrower than bottom, with curved sides
    const path = [
      `M ${x + inset},${y}`, // Top left
      `L ${x + w - inset},${y}`, // Top right
      `Q ${x + w},${y + h * 0.3} ${x + w},${y + h / 2}`, // Right curve top
      `Q ${x + w},${y + h * 0.7} ${x + w},${y + h}`, // Right curve bottom
      `L ${x},${y + h}`, // Bottom right to bottom left
      `Q ${x},${y + h * 0.7} ${x},${y + h / 2}`, // Left curve bottom
      `Q ${x},${y + h * 0.3} ${x + inset},${y}`, // Left curve top
      `Z`,
    ].join(' ');

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const label = ctx.node.label || '';

    const textX = x + w / 2;
    const textY = y + h / 2;

    return `
      <path d="${path}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, label, textX, textY)}
    `;
  },
};
