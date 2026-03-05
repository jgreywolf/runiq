import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { calculateSimpleBounds } from '../utils/calculate-bounds.js';
import { renderShapeLabel } from '../utils/render-label.js';

const DEFAULT_LINE_LENGTH = 220;
const DEFAULT_DIVIDER_LENGTH = 200;
const DEFAULT_BADGE_SIZE = 24;

const getNumber = (value: unknown, fallback: number): number => {
  return typeof value === 'number' ? value : fallback;
};

const getLabel = (ctx: ShapeRenderContext): string =>
  ctx.node.label || ctx.node.id;

const getTextColor = (ctx: ShapeRenderContext, fallback: string): string => {
  const dataText = (ctx.node.data as any)?.textColor;
  if (typeof dataText === 'string') {
    return dataText;
  }

  if (typeof ctx.style.textColor === 'string') {
    return ctx.style.textColor;
  }

  const hasExplicitColor =
    Boolean(ctx.node.style) || (ctx.node.data as any)?.color !== undefined;

  if (hasExplicitColor && typeof ctx.style.color === 'string') {
    return ctx.style.color;
  }

  return fallback;
};

const renderLine = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  stroke: string,
  strokeWidth: number,
  dash?: string
): string =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${strokeWidth}"${
    dash ? ` stroke-dasharray="${dash}"` : ''
  } />`;

const renderBox = (
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  stroke: string,
  strokeWidth: number,
  radius: number
): string =>
  `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

const buildBadgeShape = (
  id: string,
  renderContent: (ctx: ShapeRenderContext, x: number, y: number, size: number) => string
): ShapeDefinition => ({
  id,
  bounds(ctx) {
    const size = getNumber((ctx.node.data as any)?.size, DEFAULT_BADGE_SIZE);
    return { width: size, height: size };
  },
  render(ctx, position) {
    const size = getNumber((ctx.node.data as any)?.size, DEFAULT_BADGE_SIZE);
    const fill = ctx.style.fill || '#e2e8f0';
    const stroke = ctx.style.stroke || '#334155';
    const strokeWidth = ctx.style.strokeWidth || 1.5;
    const iconColor = ctx.style.color || '#0f172a';
    const x = position.x;
    const y = position.y;
    const radius = size / 2;

    return `
      <g>
        <circle cx="${x + radius}" cy="${y + radius}" r="${radius - strokeWidth}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        <g fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${renderContent(ctx, x, y, size)}
        </g>
      </g>
    `;
  },
});

const badgeText = (text: string): ShapeDefinition =>
  buildBadgeShape(`badge${text}`, (ctx, x, y, size) => {
    const labelCtx = {
      ...ctx,
      style: {
        ...ctx.style,
        fontSize: Math.max(10, Math.floor(size * 0.45)),
        fontWeight: '700',
        color: ctx.style.color || '#0f172a',
      },
    };
    return renderShapeLabel(labelCtx, text, x + size / 2, y + size / 2);
  });

export const hRuleShape: ShapeDefinition = {
  id: 'hRule',
  bounds(ctx) {
    const length = getNumber((ctx.node.data as any)?.length, DEFAULT_LINE_LENGTH);
    return { width: length, height: 12 };
  },
  render(ctx, position) {
    const stroke = ctx.style.stroke || '#334155';
    const strokeWidth = ctx.style.strokeWidth || 2;
    const y = position.y + 6;
    return renderLine(position.x, y, position.x + this.bounds(ctx).width, y, stroke, strokeWidth);
  },
};

export const vRuleShape: ShapeDefinition = {
  id: 'vRule',
  bounds(ctx) {
    const length = getNumber((ctx.node.data as any)?.length, DEFAULT_LINE_LENGTH);
    return { width: 12, height: length };
  },
  render(ctx, position) {
    const stroke = ctx.style.stroke || '#334155';
    const strokeWidth = ctx.style.strokeWidth || 2;
    const x = position.x + 6;
    return renderLine(x, position.y, x, position.y + this.bounds(ctx).height, stroke, strokeWidth);
  },
};

export const bracketLeftShape: ShapeDefinition = {
  id: 'bracketLeft',
  bounds(ctx) {
    const length = getNumber((ctx.node.data as any)?.length, DEFAULT_DIVIDER_LENGTH);
    return { width: 20, height: length };
  },
  render(ctx, position) {
    const stroke = ctx.style.stroke || '#334155';
    const strokeWidth = ctx.style.strokeWidth || 2;
    const { width, height } = this.bounds(ctx);
    const x = position.x + width - strokeWidth;
    const y = position.y;
    return [
      renderLine(x, y, x, y + height, stroke, strokeWidth),
      renderLine(x, y, position.x, y, stroke, strokeWidth),
      renderLine(x, y + height, position.x, y + height, stroke, strokeWidth),
    ].join('\n');
  },
};

