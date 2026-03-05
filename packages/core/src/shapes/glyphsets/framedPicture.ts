import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';
import type { ShapeDefinition } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';
import { createStandardAnchors } from './utils.js';

interface ImageItem {
  image?: string;
  label: string;
  description?: string;
}

type FrameStyle = 'classic' | 'modern' | 'ornate' | 'minimal';

interface FramedPictureData {
  items: ImageItem[];
  theme?: string;
  frameStyle?: FrameStyle;
}

// Placeholder image
const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3ENo Image%3C/svg%3E';

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
 * Framed Picture Shape
 *
 * Renders images with decorative frames in a gallery layout.
 */
export const framedPictureShape: ShapeDefinition = {
  id: 'framedPicture',

  bounds(ctx) {
    const data = ctx.node.data as unknown as FramedPictureData;
    const itemCount = data.items?.length || 0;

    const frameWidth = 200;
    const frameHeight = 250;
    const columns = Math.min(itemCount, 3);
    const rows = Math.ceil(itemCount / columns);
    const spacing = 30;
    const padding = 20;

    const width = columns * frameWidth + (columns - 1) * spacing + padding * 2;
    const height = rows * frameHeight + (rows - 1) * spacing + padding * 2;

    return { width, height };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    return createStandardAnchors(bounds);
  },

  render(ctx, position) {
    const data = ctx.node.data as unknown as FramedPictureData;
    const items = data.items || [];
    const theme = data.theme || 'professional';
    const frameStyle = data.frameStyle || 'classic';

    const frameWidth = 200;
    const frameHeight = 250;
    const imageHeight = 180;
    const labelHeight = 40;
    const columns = Math.min(items.length, 3);
    const spacing = 30;
    const padding = 20;

    const colorTheme = getGlyphsetTheme(theme);
    const parts: string[] = [];

    const bounds = this.bounds(ctx);

    // Background
    parts.push(
      `<rect x="${position.x}" y="${position.y}" width="${bounds.width}" height="${bounds.height}" ` +
        `fill="#fafafa" stroke="#e0e0e0" stroke-width="1" rx="8"/>`
    );

    items.forEach((item, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const x = position.x + padding + col * (frameWidth + spacing);
      const y = position.y + padding + row * (frameHeight + spacing);

      const color = getThemeColor(colorTheme, index);
      const imageUrl = getImageUrl(item.image);

      // Frame border based on style
      let frameStroke = '';
      let frameFill = '';
      let frameWidth_stroke = 0;

      if (frameStyle === 'classic') {
        frameStroke = color;
        frameFill = '#ffffff';
        frameWidth_stroke = 8;
      } else if (frameStyle === 'modern') {
        frameStroke = color;
        frameFill = 'transparent';
        frameWidth_stroke = 3;
      } else if (frameStyle === 'ornate') {
        frameStroke = color;
        frameFill = '#fef8e7';
        frameWidth_stroke = 12;
      } else {
        // minimal
        frameStroke = '#999999';
        frameFill = 'transparent';
        frameWidth_stroke = 1;
      }

      // Outer frame
      parts.push(
        `<rect x="${x}" y="${y}" width="${frameWidth}" height="${frameHeight}" ` +
          `fill="${frameFill}" stroke="${frameStroke}" stroke-width="${frameWidth_stroke}" rx="2"/>`
      );

      // Inner image area with mat
      const matSize =
        frameStyle === 'ornate' ? 20 : frameStyle === 'classic' ? 15 : 10;
      const imageX = x + matSize;
      const imageY = y + matSize;
      const imageWidth = frameWidth - matSize * 2;
      const actualImageHeight = imageHeight - matSize;

      // Mat/inner border
      if (frameStyle === 'classic' || frameStyle === 'ornate') {
        parts.push(
          `<rect x="${imageX}" y="${imageY}" width="${imageWidth}" height="${actualImageHeight}" ` +
            `fill="white" stroke="${color}" stroke-width="1"/>`
        );
      }

      // Image with clip path
      const clipId = `clip-framed-${ctx.node.id}-${index}`;
      parts.push(
        `<defs>`,
        `  <clipPath id="${clipId}">`,
        `    <rect x="${imageX}" y="${imageY}" width="${imageWidth}" height="${actualImageHeight}"/>`,
        `  </clipPath>`,
        `</defs>`
      );

      parts.push(
        `<image href="${imageUrl}" x="${imageX}" y="${imageY}" width="${imageWidth}" height="${actualImageHeight}" ` +
          `clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>`
      );

      // Label below image
      const labelY = y + frameHeight - labelHeight / 2 - 5;
      const labelCtx = {
        ...ctx,
        style: { fontSize: 12, fontWeight: '500', color: '#333' },
      };
      parts.push(
        renderShapeLabel(
          labelCtx,
          item.label,
          x + frameWidth / 2,
          labelY,
          'middle'
        )
      );

      // Decorative elements for ornate style
      if (frameStyle === 'ornate') {
        // Corner decorations
        const cornerSize = 8;
        [
          [x + 5, y + 5],
          [x + frameWidth - 5, y + 5],
          [x + 5, y + frameHeight - 5],
          [x + frameWidth - 5, y + frameHeight - 5],
        ].forEach(([cx, cy]) => {
          parts.push(
            `<circle cx="${cx}" cy="${cy}" r="${cornerSize}" fill="${color}" opacity="0.6"/>`
          );
        });
      }
    });

    return parts.join('\n');
  },
};
