import type { ShapeDefinition } from '../../types.js';

/**
 * Default color palette for pyramid levels
 */
const DEFAULT_COLORS = [
  '#4299e1', // blue
  '#48bb78', // green
  '#ed8936', // orange
  '#9f7aea', // purple
  '#f56565', // red
  '#38b2ac', // teal
  '#ed64a6', // pink
  '#ecc94b', // yellow
];

/**
 * Level data structure
 */
interface PyramidLevel {
  label: string;
  value: number;
}

/**
 * Pyramid diagram - hierarchical stacking with proportional widths
 * Data format: { levels: [{label, value}], colors?, showValues? }
 *
 * Use cases:
 * - Organizational hierarchies
 * - Maslow's hierarchy of needs
 * - Priority levels
 * - Population pyramids
 */
export const pyramidShape: ShapeDefinition = {
  id: 'pyramid',

  bounds(ctx) {
    const data = (ctx.node.data as unknown) || {};
    const dataObj = typeof data === 'object' && data !== null ? data as Record<string, unknown> : {};
    
    // Support multiple formats:
    // 1. data.levels (programmatic API)
    // 2. data.values (DSL parser output)
    // 3. data as array directly
    let levelsCount = 3; // default
    
    if (Array.isArray(dataObj.levels)) {
      levelsCount = (dataObj.levels as unknown[]).length;
    } else if (Array.isArray(dataObj.values)) {
      levelsCount = (dataObj.values as unknown[]).length;
    } else if (Array.isArray(data)) {
      levelsCount = (data as unknown[]).length;
    }

    // Default size or size based on number of levels
    const levelCount = Math.max(levelsCount, 3);
    const levelHeight = 40;
    const minWidth = 250;

    const width = Math.max(minWidth, levelCount * 60);
    const height = levelCount * levelHeight + 40; // Extra for padding

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
    
    // Type guard for data
    const dataObj = typeof data === 'object' && data !== null ? data as Record<string, unknown> : {};
    
    // Get custom labels if provided
    const customLabels = Array.isArray(dataObj.labels) ? (dataObj.labels as string[]) : undefined;
    
    // Support multiple formats:
    // 1. data.levels (programmatic API)
    // 2. data.values (DSL parser output)
    // 3. data as array directly
    let levels: PyramidLevel[];
    
    if (Array.isArray(dataObj.levels)) {
      levels = dataObj.levels as PyramidLevel[];
    } else if (Array.isArray(dataObj.values)) {
      // Check if values are objects with label/value or just numbers
      levels = (dataObj.values as unknown[]).map((item: unknown, i: number) => {
        if (typeof item === 'number') {
          return { label: customLabels?.[i] || `Level ${i + 1}`, value: item };
        }
        if (typeof item === 'object' && item !== null && 'value' in item) {
          const objItem = item as { label?: string; value: number };
          return { 
            label: objItem.label || customLabels?.[i] || `Level ${i + 1}`, 
            value: objItem.value 
          };
        }
        return { label: `Level ${i + 1}`, value: 0 };
      });
    } else if (Array.isArray(data)) {
      // Simple array of numbers
      levels = (data as unknown[]).map((value: unknown, i: number) => ({
        label: customLabels?.[i] || `Level ${i + 1}`,
        value: typeof value === 'number' ? value : 0,
      }));
    } else {
      levels = [];
    }
    
    const colors = Array.isArray(dataObj.colors) ? (dataObj.colors as string[]) : DEFAULT_COLORS;
    const showValues = dataObj.showValues !== false; // Show by default

    if (levels.length === 0) {
      // Return empty group if no data
      return '';
    }

    // Find max value for scaling
    const maxValue = Math.max(...levels.map((l) => l.value));

    // SVG style from context
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 2;
    const fontSize = ctx.style.fontSize || 14;
    const fontFamily = typeof ctx.style.font === 'string' ? ctx.style.font : 'Arial, sans-serif';

    const levelHeight = (bounds.height - 40) / levels.length;
    const maxWidth = bounds.width - 40; // Padding on sides
    const centerX = bounds.width / 2;

    let svg = '';

    // Render levels from top to bottom (smallest to largest)
    levels.forEach((level, index) => {
      const widthPercent = level.value / maxValue;
      const levelWidth = maxWidth * widthPercent;
      const topY = 20 + index * levelHeight;
      const bottomY = topY + levelHeight;

      // Calculate trapezoid points
      // Top edge (narrower)
      const topLeft = centerX - levelWidth / 2;
      const topRight = centerX + levelWidth / 2;

      // Bottom edge (wider - or same width for last level)
      const isLastLevel = index === levels.length - 1;
      const nextWidthPercent = isLastLevel
        ? widthPercent
        : levels[index + 1].value / maxValue;
      const nextLevelWidth = maxWidth * nextWidthPercent;
      const bottomLeft = centerX - nextLevelWidth / 2;
      const bottomRight = centerX + nextLevelWidth / 2;

      // Trapezoid polygon
      const points = `${topLeft},${topY} ${topRight},${topY} ${bottomRight},${bottomY} ${bottomLeft},${bottomY}`;

      // Get color for this level
      const color =
        colors[index % colors.length] ||
        DEFAULT_COLORS[index % DEFAULT_COLORS.length];

      // Render trapezoid
      svg += `<polygon points="${points}" `;
      svg += `fill="${color}" fill-opacity="0.7" `;
      svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

      // Label in center of trapezoid
      const labelY = (topY + bottomY) / 2 + (showValues ? -4 : 0);
      svg += `<text x="${centerX}" y="${labelY}" `;
      svg += `text-anchor="middle" dominant-baseline="middle" `;
      svg += `font-family="${fontFamily}" font-size="${fontSize}" font-weight="bold" `;
      svg += `fill="${stroke}">`;
      svg += `${level.label}`;
      svg += `</text>`;

      // Value below label (if enabled)
      if (showValues) {
        const valueY = labelY + fontSize + 2;
        svg += `<text x="${centerX}" y="${valueY}" `;
        svg += `text-anchor="middle" dominant-baseline="middle" `;
        svg += `font-family="${fontFamily}" font-size="${fontSize - 2}" `;
        svg += `fill="${stroke}">`;
        svg += `${level.value}`;
        svg += `</text>`;
      }
    });

    return svg;
  },
};
