import type { RailroadExpression, RailroadProfile } from '@runiq/core';
import { createTextMeasurer, getDiagramTheme } from '@runiq/core';
import { escapeXml } from './renderers/utils.js';

export interface RailroadRenderOptions {
  width?: number;
  height?: number;
  title?: string;
  theme?: string;
  startMarker?: 'circle' | 'none';
  endMarker?: 'arrow' | 'circle' | 'none';
  compact?: boolean;
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
  operatorFill: string;
  background: string;
}

const DEFAULT_SPACING = {
  gap: 20,
  branchPad: 24,
  vGap: 18,
  boxPadX: 12,
  boxPadY: 6,
  loop: 22,
};

let activeSpacing = { ...DEFAULT_SPACING };

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

// function path(d: string): string {
//   return `<path d="${d}" fill="none" />`;
// }

function roundedPath(
  points: Array<{ x: number; y: number }>,
  radius: number
): string {
  if (points.length < 2) return '';

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length - 1; i += 1) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    const v1 = { x: prev.x - curr.x, y: prev.y - curr.y };
    const v2 = { x: next.x - curr.x, y: next.y - curr.y };
    const len1 = Math.hypot(v1.x, v1.y);
    const len2 = Math.hypot(v2.x, v2.y);

    if (len1 === 0 || len2 === 0) {
      d += ` L ${curr.x} ${curr.y}`;
      continue;
    }

    const cross = v1.x * v2.y - v1.y * v2.x;
    if (cross === 0) {
      d += ` L ${curr.x} ${curr.y}`;
      continue;
    }

    const cornerRadius = Math.min(radius, len1 / 2, len2 / 2);
    const p1 = {
      x: curr.x + (v1.x / len1) * cornerRadius,
      y: curr.y + (v1.y / len1) * cornerRadius,
    };
    const p2 = {
      x: curr.x + (v2.x / len2) * cornerRadius,
      y: curr.y + (v2.y / len2) * cornerRadius,
    };

    d += ` L ${p1.x} ${p1.y}`;
    const sweep = cross < 0 ? 0 : 1;
    d += ` A ${cornerRadius} ${cornerRadius} 0 0 ${sweep} ${p2.x} ${p2.y}`;
  }

  const last = points[points.length - 1];
  d += ` L ${last.x} ${last.y}`;

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

function isOperatorToken(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return /^[^A-Za-z0-9\s]+$/.test(trimmed);
}

