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

interface CalloutItem {
  label: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

interface PictureCalloutData {
  image: ImageItem;
  callouts: CalloutItem[];
  theme?: string;
}

// Placeholder image for missing/broken images
const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';

/**
 * Get the actual image URL to use (with fallback to placeholder)
 */
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
 * Picture Callout Shape
 *
 * Renders a central image with callout annotations positioned around it.
 * Callouts are distributed to top, right, bottom, left with connecting lines.
 */
export const pictureCalloutShape: ShapeDefinition = {
  id: 'pictureCallout',

  bounds(_ctx) {
    const imageSize = 200;
    const calloutWidth = 150;
    const calloutHeight = 40;
    const spacing = 60;
    const padding = 20;

    // Image in center, callouts around it
    const width = imageSize + (calloutWidth + spacing) * 2 + padding * 2;
    const height = imageSize + (calloutHeight + spacing) * 2 + padding * 2;

    return { width, height };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    return createStandardAnchors(bounds);
  },

  render(ctx, position) {
    const data = ctx.node.data as unknown as PictureCalloutData;
    const image = data.image;
    const callouts = data.callouts || [];
    const theme = data.theme || 'professional';

    const bounds = this.bounds(ctx);
    const imageSize = 200;
    const calloutWidth = 150;
    const calloutHeight = 40;
    const spacing = 60;

    // Center image position
    const centerX = position.x + bounds.width / 2;
    const centerY = position.y + bounds.height / 2;
    const imageX = centerX - imageSize / 2;
    const imageY = centerY - imageSize / 2;

    const colorTheme = getGlyphsetTheme(theme);
    const parts: string[] = [];

    // Background
    parts.push(
      `<rect x="${position.x}" y="${position.y}" width="${bounds.width}" height="${bounds.height}" ` +
        `fill="white" stroke="#e0e0e0" stroke-width="1" rx="8"/>`
    );

    // Central image with rounded corners
    const clipId = `clip-callout-${ctx.node.id}`;
    parts.push(
      `<defs>`,
      `  <clipPath id="${clipId}">`,
      `    <rect x="${imageX}" y="${imageY}" width="${imageSize}" height="${imageSize}" rx="12"/>`,
      `  </clipPath>`,
      `</defs>`
    );

    const imageUrl = getImageUrl(image.image);
    const primaryColor = getThemeColor(colorTheme, 0);

    // Image background and border
    parts.push(
      `<rect x="${imageX}" y="${imageY}" width="${imageSize}" height="${imageSize}" ` +
        `fill="${primaryColor}" opacity="0.1" rx="12"/>`,
      `<image href="${imageUrl}" x="${imageX}" y="${imageY}" width="${imageSize}" height="${imageSize}" ` +
        `clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>`,
      `<rect x="${imageX}" y="${imageY}" width="${imageSize}" height="${imageSize}" ` +
        `fill="none" stroke="${primaryColor}" stroke-width="3" rx="12"/>`
    );

    // Group callouts by position
    const grouped = {
      top: callouts.filter((c) => c.position === 'top'),
      right: callouts.filter((c) => c.position === 'right'),
      bottom: callouts.filter((c) => c.position === 'bottom'),
      left: callouts.filter((c) => c.position === 'left'),
    };

    let colorIndex = 0;

    // Render callouts for each position
    ['top', 'right', 'bottom', 'left'].forEach((pos) => {
      const items = grouped[pos as keyof typeof grouped];
      items.forEach((callout, index) => {
        const color = getThemeColor(colorTheme, colorIndex++);
        let calloutX = 0;
        let calloutY = 0;
        let lineEndX = 0;
        let lineEndY = 0;

        if (pos === 'top') {
          calloutX = centerX - calloutWidth / 2;
          calloutY = imageY - spacing - calloutHeight;
          lineEndX = centerX;
          lineEndY = imageY;
        } else if (pos === 'right') {
          calloutX = imageX + imageSize + spacing;
          calloutY = centerY - calloutHeight / 2 + index * (calloutHeight + 10);
          lineEndX = imageX + imageSize;
          lineEndY = calloutY + calloutHeight / 2;
        } else if (pos === 'bottom') {
          calloutX = centerX - calloutWidth / 2;
          calloutY = imageY + imageSize + spacing;
          lineEndX = centerX;
          lineEndY = imageY + imageSize;
        } else {
          // left
          calloutX = imageX - spacing - calloutWidth;
          calloutY = centerY - calloutHeight / 2 + index * (calloutHeight + 10);
          lineEndX = imageX;
          lineEndY = calloutY + calloutHeight / 2;
        }

        // Connecting line
        parts.push(
          `<line x1="${calloutX + calloutWidth / 2}" y1="${calloutY + calloutHeight / 2}" ` +
            `x2="${lineEndX}" y2="${lineEndY}" stroke="${color}" stroke-width="2" stroke-dasharray="4,4"/>`
        );

        // Callout box
        parts.push(
          `<rect x="${calloutX}" y="${calloutY}" width="${calloutWidth}" height="${calloutHeight}" ` +
            `fill="${color}" stroke="white" stroke-width="2" rx="6"/>`,
          `<text x="${calloutX + calloutWidth / 2}" y="${calloutY + calloutHeight / 2}" ` +
            `text-anchor="middle" dy=".3em" font-size="12" font-weight="500" fill="white">${callout.label}</text>`
        );
      });
    });

    return parts.join('\n');
  },
};
