import { ShapeDefaults } from '../../constants.js';
import type { ShapeRenderContext } from '../../types/index.js';

/**
 * Standard dimensions type for shape bounds
 */
export interface Dimensions {
  width: number;
  height: number;
}

/**
 * Configuration for simple text-based bounds calculation
 */
export interface SimpleBoundsConfig {
  /** Default label text if node.label is empty */
  defaultLabel?: string;
  /** Padding multiplier for width (default: 2) */
  widthPaddingMultiplier?: number;
  /** Padding multiplier for height (default: 2) */
  heightPaddingMultiplier?: number;
  /** Minimum width */
  minWidth?: number;
  /** Minimum height */
  minHeight?: number;
  /** Additional width to add */
  extraWidth?: number;
  /** Additional height to add */
  extraHeight?: number;
  /** Maximum text width before labels wrap */
  maxTextWidth?: number;
  /** Whether long labels should wrap (default: true) */
  wrap?: boolean;
}

const WRAPPED_LABEL_KEY = '__runiqWrappedLabel';
const WRAPPED_LABEL_SOURCE_KEY = '__runiqWrappedLabelSource';
const DEFAULT_MAX_TEXT_WIDTH = 180;

function getLineHeight(ctx: ShapeRenderContext): number {
  return (ctx.style.fontSize || 14) * 1.2;
}

function setWrappedLabel(
  ctx: ShapeRenderContext,
  label: string,
  lines: string[]
) {
  if (!ctx.node.data) {
    ctx.node.data = {};
  }

  const data = ctx.node.data as Record<string, unknown>;
  if (lines.length > 1) {
    data[WRAPPED_LABEL_KEY] = lines.join('\n');
    data[WRAPPED_LABEL_SOURCE_KEY] = label;
  } else {
    delete data[WRAPPED_LABEL_KEY];
    delete data[WRAPPED_LABEL_SOURCE_KEY];
  }
}

function splitLongWord(
  ctx: ShapeRenderContext,
  word: string,
  maxTextWidth: number
): string[] {
  const parts: string[] = [];
  let current = '';

  for (const char of word) {
    const candidate = `${current}${char}`;
    if (current && ctx.measureText(candidate, ctx.style).width > maxTextWidth) {
      parts.push(current);
      current = char;
    } else {
      current = candidate;
    }
  }

  if (current) {
    parts.push(current);
  }

  return parts;
}

function wrapSegment(
  ctx: ShapeRenderContext,
  segment: string,
  maxTextWidth: number
): string[] {
  if (!segment) {
    return [''];
  }

  const words = segment.trim().split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    if (ctx.measureText(word, ctx.style).width > maxTextWidth) {
      if (current) {
        lines.push(current);
        current = '';
      }
      lines.push(...splitLongWord(ctx, word, maxTextWidth));
      continue;
    }

    const candidate = current ? `${current} ${word}` : word;
    if (current && ctx.measureText(candidate, ctx.style).width > maxTextWidth) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines.length > 0 ? lines : [''];
}

function wrapLabel(
  ctx: ShapeRenderContext,
  label: string,
  maxTextWidth: number
): string[] {
  return label
    .split('\n')
    .flatMap((segment) => wrapSegment(ctx, segment, maxTextWidth));
}

/**
 * Calculate bounds for simple shapes with a single text label and padding.
 * This is the most common pattern across all shapes.
 *
 * @example
 * ```typescript
 * bounds(ctx) {
 *   return calculateSimpleBounds(ctx, { minWidth: 100, minHeight: 50 });
 * }
 * ```
 */
