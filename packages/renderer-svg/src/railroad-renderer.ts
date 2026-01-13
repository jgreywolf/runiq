import type { RailroadExpression, RailroadProfile } from '@runiq/core';
import { createTextMeasurer, getDiagramTheme } from '@runiq/core';
import { escapeXml } from './renderers/utils.js';

export interface RailroadRenderOptions {
  width?: number;
  height?: number;
  title?: string;
  theme?: string;
}

export interface RailroadRenderResult {
  svg: string;
  warnings: string[];
}

const DEFAULT_STYLE = {
  fontFamily: 'sans-serif',
  fontSize: 14,
  lineWidth: 1.5,
};

interface RailroadStyle {
  fontFamily: string;
  fontSize: number;
  lineWidth: number;
  stroke: string;
  text: string;
  terminalFill: string;
  terminalStroke: string;
  nonterminalFill: string;
  nonterminalStroke: string;
  background: string;
}

const SPACING = {
  gap: 20,
  branchPad: 24,
  vGap: 18,
  boxPadX: 12,
  boxPadY: 6,
  loop: 22,
};

const RAIL = {
  start: 16,
  end: 20,
  startRadius: 4,
};

interface LayoutNode {
  width: number;
  height: number;
  baseline: number;
  render: (x: number, y: number) => string;
}

const measureText = createTextMeasurer();

function line(x1: number, y1: number, x2: number, y2: number): string {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
}

function path(d: string): string {
  return `<path d="${d}" fill="none" />`;
}

