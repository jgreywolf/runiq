import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';
import type { ShapeDefinition } from '../../types/index.js';
import { createStandardAnchors } from './utils.js';

/**
 * Wrap text to fit within a given width
 */
function wrapText(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) return [text];

  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length <= maxChars) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Level data structure with items
 */
interface PyramidLevel {
  label: string;
  value: number;
  items?: string[];
}

/**
 * Pyramid List Shape - split layout with pyramid on left, list on right
 * Each pyramid level has corresponding list items
 *
 * Data format: { levels: [{label, value, items?: [...]}], theme? }
 *
 * Use cases:
 * - Prioritized features with details
 * - Hierarchical concepts with descriptions
 * - Learning paths with topics
 * - Organizational levels with roles
 */
export const pyramidListShape: ShapeDefinition = {
  id: 'pyramidList',

  bounds(ctx) {
    const data = (ctx.node.data as unknown) || {};
    const dataObj =
      typeof data === 'object' && data !== null
        ? (data as Record<string, unknown>)
        : {};

    let levelsCount = 3; // default

    if (Array.isArray(dataObj.levels)) {
      levelsCount = (dataObj.levels as unknown[]).length;
    }

    const levelCount = Math.max(levelsCount, 3);
    const levelHeight = 70; // Taller to accommodate list items
    const minWidth = 500; // Wider for split layout

    const width = Math.max(minWidth, 500);
    const height = levelCount * levelHeight + 40;

    return { width, height };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    return createStandardAnchors(bounds);
  },

  render(ctx) {
    const bounds = this.bounds(ctx);
    const data = (ctx.node.data as unknown) || {};

    const dataObj =
      typeof data === 'object' && data !== null
        ? (data as Record<string, unknown>)
        : {};

    // Extract levels
    let levels: PyramidLevel[] = [];
    if (Array.isArray(dataObj.levels)) {
      levels = dataObj.levels as PyramidLevel[];
    }

    if (levels.length === 0) {
      return '';
    }

    const themeId = (dataObj.theme as string) || 'professional';
    const theme = getGlyphsetTheme(themeId);

    // Find max value for scaling
    const maxValue = Math.max(...levels.map((l) => l.value));

    const stroke = ctx.style.stroke || '#333333';
    const strokeWidth = ctx.style.strokeWidth || 1.5;
    const fontSize = ctx.style.fontSize || 13;
    const fontFamily =
      typeof ctx.style.font === 'string' ? ctx.style.font : 'Arial, sans-serif';

    const levelHeight = (bounds.height - 40) / levels.length;

    // Split layout: pyramid on left (40%), list on right (60%)
    const pyramidWidth = bounds.width * 0.35;
    const listStartX = bounds.width * 0.4;

    const maxPyramidWidth = pyramidWidth - 20;
    const centerX = pyramidWidth / 2;

    let svg = '';

    // Render pyramid levels and corresponding lists
    levels.forEach((level, index) => {
      const widthPercent = level.value / maxValue;
      const levelWidth = maxPyramidWidth * widthPercent;
      const topY = 20 + index * levelHeight;
      const bottomY = topY + levelHeight;

      // Calculate pyramid trapezoid points
      const topLeft = centerX - levelWidth / 2;
      const topRight = centerX + levelWidth / 2;

      const isLastLevel = index === levels.length - 1;
      const nextWidthPercent = isLastLevel
        ? widthPercent
        : levels[index + 1].value / maxValue;
      const nextLevelWidth = maxPyramidWidth * nextWidthPercent;
      const bottomLeft = centerX - nextLevelWidth / 2;
      const bottomRight = centerX + nextLevelWidth / 2;

      const color = getThemeColor(theme, index);

      // Render pyramid trapezoid
      const points = `${topLeft},${topY} ${topRight},${topY} ${bottomRight},${bottomY} ${bottomLeft},${bottomY}`;

      svg += `<polygon points="${points}" `;
      svg += `fill="${color}" fill-opacity="0.85" `;
      svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

      // Level label in pyramid
      const pyramidCenterY = (topY + bottomY) / 2;
      svg += `<text x="${centerX}" y="${pyramidCenterY}" `;
      svg += `text-anchor="middle" dominant-baseline="middle" `;
      svg += `font-family="${fontFamily}" font-size="${fontSize}" font-weight="bold" `;
      svg += `fill="white">`;
      svg += `${level.label}`;
      svg += `</text>`;

      // Render list items on the right
      const items = level.items || [];
      if (items.length > 0) {
        const itemSpacing = Math.min(levelHeight / (items.length + 1), 22);
        const startY =
          topY + (levelHeight - (items.length - 1) * itemSpacing) / 2;

        items.forEach((item, itemIndex) => {
          const itemY = startY + itemIndex * itemSpacing;

          // Bullet point
          svg += `<circle cx="${listStartX}" cy="${itemY}" r="3" fill="${color}" />`;

          // Item text (with wrapping if needed)
          const lines = wrapText(item, 40);
          lines.forEach((line, lineIndex) => {
            const textY = itemY + lineIndex * (fontSize + 2);
            svg += `<text x="${listStartX + 10}" y="${textY}" `;
            svg += `text-anchor="start" dominant-baseline="middle" `;
            svg += `font-family="${fontFamily}" font-size="${fontSize - 1}" `;
            svg += `fill="${stroke}">`;
            svg += `${line}`;
            svg += `</text>`;
          });
        });
      } else {
        // No items - show level label on right as well
        svg += `<text x="${listStartX + 10}" y="${pyramidCenterY}" `;
        svg += `text-anchor="start" dominant-baseline="middle" `;
        svg += `font-family="${fontFamily}" font-size="${fontSize}" `;
        svg += `fill="${stroke}">`;
        svg += `${level.label}`;
        svg += `</text>`;
      }
    });

    return svg;
  },
};
