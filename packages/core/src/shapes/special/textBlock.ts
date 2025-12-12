import type { ShapeDefinition } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Text block - Simple text container for comments/notes
 * Rectangle with dashed border and transparent/light fill
 */
export const textBlockShape: ShapeDefinition = {
  id: 'textBlock',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 16; // Extra padding for readability

    return {
      width: Math.max(textSize.width + padding * 2, 100),
      height: Math.max(textSize.height + padding * 2, 40),
    };
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

    const fill = ctx.style.fill || '#fffef0'; // Very light yellow tint for notes
    const stroke = ctx.style.stroke || '#999'; // Lighter gray for comments
    const strokeWidth = ctx.style.strokeWidth || 1;
    const label = ctx.node.label || ctx.node.id;
    const centerX = x + bounds.width / 2;
    const centerY = y + bounds.height / 2;

    // Use custom style for lighter gray text
    const labelStyle = { ...ctx.style, color: stroke };

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"
            stroke-dasharray="4 2" />
      ${renderShapeLabel({ ...ctx, style: labelStyle }, label, centerX, centerY)}
    `;
  },
};
