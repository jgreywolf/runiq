import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

/**
 * Equation Shape - A + B = C relationship formula
 * Shows mathematical or logical relationships between concepts
 */
export const equation: ShapeDefinition = {
  id: 'equation',

  bounds: () => ({
    width: 800,
    height: 200,
  }),

  anchors: () => [
    { x: 0, y: 100, name: 'left' },
    { x: 800, y: 100, name: 'right' },
    { x: 400, y: 0, name: 'top' },
    { x: 400, y: 200, name: 'bottom' },
  ],

  render: (
    ctx: ShapeRenderContext,
    position: { x: number; y: number }
  ): string => {
    const data = ctx.node.data as {
      input?: string[];
      output?: string;
      operator?: string;
      colors?: string[];
    };

    const input = data?.input || ['Input A', 'Input B'];
    const output = data?.output || 'Result';
    const operator = data?.operator || '+';
    const colors = data?.colors || ['#FF6B6B', '#4ECDC4', '#95E1D3'];

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

    const boxWidth = 140;
    const boxHeight = 100;
    const spacing = 20;
    const operatorWidth = 25;

    // Calculate total width and starting position
    const totalWidth =
      input.length * boxWidth +
      (input.length - 1) * (spacing + operatorWidth) +
      spacing +
      operatorWidth +
      boxWidth;
    let currentX = (800 - totalWidth) / 2;

    // Draw input boxes
    input.forEach((item, idx) => {
      const color = colors[idx] || '#999999';
      const boxY = (200 - boxHeight) / 2;

      // Box
      svg += `<rect 
        x="${currentX}" 
        y="${boxY}" 
        width="${boxWidth}" 
        height="${boxHeight}" 
        fill="${color}" 
        fill-opacity="0.8" 
        stroke="#333333" 
        stroke-width="2" 
        rx="5"
      />`;

      // Label
      const lines = wrapText(item, boxWidth - 20);
      const lineHeight = 16;
      const startY =
        boxY + boxHeight / 2 - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, lineIdx) => {
        svg += `<text 
          x="${currentX + boxWidth / 2}" 
          y="${startY + lineIdx * lineHeight}" 
          text-anchor="middle" 
          alignment-baseline="middle" 
          font-family="Arial, sans-serif" 
          font-size="14" 
          font-weight="bold" 
          fill="#333333"
        >${line}</text>`;
      });

      currentX += boxWidth;

      // Draw operator if not last input
      if (idx < input.length - 1) {
        svg += `<text 
          x="${currentX + spacing / 2 + operatorWidth / 2}" 
          y="${100}" 
          text-anchor="middle" 
          alignment-baseline="middle" 
          font-family="Arial, sans-serif" 
          font-size="32" 
          font-weight="bold" 
          fill="#666666"
        >${operator}</text>`;

        currentX += spacing + operatorWidth;
      }
    });

    // Draw equals sign
    currentX += spacing;
    svg += `<text 
      x="${currentX + operatorWidth / 2}" 
      y="${100}" 
      text-anchor="middle" 
      alignment-baseline="middle" 
      font-family="Arial, sans-serif" 
      font-size="32" 
      font-weight="bold" 
      fill="#666666"
    >=</text>`;

    currentX += operatorWidth + spacing;

    // Draw output box
    const outputColor = colors[input.length] || '#95E1D3';
    const boxY = (200 - boxHeight) / 2;

    svg += `<rect 
      x="${currentX}" 
      y="${boxY}" 
      width="${boxWidth}" 
      height="${boxHeight}" 
      fill="${outputColor}" 
      fill-opacity="0.8" 
      stroke="#333333" 
      stroke-width="2" 
      rx="5"
    />`;

    // Output label
    const outputLines = wrapText(output, boxWidth - 20);
    const outputLineHeight = 16;
    const outputStartY =
      boxY + boxHeight / 2 - ((outputLines.length - 1) * outputLineHeight) / 2;

    outputLines.forEach((line, idx) => {
      svg += `<text 
        x="${currentX + boxWidth / 2}" 
        y="${outputStartY + idx * outputLineHeight}" 
        text-anchor="middle" 
        alignment-baseline="middle" 
        font-family="Arial, sans-serif" 
        font-size="14" 
        font-weight="bold" 
        fill="#333333"
      >${line}</text>`;
    });

    svg += `</g>`;
    return svg;
  },
};
