import type { ShapeDefinition } from '../../types.js';
import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';

interface ImageItem {
  image?: string;
  label: string;
  description?: string;
}

interface PictureListData {
  items: ImageItem[];
  theme: string;
  orientation: 'horizontal' | 'vertical';
}

// Placeholder image for missing/broken URLs (gray square with "?")
const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23cccccc"/%3E%3Ctext x="50" y="60" font-size="40" text-anchor="middle" fill="%23666666"%3E?%3C/text%3E%3C/svg%3E';

/**
 * Validate image URL (HTTP/HTTPS/data URLs only)
 */
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

/**
 * Get valid image URL or placeholder
 */
function getImageUrl(url?: string): string {
  if (!url || !isValidImageUrl(url)) {
    return PLACEHOLDER_IMAGE;
  }
  return url;
}

/**
 * Measure text width (approximate)
 */
function measureText(text: string, fontSize = 14): number {
  // Rough approximation: average character width is ~0.6 * fontSize
  return text.length * fontSize * 0.6;
}

/**
 * Picture List Shape
 *
 * Renders a list of circular images with labels below.
 * Can be oriented horizontally or vertically.
 */
export const pictureListShape: ShapeDefinition = {
  id: 'pictureList',

  bounds(ctx) {
    const data = ctx.node.data as unknown as PictureListData;
    const items = data?.items || [];
    const orientation = data?.orientation || 'horizontal';

    const imageSize = 80; // Diameter of circular image
    const padding = 20;
    const labelHeight = 40;
    const spacing = 30;

    if (orientation === 'horizontal') {
      // Horizontal layout
      const width =
        items.length * (imageSize + spacing) - spacing + padding * 2;
      const height = imageSize + labelHeight + padding * 2;
      return { width, height };
    } else {
      // Vertical layout
      const maxLabelWidth = Math.max(
        ...items.map((item) => measureText(item.label))
      );
      const width = Math.max(imageSize, maxLabelWidth) + padding * 2;
      const height =
        items.length * (imageSize + labelHeight + spacing) -
        spacing +
        padding * 2;
      return { width, height };
    }
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
    const data = ctx.node.data as unknown as PictureListData;
    const items = data?.items || [];
    const theme = data?.theme || 'professional';
    const orientation = data?.orientation || 'horizontal';

    const imageSize = 80;
    const padding = 20;
    const labelHeight = 40;
    const spacing = 30;
    const radius = imageSize / 2;

    let svg = '';

    items.forEach((item, i) => {
      let imageX: number;
      let imageY: number;

      if (orientation === 'horizontal') {
        // Horizontal layout
        imageX = position.x + padding + i * (imageSize + spacing);
        imageY = position.y + padding;
      } else {
        // Vertical layout
        imageX = position.x + padding;
        imageY = position.y + padding + i * (imageSize + labelHeight + spacing);
      }

      const centerX = imageX + radius;
      const centerY = imageY + radius;

      // Get theme color for background circle
      const themeObj = getGlyphsetTheme(theme);
      const bgColor = getThemeColor(themeObj, i);
      const textColor = getThemeColor(themeObj, i + 4); // Use darker shade for text

      // Background circle
      svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="${bgColor}" opacity="0.2"/>`;

      // Circular clip path for image
      const clipPathId = `clip-picture-${ctx.node.id}-${i}`;
      svg += `<defs>
        <clipPath id="${clipPathId}">
          <circle cx="${centerX}" cy="${centerY}" r="${radius - 2}"/>
        </clipPath>
      </defs>`;

      // Image
      const imageUrl = getImageUrl(item.image);
      svg += `<image 
        x="${imageX + 2}" 
        y="${imageY + 2}" 
        width="${imageSize - 4}" 
        height="${imageSize - 4}" 
        href="${imageUrl}" 
        clip-path="url(#${clipPathId})" 
        preserveAspectRatio="xMidYMid slice"
      />`;

      // Border circle
      svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius - 1}" fill="none" stroke="${bgColor}" stroke-width="2"/>`;

      // Label
      const labelY = imageY + imageSize + 20;
      const labelX = centerX;
      svg += `<text 
        x="${labelX}" 
        y="${labelY}" 
        text-anchor="middle" 
        font-size="14" 
        font-weight="600"
        fill="${textColor}"
      >${item.label}</text>`;

      // Description (if provided)
      if (item.description) {
        const descY = labelY + 16;
        svg += `<text 
          x="${labelX}" 
          y="${descY}" 
          text-anchor="middle" 
          font-size="11" 
          fill="#666"
        >${item.description}</text>`;
      }
    });

    return svg;
  },
};
