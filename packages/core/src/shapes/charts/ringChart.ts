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

function getSliceColor(index: number, customColors?: string[]): string {
  const palette =
    customColors && customColors.length > 0 ? customColors : DEFAULT_PALETTE;
  return palette[index % palette.length];
}

interface DataItem {
  label: string;
  value: number;
}

interface PieSlice {
  label: string;
  value: number;
  percentage: number;
  startAngle: number;
  endAngle: number;
  angle: number;
}

type LegendPosition =
  | 'top'
  | 'top-right'
  | 'right'
  | 'bottom-right'
  | 'bottom'
  | 'bottom-left'
  | 'left'
  | 'top-left';

function normalizeData(data: unknown, customLabels?: string[]): DataItem[] {
  if (Array.isArray(data)) {
    return data
      .map((value: unknown, i: number) => {
        if (typeof value === 'number') {
          return {
            label: customLabels?.[i] || `Slice ${i + 1}`,
            value,
          };
        }

        if (
          typeof value === 'object' &&
          value !== null &&
          'value' in value &&
          typeof value.value === 'number'
        ) {
          const valueItem = value as { label?: string; value: number };
          return {
            label: valueItem.label || customLabels?.[i] || `Slice ${i + 1}`,
            value: valueItem.value,
          };
        }

        return null;
      })
      .filter(
        (item: DataItem | null): item is DataItem =>
          item !== null && item.value > 0
      );
  }

  if (
    !data ||
    typeof data !== "object" ||
    !('values' in data) ||
    !Array.isArray(data.values)
  ) {
    return [];
  }

  return (data.values as unknown[])
    .map((item: unknown, i: number) => {
      if (typeof item === 'number') {
        return {
          label: customLabels?.[i] || `Slice ${i + 1}`,
          value: item,
        };
      }

      if (
        typeof item === 'object' &&
        item !== null &&
        'value' in item &&
        typeof item.value === 'number'
      ) {
        const valueItem = item as { label?: string; value: number };
        return {
          label: valueItem.label || customLabels?.[i] || `Slice ${i + 1}`,
          value: valueItem.value,
        };
      }

      return null;
    })
    .filter(
      (item: DataItem | null): item is DataItem =>
        item !== null && item.value > 0
    );
}

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

function clampInnerRadius(rawInnerRadius?: unknown): number {
  if (typeof rawInnerRadius === 'number' && rawInnerRadius > 0.05) {
    return Math.min(rawInnerRadius, 0.85);
  }

  return 0.58;
}

function renderSlices(
  slices: PieSlice[],
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  ctx: ShapeRenderContext,
  customColors?: string[]
): string {
  if (slices.length === 0) {
    return `<circle cx="${cx}" cy="${cy}" r="${outerRadius}" fill="#f0f0f0" stroke="${ctx.style.stroke}" stroke-width="${ctx.style.strokeWidth || 1}" />`;
  }

  return slices
    .map((slice, i) => {
      const startRad = ((slice.startAngle - 90) * Math.PI) / 180;
      const endRad = ((slice.endAngle - 90) * Math.PI) / 180;

      const x1Outer = cx + outerRadius * Math.cos(startRad);
      const y1Outer = cy + outerRadius * Math.sin(startRad);
      const x2Outer = cx + outerRadius * Math.cos(endRad);
      const y2Outer = cy + outerRadius * Math.sin(endRad);

      const x1Inner = cx + innerRadius * Math.cos(endRad);
      const y1Inner = cy + innerRadius * Math.sin(endRad);
      const x2Inner = cx + innerRadius * Math.cos(startRad);
      const y2Inner = cy + innerRadius * Math.sin(startRad);

      const largeArc = slice.angle > 180 ? 1 : 0;
      const color = getSliceColor(i, customColors);

      return `<path d="M ${x1Outer},${y1Outer} A ${outerRadius},${outerRadius} 0 ${largeArc},1 ${x2Outer},${y2Outer} L ${x1Inner},${y1Inner} A ${innerRadius},${innerRadius} 0 ${largeArc},0 ${x2Inner},${y2Inner} Z" fill="${color}" stroke="${ctx.style.stroke || '#333'}" stroke-width="${ctx.style.strokeWidth || 2}" />`;
    })
    .join('\n    ');
}

function calculateLegendPosition(
  position: { x: number; y: number },
  size: number,
  sliceCount: number,
  legendPos: LegendPosition
): { x: number; y: number } {
  const rowHeight = 20;
  const legendHeight = sliceCount * rowHeight;
  const legendWidth = 150;
  const horizontalLegendHeight = 40;

  switch (legendPos) {
    case 'top':
      return { x: position.x, y: position.y - horizontalLegendHeight - 10 };
    case 'top-right':
      return { x: position.x + size + 10, y: position.y };
    case 'right':
      return {
        x: position.x + size + 10,
        y: position.y + (size - legendHeight) / 2,
      };
    case 'bottom-right':
      return { x: position.x + size + 10, y: position.y + size - legendHeight };
    case 'bottom':
      return { x: position.x, y: position.y + size + 10 };
    case 'bottom-left':
      return {
        x: position.x - legendWidth - 10,
        y: position.y + size - legendHeight,
      };
    case 'left':
      return {
        x: position.x - legendWidth - 10,
        y: position.y + (size - legendHeight) / 2,
      };
    case 'top-left':
      return { x: position.x - legendWidth - 10, y: position.y };
    default:
      return { x: position.x + size + 10, y: position.y + size - legendHeight };
  }
}

