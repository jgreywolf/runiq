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

function renderFolderGlyph(x: number, y: number, fill: string, stroke: string, strokeWidth: number) {
  return `
    <path d="M ${x} ${y + 7}
             L ${x + 10} ${y + 7}
             L ${x + 14} ${y + 12}
             L ${x + 22} ${y + 12}
             L ${x + 22} ${y + 24}
             L ${x} ${y + 24}
             Z"
          fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
    <path d="M ${x} ${y + 7}
             L ${x + 10} ${y + 7}
             L ${x + 13} ${y + 11}
             L ${x + 22} ${y + 11}"
          fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />
  `;
}

function renderTreeChevron(
  x: number,
  y: number,
  stroke: string,
  collapsed: boolean
) {
  const path = collapsed
    ? `M ${x} ${y} L ${x + 6} ${y + 5} L ${x} ${y + 10}`
    : `M ${x} ${y + 2} L ${x + 5} ${y + 8} L ${x + 10} ${y + 2}`;

  return `<path d="${path}" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`;
}

function renderFileGlyph(x: number, y: number, fill: string, stroke: string, strokeWidth: number) {
  return `
    <path d="M ${x} ${y}
             L ${x + 14} ${y}
             L ${x + 20} ${y + 6}
             L ${x + 20} ${y + 24}
             L ${x} ${y + 24}
             Z"
          fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
    <path d="M ${x + 14} ${y}
             L ${x + 14} ${y + 6}
             L ${x + 20} ${y + 6}"
          fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />
    <line x1="${x + 4}" y1="${y + 11}" x2="${x + 16}" y2="${y + 11}" stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth - 0.4)}" />
    <line x1="${x + 4}" y1="${y + 15}" x2="${x + 16}" y2="${y + 15}" stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth - 0.4)}" />
  `;
}

export const fileTreeShape: ShapeDefinition = {
  id: 'fileTree',

  bounds(ctx) {
    return getContainerBounds(ctx, { width: 420, height: 260 });
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const { fill, stroke, strokeWidth, strokeDasharray } = extractBasicStyles(ctx, {
      defaultFill: '#fbfcfe',
      defaultStroke: '#94a3b8',
      defaultStrokeWidth: 1.5,
    });
    const dashAttr = strokeDasharray ? ` stroke-dasharray="${strokeDasharray}"` : '';
    const labelText = ctx.node.label || ctx.node.id;

    return `
      <g class="file-tree-root">
        <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"${dashAttr} />
        ${renderFolderGlyph(x + 12, y + 4, '#fcd34d', '#111827', 1.2)}
        ${renderShapeLabel(
          {
            ...ctx,
            style: {
              ...ctx.style,
              fontWeight: '700',
              color: ctx.style.textColor || '#0f172a',
            },
          },
          labelText,
          x + 52,
          y + 18,
          'start'
        )}
      </g>
    `;
  },
};

export const folderShape: ShapeDefinition = {
  id: 'folder',

  bounds(ctx) {
    return getMeasuredBounds(ctx, {
      minWidth: 96,
      minHeight: 26,
      widthPadding: 34,
      heightPadding: 10,
    });
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const { stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultStroke: '#111827',
      defaultStrokeWidth: 1.2,
    });
    const data = ctx.node.data as Record<string, unknown> | undefined;
    const hasChildren = data?.hasChildren === true;
    const collapsed = data?.collapsed === true;
    const labelText = ctx.node.label || ctx.node.id;
    const iconX = x + (hasChildren ? 22 : 10);
    const iconY = y - 2;

    return `
      <g class="file-tree-folder">
        ${hasChildren ? renderTreeChevron(x + 8, y + 7, '#64748b', collapsed) : ''}
        ${renderFolderGlyph(iconX, iconY, '#fcd34d', stroke, strokeWidth)}
        ${renderShapeLabel(
          {
            ...ctx,
            style: {
              ...ctx.style,
              fontWeight: '600',
              color: ctx.style.textColor || '#111827',
            },
          },
          labelText,
          x + (hasChildren ? 54 : 42),
          y + bounds.height / 2,
          'start'
        )}
      </g>
    `;
  },
};

export const fileShape: ShapeDefinition = {
  id: 'file',

  bounds(ctx) {
    return getMeasuredBounds(ctx, {
      minWidth: 92,
      minHeight: 26,
      widthPadding: 30,
      heightPadding: 10,
    });
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const { stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultStroke: '#64748b',
      defaultStrokeWidth: 1.2,
    });
    const iconX = x + 10;
    const iconY = y + 1;

    return `
      <g class="file-tree-file">
        ${renderFileGlyph(iconX, iconY, '#ffffff', stroke, strokeWidth)}
        ${renderShapeLabel(
          {
            ...ctx,
            style: {
              ...ctx.style,
              color: ctx.style.textColor || '#0f172a',
            },
          },
          ctx.node.label || ctx.node.id,
          x + 38,
          y + bounds.height / 2,
          'start'
        )}
      </g>
    `;
  },
};
