import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';
import type { ShapeDefinition } from '../../types/index.js';
import { createStandardAnchors } from './utils.js';

/**
 * Alternating List Shape - Zigzag list pattern (without arrows)
 * Items alternate left/right creating a dynamic visual flow.
 */
export const alternatingListShape: ShapeDefinition = {
  id: 'alternatingList',

  bounds(ctx) {
    const items = (ctx.node.data?.items as string[]) || [];

    if (items.length === 0) {
      return { width: 300, height: 100 };
    }

    const padding = 20;
    const itemHeight = 60;
    const horizontalGap = 10; // Reduced from 100
    const verticalSpacing = 10;

    // Calculate max width needed for any item
    let maxItemWidth = 160; // minimum width
    for (const item of items) {
      const textSize = ctx.measureText(item, ctx.style);
      const neededWidth = textSize.width + padding * 2;
      maxItemWidth = Math.max(maxItemWidth, neededWidth);
    }

    // temporary hack to fix width calculation
    const totalWidth = maxItemWidth * 2 + horizontalGap * 4;
    const totalHeight =
      items.length * (itemHeight + verticalSpacing) - verticalSpacing;

    return {
      width: totalWidth,
      height: totalHeight,
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    return createStandardAnchors(bounds);
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

    const padding = 20;
    const itemHeight = 60;
    const horizontalGap = 40;
    const verticalSpacing = 20;

    // Calculate max width needed for any item (same as bounds calculation)
    let itemWidth = 160; // minimum width
    for (const item of items) {
      const textSize = ctx.measureText(item, ctx.style);
      const neededWidth = textSize.width + padding * 2;
      itemWidth = Math.max(itemWidth, neededWidth);
    }

    // Theme support
    const themeId = (ctx.node.data?.theme as string) || 'professional';
    const theme = getGlyphsetTheme(themeId);

    const strokeWidth = ctx.style.strokeWidth || 2;
    const fontSize = ctx.style.fontSize || 14;
    const font = ctx.style.font || 'sans-serif';

    let svg = '';
    let currentY = y;

    // Render each item
    for (let i = 0; i < items.length; i++) {
      const isLeft = i % 2 === 0;

      // Calculate item position
      const itemX = isLeft ? x : x + itemWidth + horizontalGap;
      const itemY = currentY;

      // Alternate between dark (0-3) and light (4-7) theme colors
      const colorIndex = isLeft ? Math.floor(i / 2) : Math.floor(i / 2) + 4;
      const itemFill = ctx.style.fill || getThemeColor(theme, colorIndex);
      const itemStroke = ctx.style.stroke || theme.accentColor || '#2E5AAC';

      // Draw rounded rectangle for item
      svg += `
        <rect x="${itemX}" y="${itemY}" 
              width="${itemWidth}" height="${itemHeight}"
              rx="8" ry="8"
              fill="${itemFill}" stroke="${itemStroke}" stroke-width="${strokeWidth}" />
        
        <text x="${itemX + itemWidth / 2}" y="${itemY + itemHeight / 2}" 
              text-anchor="middle" dominant-baseline="middle"
              font-family="${font}" font-size="${fontSize}" 
              font-weight="600" fill="#FFFFFF">
          ${items[i]}
        </text>
      `;

      // temporary hack to fix vertical spacing
      currentY += itemHeight + verticalSpacing * 0.5;
    }

    return svg;
  },
};
