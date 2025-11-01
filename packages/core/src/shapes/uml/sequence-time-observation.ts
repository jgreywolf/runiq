import type { ShapeDefinition } from '../../types.js';

/**
 * UML Time Observation shape
 * Represents timing observation points in sequence diagrams
 * UML 2.5: Time observations mark specific timing points in interactions
 * Shape: Hourglass symbol with optional label
 */
export const timeObservationShape: ShapeDefinition = {
  id: 'timeObservation',

  bounds(ctx) {
    const padding = ctx.style.padding || 8;
    const hourglassSize = 30; // Fixed size for hourglass icon
    
    let width = hourglassSize + padding * 2;
    let height = hourglassSize + padding * 2;

    // If there's a label, add space for it
    if (ctx.node.label) {
      const textSize = ctx.measureText(ctx.node.label, ctx.style);
      width = Math.max(width, textSize.width + padding * 2);
      height += textSize.height + padding;
    }

    return {
      width: Math.max(width, 40),
      height: Math.max(height, 40),
    };
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

    const fill = ctx.style.fill || '#ffffff';
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1.5;
    const fontSize = ctx.style.fontSize || 12;
    const fontFamily = ctx.style.font || 'Arial';

    let svg = `<g class="time-observation-shape">`;

    // Hourglass icon dimensions
    const iconSize = 24;
    const iconX = x + w / 2 - iconSize / 2;
    const iconY = y + 8;

    // Hourglass shape (two triangles meeting at center)
    const topTriangle = `M ${iconX} ${iconY}
                        L ${iconX + iconSize} ${iconY}
                        L ${iconX + iconSize / 2} ${iconY + iconSize / 2}
                        Z`;

    const bottomTriangle = `M ${iconX + iconSize / 2} ${iconY + iconSize / 2}
                           L ${iconX} ${iconY + iconSize}
                           L ${iconX + iconSize} ${iconY + iconSize}
                           Z`;

    // Top triangle
    svg += `<path d="${topTriangle}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Bottom triangle
    svg += `<path d="${bottomTriangle}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Center line (waist of hourglass)
    svg += `<line x1="${iconX}" y1="${iconY + iconSize / 2}" `;
    svg += `x2="${iconX + iconSize}" y2="${iconY + iconSize / 2}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Optional sand representation (small circle in bottom)
    const sandRadius = 3;
    svg += `<circle cx="${iconX + iconSize / 2}" cy="${iconY + iconSize - sandRadius - 2}" `;
    svg += `r="${sandRadius}" fill="${stroke}" />`;

    // Label (if provided)
    if (ctx.node.label) {
      const labelY = iconY + iconSize + fontSize + 4;
      svg += `<text x="${x + w / 2}" y="${labelY}" `;
      svg += `text-anchor="middle" font-size="${fontSize}" `;
      svg += `font-family="${fontFamily}" fill="${stroke}">`;
      svg += `${ctx.node.label}</text>`;
    }

    svg += `</g>`;
    return svg;
  },
};
