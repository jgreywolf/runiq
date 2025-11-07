import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';
import {
  BarData,
  getBarColor,
  GroupedBarData,
  isGroupedFormat,
  isStackedFormat,
  LegendPosition,
  normalizeData,
  normalizeGroupedData,
} from './barChartUtils.js';

// Vertical bar constants
const VERTICAL_BAR_WIDTH = 60;
const VERTICAL_BAR_SPACING = 20;
const VERTICAL_MARGIN_TOP = 40;
const VERTICAL_MARGIN_BOTTOM = 60;
const VERTICAL_DEFAULT_HEIGHT = 300;

// Horizontal bar constants
const HORIZONTAL_BAR_HEIGHT = 40;
const HORIZONTAL_BAR_SPACING = 15;
const HORIZONTAL_MARGIN_LEFT = 120;
const HORIZONTAL_MARGIN_RIGHT = 40;
const HORIZONTAL_MARGIN_TOP = 40;
const HORIZONTAL_DEFAULT_WIDTH = 400;

// Grouped bar constants (vertical)
const VERTICAL_GROUPED_BAR_WIDTH = 20;
const VERTICAL_GROUPED_BAR_SPACING = 5;
const VERTICAL_GROUP_SPACING = 20;

// Grouped bar constants (horizontal)
const HORIZONTAL_GROUPED_BAR_HEIGHT = 15;
const HORIZONTAL_GROUPED_BAR_SPACING = 5;
const HORIZONTAL_GROUP_SPACING = 15;

/**
 * Render individual bars (vertical orientation)
 */
function renderBarsVertical(
  data: BarData[],
  maxValue: number,
  ctx: ShapeRenderContext,
  position: { x: number; y: number },
  customColors?: string[]
): string {
  const bounds = barChart.bounds(ctx);
  const chartHeight =
    bounds.height - VERTICAL_MARGIN_TOP - VERTICAL_MARGIN_BOTTOM;

  const bars = data.map((item, index) => {
    const barHeight = (item.value / maxValue) * chartHeight;
    const x =
      position.x +
      VERTICAL_BAR_SPACING +
      index * (VERTICAL_BAR_WIDTH + VERTICAL_BAR_SPACING);
    const y = position.y + VERTICAL_MARGIN_TOP + (chartHeight - barHeight);

    const color = getBarColor(index, customColors);
    const stroke = ctx.style?.stroke || '#333';
    const strokeWidth = ctx.style?.strokeWidth || 1;

    // Bar rectangle
    const bar = `<rect x="${x}" y="${y}" width="${VERTICAL_BAR_WIDTH}" height="${barHeight}" fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Label below bar
    const labelX = x + VERTICAL_BAR_WIDTH / 2;
    const labelY = position.y + bounds.height - VERTICAL_MARGIN_BOTTOM + 20;
    const label = `<text x="${labelX}" y="${labelY}" text-anchor="middle" font-size="12" fill="#333">${item.label}</text>`;

    // Value above bar
    const valueX = x + VERTICAL_BAR_WIDTH / 2;
    const valueY = y - 5;
    const value = `<text x="${valueX}" y="${valueY}" text-anchor="middle" font-size="11" fill="#666">${item.value}</text>`;

    return bar + label + value;
  });

  return bars.join('\n');
}

/**
 * Render individual bars (horizontal orientation)
 */
function renderBarsHorizontal(
  data: BarData[],
  maxValue: number,
  ctx: ShapeRenderContext,
  position: { x: number; y: number },
  customColors?: string[]
): string {
  const bounds = barChart.bounds(ctx);
  const chartWidth =
    bounds.width - HORIZONTAL_MARGIN_LEFT - HORIZONTAL_MARGIN_RIGHT;
  const titleMargin = ctx.node.data?.title ? HORIZONTAL_MARGIN_TOP : 0;

  const bars = data.map((item, index) => {
    const barWidth = (item.value / maxValue) * chartWidth;
    const x = position.x + HORIZONTAL_MARGIN_LEFT;
    const y =
      position.y +
      titleMargin +
      HORIZONTAL_BAR_SPACING +
      index * (HORIZONTAL_BAR_HEIGHT + HORIZONTAL_BAR_SPACING);

    const color = getBarColor(index, customColors);
    const stroke = ctx.style?.stroke || '#333';
    const strokeWidth = ctx.style?.strokeWidth || 1;

    // Bar rectangle
    const bar = `<rect x="${x}" y="${y}" width="${barWidth}" height="${HORIZONTAL_BAR_HEIGHT}" fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Label on left
    const labelX = position.x + HORIZONTAL_MARGIN_LEFT - 10;
    const labelY = y + HORIZONTAL_BAR_HEIGHT / 2 + 4;
    const label = `<text x="${labelX}" y="${labelY}" text-anchor="end" font-size="12" fill="#333">${item.label}</text>`;

    // Value at end of bar
    const valueX = x + barWidth + 5;
    const valueY = y + HORIZONTAL_BAR_HEIGHT / 2 + 4;
    const value = `<text x="${valueX}" y="${valueY}" text-anchor="start" font-size="11" fill="#666">${item.value}</text>`;

    return bar + label + value;
  });

  return bars.join('\n');
}

