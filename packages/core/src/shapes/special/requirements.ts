import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import {
  calculateRectangularAnchors,
  extractBasicStyles,
} from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

function measureText(
  ctx: ShapeRenderContext,
  text: string,
  fontSize = 14,
  fontWeight?: string
) {
  return ctx.measureText(text, {
    ...ctx.style,
    fontSize,
    fontWeight,
  });
}

function getRequirementText(ctx: ShapeRenderContext): string {
  return ctx.node.label || ctx.node.id;
}

function getRequirementId(ctx: ShapeRenderContext): string {
  const data = ctx.node.data as Record<string, unknown> | undefined;
  return typeof data?.title === 'string' && data.title.length > 0
    ? data.title
    : ctx.node.id.toUpperCase();
}

function getContainerBounds(
  ctx: ShapeRenderContext,
  fallback: { width: number; height: number }
) {
  const data = ctx.node.data as Record<string, unknown> | undefined;
  return {
    width: typeof data?.width === 'number' ? data.width : fallback.width,
    height: typeof data?.height === 'number' ? data.height : fallback.height,
  };
}

export const requirementPackageShape: ShapeDefinition = {
  id: 'requirementPackage',

  bounds(ctx) {
    return getContainerBounds(ctx, { width: 360, height: 240 });
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const label = ctx.node.label || ctx.node.id;
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#f8fafc',
      defaultStroke: '#94a3b8',
      defaultStrokeWidth: 1.8,
    });
    const tabWidth = Math.max(measureText(ctx, label, 13, '700').width + 34, 124);
    const tabHeight = 26;
    const tabFill = '#e2e8f0';

    return `
      <g class="requirement-package">
        <path d="M ${x} ${y + 18}
                 L ${x + 24} ${y + 18}
                 L ${x + 32} ${y}
                 L ${x + tabWidth} ${y}
                 L ${x + tabWidth} ${y + tabHeight}
                 L ${x + bounds.width} ${y + tabHeight}
                 L ${x + bounds.width} ${y + bounds.height}
                 L ${x} ${y + bounds.height}
                 Z"
              fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        <path d="M ${x} ${y + 18}
                 L ${x + 24} ${y + 18}
                 L ${x + 32} ${y}
                 L ${x + tabWidth} ${y}
                 L ${x + tabWidth} ${y + tabHeight}
                 L ${x} ${y + tabHeight}
                 Z"
              fill="${tabFill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        ${renderShapeLabel(
          {
            ...ctx,
            style: {
              ...ctx.style,
              fontWeight: '700',
              color: ctx.style.textColor || '#334155',
            },
          },
          label,
          x + tabWidth / 2,
          y + tabHeight / 2 + 1
        )}
      </g>
    `;
  },
};

export const requirementShape: ShapeDefinition = {
  id: 'requirement',

  bounds(ctx) {
    const text = getRequirementText(ctx);
    const reqId = getRequirementId(ctx);
    const titleMeasure = measureText(ctx, text, 13, '600');
    const idMeasure = measureText(ctx, reqId, 12, '700');
    return {
      width: Math.max(titleMeasure.width + 46, idMeasure.width + 34, 170),
      height: 86,
    };
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const reqId = getRequirementId(ctx);
    const label = getRequirementText(ctx);
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#eff6ff',
      defaultStroke: '#1d4ed8',
      defaultStrokeWidth: 1.8,
    });
    const headerHeight = 22;
    const idHeight = 20;
    const textTop = y + headerHeight + idHeight + 8;

    return `
      <g class="requirement-shape">
        <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" rx="6" ry="6" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        <rect x="${x}" y="${y}" width="${bounds.width}" height="${headerHeight}" rx="6" ry="6" fill="#dbeafe" stroke="none" />
        <line x1="${x}" y1="${y + headerHeight}" x2="${x + bounds.width}" y2="${y + headerHeight}" stroke="${stroke}" stroke-width="1.2" />
        <line x1="${x}" y1="${y + headerHeight + idHeight}" x2="${x + bounds.width}" y2="${y + headerHeight + idHeight}" stroke="${stroke}" stroke-width="1.2" />
        <text x="${x + bounds.width / 2}" y="${y + 14}" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="12" font-weight="700" fill="${ctx.style.textColor || '#1e3a8a'}">«requirement»</text>
        <text x="${x + 10}" y="${y + headerHeight + idHeight / 2}" text-anchor="start" dominant-baseline="middle" font-family="sans-serif" font-size="12" font-weight="700" fill="${ctx.style.textColor || '#1e40af'}">${reqId}</text>
        ${renderShapeLabel(
          {
            ...ctx,
            style: {
              ...ctx.style,
              fontWeight: '600',
              color: ctx.style.textColor || '#0f172a',
            },
          },
          label,
          x + bounds.width / 2,
          textTop + 10
        )}
      </g>
    `;
  },
};

export const testCaseShape: ShapeDefinition = {
  id: 'testCase',

  bounds(ctx) {
    const label = getRequirementText(ctx);
    const measured = measureText(ctx, label, 13, '600');
    return {
      width: Math.max(measured.width + 54, 156),
      height: 64,
    };
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#fef3c7',
      defaultStroke: '#b45309',
      defaultStrokeWidth: 1.8,
    });
    const notch = 14;

    return `
      <g class="test-case-shape">
        <path d="M ${x + notch} ${y}
                 L ${x + bounds.width - notch} ${y}
                 L ${x + bounds.width} ${y + bounds.height / 2}
                 L ${x + bounds.width - notch} ${y + bounds.height}
                 L ${x + notch} ${y + bounds.height}
                 L ${x} ${y + bounds.height / 2}
                 Z"
              fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        <text x="${x + bounds.width / 2}" y="${y + 16}" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="${ctx.style.textColor || '#92400e'}">«testCase»</text>
        ${renderShapeLabel(
          {
            ...ctx,
            style: {
              ...ctx.style,
              fontWeight: '600',
              color: ctx.style.textColor || '#78350f',
            },
          },
          getRequirementText(ctx),
          x + bounds.width / 2,
          y + bounds.height / 2 + 8
        )}
      </g>
    `;
  },
};
