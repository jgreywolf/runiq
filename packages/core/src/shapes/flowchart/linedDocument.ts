import type { ShapeDefinition } from '../../types.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Lined document - Document with horizontal lines inside
 * Combines document fold with lined-rectangle pattern
 */
export const linedDocumentShape: ShapeDefinition = {
  id: 'linedDocument',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: Math.max(textSize.width + padding * 2, 80),
      height: Math.max(textSize.height + padding * 2 + 10, 60), // Extra for fold, tall enough for lines
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

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

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

    // Calculate horizontal lines (2-3 lines depending on height)
    const lineY1 = y + bounds.height * 0.33;
    const lineY2 = y + bounds.height * 0.67;
    const lineMargin = 8;
    const label = ctx.node.label || ctx.node.id;

    return `
      <path d="${docPath}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <line x1="${x + lineMargin}" y1="${lineY1}" x2="${x + bounds.width - lineMargin}" y2="${lineY1}"
            stroke="${stroke}" stroke-width="${strokeWidth * 0.5}" />
      <line x1="${x + lineMargin}" y1="${lineY2}" x2="${x + bounds.width - lineMargin}" y2="${lineY2}"
            stroke="${stroke}" stroke-width="${strokeWidth * 0.5}" />
      
      ${renderShapeLabel(ctx, label, x + bounds.width / 2, y + bounds.height / 2)}
    `;
  },
};
