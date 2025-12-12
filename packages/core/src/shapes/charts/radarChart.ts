import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import {
  renderLegend as renderChartLegend,
  type LegendItem,
} from '../utils/render-chart-labels.js';
import { renderShapeLabel } from '../utils/render-label.js';

interface RadarAxis {
  label: string;
  max?: number; // Maximum value for this axis (default: auto-calculate from data)
}

interface RadarSeries {
  label: string;
  values: number[];
  color?: string;
}

interface RadarData {
  axes: RadarAxis[];
  series: RadarSeries[];
}

// Default color palette for multiple series
const DEFAULT_PALETTE = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

/**
 * Normalizes various data formats into a standard RadarData structure
 */
function normalizeData(
  data: any,
  customColors?: string[],
  customLabels?: string[]
): { axes: RadarAxis[]; series: RadarSeries[] } {
  if (!data) {
    return { axes: [], series: [] };
  }

  const colors = customColors || DEFAULT_PALETTE;

  // Format 1: Full structured data with axes and series
  if (
    data.axes &&
    Array.isArray(data.axes) &&
    data.series &&
    Array.isArray(data.series)
  ) {
    return {
      axes: data.axes.map((axis: any) =>
        typeof axis === 'string' ? { label: axis } : axis
      ),
      series: data.series.map((s: any, idx: number) => ({
        label: s.label || `Series ${idx + 1}`,
        values: s.values || [],
        color: s.color || colors[idx % colors.length],
      })),
    };
  }

  // Format 2: Simple array of values (single series) - use custom labels if provided
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'number') {
    const axes = data.map((_: number, idx: number) => ({
      label: customLabels?.[idx] || `Axis ${idx + 1}`,
    }));
    return {
      axes,
      series: [
        {
          label: 'Series 1',
          values: data,
          color: colors[0],
        },
      ],
    };
  }

  // Format 3: Object with just values (single series)
  if (data.values && Array.isArray(data.values)) {
    const axes = data.values.map((_: number, idx: number) => ({
      label:
        customLabels?.[idx] || data.axes?.[idx]?.label || `Axis ${idx + 1}`,
    }));
    return {
      axes,
      series: [
        {
          label: data.label || 'Series 1',
          values: data.values,
          color: data.color || colors[0],
        },
      ],
    };
  }

  // Empty or unrecognized format
  return { axes: [], series: [] };
}

/**
 * Calculate maximum values for each axis
 */
function calculateAxisMaxValues(
  axes: RadarAxis[],
  series: RadarSeries[]
): number[] {
  // Check if any axis has an explicit max value
  const hasExplicitMax = axes.some((axis) => axis.max !== undefined);

  // If no explicit max values are set, use a shared global max
  // This is important for simple array data like [90, 85, 78, 82, 88]
  // to avoid normalizing each value independently (which would make them all equal to 1.0)
  if (!hasExplicitMax) {
    // Find the global maximum across all values in all series
    let globalMax = 0;
    for (const s of series) {
      for (const value of s.values) {
        if (value > globalMax) {
          globalMax = value;
        }
      }
    }
    // Return the same max for all axes
    return axes.map(() => globalMax || 1);
  }

  // If explicit max values exist, use per-axis calculation (original behavior)
  return axes.map((axis, idx) => {
    if (axis.max !== undefined) {
      return axis.max;
    }
    // Find max value across all series for this axis
    let maxVal = 0;
    for (const s of series) {
      if (s.values[idx] !== undefined && s.values[idx] > maxVal) {
        maxVal = s.values[idx];
      }
    }
    return maxVal || 1; // Avoid division by zero
  });
}

/**
 * Convert polar coordinates (angle, radius) to cartesian (x, y)
 */
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

/**
 * Render grid circles for scale reference
 */
