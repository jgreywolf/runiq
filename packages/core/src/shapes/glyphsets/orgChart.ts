import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { createStandardAnchors } from './utils.js';

/**
 * Organization Chart Shape - Vertical Tree Layout
 *
 * Renders a complete organizational hierarchy as a single composite shape.
 * Supports themed colors by hierarchy level and custom node shapes.
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

interface OrgChartData {
  hierarchy: OrgNode;
  colors: string[];
  nodeShape?: string;
}

const NODE_WIDTH = 120;
const NODE_HEIGHT = 60;
const HORIZONTAL_SPACING = 20;
const VERTICAL_SPACING = 80;

export const orgChart: ShapeDefinition = {
  id: 'orgChart',

  bounds: (ctx: ShapeRenderContext) => {
    const data = ctx?.node?.data as OrgChartData | undefined;
    if (!data?.hierarchy) {
      return { width: NODE_WIDTH, height: NODE_HEIGHT };
    }

    // Calculate tree dimensions
    const { width, height } = calculateTreeDimensions(data.hierarchy, 0);
    return { width, height };
  },

  anchors: (ctx: ShapeRenderContext) => {
    const bounds = orgChart.bounds(ctx);
    return createStandardAnchors({ ...bounds, useId: true });
  },

  render: (ctx: ShapeRenderContext, position: { x: number; y: number }) => {
    const data = ctx?.node?.data as OrgChartData | undefined;
    if (!data?.hierarchy) {
      return `<rect x="${position.x}" y="${position.y}" width="${NODE_WIDTH}" height="${NODE_HEIGHT}" fill="#f0f0f0" stroke="#666" />`;
    }

    const colors = data.colors || ['#4A90E2', '#50C878', '#FFB84D', '#E74C3C'];
    const nodeShape = data.nodeShape || 'rounded';

    // Calculate all node positions first
    const { width: treeWidth } = calculateTreeDimensions(data.hierarchy, 0);
    const positions = new Map<OrgNode, { x: number; y: number }>();

    // Position nodes relative to (0, 0), then we'll offset by position
    calculateNodePositions(data.hierarchy, treeWidth / 2, 0, 0, positions);

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

    let svg = '<g class="org-chart">';

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
 * Calculate total dimensions needed for the tree
 */
function calculateTreeDimensions(
  node: OrgNode,
  level: number
): { width: number; height: number } {
  if (!node.reports || node.reports.length === 0) {
    return { width: NODE_WIDTH, height: NODE_HEIGHT };
  }

  // Calculate width needed for all children
  let totalChildWidth = 0;
  let maxChildHeight = 0;

  node.reports.forEach((child) => {
    const childDims = calculateTreeDimensions(child, level + 1);
    totalChildWidth += childDims.width + HORIZONTAL_SPACING;
    maxChildHeight = Math.max(maxChildHeight, childDims.height);
  });

  totalChildWidth -= HORIZONTAL_SPACING; // Remove last spacing

  const width = Math.max(NODE_WIDTH, totalChildWidth);
  const height = NODE_HEIGHT + VERTICAL_SPACING + maxChildHeight;

  return { width, height };
}

/**
 * Calculate positions for all nodes in the tree
 */
function calculateNodePositions(
  node: OrgNode,
  x: number,
  y: number,
  level: number,
  positions: Map<OrgNode, { x: number; y: number }>
): void {
  // Store this node's position (centered at x)
  positions.set(node, { x: x - NODE_WIDTH / 2, y });

  // Position children
  if (node.reports && node.reports.length > 0) {
    const childDimensions = node.reports.map((child) =>
      calculateTreeDimensions(child, level + 1)
    );

    const totalChildWidth = childDimensions.reduce(
      (sum, dim, idx) =>
        sum +
        dim.width +
        (idx < childDimensions.length - 1 ? HORIZONTAL_SPACING : 0),
      0
    );

    let childCenterX = x - totalChildWidth / 2;
    const childY = y + NODE_HEIGHT + VERTICAL_SPACING;

    node.reports.forEach((child, idx) => {
      const childWidth = childDimensions[idx].width;
      childCenterX += childWidth / 2;

      calculateNodePositions(child, childCenterX, childY, level + 1, positions);

      childCenterX += childWidth / 2 + HORIZONTAL_SPACING;
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
    const parentCenterX = x + NODE_WIDTH / 2;
    const parentBottomY = y + NODE_HEIGHT;

    node.reports.forEach((child) => {
      const childPos = positions.get(child);
      if (childPos) {
        const childX = childPos.x + offsetX;
        const childY = childPos.y + offsetY;
        const childCenterX = childX + NODE_WIDTH / 2;

        // Draw connecting line
        svg += `<line x1="${parentCenterX}" y1="${parentBottomY}" x2="${childCenterX}" y2="${childY}" stroke="#666" stroke-width="2" />`;

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
