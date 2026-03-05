/**
 * Utility functions for glyphset shapes
 * Reduces boilerplate and ensures consistency across shapes
 */

import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';
import type { ShapeRenderContext } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Options for creating standard 4-point anchors
 */
export interface AnchorOptions {
  width: number;
  height: number;
  /** Use 'id' instead of 'name' for anchor property */
  useId?: boolean;
}

/**
 * Create standard 4-point anchors (north, south, east, west)
 * This is the most common anchor pattern for glyphset shapes
 *
 * @param options - Width, height, and optional useId flag
 * @returns Array of 4 anchor points (top, right, bottom, left)
 */
export function createStandardAnchors(
  options: AnchorOptions
): { x: number; y: number; name?: string; id?: string }[] {
  const { width, height, useId = false } = options;
  const prop = useId ? 'id' : 'name';
  return [
    { x: width / 2, y: 0, [prop]: 'top' },
    { x: width, y: height / 2, [prop]: 'right' },
    { x: width / 2, y: height, [prop]: 'bottom' },
    { x: 0, y: height / 2, [prop]: 'left' },
  ];
}

/**
 * Options for rendering empty state
 */
export interface EmptyStateOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  message?: string;
}

/**
 * Render a consistent empty state placeholder
 * Used when glyphset has no data/items
 */