export const bracketRightShape: ShapeDefinition = {
  id: 'bracketRight',
  bounds(ctx) {
    const length = getNumber((ctx.node.data as any)?.length, DEFAULT_DIVIDER_LENGTH);
    return { width: 20, height: length };
  },
  render(ctx, position) {
    const stroke = ctx.style.stroke || '#334155';
    const strokeWidth = ctx.style.strokeWidth || 2;
    const { width, height } = this.bounds(ctx);
    const x = position.x + strokeWidth;
    const y = position.y;
    return [
      renderLine(x, y, x, y + height, stroke, strokeWidth),
      renderLine(x, y, position.x + width, y, stroke, strokeWidth),
      renderLine(x, y + height, position.x + width, y + height, stroke, strokeWidth),
    ].join('\n');
  },
};

export const sectionHeaderShape: ShapeDefinition = {
  id: 'sectionHeader',
  bounds(ctx) {
    const length = getNumber((ctx.node.data as any)?.length, DEFAULT_LINE_LENGTH);
    const text = ctx.measureText(getLabel(ctx), ctx.style);
    return { width: Math.max(length, text.width + 40), height: text.height + 16 };
  },
  render(ctx, position) {
    const { width, height } = this.bounds(ctx);
    const stroke = ctx.style.stroke || '#64748b';
    const strokeWidth = ctx.style.strokeWidth || 1.5;
    const label = getLabel(ctx);
    const midY = position.y + height / 2;

    const labelSize = ctx.measureText(label, ctx.style);
    const padding = 10;
    const labelWidth = labelSize.width + padding * 2;
    const labelX = position.x + width / 2 - labelWidth / 2;
    const labelY = midY - (labelSize.height + 8) / 2;

    const line = renderLine(position.x, midY, position.x + width, midY, stroke, strokeWidth);
    const boxFill = ctx.style.fill || '#ffffff';
    const labelBox = renderBox(labelX, labelY, labelWidth, labelSize.height + 8, boxFill, stroke, 0, 6);
    const labelCtx = {
      ...ctx,
      style: { ...ctx.style, color: getTextColor(ctx, '#0f172a') },
    };
    const labelSvg = renderShapeLabel(labelCtx, label, position.x + width / 2, midY);

    return [line, labelBox, labelSvg].join('\n');
  },
};

export const swimlaneDividerShape: ShapeDefinition = {
  id: 'swimlaneDivider',
  bounds(ctx) {
    const length = getNumber((ctx.node.data as any)?.length, DEFAULT_DIVIDER_LENGTH);
    return { width: length, height: 12 };
  },
  render(ctx, position) {
    const stroke = ctx.style.stroke || '#94a3b8';
    const strokeWidth = ctx.style.strokeWidth || 1.5;
    const dash = ctx.style.strokeDasharray || '6,6';
    const y = position.y + 6;
    const line = renderLine(position.x, y, position.x + this.bounds(ctx).width, y, stroke, strokeWidth, dash);
    const label = ctx.node.label;
    if (!label) return line;
    const labelSvg = renderShapeLabel(ctx, label, position.x + 12, position.y + 6, 'start');
    return `${line}\n${labelSvg}`;
  },
};

export const titleBoxShape: ShapeDefinition = {
  id: 'titleBox',
  bounds(ctx) {
    return calculateSimpleBounds(ctx, { minWidth: 120, minHeight: 40 });
  },
  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const fill = ctx.style.fill || '#f8fafc';
    const stroke = ctx.style.stroke || '#334155';
    const strokeWidth = ctx.style.strokeWidth || 1.5;
    const labelCtx = {
      ...ctx,
      style: {
        ...ctx.style,
        fontSize: ctx.style.fontSize || 18,
        fontWeight: '700',
        color: getTextColor(ctx, '#0f172a'),
      },
    };
    return [
      renderBox(position.x, position.y, bounds.width, bounds.height, fill, stroke, strokeWidth, 6),
      renderShapeLabel(labelCtx, getLabel(ctx), position.x + bounds.width / 2, position.y + bounds.height / 2),
    ].join('\n');
  },
};

