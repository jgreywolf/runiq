import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

/**
 * Counterbalance Shape - Weighted balance scale with tilt
 * Shows comparison with visual weight representation
 */
export const counterbalance: ShapeDefinition = {
  id: 'counterbalance',

  bounds: (ctx: ShapeRenderContext) => {
    const data = ctx.node.data as {
      sides?: Array<{ label: string; weight: number; color: string }>;
    };
    const sides = data?.sides || [];
    const maxWeight = Math.max(sides[0]?.weight || 50, sides[1]?.weight || 50);

    return {
      width: 700,
      height: 400,
    };
  },

  anchors: () => [
    { x: 0, y: 200, name: 'left' },
    { x: 700, y: 200, name: 'right' },
    { x: 350, y: 0, name: 'top' },
    { x: 350, y: 400, name: 'bottom' },
  ],

  render: (
    ctx: ShapeRenderContext,
    position: { x: number; y: number }
  ): string => {
    const data = ctx.node.data as {
      left?: { label: string; weight: number; color?: string };
      right?: { label: string; weight: number; color?: string };
    };

    const left = data?.left || {
      label: 'Option A',
      weight: 1,
      color: '#FF6B6B',
    };
    const right = data?.right || {
      label: 'Option B',
      weight: 1,
      color: '#4ECDC4',
    };

    // Calculate tilt angle based on weight ratio
    const totalWeight = left.weight + right.weight;
    const weightRatio = left.weight / totalWeight;
    const maxAngle = 25; // Maximum tilt in degrees
    const angle = (weightRatio - 0.5) * maxAngle * 2; // -25 to +25 degrees

    let svg = `<g transform="translate(${position.x}, ${position.y})">`;

    // Helper function to wrap text
    const wrapText = (text: string, maxWidth: number): string[] => {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (testLine.length * 7 > maxWidth) {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    };

    // Stand base
    svg += `<rect x="270" y="330" width="60" height="80" fill="#666666" stroke="#333333" stroke-width="2"/>`;
    svg += `<rect x="230" y="400" width="140" height="20" fill="#666666" stroke="#333333" stroke-width="2"/>`;

    // Fulcrum (center pivot)
    const fulcrumX = 300;
    const fulcrumY = 330;
    svg += `<circle cx="${fulcrumX}" cy="${fulcrumY}" r="15" fill="#999999" stroke="#333333" stroke-width="2"/>`;

    // Balance beam with rotation
    const beamLength = 200;
    const beamY = fulcrumY - 10;
    svg += `<g transform="rotate(${angle}, ${fulcrumX}, ${fulcrumY})">`;
    svg += `<rect 
      x="${fulcrumX - beamLength}" 
      y="${beamY - 8}" 
      width="${beamLength * 2}" 
      height="16" 
      fill="#8B7355" 
      stroke="#333333" 
      stroke-width="2"
    />`;

    // Left side
    const leftX = fulcrumX - beamLength;
    const leftPlateY = beamY - 100;

    // Left chain
    svg += `<line 
      x1="${leftX}" 
      y1="${beamY}" 
      x2="${leftX}" 
      y2="${leftPlateY}" 
      stroke="#666666" 
      stroke-width="3"
    />`;

    // Left plate
    const leftPlateWidth = 120;
    const leftPlateHeight = 80;
    svg += `<rect 
      x="${leftX - leftPlateWidth / 2}" 
      y="${leftPlateY - leftPlateHeight}" 
      width="${leftPlateWidth}" 
      height="${leftPlateHeight}" 
      fill="${left.color}" 
      fill-opacity="0.8" 
      stroke="#333333" 
      stroke-width="2" 
      rx="5"
    />`;

    // Left label
    const leftLines = wrapText(left.label, leftPlateWidth - 10);
    const leftLineHeight = 16;
    const leftStartY =
      leftPlateY -
      leftPlateHeight / 2 -
      ((leftLines.length - 1) * leftLineHeight) / 2;

    leftLines.forEach((line, idx) => {
      svg += `<text 
        x="${leftX}" 
        y="${leftStartY + idx * leftLineHeight}" 
        text-anchor="middle" 
        alignment-baseline="middle" 
        font-family="Arial, sans-serif" 
        font-size="14" 
        font-weight="bold" 
        fill="#333333"
      >${line}</text>`;
    });

    // Left weight indicator
    svg += `<text 
      x="${leftX}" 
      y="${leftPlateY - leftPlateHeight - 15}" 
      text-anchor="middle" 
      font-family="Arial, sans-serif" 
      font-size="12" 
      fill="#666666"
    >Weight: ${left.weight}</text>`;

    // Right side
    const rightX = fulcrumX + beamLength;
    const rightPlateY = beamY - 100;

    // Right chain
    svg += `<line 
      x1="${rightX}" 
      y1="${beamY}" 
      x2="${rightX}" 
      y2="${rightPlateY}" 
      stroke="#666666" 
      stroke-width="3"
    />`;

    // Right plate
    const rightPlateWidth = 120;
    const rightPlateHeight = 80;
    svg += `<rect 
      x="${rightX - rightPlateWidth / 2}" 
      y="${rightPlateY - rightPlateHeight}" 
      width="${rightPlateWidth}" 
      height="${rightPlateHeight}" 
      fill="${right.color}" 
      fill-opacity="0.8" 
      stroke="#333333" 
      stroke-width="2" 
      rx="5"
    />`;

    // Right label
    const rightLines = wrapText(right.label, rightPlateWidth - 10);
    const rightLineHeight = 16;
    const rightStartY =
      rightPlateY -
      rightPlateHeight / 2 -
      ((rightLines.length - 1) * rightLineHeight) / 2;

    rightLines.forEach((line, idx) => {
      svg += `<text 
        x="${rightX}" 
        y="${rightStartY + idx * rightLineHeight}" 
        text-anchor="middle" 
        alignment-baseline="middle" 
        font-family="Arial, sans-serif" 
        font-size="14" 
        font-weight="bold" 
        fill="#333333"
      >${line}</text>`;
    });

    // Right weight indicator
    svg += `<text 
      x="${rightX}" 
      y="${rightPlateY - rightPlateHeight - 15}" 
      text-anchor="middle" 
      font-family="Arial, sans-serif" 
      font-size="12" 
      fill="#666666"
    >Weight: ${right.weight}</text>`;

    svg += `</g>`; // End rotation group

    svg += `</g>`;
    return svg;
  },
};
