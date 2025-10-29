import type { ShapeDefinition } from '../../types.js';

/**
 * C4 Model: Component
 * Represents a grouping of related functionality (code module, service, etc.)
 * Smaller rectangle with title and component type
 */
export const c4Component: ShapeDefinition = {
  id: 'c4-component',
  bounds(ctx) {
    const labelSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;
    const minWidth = 120;
    const minHeight = 60;

    return {
      width: Math.max(labelSize.width + padding * 2, minWidth),
      height: Math.max(labelSize.height + padding * 2, minHeight),
    };
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const fill = ctx.style.fill || '#85BBF0'; // C4 component lighter blue
    const stroke = ctx.style.stroke || '#5A9BD5';
    const strokeWidth = ctx.style.strokeWidth || 1.5;
    const textColor = ctx.style.textColor || '#000000'; // Dark text for lighter background
    const rx = ctx.style.rx || 6;

    return `
      <!-- C4 Component -->
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
            rx="${rx}" ry="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <!-- Label -->
      <text x="${x + bounds.width / 2}" y="${y + bounds.height / 2}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" font-size="${ctx.style.fontSize || 13}"
            fill="${textColor}" font-weight="600">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};