export const subtitleTextShape: ShapeDefinition = {
  id: 'subtitleText',
  bounds(ctx) {
    return calculateSimpleBounds(ctx, { minWidth: 80, minHeight: 24 });
  },
  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const labelCtx = {
      ...ctx,
      style: {
        ...ctx.style,
        fontSize: ctx.style.fontSize || 14,
        fontWeight: '500',
        color: getTextColor(ctx, '#475569'),
      },
    };
    return renderShapeLabel(labelCtx, getLabel(ctx), position.x + bounds.width / 2, position.y + bounds.height / 2);
  },
};

export const captionBoxShape: ShapeDefinition = {
  id: 'captionBox',
  bounds(ctx) {
    return calculateSimpleBounds(ctx, { minWidth: 120, minHeight: 28 });
  },
  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const fill = ctx.style.fill || '#f1f5f9';
    const stroke = ctx.style.stroke || '#94a3b8';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const labelCtx = {
      ...ctx,
      style: { ...ctx.style, fontSize: ctx.style.fontSize || 12, color: getTextColor(ctx, '#475569') },
    };
    return [
      renderBox(position.x, position.y, bounds.width, bounds.height, fill, stroke, strokeWidth, 4),
      renderShapeLabel(labelCtx, getLabel(ctx), position.x + bounds.width / 2, position.y + bounds.height / 2),
    ].join('\n');
  },
};

export const footnoteTextShape: ShapeDefinition = {
  id: 'footnoteText',
  bounds(ctx) {
    return calculateSimpleBounds(ctx, { minWidth: 120, minHeight: 20 });
  },
  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const labelCtx: ShapeRenderContext = {
      ...ctx,
      style: {
        ...ctx.style,
        fontSize: ctx.style.fontSize || 11,
        color: getTextColor(ctx, '#64748b'),
        fontStyle: 'italic',
      },
    };
    return renderShapeLabel(labelCtx, getLabel(ctx), position.x + bounds.width / 2, position.y + bounds.height / 2);
  },
};

export const legendBoxShape: ShapeDefinition = {
  id: 'legendBox',
  bounds(ctx) {
    return calculateSimpleBounds(ctx, { minWidth: 160, minHeight: 60, heightPaddingMultiplier: 3 });
  },
  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const fill = ctx.style.fill || '#ffffff';
    const stroke = ctx.style.stroke || '#cbd5f5';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const labelCtx = {
      ...ctx,
      style: { ...ctx.style, fontSize: ctx.style.fontSize || 12, color: getTextColor(ctx, '#0f172a') },
    };
    return [
      renderBox(position.x, position.y, bounds.width, bounds.height, fill, stroke, strokeWidth, 6),
      renderShapeLabel(labelCtx, getLabel(ctx), position.x + bounds.width / 2, position.y + bounds.height / 2),
    ].join('\n');
  },
};

export const watermarkTextShape: ShapeDefinition = {
  id: 'watermarkText',
  bounds(ctx) {
    return calculateSimpleBounds(ctx, { minWidth: 200, minHeight: 60 });
  },
  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const labelCtx = {
      ...ctx,
      style: {
        ...ctx.style,
        fontSize: ctx.style.fontSize || 32,
        fontWeight: '700',
        color: getTextColor(ctx, '#cbd5e1'),
      },
    };
    return `<g opacity="0.3">
      ${renderShapeLabel(labelCtx, getLabel(ctx), position.x + bounds.width / 2, position.y + bounds.height / 2)}
    </g>`;
  },
};

export const badgeWarningShape = buildBadgeShape('badgeWarning', (_ctx, x, y, size) => {
  const midX = x + size / 2;
  return `<path d="M${midX} ${y + 5} L${x + size - 5} ${y + size - 5} L${x + 5} ${y + size - 5} Z" />` +
    `<line x1="${midX}" y1="${y + 9}" x2="${midX}" y2="${y + size - 10}" />` +
    `<circle cx="${midX}" cy="${y + size - 7}" r="1" fill="currentColor" />`;
});

export const badgeInfoShape = buildBadgeShape('badgeInfo', (_ctx, x, y, size) => {
  const midX = x + size / 2;
  return `<circle cx="${midX}" cy="${y + size / 2}" r="${size / 4}" />` +
    `<line x1="${midX}" y1="${y + 8}" x2="${midX}" y2="${y + size - 7}" />`;
});

export const badgeSuccessShape = buildBadgeShape('badgeSuccess', (_ctx, x, y, size) =>
  `<path d="M${x + 6} ${y + size / 2} L${x + size / 2 - 1} ${y + size - 7} L${x + size - 6} ${y + 6}" />`
);

