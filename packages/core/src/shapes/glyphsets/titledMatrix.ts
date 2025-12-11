import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { createStandardAnchors } from './utils.js';

/**
 * Titled Matrix Shape
 *
 * Renders a 2x2 or 3x3 matrix with row and column headers.
 * Used by the titledMatrix glyphset.
 *
 * Data structure:
 * {
 *   quadrants: Array<{ label: string, color: string }>,
 *   columnHeaders: string[],
 *   rowHeaders: string[],
 *   size: 2 | 3
 * }
 */

const CELL_SIZE = 130;
const HEADER_SIZE = 80;
const GRID_STROKE_WIDTH = 2;

/**
 * Wrap text to fit within a cell
 */
function wrapText(text: string, maxChars: number = 12): string[] {
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
 * Render a matrix cell
 */
function renderCell(
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  label: string
): string {
  let svg = `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${color}" stroke="#333" stroke-width="${GRID_STROKE_WIDTH}"/>`;

  const lines = wrapText(label, 12);
  const lineHeight = 15;
  const totalTextHeight = lines.length * lineHeight;
  const textStartY = y + height / 2 - totalTextHeight / 2 + lineHeight / 2;

  lines.forEach((line, i) => {
    const textY = textStartY + i * lineHeight;
    svg += `<text x="${x + width / 2}" y="${textY}" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="12" font-weight="500">${line}</text>`;
  });

  return svg;
}

/**
 * Render a header cell
 */
function renderHeader(
  x: number,
  y: number,
  width: number,
  height: number,
  label: string
): string {
  let svg = `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#E0E0E0" stroke="#333" stroke-width="${GRID_STROKE_WIDTH}"/>`;

  const lines = wrapText(label, 10);
  const lineHeight = 14;
  const totalTextHeight = lines.length * lineHeight;
  const textStartY = y + height / 2 - totalTextHeight / 2 + lineHeight / 2;

  lines.forEach((line, i) => {
    const textY = textStartY + i * lineHeight;
    svg += `<text x="${x + width / 2}" y="${textY}" text-anchor="middle" dominant-baseline="middle" fill="#333" font-size="11" font-weight="bold">${line}</text>`;
  });

  return svg;
}

export const titledMatrix: ShapeDefinition = {
  id: 'titledMatrix',

  bounds(ctx: ShapeRenderContext) {
    const data = ctx.node.data as any;
    const size = data?.size || 2;

    const width = HEADER_SIZE + CELL_SIZE * size;
    const height = HEADER_SIZE + CELL_SIZE * size;

    return { width, height };
  },

  anchors(ctx: ShapeRenderContext) {
    const bounds = this.bounds(ctx);
    return createStandardAnchors({ ...bounds, useId: true });
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }) {
    const data = ctx.node.data as any;

    if (!data || !data.quadrants) {
      return `<text x="${position.x}" y="${position.y}" fill="red">Invalid titledMatrix data</text>`;
    }

    const quadrants = data.quadrants || [];
    const columnHeaders = data.columnHeaders || [];
    const rowHeaders = data.rowHeaders || [];
    const size = data.size || 2;

    if (quadrants.length !== size * size) {
      return `<text x="${position.x}" y="${position.y}" fill="red">Invalid quadrant count for ${size}x${size} matrix</text>`;
    }

    let svg = '';

    // Render column headers
    for (let col = 0; col < size; col++) {
      const headerX = position.x + HEADER_SIZE + col * CELL_SIZE;
      const headerY = position.y;

      svg += renderHeader(
        headerX,
        headerY,
        CELL_SIZE,
        HEADER_SIZE,
        columnHeaders[col] || `Col ${col + 1}`
      );
    }

    // Render row headers and cells
    for (let row = 0; row < size; row++) {
      // Row header
      const rowHeaderX = position.x;
      const rowHeaderY = position.y + HEADER_SIZE + row * CELL_SIZE;

      svg += renderHeader(
        rowHeaderX,
        rowHeaderY,
        HEADER_SIZE,
        CELL_SIZE,
        rowHeaders[row] || `Row ${row + 1}`
      );

      // Row cells
      for (let col = 0; col < size; col++) {
        const index = row * size + col;
        const quadrant = quadrants[index];

        const cellX = position.x + HEADER_SIZE + col * CELL_SIZE;
        const cellY = position.y + HEADER_SIZE + row * CELL_SIZE;

        svg += renderCell(
          cellX,
          cellY,
          CELL_SIZE,
          CELL_SIZE,
          quadrant?.color || '#4472C4',
          quadrant?.label || `Q${index + 1}`
        );
      }
    }

    return svg;
  },
};
