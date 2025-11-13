import type { ShapeDefinition } from '../../types.js';

/**
 * Theme-based color palettes
 */
const THEMES: Record<string, string[]> = {
  professional: [
    '#2563eb',
    '#3b82f6',
    '#60a5fa',
    '#93c5fd',
    '#bfdbfe',
    '#dbeafe',
  ],
  colorful: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'],
  warm: ['#dc2626', '#ea580c', '#d97706', '#ca8a04', '#a16207', '#854d0e'],
  cool: ['#0891b2', '#0284c7', '#2563eb', '#4f46e5', '#7c3aed', '#6366f1'],
  vibrant: ['#db2777', '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#0891b2'],
};

/**
 * Get color for a level based on theme
 */
function getThemeColor(theme: string, index: number): string {
  const colors = THEMES[theme] || THEMES.professional;
  return colors[index % colors.length];
}

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
 * Level data structure with optional segments
 */
interface PyramidLevel {
  label: string;
  value: number;
  segments?: string[];
}

/**
 * Segmented Pyramid Shape - pyramid with horizontal subdivisions in each level
 * Each level can be divided into multiple segments
 *
 * Data format: { levels: [{label, value, segments?: [...]}], theme? }
 *
 * Use cases:
 * - Multi-dimensional hierarchies
 * - Categorized priorities
 * - Organizational layers with departments
 * - Strategy levels with tactics
 */
export const segmentedPyramidShape: ShapeDefinition = {
  id: 'segmentedPyramid',

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
    const levelHeight = 60; // Taller to accommodate segments
    const minWidth = 350;

    const width = Math.max(minWidth, levelCount * 80);
    const height = levelCount * levelHeight + 40;

    return { width, height };
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

    const theme = (dataObj.theme as string) || 'professional';

    // Find max value for scaling
    const maxValue = Math.max(...levels.map((l) => l.value));

    const stroke = ctx.style.stroke || '#333333';
    const strokeWidth = ctx.style.strokeWidth || 2;
    const fontSize = ctx.style.fontSize || 13;
    const fontFamily =
      typeof ctx.style.font === 'string' ? ctx.style.font : 'Arial, sans-serif';

    const levelHeight = (bounds.height - 40) / levels.length;
    const maxWidth = bounds.width - 40;
    const centerX = bounds.width / 2;

    let svg = '';

    // Render levels from top to bottom (smallest to largest)
    levels.forEach((level, index) => {
      const widthPercent = level.value / maxValue;
      const levelWidth = maxWidth * widthPercent;
      const topY = 20 + index * levelHeight;
      const bottomY = topY + levelHeight;

      // Calculate trapezoid points
      const topLeft = centerX - levelWidth / 2;
      const topRight = centerX + levelWidth / 2;

      const isLastLevel = index === levels.length - 1;
      const nextWidthPercent = isLastLevel
        ? widthPercent
        : levels[index + 1].value / maxValue;
      const nextLevelWidth = maxWidth * nextWidthPercent;
      const bottomLeft = centerX - nextLevelWidth / 2;
      const bottomRight = centerX + nextLevelWidth / 2;

      const color = getThemeColor(theme, index);

      // Check if level has segments
      const segments = level.segments || [];
      const hasSegments = segments.length > 0;

      if (hasSegments && segments.length > 0) {
        // Render level with horizontal segments
        const segmentWidth = (topRight - topLeft) / segments.length;
        const bottomSegmentWidth = (bottomRight - bottomLeft) / segments.length;

        segments.forEach((segment, segIndex) => {
          // Calculate segment trapezoid
          const segTopLeft = topLeft + segIndex * segmentWidth;
          const segTopRight = segTopLeft + segmentWidth;
          const segBottomLeft = bottomLeft + segIndex * bottomSegmentWidth;
          const segBottomRight = segBottomLeft + bottomSegmentWidth;

          const points = `${segTopLeft},${topY} ${segTopRight},${topY} ${segBottomRight},${bottomY} ${segBottomLeft},${bottomY}`;

          // Lighter shade for segments
          svg += `<polygon points="${points}" `;
          svg += `fill="${color}" fill-opacity="0.7" `;
          svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

          // Segment label (smaller font)
          // For trapezoid, calculate center based on both top and bottom edges
          const segCenterX =
            (segTopLeft + segTopRight + segBottomLeft + segBottomRight) / 4;
          const segCenterY = (topY + bottomY) / 2;
          const lines = wrapText(segment, 10);

          lines.forEach((line, lineIndex) => {
            const lineY =
              segCenterY +
              (lineIndex - (lines.length - 1) / 2) * (fontSize - 1);
            svg += `<text x="${segCenterX}" y="${lineY}" `;
            svg += `text-anchor="middle" dominant-baseline="middle" `;
            svg += `font-family="${fontFamily}" font-size="${fontSize - 2}" `;
            svg += `fill="white">`;
            svg += `${line}`;
            svg += `</text>`;
          });
        });

        // Level label at top of segments (bold)
        const labelY = topY + 12;
        svg += `<text x="${centerX}" y="${labelY}" `;
        svg += `text-anchor="middle" dominant-baseline="middle" `;
        svg += `font-family="${fontFamily}" font-size="${fontSize}" font-weight="bold" `;
        svg += `fill="${stroke}">`;
        svg += `${level.label}`;
        svg += `</text>`;
      } else {
        // Render solid level without segments
        const points = `${topLeft},${topY} ${topRight},${topY} ${bottomRight},${bottomY} ${bottomLeft},${bottomY}`;

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
      }
    });

    return svg;
  },
};
