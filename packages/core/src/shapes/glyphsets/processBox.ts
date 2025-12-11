import type { ShapeDefinition } from '../../types/index.js';

/**
 * Darken a hex color by 20% for borders
 */
function darkenColor(hex: string): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - 40);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - 40);
  const b = Math.max(0, (num & 0x0000ff) - 40);
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

/**
 * Process Box - SmartArt-style box for process steps
 *
 * Features:
 * - Gradient fill with shadow
 * - Rounded corners
 * - Professional Office-style appearance
 *
 * Usage in glyphsets for horizontal/vertical process flows
 */
export const processBoxShape: ShapeDefinition = {
  id: 'processBox',

  bounds(ctx) {
    const label = ctx.node.label || '';
    const fontSize = ctx.style.fontSize || 14;

    // Estimate width based on label length
    const minWidth = 120;
    const estimatedWidth = Math.max(minWidth, label.length * (fontSize * 0.6) + 40);

    return {
      width: estimatedWidth,
      height: 60,
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    return [
      { x: bounds.width / 2, y: 0, name: 'top' },
      { x: bounds.width, y: bounds.height / 2, name: 'right' },
      { x: bounds.width / 2, y: bounds.height, name: 'bottom' },
      { x: 0, y: bounds.height / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const label = ctx.node.label || '';

    // Check for color in node data (for theme support)
    const data = ctx.node.data as { color?: string } | undefined;
    const themeColor = data?.color;

    const stroke = ctx.style.stroke || (themeColor ? darkenColor(themeColor) : '#2E5AAC');
    const fill = ctx.style.fill || themeColor || '#4472C4'; // Office blue
    const strokeWidth = ctx.style.strokeWidth || 0;
    const fontSize = ctx.style.fontSize || 14;
    const fontFamily = typeof ctx.style.font === 'string' ? ctx.style.font : 'Arial, sans-serif';

    const cornerRadius = 4;
    const x = position.x;
    const y = position.y;

    let svg = '';

    // Shadow
    svg += `<rect x="${x + 2}" y="${y + 2}" width="${bounds.width}" height="${bounds.height}" `;
    svg += `rx="${cornerRadius}" ry="${cornerRadius}" `;
    svg += `fill="#000000" fill-opacity="0.15" />`;

    // Main box with gradient
    svg += `<defs>`;
    svg += `<linearGradient id="processGradient-${ctx.node.id}" x1="0%" y1="0%" x2="0%" y2="100%">`;
    svg += `<stop offset="0%" style="stop-color:${fill};stop-opacity:1" />`;
    svg += `<stop offset="100%" style="stop-color:${fill};stop-opacity:0.8" />`;
    svg += `</linearGradient>`;
    svg += `</defs>`;

    svg += `<rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" `;
    svg += `rx="${cornerRadius}" ry="${cornerRadius}" `;
    svg += `fill="url(#processGradient-${ctx.node.id})" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Label (white text for contrast)
    svg += `<text x="${x + bounds.width / 2}" y="${y + bounds.height / 2}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${fontSize}" font-weight="600" `;
    svg += `fill="#FFFFFF">`;
    svg += `${label}`;
    svg += `</text>`;

    return svg;
  },
};
