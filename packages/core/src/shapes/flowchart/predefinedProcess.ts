import type { ShapeDefinition } from '../../types/index.js';
import { calculateSimpleBounds } from '../utils/calculate-bounds.js';
import { calculateRectangularAnchors } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Predefined process - Rectangle with vertical frame lines on both sides
 * Used for subroutines or predefined operations
 */
export const predefinedProcessShape: ShapeDefinition = {
  id: 'predefinedProcess',

  bounds(ctx) {
    return calculateSimpleBounds(ctx, {
      minWidth: 80,
      minHeight: 60,
    });
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const frameInset = 8; // Closer frame lines than framed-rectangle

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const label = ctx.node.label || ctx.node.id;

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <line x1="${x + frameInset}" y1="${y}" x2="${x + frameInset}" y2="${y + bounds.height}"
            stroke="${stroke}" stroke-width="${strokeWidth}" />
      <line x1="${x + bounds.width - frameInset}" y1="${y}" 
            x2="${x + bounds.width - frameInset}" y2="${y + bounds.height}"
            stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, label, x + bounds.width / 2, y + bounds.height / 2)}
    `;
  },
};
