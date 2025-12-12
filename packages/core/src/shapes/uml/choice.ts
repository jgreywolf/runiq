import type { ShapeDefinition } from '../../types/index.js';
import { calculateDiamondAnchors } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

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
    return calculateDiamondAnchors(ctx, this.bounds(ctx));
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
      const labelStyle = {
        ...ctx.style,
        fontSize: (ctx.style.fontSize || 14) * 0.8,
      };
      const labelCtx = { ...ctx, style: labelStyle };
      svg += renderShapeLabel(
        labelCtx,
        ctx.node.label,
        x + w / 2,
        y + h / 2 + 5
      );
    }

    svg += `</g>`;
    return svg;
  },
};
