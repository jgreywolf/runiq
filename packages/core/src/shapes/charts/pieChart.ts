import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';

/**
 * Default color palette for pie chart slices
 */
const DEFAULT_PALETTE = [
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
 * Get color for slice at given index (cycles through palette)
 */
function getSliceColor(index: number, customColors?: string[]): string {
  const palette =
    customColors && customColors.length > 0 ? customColors : DEFAULT_PALETTE;
  return palette[index % palette.length];
}

/**
 * Normalized data item with label and value
 */
interface DataItem {
  label: string;
  value: number;
}

/**
 * Normalize data from various formats to consistent {label, value} format
 */
function normalizeData(data: unknown, customLabels?: string[]): DataItem[] {
  // Format 1: Simple array of numbers [30, 20, 50]
  if (Array.isArray(data)) {
    return data
      .map((value: unknown, i: number) => ({
        label: customLabels?.[i] || `Slice ${i + 1}`,
        value: typeof value === 'number' ? value : 0,
      }))
      .filter((item: DataItem) => item.value > 0);
  }

  // Format 2: Object with values array
  if (
    !data ||
    typeof data !== 'object' ||
    !('values' in data) ||
    !Array.isArray(data.values)
  ) {
    return [];
  }

  return (data.values as unknown[])
    .map((item: unknown, i: number) => {
      if (typeof item === 'number') {
        return { label: customLabels?.[i] || `Slice ${i + 1}`, value: item };
      }
      if (typeof item === 'object' && item !== null && 'value' in item) {
        const objItem = item as { label?: string; value: unknown };
        const value = typeof objItem.value === 'number' ? objItem.value : 0;
        return {
          label: objItem.label || customLabels?.[i] || `Slice ${i + 1}`,
          value,
        };
      }
      return null;
    })
    .filter(
      (item: DataItem | null): item is DataItem =>
        item !== null && item.value > 0
    ); // Filter nulls and non-positive values
}

/**
 * Pie slice with calculated angles
 */
interface PieSlice {
  label: string;
  value: number;
  percentage: number;
  startAngle: number;
  endAngle: number;
  angle: number;
}

/**
 * Calculate pie slices with angles from data
 */
function calculateSlices(data: DataItem[]): PieSlice[] {
  if (data.length === 0) return [];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) return [];

  let startAngle = 0;

  return data.map((item) => {
    const angle = (item.value / total) * 360;
    const slice: PieSlice = {
      label: item.label,
      value: item.value,
      percentage: (item.value / total) * 100,
      startAngle,
      endAngle: startAngle + angle,
      angle,
    };
    startAngle += angle;
    return slice;
  });
}

/**
 * Render SVG paths for pie slices
 */