function renderGrid(
  centerX: number,
  centerY: number,
  maxRadius: number,
  levels: number
): string {
  const circles: string[] = [];
  for (let i = 1; i <= levels; i++) {
    const radius = (maxRadius * i) / levels;
    circles.push(
      `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="none" stroke="#e5e7eb" stroke-width="1"/>`
    );
  }
  return circles.join('\n      ');
}

/**
 * Render radial axis spokes
 */
function renderAxes(
  centerX: number,
  centerY: number,
  maxRadius: number,
  axisCount: number
): string {
  const lines: string[] = [];
  for (let i = 0; i < axisCount; i++) {
    const angle = (360 / axisCount) * i;
    const point = polarToCartesian(centerX, centerY, maxRadius, angle);
    lines.push(
      `<line x1="${centerX}" y1="${centerY}" x2="${point.x}" y2="${point.y}" stroke="#d1d5db" stroke-width="1"/>`
    );
  }
  return lines.join('\n      ');
}

/**
 * Render axis labels
 */
function renderAxisLabels(
  centerX: number,
  centerY: number,
  maxRadius: number,
  axes: RadarAxis[],
  labelOffset: number = 20
): string {
  const labels: string[] = [];
  const axisCount = axes.length;

  for (let i = 0; i < axisCount; i++) {
    const angle = (360 / axisCount) * i;
    const point = polarToCartesian(
      centerX,
      centerY,
      maxRadius + labelOffset,
      angle
    );

    // Adjust text anchor based on position
    let anchor = 'middle';
    if (point.x < centerX - 5) anchor = 'end';
    else if (point.x > centerX + 5) anchor = 'start';

    labels.push(
      `<text x="${point.x}" y="${point.y + 5}" text-anchor="${anchor}" font-size="12" fill="#374151">${axes[i].label}</text>`
    );
  }

  return labels.join('\n      ');
}

/**
 * Render a single data series as a polygon
 */
function renderSeries(
  centerX: number,
  centerY: number,
  maxRadius: number,
  series: RadarSeries,
  axisMaxValues: number[],
  axisCount: number,
  opacity: number = 0.3
): string {
  const points: string[] = [];

  for (let i = 0; i < axisCount; i++) {
    const value = series.values[i] || 0;
    const maxValue = axisMaxValues[i];
    const normalizedValue = maxValue > 0 ? value / maxValue : 0;
    const radius = maxRadius * Math.min(1, Math.max(0, normalizedValue));
    const angle = (360 / axisCount) * i;
    const point = polarToCartesian(centerX, centerY, radius, angle);
    points.push(`${point.x},${point.y}`);
  }

  const pathData = points.join(' ');
  const color = series.color || DEFAULT_PALETTE[0];

  return `
      <polygon points="${pathData}" fill="${color}" fill-opacity="${opacity}" stroke="${color}" stroke-width="2"/>`;
}

/**
 * Render data point markers for a series
 */
function renderMarkers(
  centerX: number,
  centerY: number,
  maxRadius: number,
  series: RadarSeries,
  axisMaxValues: number[],
  axisCount: number,
  customColors?: string[]
): string {
  const markers: string[] = [];

  for (let i = 0; i < axisCount; i++) {
    const value = series.values[i] || 0;
    const maxValue = axisMaxValues[i];
    const normalizedValue = maxValue > 0 ? value / maxValue : 0;
    const radius = maxRadius * Math.min(1, Math.max(0, normalizedValue));
    const angle = (360 / axisCount) * i;
    const point = polarToCartesian(centerX, centerY, radius, angle);

    // Use per-point color if available, otherwise use series color
    const markerColor = customColors?.[i] || series.color || DEFAULT_PALETTE[0];

    markers.push(
      `<circle cx="${point.x}" cy="${point.y}" r="4" fill="${markerColor}" stroke="white" stroke-width="1"/>`
    );
  }

  return markers.join('\n      ');
}

/**
 * Render legend for multiple series
 */
