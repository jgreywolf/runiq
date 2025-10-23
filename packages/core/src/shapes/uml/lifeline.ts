import type { ShapeDefinition } from '../../types.js';

/**
 * UML Lifeline shape
 * Vertical dashed line with header box showing participant name
 * Used in sequence diagrams to represent objects/actors over time
 */
export const lifelineShape: ShapeDefinition = {
  id: 'lifeline',

  bounds(ctx) {
    const padding = ctx.style.padding || 12;
    const lineHeight = (ctx.style.fontSize || 14) + 4;

    // Custom height from data, or default
    const height = (ctx.node.data?.height as number) || 200;

    // Header box sizing
    const nameSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const stereotype = ctx.node.data?.stereotype as string | undefined;
    const stereotypeSize = stereotype
      ? ctx.measureText(`«${stereotype}»`, ctx.style)
      : { width: 0 };

    const headerWidth =
      Math.max(nameSize.width, stereotypeSize.width) + padding * 2;
    const headerHeight = padding * 2 + lineHeight * (stereotype ? 2 : 1);

    return {
      width: Math.max(headerWidth, 100),
      height: headerHeight + height,
    };
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

    const padding = ctx.style.padding || 12;
    const lineHeight = (ctx.style.fontSize || 14) + 4;
    const stereotype = ctx.node.data?.stereotype as string | undefined;

    const fill = ctx.style.fill || '#ffffff';
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1;

    // Calculate header height
    const headerHeight = padding * 2 + lineHeight * (stereotype ? 2 : 1);

    let svg = `<g class="lifeline-shape">`;

    // Header box
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${headerHeight}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    let textY = y + padding + lineHeight * 0.7;

    // Optional stereotype
    if (stereotype) {
      svg += `<text x="${x + w / 2}" y="${textY}" `;
      svg += `text-anchor="middle" font-size="${(ctx.style.fontSize || 14) * 0.9}" `;
      svg += `font-family="${ctx.style.fontFamily || 'Arial'}" fill="${stroke}">`;
      svg += `«${stereotype}»</text>`;
      textY += lineHeight;
    }

    // Object/participant name
    svg += `<text x="${x + w / 2}" y="${textY}" `;
    svg += `text-anchor="middle" font-size="${ctx.style.fontSize || 14}" `;
    svg += `font-family="${ctx.style.fontFamily || 'Arial'}" `;
    svg += `font-weight="bold" fill="${stroke}">`;
    svg += `${ctx.node.label || ''}</text>`;

    // Vertical dashed line (lifeline)
    const lineX = x + w / 2;
    const lineStartY = y + headerHeight;
    const lineEndY = y + bounds.height;

    svg += `<line x1="${lineX}" y1="${lineStartY}" x2="${lineX}" y2="${lineEndY}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" stroke-dasharray="5,5" />`;

    svg += `</g>`;
    return svg;
  },
};
