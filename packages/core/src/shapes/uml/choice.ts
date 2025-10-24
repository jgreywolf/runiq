import type { ShapeDefinition } from '../../types.js';

/**
 * UML Choice shape
 * Diamond indicating a branch point with guard conditions
 * Used in state machine diagrams for conditional transitions
 */
export const choiceShape: ShapeDefinition = {
  id: 'choice',

  bounds(ctx) {
    // Small diamond, optionally with label
    const size = ctx.node.label ? 40 : 24;
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

    let svg = `<g class="choice-shape">`;

    // Diamond shape
    svg += `<path d="`;
    svg += `M ${x + w / 2} ${y} `; // Top point
    svg += `L ${x + w} ${y + h / 2} `; // Right point
    svg += `L ${x + w / 2} ${y + h} `; // Bottom point
    svg += `L ${x} ${y + h / 2} `; // Left point
    svg += `Z" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Optional label (guard condition)
    if (ctx.node.label) {
      svg += `<text x="${x + w / 2}" y="${y + h / 2 + 5}" `;
      svg += `text-anchor="middle" font-size="${(ctx.style.fontSize || 14) * 0.8}" `;
      svg += `font-family="${ctx.style.fontFamily || 'Arial'}" fill="${stroke}">`;
      svg += `${ctx.node.label}</text>`;
    }

    svg += `</g>`;
    return svg;
  },
};
