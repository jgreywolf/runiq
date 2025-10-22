import type { ShapeDefinition } from '../types.js';

/**
 * Cloud shape - puffy cloud outline for cloud services, cloud storage, etc.
 * Uses cubic Bezier curves to create a bumpy, cloud-like appearance
 * Common in cloud architecture diagrams
 */
export const cloudShape: ShapeDefinition = {
  id: 'cloud',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const padding = ctx.style.padding || 12;

    // Cloud needs extra space for the bumpy outline
    // Make it wider than tall (typical cloud proportions)
    const width = Math.max(textSize.width + padding * 3, 100);
    const height = Math.max(textSize.height + padding * 2.5, 70);

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

    // Create cloud shape with multiple bumps using cubic Bezier curves
    // Cloud is composed of overlapping circular arcs to create puffy appearance
    const bump = Math.min(w, h) * 0.15; // Size of each bump

    // Start at left-middle and go clockwise creating bumps
    const cx = x + w / 2;
    const cy = y + h / 2;

    // Calculate control points for cloud bumps
    // Using cubic Bezier curves (C command) for smooth bumps
    const path = [
      // Start at left center
      `M ${x + bump},${cy}`,

      // Top-left bump
      `C ${x},${cy - bump} ${x + bump},${y + bump * 0.5} ${x + w * 0.25},${y + bump * 0.5}`,

      // Top-center bump
      `C ${x + w * 0.35},${y} ${x + w * 0.65},${y} ${x + w * 0.75},${y + bump * 0.5}`,

      // Top-right bump
      `C ${x + w - bump},${y + bump * 0.5} ${x + w},${cy - bump} ${x + w - bump},${cy}`,

      // Right-middle bump (small)
      `C ${x + w},${cy} ${x + w},${cy + bump * 0.5} ${x + w - bump * 0.5},${cy + bump}`,

      // Bottom-right bump
      `C ${x + w - bump},${y + h - bump * 0.5} ${x + w * 0.8},${y + h} ${x + w * 0.65},${y + h - bump * 0.3}`,

      // Bottom-center bump
      `C ${x + w * 0.5},${y + h} ${x + w * 0.35},${y + h - bump * 0.3} ${x + w * 0.25},${y + h - bump * 0.5}`,

      // Bottom-left bump
      `C ${x + bump},${y + h - bump * 0.5} ${x},${cy + bump} ${x + bump},${cy}`,

      `Z`,
    ].join(' ');

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const font = ctx.style.font || 'sans-serif';
    const fontSize = ctx.style.fontSize || 14;

    const textX = cx;
    const textY = cy;

    return `<g>
      <path d="${path}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${textX}" y="${textY}"
            text-anchor="middle" dominant-baseline="middle"
            font-family="${font}" font-size="${fontSize}">
        ${ctx.node.label || ''}
      </text>
    </g>`;
  },
};