/**
 * Render axis (adapts to orientation)
 */
function renderAxis(
  ctx: ShapeRenderContext,
  position: { x: number; y: number },
  flipAxes: boolean
): string {
  const bounds = barChart.bounds(ctx);

  if (flipAxes) {
    // Horizontal: Y-axis on left
    const titleMargin = ctx.node.data?.title ? HORIZONTAL_MARGIN_TOP : 0;
    const axisX = position.x + HORIZONTAL_MARGIN_LEFT;
    const axisY1 = position.y + titleMargin + HORIZONTAL_BAR_SPACING / 2;
    const axisY2 = position.y + bounds.height - HORIZONTAL_BAR_SPACING / 2;
    return `<line x1="${axisX}" y1="${axisY1}" x2="${axisX}" y2="${axisY2}" stroke="#333" stroke-width="2" />`;
  } else {
    // Vertical: X-axis on bottom
    const axisY = position.y + bounds.height - VERTICAL_MARGIN_BOTTOM;
    const axisX1 = position.x + VERTICAL_BAR_SPACING / 2;
    const axisX2 = position.x + bounds.width - VERTICAL_BAR_SPACING / 2;
    return `<line x1="${axisX1}" y1="${axisY}" x2="${axisX2}" y2="${axisY}" stroke="#333" stroke-width="2" />`;
  }
}

/**
 * Render empty state
 */
function renderEmptyState(
  ctx: ShapeRenderContext,
  position: { x: number; y: number }
): string {
  const bounds = barChart.bounds(ctx);
  const centerX = position.x + bounds.width / 2;
  const centerY = position.y + bounds.height / 2;

  return `
    <rect x="${position.x}" y="${position.y}" width="${bounds.width}" height="${bounds.height}" fill="#f7fafc" stroke="#cbd5e0" stroke-width="2" rx="4" />
    <text x="${centerX}" y="${centerY}" text-anchor="middle" font-size="14" fill="#718096">No data available</text>
  `;
}

/**
 * Render grouped bars (vertical)
 */
function renderGroupedBarsVertical(
  groups: GroupedBarData[],
  maxValue: number,
  ctx: ShapeRenderContext,
  position: { x: number; y: number },
  customColors?: string[]
): string {
  const bounds = barChart.bounds(ctx);
  const chartHeight =
    bounds.height - VERTICAL_MARGIN_TOP - VERTICAL_MARGIN_BOTTOM;

  const elements: string[] = [];
  let currentX = position.x + VERTICAL_GROUP_SPACING;

  groups.forEach((group) => {
    const groupWidth =
      group.values.length * VERTICAL_GROUPED_BAR_WIDTH +
      (group.values.length - 1) * VERTICAL_GROUPED_BAR_SPACING;

    group.values.forEach((value, seriesIndex) => {
      const barHeight = (value / maxValue) * chartHeight;
      const x =
        currentX +
        seriesIndex *
          (VERTICAL_GROUPED_BAR_WIDTH + VERTICAL_GROUPED_BAR_SPACING);
      const y = position.y + VERTICAL_MARGIN_TOP + (chartHeight - barHeight);

      const color = getBarColor(seriesIndex, customColors);
      const stroke = ctx.style?.stroke || '#333';
      const strokeWidth = ctx.style?.strokeWidth || 1;

      elements.push(
        `<rect x="${x}" y="${y}" width="${VERTICAL_GROUPED_BAR_WIDTH}" height="${barHeight}" fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}" />`
      );

      const valueX = x + VERTICAL_GROUPED_BAR_WIDTH / 2;
      const valueY = y - 5;
      elements.push(
        `<text x="${valueX}" y="${valueY}" text-anchor="middle" font-size="10" fill="#666">${value}</text>`
      );
    });

    const labelX = currentX + groupWidth / 2;
    const labelY = position.y + bounds.height - VERTICAL_MARGIN_BOTTOM + 20;
    elements.push(
      `<text x="${labelX}" y="${labelY}" text-anchor="middle" font-size="12" fill="#333">${group.label}</text>`
    );

    currentX += groupWidth + VERTICAL_GROUP_SPACING;
  });

  return elements.join('\n');
}

