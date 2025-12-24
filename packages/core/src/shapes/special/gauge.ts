import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import {
  calculateRectangularAnchors,
  extractBasicStyles,
} from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Simple gauge shape (semicircular dial with needle).
 * - Reads numeric value from `node.data.values[0]` (0..100 expected)
 */
export const gaugeShape: ShapeDefinition = {
  id: 'gauge',

  bounds(_ctx: ShapeRenderContext) {
    // Fixed small gauge size suitable for inline diagrams
    return { width: 120, height: 80 };
  },

  anchors(ctx: ShapeRenderContext) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: 'transparent',
      defaultStroke: '#333',
    });

    const cx = x + bounds.width / 2;
    const cy = y + bounds.height * 0.55; // slightly below center to leave room for label
    const radius = Math.min(bounds.width, bounds.height) * 0.4;

    // Read primary numeric value (expect 0..100). Fallback to null.
    const raw = Array.isArray((ctx.node?.data as any)?.values)
      ? (ctx.node?.data as any).values[0]
      : undefined;
    const value = typeof raw === 'number' ? raw : null;

    // Normalize to 0..1 for needle calculation (clamp)
    const normalized =
      value == null ? 0 : Math.max(0, Math.min(1, value / 100));

    // Gauge arc from -90deg (left) to 90deg (right)
    const startDeg = -90;
    const endDeg = 90;

    const startRad = (startDeg * Math.PI) / 180;
    const endRad = (endDeg * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const needleDeg = startDeg + (endDeg - startDeg) * normalized;
    const needleRad = (needleDeg * Math.PI) / 180;
    const nx = cx + radius * Math.cos(needleRad);
    const ny = cy + radius * Math.sin(needleRad);

    // Small ticks (5 ticks inclusive)
    const ticks: string[] = [];
    const TICK_COUNT = 5;
    for (let i = 0; i < TICK_COUNT; i++) {
      const t = i / (TICK_COUNT - 1);
      const ang = startRad + (endRad - startRad) * t;
      const tx1 = cx + (radius - 6) * Math.cos(ang);
      const ty1 = cy + (radius - 6) * Math.sin(ang);
      const tx2 = cx + (radius - 2) * Math.cos(ang);
      const ty2 = cy + (radius - 2) * Math.sin(ang);
      ticks.push(
        `<line x1="${tx1}" y1="${ty1}" x2="${tx2}" y2="${ty2}" stroke="${stroke}" stroke-width="1" />`
      );
    }

    const label = ctx.node.label || ctx.node.id;

    return `
      <!-- Gauge body -->
      <path d="M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}" stroke="${stroke}" stroke-width="${strokeWidth || 2}" fill="none" />
      ${ticks.join('\n      ')}

      <!-- Needle -->
      <line x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}" stroke="${stroke}" stroke-width="${(strokeWidth || 2) + 1}" stroke-linecap="round" />
      <circle cx="${cx}" cy="${cy}" r="3" fill="${stroke}" />

      <!-- Optional numeric value -->
      ${renderShapeLabel(ctx, value != null ? String(value) : '', cx, y + bounds.height - 10)}

      <!-- Shape label -->
      ${renderShapeLabel({ ...ctx, style: { ...ctx.style, fontSize: 11 } }, label, cx, y + 14)}
    `;
  },
};
