import type { ShapeRenderContext } from '../../types/index.js';
import { renderShapeLabel } from './render-label.js';

/**
 * Configuration for chart title rendering
 */
export interface ChartTitleConfig {
  ctx: ShapeRenderContext;
  title: string;
  position: { x: number; y: number };
  width: number;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  color?: string;
  yOffset?: number;
}

/**
 * Configuration for axis label rendering
 */
export interface AxisLabelConfig {
  label: string;
  x: number;
  y: number;
  fontSize?: number;
  color?: string;
  rotate?: boolean; // For Y-axis labels
}

/**
 * Configuration for legend item
 */
export interface LegendItem {
  label: string;
  color: string;
  value?: string; // Optional value/percentage to show
}

/**
 * Configuration for legend rendering
 */
export interface LegendConfig {
  items: LegendItem[];
  x: number;
  y: number;
  orientation?: 'vertical' | 'horizontal';
  swatchSize?: number;
  rowHeight?: number;
  itemSpacing?: number;
  labelOffset?: number;
  maxWidth?: number; // For horizontal wrapping
  swatchShape?: 'rect' | 'circle' | 'line'; // Different shapes for different chart types
}

/**
 * Render a chart title with consistent styling
 */
export function renderChartTitle(config: ChartTitleConfig): string {
  const {
    ctx,
    title,
    position,
    width,
    fontSize = 16,
    fontWeight = 'bold',
    yOffset = 20,
  } = config;

  const titleX = position.x + width / 2;
  const titleY = position.y + yOffset;
  const titleStyle = {
    ...ctx.style,
    fontSize,
    fontWeight,
  };

  return renderShapeLabel({ ...ctx, style: titleStyle }, title, titleX, titleY);
}

/**
 * Render an X-axis label (centered below chart)
 */
export function renderXAxisLabel(config: AxisLabelConfig): string {
  const { label, x, y, fontSize = 14, color = '#666' } = config;

  return `<text x="${x}" y="${y}" text-anchor="middle" font-size="${fontSize}" fill="${color}">${escapeXml(label)}</text>`;
}

/**
 * Render a Y-axis label (rotated, left of chart)
 */
export function renderYAxisLabel(config: AxisLabelConfig): string {
  const { label, x, y, fontSize = 14, color = '#666' } = config;

  return `<text x="${x}" y="${y}" text-anchor="middle" font-size="${fontSize}" fill="${color}" transform="rotate(-90 ${x} ${y})">${escapeXml(label)}</text>`;
}

/**
 * Render an axis label (auto-detects orientation)
 */
export function renderAxisLabel(config: AxisLabelConfig): string {
  if (config.rotate) {
    return renderYAxisLabel(config);
  }
  return renderXAxisLabel(config);
}

/**
 * Render a legend with vertical layout
 */
export function renderLegendVertical(config: LegendConfig): string {
  const {
    items,
    x,
    y,
    swatchSize = 12,
    rowHeight = 20,
    labelOffset = 18,
    swatchShape = 'rect',
  } = config;

  return items
    .map((item, i) => {
      const itemY = y + i * rowHeight;
      const swatch = renderLegendSwatch(
        x,
        itemY,
        swatchSize,
        item.color,
        swatchShape
      );
      const labelText = item.value
        ? `${item.label} (${item.value})`
        : item.label;

      return `<g>
      ${swatch}
      <text x="${x + labelOffset}" y="${itemY + swatchSize / 2 + 4}" font-size="11" fill="#333">${escapeXml(labelText)}</text>
    </g>`;
    })
    .join('\n    ');
}

/**
 * Render a legend with horizontal layout (with wrapping)
 */
export function renderLegendHorizontal(config: LegendConfig): string {
  const {
    items,
    x,
    y,
    swatchSize = 12,
    itemSpacing = 15,
    labelOffset = 18,
    maxWidth = 400,
    swatchShape = 'rect',
  } = config;

  let currentX = 0;
  let currentY = 0;
  const renderedItems: string[] = [];

  items.forEach((item) => {
    const labelText = item.value ? `${item.label} (${item.value})` : item.label;
    const estimatedTextWidth = labelText.length * 5.5; // Rough estimate
    const itemWidth = swatchSize + labelOffset + estimatedTextWidth;

    // Wrap to next row if needed (and not first item)
    if (currentX > 0 && currentX + itemWidth > maxWidth) {
      currentY += 20;
      currentX = 0;
    }

    const actualX = x + currentX;
    const actualY = y + currentY;
    const swatch = renderLegendSwatch(
      actualX,
      actualY,
      swatchSize,
      item.color,
      swatchShape
    );

    renderedItems.push(`<g>
      ${swatch}
      <text x="${actualX + labelOffset}" y="${actualY + swatchSize / 2 + 4}" font-size="11" fill="#333">${escapeXml(labelText)}</text>
    </g>`);

    currentX += itemWidth + itemSpacing;
  });

  return renderedItems.join('\n    ');
}

/**
 * Render a legend (auto-detects orientation)
 */
export function renderLegend(config: LegendConfig): string {
  if (config.orientation === 'horizontal') {
    return renderLegendHorizontal(config);
  }
  return renderLegendVertical(config);
}

/**
 * Render a legend swatch (rectangle, circle, or line)
 */
function renderLegendSwatch(
  x: number,
  y: number,
  size: number,
  color: string,
  shape: 'rect' | 'circle' | 'line'
): string {
  switch (shape) {
    case 'circle':
      return `<circle cx="${x + size / 2}" cy="${y + size / 2}" r="${size / 2}" fill="${color}" stroke="#333" stroke-width="1" />`;
    case 'line':
      return `<line x1="${x}" y1="${y + size / 2}" x2="${x + size}" y2="${y + size / 2}" stroke="${color}" stroke-width="2" />
      <circle cx="${x + size / 2}" cy="${y + size / 2}" r="3" fill="${color}" stroke="white" stroke-width="1" />`;
    case 'rect':
    default:
      return `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${color}" stroke="#333" stroke-width="1" />`;
  }
}

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