/**
 * Render grouped bars (horizontal)
 */
function renderGroupedBarsHorizontal(
  groups: GroupedBarData[],
  maxValue: number,
  ctx: ShapeRenderContext,
  position: { x: number; y: number },
  customColors?: string[]
): string {
  const bounds = barChart.bounds(ctx);
  const chartWidth =
    bounds.width - HORIZONTAL_MARGIN_LEFT - HORIZONTAL_MARGIN_RIGHT;
  const titleMargin = ctx.node.data?.title ? HORIZONTAL_MARGIN_TOP : 0;

  const elements: string[] = [];
  let currentY = position.y + titleMargin + HORIZONTAL_GROUP_SPACING;

  groups.forEach((group) => {
    const groupHeight =
      group.values.length * HORIZONTAL_GROUPED_BAR_HEIGHT +
      (group.values.length - 1) * HORIZONTAL_GROUPED_BAR_SPACING;

    group.values.forEach((value, seriesIndex) => {
      const barWidth = (value / maxValue) * chartWidth;
      const x = position.x + HORIZONTAL_MARGIN_LEFT;
      const y =
        currentY +
        seriesIndex *
          (HORIZONTAL_GROUPED_BAR_HEIGHT + HORIZONTAL_GROUPED_BAR_SPACING);

      const color = getBarColor(seriesIndex, customColors);
      const stroke = ctx.style?.stroke || '#333';
      const strokeWidth = ctx.style?.strokeWidth || 1;

      elements.push(
        `<rect x="${x}" y="${y}" width="${barWidth}" height="${HORIZONTAL_GROUPED_BAR_HEIGHT}" fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}" />`
      );

      const valueX = x + barWidth + 5;
      const valueY = y + HORIZONTAL_GROUPED_BAR_HEIGHT / 2 + 4;
      elements.push(
        `<text x="${valueX}" y="${valueY}" font-size="10" fill="#666">${value}</text>`
      );
    });

    const labelX = position.x + HORIZONTAL_MARGIN_LEFT - 10;
    const labelY = currentY + groupHeight / 2 + 4;
    elements.push(
      `<text x="${labelX}" y="${labelY}" text-anchor="end" font-size="12" fill="#333">${group.label}</text>`
    );

    currentY += groupHeight + HORIZONTAL_GROUP_SPACING;
  });

  return elements.join('\n');
}

/**
 * Render stacked bars (vertical)
 */
function renderStackedBarsVertical(
  groups: GroupedBarData[],
  maxTotal: number,
  ctx: ShapeRenderContext,
  position: { x: number; y: number },
  customColors?: string[]
): string {
  const bounds = barChart.bounds(ctx);
  const chartHeight =
    bounds.height - VERTICAL_MARGIN_TOP - VERTICAL_MARGIN_BOTTOM;

  const elements: string[] = [];
  let currentX = position.x + VERTICAL_BAR_SPACING;

  groups.forEach((group) => {
    const total = group.values.reduce((sum, val) => sum + val, 0);
    const stackHeight = (total / maxTotal) * chartHeight;
    let currentY = position.y + VERTICAL_MARGIN_TOP + chartHeight;

    group.values.forEach((value, seriesIndex) => {
      const segmentHeight = (value / maxTotal) * chartHeight;
      const y = currentY - segmentHeight;

      const color = getBarColor(seriesIndex, customColors);
      const stroke = ctx.style?.stroke || '#333';
      const strokeWidth = ctx.style?.strokeWidth || 1;

      elements.push(
        `<rect x="${currentX}" y="${y}" width="${VERTICAL_BAR_WIDTH}" height="${segmentHeight}" fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}" />`
      );

      currentY = y;
    });

    const totalX = currentX + VERTICAL_BAR_WIDTH / 2;
    const totalY =
      position.y + VERTICAL_MARGIN_TOP + (chartHeight - stackHeight) - 5;
    elements.push(
      `<text x="${totalX}" y="${totalY}" text-anchor="middle" font-size="10" fill="#666">${total}</text>`
    );

    const labelX = currentX + VERTICAL_BAR_WIDTH / 2;
    const labelY = position.y + bounds.height - VERTICAL_MARGIN_BOTTOM + 20;
    elements.push(
      `<text x="${labelX}" y="${labelY}" text-anchor="middle" font-size="12" fill="#333">${group.label}</text>`
    );

    currentX += VERTICAL_BAR_WIDTH + VERTICAL_BAR_SPACING;
  });

  return elements.join('\n');
}

