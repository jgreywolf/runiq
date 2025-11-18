import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

/**
 * Hub Shape - Hub-and-spoke radial diagram
 * Shows central concept with connected peripheral elements
 */
export const hub: ShapeDefinition = {
  id: 'hub',

  bounds: () => ({
    width: 600,
    height: 600,
  }),

  anchors: () => [
    { x: 0, y: 300, name: 'left' },
    { x: 600, y: 300, name: 'right' },
    { x: 300, y: 0, name: 'top' },
    { x: 300, y: 600, name: 'bottom' },
  ],

  render: (
    ctx: ShapeRenderContext,
    position: { x: number; y: number }
  ): string => {
    const data = ctx.node.data as {
      center?: string;
      spokes?: string[];
      colors?: string[];
      bidirectional?: boolean;
    };

    const center = data?.center || 'Hub';
    const spokes = data?.spokes || ['Spoke 1', 'Spoke 2', 'Spoke 3', 'Spoke 4'];
    const colors = data?.colors || [
      '#FF6B6B',
      '#4ECDC4',
      '#FFD93D',
      '#95E1D3',
      '#F38181',
      '#AA96DA',
    ];
    const bidirectional = data?.bidirectional || false;
    const count = Math.min(spokes.length, 8); // Max 8 spokes

    const centerX = 300;
    const centerY = 300;
    const hubRadius = 80;
    const spokeRadius = 200;
    const nodeWidth = 100;
    const nodeHeight = 70;

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

    // Calculate spoke positions
    const spokePositions: Array<{ x: number; y: number; angle: number }> = [];
    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count - Math.PI / 2; // Start at top
      const x = centerX + spokeRadius * Math.cos(angle);
      const y = centerY + spokeRadius * Math.sin(angle);
      spokePositions.push({ x, y, angle });
    }

    // Draw spokes (connections)
    spokePositions.forEach((pos) => {
      const startX = centerX + hubRadius * Math.cos(pos.angle);
      const startY = centerY + hubRadius * Math.sin(pos.angle);

      svg += `<line 
        x1="${startX}" 
        y1="${startY}" 
        x2="${pos.x}" 
        y2="${pos.y}" 
        stroke="#666666" 
        stroke-width="3"
      />`;

      // Arrow head(s)
      const arrowSize = 10;
      const arrowAngle = pos.angle;

      // Arrow pointing outward (always shown)
      svg += `<polygon 
        points="${pos.x},${pos.y} 
                ${pos.x - arrowSize * Math.cos(arrowAngle - Math.PI / 6)},${pos.y - arrowSize * Math.sin(arrowAngle - Math.PI / 6)} 
                ${pos.x - arrowSize * Math.cos(arrowAngle + Math.PI / 6)},${pos.y - arrowSize * Math.sin(arrowAngle + Math.PI / 6)}" 
        fill="#666666"
      />`;

      // Add arrow pointing inward if bidirectional
      if (bidirectional) {
        svg += `<polygon 
          points="${startX},${startY} 
                  ${startX + arrowSize * Math.cos(arrowAngle - Math.PI / 6)},${startY + arrowSize * Math.sin(arrowAngle - Math.PI / 6)} 
                  ${startX + arrowSize * Math.cos(arrowAngle + Math.PI / 6)},${startY + arrowSize * Math.sin(arrowAngle + Math.PI / 6)}" 
          fill="#666666"
        />`;
      }
    });

    // Draw hub (center circle)
    svg += `<circle 
      cx="${centerX}" 
      cy="${centerY}" 
      r="${hubRadius}" 
      fill="#4A90E2" 
      fill-opacity="0.9" 
      stroke="#333333" 
      stroke-width="3"
    />`;

    // Hub label
    const hubLines = wrapText(center, hubRadius * 1.6);
    const hubLineHeight = 16;
    const hubStartY = centerY - ((hubLines.length - 1) * hubLineHeight) / 2;

    hubLines.forEach((line, idx) => {
      svg += `<text 
        x="${centerX}" 
        y="${hubStartY + idx * hubLineHeight}" 
        text-anchor="middle" 
        alignment-baseline="middle" 
        font-family="Arial, sans-serif" 
        font-size="14" 
        font-weight="bold" 
        fill="#FFFFFF"
      >${line}</text>`;
    });

    // Draw spoke nodes
    spokePositions.forEach((pos, idx) => {
      const color = colors[idx] || '#999999';
      const label = spokes[idx] || `Spoke ${idx + 1}`;

      // Node rectangle
      svg += `<rect 
        x="${pos.x - nodeWidth / 2}" 
        y="${pos.y - nodeHeight / 2}" 
        width="${nodeWidth}" 
        height="${nodeHeight}" 
        fill="${color}" 
        fill-opacity="0.9" 
        stroke="#333333" 
        stroke-width="2" 
        rx="5"
      />`;

      // Label
      const lines = wrapText(label, nodeWidth - 10);
      const lineHeight = 14;
      const startY = pos.y - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, lineIdx) => {
        svg += `<text 
          x="${pos.x}" 
          y="${startY + lineIdx * lineHeight}" 
          text-anchor="middle" 
          alignment-baseline="middle" 
          font-family="Arial, sans-serif" 
          font-size="12" 
          font-weight="bold" 
          fill="#333333"
        >${line}</text>`;
      });
    });

    svg += `</g>`;
    return svg;
  },
};
