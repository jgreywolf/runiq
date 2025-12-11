import type { ShapeDefinition } from '../../types/index.js';
import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';

interface ImageItem {
  image?: string;
  label: string;
  description?: string;
}

interface PictureGridData {
  items: ImageItem[];
  theme: string;
  columns: number;
}

// Placeholder image for missing/broken URLs
const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23cccccc"/%3E%3Ctext x="50" y="60" font-size="40" text-anchor="middle" fill="%23666666"%3E?%3C/text%3E%3C/svg%3E';

function isValidImageUrl(url: string): boolean {
  if (typeof url !== 'string' || url.trim() === '') {
    return false;
  }
  const trimmed = url.trim();
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/')
  );
}

function getImageUrl(url?: string): string {
  if (!url || !isValidImageUrl(url)) {
    return PLACEHOLDER_IMAGE;
  }
  return url;
}

/**
 * Picture Grid Shape
 *
 * Renders a grid of square images with labels below.
 * Images are arranged in equal-sized cells.
 */
export const pictureGridShape: ShapeDefinition = {
  id: 'pictureGrid',

  bounds(ctx) {
    const data = ctx.node.data as unknown as PictureGridData;
    const items = data?.items || [];
    const columns = data?.columns || 3;

    const cellSize = 120; // Width and height of each cell
    const gap = 15;
    const padding = 20;
    const labelHeight = 30;

    const rows = Math.ceil(items.length / columns);
    const width = columns * cellSize + (columns - 1) * gap + padding * 2;
    const height = rows * (cellSize + labelHeight + gap) - gap + padding * 2;

    return { width, height };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const { width, height } = bounds;
    return [
      { x: width / 2, y: 0, id: 'top' },
      { x: width, y: height / 2, id: 'right' },
      { x: width / 2, y: height, id: 'bottom' },
      { x: 0, y: height / 2, id: 'left' },
    ];
  },

  render(ctx, position) {
    const data = ctx.node.data as unknown as PictureGridData;
    const items = data?.items || [];
    const theme = data?.theme || 'professional';
    const columns = data?.columns || 3;

    const cellSize = 120;
    const gap = 15;
    const padding = 20;
    const labelHeight = 30;

    const themeObj = getGlyphsetTheme(theme);
    let svg = '';

    items.forEach((item, i) => {
      const col = i % columns;
      const row = Math.floor(i / columns);

      const cellX = position.x + padding + col * (cellSize + gap);
      const cellY = position.y + padding + row * (cellSize + labelHeight + gap);

      // Get theme color
      const bgColor = getThemeColor(themeObj, i);

      // Background rectangle with theme color
      svg += `<rect 
        x="${cellX}" 
        y="${cellY}" 
        width="${cellSize}" 
        height="${cellSize}" 
        fill="${bgColor}" 
        opacity="0.1" 
        rx="4"
      />`;

      // Image with rounded corners
      const imageUrl = getImageUrl(item.image);
      const clipPathId = `clip-grid-${ctx.node.id}-${i}`;

      svg += `<defs>
        <clipPath id="${clipPathId}">
          <rect x="${cellX + 5}" y="${cellY + 5}" width="${cellSize - 10}" height="${cellSize - 10}" rx="4"/>
        </clipPath>
      </defs>`;

      svg += `<image 
        x="${cellX + 5}" 
        y="${cellY + 5}" 
        width="${cellSize - 10}" 
        height="${cellSize - 10}" 
        href="${imageUrl}" 
        clip-path="url(#${clipPathId})" 
        preserveAspectRatio="xMidYMid slice"
      />`;

      // Border
      svg += `<rect 
        x="${cellX + 5}" 
        y="${cellY + 5}" 
        width="${cellSize - 10}" 
        height="${cellSize - 10}" 
        fill="none" 
        stroke="${bgColor}" 
        stroke-width="2" 
        rx="4"
      />`;

      // Label
      const labelY = cellY + cellSize + 18;
      const labelX = cellX + cellSize / 2;
      svg += `<text 
        x="${labelX}" 
        y="${labelY}" 
        text-anchor="middle" 
        font-size="12" 
        font-weight="600"
        fill="#333"
      >${item.label}</text>`;
    });

    return svg;
  },
};
