import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

/**
 * Diverging Shape
 *
 * Renders a single source diverging into multiple destinations.
 * Opposite of converging - one → multiple pattern.
 * Used by the diverging glyphset for branching/distribution patterns.
 *
 * Data format:
 * {
 *   source: { label: string, color: string },
 *   destinations: [
 *     { label: string, color: string },
 *     ...
 *   ]
 * }
 *
 * Visual: Single box on left → arrows diverging → multiple boxes on right
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
  const maxChars = 14;
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
 * Render arrow
 */
function renderArrow(x1: number, y1: number, x2: number, y2: number): string {
  return `
    <defs>
      <marker id="arrowhead-diverging" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
        <polygon points="0,0 10,5 0,10" fill="#666" />
      </marker>
    </defs>
    <line 
      x1="${x1}"
      y1="${y1}"
      x2="${x2}"
      y2="${y2}"
      stroke="#666"
      stroke-width="2"
      marker-end="url(#arrowhead-diverging)"
    />`;
}

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
export const diverging: ShapeDefinition = {
  id: 'diverging',

  bounds: (ctx: ShapeRenderContext): { width: number; height: number } => {
    const destinations =
      (ctx.node.data?.destinations as Array<{
        label: string;
        color: string;
      }>) || [];
    const count = destinations.length;

    // Height scales with number of destinations
    const baseHeight = 100;
    const heightPerDestination = 80;
    const height = Math.max(baseHeight, count * heightPerDestination + 40);

    return { width: 500, height };
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
    const source = ctx.node.data?.source as
      | { label: string; color: string }
      | undefined;
    const destinations =
      (ctx.node.data?.destinations as Array<{
        label: string;
        color: string;
      }>) || [];

    if (!source || destinations.length === 0) {
      return '';
    }

    const bounds = diverging.bounds(ctx);
    const parts: string[] = [];

    const boxWidth = 120;
    const boxHeight = 70;
    const fontSize = 12;
    const leftMargin = 20;
    const rightMargin = 360;
    const verticalSpacing = 80;

    // Render source box on the left (vertically centered)
    const sourceY = position.y + bounds.height / 2 - boxHeight / 2;
    parts.push(
      renderBox(
        position.x + leftMargin,
        sourceY,
        boxWidth,
        boxHeight,
        source.label,
        source.color,
        fontSize
      )
    );

    // Calculate total height of destinations
    const destinationsHeight =
      destinations.length * verticalSpacing - (verticalSpacing - boxHeight);
    const startY = position.y + (bounds.height - destinationsHeight) / 2;

    // Render destination boxes on the right
    destinations.forEach((destination, i) => {
      const y = startY + i * verticalSpacing;
      parts.push(
        renderBox(
          position.x + rightMargin,
          y,
          boxWidth,
          boxHeight,
          destination.label,
          destination.color,
          fontSize
        )
      );

      // Arrow from source to destination
      const sourceRight = position.x + leftMargin + boxWidth;
      const sourceCenterY = sourceY + boxHeight / 2;
      const destLeft = position.x + rightMargin;
      const destCenterY = y + boxHeight / 2;

      parts.push(
        renderArrow(sourceRight, sourceCenterY, destLeft, destCenterY)
      );
    });

    return parts.join('');
  },
};
