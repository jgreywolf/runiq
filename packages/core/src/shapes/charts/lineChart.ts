import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import {
  renderLegend as renderChartLegend,
  type LegendItem,
} from '../utils/render-chart-labels.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Default color palette for line series
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
 * Get color for series at given index (cycles through palette)
 */
function getSeriesColor(index: number, customColors?: string[]): string {
  const palette =
    customColors && customColors.length > 0 ? customColors : DEFAULT_PALETTE;
  return palette[index % palette.length];
}

/**
 * Data point for line chart
 */
interface DataPoint {
  x: number;
  y: number;
  label?: string;
  color?: string; // Optional per-point color
}

/**
 * Line series
 */
interface LineSeries {
  label: string;
  color: string;
  points: DataPoint[];
}

/**
 * Normalize data from various formats
 */
function normalizeData(
  data: any,
  customColors?: string[],
  customLabels?: string[]
): LineSeries[] {
  if (!data) return [];

  // Handle object with values array (from DSL: data:[...])
  if (data.values && Array.isArray(data.values)) {
    return [
      {
        label: data.label || 'Series 1',
        color: data.color || getSeriesColor(0, customColors),
        points: data.values.map((value: number, index: number) => ({
          x: index,
          y: value,
          label: customLabels?.[index],
          color: customColors?.[index], // Per-point color if provided
        })),
      },
    ];
  }

  // Handle array of numbers (single series, auto-indexed x values)
  if (Array.isArray(data)) {
    return [
      {
        label: 'Series 1',
        color: getSeriesColor(0, customColors),
        points: data.map((value: number, index: number) => ({
          x: index,
          y: value,
          label: customLabels?.[index],
          color: customColors?.[index], // Per-point color if provided
        })),
      },
    ];
  }

  // Handle structured data
  if (data.series && Array.isArray(data.series)) {
    return data.series.map((series: any, seriesIndex: number) => {
      const points = Array.isArray(series.values)
        ? series.values
            .map((value: any, pointIndex: number) => {
              if (typeof value === 'number') {
                return { x: pointIndex, y: value };
              }
              if (typeof value === 'object' && 'y' in value) {
                return {
                  x: value.x ?? pointIndex,
                  y: value.y,
                  label: value.label,
                };
              }
              return null;
            })
            .filter((p: any): p is DataPoint => p !== null)
        : [];

      return {
        label: series.label || `Series ${seriesIndex + 1}`,
        color: series.color || getSeriesColor(seriesIndex, customColors),
        points,
      };
    });
  }

  // Handle simple points array (single series)
  if (data.points && Array.isArray(data.points)) {
    return [
      {
        label: data.label || 'Series 1',
        color: data.color || getSeriesColor(0, customColors),
        points: data.points
          .map((point: any, index: number) => {
            if (typeof point === 'number') {
              return { x: index, y: point };
            }
            if (typeof point === 'object' && 'y' in point) {
              return {
                x: point.x ?? index,
                y: point.y,
                label: point.label,
              };
            }
            return null;
          })
          .filter((p: any): p is DataPoint => p !== null),
      },
    ];
  }

  return [];
}

/**
 * Calculate bounds of all data points
 */
function calculateDataBounds(series: LineSeries[]): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  series.forEach((s) => {
    s.points.forEach((p) => {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    });
  });

  // Add 10% padding to Y axis
  const yRange = maxY - minY;
  const yPadding = yRange * 0.1;
  minY -= yPadding;
  maxY += yPadding;

  return { minX, maxX, minY, maxY };
}

/**
 * Generate SVG path from points
 */
