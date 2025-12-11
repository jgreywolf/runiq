import type { ShapeDefinition } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Multi document (stacked) - Multiple offset documents
 * Like multi-rectangle but with document fold corners
 */
export const multiDocumentShape: ShapeDefinition = {
  id: 'multiDocument',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;
    const stackOffset = 4; // Offset between documents
    const stackCount = 2;

    return {
      width:
        Math.max(textSize.width + padding * 2, 80) +
        stackOffset * (stackCount - 1),
      height:
        Math.max(textSize.height + padding * 2 + 10, 60) +
        stackOffset * (stackCount - 1),
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
    const stackOffset = 4;
    const stackCount = 2;
    const foldSize = 10;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    const docWidth = bounds.width - stackOffset * (stackCount - 1);
    const docHeight = bounds.height - stackOffset * (stackCount - 1);

    let svg = '<g>\n';

    // Render documents back to front
    for (let i = stackCount - 1; i >= 0; i--) {
      const docX = x + stackOffset * i;
      const docY = y + stackOffset * i;

      const docPath = [
        `M ${docX} ${docY}`,
        `L ${docX + docWidth - foldSize} ${docY}`,
        `L ${docX + docWidth} ${docY + foldSize}`,
        `L ${docX + docWidth} ${docY + docHeight}`,
        `L ${docX} ${docY + docHeight}`,
        `Z`,
        // Fold line
        `M ${docX + docWidth - foldSize} ${docY}`,
        `L ${docX + docWidth - foldSize} ${docY + foldSize}`,
        `L ${docX + docWidth} ${docY + foldSize}`,
      ].join(' ');

      svg += `  <path d="${docPath}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />\n`;
    }

    // Text on front document
    const textX = x + docWidth / 2;
    const textY = y + docHeight / 2;

    svg += renderShapeLabel(ctx, ctx.node.label || ctx.node.id, textX, textY);
    svg += '</g>';

    return svg;
  },
};
