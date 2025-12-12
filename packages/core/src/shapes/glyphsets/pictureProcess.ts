import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';
import type { ShapeDefinition } from '../../types/index.js';
import { createStandardAnchors } from './utils.js';

interface ImageItem {
  image?: string;
  label: string;
  description?: string;
}

interface PictureProcessData {
  items: ImageItem[];
  theme?: string;
  direction?: 'horizontal' | 'vertical';
}

// Placeholder image for missing/broken images
const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';

/**
 * Get the actual image URL to use (with fallback to placeholder)
 */
function getImageUrl(imageUrl?: string): string {
  if (!imageUrl) return PLACEHOLDER_IMAGE;
  // Basic validation - could be enhanced
  if (
    imageUrl.startsWith('http://') ||
    imageUrl.startsWith('https://') ||
    imageUrl.startsWith('data:')
  ) {
    return imageUrl;
  }
  return PLACEHOLDER_IMAGE;
}

/**
 * Render an image with background color fallback
 */
function renderImage(
  imageUrl: string,
  x: number,
  y: number,
  width: number,
  height: number,
  clipPathId: string,
  backgroundColor: string
): string {
  return [
    // Background color
    `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${backgroundColor}" clip-path="url(#${clipPathId})"/>`,
    // Image
    `<image href="${imageUrl}" x="${x}" y="${y}" width="${width}" height="${height}" clip-path="url(#${clipPathId})" preserveAspectRatio="xMidYMid slice"/>`,
  ].join('\n');
}

/**
 * Picture Process Shape
 *
 * Renders a sequential process with images and labels for each step.
 * Supports horizontal and vertical layouts with connecting arrows.
 */
export const pictureProcessShape: ShapeDefinition = {
  id: 'pictureProcess',

  bounds(ctx) {
    const data = ctx.node.data as unknown as PictureProcessData;
    const itemCount = data.items?.length || 0;
    const direction = data.direction || 'horizontal';

    const imageSize = 100;
    const labelHeight = 50;
    const arrowSpace = 40;
    const padding = 20;

    if (direction === 'horizontal') {
      // Horizontal: images side by side with arrows between
      const width =
        itemCount * imageSize + (itemCount - 1) * arrowSpace + padding * 2;
      const height = imageSize + labelHeight + padding * 2;
      return { width, height };
    } else {
      // Vertical: images stacked with arrows between
      const width = imageSize + padding * 2;
      const height =
        itemCount * (imageSize + labelHeight) +
        (itemCount - 1) * arrowSpace +
        padding * 2;
      return { width, height };
    }
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    return createStandardAnchors(bounds);
  },

  render(ctx, position) {
    const data = ctx.node.data as unknown as PictureProcessData;
    const items = data.items || [];
    const theme = data.theme || 'professional';
    const direction = data.direction || 'horizontal';

    const bounds = this.bounds(ctx);
    const imageSize = 100;
    const labelHeight = 50;
    const arrowSpace = 40;
    const padding = 20;

    const colorTheme = getGlyphsetTheme(theme);
    const parts: string[] = [];

    // Background
    parts.push(
      `<rect x="${position.x}" y="${position.y}" width="${bounds.width}" height="${bounds.height}" ` +
        `fill="white" stroke="#e0e0e0" stroke-width="1" rx="8"/>`
    );

    if (direction === 'horizontal') {
      // Horizontal layout
      items.forEach((item, index) => {
        const x = position.x + padding + index * (imageSize + arrowSpace);
        const y = position.y + padding;

        // Image with rounded rectangle clip
        const clipId = `clip-process-h-${ctx.node.id}-${index}`;
        parts.push(
          `<defs>`,
          `  <clipPath id="${clipId}">`,
          `    <rect x="${x}" y="${y}" width="${imageSize}" height="${imageSize}" rx="8"/>`,
          `  </clipPath>`,
          `</defs>`
        );

        const imageUrl = getImageUrl(item.image);
        const color = getThemeColor(colorTheme, index);

        parts.push(
          renderImage(imageUrl, x, y, imageSize, imageSize, clipId, color)
        );

        // Label below image
        parts.push(
          `<text x="${x + imageSize / 2}" y="${y + imageSize + 20}" ` +
            `text-anchor="middle" font-size="12" font-weight="500" fill="#333">${item.label}</text>`
        );

        // Step number badge
        parts.push(
          `<circle cx="${x + imageSize - 15}" cy="${y + 15}" r="12" fill="${color}" stroke="white" stroke-width="2"/>`,
          `<text x="${x + imageSize - 15}" y="${y + 20}" text-anchor="middle" font-size="10" font-weight="bold" fill="white">${index + 1}</text>`
        );

        // Arrow to next step (if not last)
        if (index < items.length - 1) {
          const arrowX = x + imageSize + 10;
          const arrowY = y + imageSize / 2;
          const arrowEndX = arrowX + arrowSpace - 20;

          parts.push(
            `<line x1="${arrowX}" y1="${arrowY}" x2="${arrowEndX}" y2="${arrowY}" ` +
              `stroke="${color}" stroke-width="3" marker-end="url(#arrowhead-${index})"/>`,
            `<defs>`,
            `  <marker id="arrowhead-${index}" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">`,
            `    <polygon points="0 0, 10 3, 0 6" fill="${color}"/>`,
            `  </marker>`,
            `</defs>`
          );
        }
      });
    } else {
      // Vertical layout
      items.forEach((item, index) => {
        const x = position.x + padding;
        const y =
          position.y + padding + index * (imageSize + labelHeight + arrowSpace);

        // Image with rounded rectangle clip
        const clipId = `clip-process-v-${ctx.node.id}-${index}`;
        parts.push(
          `<defs>`,
          `  <clipPath id="${clipId}">`,
          `    <rect x="${x}" y="${y}" width="${imageSize}" height="${imageSize}" rx="8"/>`,
          `  </clipPath>`,
          `</defs>`
        );

        const imageUrl = getImageUrl(item.image);
        const color = getThemeColor(colorTheme, index);

        parts.push(
          renderImage(imageUrl, x, y, imageSize, imageSize, clipId, color)
        );

        // Label below image
        parts.push(
          `<text x="${x + imageSize / 2}" y="${y + imageSize + 20}" ` +
            `text-anchor="middle" font-size="12" font-weight="500" fill="#333">${item.label}</text>`
        );

        // Step number badge
        parts.push(
          `<circle cx="${x + imageSize - 15}" cy="${y + 15}" r="12" fill="${color}" stroke="white" stroke-width="2"/>`,
          `<text x="${x + imageSize - 15}" y="${y + 20}" text-anchor="middle" font-size="10" font-weight="bold" fill="white">${index + 1}</text>`
        );

        // Arrow to next step (if not last)
        if (index < items.length - 1) {
          const arrowX = x + imageSize / 2;
          const arrowY = y + imageSize + labelHeight + 5;
          const arrowEndY = arrowY + arrowSpace - 20;

          parts.push(
            `<line x1="${arrowX}" y1="${arrowY}" x2="${arrowX}" y2="${arrowEndY}" ` +
              `stroke="${color}" stroke-width="3" marker-end="url(#arrowhead-v-${index})"/>`,
            `<defs>`,
            `  <marker id="arrowhead-v-${index}" markerWidth="10" markerHeight="10" refX="3" refY="9" orient="auto">`,
            `    <polygon points="0 0, 6 0, 3 10" fill="${color}"/>`,
            `  </marker>`,
            `</defs>`
          );
        }
      });
    }

    return parts.join('\n');
  },
};
