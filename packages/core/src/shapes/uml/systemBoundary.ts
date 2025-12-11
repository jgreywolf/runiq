import { ShapeDefaults } from '../../constants.js';
import type { ShapeDefinition } from '../../types/index.js';

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
    const padding = ctx.style.padding ?? ShapeDefaults.PADDING_LARGE;

    const fill = ctx.style.fill || 'none';
    const stroke = ctx.style.stroke || '#666';
    const strokeWidth = ctx.style.strokeWidth || 1.5;

    const labelY = y + padding;

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"
            stroke-dasharray="5,3" />
      
      <text x="${x + padding}" y="${labelY}" text-anchor="start" dominant-baseline="hanging"
            font-family="${ctx.style.font || 'sans-serif'}" 
            font-size="${ctx.style.fontSize || 14}"
            font-weight="bold">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};
