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
 * Level data structure
 */
interface PyramidLevel {
  label: string;
  value: number;
}

/**
 * Inverted Pyramid Shape - upside-down pyramid (funnel shape)
 * Top level is widest, bottom level is narrowest
 *
 * Data format: { levels: [{label, value}], theme?, showValues? }
 *
 * Use cases:
 * - Sales funnels
 * - Hiring pipelines
 * - Filtering processes
 * - Conversion stages
 * - Elimination rounds
 */
export const invertedPyramidShape: ShapeDefinition = {
  id: 'invertedPyramid',

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
    const levelHeight = 50;
    const minWidth = 300;

    const width = Math.max(minWidth, levelCount * 70);
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
    const showValues = dataObj.showValues !== false;

    // Find max value for scaling (top is widest)
    const maxValue = Math.max(...levels.map((l) => l.value));

    const stroke = ctx.style.stroke || '#333333';
    const strokeWidth = ctx.style.strokeWidth || 2;
    const fontSize = ctx.style.fontSize || 14;
    const fontFamily =
      typeof ctx.style.font === 'string' ? ctx.style.font : 'Arial, sans-serif';

    const levelHeight = (bounds.height - 40) / levels.length;
    const maxWidth = bounds.width - 40;
    const centerX = bounds.width / 2;

    let svg = '';

    // Render levels from top to bottom (largest to smallest - INVERTED)
    levels.forEach((level, index) => {
      // Current level width (based on value)
      const widthPercent = level.value / maxValue;
      const levelWidth = maxWidth * widthPercent;
      const topY = 20 + index * levelHeight;
      const bottomY = topY + levelHeight;

      // Top edge (wider for inverted)
      const topLeft = centerX - levelWidth / 2;
      const topRight = centerX + levelWidth / 2;

      // Bottom edge (narrower - or same for last level)
      const isLastLevel = index === levels.length - 1;
      const nextWidthPercent = isLastLevel
        ? Math.min(widthPercent * 0.5, 0.3) // End in a point or narrow base
        : levels[index + 1].value / maxValue;
      const nextLevelWidth = maxWidth * nextWidthPercent;
      const bottomLeft = centerX - nextLevelWidth / 2;
      const bottomRight = centerX + nextLevelWidth / 2;

      // Trapezoid polygon (wide top, narrow bottom)
      const points = `${topLeft},${topY} ${topRight},${topY} ${bottomRight},${bottomY} ${bottomLeft},${bottomY}`;

      const color = getThemeColor(theme, index);

      // Render trapezoid
      svg += `<polygon points="${points}" `;
      svg += `fill="${color}" fill-opacity="0.85" `;
      svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

      // Label in center
      const lines = wrapText(level.label, 20);
      const labelY = (topY + bottomY) / 2;

      lines.forEach((line, lineIndex) => {
        const lineY =
          labelY + (lineIndex - (lines.length - 1) / 2) * (fontSize + 2);
        svg += `<text x="${centerX}" y="${lineY}" `;
        svg += `text-anchor="middle" dominant-baseline="middle" `;
        svg += `font-family="${fontFamily}" font-size="${fontSize}" font-weight="600" `;
        svg += `fill="white">`;
        svg += `${line}`;
        svg += `</text>`;
      });

      // Value below label (if enabled)
      if (showValues) {
        const valueY = labelY + (lines.length * (fontSize + 2)) / 2 + fontSize;
        svg += `<text x="${centerX}" y="${valueY}" `;
        svg += `text-anchor="middle" dominant-baseline="middle" `;
        svg += `font-family="${fontFamily}" font-size="${fontSize - 2}" `;
        svg += `fill="white" opacity="0.9">`;
        svg += `${level.value}`;
        svg += `</text>`;
      }
    });

    return svg;
  },
};
