import type { ShapeDefinition } from '../../types.js';

/**
 * UML Activity shape
 * Rounded rectangle representing an activity/action in an activity diagram
 * Similar to state but used in activity diagrams
 */
export const activityShape: ShapeDefinition = {
  id: 'activity',

  bounds(ctx) {
    const padding = ctx.style.padding || 12;
    const nameSize = ctx.measureText(ctx.node.label || '', ctx.style);

    const width = nameSize.width + padding * 2;
    const height = nameSize.height + padding * 2;

    return { width: Math.max(width, 100), height: Math.max(height, 50) };
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
    const cornerRadius = 10;

    let svg = `<g class="activity-shape">`;

    // Rounded rectangle
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" `;
    svg += `rx="${cornerRadius}" ry="${cornerRadius}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Activity name (centered)
    svg += `<text x="${x + w / 2}" y="${y + h / 2 + 5}" `;
    svg += `text-anchor="middle" font-size="${ctx.style.fontSize || 14}" `;
    svg += `font-family="${ctx.style.fontFamily || 'Arial'}" fill="${stroke}">`;
    svg += `${ctx.node.label || ''}</text>`;

    svg += `</g>`;
    return svg;
  },
};