export function calculateSimpleBounds(
  ctx: ShapeRenderContext,
  config: SimpleBoundsConfig = {}
): Dimensions {
  const {
    defaultLabel,
    widthPaddingMultiplier = 2,
    heightPaddingMultiplier = 2,
    minWidth,
    minHeight,
    extraWidth = 0,
    extraHeight = 0,
    maxTextWidth: configuredMaxTextWidth,
    wrap = true,
  } = config;

  const padding = ctx.style.padding ?? ShapeDefaults.PADDING;
  const label = ctx.node.label || defaultLabel || ctx.node.id;
  const maxTextWidth =
    configuredMaxTextWidth ?? ctx.style.maxTextWidth ?? DEFAULT_MAX_TEXT_WIDTH;
  const lines = wrap ? wrapLabel(ctx, label, maxTextWidth) : label.split('\n');
  setWrappedLabel(ctx, label, lines);

  let maxLineWidth = 0;
  let maxLineHeight = 0;
  for (const line of lines) {
    const textSize = ctx.measureText(line, ctx.style);
    maxLineWidth = Math.max(maxLineWidth, textSize.width);
    maxLineHeight = Math.max(maxLineHeight, textSize.height);
  }
  const textHeight =
    lines.length > 1
      ? lines.length * Math.max(getLineHeight(ctx), maxLineHeight)
      : maxLineHeight;

  let width = maxLineWidth + padding * widthPaddingMultiplier + extraWidth;
  let height = textHeight + padding * heightPaddingMultiplier + extraHeight;

  if (minWidth !== undefined) {
    width = Math.max(width, minWidth);
  }
  if (minHeight !== undefined) {
    height = Math.max(height, minHeight);
  }

  return { width, height };
}

/**
 * Configuration for fixed-size bounds (shapes that don't scale with text)
 */
export interface FixedBoundsConfig {
  /** Fixed width */
  width: number;
  /** Fixed height */
  height: number;
}

/**
 * Calculate bounds for shapes with fixed dimensions (like initial/final state nodes).
 *
 * @example
 * ```typescript
 * bounds() {
 *   return calculateFixedBounds({ width: 18, height: 18 });
 * }
 * ```
 */
export function calculateFixedBounds(config: FixedBoundsConfig): Dimensions {
  return { width: config.width, height: config.height };
}

/**
 * Configuration for multi-line text bounds
 */
export interface MultiLineBoundsConfig {
  /** Array of text lines or single label */
  lines?: string[];
  /** Line height (defaults to fontSize + 4) */
  lineHeight?: number;
  /** Padding multiplier for width (default: 2) */
  widthPaddingMultiplier?: number;
  /** Padding multiplier for height (default: 2) */
  heightPaddingMultiplier?: number;
  /** Minimum width */
  minWidth?: number;
  /** Minimum height */
  minHeight?: number;
}

/**
 * Calculate bounds for shapes with multi-line text (like notes, comments).
 *
 * @example
 * ```typescript
 * bounds(ctx) {
 *   const lines = ctx.node.data?.lines || [ctx.node.label || ''];
 *   return calculateMultiLineBounds(ctx, { lines, minWidth: 100, minHeight: 60 });
 * }
 * ```
 */
export function calculateMultiLineBounds(
  ctx: ShapeRenderContext,
  config: MultiLineBoundsConfig = {}
): Dimensions {
  const {
    lines: providedLines,
    lineHeight: customLineHeight,
    widthPaddingMultiplier = 2,
    heightPaddingMultiplier = 2,
    minWidth,
    minHeight,
  } = config;

  const padding = ctx.style.padding ?? ShapeDefaults.PADDING;
  const fontSize = ctx.style.fontSize || 14;
  const lineHeight = customLineHeight ?? fontSize + 4;

  const lines = providedLines || [ctx.node.label || ''];

  // Find longest line
  let maxWidth = 0;
  lines.forEach((line) => {
    const lineSize = ctx.measureText(line, ctx.style);
    maxWidth = Math.max(maxWidth, lineSize.width);
  });

  let width = maxWidth + padding * widthPaddingMultiplier;
  let height = padding * heightPaddingMultiplier + lines.length * lineHeight;

  if (minWidth !== undefined) {
    width = Math.max(width, minWidth);
  }
  if (minHeight !== undefined) {
    height = Math.max(height, minHeight);
  }

  return { width, height };
}

/**
 * Configuration for aspect ratio based bounds
 */
export interface AspectRatioBoundsConfig {
  /** Aspect ratio (width / height) */
  aspectRatio: number;
  /** Base size (will be applied to the smaller dimension) */
  baseSize?: number;
  /** Minimum width */
  minWidth?: number;
  /** Minimum height */
  minHeight?: number;
  /** Whether to fit text inside the shape */
  fitText?: boolean;
}

/**
 * Calculate bounds maintaining a specific aspect ratio (useful for circles, diamonds, etc).
 *
 * @example
 * ```typescript
 * bounds(ctx) {
 *   // Square with 1:1 aspect ratio
 *   return calculateAspectRatioBounds(ctx, { aspectRatio: 1, fitText: true });
 * }
 * ```
 */
