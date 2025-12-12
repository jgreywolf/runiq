import type { ShapeDefinition } from '../../types/index.js';
import { extractBasicStyles } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Or (logical OR) - Circle with curved OR lines
 * Represents logical OR operation, multiple inputs converging
 */
export const orShape: ShapeDefinition = {
  id: 'or',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    // Circle needs diameter to fit text diagonally
    const diameter = Math.max(
      textSize.width * 1.4 + padding * 2,
      textSize.height * 1.4 + padding * 2,
      50 // minimum circle size
    );

    return {
      width: diameter,
      height: diameter,
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const r = bounds.width / 2;

    return [
      { x: r, y: 0, name: 'top' },
      { x: bounds.width, y: r, name: 'right' },
      { x: r, y: bounds.height, name: 'bottom' },
      { x: 0, y: r, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const cx = x + bounds.width / 2;
    const cy = y + bounds.height / 2;
    const r = bounds.width / 2;

    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx);

    // OR arc lines (two curved lines from bottom converging at top)
    const arcOffset = r * 0.4;
    const path1 = `M ${cx - arcOffset} ${cy + r * 0.3} Q ${cx - arcOffset * 0.5} ${cy - r * 0.5} ${cx} ${cy - r * 0.7}`;
    const path2 = `M ${cx + arcOffset} ${cy + r * 0.3} Q ${cx + arcOffset * 0.5} ${cy - r * 0.5} ${cx} ${cy - r * 0.7}`;
    const label = ctx.node.label || ctx.node.id;

    return `
      <circle cx="${cx}" cy="${cy}" r="${r}"
              fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <path d="${path1}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <path d="${path2}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, label, cx, cy + r + 16)}
    `;
  },
};
