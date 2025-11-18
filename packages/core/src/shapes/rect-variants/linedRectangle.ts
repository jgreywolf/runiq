import type { ShapeDefinition } from '../../types.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Lined rectangle - for processes with multiple steps/phases
 * Rectangle with horizontal dividing lines
 * Used to show segmented or multi-phase operations
 */
export const linedRectangleShape: ShapeDefinition = {
  id: 'linedRectangle',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const padding = ctx.style.padding || 12;

    // Allow customization of minimum height via data
    const data = ctx.node.data as any;
    const minHeight = data?.minHeight !== undefined ? data.minHeight : 60;

    const width = textSize.width + padding * 2;
    const height = Math.max(textSize.height + padding * 2, minHeight);

    return { width, height };
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
    const w = bounds.width;
    const h = bounds.height;
    const lineCount = 2; // Number of dividing lines

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const label = ctx.node.label || '';

    const textX = x + w / 2;
    const textY = y + h / 2;

    // Draw horizontal lines dividing the rectangle
    let lines = '';
    for (let i = 1; i <= lineCount; i++) {
      const lineY = y + (h / (lineCount + 1)) * i;
      lines += `
        <line x1="${x}" y1="${lineY}" x2="${x + w}" y2="${lineY}"
              stroke="${stroke}" stroke-width="${strokeWidth}" />`;
    }

    return `
      <rect x="${x}" y="${y}" width="${w}" height="${h}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      ${lines}
      
      ${renderShapeLabel(ctx, label, textX, textY)}
    `;
  },
};
