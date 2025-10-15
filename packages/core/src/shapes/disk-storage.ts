import type { ShapeDefinition } from '../types.js';

/**
 * Disk storage - flattened cylinder for disk/platter storage
 * Very short cylinder (disk shape) for magnetic disk storage
 * Wider than tall to emphasize disk shape
 */
export const diskStorageShape: ShapeDefinition = {
  id: 'disk',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const padding = ctx.style.padding || 12;

    const width = Math.max(textSize.width + padding * 2, 100);
    const height = Math.max(textSize.height + padding * 2, 40); // Very short

    return { width, height };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;
    const ellipseH = h * 0.25; // Top ellipse height

    return [
      { x: w / 2, y: ellipseH, name: 'top' }, // Below top ellipse
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
    const ellipseH = h * 0.25; // Very flat ellipse
    const rx = w / 2;
    const ry = ellipseH;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const font = ctx.style.font || 'sans-serif';
    const fontSize = ctx.style.fontSize || 14;

    const cx = x + w / 2;
    const cy = y + h / 2;

    return `
      <g>
        <!-- Top ellipse -->
        <ellipse cx="${cx}" cy="${y + ry}" rx="${rx}" ry="${ry}"
                 fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        
        <!-- Side lines -->
        <line x1="${x}" y1="${y + ry}" x2="${x}" y2="${y + h - ry}"
              stroke="${stroke}" stroke-width="${strokeWidth}" />
        <line x1="${x + w}" y1="${y + ry}" x2="${x + w}" y2="${y + h - ry}"
              stroke="${stroke}" stroke-width="${strokeWidth}" />
        
        <!-- Side rectangles for fill -->
        <rect x="${x}" y="${y + ry}" width="${w}" height="${h - ry * 2}"
              fill="${fill}" stroke="none" />
        
        <!-- Bottom curved path -->
        <path d="M ${x},${y + h - ry} Q ${cx},${y + h + ry} ${x + w},${y + h - ry}"
              fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />
        
        <text x="${cx}" y="${cy}"
              text-anchor="middle" dominant-baseline="middle"
              font-family="${font}" font-size="${fontSize}">
          ${ctx.node.label || ''}
        </text>
      </g>
    `;
  },
};
