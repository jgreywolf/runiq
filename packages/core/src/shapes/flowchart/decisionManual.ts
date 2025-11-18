import type { ShapeDefinition } from '../../types.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Decision manual - Diamond with wavy bottom edge
 * Manual decision point combining diamond with document-style wave
 */
export const decisionManualShape: ShapeDefinition = {
  id: 'decisionManual',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 16;

    const size = Math.max(
      textSize.width * 1.5 + padding * 2,
      textSize.height * 1.5 + padding * 2,
      80
    );

    return {
      width: size,
      height: size,
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
    const w = bounds.width;
    const h = bounds.height;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const label = ctx.node.label || ctx.node.id;

    const midX = x + w / 2;
    const midY = y + h / 2;

    // Diamond with wavy bottom edge (wave stays within diamond bounds)
    const path = [
      `M ${midX} ${y}`, // Top point
      `L ${x + w} ${midY}`, // Right point
      // Wavy bottom - oscillates around the straight line from right to left point
      `Q ${x + w * 0.875} ${y + h * 0.8} ${x + w * 0.75} ${y + h * 0.875}`,
      `Q ${x + w * 0.625} ${y + h * 0.95} ${midX} ${y + h * 0.9}`,
      `Q ${x + w * 0.375} ${y + h * 0.95} ${x + w * 0.25} ${y + h * 0.875}`,
      `Q ${x + w * 0.125} ${y + h * 0.8} ${x} ${midY}`, // Left point
      `Z`,
    ].join(' ');

    return `
      <path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, label, midX, midY)}
    `;
  },
};
