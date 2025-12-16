import { ShapeDefaults } from '../../constants.js';
import type { ShapeDefinition } from '../../types/index.js';
import {
  calculateRectangularAnchors,
  extractBasicStyles,
} from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * System Boundary - Container rectangle for grouping use cases
 * Dotted border with label at top-left, used in UML use case diagrams
 */
export const systemBoundaryShape: ShapeDefinition = {
  id: 'systemBoundary',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding ?? ShapeDefaults.PADDING_LARGE;

    // System boundaries need to be large enough to contain use cases
    // Minimum size ensures reasonable container space
    const width = Math.max(
      textSize.width + padding * 3,
      200 // minimum width for containing use cases
    );

    const height = Math.max(
      150, // minimum height for containing use cases
      textSize.height + padding * 6 // extra space for content
    );

    return { width, height };
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    // Use container dimensions if available (when used as container shape),
    // otherwise calculate bounds from label
    const containerWidth = (ctx.node.data as any)?.width;
    const containerHeight = (ctx.node.data as any)?.height;
    const bounds =
      containerWidth && containerHeight
        ? { width: containerWidth, height: containerHeight }
        : this.bounds(ctx);

    const { x, y } = position;
    const padding = ctx.style.padding ?? ShapeDefaults.PADDING_LARGE;

    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: 'none',
      defaultStroke: '#666',
      defaultStrokeWidth: 1.5,
    });

    const labelY = y + padding;

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"
            stroke-dasharray="5,3" />
      
      ${renderShapeLabel({ ...ctx, style: { ...ctx.style, fontWeight: 'bold' as const } }, ctx.node.label || ctx.node.id, x + padding, labelY, 'start')}
    `;
  },
};
