import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

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
  const palette = customColors && customColors.length > 0 ? customColors : DEFAULT_PALETTE;
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
function normalizeData(data: any): DataItem[] {
  if (!data || !data.values || !Array.isArray(data.values)) {
    return [];
  }

  return data.values
    .map((item: any, i: number) => {
      if (typeof item === 'number') {
        return { label: `Slice ${i + 1}`, value: item };
      }
      if (typeof item === 'object' && 'value' in item) {
        return { label: item.label || `Slice ${i + 1}`, value: item.value };
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
 * Render legend for pie chart
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
      const percentageStr = percentage % 1 === 0 ? percentage.toFixed(0) : percentage.toFixed(1);

      return `<g>
      <rect x="${startX}" y="${y}" width="${SWATCH_SIZE}" height="${SWATCH_SIZE}" fill="${color}" stroke="#333" stroke-width="1" />
      <text x="${startX + LABEL_OFFSET}" y="${y + 10}" font-size="11" fill="#333">${slice.label} (${percentageStr}%)</text>
    </g>`;
    })
    .join('\n    ');
}

/**
 * Pie chart shape with data-driven slice rendering
 */
export const pieChart: ShapeDefinition = {
  id: 'pie-chart',

  bounds(ctx: ShapeRenderContext): { width: number; height: number } {
    const size = 200;
    const showLegend = ctx.node.data?.showLegend === true;
    
    if (showLegend) {
      // Add space for legend on the right
      const legendWidth = 150;
      return { width: size + legendWidth, height: size };
    }
    
    return { width: size, height: size };
  },

  anchors(_ctx: ShapeRenderContext) {
    const size = 200;
    const r = size / 2;
    return [
      { x: r, y: 0, name: 'n' },
      { x: size, y: r, name: 'e' },
      { x: r, y: size, name: 's' },
      { x: 0, y: r, name: 'w' },
    ];
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }): string {
    const size = 200;
    const cx = position.x + size / 2;
    const cy = position.y + size / 2;
    const radius = size / 2 - 10; // Leave margin for stroke

    // Normalize and calculate slices
    const data = normalizeData(ctx.node.data);
    const slices = calculateSlices(data);

    // Get custom colors if provided
    const customColors = Array.isArray(ctx.node.data?.colors) ? ctx.node.data.colors as string[] : undefined;

    // Render slices
    const paths = renderSlices(slices, cx, cy, radius, ctx, customColors);

    // Check if legend should be rendered
    const showLegend = ctx.node.data?.showLegend === true;
    
    if (showLegend && slices.length > 0) {
      // Render legend to the right of the pie
      const legendX = position.x + size + 10;
      const legendY = position.y + 20;
      const legend = renderLegend(slices, legendX, legendY, customColors);
      
      return `${paths}\n    ${legend}`;
    }

    return paths;
  },
};
