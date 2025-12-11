import type { ShapeDefinition } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

export const documentShape: ShapeDefinition = {
  id: 'document',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: textSize.width + padding * 2,
      height: textSize.height + padding * 2 + 10, // extra for document fold
    };
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
    const foldSize = 10;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const label = ctx.node.label || ctx.node.id;

    // Document shape with folded corner
    const path = [
      `M ${x} ${y}`,
      `L ${x + bounds.width - foldSize} ${y}`,
      `L ${x + bounds.width} ${y + foldSize}`,
      `L ${x + bounds.width} ${y + bounds.height}`,
      `L ${x} ${y + bounds.height}`,
      `Z`,
      // Fold line
      `M ${x + bounds.width - foldSize} ${y}`,
      `L ${x + bounds.width - foldSize} ${y + foldSize}`,
      `L ${x + bounds.width} ${y + foldSize}`,
    ].join(' ');

    return `
      <path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, label, x + bounds.width / 2, y + bounds.height / 2)}
    `;
  },
};
