import type { ShapeDefinition } from '../../types.js';

/**
 * UML Activity Merge shape
 * Diamond for merging branches in activity diagrams
 * Visually identical to decision, but semantically different
 */
export const activityMergeShape: ShapeDefinition = {
  id: 'activityMerge',

  bounds(ctx) {
    const label = ctx.node.label || '';
    const hasLabel = label.length > 0;

    if (!hasLabel) {
      return { width: 24, height: 24 };
    }

    const padding = 8;
    const labelSize = ctx.measureText(label, ctx.style);
    const size = Math.max(
      40,
      Math.max(labelSize.width, labelSize.height) + padding * 2
    );

    return { width: size, height: size };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;

    return [
      { x: w / 2, y: 0, name: 'top' },
      { x: w, y: h / 2, name: 'right' },
      { x: w / 2, y: h, name: 'bottom' },
      { x: 0, y: h / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;

    const fill = ctx.style.fill || '#ffffff';
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1;

    let svg = `<g class="activity-merge-shape">`;

    // Diamond path
    const path = `M ${x + w / 2} ${y} L ${x + w} ${y + h / 2} L ${x + w / 2} ${y + h} L ${x} ${y + h / 2} Z`;
    svg += `<path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Optional label
    if (ctx.node.label) {
      svg += `<text x="${x + w / 2}" y="${y + h / 2 + 5}" `;
      svg += `text-anchor="middle" font-size="${ctx.style.fontSize || 12}" `;
      svg += `font-family="${ctx.style.fontFamily || 'Arial'}" fill="${stroke}">`;
      svg += `${ctx.node.label}</text>`;
    }

    svg += `</g>`;
    return svg;
  },
};
