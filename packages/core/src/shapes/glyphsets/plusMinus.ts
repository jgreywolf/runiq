import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { createStandardAnchors } from './utils.js';

/**
 * Plus/Minus Shape
 *
 * Renders a pros/cons comparison with items on left (plus) and right (minus).
 * Used by the plusMinus glyphset for decision analysis.
 *
 * Data structure:
 * {
 *   plus: Array<{ label: string, color: string }>,
 *   minus: Array<{ label: string, color: string }>
 * }
 *
 * Visual: Left column with + symbols, central divider, right column with - symbols
 */

const BOX_WIDTH = 180;
const BOX_HEIGHT = 60;
const VERTICAL_SPACING = 15;
const COLUMN_GAP = 80;
const DIVIDER_WIDTH = 40;
const SYMBOL_SIZE = 20;

/**
 * Wrap text to fit within a box
 */
function wrapText(text: string, maxChars: number = 18): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (currentLine.length === 0) {
      currentLine = word;
    } else if ((currentLine + ' ' + word).length <= maxChars) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Render a box with text and symbol
 */
function renderBox(
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  label: string,
  symbol: '+' | '-'
): string {
  let svg = `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${color}" stroke="#333" stroke-width="2" rx="4"/>`;

  // Add symbol
  const symbolX = x + 15;
  const symbolY = y + height / 2;
  svg += `<text x="${symbolX}" y="${symbolY}" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="${SYMBOL_SIZE}" font-weight="bold">${symbol}</text>`;

  // Add text
  const lines = wrapText(label, 18);
  const lineHeight = 14;
  const totalTextHeight = lines.length * lineHeight;
  const textStartY = y + height / 2 - totalTextHeight / 2 + lineHeight / 2;
  const textX = x + 35; // After symbol

  lines.forEach((line, i) => {
    const textY = textStartY + i * lineHeight;
    svg += `<text x="${textX}" y="${textY}" text-anchor="start" dominant-baseline="middle" fill="#fff" font-size="12" font-weight="500">${line}</text>`;
  });

  return svg;
}

/**
 * Render central divider with labels
 */
function renderDivider(x: number, y: number, height: number): string {
  const centerX = x + DIVIDER_WIDTH / 2;

  let svg = `<line x1="${centerX}" y1="${y}" x2="${centerX}" y2="${y + height}" stroke="#666" stroke-width="3"/>`;

  // Add "PROS" label at top
  svg += `<text x="${centerX}" y="${y - 10}" text-anchor="middle" fill="#2E7D32" font-size="14" font-weight="bold">PROS</text>`;

  // Add "CONS" label at top
  svg += `<text x="${centerX}" y="${y - 10}" text-anchor="middle" fill="#C62828" font-size="14" font-weight="bold" dx="100">CONS</text>`;

  return svg;
}

export const plusMinus: ShapeDefinition = {
  id: 'plusMinus',

  bounds(ctx: ShapeRenderContext) {
    const data = ctx.node.data as any;
    const plusCount = data?.plus?.length || 1;
    const minusCount = data?.minus?.length || 1;
    const maxCount = Math.max(plusCount, minusCount);

    const width = BOX_WIDTH * 2 + COLUMN_GAP + DIVIDER_WIDTH;
    const height = maxCount * (BOX_HEIGHT + VERTICAL_SPACING) + 30; // 30 for label space

    return { width, height };
  },

  anchors(ctx: ShapeRenderContext) {
    const bounds = this.bounds(ctx);
    return createStandardAnchors({ ...bounds, useId: true });
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }) {
    const data = ctx.node.data as any;

    if (!data || !data.plus || !data.minus) {
      return `<text x="${position.x}" y="${position.y}" fill="red">Invalid plusMinus data</text>`;
    }

    const plusItems = data.plus || [];
    const minusItems = data.minus || [];
    const maxCount = Math.max(plusItems.length, minusItems.length);

    const startY = position.y + 30; // Space for labels
    let svg = '';

    // Render divider
    const dividerX = position.x + BOX_WIDTH + COLUMN_GAP / 2;
    const dividerHeight = maxCount * (BOX_HEIGHT + VERTICAL_SPACING);
    svg += renderDivider(dividerX, startY, dividerHeight);

    // Render plus items (left column)
    plusItems.forEach((item: any, index: number) => {
      const x = position.x;
      const y = startY + index * (BOX_HEIGHT + VERTICAL_SPACING);

      svg += renderBox(
        x,
        y,
        BOX_WIDTH,
        BOX_HEIGHT,
        item.color || '#2E7D32',
        item.label || `Plus ${index + 1}`,
        '+'
      );
    });

    // Render minus items (right column)
    minusItems.forEach((item: any, index: number) => {
      const x = position.x + BOX_WIDTH + COLUMN_GAP + DIVIDER_WIDTH;
      const y = startY + index * (BOX_HEIGHT + VERTICAL_SPACING);

      svg += renderBox(
        x,
        y,
        BOX_WIDTH,
        BOX_HEIGHT,
        item.color || '#C62828',
        item.label || `Minus ${index + 1}`,
        '-'
      );
    });

    return svg;
  },
};