function generatePath(
  points: DataPoint[],
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  chartWidth: number,
  chartHeight: number,
  flipAxes: boolean = false
): string {
  if (points.length === 0) return '';

  const xRange = maxX - minX || 1;
  const yRange = maxY - minY || 1;

  const scaledPoints = points.map((p) => {
    if (flipAxes) {
      // Swap x and y when flipping
      return {
        x: ((p.y - minY) / yRange) * chartWidth,
        y: chartHeight - ((p.x - minX) / xRange) * chartHeight,
      };
    } else {
      return {
        x: ((p.x - minX) / xRange) * chartWidth,
        y: chartHeight - ((p.y - minY) / yRange) * chartHeight,
      };
    }
  });

  const pathSegments = scaledPoints.map((p, i) => {
    const command = i === 0 ? 'M' : 'L';
    return `${command} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  });

  return pathSegments.join(' ');
}

/**
 * Render grid lines
 */
function renderGrid(
  ctx: ShapeRenderContext,
  minY: number,
  maxY: number,
  chartWidth: number,
  chartHeight: number,
  flipAxes: boolean = false,
  gridColor: string = '#e5e7eb'
): string {
  const yRange = maxY - minY || 1;
  const numLines = 5;
  const lines: string[] = [];

  if (flipAxes) {
    // When flipped, show vertical grid lines with labels on bottom (X-axis)
    for (let i = 0; i <= numLines; i++) {
      const x = (i / numLines) * chartWidth;
      const value = minY + (i / numLines) * yRange;

      // Grid line (vertical)
      lines.push(
        `<line x1="${x}" y1="0" x2="${x}" y2="${chartHeight}" stroke="${gridColor}" stroke-width="1" stroke-dasharray="4,4" />`
      );

      // X-axis label (below the chart)
      const labelStyle = { fontSize: 10, color: '#6b7280' };
      const labelCtx = { ...ctx, style: labelStyle } as any;
      lines.push(
        renderShapeLabel(labelCtx, value.toFixed(0), x, chartHeight + 15)
      );
    }
  } else {
    // Normal: horizontal grid lines with labels on left (Y-axis)
    for (let i = 0; i <= numLines; i++) {
      const y = (i / numLines) * chartHeight;
      const value = maxY - (i / numLines) * yRange;

      // Grid line (horizontal)
      lines.push(
        `<line x1="0" y1="${y}" x2="${chartWidth}" y2="${y}" stroke="${gridColor}" stroke-width="1" stroke-dasharray="4,4" />`
      );

      // Y-axis label (left of chart)
      const labelStyle = { fontSize: 10, color: '#6b7280' };
      const labelCtx = { ...ctx, style: labelStyle } as any;
      lines.push(
        renderShapeLabel(labelCtx, value.toFixed(1), -10, y + 4, 'end')
      );
    }
  }

  return lines.join('\n');
}

/**
 * Render data point markers
 */
function renderMarkers(
  points: DataPoint[],
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  chartWidth: number,
  chartHeight: number,
  color: string,
  flipAxes: boolean = false
): string {
  const xRange = maxX - minX || 1;
  const yRange = maxY - minY || 1;

  return points
    .map((p) => {
      let x: number, y: number;
      if (flipAxes) {
        // Swap x and y when flipping
        x = ((p.y - minY) / yRange) * chartWidth;
        y = chartHeight - ((p.x - minX) / xRange) * chartHeight;
      } else {
        x = ((p.x - minX) / xRange) * chartWidth;
        y = chartHeight - ((p.y - minY) / yRange) * chartHeight;
      }
      // Use point-specific color if available, otherwise use series color
      const pointColor = p.color || color;
      return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="4" fill="${pointColor}" stroke="white" stroke-width="2" />`;
    })
    .join('\n');
}

/**
 * Render legend
 */
function renderLegend(
  series: LineSeries[],
  legendX: number,
  legendY: number
): string {
  const items: LegendItem[] = series.map((s) => ({
    label: s.label,
    color: s.color,
  }));

  return `<g class="legend">${renderChartLegend({
    items,
    x: legendX,
    y: legendY,
    orientation: 'vertical',
    swatchShape: 'line',
    rowHeight: 25,
    labelOffset: 30,
  })}</g>`;
}

/**
 * Render X-axis labels
 */
function renderXAxisLabels(
  series: LineSeries[],
  minX: number,
  maxX: number,
  chartWidth: number,
  chartHeight: number
): string {
  if (series.length === 0 || series[0].points.length === 0) return '';

  const xRange = maxX - minX || 1;
  const points = series[0].points; // Use first series for labels

  return points
    .map((p) => {
      if (!p.label) return ''; // Skip if no label
      const x = ((p.x - minX) / xRange) * chartWidth;
      const y = chartHeight + 15; // Position below X-axis
      const labelStyle = { fontSize: 10, color: '#6b7280' };
      const labelCtx = { style: labelStyle } as any;
      return renderShapeLabel(labelCtx, p.label, Number(x.toFixed(2)), y);
    })
    .filter(Boolean)
    .join('\n');
}

/**
 * Render Y-axis labels (used when axes are flipped)
 */
function renderYAxisLabels(
  series: LineSeries[],
  minX: number,
  maxX: number,
  chartHeight: number
): string {
  if (series.length === 0 || series[0].points.length === 0) return '';

  const xRange = maxX - minX || 1;
  const points = series[0].points; // Use first series for labels

  return points
    .map((p) => {
      if (!p.label) return ''; // Skip if no label
      const y = chartHeight - ((p.x - minX) / xRange) * chartHeight;
      const x = -10; // Position to the left of Y-axis
      const labelStyle = { fontSize: 10, color: '#6b7280' };
      const labelCtx = { style: labelStyle } as any;
      return renderShapeLabel(
        labelCtx,
        p.label,
        x,
        Number(y.toFixed(2)),
        'end'
      );
    })
    .filter(Boolean)
    .join('\n');
}

