import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';

/**
 * Horizontal Organization Chart Shape - Left-to-Right Layout
 *
 * Renders a complete organizational hierarchy as a single composite shape
 * with horizontal (left-to-right) layout.
 *
 * Expected data structure:
 * {
 *   hierarchy: OrgNode (recursive tree structure),
 *   colors: string[] (theme colors by level),
 *   nodeShape: 'rect' | 'rounded' | 'hexagon'
 * }
 */

interface OrgNode {
  name: string;
  role?: string;
  reports?: OrgNode[];
}

interface HorizontalOrgChartData {
  hierarchy: OrgNode;
  colors: string[];
  nodeShape?: string;
}

const NODE_WIDTH = 120;
const NODE_HEIGHT = 60;
const HORIZONTAL_SPACING = 80;
const VERTICAL_SPACING = 20;

export const horizontalOrgChart: ShapeDefinition = {
  id: 'horizontalOrgChart',

  bounds: (ctx: ShapeRenderContext) => {
    const data = ctx?.node?.data as HorizontalOrgChartData | undefined;
    if (!data?.hierarchy) {
      return { width: NODE_WIDTH, height: NODE_HEIGHT };
    }

    // Calculate tree dimensions (width/height swapped for horizontal)
    const { width, height } = calculateTreeDimensions(data.hierarchy, 0);
    return { width, height };
  },

  anchors: (ctx: ShapeRenderContext) => {
    const bounds = horizontalOrgChart.bounds(ctx);
    const { width, height } = bounds;
    return [
      { id: 'top', x: width / 2, y: 0 },
      { id: 'right', x: width, y: height / 2 },
      { id: 'bottom', x: width / 2, y: height },
      { id: 'left', x: 0, y: height / 2 },
    ];
  },

  render: (ctx: ShapeRenderContext, position: { x: number; y: number }) => {
    const data = ctx?.node?.data as HorizontalOrgChartData | undefined;
    if (!data?.hierarchy) {
      return `<rect x="${position.x}" y="${position.y}" width="${NODE_WIDTH}" height="${NODE_HEIGHT}" fill="#f0f0f0" stroke="#666" />`;
    }

    const colors = data.colors || ['#4A90E2', '#50C878', '#FFB84D', '#E74C3C'];
    const nodeShape = data.nodeShape || 'rounded';

    // Calculate all node positions first
    const { height: treeHeight } = calculateTreeDimensions(data.hierarchy, 0);
    const positions = new Map<OrgNode, { x: number; y: number }>();

    // Position nodes relative to (0, 0), then we'll offset by position
    calculateNodePositions(data.hierarchy, 0, treeHeight / 2, 0, positions);

    // Find the actual bounds of all positioned nodes
    let minX = Infinity;
    let minY = Infinity;
    positions.forEach((pos) => {
      minX = Math.min(minX, pos.x);
      minY = Math.min(minY, pos.y);
    });

    // Offset to ensure all nodes are within bounds starting at position
    const offsetX = position.x - minX;
    const offsetY = position.y - minY;

    let svg = '<g class="horizontal-org-chart">';

    // Render tree with corrected positions
    svg += renderNodeWithPositions(
      data.hierarchy,
      0,
      colors,
      nodeShape,
      positions,
      offsetX,
      offsetY
    );

    svg += '</g>';
    return svg;
  },
};

/**
 * Calculate total dimensions needed for the tree (horizontal layout)
 */
function calculateTreeDimensions(
  node: OrgNode,
  level: number
): { width: number; height: number } {
  if (!node.reports || node.reports.length === 0) {
    return { width: NODE_WIDTH, height: NODE_HEIGHT };
  }

  // Calculate height needed for all children (vertical stacking in horizontal layout)
  let totalChildHeight = 0;
  let maxChildWidth = 0;

  node.reports.forEach((child) => {
    const childDims = calculateTreeDimensions(child, level + 1);
    totalChildHeight += childDims.height + VERTICAL_SPACING;
    maxChildWidth = Math.max(maxChildWidth, childDims.width);
  });

  totalChildHeight -= VERTICAL_SPACING; // Remove last spacing

  const height = Math.max(NODE_HEIGHT, totalChildHeight);
  const width = NODE_WIDTH + HORIZONTAL_SPACING + maxChildWidth;

  return { width, height };
}

/**
 * Calculate positions for all nodes in the tree (horizontal layout)
 */
