import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

const BAR_HEIGHT = 40;
const BAR_SPACING = 15;
const CHART_MARGIN_LEFT = 120; // Space for labels on the left
const CHART_MARGIN_RIGHT = 40;
const DEFAULT_WIDTH = 400;

// Grouped bar constants
const GROUPED_BAR_HEIGHT = 15;
const GROUPED_BAR_SPACING = 5;
const GROUP_SPACING = 15;

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

interface GroupedBarData {
  label: string;
  values: number[];
}

/**
 * Check if data is in grouped format
 */
function isGroupedFormat(data: any): boolean {
  if (!data || !data.values || !Array.isArray(data.values)) {
    return false;
  }

  const firstItem = data.values[0];
  return (
    firstItem &&
    typeof firstItem === 'object' &&
    'values' in firstItem &&
    Array.isArray(firstItem.values)
  );
}

/**
 * Normalize grouped data format
 */
function normalizeGroupedData(data: any): GroupedBarData[] {
  if (!data || !data.values || !Array.isArray(data.values)) {
    return [];
  }

  return data.values
    .map((item: any): GroupedBarData | null => {
      if (
        typeof item === 'object' &&
        item !== null &&
        Array.isArray(item.values)
      ) {
        const values = item.values
          .map((v: any) => Number(v))
          .filter((v: number) => !isNaN(v) && v > 0);

        if (values.length === 0) return null;

        return {
          label: item.label || 'Group',
          values,
        };
      }
      return null;
    })
    .filter(
      (item: GroupedBarData | null): item is GroupedBarData => item !== null
    );
}

/**
 * Check if data is in stacked format
 */
