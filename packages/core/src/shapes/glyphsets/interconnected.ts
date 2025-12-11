import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';

/**
 * Interconnected Shape - Mesh network with all-to-all connections
 * Shows complex interdependencies between elements
 */
export const interconnected: ShapeDefinition = {
  id: 'interconnected',

  bounds: () => ({
    width: 500,
    height: 500,
  }),

  anchors: () => [
    { x: 0, y: 250, name: 'left' },
    { x: 500, y: 250, name: 'right' },
    { x: 250, y: 0, name: 'top' },
    { x: 250, y: 500, name: 'bottom' },
  ],

  render: (
    ctx: ShapeRenderContext,
    position: { x: number; y: number }
  ): string => {
    const data = ctx.node.data as {
      items?: string[];
      colors?: string[];
      showAllConnections?: boolean;
    };

    const items = data?.items || ['Node 1', 'Node 2', 'Node 3', 'Node 4'];
    const colors = data?.colors || ['#FF6B6B', '#4ECDC4', '#FFD93D', '#95E1D3'];
    const showAllConnections = data?.showAllConnections !== false;
    const count = Math.min(items.length, 8); // Max 8 nodes

    const centerX = 250;
    const centerY = 250;
    const radius = 180;
    const nodeRadius = 50;

    let svg = `<g transform="translate(${position.x}, ${position.y})">`;

    // Helper function to wrap text
    const wrapText = (text: string, maxWidth: number): string[] => {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (testLine.length * 6 > maxWidth) {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    };

    // Calculate node positions around circle
    const nodePositions: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count - Math.PI / 2; // Start at top
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      nodePositions.push({ x, y });
    }

    // Draw connections (all-to-all mesh)
    if (showAllConnections) {
      svg += `<g opacity="0.3">`;
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          svg += `<line 
            x1="${nodePositions[i].x}" 
            y1="${nodePositions[i].y}" 
            x2="${nodePositions[j].x}" 
            y2="${nodePositions[j].y}" 
            stroke="#666666" 
            stroke-width="2"
          />`;
        }
      }
      svg += `</g>`;
    }

    // Draw nodes
    for (let i = 0; i < count; i++) {
      const pos = nodePositions[i];
      const color = colors[i] || '#999999';
      const label = items[i] || `Node ${i + 1}`;

      // Node circle
      svg += `<circle 
        cx="${pos.x}" 
        cy="${pos.y}" 
        r="${nodeRadius}" 
        fill="${color}" 
        fill-opacity="0.9" 
        stroke="#333333" 
        stroke-width="2"
      />`;

      // Label
      const lines = wrapText(label, nodeRadius * 1.6);
      const lineHeight = 14;
      const startY = pos.y - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, idx) => {
        svg += `<text 
          x="${pos.x}" 
          y="${startY + idx * lineHeight}" 
          text-anchor="middle" 
          alignment-baseline="middle" 
          font-family="Arial, sans-serif" 
          font-size="12" 
          font-weight="bold" 
          fill="#FFFFFF"
        >${line}</text>`;
      });
    }

    svg += `</g>`;
    return svg;
  },
};
