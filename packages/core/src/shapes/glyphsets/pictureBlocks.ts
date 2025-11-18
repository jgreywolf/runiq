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

interface PictureBlocksData {
  items: ImageItem[];
  theme?: string;
  alternating?: boolean;
}

// Placeholder image
const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';

function getImageUrl(imageUrl?: string): string {
  if (!imageUrl) return PLACEHOLDER_IMAGE;
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
 * Picture Blocks Shape
 *
 * Renders alternating image and text blocks in a magazine-style layout.
 */
export const pictureBlocksShape: ShapeDefinition = {
  id: 'pictureBlocks',

  bounds(ctx) {
    const data = ctx.node.data as unknown as PictureBlocksData;
    const itemCount = data.items?.length || 0;

    const blockWidth = 500;
    const blockHeight = 150;
    const spacing = 20;
    const padding = 20;

    const width = blockWidth + padding * 2;
    const height = itemCount * (blockHeight + spacing) - spacing + padding * 2;

    return { width, height };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    return [
      { x: bounds.width / 2, y: 0 },
      { x: bounds.width, y: bounds.height / 2 },
      { x: bounds.width / 2, y: bounds.height },
      { x: 0, y: bounds.height / 2 },
    ];
  },

  render(ctx, position) {
    const data = ctx.node.data as unknown as PictureBlocksData;
    const items = data.items || [];
    const theme = data.theme || 'professional';
    const alternating = data.alternating ?? true;

    const bounds = this.bounds(ctx);
    const blockWidth = 500;
    const imageWidth = 200;
    const textWidth = blockWidth - imageWidth - 20; // 20px gap
    const blockHeight = 150;
    const spacing = 20;
    const padding = 20;

    const colorTheme = getGlyphsetTheme(theme);
    const parts: string[] = [];

    // Background
    parts.push(
      `<rect x="${position.x}" y="${position.y}" width="${bounds.width}" height="${bounds.height}" ` +
        `fill="white" stroke="#e0e0e0" stroke-width="1" rx="8"/>`
    );

    items.forEach((item, index) => {
      const y = position.y + padding + index * (blockHeight + spacing);
      const imageOnLeft = alternating ? index % 2 === 0 : true;
      const color = getThemeColor(colorTheme, index);

      let imageX: number;
      let textX: number;

      if (imageOnLeft) {
        imageX = position.x + padding;
        textX = imageX + imageWidth + 20;
      } else {
        textX = position.x + padding;
        imageX = textX + textWidth + 20;
      }

      // Image with rounded corners
      const clipId = `clip-blocks-${ctx.node.id}-${index}`;
      parts.push(
        `<defs>`,
        `  <clipPath id="${clipId}">`,
        `    <rect x="${imageX}" y="${y}" width="${imageWidth}" height="${blockHeight}" rx="8"/>`,
        `  </clipPath>`,
        `</defs>`
      );

      const imageUrl = getImageUrl(item.image);

      // Image background and content
      parts.push(
        `<rect x="${imageX}" y="${y}" width="${imageWidth}" height="${blockHeight}" ` +
          `fill="${color}" opacity="0.1" rx="8"/>`,
        `<image href="${imageUrl}" x="${imageX}" y="${y}" width="${imageWidth}" height="${blockHeight}" ` +
          `clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>`,
        `<rect x="${imageX}" y="${y}" width="${imageWidth}" height="${blockHeight}" ` +
          `fill="none" stroke="${color}" stroke-width="2" rx="8"/>`
      );

      // Text block
      parts.push(
        `<rect x="${textX}" y="${y}" width="${textWidth}" height="${blockHeight}" ` +
          `fill="${color}" opacity="0.05" rx="8" stroke="${color}" stroke-width="1"/>`
      );

      // Title
      parts.push(
        `<text x="${textX + 15}" y="${y + 30}" font-size="18" font-weight="600" fill="${color}">${item.label}</text>`
      );

      // Description (if provided)
      if (item.description) {
        const words = item.description.split(' ');
        let line = '';
        let lineY = y + 60;
        const maxWidth = textWidth - 30;

        words.forEach((word) => {
          const testLine = line + word + ' ';
          const testWidth = testLine.length * 7; // Rough estimate

          if (testWidth > maxWidth && line !== '') {
            parts.push(
              `<text x="${textX + 15}" y="${lineY}" font-size="14" fill="#666">${line.trim()}</text>`
            );
            line = word + ' ';
            lineY += 20;
          } else {
            line = testLine;
          }
        });

        if (line.trim() !== '') {
          parts.push(
            `<text x="${textX + 15}" y="${lineY}" font-size="14" fill="#666">${line.trim()}</text>`
          );
        }
      }
    });

    return parts.join('\n');
  },
};
