import type { ShapeDefinition } from '../../types/index.js';
import { extractBasicStyles } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Sample Badge shape - rounded rectangle with centered label
 * Useful as an example shape for docs and tests.
 */
export const sampleBadgeShape: ShapeDefinition = {
  id: 'sampleBadge',
  bounds(ctx) {
    const text = ctx.node.label || ctx.node.id;
    const textSize = ctx.measureText(text, ctx.style);
    const padding = ctx.style?.padding ?? 8;

    return {
      width: textSize.width + padding * 2,
      height: textSize.height + padding * 2,
    };
  },

  anchors(ctx) {
    const { width, height } = this.bounds(ctx);
    return [
      { x: width / 2, y: 0, name: 'top' },
      { x: width, y: height / 2, name: 'right' },
      { x: width / 2, y: height, name: 'bottom' },
      { x: 0, y: height / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const { fill, stroke, strokeWidth, rx } = extractBasicStyles(ctx);
    const label = ctx.node.label || ctx.node.id;

    const corner = rx ?? 6;

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" rx="${corner}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      ${renderShapeLabel(ctx, label, x + bounds.width / 2, y + bounds.height / 2)}
    `;
  },
};
