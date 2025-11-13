import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

/**
 * Opposing Shape
 *
 * Renders opposing or conflicting items in visually distinct patterns.
 * Used by the opposing glyphset for conflict/tension visualization.
 *
 * Data format:
 * {
 *   items: [
 *     { label: string, color: string },
 *     ...
 *   ],
 *   pattern: 2 | 3 | 4  // Number of items
 * }
 *
 * Patterns:
 * - 2 items: Horizontal opposition with double-headed arrow
 * - 3 items: Triangle with items at vertices
 * - 4 items: Square with items at corners
 */

/**
 * Wrap text into multiple lines
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

/**
 * Render a box with text
 */
function renderBox(
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  color: string,
  fontSize: number
): string {
  const maxChars = 15;
  const lines = wrapText(label, maxChars);
  const lineHeight = fontSize * 1.4;

  let svg = `
    <rect 
      x="${x}"
      y="${y}"
      width="${width}"
      height="${height}"
      fill="${color}"
      stroke="#333"
      stroke-width="2"
      rx="4"
      opacity="0.9"
    />`;

  // Center text vertically
  const startY = y + height / 2 - ((lines.length - 1) * lineHeight) / 2;

  lines.forEach((line, i) => {
    svg += `
      <text 
        x="${x + width / 2}"
        y="${startY + i * lineHeight}"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="sans-serif"
        font-size="${fontSize}"
        font-weight="600"
        fill="#fff"
      >
        ${line}
      </text>`;
  });

  return svg;
}

/**
 * Render double-headed arrow
 */