function blendColor(color: string, background: string, amount: number): string {
  const parse = (value: string): [number, number, number] | null => {
    const hex = value.trim().replace('#', '');
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
    return [r, g, b];
  };

  const fg = parse(color);
  const bg = parse(background);
  if (!fg || !bg) return color;

  const mix = (c: number, b: number) => Math.round(b + (c - b) * amount);
  const [r, g, b] = [mix(fg[0], bg[0]), mix(fg[1], bg[1]), mix(fg[2], bg[2])];

  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
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
  const width = Math.max(24, metrics.width + activeSpacing.boxPadX * 2);
  const height = Math.max(24, metrics.height + activeSpacing.boxPadY * 2);
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
      if (isOperatorToken(expr.value)) {
        return layoutToken(
          expr.value,
          style.operatorFill,
          style.terminalStroke,
          style.fontSize,
          'normal',
          '600',
          undefined,
          style,
          resolveTextColor(style.operatorFill, style.text)
        );
      }
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
    activeSpacing.gap * Math.max(0, layouts.length - 1);
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
          const endX = startX + activeSpacing.gap;
          parts.push(line(startX, lineY, endX, lineY));
        }

        cursorX += item.width + activeSpacing.gap;
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
  const width = maxWidth + activeSpacing.branchPad * 2;
  const height =
    layouts.reduce((sum, item) => sum + item.height, 0) +
    activeSpacing.vGap * Math.max(0, layouts.length - 1);
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
      const leftX = x + activeSpacing.branchPad / 2;
      const optionX = x + activeSpacing.branchPad;
      const rightX = x + width - activeSpacing.branchPad / 2;

      let cursorY = y;
      layouts.forEach((item) => {
        const itemY = cursorY;
        const itemBaselineY = itemY + item.baseline;
        const itemX = optionX;

        parts.push(item.render(itemX, itemY));

        parts.push(
          roundedPath(
            [
              { x: entryX, y: entryY },
              { x: leftX, y: entryY },
              { x: leftX, y: itemBaselineY },
              { x: itemX, y: itemBaselineY },
            ],
            6
          )
        );

        parts.push(
          roundedPath(
            [
              { x: itemX + item.width, y: itemBaselineY },
              { x: rightX, y: itemBaselineY },
              { x: rightX, y: entryY },
              { x: exitX, y: entryY },
            ],
            6
          )
        );

        cursorY += item.height + activeSpacing.vGap;
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
  const width = child.width + activeSpacing.branchPad * 2;
  const height = child.height + activeSpacing.loop;
  const baseline = activeSpacing.loop + child.baseline;

  return {
    width,
    height,
    baseline,
    render: (x, y) => {
      const parts: string[] = [];
      const entryX = x;
      const entryY = y + baseline;
      const exitX = x + width;

      const childX = x + activeSpacing.branchPad;
      const childY = y + activeSpacing.loop;
      parts.push(child.render(childX, childY));

      const lineY = entryY;
      parts.push(line(entryX, lineY, childX, lineY));
      parts.push(line(childX + child.width, lineY, exitX, lineY));

      const bypassY = y + activeSpacing.loop / 2;
      parts.push(
        roundedPath(
          [
            { x: entryX, y: lineY },
            { x: entryX, y: bypassY },
            { x: exitX, y: bypassY },
            { x: exitX, y: lineY },
          ],
          6
        )
      );

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
  const topPad = includeBypass ? activeSpacing.loop : 0;
  const width = child.width + activeSpacing.branchPad * 2;
  const height = child.height + activeSpacing.loop + topPad;
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

      const childX = x + activeSpacing.branchPad;
      const childY = y + topPad;
      parts.push(child.render(childX, childY));

      parts.push(line(entryX, entryY, childX, entryY));
      parts.push(line(childX + child.width, entryY, exitX, entryY));

      const loopY = childY + child.height + activeSpacing.loop / 2;
      const loopLeft = x + activeSpacing.branchPad / 2;
      const loopRight = x + width - activeSpacing.branchPad / 2;
      parts.push(
        roundedPath(
          [
            { x: childX + child.width, y: entryY },
            { x: loopRight, y: entryY },
            { x: loopRight, y: loopY },
            { x: loopLeft, y: loopY },
            { x: loopLeft, y: entryY },
            { x: childX, y: entryY },
          ],
          6
        )
      );

      if (includeBypass) {
        const bypassY = y + activeSpacing.loop / 2;
        parts.push(
          roundedPath(
            [
              { x: entryX, y: entryY },
              { x: entryX, y: bypassY },
              { x: exitX, y: bypassY },
              { x: exitX, y: entryY },
            ],
            6
          )
        );
      }

      return parts.join('\n');
    },
  };
}

function collectMissingReferences(
  diagrams: { name: string; expression: RailroadExpression }[]
): string[] {
  const defined = new Set(diagrams.map((diagram) => diagram.name));
  const missing = new Set<string>();

  const walk = (expr: RailroadExpression) => {
    switch (expr.type) {
      case 'reference':
        if (!defined.has(expr.name)) {
          missing.add(expr.name);
        }
        return;
      case 'sequence':
        expr.items.forEach(walk);
        return;
      case 'choice':
        expr.options.forEach(walk);
        return;
      case 'optional':
      case 'oneOrMore':
      case 'zeroOrMore':
        walk(expr.expression);
        return;
      default:
        return;
    }
  };

  diagrams.forEach((diagram) => walk(diagram.expression));

  return Array.from(missing).sort();
}

export function renderRailroadDiagram(
  profile: RailroadProfile,
  options: RailroadRenderOptions = {}
): RailroadRenderResult {
  const warnings: string[] = [];
  const diagrams = profile.diagrams || [];
  const profileOptions = profile.options || {};
  const compact = options.compact ?? profileOptions.compact ?? false;
  activeSpacing = compact
    ? {
        gap: 14,
        branchPad: 18,
        vGap: 12,
        boxPadX: 10,
        boxPadY: 5,
        loop: 16,
      }
    : { ...DEFAULT_SPACING };
  const missingRefs = collectMissingReferences(diagrams);
  if (missingRefs.length > 0) {
    warnings.push(
      `Missing railroad diagram references: ${missingRefs.join(', ')}`
    );
  }
  const theme = getDiagramTheme(profile.theme || options.theme);
  const background = theme.backgroundColor;
  const stroke = ensureContrast(theme.edgeColor, background);
  const labelText = ensureContrast(theme.textColor, background);
  const markerColor =
    profileOptions.markerColor ||
    theme.railroadMarkerColor ||
    theme.accentColor ||
    theme.edgeColor;
  const markerFill = ensureContrast(markerColor, background);
  const operatorColor =
    profileOptions.operatorColor ||
    theme.railroadOperatorColor ||
    theme.accentColor ||
    theme.edgeColor;
  const operatorFill = blendColor(operatorColor, background, 0.2);
  const startMarker =
    options.startMarker ??
    profileOptions.startMarker ??
    theme.railroadStartMarker ??
    'circle';
  const endMarker =
    options.endMarker ??
    profileOptions.endMarker ??
    theme.railroadEndMarker ??
    'arrow';
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
    operatorFill,
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
        item.layout.width + activeSpacing.branchPad * 2 + RAIL.start + RAIL.end
    ),
    240
  );
  const topPad = 24;
  const labelHeight = 24;
  const bottomPad = 24;
  const contentHeight =
    topPad +
    layouts.reduce((sum, item) => sum + labelHeight + item.layout.height, 0) +
    activeSpacing.vGap * Math.max(0, layouts.length - 1) +
    bottomPad;

  const width = options.width ?? contentWidth + 64;
  const height = options.height ?? contentHeight + 32;
  const title = options.title || profile.name || 'Railroad Diagram';

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="diagram-title" data-id="runiq-diagram">
  <title id="diagram-title">${escapeXml(title)}</title>
  <rect x="0" y="0" width="${width}" height="${height}" fill="${style.background}" />
  ${
    endMarker === 'arrow'
      ? `<defs>
    <marker id="railroad-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L8,3 L0,6 Z" fill="${markerFill}" />
    </marker>
  </defs>`
      : ''
  }
  <g stroke="${style.stroke}" stroke-width="${style.lineWidth}" stroke-linecap="round" stroke-linejoin="round">`;

  let cursorY = topPad;
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

    if (startMarker === 'circle') {
      svg += `<circle cx="${RAIL.startRadius}" cy="${railY}" r="${RAIL.startRadius}" fill="${markerFill}" />`;
      svg += line(railLineStart, railY, railStartX, railY);
    } else {
      svg += line(0, railY, railStartX, railY);
    }
    svg += layout.render(railStartX, 0);
    if (endMarker === 'arrow') {
      svg += `<line x1="${railEndX}" y1="${railY}" x2="${railLineEnd}" y2="${railY}" marker-end="url(#railroad-arrow)" />`;
    } else if (endMarker === 'circle') {
      const endRadius = RAIL.startRadius;
      const endCircleX = railLineEnd;
      svg += line(railEndX, railY, endCircleX - endRadius, railY);
      svg += `<circle cx="${endCircleX}" cy="${railY}" r="${endRadius}" fill="${markerFill}" />`;
    } else {
      svg += line(railEndX, railY, railLineEnd, railY);
    }
    svg += `</g>`;

    cursorY = diagramY + layout.height + activeSpacing.vGap;
  });

  svg += '</g></svg>';

  return { svg, warnings };
}
