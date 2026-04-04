import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import {
  renderLegend as renderChartLegend,
  renderChartTitle,
  type LegendItem,
} from '../utils/render-chart-labels.js';
import { renderShapeLabel } from '../utils/render-label.js';

const DEFAULT_PALETTE = [
  '#4299e1',
  '#48bb78',
  '#ed8936',
  '#9f7aea',
  '#f56565',
  '#38b2ac',
  '#ed64a6',
  '#ecc94b',
];

interface ScatterPoint {
  x: number;
  y: number;
  label?: string;
  size?: number;
  color?: string;
}

interface ScatterSeries {
  label: string;
  color: string;
  points: ScatterPoint[];
}

function isScatterPoint(point: ScatterPoint | null): point is ScatterPoint {
  return point !== null;
}

function getSeriesColor(index: number, customColors?: string[]): string {
  const palette =
    customColors && customColors.length > 0 ? customColors : DEFAULT_PALETTE;
  return palette[index % palette.length];
}

function normalizeData(
  data: any,
  customColors?: string[],
  customLabels?: string[]
): ScatterSeries[] {
  if (!data) return [];

  const normalizePointArray = (items: any[], fallbackLabel = 'Series 1') => {
    const points: ScatterPoint[] = [];
    items.forEach((item: any, index: number) => {
      if (
        typeof item === 'object' &&
        item !== null &&
        typeof item.x === 'number' &&
        typeof item.y === 'number'
      ) {
        points.push({
          x: item.x,
          y: item.y,
          label:
            (typeof item.label === 'string' && item.label) ||
            customLabels?.[index],
          size: typeof item.size === 'number' ? item.size : undefined,
          color: typeof item.color === 'string' ? item.color : undefined,
        });
      }
    });

    return points.length
      ? [
          {
            label: fallbackLabel,
            color: getSeriesColor(0, customColors),
            points,
          },
        ]
      : [];
  };

  if (Array.isArray(data)) {
    return normalizePointArray(data);
  }

  if (Array.isArray(data?.values)) {
    return normalizePointArray(data.values, data.label || 'Series 1');
  }

  if (Array.isArray(data?.points)) {
    const series = normalizePointArray(data.points, data.label || 'Series 1');
    if (series[0] && typeof data.color === 'string') {
      series[0].color = data.color;
    }
    return series;
  }

  if (Array.isArray(data?.series)) {
    return data.series.map((series: any, seriesIndex: number) => ({
      label: series.label || `Series ${seriesIndex + 1}`,
      color: series.color || getSeriesColor(seriesIndex, customColors),
      points: Array.isArray(series.points)
        ? series.points
            .map((point: any, pointIndex: number) => {
              if (
                typeof point === 'object' &&
                point !== null &&
                typeof point.x === 'number' &&
                typeof point.y === 'number'
              ) {
                return {
                  x: point.x,
                  y: point.y,
                  label:
                    (typeof point.label === 'string' && point.label) ||
                    customLabels?.[pointIndex],
                  size: typeof point.size === 'number' ? point.size : undefined,
                  color:
                    typeof point.color === 'string' ? point.color : undefined,
                };
              }
              return null;
            })
            .filter(isScatterPoint)
        : [],
    }));
  }

  return [];
}

function calculateBounds(series: ScatterSeries[]) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  series.forEach((item) => {
    item.points.forEach((point) => {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    });
  });

  if (!Number.isFinite(minX)) {
    return { minX: 0, maxX: 1, minY: 0, maxY: 1 };
  }

  const xPadding = (maxX - minX || 1) * 0.1;
  const yPadding = (maxY - minY || 1) * 0.1;

  return {
    minX: minX - xPadding,
    maxX: maxX + xPadding,
    minY: minY - yPadding,
    maxY: maxY + yPadding,
  };
}

function scalePoint(
  point: ScatterPoint,
  chartWidth: number,
  chartHeight: number,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
) {
  const xRange = maxX - minX || 1;
  const yRange = maxY - minY || 1;

  return {
    x: ((point.x - minX) / xRange) * chartWidth,
    y: chartHeight - ((point.y - minY) / yRange) * chartHeight,
  };
}

