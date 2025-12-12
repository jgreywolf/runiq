import type { ShapeDefinition } from '../../types/index.js';
import { calculateRectangularAnchors } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';
import { createPath } from '../utils/svg-path-builder.js';

/**
 * Stored data (bow-tie) - for sequential access storage
 * Rectangle with inward-curving sides (bow-tie or hourglass shape)
 * Used for tape or sequential storage media
 */
export const storedDataShape: ShapeDefinition = {
  id: 'storedData',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const padding = ctx.style.padding || 12;

    const width = Math.max(textSize.width + padding * 2, 80);
    const height = Math.max(textSize.height + padding * 2, 60);

    return { width, height };
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;
    const curveDepth = w * 0.15; // How much the sides curve inward

    // Create bow-tie shape with inward curves on left and right
    const path = createPath()
      .moveTo(x, y) // Top left
      .quadraticTo(x + curveDepth, y + h * 0.5, x, y + h) // Left curve (inward)
      .lineTo(x + w, y + h) // Bottom edge
      .quadraticTo(x + w - curveDepth, y + h * 0.5, x + w, y) // Right curve (inward)
      .close()
      .build();

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
