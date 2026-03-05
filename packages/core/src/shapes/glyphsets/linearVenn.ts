import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';

/**
 * Linear Venn Shape - Horizontal overlapping circles
 * Shows progressive relationship between sets
 */
export const linearVenn: ShapeDefinition = {
  id: 'linearVenn',

  bounds: (ctx: ShapeRenderContext) => {
    const data = ctx.node.data as {
      labels?: string[];
      overlap?: number;
    };
    const count = Math.min((data?.labels || []).length, 4);
    const overlap = data?.overlap || 0.3;
    const radius = 80;

    // Calculate total width based on overlap
    const effectiveSpacing = radius * 2 * (1 - overlap);
    const totalWidth = radius * 2 + effectiveSpacing * (count - 1) + 100; // 100px padding

    return {
      width: totalWidth,
      height: 250,
    };
  },

  anchors: (ctx: ShapeRenderContext) => {
    const data = ctx.node.data as {
      labels?: string[];
      overlap?: number;
    };
    const count = Math.min((data?.labels || []).length, 4);
    const overlap = data?.overlap || 0.3;
    const radius = 80;
    const effectiveSpacing = radius * 2 * (1 - overlap);
    const totalWidth = radius * 2 + effectiveSpacing * (count - 1) + 100;

    return [
      { x: 0, y: 125, name: 'left' },
      { x: totalWidth, y: 125, name: 'right' },
      { x: totalWidth / 2, y: 0, name: 'top' },
      { x: totalWidth / 2, y: 250, name: 'bottom' },
    ];
  },

  render: (
    ctx: ShapeRenderContext,
    position: { x: number; y: number }
  ): string => {
    const data = ctx.node.data as {
      labels?: string[];
      colors?: string[];
      overlap?: number;
    };

    const labels = data?.labels || ['Set A', 'Set B', 'Set C'];
    const colors = data?.colors || ['#FF6B6B', '#4ECDC4', '#FFD93D'];
    const overlap = data?.overlap || 0.3; // 0-1, how much circles overlap
    const count = Math.min(labels.length, 4); // Max 4 circles

    const radius = 80;
    const effectiveSpacing = radius * 2 * (1 - overlap);
    const startX = 50 + radius; // Start with padding

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

    // Draw circles
    for (let i = 0; i < count; i++) {
      const cx = startX + i * effectiveSpacing;
      const cy = 125;
      const color = colors[i] || '#999999';
      const label = labels[i] || `Set ${String.fromCharCode(65 + i)}`;

      // Circle
      svg += `<circle 
        cx="${cx}" 
        cy="${cy}" 
        r="${radius}" 
        fill="${color}" 
        fill-opacity="0.5" 
        stroke="#333333" 
        stroke-width="2"
      />`;

      // Label
      const lines = wrapText(label, radius * 1.5);
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
