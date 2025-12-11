import type { ShapeDefinition } from '../../types.js';
import { getThemeColor } from '../../themes/glyphset-themes.js';
import {
  extractItems,
  extractNumberProp,
  extractTheme,
  extractStyle,
  createStandardAnchors,
  renderEmptyState,
} from './utils.js';

/**
 * Column List Shape - Multi-column list with equal-width columns
 * Renders items distributed across columns with uniform column widths.
 */
export const columnListShape: ShapeDefinition = {
  id: 'columnList',

  bounds(ctx) {
    // Extract column data using utilities
    const items = extractItems(ctx.node.data);
    const columns = extractNumberProp(ctx.node.data, 'columns', 2);

    if (items.length === 0) {
      return { width: 200, height: 100 };
    }

    // Calculate dimensions
    const padding = 12;
    const itemHeight = 40;
    const rowSpacing = 12;
    const columnSpacing = 16;

    // Calculate rows per column
    const itemsPerColumn = Math.ceil(items.length / columns);

    // Measure max text width per column
    const columnWidths: number[] = [];
    for (let col = 0; col < columns; col++) {
      let maxWidth = 0;
      for (let row = 0; row < itemsPerColumn; row++) {
        const index = col * itemsPerColumn + row;
        if (index < items.length) {
          const textSize = ctx.measureText(items[index], ctx.style);
          maxWidth = Math.max(maxWidth, textSize.width + padding * 2);
        }
      }
      columnWidths.push(Math.max(maxWidth, 120)); // Min 120px per column
    }

    // Use equal width for all columns (max of all column widths)
    const equalColumnWidth = Math.max(...columnWidths);

    const totalWidth =
      equalColumnWidth * columns + columnSpacing * (columns - 1);
    const totalHeight =
      itemsPerColumn * itemHeight + (itemsPerColumn - 1) * rowSpacing;

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

    // Extract data using utilities
    const items = extractItems(ctx.node.data);
    const columns = extractNumberProp(ctx.node.data, 'columns', 2);

    if (items.length === 0) {
      return renderEmptyState({ x, y, ...bounds });
    }

    const padding = 12;
    const itemHeight = 40;
    const rowSpacing = 12;
    const columnSpacing = 16;

    const itemsPerColumn = Math.ceil(items.length / columns);

    // Calculate equal column width
    const columnWidths: number[] = [];
    for (let col = 0; col < columns; col++) {
      let maxWidth = 0;
      for (let row = 0; row < itemsPerColumn; row++) {
        const index = col * itemsPerColumn + row;
        if (index < items.length) {
          const textSize = ctx.measureText(items[index], ctx.style);
          maxWidth = Math.max(maxWidth, textSize.width + padding * 2);
        }
      }
      columnWidths.push(Math.max(maxWidth, 120));
    }
    const equalColumnWidth = Math.max(...columnWidths);

    // Use utilities for theme and style
    const { theme } = extractTheme(ctx);
    const styleConfig = extractStyle(ctx);

    const stroke = styleConfig.stroke || theme.accentColor || '#333';
    const strokeWidth = styleConfig.strokeWidth || 1;
    const fontSize = styleConfig.fontSize;
    const font = styleConfig.font;

    let svg = '';

    // Render items column by column
    for (let col = 0; col < columns; col++) {
      const colX = x + col * (equalColumnWidth + columnSpacing);

      for (let row = 0; row < itemsPerColumn; row++) {
        const index = col * itemsPerColumn + row;
        if (index >= items.length) break;

        const itemY = y + row * (itemHeight + rowSpacing);
        const itemText = items[index];

        // Use theme color for each item
        const itemFill = ctx.style.fill || getThemeColor(theme, index);

        // Render rounded rectangle for item
        svg += `
          <rect x="${colX}" y="${itemY}" 
                width="${equalColumnWidth}" height="${itemHeight}"
                rx="8" ry="8" 
                fill="${itemFill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
          
          <text x="${colX + equalColumnWidth / 2}" y="${itemY + itemHeight / 2}" 
                text-anchor="middle" dominant-baseline="middle"
                font-family="${font}" font-size="${fontSize}">
            ${itemText}
          </text>
        `;
      }
    }

    return svg;
  },
};
