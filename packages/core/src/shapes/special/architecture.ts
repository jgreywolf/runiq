import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import {
  calculateRectangularAnchors,
  extractBasicStyles,
} from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

function getMeasuredBounds(
  ctx: ShapeRenderContext,
  options: { minWidth: number; minHeight: number; widthPadding?: number; heightPadding?: number }
) {
  const text = ctx.node.label || '';
  const measured = ctx.measureText(text, ctx.style);
  return {
    width: Math.max(measured.width + (options.widthPadding ?? 28), options.minWidth),
    height: Math.max(measured.height + (options.heightPadding ?? 20), options.minHeight),
  };
}

function getContainerBounds(
  ctx: ShapeRenderContext,
  fallback: { width: number; height: number }
) {
  const data = ctx.node.data as Record<string, unknown> | undefined;
  const width = typeof data?.width === 'number' ? data.width : fallback.width;
  const height = typeof data?.height === 'number' ? data.height : fallback.height;
  return { width, height };
}

export const architectureLayerShape: ShapeDefinition = {
  id: 'architectureLayer',

  bounds(ctx) {
    return getContainerBounds(ctx, { width: 720, height: 180 });
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const {
      fill,
      stroke,
      strokeWidth,
      strokeDasharray,
    } = extractBasicStyles(ctx, {
      defaultFill: '#e6eefc',
      defaultStroke: '#36558f',
      defaultStrokeWidth: 2,
    });
    const labelBandHeight = 34;
    const bandFill = (ctx.node.data as any)?.headerFill || '#d7e3fb';
    const dashAttr = strokeDasharray
      ? ` stroke-dasharray="${strokeDasharray}"`
      : '';

    const labelSvg = ctx.node.label
      ? renderShapeLabel(
          {
            ...ctx,
            style: {
              ...ctx.style,
              fontSize: ctx.style.fontSize || 18,
              fontWeight: '700',
              color: ctx.style.textColor || ctx.style.color || '#1f2937',
            },
          },
          ctx.node.label,
          x + 18,
          y + labelBandHeight / 2 + 1,
          'start'
        )
      : '';

    return `
      <g class="architecture-layer">
        <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" rx="10" ry="10" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"${dashAttr} />
        <rect x="${x}" y="${y}" width="${bounds.width}" height="${labelBandHeight}" rx="10" ry="10" fill="${bandFill}" stroke="${stroke}" stroke-width="${strokeWidth}"${dashAttr} />
        <line x1="${x}" y1="${y + labelBandHeight}" x2="${x + bounds.width}" y2="${y + labelBandHeight}" stroke="${stroke}" stroke-width="${strokeWidth}"${dashAttr} />
        ${labelSvg}
      </g>
    `;
  },
};

export const subsystemBlockShape: ShapeDefinition = {
  id: 'subsystemBlock',

  bounds(ctx) {
    return getMeasuredBounds(ctx, {
      minWidth: 140,
      minHeight: 72,
      widthPadding: 36,
      heightPadding: 30,
    });
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const {
      fill,
      stroke,
      strokeWidth,
      strokeDasharray,
    } = extractBasicStyles(ctx, {
      defaultFill: '#ffffff',
      defaultStroke: '#1f2937',
      defaultStrokeWidth: 2,
    });
    const dashAttr = strokeDasharray
      ? ` stroke-dasharray="${strokeDasharray}"`
      : '';
    const labelSvg = renderShapeLabel(
      {
        ...ctx,
        style: {
          ...ctx.style,
          fontWeight: ctx.style.fontWeight || '600',
          color: ctx.style.textColor || ctx.style.color || '#111827',
        },
      },
      ctx.node.label || ctx.node.id,
      x + bounds.width / 2,
      y + bounds.height / 2
    );

    return `
      <g class="subsystem-block">
        <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" rx="6" ry="6" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"${dashAttr} />
        ${labelSvg}
      </g>
    `;
  },
};

export const platformBlockShape: ShapeDefinition = {
  id: 'platformBlock',

  bounds(ctx) {
    return getMeasuredBounds(ctx, {
      minWidth: 180,
      minHeight: 62,
      widthPadding: 42,
      heightPadding: 22,
    });
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const {
      fill,
      stroke,
      strokeWidth,
      strokeDasharray,
    } = extractBasicStyles(ctx, {
      defaultFill: '#e5e7eb',
      defaultStroke: '#374151',
      defaultStrokeWidth: 2,
    });
    const dashAttr = strokeDasharray
      ? ` stroke-dasharray="${strokeDasharray}"`
      : '';
    const labelSvg = renderShapeLabel(
      {
        ...ctx,
        style: {
          ...ctx.style,
          fontWeight: ctx.style.fontWeight || '700',
          color: ctx.style.textColor || ctx.style.color || '#111827',
        },
      },
      ctx.node.label || ctx.node.id,
      x + bounds.width / 2,
      y + bounds.height / 2
    );

    return `
      <g class="platform-block">
        <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"${dashAttr} />
        ${labelSvg}
      </g>
    `;
  },
};

export const externalSystemBlockShape: ShapeDefinition = {
  id: 'externalSystemBlock',

  bounds(ctx) {
    return getMeasuredBounds(ctx, {
      minWidth: 160,
      minHeight: 70,
      widthPadding: 32,
      heightPadding: 28,
    });
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const {
      fill,
      stroke,
      strokeWidth,
      strokeDasharray,
    } = extractBasicStyles(ctx, {
      defaultFill: '#8b4513',
      defaultStroke: '#6b2f08',
      defaultStrokeWidth: 2,
    });
    const dashAttr = strokeDasharray
      ? ` stroke-dasharray="${strokeDasharray}"`
      : '';
    const labelSvg = renderShapeLabel(
      {
        ...ctx,
        style: {
          ...ctx.style,
          fontWeight: ctx.style.fontWeight || '700',
          color: ctx.style.textColor || '#ffffff',
        },
      },
      ctx.node.label || ctx.node.id,
      x + bounds.width / 2,
      y + bounds.height / 2
    );

    return `
      <g class="external-system-block">
        <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" rx="4" ry="4" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"${dashAttr} />
        ${labelSvg}
      </g>
    `;
  },
};
