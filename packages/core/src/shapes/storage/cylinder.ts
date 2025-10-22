import type { ShapeDefinition } from '../../types.js';

/**
 * Cylinder - Database/storage shape
 * Aliases: cyl, cylinder, database, can
 */
export const cylinderShape: ShapeDefinition = {
  id: 'cylinder',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: Math.max(textSize.width + padding * 2, 60),
      height: Math.max(textSize.height + padding * 3, 80),
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;
    const ellipseH = h * 0.15; // Height of top/bottom ellipse

    return [
      { x: w / 2, y: ellipseH, name: 'top' },
      { x: w, y: h / 2, name: 'right' },
      { x: w / 2, y: h - ellipseH, name: 'bottom' },
      { x: 0, y: h / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const rx = bounds.width / 2;
    const ry = bounds.height * 0.15; // Ellipse height (15% of total)
    const cx = x + bounds.width / 2;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    return `
      <g>
        <!-- Top ellipse -->
        <ellipse cx="${cx}" cy="${y + ry}" rx="${rx}" ry="${ry}" 
                 fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        
        <!-- Side rectangles -->
        <rect x="${x}" y="${y + ry}" width="${bounds.width}" height="${bounds.height - ry * 2}" 
              fill="${fill}" stroke="none" />
        
        <!-- Side lines -->
        <line x1="${x}" y1="${y + ry}" x2="${x}" y2="${y + bounds.height - ry}" 
              stroke="${stroke}" stroke-width="${strokeWidth}" />
        <line x1="${x + bounds.width}" y1="${y + ry}" x2="${x + bounds.width}" y2="${y + bounds.height - ry}" 
              stroke="${stroke}" stroke-width="${strokeWidth}" />
        
        <!-- Bottom ellipse (only bottom arc visible) -->
        <path d="M ${x},${y + bounds.height - ry} 
                 Q ${cx},${y + bounds.height + ry} ${x + bounds.width},${y + bounds.height - ry}"
              fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />
        
        <text x="${cx}" y="${y + bounds.height / 2}" 
              text-anchor="middle" dominant-baseline="middle"
              font-family="${ctx.style.font || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}">
          ${ctx.node.label || ctx.node.id}
        </text>
      </g>
    `;
  },
};
