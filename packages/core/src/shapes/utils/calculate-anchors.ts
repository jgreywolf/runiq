import type { ShapeRenderContext } from '../../types/index.js';

/**
 * Standard anchor point interface
 */
export interface Anchor {
  x: number;
  y: number;
  name: string;
}

/**
 * Calculate standard 4-point anchors (top, right, bottom, left) for rectangular shapes.
 * This is the most common anchor pattern across all shapes.
 *
 * @example
 * ```typescript
 * anchors(ctx) {
 *   return calculateRectangularAnchors(ctx, this.bounds(ctx));
 * }
 * ```
 */
export function calculateRectangularAnchors(
  ctx: ShapeRenderContext,
  bounds?: { width: number; height: number }
): Anchor[] {
  const { width: w, height: h } =
    bounds || ctx.measureText(ctx.node.label || '', ctx.style);

  return [
    { x: w / 2, y: 0, name: 'top' },
    { x: w, y: h / 2, name: 'right' },
    { x: w / 2, y: h, name: 'bottom' },
    { x: 0, y: h / 2, name: 'left' },
  ];
}

/**
 * Calculate 8-point anchors (cardinal + diagonal) for shapes requiring more connection points.
 *
 * @example
 * ```typescript
 * anchors(ctx) {
 *   return calculateOctagonalAnchors(ctx, this.bounds(ctx));
 * }
 * ```
 */
export function calculateOctagonalAnchors(
  ctx: ShapeRenderContext,
  bounds: { width: number; height: number }
): Anchor[] {
  const { width: w, height: h } = bounds;

  return [
    { x: w / 2, y: 0, name: 'top' },
    { x: w * 0.85, y: h * 0.15, name: 'top-right' },
    { x: w, y: h / 2, name: 'right' },
    { x: w * 0.85, y: h * 0.85, name: 'bottom-right' },
    { x: w / 2, y: h, name: 'bottom' },
    { x: w * 0.15, y: h * 0.85, name: 'bottom-left' },
    { x: 0, y: h / 2, name: 'left' },
    { x: w * 0.15, y: h * 0.15, name: 'top-left' },
  ];
}

/**
 * Calculate anchors for circular shapes (using angle-based positioning).
 *
 * @param ctx - Shape render context
 * @param bounds - Shape bounds
 * @param points - Number of anchor points (default: 4)
 *
 * @example
 * ```typescript
 * anchors(ctx) {
 *   return calculateCircularAnchors(ctx, this.bounds(ctx), 8);
 * }
 * ```
 */
export function calculateCircularAnchors(
  ctx: ShapeRenderContext,
  bounds: { width: number; height: number },
  points: number = 4
): Anchor[] {
  const { width: w, height: h } = bounds;
  const cx = w / 2;
  const cy = h / 2;
  const rx = w / 2;
  const ry = h / 2;

  const anchors: Anchor[] = [];
  const angleStep = (Math.PI * 2) / points;

  for (let i = 0; i < points; i++) {
    const angle = i * angleStep - Math.PI / 2; // Start at top (0°)
    const x = cx + rx * Math.cos(angle);
    const y = cy + ry * Math.sin(angle);

    const names = ['top', 'right', 'bottom', 'left'];
    const name =
      i < 4 ? names[i] : `angle-${Math.round((angle * 180) / Math.PI)}`;

    anchors.push({ x, y, name });
  }

  return anchors;
}

/**
 * Calculate anchors for diamond/rhombus shapes (rotated rectangle).
 *
 * @example
 * ```typescript
 * anchors(ctx) {
 *   return calculateDiamondAnchors(ctx, this.bounds(ctx));
 * }
 * ```
 */
export function calculateDiamondAnchors(
  ctx: ShapeRenderContext,
  bounds: { width: number; height: number }
): Anchor[] {
  const { width: w, height: h } = bounds;

  return [
    { x: w / 2, y: 0, name: 'top' },
    { x: w, y: h / 2, name: 'right' },
    { x: w / 2, y: h, name: 'bottom' },
    { x: 0, y: h / 2, name: 'left' },
  ];
}

/**
 * Configuration for custom anchor positioning
 */
export interface CustomAnchorConfig {
  /** Relative position (0-1) or absolute pixel value */
  x: number | string;
  /** Relative position (0-1) or absolute pixel value */
  y: number | string;
  /** Anchor name */
  name: string;
}

/**
 * Calculate anchors from custom configuration.
 * Supports both relative (0-1) and absolute pixel positioning.
 *
 * @example
 * ```typescript
 * anchors(ctx) {
 *   const bounds = this.bounds(ctx);
 *   return calculateCustomAnchors(bounds, [
 *     { x: 0.5, y: 0, name: 'top' },
 *     { x: 1, y: 0.5, name: 'right' },
 *     { x: 20, y: 30, name: 'custom' }, // absolute pixels
 *   ]);
 * }
 * ```
 */
export function calculateCustomAnchors(
  bounds: { width: number; height: number },
  configs: CustomAnchorConfig[]
): Anchor[] {
  const { width: w, height: h } = bounds;

  return configs.map((config) => {
    let x: number;
    let y: number;

    // Handle relative (0-1) or absolute positioning
    if (typeof config.x === 'number') {
      x = config.x <= 1 && config.x >= 0 ? config.x * w : config.x;
    } else {
      x = parseFloat(config.x);
    }

    if (typeof config.y === 'number') {
      y = config.y <= 1 && config.y >= 0 ? config.y * h : config.y;
    } else {
      y = parseFloat(config.y);
    }

    return { x, y, name: config.name };
  });
}

/**
 * Calculate anchors for horizontal bar shapes (left and right only).
 *
 * @example
 * ```typescript
 * anchors(ctx) {
 *   return calculateHorizontalBarAnchors(ctx, this.bounds(ctx));
 * }
 * ```
 */
export function calculateHorizontalBarAnchors(
  ctx: ShapeRenderContext,
  bounds: { width: number; height: number }
): Anchor[] {
  const { width: w, height: h } = bounds;

  return [
    { x: 0, y: h / 2, name: 'left' },
    { x: w, y: h / 2, name: 'right' },
  ];
}

/**
 * Calculate anchors for vertical bar shapes (top and bottom only).
 *
 * @example
 * ```typescript
 * anchors(ctx) {
 *   return calculateVerticalBarAnchors(ctx, this.bounds(ctx));
 * }
 * ```
 */
export function calculateVerticalBarAnchors(
  ctx: ShapeRenderContext,
  bounds: { width: number; height: number }
): Anchor[] {
  const { width: w, height: h } = bounds;

  return [
    { x: w / 2, y: 0, name: 'top' },
    { x: w / 2, y: h, name: 'bottom' },
  ];
}

/**
 * Calculate anchors for triangle shapes (top, bottom-left, bottom-right).
 *
 * @example
 * ```typescript
 * anchors(ctx) {
 *   return calculateTriangleAnchors(ctx, this.bounds(ctx));
 * }
 * ```
 */
export function calculateTriangleAnchors(
  ctx: ShapeRenderContext,
  bounds: { width: number; height: number }
): Anchor[] {
  const { width: w, height: h } = bounds;

  return [
    { x: w / 2, y: 0, name: 'top' },
    { x: w, y: h, name: 'right' },
    { x: w / 2, y: h, name: 'bottom' },
    { x: 0, y: h, name: 'left' },
  ];
}
