import type { ShapeDefinition } from '../../types.js';

/**
 * UML Package shape
 * Displays package as a folder with a tab
 * Used in class diagrams to show package/namespace organization
 */
export const packageShape: ShapeDefinition = {
  id: 'package',

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
    const tabHeight = 20;
    const tabWidth = Math.min(w * 0.4, 80);
    
    const fill = ctx.style.fill || '#ffffff';
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1;
    
    let svg = `<g class="package-shape">`;
    
    // Package shape with tab
    // Tab at top-left
    svg += `<path d="`;
    svg += `M ${x} ${y + tabHeight} `;
    svg += `L ${x} ${y} `;
    svg += `L ${x + tabWidth} ${y} `;
    svg += `L ${x + tabWidth} ${y + tabHeight} `;
    svg += `L ${x + w} ${y + tabHeight} `;
    svg += `L ${x + w} ${y + h} `;
    svg += `L ${x} ${y + h} `;
    svg += `Z" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
    
    // Tab separator line
    svg += `<line x1="${x}" y1="${y + tabHeight}" x2="${x + tabWidth}" y2="${y + tabHeight}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;
    
    // Main body rectangle (visual guide)
    svg += `<rect x="${x}" y="${y + tabHeight}" width="${w}" height="${h - tabHeight}" `;
    svg += `fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
    
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
