import type {
  KanbanCard,
  KanbanColumn,
  KanbanProfile,
  KanbanStyle,
} from '@runiq/core';
import { createTextMeasurer, getDiagramTheme } from '@runiq/core';
import { escapeXml, renderMultilineText } from './renderers/utils.js';

export interface KanbanRenderOptions {
  width?: number;
  columnWidth?: number;
  columnGap?: number;
  rowGap?: number;
  padding?: number;
}

export interface KanbanRenderResult {
  svg: string;
  warnings: string[];
}

const DEFAULTS = {
  margin: 20,
  swimlanePadding: 18,
  columnPadding: 12,
  columnGap: 20,
  rowGap: 12,
  columnMinWidth: 220,
  cardPadding: 10,
  cardMinHeight: 46,
  headerHeight: 28,
  titleFontSize: 13,
  bodyFontSize: 12,
  metaFontSize: 11,
  labelFontSize: 14,
  priorityBarWidth: 6,
};

const PRIORITY_COLORS: Record<string, string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
  critical: '#7f1d1d',
};

function mergeStyle(base: KanbanStyle, override?: KanbanStyle): KanbanStyle {
  return {
    fillColor: override?.fillColor ?? base.fillColor,
    strokeColor: override?.strokeColor ?? base.strokeColor,
    textColor: override?.textColor ?? base.textColor,
    borderRadius: override?.borderRadius ?? base.borderRadius,
  };
}

function wrapText(
  text: string,
  maxWidth: number,
  measureText: (text: string, style: { fontSize?: number; fontFamily?: string }) => {
    width: number;
    height: number;
  },
  fontSize: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];

  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const candidate = `${currentLine} ${words[i]}`;
    const width = measureText(candidate, { fontSize }).width;
    if (width <= maxWidth) {
      currentLine = candidate;
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }

  lines.push(currentLine);
  return lines;
}

function measureCardHeight(
  card: KanbanCard,
  width: number,
  measureText: (text: string, style: { fontSize?: number; fontFamily?: string }) => {
    width: number;
    height: number;
  }
): { height: number; titleLines: string[]; descriptionLines: string[]; metaText: string } {
  const contentWidth = width - DEFAULTS.cardPadding * 2 - DEFAULTS.priorityBarWidth;
  const titleLines = wrapText(card.label, contentWidth, measureText, DEFAULTS.titleFontSize);

  const descriptionLines = card.description
    ? wrapText(card.description, contentWidth, measureText, DEFAULTS.bodyFontSize)
    : [];

  const metaParts: string[] = [];
  if (card.assignee) metaParts.push(card.assignee);
  if (card.estimate) metaParts.push(card.estimate);
  if (card.tags && card.tags.length > 0) metaParts.push(card.tags.join(', '));
  const metaText = metaParts.join(' | ');

  const titleHeight = titleLines.length * DEFAULTS.titleFontSize * 1.2;
  const descriptionHeight =
    descriptionLines.length > 0 ? descriptionLines.length * DEFAULTS.bodyFontSize * 1.2 + 4 : 0;
  const metaHeight = metaText ? DEFAULTS.metaFontSize * 1.2 + 4 : 0;

  const height = Math.max(
    DEFAULTS.cardMinHeight,
    DEFAULTS.cardPadding * 2 + titleHeight + descriptionHeight + metaHeight
  );

  return { height, titleLines, descriptionLines, metaText };
}

function measureColumnWidth(
  column: KanbanColumn,
  measureText: (text: string, style: { fontSize?: number; fontFamily?: string }) => {
    width: number;
    height: number;
  }
): number {
  let maxWidth = measureText(column.label, { fontSize: DEFAULTS.labelFontSize }).width;

  for (const card of column.cards) {
    const cardWidth = measureText(card.label, { fontSize: DEFAULTS.titleFontSize }).width;
    maxWidth = Math.max(maxWidth, cardWidth);
  }

  return Math.max(DEFAULTS.columnMinWidth, maxWidth + DEFAULTS.columnPadding * 2);
}

