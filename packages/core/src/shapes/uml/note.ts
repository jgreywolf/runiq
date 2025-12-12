import type { ShapeDefinition } from '../../types/index.js';
import { calculateRectangularAnchors } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * UML Note shape
 * Displays a note/comment with a dog-eared corner
 * Used in all UML diagrams to add annotations and comments
 */
export const noteShape: ShapeDefinition = {
  id: 'note',

  bounds(ctx) {
    const padding = ctx.style.padding || 12;
    const lineHeight = (ctx.style.fontSize || 14) + 4;

    // Check for multi-line notes
    const lines = (ctx.node.data?.lines as string[]) || [ctx.node.label || ''];

    // Calculate width based on longest line
    let maxWidth = 0;
    lines.forEach((line) => {
      const lineSize = ctx.measureText(line, ctx.style);
      maxWidth = Math.max(maxWidth, lineSize.width);
    });

    const width = maxWidth + padding * 2;
    const height = padding * 2 + lines.length * lineHeight;

    return { width: Math.max(width, 100), height: Math.max(height, 60) };
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;

    const padding = ctx.style.padding || 12;
    const lineHeight = (ctx.style.fontSize || 14) + 4;
    const dogEarSize = 12; // Size of the folded corner

    // Notes typically have a light yellow background
    const fill = ctx.style.fill || '#ffffcc';
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1;

    let svg = `<g class="note-shape">`;

    // Note shape with dog-eared corner (top-right)
    svg += `<path d="`;
    svg += `M ${x} ${y} `;
    svg += `L ${x + w - dogEarSize} ${y} `;
    svg += `L ${x + w} ${y + dogEarSize} `;
    svg += `L ${x + w} ${y + h} `;
    svg += `L ${x} ${y + h} `;
    svg += `Z" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Dog-ear fold line
    svg += `<path d="`;
    svg += `M ${x + w - dogEarSize} ${y} `;
    svg += `L ${x + w - dogEarSize} ${y + dogEarSize} `;
    svg += `L ${x + w} ${y + dogEarSize}" `;
    svg += `fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Text content
    const lines = (ctx.node.data?.lines as string[]) || [ctx.node.label || ''];
    let currentY = y + padding + lineHeight * 0.7;

    const textStyle = { ...ctx.style, color: stroke };
    lines.forEach((line) => {
      svg += renderShapeLabel(
        { ...ctx, style: textStyle },
        line,
        x + padding,
        currentY,
        'start'
      );
      currentY += lineHeight;
    });

    svg += `</g>`;
    return svg;
  },
};