export function calculateAspectRatioBounds(
  ctx: ShapeRenderContext,
  config: AspectRatioBoundsConfig
): Dimensions {
  const {
    aspectRatio,
    baseSize,
    minWidth,
    minHeight,
    fitText = false,
  } = config;

  const padding = ctx.style.padding ?? ShapeDefaults.PADDING;
  let width: number;
  let height: number;

  if (fitText) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const textWidth = textSize.width + padding * 2;
    const textHeight = textSize.height + padding * 2;

    if (aspectRatio > 1) {
      // Width-dominant (e.g., ellipse)
      height = Math.max(textHeight, baseSize || 0);
      width = height * aspectRatio;
      width = Math.max(width, textWidth);
    } else {
      // Height-dominant or square
      width = Math.max(textWidth, baseSize || 0);
      height = width / aspectRatio;
      height = Math.max(height, textHeight);
    }
  } else {
    // Fixed aspect ratio without text consideration
    if (baseSize) {
      if (aspectRatio >= 1) {
        height = baseSize;
        width = height * aspectRatio;
      } else {
        width = baseSize;
        height = width / aspectRatio;
      }
    } else {
      width = minWidth || 100;
      height = width / aspectRatio;
    }
  }

  if (minWidth !== undefined) {
    width = Math.max(width, minWidth);
  }
  if (minHeight !== undefined) {
    height = Math.max(height, minHeight);
  }

  return { width, height };
}

/**
 * Configuration for bounds with multiple text measurements
 */
export interface MultiTextBoundsConfig {
  /** Array of text strings to measure */
  texts: string[];
  /** How to combine measurements: 'max-width' | 'sum-width' | 'max-height' | 'sum-height' */
  combineMode: 'max-width' | 'sum-width' | 'max-height' | 'sum-height';
  /** Padding multiplier for width (default: 2) */
  widthPaddingMultiplier?: number;
  /** Padding multiplier for height (default: 2) */
  heightPaddingMultiplier?: number;
  /** Minimum width */
  minWidth?: number;
  /** Minimum height */
  minHeight?: number;
  /** Extra spacing between texts */
  spacing?: number;
}

/**
 * Calculate bounds for shapes with multiple text elements (like stereotypes + label).
 *
 * @example
 * ```typescript
 * bounds(ctx) {
 *   const texts = [stereotype, ctx.node.label];
 *   return calculateMultiTextBounds(ctx, {
 *     texts,
 *     combineMode: 'max-width',
 *     spacing: 4
 *   });
 * }
 * ```
 */
export function calculateMultiTextBounds(
  ctx: ShapeRenderContext,
  config: MultiTextBoundsConfig
): Dimensions {
  const {
    texts,
    combineMode,
    widthPaddingMultiplier = 2,
    heightPaddingMultiplier = 2,
    minWidth,
    minHeight,
    spacing = 0,
  } = config;

  const padding = ctx.style.padding ?? ShapeDefaults.PADDING;

  const measurements = texts.map((text) => ctx.measureText(text, ctx.style));

  let width = 0;
  let height = 0;

  switch (combineMode) {
    case 'max-width':
      width = Math.max(...measurements.map((m) => m.width));
      height =
        measurements.reduce((sum, m) => sum + m.height, 0) +
        spacing * (measurements.length - 1);
      break;

    case 'sum-width':
      width =
        measurements.reduce((sum, m) => sum + m.width, 0) +
        spacing * (measurements.length - 1);
      height = Math.max(...measurements.map((m) => m.height));
      break;

    case 'max-height':
      width =
        measurements.reduce((sum, m) => sum + m.width, 0) +
        spacing * (measurements.length - 1);
      height = Math.max(...measurements.map((m) => m.height));
      break;

    case 'sum-height':
      width = Math.max(...measurements.map((m) => m.width));
      height =
        measurements.reduce((sum, m) => sum + m.height, 0) +
        spacing * (measurements.length - 1);
      break;
  }

  width += padding * widthPaddingMultiplier;
  height += padding * heightPaddingMultiplier;

  if (minWidth !== undefined) {
    width = Math.max(width, minWidth);
  }
  if (minHeight !== undefined) {
    height = Math.max(height, minHeight);
  }

  return { width, height };
}
