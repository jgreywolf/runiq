import type { ShapeDefinition } from '../../types.js';

/**
 * UML Package shape
 * Displays package as a folder with a tab
 * Used in class diagrams to show package/namespace organization
 */
export const packageShape: ShapeDefinition = {
  id: 'umlPackage',

  bounds(ctx) {
    const padding = ctx.style.padding || 12;
    const nameSize = ctx.measureText(ctx.node.label || '', ctx.style);

    // Package should be wider and taller than just the label
    // to accommodate nested content visually
    const width = Math.max(nameSize.width + padding * 3, 140);
    const height = Math.max(nameSize.height + padding * 4, 100);

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
    const tabHeight = 22;
    const tabWidth = Math.min(w * 0.35, 70);

    const fill = ctx.style.fill || '#ffffff';
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1;

    let svg = `<g class="package-shape">`;

    // UML Package shape - folder with tab on top-left
    // Main body rectangle
    svg += `<rect x="${x}" y="${y + tabHeight}" width="${w}" height="${h - tabHeight}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Tab rectangle on top
    svg += `<rect x="${x}" y="${y}" width="${tabWidth}" height="${tabHeight}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
    
    // Remove the line between tab and body by drawing a white line over it
    // This creates the "folder tab" appearance
    svg += `<line x1="${x + strokeWidth}" y1="${y + tabHeight}" `;
    svg += `x2="${x + tabWidth - strokeWidth}" y2="${y + tabHeight}" `;
    svg += `stroke="${fill}" stroke-width="${strokeWidth * 1.5}" />`;

    // Package name in the main body
    const textY = y + tabHeight + padding + (ctx.style.fontSize || 14);
    svg += `<text x="${x + padding}" y="${textY}" `;
    svg += `font-size="${ctx.style.fontSize || 14}" `;
    svg += `font-family="${ctx.style.fontFamily || 'Arial'}" `;
    svg += `font-weight="bold" fill="${stroke}">`;
    svg += `${ctx.node.label || ''}</text>`;

    svg += `</g>`;
    return svg;
  },
};
