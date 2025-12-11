import type { ShapeDefinition } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Trapezoid (Base Down) - Priority operations
 * Aliases: trap-b, trapezoid, priority
 */
export const trapezoidShape: ShapeDefinition = {
  id: 'trapezoid',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: Math.max(textSize.width + padding * 3, 80),
      height: textSize.height + padding * 2,
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;

    return [
      { x: w / 2, y: 0, name: 'top' },
      { x: w, y: h, name: 'right' },
      { x: w / 2, y: h, name: 'bottom' },
      { x: 0, y: h, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const inset = bounds.width * 0.2; // 20% inset at top

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const label = ctx.node.label || ctx.node.id;

    // Trapezoid with narrower top
    const points = [
      `${x + inset},${y}`, // top left
      `${x + bounds.width - inset},${y}`, // top right
      `${x + bounds.width},${y + bounds.height}`, // bottom right
      `${x},${y + bounds.height}`, // bottom left
    ].join(' ');

    return `
      <polygon points="${points}" 
               fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, label, x + bounds.width / 2, y + bounds.height / 2)}
    `;
  },
};

/**
 * Flipped Trapezoid (Base Up) - Manual operations
 * Aliases: trap-t, inv-trapezoid, manual
 */
export const flippedTrapezoidShape: ShapeDefinition = {
  id: 'flippedTrapezoid',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: Math.max(textSize.width + padding * 3, 80),
      height: textSize.height + padding * 2,
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;

    return [
      { x: w / 2, y: 0, name: 'top' },
      { x: w, y: 0, name: 'right' },
      { x: w / 2, y: h, name: 'bottom' },
      { x: 0, y: 0, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const inset = bounds.width * 0.2; // 20% inset at bottom

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const label = ctx.node.label || ctx.node.id;

    // Inverted trapezoid with narrower bottom
    const points = [
      `${x},${y}`, // top left
      `${x + bounds.width},${y}`, // top right
      `${x + bounds.width - inset},${y + bounds.height}`, // bottom right
      `${x + inset},${y + bounds.height}`, // bottom left
    ].join(' ');

    return `
      <polygon points="${points}" 
               fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, label, x + bounds.width / 2, y + bounds.height / 2)}
    `;
  },
};