function luminance(color: string): number | null {
  const hex = color.trim().replace('#', '');
  if (hex.length !== 3 && hex.length !== 6) return null;
  const normalized =
    hex.length === 3
      ? hex
          .split('')
          .map((c) => c + c)
          .join('')
      : hex;
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function contrastRatio(a: string, b: string): number {
  const lumA = luminance(a);
  const lumB = luminance(b);
  if (lumA === null || lumB === null) return 1;
  const [hi, lo] = lumA > lumB ? [lumA, lumB] : [lumB, lumA];
  return (hi + 0.05) / (lo + 0.05);
}

function bestForeground(background: string): string {
  const lum = luminance(background);
  if (lum === null) return '#0f172a';
  return lum > 0.6 ? '#0f172a' : '#ffffff';
}

function ensureContrast(color: string, background: string): string {
  return contrastRatio(color, background) < 3
    ? bestForeground(background)
    : color;
}

function resolveTextColor(fill: string, _fallback: string): string {
  const dark = '#0f172a';
  const light = '#ffffff';
  return contrastRatio(fill, dark) >= contrastRatio(fill, light) ? dark : light;
}

function blendColor(color: string, background: string, amount: number): string {
  const parse = (value: string): [number, number, number] | null => {
    const hex = value.trim().replace('#', '');
    if (hex.length !== 3 && hex.length !== 6) return null;
    const normalized =
      hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
    const r = Number.parseInt(normalized.slice(0, 2), 16);
    const g = Number.parseInt(normalized.slice(2, 4), 16);
    const b = Number.parseInt(normalized.slice(4, 6), 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
    return [r, g, b];
  };

  const fg = parse(color);
  const bg = parse(background);
  if (!fg || !bg) return color;

  const mix = (c: number, b: number) =>
    Math.round(b + (c - b) * amount);
  const [r, g, b] = [
    mix(fg[0], bg[0]),
    mix(fg[1], bg[1]),
    mix(fg[2], bg[2]),
  ];

  return `#${[r, g, b]
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')}`;
}

function layoutToken(
  value: string,
  fill: string,
  stroke: string,
  fontSize: number,
  fontStyle: 'normal' | 'italic' = 'normal',
  fontWeight: 'normal' | '600' = 'normal',
  strokeDasharray?: string,
  style?: RailroadStyle,
  textColorOverride?: string
): LayoutNode {
  const fontFamily = style?.fontFamily || DEFAULT_STYLE.fontFamily;
  const textColor = textColorOverride || style?.text || '#0f172a';
  const metrics = measureText(value, { fontSize, fontFamily });
  const width = Math.max(24, metrics.width + SPACING.boxPadX * 2);
  const height = Math.max(24, metrics.height + SPACING.boxPadY * 2);
  const baseline = height / 2;

  return {
    width,
    height,
    baseline,
    render: (x, y) => {
      const textX = x + width / 2;
      const textY = y + height / 2;
      return `
        <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="6" fill="${fill}" stroke="${stroke}"${
          strokeDasharray ? ` stroke-dasharray="${strokeDasharray}"` : ''
        } />
        <text x="${textX}" y="${textY}" text-anchor="middle" dominant-baseline="middle"
          font-family="${fontFamily}" font-size="${fontSize}" font-style="${fontStyle}" font-weight="${fontWeight}" fill="${textColor}">
          ${escapeXml(value)}
        </text>
      `;
    },
  };
}

function layoutExpr(
  expr: RailroadExpression,
  style: RailroadStyle
): LayoutNode {
  switch (expr.type) {
    case 'token':
      return layoutToken(
        expr.value,
        style.terminalFill,
        style.terminalStroke,
        style.fontSize,
        'normal',
        '600',
        undefined,
        style,
        resolveTextColor(style.terminalFill, style.text)
      );
    case 'reference':
      return layoutToken(
        expr.name,
        style.nonterminalFill,
        style.nonterminalStroke,
        style.fontSize,
        'italic',
        'normal',
        '4 2',
        style,
        resolveTextColor(style.nonterminalFill, style.text)
      );
    case 'sequence':
      return layoutSequence(expr.items, style);
    case 'choice':
      return layoutChoice(expr.options, style);
    case 'optional':
      return layoutOptional(expr.expression, style);
    case 'oneOrMore':
      return layoutRepeat(expr.expression, false, style);
    case 'zeroOrMore':
      return layoutRepeat(expr.expression, true, style);
    default:
      return layoutToken(
        '',
        style.terminalFill,
        style.terminalStroke,
        style.fontSize,
        'normal',
        'normal',
        undefined,
        style
      );
  }
}

function layoutSequence(
  items: RailroadExpression[],
  style: RailroadStyle
): LayoutNode {
  const layouts = items.map((item) => layoutExpr(item, style));
  const width =
    layouts.reduce((sum, item) => sum + item.width, 0) +
    SPACING.gap * Math.max(0, layouts.length - 1);
  const height = Math.max(...layouts.map((item) => item.height), 28);
  const baseline = height / 2;

  return {
    width,
    height,
    baseline,
    render: (x, y) => {
      let cursorX = x;
      const parts: string[] = [];

      layouts.forEach((item, index) => {
        const itemY = y + baseline - item.baseline;
        parts.push(item.render(cursorX, itemY));

        if (index < layouts.length - 1) {
          const lineY = y + baseline;
          const startX = cursorX + item.width;
          const endX = startX + SPACING.gap;
          parts.push(line(startX, lineY, endX, lineY));
        }

        cursorX += item.width + SPACING.gap;
      });

      return parts.join('\n');
    },
  };
}

function layoutChoice(
  options: RailroadExpression[],
  style: RailroadStyle
): LayoutNode {
  const layouts = options.map((item) => layoutExpr(item, style));
  const maxWidth = Math.max(...layouts.map((item) => item.width), 40);
  const width = maxWidth + SPACING.branchPad * 2;
  const height =
    layouts.reduce((sum, item) => sum + item.height, 0) +
    SPACING.vGap * Math.max(0, layouts.length - 1);
  const baseline = height / 2;

  return {
    width,
    height,
    baseline,
    render: (x, y) => {
      const parts: string[] = [];
      const entryX = x;
      const entryY = y + baseline;
      const exitX = x + width;
      const leftX = x + SPACING.branchPad / 2;
      const optionX = x + SPACING.branchPad;
      const rightX = x + width - SPACING.branchPad / 2;

      let cursorY = y;
      layouts.forEach((item) => {
        const itemY = cursorY;
        const itemBaselineY = itemY + item.baseline;
        const itemX = optionX;

        parts.push(item.render(itemX, itemY));

        const toOption = `M ${entryX} ${entryY} H ${leftX} V ${itemBaselineY} H ${itemX}`;
        parts.push(path(toOption));

        const fromOption = `M ${itemX + item.width} ${itemBaselineY} H ${rightX} V ${entryY} H ${exitX}`;
        parts.push(path(fromOption));

        cursorY += item.height + SPACING.vGap;
      });

      return parts.join('\n');
    },
  };
}

function layoutOptional(
  expression: RailroadExpression,
  style: RailroadStyle
): LayoutNode {
  const child = layoutExpr(expression, style);
  const width = child.width + SPACING.branchPad * 2;
  const height = child.height + SPACING.loop;
  const baseline = SPACING.loop + child.baseline;

  return {
    width,
    height,
    baseline,
    render: (x, y) => {
      const parts: string[] = [];
      const entryX = x;
      const entryY = y + baseline;
      const exitX = x + width;

      const childX = x + SPACING.branchPad;
      const childY = y + SPACING.loop;
      parts.push(child.render(childX, childY));

      const lineY = entryY;
      parts.push(line(entryX, lineY, childX, lineY));
      parts.push(line(childX + child.width, lineY, exitX, lineY));

      const bypassY = y + SPACING.loop / 2;
      const bypassPath = `M ${entryX} ${lineY} V ${bypassY} H ${exitX} V ${lineY}`;
      parts.push(path(bypassPath));

      return parts.join('\n');
    },
  };
}

function layoutRepeat(
  expression: RailroadExpression,
  includeBypass: boolean,
  style: RailroadStyle
): LayoutNode {
  const child = layoutExpr(expression, style);
  const topPad = includeBypass ? SPACING.loop : 0;
  const width = child.width + SPACING.branchPad * 2;
  const height = child.height + SPACING.loop + topPad;
  const baseline = topPad + child.baseline;

  return {
    width,
    height,
    baseline,
    render: (x, y) => {
      const parts: string[] = [];
      const entryX = x;
      const entryY = y + baseline;
      const exitX = x + width;

      const childX = x + SPACING.branchPad;
      const childY = y + topPad;
      parts.push(child.render(childX, childY));

      parts.push(line(entryX, entryY, childX, entryY));
      parts.push(line(childX + child.width, entryY, exitX, entryY));

      const loopY = childY + child.height + SPACING.loop / 2;
      const loopLeft = x + SPACING.branchPad / 2;
      const loopRight = x + width - SPACING.branchPad / 2;
      const loopPath = `M ${childX + child.width} ${entryY} H ${loopRight} V ${loopY} H ${loopLeft} V ${entryY} H ${childX}`;
      parts.push(path(loopPath));

      if (includeBypass) {
        const bypassY = y + SPACING.loop / 2;
        const bypassPath = `M ${entryX} ${entryY} V ${bypassY} H ${exitX} V ${entryY}`;
        parts.push(path(bypassPath));
      }

      return parts.join('\n');
    },
  };
}

export function renderRailroadDiagram(
  profile: RailroadProfile,
  options: RailroadRenderOptions = {}
): RailroadRenderResult {
  const warnings: string[] = [];
  const diagrams = profile.diagrams || [];
  const theme = getDiagramTheme(profile.theme || options.theme);
  const background = theme.backgroundColor;
  const stroke = ensureContrast(theme.edgeColor, background);
  const labelText = ensureContrast(theme.textColor, background);
  const markerFill = ensureContrast(
    theme.railroadMarkerColor || theme.accentColor || theme.edgeColor,
    background
  );
  const terminalFill = blendColor(
    theme.nodeColors[0] || theme.accentColor,
    background,
    0.25
  );
  const nonterminalFill = blendColor(
    theme.nodeColors[1] || theme.nodeColors[0] || theme.accentColor,
    background,
    0.2
  );
  const style: RailroadStyle = {
    fontFamily: DEFAULT_STYLE.fontFamily,
    fontSize: DEFAULT_STYLE.fontSize,
    lineWidth: DEFAULT_STYLE.lineWidth,
    stroke,
    text: labelText,
    terminalFill,
    terminalStroke: stroke,
    nonterminalFill,
    nonterminalStroke: stroke,
    background,
  };

  if (diagrams.length === 0) {
    const width = options.width ?? 800;
    const height = options.height ?? 240;
    const title = options.title || profile.name || 'Railroad Diagram';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="diagram-title" data-id="runiq-diagram">
  <title id="diagram-title">${escapeXml(title)}</title>
  <rect x="16" y="16" width="${width - 32}" height="${height - 32}" rx="8" fill="${style.background}" stroke="${style.stroke}" />
  <text x="${width / 2}" y="${height / 2}" text-anchor="middle" dominant-baseline="middle" font-family="${DEFAULT_STYLE.fontFamily}" font-size="${DEFAULT_STYLE.fontSize}" fill="#64748b">
    Empty railroad profile
  </text>
</svg>`;
    warnings.push('No railroad diagrams found.');
    return { svg, warnings };
  }

  const layouts = diagrams.map((diagram) => ({
    name: diagram.name,
    layout: layoutExpr(diagram.expression, style),
  }));

  const contentWidth = Math.max(
    ...layouts.map(
      (item) =>
        item.layout.width +
        SPACING.branchPad * 2 +
        RAIL.start +
        RAIL.end
    ),
    240
  );
  const contentHeight =
    layouts.reduce((sum, item) => sum + item.layout.height, 0) +
    SPACING.vGap * Math.max(0, layouts.length - 1) +
    32;

  const width = options.width ?? contentWidth + 64;
  const height = options.height ?? contentHeight + 32;
  const title = options.title || profile.name || 'Railroad Diagram';

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="diagram-title" data-id="runiq-diagram">
  <title id="diagram-title">${escapeXml(title)}</title>
  <rect x="0" y="0" width="${width}" height="${height}" fill="${style.background}" />
  <defs>
    <marker id="railroad-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L8,3 L0,6 Z" fill="${markerFill}" />
    </marker>
  </defs>
  <g stroke="${style.stroke}" stroke-width="${style.lineWidth}" stroke-linecap="round" stroke-linejoin="round">`;

  let cursorY = 24;
  const startX = 32;
  layouts.forEach(({ name, layout }) => {
    const labelY = cursorY + 12;
    svg += `<text x="${startX}" y="${labelY}" font-family="${style.fontFamily}" font-size="${style.fontSize}" fill="${style.text}">${escapeXml(name)}</text>`;

    const diagramY = cursorY + 24;
    const diagramX = startX + 12;
    svg += `<g transform="translate(${diagramX}, ${diagramY})">`;
    const railY = layout.baseline;
    const railStartX = RAIL.start;
    const railEndX = railStartX + layout.width;
    const railLineStart = RAIL.startRadius * 2;
    const railLineEnd = railEndX + RAIL.end;

    svg += `<circle cx="${RAIL.startRadius}" cy="${railY}" r="${RAIL.startRadius}" fill="${markerFill}" />`;
    svg += line(railLineStart, railY, railStartX, railY);
    svg += layout.render(railStartX, 0);
    svg += `<line x1="${railEndX}" y1="${railY}" x2="${railLineEnd}" y2="${railY}" marker-end="url(#railroad-arrow)" />`;
    svg += `</g>`;

    cursorY = diagramY + layout.height + SPACING.vGap;
  });

  svg += '</g></svg>';

  return { svg, warnings };
}
