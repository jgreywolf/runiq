import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';

/**
 * Stepped Venn Shape - 3D stacked Venn circles with vertical offset
 * Shows overlapping concepts with depth perception
 */
export const steppedVenn: ShapeDefinition = {
  id: 'steppedVenn',

  bounds: () => ({
    width: 600,
    height: 450,
  }),

  anchors: () => [
    { x: 0, y: 225, name: 'left' },
    { x: 600, y: 225, name: 'right' },
    { x: 300, y: 0, name: 'top' },
    { x: 300, y: 450, name: 'bottom' },
  ],

  render: (
    ctx: ShapeRenderContext,
    position: { x: number; y: number }
  ): string => {
    const data = ctx.node.data as {
      labels?: string[];
      colors?: string[];
    };

    const labels = data?.labels || ['Set A', 'Set B', 'Set C'];
    const colors = data?.colors || ['#FF6B6B', '#4ECDC4', '#FFD93D'];
    const count = Math.min(labels.length, 4); // Max 4 circles

    const baseRadius = 100;
    const stepOffset = 50;
    const horizontalSpacing = 120;

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

    // Draw circles from back to front (reverse order for z-index effect)
    for (let i = count - 1; i >= 0; i--) {
      const cx = 150 + i * horizontalSpacing;
      const cy = 225 + (count - 1 - i) * stepOffset;
      const color = colors[i] || '#999999';
      const label = labels[i] || `Set ${String.fromCharCode(65 + i)}`;

      // Circle with shadow for depth
      svg += `<circle 
        cx="${cx}" 
        cy="${cy}" 
        r="${baseRadius}" 
        fill="${color}" 
        fill-opacity="0.6" 
        stroke="#333333" 
        stroke-width="2"
      />`;

      // Shadow effect
      svg += `<ellipse 
        cx="${cx}" 
        cy="${cy + baseRadius + 10}" 
        rx="${baseRadius * 0.8}" 
        ry="10" 
        fill="#000000" 
        fill-opacity="0.1"
      />`;

      // Label
      const lines = wrapText(label, baseRadius * 1.5);
      const lineHeight = 16;
      const startY = cy - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, idx) => {
        svg += `<text 
          x="${cx}" 
          y="${startY + idx * lineHeight}" 
          text-anchor="middle" 
          alignment-baseline="middle" 
          font-family="Arial, sans-serif" 
          font-size="14" 
          font-weight="bold" 
          fill="#333333"
        >${line}</text>`;
      });
    }

    svg += `</g>`;
    return svg;
  },
};
