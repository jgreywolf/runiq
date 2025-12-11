import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';
import type { ShapeDefinition } from '../../types/index.js';
import { createStandardAnchors } from './utils.js';

/**
 * Increasing List Shape - Items progressively increase in size
 * Renders items that grow from small to large, showing emphasis progression.
 */
export const increasingListShape: ShapeDefinition = {
  id: 'increasingList',

  bounds(ctx) {
    const items = (ctx.node.data?.items as string[]) || [];
    const shapeType = (ctx.node.data?.shape as string) || 'circle';

    if (items.length === 0) {
      return { width: 200, height: 100 };
    }

    const padding = 16; // Padding inside each circle/box
    const itemSpacing = 20;
    const fontSize = ctx.style.fontSize || 14;

    // Measure all text to find the minimum base size needed
    let minBaseSize = 60;
    for (let i = 0; i < items.length; i++) {
      const scale = 1.0 + (i / (items.length - 1)) * 1.0; // 1.0 to 2.0
      const scaledFontSize = fontSize * scale;
      const textSize = ctx.measureText(items[i], {
        ...ctx.style,
        fontSize: scaledFontSize,
      });

      // For circles, we need diameter >= text width + padding (accounting for diagonal)
      // Use sqrt(2) factor for diagonal text in circle, plus padding
      const requiredSize =
        shapeType === 'circle'
          ? textSize.width * 1.2 + padding * 2 // 1.2 factor for circle geometry
          : textSize.width + padding * 2;

      const requiredBaseSize = requiredSize / scale;
      minBaseSize = Math.max(minBaseSize, requiredBaseSize);
    }

    const baseSize = minBaseSize;

    // Calculate total width (items grow from 1.0x to 2.0x)
    let totalWidth = 0;
    for (let i = 0; i < items.length; i++) {
      const scale = 1.0 + (i / (items.length - 1)) * 1.0; // 1.0 to 2.0
      const size = baseSize * scale;
      totalWidth += size + (i < items.length - 1 ? itemSpacing : 0);
    }

    // Height is the largest item (last one at 2.0x scale)
    const maxSize = baseSize * 2.0;

    return {
      width: totalWidth,
      height: maxSize,
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
    const shapeType = (ctx.node.data?.shape as string) || 'circle';

    if (items.length === 0) {
      return `<rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" 
                    fill="#f9f9f9" stroke="#ccc" stroke-width="1" rx="4" />
              <text x="${x + bounds.width / 2}" y="${y + bounds.height / 2}" 
                    text-anchor="middle" dominant-baseline="middle" 
                    fill="#999" font-family="sans-serif" font-size="14">
                No items
              </text>`;
    }

    const padding = 16;
    const itemSpacing = 20;
    const fontSize = ctx.style.fontSize || 14;

    // Calculate the same base size as in bounds()
    let minBaseSize = 60;
    for (let i = 0; i < items.length; i++) {
      const scale = 1.0 + (i / (items.length - 1)) * 1.0;
      const scaledFontSize = fontSize * scale;
      const textSize = ctx.measureText(items[i], {
        ...ctx.style,
        fontSize: scaledFontSize,
      });

      const requiredSize =
        shapeType === 'circle'
          ? textSize.width * 1.2 + padding * 2
          : textSize.width + padding * 2;

      const requiredBaseSize = requiredSize / scale;
      minBaseSize = Math.max(minBaseSize, requiredBaseSize);
    }

    const baseSize = minBaseSize;
    const maxSize = baseSize * 2.0;

    // Theme support
    const themeId = (ctx.node.data?.theme as string) || 'professional';
    const theme = getGlyphsetTheme(themeId);

    const stroke = ctx.style.stroke || theme.accentColor || '#2E5AAC';
    const strokeWidth = ctx.style.strokeWidth || 2;
    const font = ctx.style.font || 'sans-serif';

    let svg = '';
    let currentX = x;

    // Render each item with increasing size
    for (let i = 0; i < items.length; i++) {
      const scale = 1.0 + (i / (items.length - 1)) * 1.0; // 1.0 to 2.0
      const size = baseSize * scale;
      const itemY = y + (maxSize - size) / 2; // Center vertically

      // Use theme color for each item
      const itemFill = ctx.style.fill || getThemeColor(theme, i);

      // Calculate opacity (lighter at start, darker at end)
      const opacity = 0.6 + (i / (items.length - 1)) * 0.4; // 0.6 to 1.0

      if (shapeType === 'circle') {
        const radius = size / 2;
        const centerX = currentX + radius;
        const centerY = itemY + radius;

        svg += `
          <circle cx="${centerX}" cy="${centerY}" r="${radius}"
                  fill="${itemFill}" fill-opacity="${opacity}"
                  stroke="${stroke}" stroke-width="${strokeWidth}" />
          
          <text x="${centerX}" y="${centerY}" 
                text-anchor="middle" dominant-baseline="middle"
                font-family="${font}" font-size="${fontSize * scale}" 
                font-weight="600" fill="#FFFFFF">
            ${items[i]}
          </text>
        `;
      } else {
        // Box shape
        const boxWidth = size;
        const boxHeight = size * 0.7; // Slightly shorter than wide
        const boxY = itemY + (size - boxHeight) / 2;

        svg += `
          <rect x="${currentX}" y="${boxY}" 
                width="${boxWidth}" height="${boxHeight}"
                rx="${boxHeight * 0.15}" ry="${boxHeight * 0.15}"
                fill="${itemFill}" fill-opacity="${opacity}"
                stroke="${stroke}" stroke-width="${strokeWidth}" />
          
          <text x="${currentX + boxWidth / 2}" y="${boxY + boxHeight / 2}" 
                text-anchor="middle" dominant-baseline="middle"
                font-family="${font}" font-size="${fontSize * scale}" 
                font-weight="600" fill="#FFFFFF">
            ${items[i]}
          </text>
        `;
      }

      currentX += size + itemSpacing;
    }

    return svg;
  },
};
