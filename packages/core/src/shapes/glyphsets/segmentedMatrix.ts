import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { createStandardAnchors } from './utils.js';

/**
 * Segmented Matrix Shape
 *
 * Renders a 2x2 matrix where each quadrant can be subdivided.
 * Used by the segmentedMatrix glyphset for detailed analysis.
 *
 * Data structure:
 * {
 *   quadrants: Array<{ label: string, color: string, segments?: string[] }>,
 *   xAxis?: string,
 *   yAxis?: string
 * }
 */

const QUADRANT_SIZE = 180;
const SEGMENT_MARGIN = 8;
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
 * Render a quadrant with optional segments
 */
function renderQuadrant(
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  label: string,
  segments: string[] = []
): string {
  let svg = `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${color}" stroke="#333" stroke-width="${GRID_STROKE_WIDTH}"/>`;

  // If no segments, render main label
  if (segments.length === 0) {
    const lines = wrapText(label, 16);
    const lineHeight = 16;
    const totalTextHeight = lines.length * lineHeight;
    const textStartY = y + height / 2 - totalTextHeight / 2 + lineHeight / 2;

    lines.forEach((line, i) => {
      const textY = textStartY + i * lineHeight;
      svg += `<text x="${x + width / 2}" y="${textY}" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="13" font-weight="600">${line}</text>`;
    });
  } else {
    // Render main label at top
    svg += `<text x="${x + width / 2}" y="${y + 20}" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">${label}</text>`;

    // Render segments in 2x2 grid within quadrant
    const segmentWidth = (width - SEGMENT_MARGIN * 3) / 2;
    const segmentHeight = (height - 40 - SEGMENT_MARGIN * 3) / 2;

    for (let i = 0; i < Math.min(4, segments.length); i++) {
      const segRow = Math.floor(i / 2);
      const segCol = i % 2;

      const segX =
        x + SEGMENT_MARGIN + segCol * (segmentWidth + SEGMENT_MARGIN);
      const segY =
        y + 30 + SEGMENT_MARGIN + segRow * (segmentHeight + SEGMENT_MARGIN);

      // Lighter shade of the quadrant color for segments
      svg += `<rect x="${segX}" y="${segY}" width="${segmentWidth}" height="${segmentHeight}" fill="${color}DD" stroke="#fff" stroke-width="1" opacity="0.8"/>`;

      // Segment text
      const segLines = wrapText(segments[i], 10);
      const segLineHeight = 12;
      const segTotalHeight = segLines.length * segLineHeight;
      const segTextStartY =
        segY + segmentHeight / 2 - segTotalHeight / 2 + segLineHeight / 2;

      segLines.forEach((line, j) => {
        const segTextY = segTextStartY + j * segLineHeight;
        svg += `<text x="${segX + segmentWidth / 2}" y="${segTextY}" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="10">${line}</text>`;
      });
    }
  }

  return svg;
}

export const segmentedMatrix: ShapeDefinition = {
  id: 'segmentedMatrix',

  bounds(ctx: ShapeRenderContext) {
    const data = ctx.node.data as any;
    const hasAxes = data?.xAxis || data?.yAxis;

    const width = QUADRANT_SIZE * 2 + (hasAxes ? AXIS_MARGIN : 0);
    const height = QUADRANT_SIZE * 2 + (hasAxes ? AXIS_MARGIN : 0);

    return { width, height };
  },

  anchors(ctx: ShapeRenderContext) {
    const bounds = this.bounds(ctx);
    return createStandardAnchors({ ...bounds, useId: true });
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }) {
    const data = ctx.node.data as any;

    if (!data || !data.quadrants || data.quadrants.length !== 4) {
      return `<text x="${position.x}" y="${position.y}" fill="red">Invalid segmentedMatrix data (requires 4 quadrants)</text>`;
    }

    const quadrants = data.quadrants || [];
    const xAxis = data.xAxis || '';
    const yAxis = data.yAxis || '';
    const hasAxes = xAxis || yAxis;

    const gridStartX = position.x + (hasAxes ? AXIS_MARGIN : 0);
    const gridStartY = position.y;

    let svg = '';

    // Render 4 quadrants in 2x2 grid
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const index = row * 2 + col;
        const quadrant = quadrants[index];

        const quadX = gridStartX + col * QUADRANT_SIZE;
        const quadY = gridStartY + row * QUADRANT_SIZE;

        svg += renderQuadrant(
          quadX,
          quadY,
          QUADRANT_SIZE,
          QUADRANT_SIZE,
          quadrant?.color || '#4472C4',
          quadrant?.label || `Q${index + 1}`,
          quadrant?.segments || []
        );
      }
    }

    // Render axes labels if provided
    if (yAxis) {
      const yLabelX = position.x + 20;
      const yLabelY = gridStartY + QUADRANT_SIZE;
      svg += `<text x="${yLabelX}" y="${yLabelY}" text-anchor="middle" dominant-baseline="middle" fill="#666" font-size="14" font-weight="bold" transform="rotate(-90, ${yLabelX}, ${yLabelY})">${yAxis}</text>`;
    }

    if (xAxis) {
      const xLabelX = gridStartX + QUADRANT_SIZE;
      const xLabelY = gridStartY + QUADRANT_SIZE * 2 + 40;
      svg += `<text x="${xLabelX}" y="${xLabelY}" text-anchor="middle" fill="#666" font-size="14" font-weight="bold">${xAxis}</text>`;
    }

    return svg;
  },
};
