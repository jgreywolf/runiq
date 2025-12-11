import type { ShapeDefinition } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Direct access storage - Rounded rectangle with curved sides
 * Alternative representation for direct access storage devices
 */
export const directStorageShape: ShapeDefinition = {
  id: 'directStorage',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: Math.max(textSize.width + padding * 2, 80),
      height: Math.max(textSize.height + padding * 2, 60),
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);

    return [
      { x: bounds.width / 2, y: 0, name: 'top' },
      { x: bounds.width, y: bounds.height / 2, name: 'right' },
      { x: bounds.width / 2, y: bounds.height, name: 'bottom' },
      { x: 0, y: bounds.height / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;
    const curveDepth = w * 0.12;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const label = ctx.node.label || ctx.node.id;

    // Rectangle with inward curves on left and right sides
    const path = [
      `M ${x} ${y}`,
      `L ${x + w} ${y}`, // Top
      `Q ${x + w + curveDepth} ${y + h * 0.5} ${x + w} ${y + h}`, // Right curve inward
      `L ${x} ${y + h}`, // Bottom
      `Q ${x - curveDepth} ${y + h * 0.5} ${x} ${y}`, // Left curve inward
      `Z`,
    ].join(' ');

    return `
      <path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, label, x + w / 2, y + h / 2)}
    `;
  },
};
