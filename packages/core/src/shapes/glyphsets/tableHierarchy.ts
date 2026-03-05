import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';

/**
 * Table Hierarchy Shape - Tabular rows with hierarchical connections
 * Shows hierarchical data in table format with fan-out connections
 */
export const tableHierarchy: ShapeDefinition = {
  id: 'tableHierarchy',

  bounds: () => ({
    width: 900,
    height: 600,
  }),

  anchors: () => [
    { x: 0, y: 300, name: 'left' },
    { x: 900, y: 300, name: 'right' },
    { x: 450, y: 0, name: 'top' },
    { x: 450, y: 600, name: 'bottom' },
  ],

  render: (
    ctx: ShapeRenderContext,
    position: { x: number; y: number }
  ): string => {
    const data = ctx.node.data as {
      levels?: Array<{ label: string; items: string[] }>;
      colors?: string[];
      showConnections?: boolean;
    };

    const levels = data?.levels || [
      { label: 'Level 1', items: ['Item 1'] },
      { label: 'Level 2', items: ['Item 2.1', 'Item 2.2'] },
      { label: 'Level 3', items: ['Item 3.1', 'Item 3.2', 'Item 3.3'] },
    ];
    const colors = data?.colors || ['#4A90E2', '#FF6B6B', '#4ECDC4', '#FFD93D'];
    const showConnections = data?.showConnections !== false;

    const rowHeight = 80;
    const itemWidth = 160;
    const itemHeight = 60;
    const verticalGap = 40;
    const startY = 50;
    const labelWidth = 120; // Space for level labels on the left
    const leftPadding = 20; // Padding before level label
    const canvasWidth = 900;

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

    // Store positions for connection drawing
    const levelPositions: Array<Array<{ x: number; y: number }>> = [];

    // Draw each level
    levels.forEach((level, levelIdx) => {
      const y = startY + levelIdx * (rowHeight + verticalGap);
      const itemCount = level.items.length;
      const totalWidth = itemCount * itemWidth + (itemCount - 1) * 20;
      const availableWidth = canvasWidth - labelWidth - leftPadding;
      const startX =
        labelWidth +
        leftPadding +
        (availableWidth - totalWidth) / 2 +
        itemWidth / 2;

      const positions: Array<{ x: number; y: number }> = [];

      // Level label (left side)
      const labelLines = wrapText(level.label, labelWidth - 10);
      const labelLineHeight = 14;
      const labelStartY =
        y + itemHeight / 2 - ((labelLines.length - 1) * labelLineHeight) / 2;

      labelLines.forEach((line, idx) => {
        svg += `<text 
          x="${leftPadding}" 
          y="${labelStartY + idx * labelLineHeight}" 
          text-anchor="start" 
          alignment-baseline="middle" 
          font-family="Arial, sans-serif" 
          font-size="12" 
          font-weight="bold" 
          fill="#666666"
        >${line}</text>`;
      });

      // Draw items
      level.items.forEach((item, itemIdx) => {
        const x = startX + itemIdx * (itemWidth + 20);
        positions.push({ x, y: y + itemHeight / 2 });

        const color = colors[levelIdx % colors.length];

        // Item box
        svg += `<rect 
          x="${x - itemWidth / 2}" 
          y="${y}" 
          width="${itemWidth}" 
          height="${itemHeight}" 
          fill="${color}" 
          fill-opacity="0.9" 
          stroke="#333333" 
          stroke-width="2" 
          rx="5"
        />`;

        // Label
        const lines = wrapText(item, itemWidth - 20);
        const lineHeight = 14;
        const textStartY =
          y + itemHeight / 2 - ((lines.length - 1) * lineHeight) / 2;

        lines.forEach((line, idx) => {
          svg += `<text 
            x="${x}" 
            y="${textStartY + idx * lineHeight}" 
            text-anchor="middle" 
            alignment-baseline="middle" 
            font-family="Arial, sans-serif" 
            font-size="12" 
            font-weight="bold" 
            fill="#FFFFFF"
          >${line}</text>`;
        });
      });

      levelPositions.push(positions);
    });

    // Draw connections between levels
    if (showConnections && levelPositions.length > 1) {
      for (let i = 0; i < levelPositions.length - 1; i++) {
        const fromLevel = levelPositions[i];
        const toLevel = levelPositions[i + 1];

        fromLevel.forEach((fromPos) => {
          toLevel.forEach((toPos) => {
            svg += `<line 
              x1="${fromPos.x}" 
              y1="${fromPos.y + itemHeight / 2}" 
              x2="${toPos.x}" 
              y2="${toPos.y - itemHeight / 2}" 
              stroke="#999999" 
              stroke-width="1.5" 
              opacity="0.4"
            />`;
          });
        });
      }
    }

    svg += `</g>`;
    return svg;
  },
};