export const badgeErrorShape = buildBadgeShape('badgeError', (_ctx, x, y, size) =>
  `<line x1="${x + 7}" y1="${y + 7}" x2="${x + size - 7}" y2="${y + size - 7}" />` +
  `<line x1="${x + size - 7}" y1="${y + 7}" x2="${x + 7}" y2="${y + size - 7}" />`
);

export const badgeStarShape = buildBadgeShape('badgeStar', (_ctx, x, y, size) =>
  `<path d="M${x + size / 2} ${y + 5} L${x + size * 0.62} ${y + size * 0.38} L${x + size - 5} ${y + size * 0.4} L${x + size * 0.7} ${y + size * 0.62} L${x + size * 0.78} ${y + size - 5} L${x + size / 2} ${y + size * 0.76} L${x + size * 0.22} ${y + size - 5} L${x + size * 0.3} ${y + size * 0.62} L${x + 5} ${y + size * 0.4} L${x + size * 0.38} ${y + size * 0.38} Z" />`
);

export const badgeFlagShape = buildBadgeShape('badgeFlag', (_ctx, x, y, size) =>
  `<path d="M${x + 7} ${y + 6} L${x + size - 6} ${y + 8} L${x + size - 9} ${y + size / 2} L${x + 7} ${y + size / 2} Z" />` +
  `<line x1="${x + 7}" y1="${y + 5}" x2="${x + 7}" y2="${y + size - 5}" />`
);

export const badgeLockShape = buildBadgeShape('badgeLock', (_ctx, x, y, size) => {
  const lockX = x + size / 2 - 5;
  const lockY = y + size / 2 - 2;
  return `<rect x="${lockX}" y="${lockY}" width="10" height="8" rx="2" />` +
    `<path d="M${x + size / 2 - 4} ${lockY} V${lockY - 4} A4 4 0 0 1 ${x + size / 2 + 4} ${lockY - 4} V${lockY}" />`;
});

export const badgeUnlockShape = buildBadgeShape('badgeUnlock', (_ctx, x, y, size) => {
  const lockX = x + size / 2 - 5;
  const lockY = y + size / 2 - 2;
  return `<rect x="${lockX}" y="${lockY}" width="10" height="8" rx="2" />` +
    `<path d="M${x + size / 2 - 4} ${lockY} V${lockY - 4} A4 4 0 0 1 ${x + size / 2 + 4} ${lockY - 4}" />`;
});

export const badgeNewShape = badgeText('NEW');
export const badgeUpdatedShape = badgeText('UPD');
export const badgePriorityShape = badgeText('P1');

export const badgeNumberShape: ShapeDefinition = {
  id: 'badgeNumber',
  bounds(ctx) {
    const size = getNumber((ctx.node.data as any)?.size, DEFAULT_BADGE_SIZE);
    return { width: size, height: size };
  },
  render(ctx, position) {
    const size = getNumber((ctx.node.data as any)?.size, DEFAULT_BADGE_SIZE);
    const fill = ctx.style.fill || '#e2e8f0';
    const stroke = ctx.style.stroke || '#334155';
    const strokeWidth = ctx.style.strokeWidth || 1.5;
    const labelCtx = {
      ...ctx,
      style: { ...ctx.style, fontSize: Math.max(10, Math.floor(size * 0.5)), fontWeight: '700' },
    };
    return [
      `<circle cx="${position.x + size / 2}" cy="${position.y + size / 2}" r="${size / 2 - strokeWidth}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`,
      renderShapeLabel(labelCtx, getLabel(ctx), position.x + size / 2, position.y + size / 2),
    ].join('\n');
  },
};

export const badgeLabelShape: ShapeDefinition = {
  id: 'badgeLabel',
  bounds(ctx) {
    return calculateSimpleBounds(ctx, { minWidth: 60, minHeight: 22 });
  },
  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const fill = ctx.style.fill || '#e2e8f0';
    const stroke = ctx.style.stroke || '#334155';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const labelCtx = {
      ...ctx,
      style: { ...ctx.style, fontSize: ctx.style.fontSize || 11, fontWeight: '600' },
    };
    return [
      renderBox(position.x, position.y, bounds.width, bounds.height, fill, stroke, strokeWidth, 10),
      renderShapeLabel(labelCtx, getLabel(ctx), position.x + bounds.width / 2, position.y + bounds.height / 2),
    ].join('\n');
  },
};