function renderLegend(
  series: RadarSeries[],
  legendX: number,
  legendY: number
): string {
  const items: LegendItem[] = series.map((s) => ({
    label: s.label,
    color: s.color || DEFAULT_PALETTE[0],
  }));

  return renderChartLegend({
    items,
    x: legendX,
    y: legendY,
    orientation: 'vertical',
  });
}

/**
 * Radar Chart Shape
 * Displays multi-dimensional data in a circular format with radial axes
 */
export const radarChart: ShapeDefinition = {
  id: 'radarChart',

  bounds(_ctx: ShapeRenderContext) {
    const width = 400;
    const height = 400;
    return { width, height };
  },

  anchors(ctx: ShapeRenderContext) {
    const { width, height } = this.bounds(ctx);
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    return [
      { x: halfWidth, y: 0, name: 'n' },
      { x: width, y: halfHeight, name: 'e' },
      { x: halfWidth, y: height, name: 's' },
      { x: 0, y: halfHeight, name: 'w' },
    ];
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }): string {
    const customColors = ctx.node.data?.colors as string[] | undefined;
    const customLabels = ctx.node.data?.labels as string[] | undefined;
    const showGrid = ctx.node.data?.showGrid !== false; // Default true
    const showMarkers = ctx.node.data?.showMarkers !== false; // Default true
    const showLegend = ctx.node.data?.showLegend === true; // Default false
    const gridLevels = (ctx.node.data?.gridLevels as number) || 4;

    const { axes, series } = normalizeData(
      ctx.node.data,
      customColors,
      customLabels
    );

    // Handle empty data
    if (
      axes.length === 0 ||
      series.length === 0 ||
      series.every((s) => s.values.length === 0)
    ) {
      return `<text x="${position.x}" y="${position.y}" fill="#6b7280" font-size="14">No data</text>`;
    }

    // Validate axis count (minimum 3 for a radar chart)
    if (axes.length < 3) {
      return `<text x="${position.x}" y="${position.y}" fill="#ef4444" font-size="14">Radar chart requires at least 3 axes</text>`;
    }

    const width = 400;
    const height = 400;
    const padding = 60;
    const maxRadius = Math.min(width, height) / 2 - padding;
    const centerX = position.x + width / 2;
    const centerY = position.y + height / 2;

    const axisMaxValues = calculateAxisMaxValues(axes, series);

    let svg = `<g transform="translate(${position.x}, ${position.y})">`;

    // Chart title
    if (ctx.node.label) {
      const titleStyle = {
        ...ctx.style,
        fontSize: 16,
        fontWeight: 'bold' as const,
      };
      const titleSvg = renderShapeLabel(
        { ...ctx, style: titleStyle },
        ctx.node.label,
        width / 2,
        20
      );
      svg += `\n      ${titleSvg}`;
    }

    // Grid circles
    if (showGrid) {
      svg +=
        '\n      ' +
        renderGrid(
          centerX - position.x,
          centerY - position.y,
          maxRadius,
          gridLevels
        );
    }

    // Radial axes
    svg +=
      '\n      ' +
      renderAxes(
        centerX - position.x,
        centerY - position.y,
        maxRadius,
        axes.length
      );

    // Axis labels
    svg +=
      '\n      ' +
      renderAxisLabels(
        centerX - position.x,
        centerY - position.y,
        maxRadius,
        axes
      );

    // Data series polygons
    series.forEach((s) => {
      svg += renderSeries(
        centerX - position.x,
        centerY - position.y,
        maxRadius,
        s,
        axisMaxValues,
        axes.length
      );
    });

    // Data point markers
    if (showMarkers) {
      series.forEach((s) => {
        svg +=
          '\n      ' +
          renderMarkers(
            centerX - position.x,
            centerY - position.y,
            maxRadius,
            s,
            axisMaxValues,
            axes.length,
            customColors
          );
      });
    }

    // Legend
    if (showLegend && series.length > 1) {
      svg += '\n      ' + renderLegend(series, width - 120, 50);
    }

    svg += '\n    </g>';

    return svg;
  },
};