/**
 * Render stacked bars (horizontal)
 */
function renderStackedBarsHorizontal(
  groups: GroupedBarData[],
  maxTotal: number,
  ctx: ShapeRenderContext,
  position: { x: number; y: number },
  customColors?: string[]
): string {
  const bounds = barChart.bounds(ctx);
  const chartWidth =
    bounds.width - HORIZONTAL_MARGIN_LEFT - HORIZONTAL_MARGIN_RIGHT;
  const titleMargin = ctx.node.data?.title ? HORIZONTAL_MARGIN_TOP : 0;

  const elements: string[] = [];
  let currentY = position.y + titleMargin + HORIZONTAL_BAR_SPACING;

  groups.forEach((group) => {
    const total = group.values.reduce((sum, val) => sum + val, 0);
    let currentX = position.x + HORIZONTAL_MARGIN_LEFT;

    group.values.forEach((value, seriesIndex) => {
      const segmentWidth = (value / maxTotal) * chartWidth;

      const color = getBarColor(seriesIndex, customColors);
      const stroke = ctx.style?.stroke || '#333';
      const strokeWidth = ctx.style?.strokeWidth || 1;

      elements.push(
        `<rect x="${currentX}" y="${currentY}" width="${segmentWidth}" height="${HORIZONTAL_BAR_HEIGHT}" fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}" />`
      );

      currentX += segmentWidth;
    });

    const totalX = currentX + 5;
    const totalY = currentY + HORIZONTAL_BAR_HEIGHT / 2 + 4;
    elements.push(
      `<text x="${totalX}" y="${totalY}" font-size="10" fill="#666">${total}</text>`
    );

    const labelX = position.x + HORIZONTAL_MARGIN_LEFT - 10;
    const labelY = currentY + HORIZONTAL_BAR_HEIGHT / 2 + 4;
    elements.push(
      `<text x="${labelX}" y="${labelY}" text-anchor="end" font-size="12" fill="#333">${group.label}</text>`
    );

    currentY += HORIZONTAL_BAR_HEIGHT + HORIZONTAL_BAR_SPACING;
  });

  return elements.join('\n');
}

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
 * Render legend (horizontal layout)
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
    const estimatedTextWidth = label.length * 5.5;
    const itemWidth = SWATCH_SIZE + LABEL_OFFSET + estimatedTextWidth;

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
 * Calculate legend position
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
 * Render chart title
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
 * Render X-axis label
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
 * Render Y-axis label (rotated)
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
 * Unified bar chart shape with flipAxes support
 */
