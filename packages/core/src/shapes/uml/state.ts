import type { ShapeDefinition } from '../../types.js';

/**
 * UML State shape
 * Rounded rectangle representing a state in a state machine diagram
 * Can contain state name and internal activities (entry/do/exit)
 */
export const stateShape: ShapeDefinition = {
  id: 'state',

  bounds(ctx) {
    const padding = ctx.style.padding || 12;
    const lineHeight = (ctx.style.fontSize || 14) + 4;
    
    const activities = (ctx.node.data?.activities as string[]) || [];
    const nameSize = ctx.measureText(ctx.node.label || '', ctx.style);
    
    // Calculate width based on longest text
    let maxWidth = nameSize.width;
    activities.forEach((activity) => {
      const activitySize = ctx.measureText(activity, ctx.style);
      maxWidth = Math.max(maxWidth, activitySize.width);
    });
    
    const width = maxWidth + padding * 2;
    
    // Height: name + optional separator + activities
    let height = padding + lineHeight + padding; // Name with padding
    
    if (activities.length > 0) {
      height += 1 + padding * 0.5; // Separator
      height += activities.length * lineHeight;
      height += padding * 0.5;
    }
    
    return { width: Math.max(width, 80), height: Math.max(height, 50) };
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
    const activities = (ctx.node.data?.activities as string[]) || [];
    
    const fill = ctx.style.fill || '#ffffff';
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const cornerRadius = 10;
    
    let svg = `<g class="state-shape">`;
    
    // Rounded rectangle
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" `;
    svg += `rx="${cornerRadius}" ry="${cornerRadius}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
    
    // State name
    let currentY = y + padding + lineHeight * 0.7;
    svg += `<text x="${x + w / 2}" y="${currentY}" `;
    svg += `text-anchor="middle" font-size="${ctx.style.fontSize || 14}" `;
    svg += `font-family="${ctx.style.fontFamily || 'Arial'}" `;
    svg += `font-weight="bold" fill="${stroke}">`;
    svg += `${ctx.node.label || ''}</text>`;
    
    // Optional activities section
    if (activities.length > 0) {
      currentY += lineHeight * 0.3 + padding * 0.3;
      
      // Separator line
      svg += `<line x1="${x + padding}" y1="${currentY}" `;
      svg += `x2="${x + w - padding}" y2="${currentY}" `;
      svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;
      
      currentY += padding * 0.7;
      
      // Activity list
      activities.forEach((activity) => {
        currentY += lineHeight * 0.7;
        svg += `<text x="${x + padding}" y="${currentY}" `;
        svg += `font-size="${(ctx.style.fontSize || 14) * 0.9}" `;
        svg += `font-family="${ctx.style.fontFamily || 'Arial'}" fill="${stroke}">`;
        svg += `${activity}</text>`;
        currentY += lineHeight * 0.3;
      });
    }
    
    svg += `</g>`;
    return svg;
  },
};
