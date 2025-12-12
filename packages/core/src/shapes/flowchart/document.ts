import type { ShapeDefinition } from '../../types/index.js';
import { extractBasicStyles } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';
import { createPath } from '../utils/svg-path-builder.js';

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
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx);
    const label = ctx.node.label || ctx.node.id;

    // Document shape with folded corner
    const path = createPath()
      .moveTo(x, y)
      .lineTo(x + bounds.width - foldSize, y)
      .lineTo(x + bounds.width, y + foldSize)
      .lineTo(x + bounds.width, y + bounds.height)
      .lineTo(x, y + bounds.height)
      .close()
      // Fold line
      .moveTo(x + bounds.width - foldSize, y)
      .lineTo(x + bounds.width - foldSize, y + foldSize)
      .lineTo(x + bounds.width, y + foldSize)
      .build();

    return `
      <path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, label, x + bounds.width / 2, y + bounds.height / 2)}
    `;
  },
};
