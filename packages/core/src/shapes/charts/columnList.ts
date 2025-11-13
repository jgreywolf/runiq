import type { ShapeDefinition } from '../../types.js';

/**
 * Column List Shape - Multi-column list with equal-width columns
 * Renders items distributed across columns with uniform column widths.
 */
export const columnListShape: ShapeDefinition = {
  id: 'columnList',

  bounds(ctx) {
    // Extract column data from node data
    const items = (ctx.node.data?.items as string[]) || [];
    const columns = (ctx.node.data?.columns as number) || 2;

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

    // Extract data
    const items = (ctx.node.data?.items as string[]) || [];
    const columns = (ctx.node.data?.columns as number) || 2;

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

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const fontSize = ctx.style.fontSize || 14;
    const font = ctx.style.font || 'sans-serif';

    let svg = '';

    // Render items column by column
    for (let col = 0; col < columns; col++) {
      const colX = x + col * (equalColumnWidth + columnSpacing);

      for (let row = 0; row < itemsPerColumn; row++) {
        const index = col * itemsPerColumn + row;
        if (index >= items.length) break;

        const itemY = y + row * (itemHeight + rowSpacing);
        const itemText = items[index];

        // Render rounded rectangle for item
        svg += `
          <rect x="${colX}" y="${itemY}" 
                width="${equalColumnWidth}" height="${itemHeight}"
                rx="8" ry="8" 
                fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
          
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
