import type { ShapeDefinition } from '../../types.js';
import { getThemeColor } from '../../themes/glyphset-themes.js';
import {
  extractItems,
  extractTheme,
  extractStyle,
  createStandardAnchors,
  renderEmptyState,
  calculateMaxTextWidth,
} from './utils.js';

/**
 * Horizontal List Shape - Left-to-right list with equal-width boxes
 * Renders items horizontally with consistent spacing and sizing.
 */
export const horizontalListShape: ShapeDefinition = {
  id: 'horizontalList',

  bounds(ctx) {
    const items = extractItems(ctx.node.data);

    if (items.length === 0) {
      return { width: 200, height: 100 };
    }

    const padding = 12;
    const itemHeight = 50;
    const itemSpacing = 16;

    // Calculate max text width using utility
    const maxWidth = calculateMaxTextWidth(items, ctx, 0) + padding * 2;

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
    return createStandardAnchors(bounds);
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const items = extractItems(ctx.node.data);

    if (items.length === 0) {
      return renderEmptyState({ x, y, ...bounds });
    }

    const padding = 12;
    const itemHeight = 50;
    const itemSpacing = 16;

    // Calculate equal item width
    const maxWidth = calculateMaxTextWidth(items, ctx, 0) + padding * 2;
    const itemWidth = Math.max(maxWidth, 100);

    // Use utility functions for theme and style
    const { theme } = extractTheme(ctx);
    const styleConfig = extractStyle(ctx);

    const stroke = styleConfig.stroke || theme.accentColor || '#2E5AAC';
    const strokeWidth = styleConfig.strokeWidth || 0;
    const fontSize = styleConfig.fontSize;
    const font = styleConfig.font;

    let svg = '';

    // Render each item
    for (let i = 0; i < items.length; i++) {
      const itemX = x + i * (itemWidth + itemSpacing);

      // Use theme color for each item
      const itemFill = styleConfig.fill || getThemeColor(theme, i);

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
