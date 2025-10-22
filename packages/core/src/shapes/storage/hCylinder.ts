import type { ShapeDefinition } from '../../types.js';

/**
 * Horizontal cylinder - for horizontal database/storage
 * Cylinder lying on its side with vertical ellipses on left and right
 * Common for magnetic disk or drum storage
 */
export const hCylinderShape: ShapeDefinition = {
  id: 'hCylinder',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const padding = ctx.style.padding || 12;

    const width = Math.max(textSize.width + padding * 3, 100); // Extra width for ellipses
    const height = Math.max(textSize.height + padding * 2, 60);

    return { width, height };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;
    const ellipseW = w * 0.1; // 10% for ellipse width

    return [
      { x: w / 2, y: 0, name: 'top' },
      { x: w - ellipseW, y: h / 2, name: 'right' }, // Inside right ellipse
      { x: w / 2, y: h, name: 'bottom' },
      { x: ellipseW, y: h / 2, name: 'left' }, // Inside left ellipse
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;
    const ellipseW = w * 0.1; // Width of side ellipses
    const rx = ellipseW;
    const ry = h / 2;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const font = ctx.style.font || 'sans-serif';
    const fontSize = ctx.style.fontSize || 14;

    const cx = x + w / 2;
    const cy = y + h / 2;

    return `
      <g>
        <!-- Body rectangles -->
        <rect x="${x + ellipseW}" y="${y}" width="${w - ellipseW * 2}" height="${h}"
              fill="${fill}" stroke="none" />
        
        <!-- Top and bottom lines -->
        <line x1="${x + ellipseW}" y1="${y}" x2="${x + w - ellipseW}" y2="${y}"
              stroke="${stroke}" stroke-width="${strokeWidth}" />
        <line x1="${x + ellipseW}" y1="${y + h}" x2="${x + w - ellipseW}" y2="${y + h}"
              stroke="${stroke}" stroke-width="${strokeWidth}" />
        
        <!-- Left ellipse -->
        <ellipse cx="${x + ellipseW}" cy="${cy}" rx="${rx}" ry="${ry}"
                 fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        
        <!-- Right ellipse (front) -->
        <ellipse cx="${x + w - ellipseW}" cy="${cy}" rx="${rx}" ry="${ry}"
                 fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        
        <text x="${cx}" y="${cy}"
              text-anchor="middle" dominant-baseline="middle"
              font-family="${font}" font-size="${fontSize}">
          ${ctx.node.label || ''}
        </text>
      </g>
    `;
  },
};
