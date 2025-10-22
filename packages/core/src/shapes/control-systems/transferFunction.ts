import type { ShapeDefinition } from '../../types.js';

/**
 * Transfer Function Block
 * Standard control system block showing transfer function as fraction
 * Format: Numerator / Denominator (e.g., K/(s+1), (s+2)/(s^2+3s+2))
 */
export const transferFunctionShape: ShapeDefinition = {
  id: 'transferFunction',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: Math.max(textSize.width + padding * 2, 80),
      height: Math.max(textSize.height * 2 + padding * 3, 60), // Extra height for fraction
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);

    return [
      { x: 0, y: bounds.height / 2, name: 'in' }, // Left center
      { x: bounds.width, y: bounds.height / 2, name: 'out' }, // Right center
      { x: bounds.width / 2, y: 0, name: 'top' }, // Top center
      { x: bounds.width / 2, y: bounds.height, name: 'bottom' }, // Bottom center
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const fill = ctx.style.fill || '#ffffff';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 2;

    // Parse label to extract numerator/denominator
    const label = ctx.node.label || ctx.node.id;
    let numerator = label;
    let denominator = '';

    // Check for fraction format: "num/den" or "num / den"
    const fractionMatch = label.match(/^(.+?)\s*\/\s*(.+)$/);
    if (fractionMatch) {
      numerator = fractionMatch[1].trim();
      denominator = fractionMatch[2].trim();
    }

    const cx = x + bounds.width / 2;
    const cy = y + bounds.height / 2;
    const fractionBarLength = bounds.width * 0.7;

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${
        denominator
          ? `
        <text x="${cx}" y="${cy - 8}" 
              text-anchor="middle" dominant-baseline="middle"
              font-family="${ctx.style.font || 'sans-serif'}" 
              font-size="${(ctx.style.fontSize || 14) - 2}">
          ${numerator}
        </text>
        
        <line x1="${cx - fractionBarLength / 2}" y1="${cy}" 
              x2="${cx + fractionBarLength / 2}" y2="${cy}"
              stroke="${stroke}" stroke-width="${strokeWidth}" />
        
        <text x="${cx}" y="${cy + 12}" 
              text-anchor="middle" dominant-baseline="middle"
              font-family="${ctx.style.font || 'sans-serif'}" 
              font-size="${(ctx.style.fontSize || 14) - 2}">
          ${denominator}
        </text>
      `
          : `
        <text x="${cx}" y="${cy}" 
              text-anchor="middle" dominant-baseline="middle"
              font-family="${ctx.style.font || 'sans-serif'}" 
              font-size="${ctx.style.fontSize || 14}">
          ${numerator}
        </text>
      `
      }
    `;
  },
};
