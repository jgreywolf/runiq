import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';

/**
 * Target (Bullseye) Shape
 *
 * Renders concentric circles for target/bullseye diagrams.
 * Used by the target glyphset to show nested priorities or zones.
 *
 * Data format:
 * {
 *   circles: [
 *     { label: string, size: number, color: string, level: number },
 *     ...
 *   ]
 * }
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
export const target: ShapeDefinition = {
  id: 'target',

  bounds: (ctx: ShapeRenderContext): { width: number; height: number } => {
    // Get the outermost (largest) circle size
    const circles = (ctx.node.data?.circles as Array<{ size: number }>) || [];
    if (circles.length === 0) {
      return { width: 200, height: 200 };
    }

    // Find max size
    const maxSize = Math.max(...circles.map((c) => c.size));
    const diameter = maxSize * 2;
    const padding = 40; // Extra padding for labels

    return {
      width: diameter + padding,
      height: diameter + padding,
    };
  },

  anchors: (
    ctx: ShapeRenderContext
  ): { x: number; y: number; name?: string }[] => {
    const bounds = target.bounds(ctx);
    const cx = bounds.width / 2;
    const cy = bounds.height / 2;

    // Anchors at cardinal directions on the outermost circle
    const circles = (ctx.node.data?.circles as Array<{ size: number }>) || [];
    const maxRadius =
      circles.length > 0 ? Math.max(...circles.map((c) => c.size)) : 100;

    return [
      { x: cx, y: cy - maxRadius, name: 'top' }, // Top
      { x: cx + maxRadius, y: cy, name: 'right' }, // Right
      { x: cx, y: cy + maxRadius, name: 'bottom' }, // Bottom
      { x: cx - maxRadius, y: cy, name: 'left' }, // Left
    ];
  },

  render: (
    ctx: ShapeRenderContext,
    position: { x: number; y: number }
  ): string => {
    const circles =
      (ctx.node.data?.circles as Array<{
        label: string;
        size: number;
        color: string;
        level: number;
      }>) || [];

    if (circles.length === 0) {
      return '';
    }

    const bounds = target.bounds(ctx);
    const cx = position.x + bounds.width / 2;
    const cy = position.y + bounds.height / 2;

    const parts: string[] = [];

    // Render circles from largest to smallest (so smallest is on top)
    const sortedCircles = [...circles].sort((a, b) => b.size - a.size);

    sortedCircles.forEach((circle) => {
      const radius = circle.size;
      const fillColor = circle.color || '#f0f0f0';
      const strokeColor = '#333';

      // Circle
      parts.push(`
      <circle 
        cx="${cx}" 
        cy="${cy}" 
        r="${radius}" 
        fill="${fillColor}" 
        stroke="${strokeColor}" 
        stroke-width="2"
        opacity="0.9"
      />`);

      // Label positioning
      // For innermost circle, place at center
      // For other circles, place near the top of the ring
      const isInnermost =
        circle.size === Math.min(...circles.map((c) => c.size));
      const isOutermost =
        circle.size === Math.max(...circles.map((c) => c.size));

      let labelY: number;
      if (isInnermost) {
        labelY = cy; // Center for innermost
      } else if (isOutermost) {
        labelY = cy - radius + 25; // Near top edge for outermost (20px from edge)
      } else {
        labelY = cy - radius * 0.7; // Middle rings
      }

      parts.push(`
      <text 
        x="${cx}" 
        y="${labelY}" 
        text-anchor="middle" 
        dominant-baseline="middle"
        font-family="sans-serif" 
        font-size="14"
        font-weight="500"
        fill="#333"
      >
        ${circle.label}
      </text>`);
    });

    return parts.join('');
  },
};