export function renderKanban(
  profile: KanbanProfile,
  options: KanbanRenderOptions = {}
): KanbanRenderResult {
  const warnings: string[] = [];
  const measureText = createTextMeasurer();

  const theme = getDiagramTheme(profile.theme || 'runiq');
  const baseFill = theme?.backgroundColor || '#f8fafc';
  const baseText = theme?.textColor || '#0f172a';
  const baseStroke = theme?.edgeColor || '#e2e8f0';

  const swimlaneStyle = mergeStyle(
    {
      fillColor: baseFill,
      strokeColor: baseStroke,
      textColor: baseText,
      borderRadius: 12,
    },
    profile.swimlane?.style
  );

  const columnBaseStyle: KanbanStyle = {
    fillColor: theme?.nodeColors?.[0] || '#eef2f7',
    strokeColor: theme?.edgeColor || '#d1d5db',
    textColor: baseText,
    borderRadius: 10,
  };

  const cardBaseStyle: KanbanStyle = {
    fillColor: theme?.nodeColors?.[1] || '#ffffff',
    strokeColor: theme?.edgeColor || '#e2e8f0',
    textColor: baseText,
    borderRadius: 8,
  };

  const columns = profile.columns;
  if (!columns || columns.length === 0) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" role="img" aria-labelledby="diagram-title" data-id="runiq-diagram">
  <title id="diagram-title">${escapeXml(profile.name || 'Kanban')}</title>
  <rect x="0" y="0" width="320" height="180" fill="#ffffff" />
  <text x="20" y="40" font-family="sans-serif" font-size="14" fill="#64748b">No columns defined</text>
</svg>`;
    return { svg, warnings };
  }

  const columnWidths = columns.map((column) =>
    options.columnWidth ? options.columnWidth : measureColumnWidth(column, measureText)
  );
  const columnGap = options.columnGap ?? DEFAULTS.columnGap;
  const rowGap = options.rowGap ?? DEFAULTS.rowGap;
  const padding = options.padding ?? DEFAULTS.swimlanePadding;
  const margin = DEFAULTS.margin;

  const swimlaneLabel = profile.swimlane?.label;
  const swimlaneLabelHeight = swimlaneLabel ? DEFAULTS.labelFontSize * 1.2 : 0;
  const swimlaneLabelGap = swimlaneLabel ? 6 : 0;

  let maxColumnHeight = 0;
  const cardLayouts = new Map<string, { height: number; titleLines: string[]; descriptionLines: string[]; metaText: string }[]>();

  columns.forEach((column, columnIndex) => {
    const width = columnWidths[columnIndex];
    const cardInfo: { height: number; titleLines: string[]; descriptionLines: string[]; metaText: string }[] = [];
    let cardsHeight = 0;

    column.cards.forEach((card) => {
      const info = measureCardHeight(card, width, measureText);
      cardInfo.push(info);
      cardsHeight += info.height;
    });

    if (column.cards.length > 1) {
      cardsHeight += rowGap * (column.cards.length - 1);
    }

    const columnHeight =
      DEFAULTS.columnPadding * 2 +
      DEFAULTS.headerHeight +
      (column.cards.length > 0 ? rowGap : 0) +
      cardsHeight;

    maxColumnHeight = Math.max(maxColumnHeight, columnHeight);
    cardLayouts.set(column.id || `${columnIndex}`, cardInfo);
  });

  const swimlaneHeight =
    padding * 2 + swimlaneLabelHeight + swimlaneLabelGap + maxColumnHeight;

  const swimlaneWidth =
    padding * 2 +
    columnWidths.reduce((sum, width) => sum + width, 0) +
    columnGap * (columns.length - 1);

  const svgWidth = Math.max(options.width || 0, swimlaneWidth + margin * 2);
  const svgHeight = swimlaneHeight + margin * 2;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" role="img" aria-labelledby="diagram-title" data-id="runiq-diagram">`;
  svg += `<title id="diagram-title">${escapeXml(profile.name || 'Kanban')}</title>`;

  const swimlaneX = margin;
  const swimlaneY = margin;
  svg += `<rect x="${swimlaneX}" y="${swimlaneY}" width="${swimlaneWidth}" height="${swimlaneHeight}" rx="${swimlaneStyle.borderRadius}" ry="${swimlaneStyle.borderRadius}" fill="${swimlaneStyle.fillColor}" stroke="${swimlaneStyle.strokeColor}" />`;

  if (swimlaneLabel) {
    const labelX = swimlaneX + padding;
    const labelY = swimlaneY + padding + DEFAULTS.labelFontSize;
    svg += `<text x="${labelX}" y="${labelY}" font-family="sans-serif" font-size="${DEFAULTS.labelFontSize}" font-weight="600" fill="${swimlaneStyle.textColor}">${escapeXml(swimlaneLabel)}</text>`;
  }

  let currentX = swimlaneX + padding;
  const columnsTop =
    swimlaneY + padding + swimlaneLabelHeight + swimlaneLabelGap;

  columns.forEach((column, columnIndex) => {
    const width = columnWidths[columnIndex];
    const columnStyle = mergeStyle(columnBaseStyle, column.style);
    const columnX = currentX;
    const columnY = columnsTop;
    const columnHeight = maxColumnHeight;

    svg += `<rect x="${columnX}" y="${columnY}" width="${width}" height="${columnHeight}" rx="${columnStyle.borderRadius}" ry="${columnStyle.borderRadius}" fill="${columnStyle.fillColor}" stroke="${columnStyle.strokeColor}" />`;

    const headerX = columnX + DEFAULTS.columnPadding;
    const headerY = columnY + DEFAULTS.columnPadding + DEFAULTS.labelFontSize;
    const headerText = column.wipLimit ? `${column.label} (${column.wipLimit})` : column.label;

    svg += `<text x="${headerX}" y="${headerY}" font-family="sans-serif" font-size="${DEFAULTS.labelFontSize}" font-weight="600" fill="${columnStyle.textColor}">${escapeXml(headerText)}</text>`;

    let cardY =
      columnY + DEFAULTS.columnPadding + DEFAULTS.headerHeight + rowGap;

    const cardInfo = cardLayouts.get(column.id || `${columnIndex}`) || [];

    column.cards.forEach((card, cardIndex) => {
      const cardStyle = mergeStyle(cardBaseStyle, card.style);
      const cardHeight = cardInfo[cardIndex]?.height || DEFAULTS.cardMinHeight;
      const cardX = columnX + DEFAULTS.columnPadding;
      const cardWidth = width - DEFAULTS.columnPadding * 2;

      svg += `<rect x="${cardX}" y="${cardY}" width="${cardWidth}" height="${cardHeight}" rx="${cardStyle.borderRadius}" ry="${cardStyle.borderRadius}" fill="${cardStyle.fillColor}" stroke="${cardStyle.strokeColor}" />`;

      if (card.priority) {
        const priorityColor = PRIORITY_COLORS[card.priority] || PRIORITY_COLORS.medium;
        svg += `<rect x="${cardX}" y="${cardY}" width="${DEFAULTS.priorityBarWidth}" height="${cardHeight}" fill="${priorityColor}" rx="${cardStyle.borderRadius}" ry="${cardStyle.borderRadius}" />`;
      }

      const contentX = cardX + DEFAULTS.cardPadding + DEFAULTS.priorityBarWidth;
      let textY = cardY + DEFAULTS.cardPadding + DEFAULTS.titleFontSize;
      const titleLines = cardInfo[cardIndex]?.titleLines || [card.label];
      const descriptionLines = cardInfo[cardIndex]?.descriptionLines || [];
      const metaText = cardInfo[cardIndex]?.metaText || '';

      if (titleLines.length > 0) {
        svg += renderMultilineText(titleLines.join('\n'), contentX, textY, {
          textAnchor: 'start',
          dominantBaseline: 'hanging',
          fontFamily: 'sans-serif',
          fontSize: DEFAULTS.titleFontSize,
          fill: cardStyle.textColor,
          fontWeight: '600',
        });
        textY += titleLines.length * DEFAULTS.titleFontSize * 1.2 + 4;
      }

      if (descriptionLines.length > 0) {
        svg += renderMultilineText(descriptionLines.join('\n'), contentX, textY, {
          textAnchor: 'start',
          dominantBaseline: 'hanging',
          fontFamily: 'sans-serif',
          fontSize: DEFAULTS.bodyFontSize,
          fill: cardStyle.textColor,
        });
        textY += descriptionLines.length * DEFAULTS.bodyFontSize * 1.2 + 4;
      }

      if (metaText) {
        svg += `<text x="${contentX}" y="${textY}" font-family="sans-serif" font-size="${DEFAULTS.metaFontSize}" fill="${cardStyle.textColor}">${escapeXml(metaText)}</text>`;
      }

      cardY += cardHeight + rowGap;
    });

    currentX += width + columnGap;
  });

  svg += '</svg>';

  return { svg, warnings };
}
