import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';

/**
 * Balance (Scale) Shape
 *
 * Renders a balance scale diagram with two sides for comparison.
 * Used by the balance glyphset for pros/cons, cost/benefit analysis.
 *
 * Data format:
 * {
 *   sides: [
 *     { label: string, position: 'left' | 'right', color?: string },
 *     { label: string, position: 'left' | 'right', color?: string }
 *   ]
 * }
 */

/**
 * Wrap text into multiple lines based on max width
 */
function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [text];
}

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
export const balance: ShapeDefinition = {
  id: 'balance',

  bounds: (): { width: number; height: number } => {
    return {
      width: 400,
      height: 300,
    };
  },

  anchors: (): { x: number; y: number; name?: string }[] => {
    return [
      { x: 200, y: 0, name: 'top' },
      { x: 400, y: 150, name: 'right' },
      { x: 200, y: 300, name: 'bottom' },
      { x: 0, y: 150, name: 'left' },
    ];
  },

  render: (
    ctx: ShapeRenderContext,
    position: { x: number; y: number }
  ): string => {
    const sides =
      (ctx.node.data?.sides as Array<{
        label: string;
        position: string;
        color?: string;
      }>) || [];

    if (sides.length !== 2) {
      return '';
    }

    const bounds = balance.bounds(ctx);
    const cx = position.x + bounds.width / 2;
    const cy = position.y + bounds.height / 2;

    const parts: string[] = [];

    // Scale dimensions (base values)
    const fulcrumHeight = 40;
    const fulcrumWidth = 20;
    const beamWidth = 320;
    const beamHeight = 8;
    const basePlateWidth = 120;
    const baseMinHeight = 60;
    const ropeLength = 30;
    const fontSize = 12;
    const padding = 8;
    const maxCharsPerLine = 18; // Approximate chars that fit in base width

    // Wrap text for both sides
    const leftLines = wrapText(sides[0].label, maxCharsPerLine);
    const rightLines = wrapText(sides[1].label, maxCharsPerLine);

    // Calculate needed height based on text lines
    const lineHeight = fontSize * 1.4;
    const leftTextHeight = leftLines.length * lineHeight;
    const rightTextHeight = rightLines.length * lineHeight;
    const maxTextHeight = Math.max(leftTextHeight, rightTextHeight);

    // Calculate plate dimensions (both sides same size for balance)
    const plateHeight = Math.max(baseMinHeight, maxTextHeight + padding * 2);
    const plateWidth = basePlateWidth;

    // Colors (from data or defaults)
    const leftColor = sides[0].color || '#3b82f6'; // blue
    const rightColor = sides[1].color || '#10b981'; // green
    const fulcrumColor = '#666';
    const beamColor = '#888';

    // Fulcrum (triangle base)
    const fulcrumX = cx;
    const fulcrumY = cy + 20;
    parts.push(`
      <polygon 
        points="${fulcrumX},${fulcrumY} ${fulcrumX - fulcrumWidth / 2},${fulcrumY + fulcrumHeight} ${fulcrumX + fulcrumWidth / 2},${fulcrumY + fulcrumHeight}"
        fill="${fulcrumColor}"
        stroke="#333"
        stroke-width="2"
      />`);

    // Beam (horizontal bar)
    const beamY = fulcrumY - beamHeight / 2;
    parts.push(`
      <rect 
        x="${cx - beamWidth / 2}"
        y="${beamY}"
        width="${beamWidth}"
        height="${beamHeight}"
        fill="${beamColor}"
        stroke="#333"
        stroke-width="2"
        rx="4"
      />`);

    // Left plate
    const leftPlateX = cx - beamWidth / 2 + plateWidth / 2;
    const leftPlateY = beamY - ropeLength - plateHeight;

    // Left rope
    parts.push(`
      <line 
        x1="${leftPlateX}"
        y1="${beamY}"
        x2="${leftPlateX}"
        y2="${leftPlateY + plateHeight}"
        stroke="#666"
        stroke-width="2"
      />`);

    // Left plate box
    parts.push(`
      <rect 
        x="${leftPlateX - plateWidth / 2}"
        y="${leftPlateY}"
        width="${plateWidth}"
        height="${plateHeight}"
        fill="${leftColor}"
        stroke="#333"
        stroke-width="2"
        rx="4"
        opacity="0.9"
      />`);

    // Left label (multi-line)
    const leftStartY =
      leftPlateY + plateHeight / 2 - (leftLines.length - 1) * (lineHeight / 2);
    leftLines.forEach((line, i) => {
      parts.push(`
        <text 
          x="${leftPlateX}"
          y="${leftStartY + i * lineHeight}"
          text-anchor="middle"
          dominant-baseline="middle"
          font-family="sans-serif"
          font-size="${fontSize}"
          font-weight="600"
          fill="#fff"
        >
          ${line}
        </text>`);
    });

    // Right plate
    const rightPlateX = cx + beamWidth / 2 - plateWidth / 2;
    const rightPlateY = beamY - ropeLength - plateHeight;

    // Right rope
    parts.push(`
      <line 
        x1="${rightPlateX}"
        y1="${beamY}"
        x2="${rightPlateX}"
        y2="${rightPlateY + plateHeight}"
        stroke="#666"
        stroke-width="2"
      />`);

    // Right plate box
    parts.push(`
      <rect 
        x="${rightPlateX - plateWidth / 2}"
        y="${rightPlateY}"
        width="${plateWidth}"
        height="${plateHeight}"
        fill="${rightColor}"
        stroke="#333"
        stroke-width="2"
        rx="4"
        opacity="0.9"
      />`);

    // Right label (multi-line)
    const rightStartY =
      rightPlateY +
      plateHeight / 2 -
      (rightLines.length - 1) * (lineHeight / 2);
    rightLines.forEach((line, i) => {
      parts.push(`
        <text 
          x="${rightPlateX}"
          y="${rightStartY + i * lineHeight}"
          text-anchor="middle"
          dominant-baseline="middle"
          font-family="sans-serif"
          font-size="${fontSize}"
          font-weight="600"
          fill="#fff"
        >
          ${line}
        </text>`);
    });

    return parts.join('');
  },
};
