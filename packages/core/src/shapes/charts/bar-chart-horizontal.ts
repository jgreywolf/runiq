import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

const BAR_HEIGHT = 40;
const BAR_SPACING = 15;
const CHART_MARGIN_LEFT = 120; // Space for labels on the left
const CHART_MARGIN_RIGHT = 40;
const DEFAULT_WIDTH = 400;

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

interface BarData {
  label: string;
  value: number;
}

/**
 * Normalize data into consistent format
 */
function normalizeData(data: any): BarData[] {
  if (!data || !data.values || !Array.isArray(data.values)) {
    return [];
  }

  return data.values
    .map((item: any, index: number): BarData | null => {
      if (typeof item === 'number') {
        // Filter out zero and negative values
        if (item <= 0) return null;
        return {
          label: `Bar ${index + 1}`,
          value: item,
        };
      }

      if (typeof item === 'object' && item !== null) {
        const value = Number(item.value);
        // Filter out zero and negative values
        if (isNaN(value) || value <= 0) return null;
        return {
          label: item.label || `Bar ${index + 1}`,
          value,
        };
      }

      return null;
    })
    .filter((item: BarData | null): item is BarData => item !== null);
}

/**
 * Get color from palette by index
 */
function getBarColor(index: number): string {
  return DEFAULT_PALETTE[index % DEFAULT_PALETTE.length];
}

/**
 * Render individual bars
 */
function renderBars(
  data: BarData[],
  maxValue: number,
  ctx: ShapeRenderContext,
  position: { x: number; y: number }
): string {
  const bounds = barChartHorizontal.bounds(ctx);
  const chartWidth = bounds.width - CHART_MARGIN_LEFT - CHART_MARGIN_RIGHT;

  const bars = data.map((item, index) => {
    const barWidth = (item.value / maxValue) * chartWidth;
    const x = position.x + CHART_MARGIN_LEFT;
    const y = position.y + BAR_SPACING + index * (BAR_HEIGHT + BAR_SPACING);

    const color = getBarColor(index);
    const stroke = ctx.style?.stroke || '#333';
    const strokeWidth = ctx.style?.strokeWidth || 1;

    // Bar rectangle
    const bar = `<rect x="${x}" y="${y}" width="${barWidth}" height="${BAR_HEIGHT}" fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Label on left
    const labelX = position.x + CHART_MARGIN_LEFT - 10;
    const labelY = y + BAR_HEIGHT / 2 + 4; // Center vertically
    const label = `<text x="${labelX}" y="${labelY}" text-anchor="end" font-size="12" fill="#333">${item.label}</text>`;

    // Value at end of bar
    const valueX = x + barWidth + 5;
    const valueY = y + BAR_HEIGHT / 2 + 4;
    const value = `<text x="${valueX}" y="${valueY}" text-anchor="start" font-size="11" fill="#666">${item.value}</text>`;

    return bar + label + value;
  });

  return bars.join('\n');
}

/**
 * Render Y-axis
 */
function renderAxis(ctx: ShapeRenderContext, position: { x: number; y: number }): string {
  const bounds = barChartHorizontal.bounds(ctx);
  const axisX = position.x + CHART_MARGIN_LEFT;
  const axisY1 = position.y + BAR_SPACING / 2;
  const axisY2 = position.y + bounds.height - BAR_SPACING / 2;

  return `<line x1="${axisX}" y1="${axisY1}" x2="${axisX}" y2="${axisY2}" stroke="#333" stroke-width="2" />`;
}

/**
 * Render empty state
 */
function renderEmptyState(ctx: ShapeRenderContext, position: { x: number; y: number }): string {
  const bounds = barChartHorizontal.bounds(ctx);
  const centerX = position.x + bounds.width / 2;
  const centerY = position.y + bounds.height / 2;

  return `
    <rect x="${position.x}" y="${position.y}" width="${bounds.width}" height="${bounds.height}" fill="#f7fafc" stroke="#cbd5e0" stroke-width="2" rx="4" />
    <text x="${centerX}" y="${centerY}" text-anchor="middle" font-size="14" fill="#718096">No data available</text>
  `;
}

/**
 * Horizontal bar chart shape definition
 */
export const barChartHorizontal: ShapeDefinition = {
  id: 'bar-chart-horizontal',

  bounds(ctx: ShapeRenderContext): { width: number; height: number } {
    const data = normalizeData(ctx.node.data);

    if (data.length === 0) {
      // Minimum size for empty state
      return {
        width: DEFAULT_WIDTH,
        height: 200,
      };
    }

    const width = DEFAULT_WIDTH;
    const height = data.length * (BAR_HEIGHT + BAR_SPACING) + BAR_SPACING;

    return { width, height };
  },

  anchors(ctx: ShapeRenderContext) {
    const { width, height } = barChartHorizontal.bounds(ctx);

    return [
      { x: width / 2, y: 0, name: 'n' }, // north
      { x: width, y: height / 2, name: 'e' }, // east
      { x: width / 2, y: height, name: 's' }, // south
      { x: 0, y: height / 2, name: 'w' }, // west
    ];
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }): string {
    const data = normalizeData(ctx.node.data);

    if (data.length === 0) {
      return renderEmptyState(ctx, position);
    }

    const maxValue = Math.max(...data.map((d) => d.value));
    const bars = renderBars(data, maxValue, ctx, position);
    const axis = renderAxis(ctx, position);

    return `<g>${bars}${axis}</g>`;
  },
};