/**
 * Line chart shape definition
 * Supports single or multiple time series with automatic scaling
 */
export const lineChart: ShapeDefinition = {
  id: 'lineChart',

  bounds(ctx: ShapeRenderContext) {
    // Fixed dimensions for line chart
    const width = 400;
    const height = 300;
    const showLegend = ctx.node.data?.showLegend ?? false;
    const legendWidth = showLegend ? 150 : 0;

    return {
      width: width + legendWidth,
      height,
    };
  },

  anchors(ctx: ShapeRenderContext) {
    const { width, height } = lineChart.bounds(ctx);

    return [
      { x: width / 2, y: 0, name: 'n' }, // north
      { x: width, y: height / 2, name: 'e' }, // east
      { x: width / 2, y: height, name: 's' }, // south
      { x: 0, y: height / 2, name: 'w' }, // west
    ];
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }): string {
    // Fixed dimensions for line chart
    const width = 400;
    const height = 300;
    const showGrid = ctx.node.data?.showGrid ?? true;
    const showMarkers = ctx.node.data?.showMarkers ?? true;
    const showLegend = ctx.node.data?.showLegend ?? false;
    const flipAxes = ctx.node.data?.flipAxes === true; // Default false
    const customColors = ctx.node.data?.colors as string[] | undefined;
    const customLabels = ctx.node.data?.labels as string[] | undefined;

    // Normalize data
    const series = normalizeData(ctx.node.data, customColors, customLabels);

    if (series.length === 0 || series.every((s) => s.points.length === 0)) {
      const noDataStyle = { ...ctx.style, fontSize: 14, color: '#6b7280' };
      return renderShapeLabel(
        { ...ctx, style: noDataStyle },
        'No data',
        position.x,
        position.y
      );
    }

    // Calculate data bounds
    const { minX, maxX, minY, maxY } = calculateDataBounds(series);

    // Chart area dimensions (leave space for axes)
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Generate SVG elements
    const grid = showGrid
      ? flipAxes
        ? renderGrid(ctx, minY, maxY, chartWidth, chartHeight, flipAxes)
        : renderGrid(ctx, minY, maxY, chartWidth, chartHeight, flipAxes)
      : '';

    const lines = series
      .map((s) => {
        const path = generatePath(
          s.points,
          minX,
          maxX,
          minY,
          maxY,
          chartWidth,
          chartHeight,
          flipAxes
        );
        return `<path d="${path}" stroke="${s.color}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`;
      })
      .join('\n');

    const markers = showMarkers
      ? series
          .map((s) =>
            renderMarkers(
              s.points,
              minX,
              maxX,
              minY,
              maxY,
              chartWidth,
              chartHeight,
              s.color,
              flipAxes
            )
          )
          .join('\n')
      : '';

    const legend = showLegend
      ? renderLegend(series, width - 140, padding.top)
      : '';

    // Axis labels - use Y-axis labels when flipped, X-axis labels when normal
    const axisLabels = flipAxes
      ? renderYAxisLabels(series, minX, maxX, chartHeight)
      : renderXAxisLabels(series, minX, maxX, chartWidth, chartHeight);

    // Axes - swap when flipped
    const xAxis = flipAxes
      ? `<line x1="0" y1="0" x2="0" y2="${chartHeight}" stroke="#374151" stroke-width="2" />`
      : `<line x1="0" y1="${chartHeight}" x2="${chartWidth}" y2="${chartHeight}" stroke="#374151" stroke-width="2" />`;

    const yAxis = flipAxes
      ? `<line x1="0" y1="${chartHeight}" x2="${chartWidth}" y2="${chartHeight}" stroke="#374151" stroke-width="2" />`
      : `<line x1="0" y1="0" x2="0" y2="${chartHeight}" stroke="#374151" stroke-width="2" />`;

    // Title
    const titleStyle = {
      ...ctx.style,
      fontSize: 14,
      fontWeight: '600' as const,
    };
    const title = ctx.node.label
      ? renderShapeLabel(
          { ...ctx, style: titleStyle },
          ctx.node.label,
          chartWidth / 2,
          -5
        )
      : '';

    return `
      <g transform="translate(${position.x + padding.left}, ${position.y + padding.top})">
        ${title}
        ${grid}
        ${xAxis}
        ${yAxis}
        ${axisLabels}
        ${lines}
        ${markers}
        ${legend}
      </g>
    `;
  },
};
