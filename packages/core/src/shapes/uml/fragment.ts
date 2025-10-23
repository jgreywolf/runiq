import type { ShapeDefinition } from '../../types.js';

/**
 * UML Interaction Fragment shape
 * Frame with operator label (alt, loop, opt, par, etc.)
 * Used in sequence diagrams to show control flow
 */
export const fragmentShape: ShapeDefinition = {
  id: 'fragment',

  bounds(ctx) {
    // Custom dimensions or defaults
    const width = (ctx.node.data?.width as number) || 200;
    const height = (ctx.node.data?.height as number) || 120;

    return { width, height };
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
    svg += `<text x="${x + pentagonWidth / 2}" y="${y + pentagonHeight * 0.7}" `;
    svg += `text-anchor="middle" font-size="${ctx.style.fontSize || 14}" `;
    svg += `font-family="${ctx.style.fontFamily || 'Arial'}" `;
    svg += `font-weight="bold" fill="${stroke}">`;
    svg += `${ctx.node.label || ''}</text>`;

    // Optional condition text (e.g., "[x > 0]")
    if (condition) {
      const conditionY = y + pentagonHeight + lineHeight;
      svg += `<text x="${x + padding}" y="${conditionY}" `;
      svg += `font-size="${(ctx.style.fontSize || 14) * 0.9}" `;
      svg += `font-family="${ctx.style.fontFamily || 'Arial'}" fill="${stroke}">`;
      svg += `${condition}</text>`;
    }

    svg += `</g>`;
    return svg;
  },
};
