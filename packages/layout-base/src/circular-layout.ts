/**
 * Circular Layout Algorithm
 *
 * Arranges nodes in a circle, ideal for:
 * - Circular workflows / cycles
 * - Circular economy diagrams
 * - Lifecycle processes
 * - Feedback loops
 * - Ring topologies
 */

import type { DiagramAst, LaidOutDiagram } from '@runiq/core';

interface CircularLayoutOptions {
  /**
   * Radius of the circle in pixels
   * Auto-calculated based on node count if not provided
   */
  radius?: number;

  /**
   * Starting angle in degrees (0 = top, 90 = right, etc.)
   * Default: 0 (top)
   */
  startAngle?: number;

  /**
   * Direction can be 'clockwise' or 'counterclockwise'
   * Also accepts standard directions TB/LR/etc (ignored for circular)
   */
  direction?: string;

  /**
   * Spacing between nodes in pixels
   * Used to calculate radius if not provided
   */
  spacing?: number;
}

/**
 * Layout nodes in a circle
 */
export function circularLayout(
  diagram: DiagramAst,
  opts: CircularLayoutOptions = {}
): LaidOutDiagram {
  const {
    direction: directionStr = 'clockwise',
    radius: userRadius,
    startAngle = 0,
    spacing = 80,
  } = opts;

  // Parse direction - accept 'clockwise', 'counterclockwise', or standard directions
  const direction =
    directionStr === 'counterclockwise' ? 'counterclockwise' : 'clockwise';

  // Collect all nodes
  const nodes = diagram.nodes || [];

  if (nodes.length === 0) {
    return {
      nodes: [],
      edges: [],
      size: { width: 0, height: 0 },
    };
  }

  // Calculate node dimensions (simplified - use defaults)
  const nodeWidth = 120;
  const nodeHeight = 60;

  // Calculate radius based on node count and spacing if not provided
  const nodeCount = nodes.length;
  const circumference = nodeCount * (nodeWidth + spacing);
  const calculatedRadius = circumference / (2 * Math.PI);
  const radius = userRadius ?? Math.max(calculatedRadius, 150); // Minimum 150px radius

  // Convert start angle to radians
  const startRad = (startAngle * Math.PI) / 180;

  // Position nodes around circle
  const positionedNodes = nodes.map((node, index) => {
    // Calculate angle for this node
    let angle: number;
    if (direction === 'clockwise') {
      angle = startRad + (index / nodeCount) * 2 * Math.PI;
    } else {
      angle = startRad - (index / nodeCount) * 2 * Math.PI;
    }

    // Calculate position (center of circle is at origin, we'll translate later)
    const x = radius * Math.sin(angle);
    const y = -radius * Math.cos(angle); // Negative because SVG y-axis points down

    return {
      ...node, // Preserve all node properties
      x,
      y,
      width: nodeWidth,
      height: nodeHeight,
    };
  });

  // Find bounds to center the diagram
  const xs = positionedNodes.map((n) => n.x);
  const ys = positionedNodes.map((n) => n.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  // Calculate offset to ensure all coordinates are positive with padding
  const padding = 40;
  const offsetX = -minX + nodeWidth / 2 + padding;
  const offsetY = -minY + nodeHeight / 2 + padding;

  // Apply offset
  positionedNodes.forEach((node) => {
    node.x += offsetX;
    node.y += offsetY;
  });

  // Route edges as curved arcs that follow the circular perimeter
  // Center is at the actual center of the offset diagram
  const centerX = offsetX;
  const centerY = offsetY;

  const edges = (diagram.edges || []).map((edge) => {
    const fromNode = positionedNodes.find((n) => n.id === edge.from);
    const toNode = positionedNodes.find((n) => n.id === edge.to);

    if (!fromNode || !toNode) {
      return {
        ...edge, // Preserve edge properties
        id: `${edge.from}-${edge.to}`,
        points: [],
      };
    }

    // Node centers
    const fromCenterX = fromNode.x + fromNode.width / 2;
    const fromCenterY = fromNode.y + fromNode.height / 2;
    const toCenterX = toNode.x + toNode.width / 2;
    const toCenterY = toNode.y + toNode.height / 2;

    // Calculate angles from center for both nodes
    const fromAngle = Math.atan2(fromCenterY - centerY, fromCenterX - centerX);
    const toAngle = Math.atan2(toCenterY - centerY, toCenterX - centerX);

    // Calculate the arc midpoint angle (follow circular direction)
    let angleDiff = toAngle - fromAngle;

    // Always go the shorter way around the circle
    if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

    const midAngle = fromAngle + angleDiff / 2;

    // For circular flow, edges should follow an arc around the perimeter
    // Calculate start and end points at the node edges (not centers)
    const edgeStartRadius = Math.sqrt(
      (fromCenterX - centerX) ** 2 + (fromCenterY - centerY) ** 2
    );
    const edgeEndRadius = Math.sqrt(
      (toCenterX - centerX) ** 2 + (toCenterY - centerY) ** 2
    );

    const fromX = centerX + edgeStartRadius * Math.cos(fromAngle);
    const fromY = centerY + edgeStartRadius * Math.sin(fromAngle);
    const toX = centerX + edgeEndRadius * Math.cos(toAngle);
    const toY = centerY + edgeEndRadius * Math.sin(toAngle);

    // Control point should follow the circular arc at a consistent radius
    // Use slightly larger radius to create visible curve even for adjacent nodes
    const controlRadius = Math.max(edgeStartRadius, edgeEndRadius) * 1.08;
    const controlX = centerX + controlRadius * Math.cos(midAngle);
    const controlY = centerY + controlRadius * Math.sin(midAngle);

    return {
      ...edge, // Preserve edge properties (label, data, etc.)
      id: `${edge.from}-${edge.to}`,
      points: [
        { x: fromX, y: fromY },
        { x: controlX, y: controlY },
        { x: toX, y: toY },
      ],
      // Add thicker stroke for circular flow emphasis (5px looks much better)
      data: {
        ...edge.data,
        strokeWidth: edge.data?.strokeWidth || 5,
      },
    };
  });

  // Calculate final diagram size
  const diagramWidth = maxX - minX + nodeWidth + 2 * padding;
  const diagramHeight = maxY - minY + nodeHeight + 2 * padding;

  return {
    nodes: positionedNodes,
    edges,
    size: {
      width: diagramWidth,
      height: diagramHeight,
    },
  };
}
