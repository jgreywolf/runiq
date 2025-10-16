import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

const BAR_WIDTH = 60;
const BAR_SPACING = 20;
const CHART_MARGIN_TOP = 40;
const CHART_MARGIN_BOTTOM = 60;
const DEFAULT_HEIGHT = 300;

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
    .filter((item): item is BarData => item !== null);
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
  const bounds = barChartVertical.bounds(ctx);
  const chartHeight = bounds.height - CHART_MARGIN_TOP - CHART_MARGIN_BOTTOM;

  const bars = data.map((item, index) => {
    const barHeight = (item.value / maxValue) * chartHeight;
    const x = position.x + BAR_SPACING + index * (BAR_WIDTH + BAR_SPACING);
    const y = position.y + CHART_MARGIN_TOP + (chartHeight - barHeight);

    const color = getBarColor(index);
    const stroke = ctx.style?.stroke || '#333';
    const strokeWidth = ctx.style?.strokeWidth || 1;

    // Bar rectangle
    const bar = `<rect x="${x}" y="${y}" width="${BAR_WIDTH}" height="${barHeight}" fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Label below bar
    const labelX = x + BAR_WIDTH / 2;
    const labelY = position.y + bounds.height - CHART_MARGIN_BOTTOM + 20;
    const label = `<text x="${labelX}" y="${labelY}" text-anchor="middle" font-size="12" fill="#333">${item.label}</text>`;

    // Value above bar
    const valueX = x + BAR_WIDTH / 2;
    const valueY = y - 5;
    const value = `<text x="${valueX}" y="${valueY}" text-anchor="middle" font-size="11" fill="#666">${item.value}</text>`;

    return bar + label + value;
  });

  return bars.join('\n');
}

/**
 * Render X-axis
 */
function renderAxis(ctx: ShapeRenderContext, position: { x: number; y: number }): string {
  const bounds = barChartVertical.bounds(ctx);
  const axisY = position.y + bounds.height - CHART_MARGIN_BOTTOM;
  const axisX1 = position.x + BAR_SPACING / 2;
  const axisX2 = position.x + bounds.width - BAR_SPACING / 2;

  return `<line x1="${axisX1}" y1="${axisY}" x2="${axisX2}" y2="${axisY}" stroke="#333" stroke-width="2" />`;
}

/**
 * Render empty state
 */
function renderEmptyState(ctx: ShapeRenderContext, position: { x: number; y: number }): string {
  const bounds = barChartVertical.bounds(ctx);
  const centerX = position.x + bounds.width / 2;
  const centerY = position.y + bounds.height / 2;

  return `
    <rect x="${position.x}" y="${position.y}" width="${bounds.width}" height="${bounds.height}" fill="#f7fafc" stroke="#cbd5e0" stroke-width="2" rx="4" />
    <text x="${centerX}" y="${centerY}" text-anchor="middle" font-size="14" fill="#718096">No data available</text>
  `;
}

/**
 * Vertical bar chart shape definition
 */
export const barChartVertical: ShapeDefinition = {
  id: 'bar-chart-vertical',

  bounds(ctx: ShapeRenderContext): { width: number; height: number } {
    const data = normalizeData(ctx.node.data);

    if (data.length === 0) {
      // Minimum size for empty state
      return {
        width: 200,
        height: ctx.height || DEFAULT_HEIGHT,
      };
    }

    const width = data.length * (BAR_WIDTH + BAR_SPACING) + BAR_SPACING;
    const height = ctx.height || DEFAULT_HEIGHT;

    return { width, height };
  },

  anchors(ctx: ShapeRenderContext) {
    const { width, height } = barChartVertical.bounds(ctx);

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
