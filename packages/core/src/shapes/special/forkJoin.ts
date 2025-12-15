import type { ShapeDefinition } from '../../types/index.js';
import { extractBasicStyles } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Fork/Join - thick horizontal bar for parallel flow control
 * Used to show fork (split) or join (merge) of parallel processes
 * Very wide, short bar shape
 */
export const forkJoinShape: ShapeDefinition = {
  id: 'fork',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const padding = ctx.style.padding || 12;

    // Very wide, short bar
    const width = Math.max(textSize.width + padding * 4, 120);
    const height = Math.max(20, textSize.height / 2); // Very short

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

    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#333', // Dark fill for bar
    });
    const font = ctx.style.font || 'sans-serif';
    const fontSize = ctx.style.fontSize || 10; // Small font

    const textX = x + w / 2;
    const textY = y + h / 2;
    const label = ctx.node.label || '';
    const labelStyle = { ...ctx.style, fontSize, color: '#fff' };

    return `
      <rect x="${x}" y="${y}" width="${w}" height="${h}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel({ ...ctx, style: labelStyle }, label, textX, textY)}
    `;
  },
};
