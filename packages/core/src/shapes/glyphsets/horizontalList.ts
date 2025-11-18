import type { ShapeDefinition } from '../../types.js';
import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';

/**
 * Horizontal List Shape - Left-to-right list with equal-width boxes
 * Renders items horizontally with consistent spacing and sizing.
 */
export const horizontalListShape: ShapeDefinition = {
  id: 'horizontalList',

  bounds(ctx) {
    const items = (ctx.node.data?.items as string[]) || [];

    if (items.length === 0) {
      return { width: 200, height: 100 };
    }

    const padding = 12;
    const itemHeight = 50;
    const itemSpacing = 16;

    // Calculate max text width
    let maxWidth = 0;
    for (const item of items) {
      const textSize = ctx.measureText(item, ctx.style);
      maxWidth = Math.max(maxWidth, textSize.width + padding * 2);
    }

    // Use equal width for all items
    const itemWidth = Math.max(maxWidth, 100); // Min 100px

    const totalWidth =
      itemWidth * items.length + itemSpacing * (items.length - 1);

    return {
      width: totalWidth,
      height: itemHeight,
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
    const { x, y } = position;

    const items = (ctx.node.data?.items as string[]) || [];

    if (items.length === 0) {
      return `<rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" 
                    fill="#f9f9f9" stroke="#ccc" stroke-width="1" rx="4" />
              <text x="${x + bounds.width / 2}" y="${y + bounds.height / 2}" 
                    text-anchor="middle" dominant-baseline="middle" 
                    fill="#999" font-family="sans-serif" font-size="14">
                No items
              </text>`;
    }

    const padding = 12;
    const itemHeight = 50;
    const itemSpacing = 16;

    // Calculate equal item width
    let maxWidth = 0;
    for (const item of items) {
      const textSize = ctx.measureText(item, ctx.style);
      maxWidth = Math.max(maxWidth, textSize.width + padding * 2);
    }
    const itemWidth = Math.max(maxWidth, 100);

    // Theme support
    const themeId = (ctx.node.data?.theme as string) || 'professional';
    const theme = getGlyphsetTheme(themeId);

    const stroke = ctx.style.stroke || theme.accentColor || '#2E5AAC';
    const strokeWidth = ctx.style.strokeWidth || 0;
    const fontSize = ctx.style.fontSize || 14;
    const font = ctx.style.font || 'Arial, sans-serif';

    let svg = '';

    // Render each item
    for (let i = 0; i < items.length; i++) {
      const itemX = x + i * (itemWidth + itemSpacing);

      // Use theme color for each item
      const itemFill = ctx.style.fill || getThemeColor(theme, i);

      // Use processBox style (gradient boxes)
      svg += `
        <defs>
          <linearGradient id="processGradient-hlist-${i}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${itemFill};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${itemFill};stop-opacity:0.8" />
          </linearGradient>
        </defs>
        <rect x="${itemX}" y="${y}" 
              width="${itemWidth}" height="${itemHeight}"
              rx="4" ry="4" 
              fill="url(#processGradient-hlist-${i})" 
              stroke="${stroke}" stroke-width="${strokeWidth}" />
        
        <text x="${itemX + itemWidth / 2}" y="${y + itemHeight / 2}" 
              text-anchor="middle" dominant-baseline="middle"
              font-family="${font}" font-size="${fontSize}" 
              font-weight="600" fill="#FFFFFF">
          ${items[i]}
        </text>
      `;
    }

    return svg;
  },
};