function renderDoubleArrow(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string {
  return `
    <defs>
      <marker id="arrowhead-opposing" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
        <polygon points="0,0 10,5 0,10" fill="#666" />
      </marker>
    </defs>
    <line 
      x1="${x1}"
      y1="${y1}"
      x2="${x2}"
      y2="${y2}"
      stroke="#666"
      stroke-width="3"
      stroke-dasharray="5,5"
      marker-start="url(#arrowhead-opposing)"
      marker-end="url(#arrowhead-opposing)"
    />`;
}

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
export const opposing: ShapeDefinition = {
  id: 'opposing',

  bounds: (ctx: ShapeRenderContext): { width: number; height: number } => {
    const pattern = (ctx.node.data?.pattern as number) || 2;

    if (pattern === 2) {
      return { width: 500, height: 120 };
    } else if (pattern === 3) {
      return { width: 400, height: 350 };
    } else {
      return { width: 500, height: 400 };
    }
  },

  anchors: (): { x: number; y: number; name?: string }[] => {
    return [
      { x: 250, y: 0, name: 'top' },
      { x: 500, y: 200, name: 'right' },
      { x: 250, y: 400, name: 'bottom' },
      { x: 0, y: 200, name: 'left' },
    ];
  },

  render: (
    ctx: ShapeRenderContext,
    position: { x: number; y: number }
  ): string => {
    const items =
      (ctx.node.data?.items as Array<{
        label: string;
        color: string;
      }>) || [];
    const pattern = (ctx.node.data?.pattern as number) || 2;

    if (items.length === 0) {
      return '';
    }

    const parts: string[] = [];
    const boxWidth = 140;
    const boxHeight = 80;
    const fontSize = 12;

    if (pattern === 2) {
      // Two items: horizontal opposition with double arrow
      const spacing = 220;
      const y = position.y + 20;
      const leftX = position.x + 20;
      const rightX = position.x + 20 + boxWidth + spacing;

      // Left box
      parts.push(
        renderBox(
          leftX,
          y,
          boxWidth,
          boxHeight,
          items[0].label,
          items[0].color,
          fontSize
        )
      );

      // Right box
      parts.push(
        renderBox(
          rightX,
          y,
          boxWidth,
          boxHeight,
          items[1].label,
          items[1].color,
          fontSize
        )
      );

      // Double-headed arrow
      parts.push(
        renderDoubleArrow(
          leftX + boxWidth,
          y + boxHeight / 2,
          rightX,
          y + boxHeight / 2
        )
      );
    } else if (pattern === 3) {
      // Three items: triangle
      const cx = position.x + 200;
      const cy = position.y + 200;
      const radius = 130;

      // Top
      const topX = cx - boxWidth / 2;
      const topY = cy - radius - boxHeight / 2;
      parts.push(
        renderBox(
          topX,
          topY,
          boxWidth,
          boxHeight,
          items[0].label,
          items[0].color,
          fontSize
        )
      );

      // Bottom left
      const blX = cx - radius * 0.866 - boxWidth / 2;
      const blY = cy + radius / 2 - boxHeight / 2;
      parts.push(
        renderBox(
          blX,
          blY,
          boxWidth,
          boxHeight,
          items[1].label,
          items[1].color,
          fontSize
        )
      );

      // Bottom right
      const brX = cx + radius * 0.866 - boxWidth / 2;
      const brY = cy + radius / 2 - boxHeight / 2;
      parts.push(
        renderBox(
          brX,
          brY,
          boxWidth,
          boxHeight,
          items[2].label,
          items[2].color,
          fontSize
        )
      );

      // Triangle arrows
      parts.push(
        renderDoubleArrow(
          topX + boxWidth / 2,
          topY + boxHeight,
          blX + boxWidth / 2,
          blY
        )
      );
      parts.push(
        renderDoubleArrow(
          blX + boxWidth,
          blY + boxHeight / 2,
          brX,
          brY + boxHeight / 2
        )
      );
      parts.push(
        renderDoubleArrow(
          brX + boxWidth / 2,
          brY,
          topX + boxWidth / 2,
          topY + boxHeight
        )
      );
    } else {
      // Four items: square with diagonals
      const cx = position.x + 250;
      const cy = position.y + 200;
      const offset = 140;

      // Top left
      const tlX = cx - offset - boxWidth / 2;
      const tlY = cy - offset - boxHeight / 2;
      parts.push(
        renderBox(
          tlX,
          tlY,
          boxWidth,
          boxHeight,
          items[0].label,
          items[0].color,
          fontSize
        )
      );

      // Top right
      const trX = cx + offset - boxWidth / 2;
      const trY = cy - offset - boxHeight / 2;
      parts.push(
        renderBox(
          trX,
          trY,
          boxWidth,
          boxHeight,
          items[1].label,
          items[1].color,
          fontSize
        )
      );

      // Bottom right
      const brX = cx + offset - boxWidth / 2;
      const brY = cy + offset - boxHeight / 2;
      parts.push(
        renderBox(
          brX,
          brY,
          boxWidth,
          boxHeight,
          items[2].label,
          items[2].color,
          fontSize
        )
      );

      // Bottom left
      const blX = cx - offset - boxWidth / 2;
      const blY = cy + offset - boxHeight / 2;
      parts.push(
        renderBox(
          blX,
          blY,
          boxWidth,
          boxHeight,
          items[3].label,
          items[3].color,
          fontSize
        )
      );

      // Square perimeter arrows
      parts.push(
        renderDoubleArrow(
          tlX + boxWidth,
          tlY + boxHeight / 2,
          trX,
          trY + boxHeight / 2
        )
      );
      parts.push(
        renderDoubleArrow(
          trX + boxWidth / 2,
          trY + boxHeight,
          brX + boxWidth / 2,
          brY
        )
      );
      parts.push(
        renderDoubleArrow(
          brX,
          brY + boxHeight / 2,
          blX + boxWidth,
          blY + boxHeight / 2
        )
      );
      parts.push(
        renderDoubleArrow(
          blX + boxWidth / 2,
          blY,
          tlX + boxWidth / 2,
          tlY + boxHeight
        )
      );

      // Diagonal arrows
      parts.push(renderDoubleArrow(tlX + boxWidth, tlY + boxHeight, brX, brY));
      parts.push(renderDoubleArrow(trX, trY + boxHeight, blX + boxWidth, blY));
    }

    return parts.join('');
  },
};