function renderLegend(
  slices: PieSlice[],
  startX: number,
  startY: number,
  customColors?: string[]
): string {
  const items: LegendItem[] = slices.map((slice, i) => {
    const percentage = Math.round(slice.percentage * 10) / 10;
    const percentageStr =
      percentage % 1 === 0 ? percentage.toFixed(0) : percentage.toFixed(1);

    return {
      label: slice.label,
      color: getSliceColor(i, customColors),
      value: `${percentageStr}%`,
    };
  });

  return renderChartLegend({
    items,
    x: startX,
    y: startY,
    orientation: 'vertical',
  });
}

function renderLegendHorizontal(
  slices: PieSlice[],
  x: number,
  y: number,
  maxWidth: number,
  customColors?: string[]
): string {
  const items: LegendItem[] = slices.map((slice, i) => ({
    label: slice.label,
    color: getSliceColor(i, customColors),
  }));

  return renderChartLegend({
    items,
    x,
    y,
    orientation: 'horizontal',
    maxWidth,
  });
}

function renderSliceLabels(
  slices: PieSlice[],
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  customColors?: string[]
): string {
  const labelRadius = innerRadius + (outerRadius - innerRadius) * 0.5;

  return slices
    .map((slice, i) => {
      const midAngle =
        (((slice.startAngle + slice.endAngle) / 2 - 90) * Math.PI) / 180;
      const x = cx + labelRadius * Math.cos(midAngle);
      const y = cy + labelRadius * Math.sin(midAngle);

      const color = getSliceColor(i, customColors);
      const brightness =
        parseInt(color.slice(1, 3), 16) * 0.299 +
        parseInt(color.slice(3, 5), 16) * 0.587 +
        parseInt(color.slice(5, 7), 16) * 0.114;
      const textColor = brightness > 128 ? '#333' : '#fff';

      const labelStyle = { fontSize: 11, fontWeight: 'bold', color: textColor };
      const labelCtx = { style: labelStyle } as any;
      return renderShapeLabel(labelCtx, slice.value.toString(), x, y + 4);
    })
    .join('\n    ');
}

function renderTitle(
  title: string,
  x: number,
  y: number,
  ctx: ShapeRenderContext
): string {
  return renderChartTitle({
    ctx,
    title,
    position: { x, y },
    width: 0,
    yOffset: 15,
  });
}

export const ringChart: ShapeDefinition = {
  id: 'ringChart',

  bounds(ctx: ShapeRenderContext): { width: number; height: number } {
    const size = 250;
    const titleHeight = ctx.node.label ? 30 : 0;
    const showLegend = ctx.node.data?.showLegend !== false;

    if (showLegend) {
      const legendPosition =
        (ctx.node.data?.legendPosition as LegendPosition) || 'bottom-right';
      const legendWidth = 150;
      const horizontalLegendHeight = 40;

      switch (legendPosition) {
        case 'top':
        case 'bottom':
          return {
            width: size,
            height: size + horizontalLegendHeight + titleHeight + 10,
          };
        case 'left':
        case 'top-left':
        case 'bottom-left':
          return { width: size + legendWidth + 10, height: size + titleHeight };
        case 'right':
        case 'top-right':
        case 'bottom-right':
        default:
          return { width: size + legendWidth + 10, height: size + titleHeight };
      }
    }

    return { width: size, height: size + titleHeight };
  },

  anchors() {
    const size = 250;
    const r = size / 2;
    return [
      { x: r, y: 0, name: 'n' },
      { x: size, y: r, name: 'e' },
      { x: r, y: size, name: 's' },
      { x: 0, y: r, name: 'w' },
    ];
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }): string {
    const size = 250;
    const title = ctx.node.label;
    const titleHeight = title ? 30 : 0;
    const legendPosition =
      (ctx.node.data?.legendPosition as LegendPosition) || 'bottom-right';
    const showLegend = ctx.node.data?.showLegend !== false;

    let chartX = position.x;
    let chartY = position.y + titleHeight;

    if (showLegend) {
      const legendWidth = 150;
      const horizontalLegendHeight = 40;

      switch (legendPosition) {
        case 'top':
          chartY = position.y + titleHeight + horizontalLegendHeight + 10;
          break;
        case 'left':
        case 'top-left':
        case 'bottom-left':
          chartX = position.x + legendWidth + 10;
          break;
      }
    }

    const cx = chartX + size / 2;
    const cy = chartY + size / 2;
    const outerRadius = size / 2 - 10;
    const innerRadius = outerRadius * clampInnerRadius(ctx.node.data?.innerRadius);

    const customLabels = Array.isArray(ctx.node.data?.labels)
      ? (ctx.node.data.labels as string[])
      : undefined;
    const customColors = Array.isArray(ctx.node.data?.colors)
      ? (ctx.node.data.colors as string[])
      : undefined;

    const data = normalizeData(ctx.node.data, customLabels);
    const slices = calculateSlices(data);

    const titleElement = title ? renderTitle(title, cx, position.y, ctx) : '';
    const paths = renderSlices(
      slices,
      cx,
      cy,
      outerRadius,
      innerRadius,
      ctx,
      customColors
    );
    const sliceLabels =
      slices.length > 0
        ? renderSliceLabels(
            slices,
            cx,
            cy,
            outerRadius,
            innerRadius,
            customColors
          )
        : '';

    if (showLegend && slices.length > 0) {
      const legendPos = calculateLegendPosition(
        { x: chartX, y: chartY },
        size,
        slices.length,
        legendPosition
      );

      const legend =
        legendPosition === 'top' || legendPosition === 'bottom'
          ? renderLegendHorizontal(
              slices,
              legendPos.x,
              legendPos.y,
              size,
              customColors
            )
          : renderLegend(slices, legendPos.x, legendPos.y, customColors);

      return `${titleElement}${paths}\n    ${sliceLabels}\n    ${legend}`;
    }

    return `${titleElement}${paths}\n    ${sliceLabels}`;
  },
};