export function renderEmptyState(
  options: EmptyStateOptions,
  ctx?: ShapeRenderContext
): string {
  const { x, y, width, height, message = 'No items' } = options;

  if (ctx) {
    const msgCtx = {
      ...ctx,
      style: { fontSize: 14, fontFamily: 'sans-serif', color: '#999' },
    };
    return `<rect x="${x}" y="${y}" width="${width}" height="${height}" 
                  fill="#f9f9f9" stroke="#ccc" stroke-width="1" rx="4" />
            ${renderShapeLabel(msgCtx, message, x + width / 2, y + height / 2, 'middle', 'middle')}`;
  }

  // Fallback for when ctx is not provided (keep manual for backwards compat)
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" 
                fill="#f9f9f9" stroke="#ccc" stroke-width="1" rx="4" />
          <text x="${x + width / 2}" y="${y + height / 2}" 
                text-anchor="middle" dominant-baseline="middle" 
                fill="#999" font-family="sans-serif" font-size="14">
            ${message}
          </text>`;
}

/**
 * Extract items array from node data
 * Handles multiple common data formats
 */
export function extractItems(data: unknown): string[] {
  if (!data || typeof data !== 'object') {
    return [];
  }

  const dataObj = data as Record<string, unknown>;

  // Try common property names
  if (Array.isArray(dataObj.items)) {
    return dataObj.items as string[];
  }
  if (Array.isArray(dataObj.labels)) {
    return dataObj.labels as string[];
  }
  if (Array.isArray(dataObj.values)) {
    // Convert to strings if needed
    return (dataObj.values as unknown[]).map((v) =>
      typeof v === 'string' ? v : String(v)
    );
  }

  // Handle data as array directly
  if (Array.isArray(data)) {
    return (data as unknown[]).map((v) =>
      typeof v === 'string' ? v : String(v)
    );
  }

  return [];
}

/**
 * Extract theme configuration from node data
 */
export interface ThemeConfig {
  themeId: string;
  theme: ReturnType<typeof getGlyphsetTheme>;
  colors: string[];
}

/**
 * Get theme configuration from context
 * Falls back to 'professional' theme if not specified
 */
export function extractTheme(ctx: ShapeRenderContext): ThemeConfig {
  const themeId = (ctx.node.data?.theme as string) || 'professional';
  const theme = getGlyphsetTheme(themeId);

  // Extract custom colors if provided
  let colors: string[] = [];
  if (ctx.node.data?.colors && Array.isArray(ctx.node.data.colors)) {
    colors = ctx.node.data.colors as string[];
  }

  return {
    themeId,
    theme,
    colors: colors.length > 0 ? colors : theme.colors,
  };
}

/**
 * Get theme color for specific index
 */
export function getThemeColorAtIndex(
  ctx: ShapeRenderContext,
  index: number
): string {
  const { themeId } = extractTheme(ctx);
  const theme = getGlyphsetTheme(themeId);
  return getThemeColor(theme, index);
}

/**
 * Extract style properties from context with defaults
 */
export interface StyleConfig {
  strokeWidth: number;
  fontSize: number;
  font: string;
  fill?: string;
  stroke?: string;
}

/**
 * Extract commonly used style properties from context
 */
export function extractStyle(ctx: ShapeRenderContext): StyleConfig {
  return {
    strokeWidth: ctx.style.strokeWidth || 2,
    fontSize: ctx.style.fontSize || 14,
    font: ctx.style.font || 'sans-serif',
    fill: ctx.style.fill,
    stroke: ctx.style.stroke,
  };
}

/**
 * Calculate maximum text width from an array of items
 * Useful for sizing list-based shapes
 */
export function calculateMaxTextWidth(
  items: string[],
  ctx: ShapeRenderContext,
  minWidth = 0
): number {
  let maxWidth = minWidth;
  for (const item of items) {
    const textSize = ctx.measureText(item, ctx.style);
    maxWidth = Math.max(maxWidth, textSize.width);
  }
  return maxWidth;
}

/**
 * Options for creating a list-based shape bounds
 */
export interface ListBoundsOptions {
  items: string[];
  ctx: ShapeRenderContext;
  itemHeight: number;
  itemSpacing: number;
  horizontalPadding?: number;
  verticalPadding?: number;
  minWidth?: number;
  minHeight?: number;
  direction?: 'vertical' | 'horizontal';
}

/**
 * Calculate bounds for a simple list-based shape
 * Covers the common case of vertically or horizontally stacked items
 */
export function calculateListBounds(options: ListBoundsOptions): {
  width: number;
  height: number;
} {
  const {
    items,
    ctx,
    itemHeight,
    itemSpacing,
    horizontalPadding = 20,
    verticalPadding = 20,
    minWidth = 200,
    minHeight = 100,
    direction = 'vertical',
  } = options;

  if (items.length === 0) {
    return { width: minWidth, height: minHeight };
  }

  const maxTextWidth = calculateMaxTextWidth(items, ctx);
  const itemWidth = maxTextWidth + horizontalPadding * 2;

  if (direction === 'vertical') {
    const width = Math.max(itemWidth, minWidth);
    const height = Math.max(
      items.length * itemHeight + (items.length - 1) * itemSpacing,
      minHeight
    );
    return { width, height: height + verticalPadding * 2 };
  } else {
    // horizontal
    const width = Math.max(
      items.length * itemWidth + (items.length - 1) * itemSpacing,
      minWidth
    );
    const height = Math.max(itemHeight, minHeight);
    return { width: width + horizontalPadding * 2, height };
  }
}

/**
 * Type guard to check if data is an object
 */
export function isDataObject(data: unknown): data is Record<string, unknown> {
  return typeof data === 'object' && data !== null && !Array.isArray(data);
}

/**
 * Safely extract a string property from data
 */
export function extractStringProp(
  data: unknown,
  key: string,
  defaultValue = ''
): string {
  if (!isDataObject(data)) return defaultValue;
  const value = data[key];
  return typeof value === 'string' ? value : defaultValue;
}

/**
 * Safely extract a number property from data
 */
export function extractNumberProp(
  data: unknown,
  key: string,
  defaultValue = 0
): number {
  if (!isDataObject(data)) return defaultValue;
  const value = data[key];
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
}

/**
 * Safely extract a boolean property from data
 */
export function extractBooleanProp(
  data: unknown,
  key: string,
  defaultValue = false
): boolean {
  if (!isDataObject(data)) return defaultValue;
  const value = data[key];
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  return defaultValue;
}
