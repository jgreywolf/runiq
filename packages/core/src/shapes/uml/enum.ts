import type { ShapeDefinition } from '../../types.js';

/**
 * UML Enumeration shape
 * Displays enum with «enumeration» stereotype, name, and values
 * Used in class diagrams to show enumeration types
 */
export const enumShape: ShapeDefinition = {
  id: 'enum',

  bounds(ctx) {
    const padding = ctx.style.padding || 12;
    const lineHeight = (ctx.style.fontSize || 14) + 4;
    
    const values = (ctx.node.data?.values as string[]) || [];
    const nameSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const stereotypeSize = ctx.measureText('«enumeration»', ctx.style);
    
    // Calculate width based on longest text
    let maxWidth = Math.max(nameSize.width, stereotypeSize.width);
    values.forEach((value) => {
      const valueSize = ctx.measureText(value, ctx.style);
      maxWidth = Math.max(maxWidth, valueSize.width);
    });
    
    const width = maxWidth + padding * 2;
    
    // Height: stereotype + name + separator + values
    const height = 
      padding + // top padding
      lineHeight + // stereotype
      lineHeight + // name
      (values.length > 0 ? 1 : 0) + // separator line
      (values.length > 0 ? padding : 0) + // separator padding
      values.length * lineHeight + // values
      padding; // bottom padding
    
    return { width: Math.max(width, 100), height: Math.max(height, 60) };
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
    const values = (ctx.node.data?.values as string[]) || [];
    
    const fill = ctx.style.fill || '#ffffff';
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1;
    
    let svg = `<g class="enum-shape">`;
    
    // Main rectangle
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
    
    // Stereotype text
    let currentY = y + padding + lineHeight * 0.7;
    svg += `<text x="${x + w / 2}" y="${currentY}" `;
    svg += `text-anchor="middle" font-size="${ctx.style.fontSize || 14}" `;
    svg += `font-family="${ctx.style.fontFamily || 'Arial'}" fill="${stroke}">`;
    svg += `«enumeration»</text>`;
    
    // Enum name
    currentY += lineHeight;
    svg += `<text x="${x + w / 2}" y="${currentY}" `;
    svg += `text-anchor="middle" font-size="${ctx.style.fontSize || 14}" `;
    svg += `font-family="${ctx.style.fontFamily || 'Arial'}" `;
    svg += `font-weight="bold" fill="${stroke}">`;
    svg += `${ctx.node.label || ''}</text>`;
    
    // Separator line if there are values
    if (values.length > 0) {
      currentY += lineHeight * 0.3;
      svg += `<line x1="${x}" y1="${currentY}" x2="${x + w}" y2="${currentY}" `;
      svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;
      currentY += padding;
      
      // Value list
      values.forEach((value) => {
        currentY += lineHeight * 0.7;
        svg += `<text x="${x + padding}" y="${currentY}" `;
        svg += `font-size="${ctx.style.fontSize || 14}" `;
        svg += `font-family="${ctx.style.fontFamily || 'Arial'}" fill="${stroke}">`;
        svg += `${value}</text>`;
        currentY += lineHeight * 0.3;
      });
    }
    
    svg += `</g>`;
    return svg;
  },
};
