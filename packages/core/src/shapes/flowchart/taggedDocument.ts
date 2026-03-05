import type { ShapeDefinition } from '../../types/index.js';
import { extractBasicStyles } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Tagged document - Document with corner tag
 * Combines document fold with corner tag (like tagged-rectangle)
 */
export const taggedDocumentShape: ShapeDefinition = {
  id: 'taggedDocument',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: Math.max(textSize.width + padding * 2, 80),
      height: Math.max(textSize.height + padding * 2 + 10, 60), // Extra for fold
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
    const foldSize = 10;
    const tagSize = 12;
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx);
    const label = ctx.node.label || ctx.node.id;

    // Document shape with folded corner
    const docPath = [
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

    // Corner tag (triangular flag in top-left corner)
    const tagX = x;
    const tagY = y;
    const tagPoints = [
      `${tagX},${tagY}`,
      `${tagX + tagSize},${tagY}`,
      `${tagX},${tagY + tagSize}`,
    ].join(' ');

    return `
      <path d="${docPath}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <polygon points="${tagPoints}" fill="${stroke}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, label, x + bounds.width / 2, y + bounds.height / 2)}
    `;
  },
};
