import type { ShapeDefinition } from '../../types/index.js';

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
    const stereotypeRaw = ctx.node.data?.stereotype as
      | string
      | string[]
      | undefined;
    const stereotypes = Array.isArray(stereotypeRaw)
      ? stereotypeRaw
      : stereotypeRaw
        ? [stereotypeRaw]
        : [];
    const stereotypeText =
      stereotypes.length > 0 ? stereotypes.map((s) => `«${s}»`).join(' ') : '';
    const stereotypeSize = stereotypeText
      ? ctx.measureText(stereotypeText, ctx.style)
      : { width: 0 };

    const headerWidth =
      Math.max(nameSize.width, stereotypeSize.width) + padding * 2;
    const headerHeight =
      padding * 2 + lineHeight * (stereotypes.length > 0 ? 2 : 1);

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
    const stereotypeRaw = ctx.node.data?.stereotype as
      | string
      | string[]
      | undefined;
    const stereotypes = Array.isArray(stereotypeRaw)
      ? stereotypeRaw
      : stereotypeRaw
        ? [stereotypeRaw]
        : [];
    const stereotypeText =
      stereotypes.length > 0 ? stereotypes.map((s) => `«${s}»`).join(' ') : '';

    const fill = ctx.style.fill || '#ffffff';
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const fontFamily =
      typeof ctx.style.fontFamily === 'string' ? ctx.style.fontFamily : 'Arial';

    // Calculate header height
    const headerHeight =
      padding * 2 + lineHeight * (stereotypes.length > 0 ? 2 : 1);

    let svg = `<g class="lifeline-shape">`;

    // Header box
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${headerHeight}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    let textY = y + padding + lineHeight * 0.7;

    // Optional stereotype(s)
    if (stereotypeText) {
      svg += `<text x="${x + w / 2}" y="${textY}" `;
      svg += `text-anchor="middle" font-size="${(ctx.style.fontSize || 14) * 0.9}" `;
      svg += `font-family="${fontFamily}" fill="${stroke}">`;
      svg += `${stereotypeText}</text>`;
      textY += lineHeight;
    }

    // Object/participant name
    svg += `<text x="${x + w / 2}" y="${textY}" `;
    svg += `text-anchor="middle" font-size="${ctx.style.fontSize || 14}" `;
    svg += `font-family="${fontFamily}" `;
    svg += `font-weight="bold" fill="${stroke}">`;
    svg += `${ctx.node.label || ''}</text>`;

    // Vertical dashed line (lifeline)
    const lineX = x + w / 2;
    const lineStartY = y + headerHeight;
    const lineEndY = y + bounds.height;

    svg += `<line x1="${lineX}" y1="${lineStartY}" x2="${lineX}" y2="${lineEndY}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" stroke-dasharray="5,5" />`;

    // State invariant (constraint shown in curly braces)
    if (ctx.node.stateInvariant) {
      const invariantText = `{${ctx.node.stateInvariant}}`;
      const invariantY = y + headerHeight + (bounds.height - headerHeight) / 2;
      const invariantSize = ctx.measureText(invariantText, ctx.style);
      const invariantPadding = 8;
      const boxWidth = invariantSize.width + invariantPadding * 2;
      const boxHeight = lineHeight + invariantPadding;

      // Note box for state invariant
      svg += `<rect x="${lineX - boxWidth / 2}" y="${invariantY - boxHeight / 2}" `;
      svg += `width="${boxWidth}" height="${boxHeight}" `;
      svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" `;
      svg += `stroke-dasharray="3,3" />`;

      // Constraint text
      svg += `<text x="${lineX}" y="${invariantY + lineHeight * 0.3}" `;
      svg += `text-anchor="middle" font-size="${(ctx.style.fontSize || 14) * 0.9}" `;
      svg += `font-family="${fontFamily}" font-style="italic" fill="${stroke}">`;
      svg += `${invariantText}</text>`;
    }

    svg += `</g>`;
    return svg;
  },
};
