import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';
import type { ShapeDefinition } from '../../types/index.js';
import { createStandardAnchors } from './utils.js';

interface NestedItem {
  label: string;
  indent: number;
  isLevel: boolean;
}

/**
 * Nested List Shape - Hierarchical list with indented sub-items
 * Renders parent levels and indented child items in a single visual unit.
 */
export const nestedListShape: ShapeDefinition = {
  id: 'nestedList',

  bounds(ctx) {
    // Extract nested items from node data
    const items = (ctx.node.data?.items as NestedItem[]) || [];

    if (items.length === 0) {
      return { width: 200, height: 100 };
    }

    const padding = 12;
    const itemHeight = 40;
    const itemSpacing = 8;
    const indentWidth = 30;

    // Calculate max width needed
    let maxWidth = 0;
    for (const item of items) {
      const indentOffset = item.indent * indentWidth;
      const textSize = ctx.measureText(item.label, ctx.style);
      const itemWidth = indentOffset + textSize.width + padding * 2;
      maxWidth = Math.max(maxWidth, itemWidth);
    }

    const totalHeight =
      items.length * itemHeight + (items.length - 1) * itemSpacing;

    return {
      width: Math.max(maxWidth, 200),
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

    // Extract data
    const items = (ctx.node.data?.items as NestedItem[]) || [];

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
    const itemHeight = 40;
    const itemSpacing = 8;
    const indentWidth = 30;

    const fontSize = ctx.style.fontSize || 14;
    const font = ctx.style.font || 'sans-serif';

    // Theme support
    const themeId = (ctx.node.data?.theme as string) || 'professional';
    const theme = getGlyphsetTheme(themeId);

    let svg = '';
    let parentIndex = 0; // Track parent items for theme colors

    // Render each item with proper indentation
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemY = y + i * (itemHeight + itemSpacing);
      const indentOffset = item.indent * indentWidth;

      if (item.isLevel) {
        // Parent level - use theme color
        const textSize = ctx.measureText(item.label, ctx.style);
        const boxWidth = textSize.width + padding * 2;

        const levelFill = ctx.style.fill || getThemeColor(theme, parentIndex);
        parentIndex++; // Increment for next parent

        svg += `
          <defs>
            <linearGradient id="processGradient-nested-${i}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:${levelFill};stop-opacity:1" />
              <stop offset="100%" style="stop-color:${levelFill};stop-opacity:0.8" />
            </linearGradient>
          </defs>
          <rect x="${x + indentOffset}" y="${itemY}" 
                width="${boxWidth}" height="${itemHeight}"
                rx="4" ry="4" 
                fill="url(#processGradient-nested-${i})" 
                stroke="${theme.accentColor || '#2E5AAC'}" stroke-width="0" />
          
          <text x="${x + indentOffset + boxWidth / 2}" y="${itemY + itemHeight / 2}" 
                text-anchor="middle" dominant-baseline="middle"
                font-family="Arial, sans-serif" font-size="${fontSize}" 
                font-weight="600" fill="#FFFFFF">
            ${item.label}
          </text>
        `;
      } else {
        // Child item - use rounded rectangle style (lighter)
        const textSize = ctx.measureText(item.label, ctx.style);
        const boxWidth = textSize.width + padding * 2;

        // Add bullet point for child items
        const bulletX = x + indentOffset - 15;
        const bulletY = itemY + itemHeight / 2;

        svg += `
          <circle cx="${bulletX}" cy="${bulletY}" r="3" fill="#666" />
          
          <rect x="${x + indentOffset}" y="${itemY}" 
                width="${boxWidth}" height="${itemHeight}"
                rx="8" ry="8" 
                fill="#f0f0f0" stroke="#999" stroke-width="1" />
          
          <text x="${x + indentOffset + boxWidth / 2}" y="${itemY + itemHeight / 2}" 
                text-anchor="middle" dominant-baseline="middle"
                font-family="${font}" font-size="${fontSize}">
            ${item.label}
          </text>
        `;
      }
    }

    return svg;
  },
};