export const barChart: ShapeDefinition = {
  id: 'barChart',

  bounds(ctx: ShapeRenderContext): { width: number; height: number } {
    const flipAxes = ctx.node.data?.flipAxes === true;
    const showLegend = ctx.node.data?.showLegend === true;
    const legendPosition =
      (ctx.node.data?.legendPosition as LegendPosition) || 'bottom-right';

    let baseWidth: number;
    let baseHeight: number;

    if (flipAxes) {
      // Horizontal orientation
      baseWidth = HORIZONTAL_DEFAULT_WIDTH;

      if (isStackedFormat(ctx.node.data) || isGroupedFormat(ctx.node.data)) {
        const groups = normalizeGroupedData(ctx.node.data);
        if (groups.length === 0) {
          baseHeight = 200;
        } else {
          let totalHeight = HORIZONTAL_GROUP_SPACING;
          groups.forEach((group) => {
            const groupHeight =
              group.values.length * HORIZONTAL_GROUPED_BAR_HEIGHT +
              (group.values.length - 1) * HORIZONTAL_GROUPED_BAR_SPACING;
            totalHeight += groupHeight + HORIZONTAL_GROUP_SPACING;
          });
          baseHeight =
            totalHeight + (ctx.node.data?.title ? HORIZONTAL_MARGIN_TOP : 0);
        }
      } else {
        const data = normalizeData(ctx.node.data);
        const titleMargin = ctx.node.data?.title ? HORIZONTAL_MARGIN_TOP : 0;
        baseHeight =
          data.length === 0
            ? 200
            : data.length * (HORIZONTAL_BAR_HEIGHT + HORIZONTAL_BAR_SPACING) +
              HORIZONTAL_BAR_SPACING +
              titleMargin;
      }
    } else {
      // Vertical orientation
      baseHeight = VERTICAL_DEFAULT_HEIGHT;

      if (isStackedFormat(ctx.node.data)) {
        const groups = normalizeGroupedData(ctx.node.data);
        baseWidth =
          groups.length === 0
            ? 200
            : groups.length * (VERTICAL_BAR_WIDTH + VERTICAL_BAR_SPACING) +
              VERTICAL_BAR_SPACING;
      } else if (isGroupedFormat(ctx.node.data)) {
        const groups = normalizeGroupedData(ctx.node.data);
        if (groups.length === 0) {
          baseWidth = 200;
        } else {
          let totalWidth = VERTICAL_GROUP_SPACING;
          groups.forEach((group) => {
            const groupWidth =
              group.values.length * VERTICAL_GROUPED_BAR_WIDTH +
              (group.values.length - 1) * VERTICAL_GROUPED_BAR_SPACING;
            totalWidth += groupWidth + VERTICAL_GROUP_SPACING;
          });
          baseWidth = totalWidth;
        }
      } else {
        const data = normalizeData(ctx.node.data);
        baseWidth =
          data.length === 0
            ? 200
            : data.length * (VERTICAL_BAR_WIDTH + VERTICAL_BAR_SPACING) +
              VERTICAL_BAR_SPACING;
      }
    }

    // Adjust for legend
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
    const { width, height } = barChart.bounds(ctx);
    return [
      { x: width / 2, y: 0, name: 'n' },
      { x: width, y: height / 2, name: 'e' },
      { x: width / 2, y: height, name: 's' },
      { x: 0, y: height / 2, name: 'w' },
    ];
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }): string {
    const flipAxes = ctx.node.data?.flipAxes === true;
    const customColors = Array.isArray(ctx.node.data?.colors)
      ? (ctx.node.data.colors as string[])
      : undefined;

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

    const showLegend = ctx.node.data?.showLegend === true;
    const legendPosition =
      (ctx.node.data?.legendPosition as LegendPosition) || 'bottom-right';

    // Stacked format
    if (isStackedFormat(ctx.node.data)) {
      const groups = normalizeGroupedData(ctx.node.data);
      if (groups.length === 0) {
        return renderEmptyState(ctx, position);
      }

      const totals = groups.map((g) =>
        g.values.reduce((sum, val) => sum + val, 0)
      );
      const maxTotal = Math.max(...totals);

      const bars = flipAxes
        ? renderStackedBarsHorizontal(
            groups,
            maxTotal,
            ctx,
            position,
            customColors
          )
        : renderStackedBarsVertical(
            groups,
            maxTotal,
            ctx,
            position,
            customColors
          );
      const axis = renderAxis(ctx, position, flipAxes);

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

    // Grouped format
    if (isGroupedFormat(ctx.node.data)) {
      const groups = normalizeGroupedData(ctx.node.data);
      if (groups.length === 0) {
        return renderEmptyState(ctx, position);
      }

      const allValues = groups.flatMap((g) => g.values);
      const maxValue = Math.max(...allValues);

      const bars = flipAxes
        ? renderGroupedBarsHorizontal(
            groups,
            maxValue,
            ctx,
            position,
            customColors
          )
        : renderGroupedBarsVertical(
            groups,
            maxValue,
            ctx,
            position,
            customColors
          );
      const axis = renderAxis(ctx, position, flipAxes);

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

    // Simple format
    const data = normalizeData(ctx.node.data);
    if (data.length === 0) {
      return renderEmptyState(ctx, position);
    }

    const maxValue = Math.max(...data.map((d) => d.value));
    const bars = flipAxes
      ? renderBarsHorizontal(data, maxValue, ctx, position, customColors)
      : renderBarsVertical(data, maxValue, ctx, position, customColors);
    const axis = renderAxis(ctx, position, flipAxes);

    return `<g>${titleElement}${yLabelElement}${bars}${axis}${xLabelElement}</g>`;
  },
};
