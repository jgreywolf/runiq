import type { ShapeRenderContext } from '../../types/index.js';
import { renderShapeLabel } from './render-label.js';

/**
 * Style options for rendered text items
 */
export interface CompartmentItemStyle {
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  fontSize?: number;
}

/**
 * Configuration for rendering a single compartment
 */
export interface CompartmentConfig {
  /** Items to render in this compartment */
  items: string[];
  /** Alignment: 'start' for left-aligned, 'middle' for centered */
  align?: 'start' | 'middle';
  /** Additional styling for text */
  style?: CompartmentItemStyle;
  /** Optional custom renderer for each item */
  renderItem?: (
    item: string,
    index: number
  ) => string | { text: string; style?: CompartmentItemStyle };
}

/**
 * Configuration for multi-compartment shape rendering
 */
export interface MultiCompartmentConfig {
  /** Rendering context */
  ctx: ShapeRenderContext;
  /** Top-left position */
  position: { x: number; y: number };
  /** Dimensions */
  bounds: { width: number; height: number };
  /** Line height for text */
  lineHeight: number;
  /** Padding within compartments */
  padding: number;
  /** Compartments to render (in order) */
  compartments: CompartmentConfig[];
  /** Optional header compartment (rendered first without separator) */
  header?: {
    items: string[];
    style?: CompartmentConfig['style'];
  };
}

/**
 * Render a multi-compartment UML shape (class, interface, enum, abstract)
 *
 * This helper provides consistent rendering for shapes with multiple sections
 * separated by horizontal divider lines.
 *
 * @example
 * ```typescript
 * const svg = renderMultiCompartmentShape({
 *   ctx,
 *   position: { x, y },
 *   bounds: { width: 200, height: 150 },
 *   lineHeight: 18,
 *   padding: 12,
 *   header: {
 *     items: ['«interface»', 'IRepository'],
 *     style: { fontWeight: 'bold' }
 *   },
 *   compartments: [
 *     {
 *       items: ['+ save(data): void', '+ load(id): Data'],
 *       align: 'start'
 *     }
 *   ]
 * });
 * ```
 */
export function renderMultiCompartmentShape(
  config: MultiCompartmentConfig
): string {
  const { ctx, position, bounds, lineHeight, padding, compartments, header } =
    config;
  const { x, y } = position;
  const { width, height } = bounds;

  const fill = ctx.style.fill || '#ffffff';
  const stroke = ctx.style.stroke || '#000000';
  const strokeWidth = ctx.style.strokeWidth || 1;
  const fontSize = ctx.style.fontSize || 14;
  const fontFamily =
    typeof ctx.style.fontFamily === 'string' ? ctx.style.fontFamily : 'Arial';

  let svg = '';

  // Main rectangle
  svg += `<rect x="${x}" y="${y}" width="${width}" height="${height}" `;
  svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

  let currentY = y + padding;

  // Render header compartment (no separator before it)
  if (header && header.items.length > 0) {
    for (const item of header.items) {
      currentY += lineHeight * 0.7;

      const style = header.style || {};
      const itemFontSize = style.fontSize || fontSize;

      // Create modified style context for this item
      const itemStyleContext = {
        ...ctx.style,
        fontSize: itemFontSize,
        fontWeight: style.fontWeight,
        fontStyle: style.fontStyle,
        textDecoration: style.textDecoration,
        color: stroke,
      };

      svg += renderShapeLabel(
        { ...ctx, style: itemStyleContext },
        item,
        x + width / 2,
        currentY,
        'middle'
      );

      currentY += lineHeight * 0.3;
    }
  }

  // Render each compartment with separator
  for (const compartment of compartments) {
    if (compartment.items.length === 0) continue;

    // Draw separator line
    svg += `<line x1="${x}" y1="${currentY}" x2="${x + width}" y2="${currentY}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    currentY += padding;

    // Render items in this compartment
    for (let i = 0; i < compartment.items.length; i++) {
      const item = compartment.items[i];
      currentY += lineHeight * 0.7;

      const align = compartment.align || 'start';
      const textX = align === 'middle' ? x + width / 2 : x + padding;

      // Check if custom renderer provided
      let renderedItem = item;
      let itemStyle: CompartmentItemStyle = compartment.style || {};

      if (compartment.renderItem) {
        const result = compartment.renderItem(item, i);
        if (typeof result === 'string') {
          renderedItem = result;
        } else {
          renderedItem = result.text;
          itemStyle = { ...itemStyle, ...result.style };
        }
      }

      const itemFontSize = itemStyle.fontSize || fontSize;

      // Create modified style context for this item
      const itemStyleContext = {
        ...ctx.style,
        fontSize: itemFontSize,
        fontWeight: itemStyle.fontWeight,
        fontStyle: itemStyle.fontStyle,
        textDecoration: itemStyle.textDecoration,
        color: stroke,
      };

      svg += renderShapeLabel(
        { ...ctx, style: itemStyleContext },
        renderedItem,
        textX,
        currentY,
        align
      );

      currentY += lineHeight * 0.3;
    }
  }

  return svg;
}

/**
 * Calculate bounds for a multi-compartment shape
 *
 * @param ctx - Shape rendering context
 * @param config - Configuration for compartments
 * @returns Calculated width and height
 */
export function calculateCompartmentBounds(
  ctx: ShapeRenderContext,
  config: {
    padding: number;
    lineHeight: number;
    minWidth?: number;
    minHeight?: number;
    header?: { items: string[] };
    compartments: { items: string[] }[];
  }
): { width: number; height: number } {
  const { padding, lineHeight, minWidth = 100, minHeight = 60 } = config;

  let maxWidth = 0;
  let totalHeight = padding; // Top padding

  // Measure header items
  if (config.header && config.header.items.length > 0) {
    for (const item of config.header.items) {
      const size = ctx.measureText(item, ctx.style);
      maxWidth = Math.max(maxWidth, size.width);
      totalHeight += lineHeight;
    }
  }

  // Measure compartment items
  for (const compartment of config.compartments) {
    if (compartment.items.length === 0) continue;

    // Add separator space
    totalHeight += 1 + padding;

    for (const item of compartment.items) {
      const size = ctx.measureText(item, ctx.style);
      maxWidth = Math.max(maxWidth, size.width);
      totalHeight += lineHeight;
    }
  }

  totalHeight += padding; // Bottom padding

  const width = Math.max(minWidth, maxWidth + padding * 2);
  const height = Math.max(minHeight, totalHeight);

  return { width, height };
}
