import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

const BAR_WIDTH = 60;
const BAR_SPACING = 20;
const CHART_MARGIN_TOP = 40;
const CHART_MARGIN_BOTTOM = 60;
const DEFAULT_HEIGHT = 300;

// Grouped bar constants
const GROUPED_BAR_WIDTH = 20;
const GROUPED_BAR_SPACING = 5;
const GROUP_SPACING = 20;

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

  // Check if first item has 'values' array property
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
  const bounds = barChartVertical.bounds(ctx);
  const chartHeight = bounds.height - CHART_MARGIN_TOP - CHART_MARGIN_BOTTOM;

  const bars = data.map((item, index) => {
    const barHeight = (item.value / maxValue) * chartHeight;
    const x = position.x + BAR_SPACING + index * (BAR_WIDTH + BAR_SPACING);
    const y = position.y + CHART_MARGIN_TOP + (chartHeight - barHeight);

    const color = getBarColor(index, customColors);
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
function renderAxis(
  ctx: ShapeRenderContext,
  position: { x: number; y: number }
): string {
  const bounds = barChartVertical.bounds(ctx);
  const axisY = position.y + bounds.height - CHART_MARGIN_BOTTOM;
  const axisX1 = position.x + BAR_SPACING / 2;
  const axisX2 = position.x + bounds.width - BAR_SPACING / 2;

  return `<line x1="${axisX1}" y1="${axisY}" x2="${axisX2}" y2="${axisY}" stroke="#333" stroke-width="2" />`;
}

/**
 * Render empty state
 */
function renderEmptyState(
  ctx: ShapeRenderContext,
  position: { x: number; y: number }
): string {
  const bounds = barChartVertical.bounds(ctx);
  const centerX = position.x + bounds.width / 2;
  const centerY = position.y + bounds.height / 2;

  return `
    <rect x="${position.x}" y="${position.y}" width="${bounds.width}" height="${bounds.height}" fill="#f7fafc" stroke="#cbd5e0" stroke-width="2" rx="4" />
    <text x="${centerX}" y="${centerY}" text-anchor="middle" font-size="14" fill="#718096">No data available</text>
  `;
}

/**
 * Render grouped bars
 */
function renderGroupedBars(
  groups: GroupedBarData[],
  maxValue: number,
  ctx: ShapeRenderContext,
  position: { x: number; y: number },
  customColors?: string[]
): string {
  const bounds = barChartVertical.bounds(ctx);
  const chartHeight = bounds.height - CHART_MARGIN_TOP - CHART_MARGIN_BOTTOM;

  const elements: string[] = [];
  let currentX = position.x + GROUP_SPACING;

  groups.forEach((group) => {
    const groupWidth =
      group.values.length * GROUPED_BAR_WIDTH +
      (group.values.length - 1) * GROUPED_BAR_SPACING;

    // Render bars in this group
    group.values.forEach((value, seriesIndex) => {
      const barHeight = (value / maxValue) * chartHeight;
      const x =
        currentX + seriesIndex * (GROUPED_BAR_WIDTH + GROUPED_BAR_SPACING);
      const y = position.y + CHART_MARGIN_TOP + (chartHeight - barHeight);

      const color = getBarColor(seriesIndex, customColors);
      const stroke = ctx.style?.stroke || '#333';
      const strokeWidth = ctx.style?.strokeWidth || 1;

      // Bar rectangle
      elements.push(
        `<rect x="${x}" y="${y}" width="${GROUPED_BAR_WIDTH}" height="${barHeight}" fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}" />`
      );

      // Value above bar
      const valueX = x + GROUPED_BAR_WIDTH / 2;
      const valueY = y - 5;
      elements.push(
        `<text x="${valueX}" y="${valueY}" text-anchor="middle" font-size="10" fill="#666">${value}</text>`
      );
    });

    // Group label below
    const labelX = currentX + groupWidth / 2;
    const labelY = position.y + bounds.height - CHART_MARGIN_BOTTOM + 20;
    elements.push(
      `<text x="${labelX}" y="${labelY}" text-anchor="middle" font-size="12" fill="#333">${group.label}</text>`
    );

    currentX += groupWidth + GROUP_SPACING;
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
  const bounds = barChartVertical.bounds(ctx);
  const chartHeight = bounds.height - CHART_MARGIN_TOP - CHART_MARGIN_BOTTOM;

  const elements: string[] = [];
  let currentX = position.x + BAR_SPACING;

  groups.forEach((group) => {
    const total = group.values.reduce((sum, val) => sum + val, 0);
    const stackHeight = (total / maxTotal) * chartHeight;

    // Start from bottom of chart
    let currentY = position.y + CHART_MARGIN_TOP + chartHeight;

    // Render segments from bottom to top
    group.values.forEach((value, seriesIndex) => {
      const segmentHeight = (value / maxTotal) * chartHeight;
      const y = currentY - segmentHeight;

      const color = getBarColor(seriesIndex, customColors);
      const stroke = ctx.style?.stroke || '#333';
      const strokeWidth = ctx.style?.strokeWidth || 1;

      // Segment rectangle
      elements.push(
        `<rect x="${currentX}" y="${y}" width="${BAR_WIDTH}" height="${segmentHeight}" fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}" />`
      );

      currentY = y; // Move up for next segment
    });

    // Total value above stack
    const totalX = currentX + BAR_WIDTH / 2;
    const totalY =
      position.y + CHART_MARGIN_TOP + (chartHeight - stackHeight) - 5;
    elements.push(
      `<text x="${totalX}" y="${totalY}" text-anchor="middle" font-size="10" fill="#666">${total}</text>`
    );

    // Group label below
    const labelX = currentX + BAR_WIDTH / 2;
    const labelY = position.y + bounds.height - CHART_MARGIN_BOTTOM + 20;
    elements.push(
      `<text x="${labelX}" y="${labelY}" text-anchor="middle" font-size="12" fill="#333">${group.label}</text>`
    );

    currentX += BAR_WIDTH + BAR_SPACING;
  });

  return elements.join('\n');
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
 * Render legend (vertical layout)
 */
function renderLegend(
  labels: string[],
  startX: number,
  startY: number,
  customColors?: string[]
): string {
  const SWATCH_SIZE = 12;
  const ROW_HEIGHT = 20;
  const LABEL_OFFSET = 18;

  return labels
    .map((label, i) => {
      const y = startY + i * ROW_HEIGHT;
      const color = getBarColor(i, customColors);

      return `<g>
      <rect x="${startX}" y="${y}" width="${SWATCH_SIZE}" height="${SWATCH_SIZE}" fill="${color}" stroke="#333" stroke-width="1" />
      <text x="${startX + LABEL_OFFSET}" y="${y + 10}" font-size="11" fill="#333">${label}</text>
    </g>`;
    })
    .join('\n    ');
}

/**
 * Render legend (horizontal layout for top/bottom positions)
 */
function renderLegendHorizontal(
  labels: string[],
  x: number,
  y: number,
  maxWidth: number,
  customColors?: string[]
): string {
  const SWATCH_SIZE = 12;
  const ITEM_SPACING = 15;
  const LABEL_OFFSET = 18;

  let currentX = 0;
  let currentY = 0;
  const items: string[] = [];

  labels.forEach((label, i) => {
    const color = getBarColor(i, customColors);

    // Estimate text width
    const estimatedTextWidth = label.length * 5.5;
    const itemWidth = SWATCH_SIZE + LABEL_OFFSET + estimatedTextWidth;

    // Wrap to next row if needed
    if (currentX > 0 && currentX + itemWidth > maxWidth) {
      currentY += 20;
      currentX = 0;
    }

    const actualX = x + currentX;
    const actualY = y + currentY;

    items.push(`<g>
      <rect x="${actualX}" y="${actualY}" width="${SWATCH_SIZE}" height="${SWATCH_SIZE}" fill="${color}" stroke="#333" stroke-width="1" />
      <text x="${actualX + LABEL_OFFSET}" y="${actualY + 10}" font-size="11" fill="#333">${label}</text>
    </g>`);

    currentX += itemWidth + ITEM_SPACING;
  });

  return items.join('\n    ');
}

/**
 * Calculate legend position based on position setting
 */
function calculateLegendPosition(
  position: { x: number; y: number },
  chartWidth: number,
  chartHeight: number,
  labelCount: number,
  legendPos: LegendPosition
): { x: number; y: number } {
  const ROW_HEIGHT = 20;
  const legendHeight = labelCount * ROW_HEIGHT;
  const legendWidth = 150;
  const horizontalLegendHeight = 40;

  switch (legendPos) {
    case 'top':
      return { x: position.x, y: position.y - horizontalLegendHeight - 10 };
    case 'top-right':
      return { x: position.x + chartWidth + 10, y: position.y };
    case 'right':
      return {
        x: position.x + chartWidth + 10,
        y: position.y + (chartHeight - legendHeight) / 2,
      };
    case 'bottom-right':
      return {
        x: position.x + chartWidth + 10,
        y: position.y + chartHeight - legendHeight,
      };
    case 'bottom':
      return { x: position.x, y: position.y + chartHeight + 10 };
    case 'bottom-left':
      return {
        x: position.x - legendWidth - 10,
        y: position.y + chartHeight - legendHeight,
      };
    case 'left':
      return {
        x: position.x - legendWidth - 10,
        y: position.y + (chartHeight - legendHeight) / 2,
      };
    case 'top-left':
      return { x: position.x - legendWidth - 10, y: position.y };
    default:
      return {
        x: position.x + chartWidth + 10,
        y: position.y + chartHeight - legendHeight,
      };
  }
}

/**
 * Render chart title at top
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
 * Vertical bar chart shape definition
 */
export const barChartVertical: ShapeDefinition = {
  id: 'bar-chart-vertical',

  bounds(ctx: ShapeRenderContext): { width: number; height: number } {
    const showLegend = ctx.node.data?.showLegend === true; // Only show if explicitly true
    const legendPosition =
      (ctx.node.data?.legendPosition as LegendPosition) || 'bottom-right';

    let baseWidth: number;
    let baseHeight = DEFAULT_HEIGHT;

    // Check if data is in stacked format
    if (isStackedFormat(ctx.node.data)) {
      const groups = normalizeGroupedData(ctx.node.data);

      if (groups.length === 0) {
        baseWidth = 200;
      } else {
        baseWidth = groups.length * (BAR_WIDTH + BAR_SPACING) + BAR_SPACING;
      }
    }
    // Check if data is in grouped format
    else if (isGroupedFormat(ctx.node.data)) {
      const groups = normalizeGroupedData(ctx.node.data);

      if (groups.length === 0) {
        baseWidth = 200;
      } else {
        // Calculate total width based on groups
        let totalWidth = GROUP_SPACING;
        groups.forEach((group) => {
          const groupWidth =
            group.values.length * GROUPED_BAR_WIDTH +
            (group.values.length - 1) * GROUPED_BAR_SPACING;
          totalWidth += groupWidth + GROUP_SPACING;
        });
        baseWidth = totalWidth;
      }
    }
    // Simple format
    else {
      const data = normalizeData(ctx.node.data);

      if (data.length === 0) {
        baseWidth = 200;
      } else {
        baseWidth = data.length * (BAR_WIDTH + BAR_SPACING) + BAR_SPACING;
      }
    }

    // Adjust bounds for legend
    if (showLegend) {
      const legendWidth = 150;
      const horizontalLegendHeight = 40;

      switch (legendPosition) {
        case 'top':
        case 'bottom':
          return {
            width: baseWidth,
            height: baseHeight + horizontalLegendHeight + 10,
          };
        case 'left':
        case 'top-left':
        case 'bottom-left':
        case 'right':
        case 'top-right':
        case 'bottom-right':
        default:
          return { width: baseWidth + legendWidth + 10, height: baseHeight };
      }
    }

    return { width: baseWidth, height: baseHeight };
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

    // Legend support
    const showLegend = ctx.node.data?.showLegend === true; // Explicit opt-in for bar charts
    const legendPosition =
      (ctx.node.data?.legendPosition as LegendPosition) || 'bottom-right';

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

      // Generate legend for series (stacked bars show series in legend)
      let legendElement = '';
      if (showLegend && groups.length > 0 && groups[0].values.length > 0) {
        const seriesCount = groups[0].values.length;
        const seriesLabels = Array.from(
          { length: seriesCount },
          (_, i) => `Series ${i + 1}`
        );
        const legendPos = calculateLegendPosition(
          position,
          bounds.width,
          bounds.height,
          seriesLabels.length,
          legendPosition
        );

        if (legendPosition === 'top' || legendPosition === 'bottom') {
          legendElement = renderLegendHorizontal(
            seriesLabels,
            legendPos.x,
            legendPos.y,
            bounds.width,
            customColors
          );
        } else {
          legendElement = renderLegend(
            seriesLabels,
            legendPos.x,
            legendPos.y,
            customColors
          );
        }
      }

      return `<g>${titleElement}${yLabelElement}${bars}${axis}${xLabelElement}${legendElement}</g>`;
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

      // Generate legend for series (grouped bars show series in legend)
      let legendElement = '';
      if (showLegend && groups.length > 0 && groups[0].values.length > 0) {
        const seriesCount = groups[0].values.length;
        const seriesLabels = Array.from(
          { length: seriesCount },
          (_, i) => `Series ${i + 1}`
        );
        const legendPos = calculateLegendPosition(
          position,
          bounds.width,
          bounds.height,
          seriesLabels.length,
          legendPosition
        );

        if (legendPosition === 'top' || legendPosition === 'bottom') {
          legendElement = renderLegendHorizontal(
            seriesLabels,
            legendPos.x,
            legendPos.y,
            bounds.width,
            customColors
          );
        } else {
          legendElement = renderLegend(
            seriesLabels,
            legendPos.x,
            legendPos.y,
            customColors
          );
        }
      }

      return `<g>${titleElement}${yLabelElement}${bars}${axis}${xLabelElement}${legendElement}</g>`;
    }

    // Simple format - no legend needed for single bar charts
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
