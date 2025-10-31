import type { ShapeDefinition } from '../../types.js';

/**
 * UML 2.5 Activity Diagram: Swimlane (Activity Partition)
 * 
 * Swimlanes partition activities by responsibility (e.g., role, department, system).
 * Can be oriented horizontally or vertically.
 * 
 * In Runiq, swimlanes are implemented as containers with orientation property.
 * This shape provides visual rendering for swimlane headers.
 */
export const swimlaneShape: ShapeDefinition = {
  id: 'swimlane',

  bounds(ctx) {
    const text = ctx.node.label || '';
    const measured = ctx.measureText(text, ctx.style);
    
    // Default minimum size for swimlane header
    const minWidth = 150;
    const minHeight = 40;
    
    return {
      width: Math.max(measured.width + 20, minWidth),
      height: Math.max(measured.height + 20, minHeight),
    };
  },

  anchors(ctx) {
    const { width, height } = this.bounds(ctx);
    return [
      { name: 'top', x: width / 2, y: 0 },
      { name: 'right', x: width, y: height / 2 },
      { name: 'bottom', x: width / 2, y: height },
      { name: 'left', x: 0, y: height / 2 },
    ];
  },

  render(ctx, position) {
    const { x, y } = position;
    const { width, height } = this.bounds(ctx);
    const text = ctx.node.label || '';

    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1.5;
    const fill = ctx.style.fill || '#f0f0f0';
    const fontSize = ctx.style.fontSize || 14;
    const fontFamily = ctx.style.font || 'Arial';

    // Determine orientation from node data
    // Default to vertical if not specified
    const orientation = (ctx.node.data?.orientation as string) || 'vertical';

    let svg = `<g class="swimlane-shape">`;

    if (orientation === 'horizontal') {
      // Horizontal swimlane: label on left side, vertical separator
      svg += `
        <rect x="${x}" y="${y}" width="${width}" height="${height}" 
          fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        <line x1="${x + 100}" y1="${y}" x2="${x + 100}" y2="${y + height}"
          stroke="${stroke}" stroke-width="${strokeWidth}" />
        <text x="${x + 50}" y="${y + height / 2}" 
          text-anchor="middle" dominant-baseline="middle"
          font-family="${fontFamily}" font-size="${fontSize}" fill="${stroke}">
          ${text}
        </text>
      `;
    } else {
      // Vertical swimlane: label on top, horizontal separator
      svg += `
        <rect x="${x}" y="${y}" width="${width}" height="${height}" 
          fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        <line x1="${x}" y1="${y + 40}" x2="${x + width}" y2="${y + 40}"
          stroke="${stroke}" stroke-width="${strokeWidth}" />
        <text x="${x + width / 2}" y="${y + 20}" 
          text-anchor="middle" dominant-baseline="middle"
          font-family="${fontFamily}" font-size="${fontSize}" fill="${stroke}">
          ${text}
        </text>
      `;
    }

    svg += `</g>`;
    return svg;
  },
};