function isStackedFormat(data: any): boolean {
  return data && data.stacked === true && isGroupedFormat(data);
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
function getBarColor(index: number, customColors?: string[]): string {
  const palette =
    customColors && customColors.length > 0 ? customColors : DEFAULT_PALETTE;
  return palette[index % palette.length];
}

/**
 * Render individual bars
 */
function renderBars(
  data: BarData[],
  maxValue: number,
  ctx: ShapeRenderContext,
  position: { x: number; y: number },
  customColors?: string[]
): string {
  const bounds = barChartHorizontal.bounds(ctx);
  const chartWidth = bounds.width - CHART_MARGIN_LEFT - CHART_MARGIN_RIGHT;

  const bars = data.map((item, index) => {
    const barWidth = (item.value / maxValue) * chartWidth;
    const x = position.x + CHART_MARGIN_LEFT;
    const y = position.y + BAR_SPACING + index * (BAR_HEIGHT + BAR_SPACING);

    const color = getBarColor(index, customColors);
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
function renderAxis(
  ctx: ShapeRenderContext,
  position: { x: number; y: number }
): string {
  const bounds = barChartHorizontal.bounds(ctx);
  const axisX = position.x + CHART_MARGIN_LEFT;
  const axisY1 = position.y + BAR_SPACING / 2;
  const axisY2 = position.y + bounds.height - BAR_SPACING / 2;

  return `<line x1="${axisX}" y1="${axisY1}" x2="${axisX}" y2="${axisY2}" stroke="#333" stroke-width="2" />`;
}

/**
 * Render empty state
 */
function renderEmptyState(
  ctx: ShapeRenderContext,
  position: { x: number; y: number }
): string {
  const bounds = barChartHorizontal.bounds(ctx);
  const centerX = position.x + bounds.width / 2;
  const centerY = position.y + bounds.height / 2;

  return `
    <rect x="${position.x}" y="${position.y}" width="${bounds.width}" height="${bounds.height}" fill="#f7fafc" stroke="#cbd5e0" stroke-width="2" rx="4" />
    <text x="${centerX}" y="${centerY}" text-anchor="middle" font-size="14" fill="#718096">No data available</text>
  `;
}

/**
 * Render grouped bars (horizontal)
 */
function renderGroupedBars(
  groups: GroupedBarData[],
  maxValue: number,
  ctx: ShapeRenderContext,
  position: { x: number; y: number },
  customColors?: string[]
): string {
  const bounds = barChartHorizontal.bounds(ctx);
  const chartWidth = bounds.width - CHART_MARGIN_LEFT - CHART_MARGIN_RIGHT;

  const elements: string[] = [];
  let currentY = position.y + GROUP_SPACING;

  groups.forEach((group) => {
    const groupHeight =
      group.values.length * GROUPED_BAR_HEIGHT +
      (group.values.length - 1) * GROUPED_BAR_SPACING;

    // Render bars in this group
    group.values.forEach((value, seriesIndex) => {
      const barWidth = (value / maxValue) * chartWidth;
      const x = position.x + CHART_MARGIN_LEFT;
      const y =
        currentY + seriesIndex * (GROUPED_BAR_HEIGHT + GROUPED_BAR_SPACING);

      const color = getBarColor(seriesIndex, customColors);
      const stroke = ctx.style?.stroke || '#333';
      const strokeWidth = ctx.style?.strokeWidth || 1;

      // Bar rectangle
      elements.push(
        `<rect x="${x}" y="${y}" width="${barWidth}" height="${GROUPED_BAR_HEIGHT}" fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}" />`
      );

      // Value on the right
      const valueX = x + barWidth + 5;
      const valueY = y + GROUPED_BAR_HEIGHT / 2 + 4;
      elements.push(
        `<text x="${valueX}" y="${valueY}" font-size="10" fill="#666">${value}</text>`
      );
    });

    // Group label on the left
    const labelX = position.x + CHART_MARGIN_LEFT - 10;
    const labelY = currentY + groupHeight / 2 + 4;
    elements.push(
      `<text x="${labelX}" y="${labelY}" text-anchor="end" font-size="12" fill="#333">${group.label}</text>`
    );

    currentY += groupHeight + GROUP_SPACING;
  });

  return elements.join('\n');
}

/**
 * Render stacked bars
 */
function renderStackedBars(
  groups: GroupedBarData[],
  maxTotal: number,
  ctx: ShapeRenderContext,
  position: { x: number; y: number },
  customColors?: string[]
): string {
  const bounds = barChartHorizontal.bounds(ctx);
  const chartWidth = bounds.width - CHART_MARGIN_LEFT - CHART_MARGIN_RIGHT;

  const elements: string[] = [];
  let currentY = position.y + BAR_SPACING;

  groups.forEach((group) => {
    const total = group.values.reduce((sum, val) => sum + val, 0);
    const stackWidth = (total / maxTotal) * chartWidth;

    // Start from left edge
    let currentX = position.x + CHART_MARGIN_LEFT;

    // Render segments from left to right
    group.values.forEach((value, seriesIndex) => {
      const segmentWidth = (value / maxTotal) * chartWidth;

      const color = getBarColor(seriesIndex, customColors);
      const stroke = ctx.style?.stroke || '#333';
      const strokeWidth = ctx.style?.strokeWidth || 1;

      // Segment rectangle
      elements.push(
        `<rect x="${currentX}" y="${currentY}" width="${segmentWidth}" height="${BAR_HEIGHT}" fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}" />`
      );

      currentX += segmentWidth; // Move right for next segment
    });

    // Total value at end of stack
    const totalX = position.x + CHART_MARGIN_LEFT + stackWidth + 5;
    const totalY = currentY + BAR_HEIGHT / 2 + 4;
    elements.push(
      `<text x="${totalX}" y="${totalY}" font-size="10" fill="#666">${total}</text>`
    );

    // Group label on the left
    const labelX = position.x + CHART_MARGIN_LEFT - 10;
    const labelY = currentY + BAR_HEIGHT / 2 + 4;
    elements.push(
      `<text x="${labelX}" y="${labelY}" text-anchor="end" font-size="12" fill="#333">${group.label}</text>`
    );

    currentY += BAR_HEIGHT + BAR_SPACING;
  });

  return elements.join('\n');
}

/**
 * Render title text above the bar chart
 */
function renderTitle(
  title: string,
  position: { x: number; y: number },
  width: number
): string {
  const titleX = position.x + width / 2;
  const titleY = position.y + 20;
  return `<text x="${titleX}" y="${titleY}" text-anchor="middle" font-size="16" font-weight="bold" fill="#333">${title}</text>`;
}

/**
 * Render X-axis label at bottom
 */
function renderXLabel(
  label: string,
  position: { x: number; y: number },
  width: number,
  height: number
): string {
  const labelX = position.x + width / 2;
  const labelY = position.y + height + 40;
  return `<text x="${labelX}" y="${labelY}" text-anchor="middle" font-size="14" fill="#666">${label}</text>`;
}

/**
 * Render Y-axis label on left side (rotated)
 */
function renderYLabel(
  label: string,
  position: { x: number; y: number },
  height: number
): string {
  const labelX = position.x - 30;
  const labelY = position.y + height / 2;
  return `<text x="${labelX}" y="${labelY}" text-anchor="middle" font-size="14" fill="#666" transform="rotate(-90 ${labelX} ${labelY})">${label}</text>`;
}

/**
 * Horizontal bar chart shape definition
 */
export const barChartHorizontal: ShapeDefinition = {
  id: 'bar-chart-horizontal',

  bounds(ctx: ShapeRenderContext): { width: number; height: number } {
    // Check if data is in stacked format
    if (isStackedFormat(ctx.node.data)) {
      const groups = normalizeGroupedData(ctx.node.data);

      if (groups.length === 0) {
        return { width: DEFAULT_WIDTH, height: 200 };
      }

      // Calculate height same as simple format
      const height = groups.length * (BAR_HEIGHT + BAR_SPACING) + BAR_SPACING;
      return { width: DEFAULT_WIDTH, height };
    }

    // Check if data is in grouped format
    if (isGroupedFormat(ctx.node.data)) {
      const groups = normalizeGroupedData(ctx.node.data);

      if (groups.length === 0) {
        return { width: DEFAULT_WIDTH, height: 200 };
      }

      // Calculate total height based on groups
      let totalHeight = GROUP_SPACING; // initial spacing
      groups.forEach((group) => {
        const groupHeight =
          group.values.length * GROUPED_BAR_HEIGHT +
          (group.values.length - 1) * GROUPED_BAR_SPACING;
        totalHeight += groupHeight + GROUP_SPACING;
      });

      return { width: DEFAULT_WIDTH, height: totalHeight };
    }

    // Simple format
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
    // Get custom colors if provided
    const customColors = Array.isArray(ctx.node.data?.colors)
      ? (ctx.node.data.colors as string[])
      : undefined;

    // Get title and labels if provided
    const title = ctx.node.data?.title;
    const xLabel = ctx.node.data?.xLabel;
    const yLabel = ctx.node.data?.yLabel;

    const bounds = this.bounds(ctx);
    const titleElement = title
      ? renderTitle(title as string, position, bounds.width)
      : '';
    const xLabelElement = xLabel
      ? renderXLabel(xLabel as string, position, bounds.width, bounds.height)
      : '';
    const yLabelElement = yLabel
      ? renderYLabel(yLabel as string, position, bounds.height)
      : '';

    // Check if data is in stacked format
    if (isStackedFormat(ctx.node.data)) {
      const groups = normalizeGroupedData(ctx.node.data);

      if (groups.length === 0) {
        return renderEmptyState(ctx, position);
      }

      // Find max cumulative total across all groups
      const totals = groups.map((g) =>
        g.values.reduce((sum, val) => sum + val, 0)
      );
      const maxTotal = Math.max(...totals);

      const bars = renderStackedBars(
        groups,
        maxTotal,
        ctx,
        position,
        customColors
      );
      const axis = renderAxis(ctx, position);

      return `<g>${titleElement}${yLabelElement}${bars}${axis}${xLabelElement}</g>`;
    }

    // Check if data is in grouped format
    if (isGroupedFormat(ctx.node.data)) {
      const groups = normalizeGroupedData(ctx.node.data);

      if (groups.length === 0) {
        return renderEmptyState(ctx, position);
      }

      // Find max value across all series in all groups
      const allValues = groups.flatMap((g) => g.values);
      const maxValue = Math.max(...allValues);

      const bars = renderGroupedBars(
        groups,
        maxValue,
        ctx,
        position,
        customColors
      );
      const axis = renderAxis(ctx, position);

      return `<g>${titleElement}${yLabelElement}${bars}${axis}${xLabelElement}</g>`;
    }

    // Simple format
    const data = normalizeData(ctx.node.data);

    if (data.length === 0) {
      return renderEmptyState(ctx, position);
    }

    const maxValue = Math.max(...data.map((d) => d.value));
    const bars = renderBars(data, maxValue, ctx, position, customColors);
    const axis = renderAxis(ctx, position);

    return `<g>${titleElement}${yLabelElement}${bars}${axis}${xLabelElement}</g>`;
  },
};
