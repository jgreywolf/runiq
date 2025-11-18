import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';
import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';

/**
 * 2x2 Matrix Shape
 *
 * Renders a 2x2 grid with 4 quadrants.
 * Used by the matrix glyphset for simple four-quadrant analysis.
 *
 * Data structure:
 * {
 *   quadrants: Array<{ label: string, color: string }>,
 *   horizontalAxis?: string,
 *   verticalAxis?: string
 * }
 */

const CELL_SIZE = 140;
const AXIS_MARGIN = 60;
const GRID_STROKE_WIDTH = 2;

/**
 * Wrap text to fit within a cell
 */
function wrapText(text: string, maxChars: number = 14): string[] {
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

  // Add text
  const lines = wrapText(label, 14);
  const lineHeight = 16;
  const totalTextHeight = lines.length * lineHeight;
  const textStartY = y + height / 2 - totalTextHeight / 2 + lineHeight / 2;

  lines.forEach((line, i) => {
    const textY = textStartY + i * lineHeight;
    svg += `<text x="${x + width / 2}" y="${textY}" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="13" font-weight="500">${line}</text>`;
  });

  return svg;
}

export const matrix: ShapeDefinition = {
  id: 'matrix',

  bounds(ctx: ShapeRenderContext) {
    const data = ctx.node.data as any;
    const hasAxes = data?.horizontalAxis || data?.verticalAxis;

    const width = CELL_SIZE * 2 + (hasAxes ? AXIS_MARGIN : 0);
    const height = CELL_SIZE * 2 + (hasAxes ? AXIS_MARGIN : 0);

    return { width, height };
  },

  anchors(ctx: ShapeRenderContext) {
    const bounds = this.bounds(ctx);
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    return [
      { id: 'top', x: centerX, y: 0 },
      { id: 'right', x: bounds.width, y: centerY },
      { id: 'bottom', x: centerX, y: bounds.height },
      { id: 'left', x: 0, y: centerY },
    ];
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }) {
    const data = ctx.node.data as any;

    if (!data || !data.quadrants || data.quadrants.length !== 4) {
      return `<text x="${position.x}" y="${position.y}" fill="red">Invalid matrix data (requires 4 quadrants)</text>`;
    }

    const quadrants = data.quadrants || [];
    const horizontalAxis = data.horizontalAxis || '';
    const verticalAxis = data.verticalAxis || '';
    const hasAxes = horizontalAxis || verticalAxis;

    const gridStartX = position.x + (hasAxes ? AXIS_MARGIN : 0);
    const gridStartY = position.y;

    let svg = '';

    // Render 4 cells in 2x2 grid
    // Layout: [0, 1]
    //         [2, 3]
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const index = row * 2 + col;
        const quadrant = quadrants[index];

        const cellX = gridStartX + col * CELL_SIZE;
        const cellY = gridStartY + row * CELL_SIZE;

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

    // Render axes labels if provided
    if (verticalAxis) {
      // Y-axis label (vertical, left side)
      const yLabelX = position.x + 20;
      const yLabelY = gridStartY + CELL_SIZE;
      svg += `<text x="${yLabelX}" y="${yLabelY}" text-anchor="middle" dominant-baseline="middle" fill="#666" font-size="14" font-weight="bold" transform="rotate(-90, ${yLabelX}, ${yLabelY})">${verticalAxis}</text>`;
    }

    if (horizontalAxis) {
      // X-axis label (horizontal, bottom)
      const xLabelX = gridStartX + CELL_SIZE;
      const xLabelY = gridStartY + CELL_SIZE * 2 + 40;
      svg += `<text x="${xLabelX}" y="${xLabelY}" text-anchor="middle" fill="#666" font-size="14" font-weight="bold">${horizontalAxis}</text>`;
    }

    return svg;
  },
};
