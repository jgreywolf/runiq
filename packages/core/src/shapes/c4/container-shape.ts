import type { ShapeDefinition } from '@runiq/core';

/**
 * C4 Model: Container
 * Represents an application or data store (web app, database, mobile app, etc.)
 * Medium rounded rectangle with title and technology label
 */
export const c4Container: ShapeDefinition = {
  id: 'c4-container',
  bounds(ctx) {
    const labelSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 16;
    const minWidth = 140;
    const minHeight = 80;
    
    // Reserve space for technology label (smaller text)
    const techHeight = 18;

    return {
      width: Math.max(labelSize.width + padding * 2, minWidth),
      height: Math.max(labelSize.height + padding * 2 + techHeight, minHeight),
    };
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const fill = ctx.style.fill || '#438DD5';  // C4 container light blue
    const stroke = ctx.style.stroke || '#2E6295';
    const strokeWidth = ctx.style.strokeWidth || 2;
    const textColor = ctx.style.textColor || '#ffffff';
    const rx = ctx.style.rx || 8;

    // Extract technology from label or use custom property
    // Format: "Web Application\n[JavaScript, React]" or just "Web Application"
    const label = ctx.node.label || ctx.node.id;
    const lines = label.split('\\n');
    const title = lines[0];
    const technology = lines[1] || '';

    const titleY = y + bounds.height / 2 - (technology ? 8 : 0);
    const techY = y + bounds.height / 2 + 12;

    return `
      <!-- C4 Container -->
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
            rx="${rx}" ry="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <!-- Title -->
      <text x="${x + bounds.width / 2}" y="${titleY}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}"
            fill="${textColor}" font-weight="bold">
        ${title}
      </text>
      
      ${technology ? `
      <!-- Technology Label -->
      <text x="${x + bounds.width / 2}" y="${techY}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" font-size="${(ctx.style.fontSize || 14) - 2}"
            fill="${textColor}" font-style="italic">
        ${technology}
      </text>
      ` : ''}
    `;
  },
};
