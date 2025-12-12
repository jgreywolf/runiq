import type { ShapeDefinition } from '../../types/index.js';
import { calculateRectangularAnchors } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * UML Interaction Fragment shape
 * Frame with operator label (alt, loop, opt, par, etc.)
 * Used in sequence diagrams to show control flow
 *
 * Note: Shape ID is 'interactionFragment' because 'fragment' is a reserved keyword
 * in the Langium grammar for sequence diagram fragment statements.
 */
export const fragmentShape: ShapeDefinition = {
  id: 'interactionFragment',

  bounds(ctx) {
    // Custom dimensions or defaults
    const width = (ctx.node.data?.width as number) || 200;
    const height = (ctx.node.data?.height as number) || 120;

    return { width, height };
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
    const condition = ctx.node.data?.condition as string | undefined;

    const fill = ctx.style.fill || '#ffffff';
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1;

    // Pentagon dimensions for operator label
    const pentagonWidth = 60;
    const pentagonHeight = 25;
    const pentagonIndent = 10; // The diagonal cut

    let svg = `<g class="fragment-shape">`;

    // Main frame rectangle
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Pentagon for operator label (top-left corner)
    svg += `<path d="`;
    svg += `M ${x} ${y} `;
    svg += `L ${x + pentagonWidth} ${y} `;
    svg += `L ${x + pentagonWidth + pentagonIndent} ${y + pentagonHeight} `;
    svg += `L ${x} ${y + pentagonHeight} `;
    svg += `Z" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Operator text (e.g., "alt", "loop", "opt")
    const operatorStyle = { ...ctx.style, color: stroke, fontWeight: 'bold' };
    svg += renderShapeLabel(
      { ...ctx, style: operatorStyle },
      ctx.node.label || '',
      x + pentagonWidth / 2,
      y + pentagonHeight * 0.7
    );

    // Optional condition text (e.g., "[x > 0]")
    if (condition) {
      const conditionY = y + pentagonHeight + lineHeight;
      const conditionStyle = {
        ...ctx.style,
        fontSize: (ctx.style.fontSize || 14) * 0.9,
        color: stroke,
      };
      svg += renderShapeLabel(
        { ...ctx, style: conditionStyle },
        condition,
        x + padding,
        conditionY
      );
    }

    svg += `</g>`;
    return svg;
  },
};
