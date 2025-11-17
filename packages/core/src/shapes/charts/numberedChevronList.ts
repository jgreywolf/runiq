import type { ShapeDefinition } from '../../types.js';
import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';

interface ChevronItem {
  label: string;
  description?: string;
}

/**
 * Helper to truncate text if too long
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 3) + '...';
  }
  return text;
}

/**
 * Numbered Chevron List Shape - Vertical list with numbered chevrons and descriptions
 * Similar to PowerPoint's Vertical Chevron List with numbers (01, 02, 03...).
 * Each row has: numbered chevron + label + optional description box
 */
export const numberedChevronListShape: ShapeDefinition = {
  id: 'numberedChevronList',

  bounds(ctx) {
    const items = (ctx.node.data?.items as ChevronItem[]) || [];

    if (items.length === 0) {
      return { width: 400, height: 100 };
    }

    const chevronWidth = 80; // Width of the numbered chevron
    const labelWidth = 120; // Width for the label text
    const descriptionWidth = 300; // Width for description boxes
    const itemHeight = 60; // Height per item
    const itemSpacing = 12; // Vertical spacing between items
    const horizontalGap = 20; // Gap between chevron and description

    const hasDescriptions = items.some((item) => item.description);

    const totalWidth = hasDescriptions
      ? chevronWidth + labelWidth + horizontalGap + descriptionWidth
      : chevronWidth + labelWidth;

    const totalHeight =
      items.length * itemHeight + (items.length - 1) * itemSpacing;

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

    const items = (ctx.node.data?.items as ChevronItem[]) || [];
    const colorScheme = (ctx.node.data?.colorScheme as string) || 'multi';

    if (items.length === 0) {
      return `<rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" 
                    fill="#f9f9f9" stroke="#ccc" stroke-width="1" rx="4" />
              <text x="${x + bounds.width / 2}" y="${y + bounds.height / 2}" 
                    text-anchor="middle" dominant-baseline="middle" 
                    fill="#999" font-family="sans-serif" font-size="14">
                No items
              </text>`;
    }

    const chevronWidth = 80;
    const labelWidth = 120;
    const descriptionWidth = 300;
    const itemHeight = 60;
    const itemSpacing = 12;
    const horizontalGap = 20;
    const arrowSize = 15; // Size of the chevron arrow point

    const fontSize = ctx.style.fontSize || 14;
    const font = ctx.style.font || 'sans-serif';
    const strokeWidth = 2;

    // Theme support
    const themeId = (ctx.node.data?.theme as string) || 'professional';
    const theme = getGlyphsetTheme(themeId);

    const hasDescriptions = items.some((item) => item.description);

    let svg = '';
    let currentY = y;

    // Render each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const number = (i + 1).toString().padStart(2, '0'); // 01, 02, 03...

      // Use theme colors
      const fillColor =
        ctx.style.fill ||
        getThemeColor(theme, colorScheme === 'single' ? 0 : i);
      const darkColor = theme.accentColor || '#1F3D73';

      // Draw chevron with number
      const chevronX = x;
      const chevronY = currentY;
      const chevronH = itemHeight;

      // Chevron is a 6-point polygon: rectangle with arrow on right
      const chevronPoints = [
        `${chevronX},${chevronY}`, // Top left
        `${chevronX + chevronWidth - arrowSize},${chevronY}`, // Top right (before arrow)
        `${chevronX + chevronWidth},${chevronY + chevronH / 2}`, // Arrow tip (middle right)
        `${chevronX + chevronWidth - arrowSize},${chevronY + chevronH}`, // Bottom right (before arrow)
        `${chevronX},${chevronY + chevronH}`, // Bottom left
        `${chevronX},${chevronY}`, // Back to top left
      ].join(' ');

      // Add gradient effect (top to bottom)
      svg += `
        <defs>
          <linearGradient id="chevronGrad${i}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${fillColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${darkColor};stop-opacity:1" />
          </linearGradient>
        </defs>
      `;

      svg += `
        <polygon points="${chevronPoints}"
                 fill="url(#chevronGrad${i})"
                 stroke="${darkColor}" stroke-width="${strokeWidth}" />
        
        <text x="${chevronX + chevronWidth / 2}" y="${chevronY + chevronH / 2}" 
              text-anchor="middle" dominant-baseline="middle"
              font-family="${font}" font-size="${fontSize * 1.8}" 
              font-weight="700" fill="#FFFFFF">
          ${number}
        </text>
      `;

      // Draw label beside chevron
      const labelX = chevronX + chevronWidth + 8;
      const labelY = chevronY + chevronH / 2;

      svg += `
        <text x="${labelX}" y="${labelY}" 
              text-anchor="start" dominant-baseline="middle"
              font-family="${font}" font-size="${fontSize * 1.2}" 
              font-weight="600" fill="#000000">
          ${item.label}
        </text>
      `;

      // Draw description box if present
      if (hasDescriptions && item.description) {
        const descX = labelX + labelWidth + horizontalGap;
        const descY = chevronY;
        const descH = chevronH;
        const descW = descriptionWidth;

        svg += `
          <rect x="${descX}" y="${descY}" 
                width="${descW}" height="${descH}"
                rx="4" ry="4"
                fill="#FFFFFF" stroke="#CCCCCC" stroke-width="1"
                filter="drop-shadow(2px 2px 4px rgba(0,0,0,0.1))" />
          
          <text x="${descX + 12}" y="${descY + descH / 2}" 
                text-anchor="start" dominant-baseline="middle"
                font-family="${font}" font-size="${fontSize}" 
                fill="#333333">
            ${item.description}
          </text>
        `;
      }

      currentY += itemHeight + itemSpacing;
    }

    return svg;
  },
};
