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

export const trustBoundaryShape: ShapeDefinition = {
  id: 'trustBoundary',

  bounds(ctx) {
    return getContainerBounds(ctx, { width: 320, height: 220 });
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#f8fafc',
      defaultStroke: '#2563eb',
      defaultStrokeWidth: 2,
    });
    const labelText = ctx.node.label || ctx.node.id;

    return `
      <g class="trust-boundary">
        <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" rx="10" ry="10" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-dasharray="8 6" />
        ${renderShapeLabel(
          {
            ...ctx,
            style: {
              ...ctx.style,
              fontWeight: '700',
              color: ctx.style.textColor || ctx.style.color || stroke,
            },
          },
          labelText,
          x + 16,
          y + 18,
          'start'
        )}
      </g>
    `;
  },
};

export const threatShape: ShapeDefinition = {
  id: 'threat',

  bounds(ctx) {
    return getMeasuredBounds(ctx, {
      minWidth: 132,
      minHeight: 72,
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
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#fee2e2',
      defaultStroke: '#b91c1c',
      defaultStrokeWidth: 2,
    });
    const inset = 12;
    const top = x + bounds.width / 2;
    const right = x + bounds.width - inset;
    const left = x + inset;
    const upper = y + 10;
    const lower = y + bounds.height - 10;
    const midY = y + bounds.height / 2;

    return `
      <g class="threat-shape">
        <polygon points="${top},${y} ${right},${upper} ${right},${lower} ${top},${y + bounds.height} ${left},${lower} ${left},${upper}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        ${renderShapeLabel(
          {
            ...ctx,
            style: {
              ...ctx.style,
              fontWeight: '700',
              color: ctx.style.textColor || ctx.style.color || '#7f1d1d',
            },
          },
          ctx.node.label || ctx.node.id,
          x + bounds.width / 2,
          midY
        )}
      </g>
    `;
  },
};

export const mitigationShape: ShapeDefinition = {
  id: 'mitigation',

  bounds(ctx) {
    return getMeasuredBounds(ctx, {
      minWidth: 146,
      minHeight: 64,
      widthPadding: 40,
      heightPadding: 22,
    });
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#dcfce7',
      defaultStroke: '#15803d',
      defaultStrokeWidth: 2,
    });

    return `
      <g class="mitigation-shape">
        <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" rx="10" ry="10" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        <path d="M ${x + 16} ${y + bounds.height / 2} L ${x + 22} ${y + bounds.height / 2 + 6} L ${x + 32} ${y + bounds.height / 2 - 6}" fill="none" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        ${renderShapeLabel(
          {
            ...ctx,
            style: {
              ...ctx.style,
              fontWeight: '600',
              color: ctx.style.textColor || ctx.style.color || '#14532d',
            },
          },
          ctx.node.label || ctx.node.id,
          x + bounds.width / 2 + 8,
          y + bounds.height / 2
        )}
      </g>
    `;
  },
};

export const securityControlShape: ShapeDefinition = {
  id: 'securityControl',

  bounds(ctx) {
    return getMeasuredBounds(ctx, {
      minWidth: 138,
      minHeight: 72,
      widthPadding: 40,
      heightPadding: 28,
    });
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#dbeafe',
      defaultStroke: '#1d4ed8',
      defaultStrokeWidth: 2,
    });
    const shieldX = x + 14;
    const shieldY = y + 16;

    return `
      <g class="security-control-shape">
        <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" rx="8" ry="8" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        <path d="M ${shieldX} ${shieldY}
                 L ${shieldX + 10} ${shieldY - 4}
                 L ${shieldX + 20} ${shieldY}
                 L ${shieldX + 18} ${shieldY + 14}
                 L ${shieldX + 10} ${shieldY + 20}
                 L ${shieldX + 2} ${shieldY + 14}
                 Z"
              fill="#ffffff" stroke="${stroke}" stroke-width="1.6" />
        ${renderShapeLabel(
          {
            ...ctx,
            style: {
              ...ctx.style,
              fontWeight: '600',
              color: ctx.style.textColor || ctx.style.color || '#1e3a8a',
            },
          },
          ctx.node.label || ctx.node.id,
          x + bounds.width / 2 + 10,
          y + bounds.height / 2
        )}
      </g>
    `;
  },
};
