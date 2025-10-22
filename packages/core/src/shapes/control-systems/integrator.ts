import type { ShapeDefinition } from '../../types.js';

/**
 * Integrator Block (1/s)
 * Standard control block for integration operation
 * Shows "1/s" or "∫" symbol
 */
export const integratorShape: ShapeDefinition = {
  id: 'integrator',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || '1/s', ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: Math.max(textSize.width + padding * 2, 70),
      height: Math.max(textSize.height + padding * 2, 50),
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);

    return [
      { x: 0, y: bounds.height / 2, name: 'in' },
      { x: bounds.width, y: bounds.height / 2, name: 'out' },
      { x: bounds.width / 2, y: 0, name: 'top' },
      { x: bounds.width / 2, y: bounds.height, name: 'bottom' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    // Distinctive light blue fill for integrators
    const fill = ctx.style.fill || '#e3f2fd';
    const stroke = ctx.style.stroke || '#1976d2';
    const strokeWidth = ctx.style.strokeWidth || 2;

    const cx = x + bounds.width / 2;
    const cy = y + bounds.height / 2;

    // Use "1/s" unless label specifies otherwise
    const label = ctx.node.label || '1/s';

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${cx}" y="${cy}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" 
            font-size="${(ctx.style.fontSize || 14) + 2}"
            font-style="italic">
        ${label}
      </text>
    `;
  },
};
