import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';
import type { ShapeDefinition } from '../../types/index.js';
import { createStandardAnchors } from './utils.js';

/**
 * Chevron List Shape - Progressive list with chevron arrows
 * Renders items as chevrons (arrows pointing right) in a linear flow.
 */
export const chevronListShape: ShapeDefinition = {
  id: 'chevronList',

  bounds(ctx) {
    // Extract items and direction from node data
    const items = (ctx.node.data?.items as string[]) || [];
    const direction = (ctx.node.data?.direction as string) || 'TB';

    if (items.length === 0) {
      return { width: 200, height: 100 };
    }

    const padding = 12;
    const chevronHeight = 50;
    const chevronSpacing = 8;
    const arrowSize = 20;

    if (direction === 'LR') {
      // Horizontal layout
      // Calculate total width needed
      let totalWidth = 0;
      for (const item of items) {
        const textSize = ctx.measureText(item, ctx.style);
        const chevronWidth = textSize.width + padding * 2 + arrowSize;
        totalWidth += chevronWidth + chevronSpacing;
      }
      totalWidth -= chevronSpacing; // Remove last spacing

      return {
        width: totalWidth,
        height: chevronHeight,
      };
    } else {
      // Vertical layout (TB)
      // Calculate max width needed
      let maxWidth = 0;
      for (const item of items) {
        const textSize = ctx.measureText(item, ctx.style);
        const chevronWidth = textSize.width + padding * 2 + arrowSize;
        maxWidth = Math.max(maxWidth, chevronWidth);
      }

      const totalHeight =
        items.length * chevronHeight + (items.length - 1) * chevronSpacing;

      return {
        width: maxWidth,
        height: totalHeight,
      };
    }
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    return createStandardAnchors(bounds);
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    // Extract data
    const items = (ctx.node.data?.items as string[]) || [];
    const direction = (ctx.node.data?.direction as string) || 'TB';

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
    const chevronHeight = 50;
    const chevronSpacing = 8;
    const arrowSize = 20;

    // Theme support
    const themeId = (ctx.node.data?.theme as string) || 'professional';
    const theme = getGlyphsetTheme(themeId);

    const stroke = ctx.style.stroke || theme.accentColor || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const fontSize = ctx.style.fontSize || 14;
    const font = ctx.style.font || 'sans-serif';

    let svg = '';

    if (direction === 'LR') {
      // Horizontal layout - chevrons side by side
      let currentX = x;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const textSize = ctx.measureText(item, ctx.style);
        const chevronWidth = textSize.width + padding * 2 + arrowSize;

        // Use theme color for each chevron
        const chevronFill = ctx.style.fill || getThemeColor(theme, i);

        // Draw chevron (rectangle with arrow point on right)
        const points = [
          `${currentX},${y}`, // top left
          `${currentX + chevronWidth - arrowSize},${y}`, // top right (before arrow)
          `${currentX + chevronWidth},${y + chevronHeight / 2}`, // arrow tip
          `${currentX + chevronWidth - arrowSize},${y + chevronHeight}`, // bottom right
          `${currentX},${y + chevronHeight}`, // bottom left
        ].join(' ');

        svg += `
          <polygon points="${points}" 
                   fill="${chevronFill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
          
          <text x="${currentX + (chevronWidth - arrowSize / 2) / 2}" y="${y + chevronHeight / 2}" 
                text-anchor="middle" dominant-baseline="middle"
                font-family="${font}" font-size="${fontSize}">
            ${item}
          </text>
        `;

        currentX += chevronWidth + chevronSpacing;
      }
    } else {
      // Vertical layout - chevrons stacked
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const textSize = ctx.measureText(item, ctx.style);
        const chevronWidth = textSize.width + padding * 2 + arrowSize;
        const currentY = y + i * (chevronHeight + chevronSpacing);

        // Use theme color for each chevron
        const chevronFill = ctx.style.fill || getThemeColor(theme, i);

        // Draw chevron (rectangle with arrow point on right)
        const points = [
          `${x},${currentY}`, // top left
          `${x + chevronWidth - arrowSize},${currentY}`, // top right (before arrow)
          `${x + chevronWidth},${currentY + chevronHeight / 2}`, // arrow tip
          `${x + chevronWidth - arrowSize},${currentY + chevronHeight}`, // bottom right
          `${x},${currentY + chevronHeight}`, // bottom left
        ].join(' ');

        svg += `
          <polygon points="${points}" 
                   fill="${chevronFill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
          
          <text x="${x + (chevronWidth - arrowSize / 2) / 2}" y="${currentY + chevronHeight / 2}" 
                text-anchor="middle" dominant-baseline="middle"
                font-family="${font}" font-size="${fontSize}">
            ${item}
          </text>
        `;
      }
    }

    return svg;
  },
};
