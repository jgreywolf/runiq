import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

/**
 * Circle Hierarchy Shape - Concentric circles hierarchy
 * Shows hierarchical levels as nested circles with decreasing node sizes
 */
export const circleHierarchy: ShapeDefinition = {
  id: 'circleHierarchy',

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
      root?: string;
      levels?: Array<{ label: string; items: string[] }>;
      colors?: string[];
    };

    const root = data?.root || 'Root';
    const levels = data?.levels || [
      { label: 'Level 1', items: ['Child 1', 'Child 2', 'Child 3'] },
      { label: 'Level 2', items: ['Node A', 'Node B', 'Node C', 'Node D'] },
    ];
    const colors = data?.colors || ['#4A90E2', '#FF6B6B', '#4ECDC4', '#FFD93D'];

    const centerX = 300;
    const centerY = 300;
    const maxRadius = 270;
    const rootRadius = 60;

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

    // Draw concentric circles for each level
    const levelCount = levels.length;
    const radiusStep = (maxRadius - rootRadius) / (levelCount + 1);

    levels.forEach((level, levelIdx) => {
      const circleRadius = rootRadius + (levelIdx + 1) * radiusStep;

      // Draw circle
      svg += `<circle 
        cx="${centerX}" 
        cy="${centerY}" 
        r="${circleRadius}" 
        fill="none" 
        stroke="#CCCCCC" 
        stroke-width="2" 
        stroke-dasharray="5,5"
      />`;

      // Draw items on this circle
      const itemCount = level.items.length;
      const nodeRadius = Math.max(25, 40 - levelIdx * 5); // Decrease size with each level

      level.items.forEach((item, itemIdx) => {
        const angle = (itemIdx * 2 * Math.PI) / itemCount - Math.PI / 2; // Start at top
        const x = centerX + circleRadius * Math.cos(angle);
        const y = centerY + circleRadius * Math.sin(angle);
        const color = colors[(levelIdx + 1) % colors.length];

        // Node circle
        svg += `<circle 
          cx="${x}" 
          cy="${y}" 
          r="${nodeRadius}" 
          fill="${color}" 
          fill-opacity="0.9" 
          stroke="#333333" 
          stroke-width="2"
        />`;

        // Connection line to center
        svg += `<line 
          x1="${centerX}" 
          y1="${centerY}" 
          x2="${x}" 
          y2="${y}" 
          stroke="#999999" 
          stroke-width="1" 
          opacity="0.3"
        />`;

        // Label
        const lines = wrapText(item, nodeRadius * 1.6);
        const lineHeight = 12;
        const startY = y - ((lines.length - 1) * lineHeight) / 2;

        lines.forEach((line, idx) => {
          svg += `<text 
            x="${x}" 
            y="${startY + idx * lineHeight}" 
            text-anchor="middle" 
            alignment-baseline="middle" 
            font-family="Arial, sans-serif" 
            font-size="11" 
            font-weight="bold" 
            fill="#FFFFFF"
          >${line}</text>`;
        });
      });

      // Level label
      const labelAngle = Math.PI / 4; // 45 degrees
      const labelX = centerX + circleRadius * Math.cos(labelAngle);
      const labelY = centerY + circleRadius * Math.sin(labelAngle);

      svg += `<text 
        x="${labelX}" 
        y="${labelY - 15}" 
        text-anchor="middle" 
        font-family="Arial, sans-serif" 
        font-size="10" 
        fill="#666666" 
        font-style="italic"
      >${level.label}</text>`;
    });

    // Draw root node (center)
    svg += `<circle 
      cx="${centerX}" 
      cy="${centerY}" 
      r="${rootRadius}" 
      fill="${colors[0]}" 
      fill-opacity="0.9" 
      stroke="#333333" 
      stroke-width="3"
    />`;

    // Root label
    const rootLines = wrapText(root, rootRadius * 1.6);
    const rootLineHeight = 16;
    const rootStartY = centerY - ((rootLines.length - 1) * rootLineHeight) / 2;

    rootLines.forEach((line, idx) => {
      svg += `<text 
        x="${centerX}" 
        y="${rootStartY + idx * rootLineHeight}" 
        text-anchor="middle" 
        alignment-baseline="middle" 
        font-family="Arial, sans-serif" 
        font-size="14" 
        font-weight="bold" 
        fill="#FFFFFF"
      >${line}</text>`;
    });

    svg += `</g>`;
    return svg;
  },
};