function renderSlices(
  slices: PieSlice[],
  cx: number,
  cy: number,
  radius: number,
  ctx: ShapeRenderContext,
  customColors?: string[]
): string {
  if (slices.length === 0) {
    // Render empty circle placeholder
    return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="#f0f0f0" stroke="${ctx.style.stroke}" stroke-width="${ctx.style.strokeWidth || 1}" />`;
  }

  return slices
    .map((slice, i) => {
      const startRad = ((slice.startAngle - 90) * Math.PI) / 180;
      const endRad = ((slice.endAngle - 90) * Math.PI) / 180;

      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);

      const largeArc = slice.angle > 180 ? 1 : 0;
      const color = getSliceColor(i, customColors);

      return `<path d="M ${cx},${cy} L ${x1},${y1} A ${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z" fill="${color}" stroke="${ctx.style.stroke || '#333'}" stroke-width="${ctx.style.strokeWidth || 2}" />`;
    })
    .join('\n    ');
}

/**
 * Legend position options
 */
type LegendPosition =
  | 'top'
  | 'top-right'
  | 'right'
  | 'bottom-right'
  | 'bottom'
  | 'bottom-left'
  | 'left'
  | 'top-left';

/**
 * Calculate legend position based on position setting
 */
function calculateLegendPosition(
  position: { x: number; y: number },
  size: number,
  sliceCount: number,
  legendPos: LegendPosition
): { x: number; y: number } {
  const ROW_HEIGHT = 20;
  const legendHeight = sliceCount * ROW_HEIGHT;
  const legendWidth = 150;
  const horizontalLegendHeight = 40; // Height for horizontal legend (1-2 rows typical)

  switch (legendPos) {
    case 'top':
      return { x: position.x, y: position.y - horizontalLegendHeight - 10 };
    case 'top-right':
      return { x: position.x + size + 10, y: position.y };
    case 'right':
      return {
        x: position.x + size + 10,
        y: position.y + (size - legendHeight) / 2,
      };
    case 'bottom-right':
      return { x: position.x + size + 10, y: position.y + size - legendHeight };
    case 'bottom':
      return { x: position.x, y: position.y + size + 10 };
    case 'bottom-left':
      return {
        x: position.x - legendWidth - 10,
        y: position.y + size - legendHeight,
      };
    case 'left':
      return {
        x: position.x - legendWidth - 10,
        y: position.y + (size - legendHeight) / 2,
      };
    case 'top-left':
      return { x: position.x - legendWidth - 10, y: position.y };
    default:
      return { x: position.x + size + 10, y: position.y + size - legendHeight }; // bottom-right default
  }
}

/**
 * Render legend for pie chart (vertical layout)
 */
function renderLegend(
  slices: PieSlice[],
  startX: number,
  startY: number,
  customColors?: string[]
): string {
  const SWATCH_SIZE = 12;
  const ROW_HEIGHT = 20;
  const LABEL_OFFSET = 18;

  return slices
    .map((slice, i) => {
      const y = startY + i * ROW_HEIGHT;
      const color = getSliceColor(i, customColors);
      // Round percentage, remove decimal if .0
      const percentage = Math.round(slice.percentage * 10) / 10;
      const percentageStr =
        percentage % 1 === 0 ? percentage.toFixed(0) : percentage.toFixed(1);

      return `<g>
      <rect x="${startX}" y="${y}" width="${SWATCH_SIZE}" height="${SWATCH_SIZE}" fill="${color}" stroke="#333" stroke-width="1" />
      <text x="${startX + LABEL_OFFSET}" y="${y + 10}" font-size="11" fill="#333">${slice.label} (${percentageStr}%)</text>
    </g>`;
    })
    .join('\n    ');
}

/**
 * Render legend for pie chart (horizontal layout for top/bottom positions)
 */
function renderLegendHorizontal(
  slices: PieSlice[],
  x: number,
  y: number,
  maxWidth: number,
  customColors?: string[]
): string {
  const SWATCH_SIZE = 12;
  const ITEM_SPACING = 15; // Space between items
  const LABEL_OFFSET = 18; // Space between swatch and text

  let currentX = 0; // Start at 0, will be offset by x when rendering
  let currentY = 0; // Start at 0, will be offset by y when rendering
  const items: string[] = [];

  slices.forEach((slice, i) => {
    const color = getSliceColor(i, customColors);
    const labelText = slice.label; // Just the label, no percentage (values are on slices)

    // Estimate text width more accurately (roughly 5.5px per character for 11px font)
    const estimatedTextWidth = labelText.length * 5.5;
    const itemWidth = SWATCH_SIZE + LABEL_OFFSET + estimatedTextWidth;

    // Wrap to next row if needed (and not first item)
    if (currentX > 0 && currentX + itemWidth > maxWidth) {
      currentY += 20;
      currentX = 0;
    }

    const actualX = x + currentX;
    const actualY = y + currentY;

    items.push(`<g>
      <rect x="${actualX}" y="${actualY}" width="${SWATCH_SIZE}" height="${SWATCH_SIZE}" fill="${color}" stroke="#333" stroke-width="1" />
      <text x="${actualX + LABEL_OFFSET}" y="${actualY + 10}" font-size="11" fill="#333">${labelText}</text>
    </g>`);

    currentX += itemWidth + ITEM_SPACING;
  });

  return items.join('\n    ');
}

/**
 * Render value labels on pie slices
 */
function renderSliceLabels(
  slices: PieSlice[],
  cx: number,
  cy: number,
  radius: number,
  customColors?: string[]
): string {
  return slices
    .map((slice, i) => {
      // Calculate midpoint angle
      const midAngle =
        (((slice.startAngle + slice.endAngle) / 2 - 90) * Math.PI) / 180;

      // Position text at 70% of radius from center
      const labelRadius = radius * 0.7;
      const x = cx + labelRadius * Math.cos(midAngle);
      const y = cy + labelRadius * Math.sin(midAngle);

      // Use contrasting text color (white for dark slices, black for light)
      const color = getSliceColor(i, customColors);
      const brightness =
        parseInt(color.slice(1, 3), 16) * 0.299 +
        parseInt(color.slice(3, 5), 16) * 0.587 +
        parseInt(color.slice(5, 7), 16) * 0.114;
      const textColor = brightness > 128 ? '#333' : '#fff';

      return `<text x="${x}" y="${y + 4}" text-anchor="middle" font-size="12" font-weight="bold" fill="${textColor}">${slice.value}</text>`;
    })
    .join('\n    ');
}

/**
 * Render title text above the pie chart
 */
/**
 * Render title above the chart
 */
function renderTitle(title: string, x: number, y: number): string {
  // Position title at the top of the chart area (above the pie)
  const titleY = y + 15; // 15px from top
  const titleX = x;
  return `<text x="${titleX}" y="${titleY}" text-anchor="middle" font-size="16" font-weight="bold" fill="#333">${title}</text>`;
}

/**
 * Pie chart shape with data-driven slice rendering
 */
export const pieChart: ShapeDefinition = {
  id: 'pieChart',

  bounds(ctx: ShapeRenderContext): { width: number; height: number } {
    const size = 250;
    const titleHeight = ctx.node.label ? 30 : 0; // Add space for title if present
    // Show legend by default unless explicitly set to false
    const showLegend = ctx.node.data?.showLegend !== false;

    if (showLegend) {
      const legendPosition =
        (ctx.node.data?.legendPosition as LegendPosition) || 'bottom-right';
      const legendWidth = 150;
      const horizontalLegendHeight = 40; // Height for horizontal legend (1-2 rows typical)

      // Calculate bounds based on legend position
      switch (legendPosition) {
        case 'top':
        case 'bottom':
          return {
            width: size,
            height: size + horizontalLegendHeight + titleHeight + 10,
          };
        case 'left':
        case 'top-left':
        case 'bottom-left':
          return { width: size + legendWidth + 10, height: size + titleHeight };
        case 'right':
        case 'top-right':
        case 'bottom-right':
        default:
          return { width: size + legendWidth + 10, height: size + titleHeight };
      }
    }

    return { width: size, height: size + titleHeight };
  },

  anchors(_ctx: ShapeRenderContext) {
    const size = 250;
    const r = size / 2;
    return [
      { x: r, y: 0, name: 'n' },
      { x: size, y: r, name: 'e' },
      { x: r, y: size, name: 's' },
      { x: 0, y: r, name: 'w' },
    ];
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }): string {
    const size = 250;
    const title = ctx.node.label; // Title from node label only
    const titleHeight = title ? 30 : 0; // Space for title
    const legendPosition =
      (ctx.node.data?.legendPosition as LegendPosition) || 'bottom-right';
    const showLegend = ctx.node.data?.showLegend !== false;

    // Adjust pie chart position based on legend position and title
    let pieX = position.x;
    let pieY = position.y + titleHeight; // Push down for title

    if (showLegend) {
      const legendWidth = 150;
      const horizontalLegendHeight = 40; // Height for horizontal legend

      switch (legendPosition) {
        case 'top':
          pieY = position.y + titleHeight + horizontalLegendHeight + 10;
          break;
        case 'left':
        case 'top-left':
        case 'bottom-left':
          pieX = position.x + legendWidth + 10;
          break;
      }
    }

    const cx = pieX + size / 2;
    const cy = pieY + size / 2;
    const radius = size / 2 - 10; // Leave margin for stroke

    // Get custom labels and colors if provided
    const customLabels = Array.isArray(ctx.node.data?.labels)
      ? (ctx.node.data.labels as string[])
      : undefined;
    const customColors = Array.isArray(ctx.node.data?.colors)
      ? (ctx.node.data.colors as string[])
      : undefined;

    // Normalize and calculate slices
    const data = normalizeData(ctx.node.data, customLabels);
    const slices = calculateSlices(data);

    // Render title element (already defined at top of function)
    const titleElement = title ? renderTitle(title, cx, position.y) : '';

    // Render slices
    const paths = renderSlices(slices, cx, cy, radius, ctx, customColors);

    // Render values on slices
    const sliceLabels =
      slices.length > 0
        ? renderSliceLabels(slices, cx, cy, radius, customColors)
        : '';

    if (showLegend && slices.length > 0) {
      const legendPos = calculateLegendPosition(
        { x: pieX, y: pieY },
        size,
        slices.length,
        legendPosition
      );

      // Use horizontal layout for top/bottom positions
      let legend: string;
      if (legendPosition === 'top' || legendPosition === 'bottom') {
        legend = renderLegendHorizontal(
          slices,
          legendPos.x,
          legendPos.y,
          size,
          customColors
        );
      } else {
        legend = renderLegend(slices, legendPos.x, legendPos.y, customColors);
      }

      return `${titleElement}${paths}\n    ${sliceLabels}\n    ${legend}`;
    }

    return `${titleElement}${paths}\n    ${sliceLabels}`;
  },
};
