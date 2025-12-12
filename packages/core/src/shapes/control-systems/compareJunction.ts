import type { ShapeDefinition } from '../../types/index.js';
import { extractBasicStyles } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Compare Junction - Circle with comparison operator
 * Used for comparison operations in Control system diagrams (=, >, <, ≥, ≤)
 */
export const compareJunctionShape: ShapeDefinition = {
  id: 'compareJunction',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || '=', ctx.style);
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

    // Use label or default to '=' comparison
    const label = ctx.node.label || '=';
    const operatorStyle = {
      ...ctx.style,
      fontSize: (ctx.style.fontSize || 14) + 4,
      fontWeight: 'bold',
    };
    const idLabelStyle = {
      ...ctx.style,
      fontSize: (ctx.style.fontSize || 14) - 2,
    };

    return `
      <circle cx="${cx}" cy="${cy}" r="${r}"
              fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel({ ...ctx, style: operatorStyle }, label, cx, cy)}
      
      ${renderShapeLabel({ ...ctx, style: idLabelStyle }, ctx.node.id, cx, cy + r + 16)}
    `;
  },
};
