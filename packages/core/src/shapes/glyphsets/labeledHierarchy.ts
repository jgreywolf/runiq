import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

/**
 * Labeled Hierarchy Shape - Tree structure with edge labels
 * Shows hierarchical relationships with labeled connections
 */
export const labeledHierarchy: ShapeDefinition = {
  id: 'labeledHierarchy',

  bounds: () => ({
    width: 700,
    height: 500,
  }),

  anchors: () => [
    { x: 0, y: 250, name: 'left' },
    { x: 700, y: 250, name: 'right' },
    { x: 350, y: 0, name: 'top' },
    { x: 350, y: 500, name: 'bottom' },
  ],

  render: (
    ctx: ShapeRenderContext,
    position: { x: number; y: number }
  ): string => {
    const data = ctx.node.data as {
      root?: any;
      colors?: string[];
    };

    interface HierarchyNode {
      label: string;
      relationship?: string;
      children?: HierarchyNode[];
    }

    const root: HierarchyNode =
      typeof data?.root === 'string'
        ? { label: data.root, children: [] }
        : data?.root || { label: 'Root', children: [] };

    const colors = data?.colors || ['#4A90E2', '#FF6B6B', '#4ECDC4', '#FFD93D'];

    const nodeWidth = 120;
    const nodeHeight = 60;
    const levelHeight = 150;
    const horizontalGap = 20;

    let svg = `<g transform="translate(${position.x}, ${position.y})">`;
    let colorIndex = 0;

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

    // Calculate layout for tree
    const calculateLayout = (node: HierarchyNode, level: number = 0): any => {
      const children = node.children || [];
      const childLayouts = children.map((child) =>
        calculateLayout(child, level + 1)
      );

      const childrenWidth =
        childLayouts.reduce((sum, child) => sum + child.width, 0) +
        Math.max(0, childLayouts.length - 1) * horizontalGap;

      const width = Math.max(nodeWidth, childrenWidth);

      return {
        node,
        level,
        width,
        children: childLayouts,
        colorIdx: colorIndex++,
      };
    };

    // Position nodes based on layout - flattened by level
    const positionNodesByLevel = (
      layout: any,
      startX: number,
      startY: number
    ): any[] => {
      const nodesByLevel: any[][] = [];

      // Collect all nodes organized by level, tracking parent relationships
      const collectByLevel = (
        layoutNode: any,
        level: number,
        parentIdx: number | null
      ) => {
        if (!nodesByLevel[level]) nodesByLevel[level] = [];
        const currentIdx = nodesByLevel.flat().length;
        nodesByLevel[level].push({ ...layoutNode, parentIdx });

        for (const child of layoutNode.children || []) {
          collectByLevel(child, level + 1, currentIdx);
        }
      };

      collectByLevel(layout, 0, null);

      // Position each level
      const positioned: any[] = [];
      let globalIdx = 0;
      nodesByLevel.forEach((levelNodes, level) => {
        const totalWidth =
          levelNodes.reduce((sum, n) => sum + n.width, 0) +
          Math.max(0, levelNodes.length - 1) * horizontalGap;
        let x = startX + (700 - totalWidth) / 2;
        const y = startY + level * levelHeight;

        levelNodes.forEach((layoutNode) => {
          const nodeX = x + layoutNode.width / 2;
          positioned.push({
            ...layoutNode.node,
            x: nodeX,
            y,
            level,
            globalIdx,
            parentIdx: layoutNode.parentIdx,
            colorIdx: layoutNode.colorIdx,
          });
          globalIdx++;
          x += layoutNode.width + horizontalGap;
        });
      });

      return positioned;
    };

    const layout = calculateLayout(root);
    const positioned = positionNodesByLevel(layout, 0, 50);

    // Draw connections first (behind nodes)
    for (let i = 1; i < positioned.length; i++) {
      const node = positioned[i];
      // Find parent by parentIdx
      const parent = positioned.find((p) => p.globalIdx === node.parentIdx);

      if (parent) {
        const parentBottom = parent.y + nodeHeight / 2;
        const childTop = node.y - nodeHeight / 2;

        // Connection line
        svg += `<line 
          x1="${parent.x}" 
          y1="${parentBottom}" 
          x2="${node.x}" 
          y2="${childTop}" 
          stroke="#666666" 
          stroke-width="2"
        />`;

        // Arrow head
        const arrowSize = 8;
        svg += `<polygon 
          points="${node.x},${childTop} 
                  ${node.x - arrowSize},${childTop - arrowSize} 
                  ${node.x + arrowSize},${childTop - arrowSize}" 
          fill="#666666"
        />`;

        // Relationship label on edge (only if relationship exists)
        if (node.relationship) {
          const midX = (parent.x + node.x) / 2;
          const midY = (parentBottom + childTop) / 2;

          svg += `<rect 
            x="${midX - 40}" 
            y="${midY - 10}" 
            width="80" 
            height="20" 
            fill="#FFFFFF" 
            stroke="#CCCCCC" 
            stroke-width="1" 
            rx="3"
          />`;

          svg += `<text 
            x="${midX}" 
            y="${midY}" 
            text-anchor="middle" 
            alignment-baseline="middle" 
            font-family="Arial, sans-serif" 
            font-size="10" 
            font-style="italic" 
            fill="#666666"
          >${node.relationship}</text>`;
        }
      }
    }

    // Draw nodes
    positioned.forEach((node) => {
      const color = colors[node.colorIdx % colors.length];

      // Node rectangle
      svg += `<rect 
        x="${node.x - nodeWidth / 2}" 
        y="${node.y - nodeHeight / 2}" 
        width="${nodeWidth}" 
        height="${nodeHeight}" 
        fill="${color}" 
        fill-opacity="0.9" 
        stroke="#333333" 
        stroke-width="2" 
        rx="5"
      />`;

      // Node label
      const lines = wrapText(node.label, nodeWidth - 10);
      const lineHeight = 14;
      const startY = node.y - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, idx) => {
        svg += `<text 
          x="${node.x}" 
          y="${startY + idx * lineHeight}" 
          text-anchor="middle" 
          alignment-baseline="middle" 
          font-family="Arial, sans-serif" 
          font-size="12" 
          font-weight="bold" 
          fill="white"
        >${line}</text>`;
      });
    });

    svg += `</g>`;
    return svg;
  },
};