function renderGrid(
  ctx: ShapeRenderContext,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  chartWidth: number,
  chartHeight: number
): string {
  const lines: string[] = [];
  const numLines = 5;
  const xRange = maxX - minX || 1;
  const yRange = maxY - minY || 1;
  const labelStyle = { fontSize: 10, color: '#6b7280' };
  const labelCtx = { ...ctx, style: labelStyle } as any;

  for (let i = 0; i <= numLines; i++) {
    const x = (i / numLines) * chartWidth;
    const xValue = minX + (i / numLines) * xRange;
    lines.push(
      `<line x1="${x}" y1="0" x2="${x}" y2="${chartHeight}" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="4,4" />`
    );
    lines.push(renderShapeLabel(labelCtx, xValue.toFixed(0), x, chartHeight + 15));
  }

  for (let i = 0; i <= numLines; i++) {
    const y = (i / numLines) * chartHeight;
    const yValue = maxY - (i / numLines) * yRange;
    lines.push(
      `<line x1="0" y1="${y}" x2="${chartWidth}" y2="${y}" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="4,4" />`
    );
    lines.push(renderShapeLabel(labelCtx, yValue.toFixed(0), -20, y + 4));
  }

  return lines.join('\n      ');
}

function renderAxes(chartWidth: number, chartHeight: number): string {
  return [
    `<line x1="0" y1="${chartHeight}" x2="${chartWidth}" y2="${chartHeight}" stroke="#6b7280" stroke-width="2" />`,
    `<line x1="0" y1="0" x2="0" y2="${chartHeight}" stroke="#6b7280" stroke-width="2" />`,
  ].join('\n      ');
}

function renderLegend(
  series: ScatterSeries[],
  x: number,
  y: number
): string {
  const items: LegendItem[] = series.map((item) => ({
    label: item.label,
    color: item.color,
  }));

  return renderChartLegend({
    items,
    x,
    y,
    orientation: 'vertical',
  });
}

export const scatterChart: ShapeDefinition = {
  id: 'scatterChart',

  bounds(ctx: ShapeRenderContext): { width: number; height: number } {
    const showLegend = ctx.node.data?.showLegend === true;
    return {
      width: showLegend ? 550 : 400,
      height: 300,
    };
  },

  anchors() {
    return [
      { x: 200, y: 0, name: 'n' },
      { x: 400, y: 150, name: 'e' },
      { x: 200, y: 300, name: 's' },
      { x: 0, y: 150, name: 'w' },
    ];
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }): string {
    const title = ctx.node.label;
    const chartWidth = 320;
    const chartHeight = 220;
    const marginLeft = 45;
    const marginTop = title ? 35 : 10;
    const showGrid = ctx.node.data?.showGrid !== false;
    const showLegend = ctx.node.data?.showLegend === true;
    const showLabels = ctx.node.data?.showPointLabels === true;
    const customLabels = Array.isArray(ctx.node.data?.labels)
      ? (ctx.node.data.labels as string[])
      : undefined;
    const customColors = Array.isArray(ctx.node.data?.colors)
      ? (ctx.node.data.colors as string[])
      : undefined;

    const series = normalizeData(ctx.node.data, customColors, customLabels);
    if (series.length === 0 || series.every((item) => item.points.length === 0)) {
      return `<text x="${position.x + 120}" y="${position.y + 140}" font-size="14" fill="#6b7280">No data</text>`;
    }

    const titleSvg = title
      ? renderChartTitle({
          ctx,
          title,
          position,
          width: chartWidth + marginLeft,
          yOffset: 18,
        })
      : '';

    const { minX, maxX, minY, maxY } = calculateBounds(series);
    const chartX = position.x + marginLeft;
    const chartY = position.y + marginTop;

    const grid = showGrid
      ? renderGrid(ctx, minX, maxX, minY, maxY, chartWidth, chartHeight)
      : '';
    const axes = renderAxes(chartWidth, chartHeight);

    const pointsSvg = series
      .map((item, seriesIndex) =>
        item.points
          .map((point, pointIndex) => {
            const scaled = scalePoint(
              point,
              chartWidth,
              chartHeight,
              minX,
              maxX,
              minY,
              maxY
            );
            const radius = Math.max(4, Math.min(point.size ?? 6, 14));
            const color = point.color || item.color || getSeriesColor(seriesIndex, customColors);
            const circle = `<circle cx="${scaled.x}" cy="${scaled.y}" r="${radius}" fill="${color}" fill-opacity="0.82" stroke="#ffffff" stroke-width="1.5" />`;

            if (!showLabels || !point.label) return circle;

            const labelStyle = { fontSize: 11, color: '#374151' };
            const labelCtx = { ...ctx, style: labelStyle } as any;
            const label = renderShapeLabel(
              labelCtx,
              point.label,
              scaled.x + radius + 6,
              scaled.y - radius
            );
            return `${circle}\n      ${label}`;
          })
          .join('\n      ')
      )
      .join('\n      ');

    const legend = showLegend
      ? renderLegend(series, chartX + chartWidth + 20, chartY + 10)
      : '';

    return `${titleSvg}
    <g transform="translate(${chartX}, ${chartY})">
      ${grid}
      ${axes}
      ${pointsSvg}
    </g>
    ${legend}`;
  },
};
