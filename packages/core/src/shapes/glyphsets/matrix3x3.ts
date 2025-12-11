import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { createStandardAnchors } from './utils.js';

/**
 * 3x3 Matrix Shape
 *
 * Renders a 3x3 grid with 9 quadrants.
 * Used by the matrix3x3 glyphset for comprehensive analysis.
 *
 * Data structure:
 * {
 *   quadrants: Array<{ label: string, color: string }>,
 *   xAxis?: string,
 *   yAxis?: string
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

export const matrix3x3: ShapeDefinition = {
  id: 'matrix3x3',

  bounds(ctx: ShapeRenderContext) {
    const data = ctx.node.data as any;
    const hasAxes = data?.xAxis || data?.yAxis;

    const width = CELL_SIZE * 3 + (hasAxes ? AXIS_MARGIN : 0);
    const height = CELL_SIZE * 3 + (hasAxes ? AXIS_MARGIN : 0);

    return { width, height };
  },

  anchors(ctx: ShapeRenderContext) {
    const bounds = this.bounds(ctx);
    return createStandardAnchors({ ...bounds, useId: true });
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }) {
    const data = ctx.node.data as any;

    if (!data || !data.quadrants || data.quadrants.length !== 9) {
      return `<text x="${position.x}" y="${position.y}" fill="red">Invalid matrix3x3 data (requires 9 quadrants)</text>`;
    }

    const quadrants = data.quadrants || [];
    const xAxis = data.xAxis || '';
    const yAxis = data.yAxis || '';
    const hasAxes = xAxis || yAxis;

    const gridStartX = position.x + (hasAxes ? AXIS_MARGIN : 0);
    const gridStartY = position.y;

    let svg = '';

    // Render 9 cells in 3x3 grid
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const index = row * 3 + col;
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
    if (yAxis) {
      // Y-axis label (vertical, left side)
      const yLabelX = position.x + 20;
      const yLabelY = gridStartY + (CELL_SIZE * 3) / 2;
      svg += `<text x="${yLabelX}" y="${yLabelY}" text-anchor="middle" dominant-baseline="middle" fill="#666" font-size="14" font-weight="bold" transform="rotate(-90, ${yLabelX}, ${yLabelY})">${yAxis}</text>`;
    }

    if (xAxis) {
      // X-axis label (horizontal, bottom)
      const xLabelX = gridStartX + (CELL_SIZE * 3) / 2;
      const xLabelY = gridStartY + CELL_SIZE * 3 + 40;
      svg += `<text x="${xLabelX}" y="${xLabelY}" text-anchor="middle" fill="#666" font-size="14" font-weight="bold">${xAxis}</text>`;
    }

    return svg;
  },
};
