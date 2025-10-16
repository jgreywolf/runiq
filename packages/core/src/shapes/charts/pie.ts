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
function getSliceColor(index: number): string {
  return DEFAULT_PALETTE[index % DEFAULT_PALETTE.length];
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
  ctx: ShapeRenderContext
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
      const color = getSliceColor(i);

      return `<path d="M ${cx},${cy} L ${x1},${y1} A ${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z" fill="${color}" stroke="${ctx.style.stroke || '#333'}" stroke-width="${ctx.style.strokeWidth || 2}" />`;
    })
    .join('\n    ');
}

/**
 * Pie chart shape with data-driven slice rendering
 */
export const pieChart: ShapeDefinition = {
  id: 'pie-chart',

  bounds(_ctx: ShapeRenderContext): { width: number; height: number } {
    // Default size: 200x200
    const size = 200;
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

    // Render slices
    const paths = renderSlices(slices, cx, cy, radius, ctx);

    return paths;
  },
};