function calculateNodePositions(
  node: OrgNode,
  x: number,
  y: number,
  level: number,
  positions: Map<OrgNode, { x: number; y: number }>
): void {
  // Store this node's position (centered at y)
  positions.set(node, { x, y: y - NODE_HEIGHT / 2 });

  // Position children
  if (node.reports && node.reports.length > 0) {
    const childDimensions = node.reports.map((child) =>
      calculateTreeDimensions(child, level + 1)
    );

    const totalChildHeight = childDimensions.reduce(
      (sum, dim, idx) =>
        sum +
        dim.height +
        (idx < childDimensions.length - 1 ? VERTICAL_SPACING : 0),
      0
    );

    const childX = x + NODE_WIDTH + HORIZONTAL_SPACING;
    let childCenterY = y - totalChildHeight / 2;

    node.reports.forEach((child, idx) => {
      const childHeight = childDimensions[idx].height;
      childCenterY += childHeight / 2;

      calculateNodePositions(child, childX, childCenterY, level + 1, positions);

      childCenterY += childHeight / 2 + VERTICAL_SPACING;
    });
  }
}

/**
 * Render nodes using pre-calculated positions
 */
function renderNodeWithPositions(
  node: OrgNode,
  level: number,
  colors: string[],
  nodeShape: string,
  positions: Map<OrgNode, { x: number; y: number }>,
  offsetX: number,
  offsetY: number
): string {
  let svg = '';
  const color = colors[level % colors.length];
  const pos = positions.get(node);
  if (!pos) return svg;

  const x = pos.x + offsetX;
  const y = pos.y + offsetY;

  // Render current node
  svg += renderNodeBox(x, y, node.name, node.role, color, nodeShape);

  // Render children and connecting lines
  if (node.reports && node.reports.length > 0) {
    const parentRightX = x + NODE_WIDTH;
    const parentCenterY = y + NODE_HEIGHT / 2;

    node.reports.forEach((child) => {
      const childPos = positions.get(child);
      if (childPos) {
        const childX = childPos.x + offsetX;
        const childY = childPos.y + offsetY;
        const childCenterY = childY + NODE_HEIGHT / 2;

        // Draw connecting line
        svg += `<line x1="${parentRightX}" y1="${parentCenterY}" x2="${childX}" y2="${childCenterY}" stroke="#666" stroke-width="2" />`;

        // Render child subtree
        svg += renderNodeWithPositions(
          child,
          level + 1,
          colors,
          nodeShape,
          positions,
          offsetX,
          offsetY
        );
      }
    });
  }

  return svg;
}

/**
 * Render a single node box
 */
function renderNodeBox(
  x: number,
  y: number,
  name: string,
  role: string | undefined,
  color: string,
  shape: string
): string {
  let svg = '';

  // Render shape
  switch (shape) {
    case 'hexagon':
      svg += renderHexagon(x, y, color);
      break;
    case 'rect':
      svg += `<rect x="${x}" y="${y}" width="${NODE_WIDTH}" height="${NODE_HEIGHT}" fill="${color}" stroke="#666" stroke-width="2" rx="0" />`;
      break;
    case 'rounded':
    default:
      svg += `<rect x="${x}" y="${y}" width="${NODE_WIDTH}" height="${NODE_HEIGHT}" fill="${color}" stroke="#666" stroke-width="2" rx="8" />`;
      break;
  }

  // Render text
  svg += `<text x="${x + NODE_WIDTH / 2}" y="${y + NODE_HEIGHT / 2 - (role ? 8 : 0)}" text-anchor="middle" dominant-baseline="middle" fill="#000" font-size="12" font-weight="bold">${escapeXml(name)}</text>`;

  if (role) {
    svg += `<text x="${x + NODE_WIDTH / 2}" y="${y + NODE_HEIGHT / 2 + 12}" text-anchor="middle" dominant-baseline="middle" fill="#000" font-size="10">${escapeXml(role)}</text>`;
  }

  return svg;
}

/**
 * Render hexagon shape
 */
function renderHexagon(x: number, y: number, color: string): string {
  const cx = x + NODE_WIDTH / 2;
  const cy = y + NODE_HEIGHT / 2;
  const rx = NODE_WIDTH / 2;
  const ry = NODE_HEIGHT / 2;

  const points = [
    [cx - rx * 0.5, cy - ry],
    [cx + rx * 0.5, cy - ry],
    [cx + rx, cy],
    [cx + rx * 0.5, cy + ry],
    [cx - rx * 0.5, cy + ry],
    [cx - rx, cy],
  ]
    .map((p) => `${p[0]},${p[1]}`)
    .join(' ');

  return `<polygon points="${points}" fill="${color}" stroke="#666" stroke-width="2" />`;
}

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
