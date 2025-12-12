import type { ShapeRenderContext } from '../../types/index.js';

/**
 * Common style properties extracted with defaults
 */
export interface ExtractedStyles {
  fill: string;
  stroke: string;
  strokeWidth: number;
  fontSize: number;
  fontFamily: string;
  fontWeight?: string;
  opacity?: number;
}

/**
 * Options for customizing style defaults
 */
export interface StyleExtractionOptions {
  /** Default fill color (default: '#f0f0f0') */
  defaultFill?: string;
  /** Default stroke color (default: '#333') */
  defaultStroke?: string;
  /** Default stroke width (default: 1) */
  defaultStrokeWidth?: number;
  /** Default font size (default: 14) */
  defaultFontSize?: number;
  /** Default font family (default: 'Arial, sans-serif') */
  defaultFontFamily?: string;
}

/**
 * Extracts commonly used style properties from ShapeRenderContext with sensible defaults.
 * Eliminates repetitive `const fill = ctx.style.fill || '#default'` patterns across shapes.
 *
 * @example
 * ```typescript
 * // Basic usage with defaults
 * const styles = extractStyles(ctx);
 * // Returns: { fill: '#f0f0f0', stroke: '#333', strokeWidth: 1, ... }
 *
 * // Custom defaults
 * const styles = extractStyles(ctx, {
 *   defaultFill: '#ffffff',
 *   defaultStroke: '#000000'
 * });
 * ```
 *
 * @param ctx - Shape render context containing style information
 * @param options - Optional custom defaults for style properties
 * @returns Object containing extracted style properties with defaults applied
 */
export function extractStyles(
  ctx: ShapeRenderContext,
  options: StyleExtractionOptions = {}
): ExtractedStyles {
  const {
    defaultFill = '#f0f0f0',
    defaultStroke = '#333',
    defaultStrokeWidth = 1,
    defaultFontSize = 14,
    defaultFontFamily = 'Arial, sans-serif',
  } = options;

  return {
    fill: ctx.style.fill || defaultFill,
    stroke: ctx.style.stroke || defaultStroke,
    strokeWidth: ctx.style.strokeWidth ?? defaultStrokeWidth,
    fontSize: ctx.style.fontSize ?? defaultFontSize,
    fontFamily: ctx.style.fontFamily || ctx.style.font || defaultFontFamily,
    fontWeight: ctx.style.fontWeight,
    opacity: ctx.style.opacity,
  };
}

/**
 * Extracts basic shape styles (fill, stroke, strokeWidth only).
 * Use this for simple shapes that don't need text rendering.
 *
 * @example
 * ```typescript
 * const { fill, stroke, strokeWidth } = extractBasicStyles(ctx);
 * ```
 */
export function extractBasicStyles(
  ctx: ShapeRenderContext,
  options: Pick<
    StyleExtractionOptions,
    'defaultFill' | 'defaultStroke' | 'defaultStrokeWidth'
  > = {}
): Pick<ExtractedStyles, 'fill' | 'stroke' | 'strokeWidth'> {
  const {
    defaultFill = '#f0f0f0',
    defaultStroke = '#333',
    defaultStrokeWidth = 1,
  } = options;

  return {
    fill: ctx.style.fill || defaultFill,
    stroke: ctx.style.stroke || defaultStroke,
    strokeWidth: ctx.style.strokeWidth ?? defaultStrokeWidth,
  };
}

/**
 * Extracts text-related styles only.
 * Use this when you only need typography properties.
 *
 * @example
 * ```typescript
 * const { fontSize, fontFamily, fontWeight } = extractTextStyles(ctx);
 * ```
 */
export function extractTextStyles(
  ctx: ShapeRenderContext,
  options: Pick<
    StyleExtractionOptions,
    'defaultFontSize' | 'defaultFontFamily'
  > = {}
): Pick<ExtractedStyles, 'fontSize' | 'fontFamily' | 'fontWeight'> {
  const { defaultFontSize = 14, defaultFontFamily = 'Arial, sans-serif' } =
    options;

  return {
    fontSize: ctx.style.fontSize ?? defaultFontSize,
    fontFamily: ctx.style.fontFamily || ctx.style.font || defaultFontFamily,
    fontWeight: ctx.style.fontWeight,
  };
}
