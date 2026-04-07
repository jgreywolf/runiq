import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import {
  calculateRectangularAnchors,
  extractBasicStyles,
} from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

function getMeasuredBounds(
  ctx: ShapeRenderContext,
  options: {
    minWidth: number;
    minHeight: number;
    widthPadding?: number;
    heightPadding?: number;
  }
) {
  const text = ctx.node.label || ctx.node.id;
  const measured = ctx.measureText(text, ctx.style);
  return {
    width: Math.max(
      measured.width + (options.widthPadding ?? 28),
      options.minWidth
    ),
    height: Math.max(
      measured.height + (options.heightPadding ?? 20),
      options.minHeight
    ),
  };
}

function getContainerBounds(
  ctx: ShapeRenderContext,
  fallback: { width: number; height: number }
) {
  const data = ctx.node.data as Record<string, unknown> | undefined;
  const width = typeof data?.width === 'number' ? data.width : fallback.width;
  const height =
    typeof data?.height === 'number' ? data.height : fallback.height;
  return { width, height };
}

export const wbsShape: ShapeDefinition = {
  id: 'wbs',

  bounds(ctx) {
    return getContainerBounds(ctx, { width: 420, height: 260 });
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const labelText = ctx.node.label || ctx.node.id;
    const measured = ctx.measureText(labelText, ctx.style);
    const titleWidth = Math.max(measured.width + 34, 148);
    const titleHeight = 28;
    const titleX = x + (bounds.width - titleWidth) / 2;
    const titleY = y + 4;
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#dbeafe',
      defaultStroke: '#2563eb',
      defaultStrokeWidth: 1.8,
    });

    return `
      <g class="wbs-root">
        <rect x="${titleX}" y="${titleY}" width="${titleWidth}" height="${titleHeight}" rx="8" ry="8" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        ${renderShapeLabel(
          {
            ...ctx,
            style: {
              ...ctx.style,
              fontWeight: '700',
              color: ctx.style.textColor || '#1e3a8a',
            },
          },
          labelText,
          x + bounds.width / 2,
          titleY + titleHeight / 2 + 1
        )}
      </g>
    `;
  },
};

export const wbsDeliverableShape: ShapeDefinition = {
  id: 'wbsDeliverable',

  bounds(ctx) {
    return getContainerBounds(ctx, { width: 220, height: 120 });
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#dbeafe',
      defaultStroke: '#2563eb',
      defaultStrokeWidth: 1.8,
    });
    const headerHeight = 28;
    const labelText = ctx.node.label || ctx.node.id;
    const headerWidth = Math.max(bounds.width - 18, 132);
    const headerX = x + (bounds.width - headerWidth) / 2;

    return `
      <g class="wbs-deliverable">
        <rect x="${headerX}" y="${y}" width="${headerWidth}" height="${headerHeight}" rx="6" ry="6" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        ${renderShapeLabel(
          {
            ...ctx,
            style: {
              ...ctx.style,
              fontWeight: '700',
              color: ctx.style.textColor || '#1e3a8a',
            },
          },
          labelText,
          x + bounds.width / 2,
          y + headerHeight / 2 + 1
        )}
      </g>
    `;
  },
};

export const wbsWorkPackageShape: ShapeDefinition = {
  id: 'wbsWorkPackage',

  bounds(ctx) {
    return getMeasuredBounds(ctx, {
      minWidth: 128,
      minHeight: 52,
      widthPadding: 34,
      heightPadding: 24,
    });
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#ecfccb',
      defaultStroke: '#4d7c0f',
      defaultStrokeWidth: 1.8,
    });

    return `
      <g class="wbs-work-package">
        <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" rx="6" ry="6" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        ${renderShapeLabel(
          {
            ...ctx,
            style: {
              ...ctx.style,
              fontWeight: '600',
              color: ctx.style.textColor || '#365314',
            },
          },
          ctx.node.label || ctx.node.id,
          x + bounds.width / 2,
          y + bounds.height / 2
        )}
      </g>
    `;
  },
};
