import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { createStandardAnchors } from './utils.js';

/**
 * Puzzle Shape
 *
 * Renders interlocking puzzle pieces in a grid layout.
 * Used by the puzzle glyphset to show how components fit together.
 *
 * Data structure:
 * {
 *   pieces: Array<{ label: string, color: string }>
 * }
 *
 * Layout patterns:
 * - 2 pieces: 2x1 horizontal
 * - 3 pieces: 3x1 horizontal
 * - 4 pieces: 2x2 grid
 * - 5 pieces: 3x2 grid (top row has 3)
 * - 6 pieces: 3x2 grid
 */

const PIECE_WIDTH = 140;
const PIECE_HEIGHT = 100;
const TAB_SIZE = 12; // Size of puzzle tab/slot
const SPACING = 0; // No gap between pieces - they interlock directly

/**
 * Wrap text to fit within a puzzle piece
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
 * Render a puzzle piece with tabs and slots
 */
function renderPuzzlePiece(
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  label: string,
  hasLeftTab: boolean,
  hasRightTab: boolean,
  hasTopTab: boolean,
  hasBottomTab: boolean
): string {
  // Create puzzle piece path with tabs and slots
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const tab = TAB_SIZE;

  let path = `M ${x},${y}`; // Start top-left

  // Top edge with optional tab/slot
  if (hasTopTab) {
    path += ` L ${x + halfWidth - tab},${y}`;
    path += ` L ${x + halfWidth - tab},${y - tab}`;
    path += ` L ${x + halfWidth + tab},${y - tab}`;
    path += ` L ${x + halfWidth + tab},${y}`;
    path += ` L ${x + width},${y}`;
  } else {
    path += ` L ${x + width},${y}`;
  }

  // Right edge with optional tab/slot
  if (hasRightTab) {
    path += ` L ${x + width},${y + halfHeight - tab}`;
    path += ` L ${x + width + tab},${y + halfHeight - tab}`;
    path += ` L ${x + width + tab},${y + halfHeight + tab}`;
    path += ` L ${x + width},${y + halfHeight + tab}`;
    path += ` L ${x + width},${y + height}`;
  } else {
    path += ` L ${x + width},${y + height}`;
  }

  // Bottom edge with optional tab/slot
  if (hasBottomTab) {
    path += ` L ${x + halfWidth + tab},${y + height}`;
    path += ` L ${x + halfWidth + tab},${y + height + tab}`;
    path += ` L ${x + halfWidth - tab},${y + height + tab}`;
    path += ` L ${x + halfWidth - tab},${y + height}`;
    path += ` L ${x},${y + height}`;
  } else {
    path += ` L ${x},${y + height}`;
  }

  // Left edge with optional tab/slot
  if (hasLeftTab) {
    path += ` L ${x},${y + halfHeight + tab}`;
    path += ` L ${x - tab},${y + halfHeight + tab}`;
    path += ` L ${x - tab},${y + halfHeight - tab}`;
    path += ` L ${x},${y + halfHeight - tab}`;
    path += ` L ${x},${y}`;
  } else {
    path += ` Z`;
  }

  let svg = `<path d="${path}" fill="${color}" stroke="#333" stroke-width="2"/>`;

  // Add text
  const lines = wrapText(label, 12);
  const lineHeight = 16;
  const totalTextHeight = lines.length * lineHeight;
  const textStartY = y + height / 2 - totalTextHeight / 2 + lineHeight / 2;

  lines.forEach((line, i) => {
    const textY = textStartY + i * lineHeight;
    svg += `<text x="${x + width / 2}" y="${textY}" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="13" font-weight="500">${line}</text>`;
  });

  return svg;
}

export const puzzle: ShapeDefinition = {
  id: 'puzzle',

  bounds(ctx: ShapeRenderContext) {
    const data = ctx.node.data as any;
    const pieceCount = data?.pieces?.length || 2;

    // Determine grid layout
    let cols = 2;
    let rows = 1;

    if (pieceCount <= 3) {
      cols = pieceCount;
      rows = 1;
    } else if (pieceCount === 4) {
      cols = 2;
      rows = 2;
    } else if (pieceCount === 5 || pieceCount === 6) {
      cols = 3;
      rows = 2;
    }

    const width = cols * PIECE_WIDTH + (cols - 1) * SPACING + TAB_SIZE * 2;
    const height = rows * PIECE_HEIGHT + (rows - 1) * SPACING + TAB_SIZE * 2;

    return { width, height };
  },

  anchors(ctx: ShapeRenderContext) {
    const bounds = this.bounds(ctx);
    return createStandardAnchors({ ...bounds, useId: true });
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }) {
    const data = ctx.node.data as any;

    if (!data || !data.pieces) {
      return `<text x="${position.x}" y="${position.y}" fill="red">Invalid puzzle data</text>`;
    }

    const pieces = data.pieces || [];
    const pieceCount = pieces.length;

    // Determine grid layout
    let cols = 2;
    let rows = 1;

    if (pieceCount <= 3) {
      cols = pieceCount;
      rows = 1;
    } else if (pieceCount === 4) {
      cols = 2;
      rows = 2;
    } else if (pieceCount === 5 || pieceCount === 6) {
      cols = 3;
      rows = 2;
    }

    let svg = '';

    // Render each puzzle piece
    pieces.forEach((piece: any, index: number) => {
      const row = Math.floor(index / cols);
      const col = index % cols;

      const x = position.x + TAB_SIZE + col * (PIECE_WIDTH + SPACING);
      const y = position.y + TAB_SIZE + row * (PIECE_HEIGHT + SPACING);

      // Determine which edges have tabs/slots
      const hasLeftTab = col > 0;
      const hasRightTab = col < cols - 1 && index < pieceCount - 1;
      const hasTopTab = row > 0;
      const hasBottomTab = row < rows - 1 && index + cols < pieceCount;

      svg += renderPuzzlePiece(
        x,
        y,
        PIECE_WIDTH,
        PIECE_HEIGHT,
        piece.color || '#4472C4',
        piece.label || `Piece ${index + 1}`,
        hasLeftTab,
        hasRightTab,
        hasTopTab,
        hasBottomTab
      );
    });

    return svg;
  },
};
