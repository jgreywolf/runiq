import ELK, { ElkNode, ElkExtendedEdge } from 'elkjs/lib/elk.bundled.js';
import type {
  DiagramAst,
  LayoutEngine,
  LayoutOptions,
  LaidOutDiagram,
  PositionedNode,
  RoutedEdge,
} from '@runiq/core';
import { shapeRegistry, createTextMeasurer } from '@runiq/core';

/**
 * ELK (Eclipse Layout Kernel) layout engine adapter for Runiq.
 * Provides superior layout quality compared to Dagre with multiple algorithms.
 */
export class ElkLayoutEngine implements LayoutEngine {
  id = 'elk';
  supportsManualPositions = true;
  private elk: InstanceType<typeof ELK>;

  constructor() {
    this.elk = new ELK();
  }

  async layout(
    diagram: DiagramAst,
    opts: LayoutOptions = {}
  ): Promise<LaidOutDiagram> {
    // Handle empty diagram
    if (diagram.nodes.length === 0) {
      return {
        nodes: [],
        edges: [],
        size: { width: 0, height: 0 },
      };
    }

    const measureText = createTextMeasurer();

    // Convert direction: TB/LR -> DOWN/RIGHT
    const direction = this.convertDirection(
      opts.direction || diagram.direction || 'TB'
    );
    const spacing = opts.spacing || 80;

    // Build ELK graph structure
    const elkGraph = {
      id: 'root',
      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.direction': direction,
        'elk.spacing.nodeNode': spacing.toString(),
        'elk.layered.spacing.nodeNodeBetweenLayers': spacing.toString(),
        'elk.layered.spacing.edgeNodeBetweenLayers': (spacing * 0.5).toString(),
        'elk.spacing.edgeNode': (spacing * 0.3).toString(),
        'elk.spacing.edgeEdge': '20',
        'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
        'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
        'elk.padding': '[top=20,left=20,bottom=20,right=20]',
      },
      children: [] as ElkNode[],
      edges: [] as ElkExtendedEdge[],
    };

    // Add nodes
    for (const node of diagram.nodes) {
      const shapeImpl = shapeRegistry.get(node.shape);
      if (!shapeImpl) {
        throw new Error(`Unknown shape: ${node.shape}`);
      }

      const style = node.style ? diagram.styles?.[node.style] || {} : {};
      const bounds = shapeImpl.bounds({
        node,
        style,
        measureText,
      });

      const elkNode: ElkNode = {
        id: node.id,
        width: bounds.width,
        height: bounds.height,
        labels: node.label
          ? [{ text: node.label, width: 0, height: 0 }]
          : undefined,
      };

      elkGraph.children.push(elkNode);
    }

    // Add edges
    for (const edge of diagram.edges) {
      elkGraph.edges.push({
        id: `${edge.from}->${edge.to}`,
        sources: [edge.from],
        targets: [edge.to],
        labels: edge.label
          ? [{ text: edge.label, width: 0, height: 0 }]
          : undefined,
      });
    }

    // Run ELK layout algorithm
    const laidOut = await this.elk.layout(elkGraph);

    // Convert ELK result back to Runiq format
    const nodes: PositionedNode[] = [];
    for (const elkNode of laidOut.children || []) {
      nodes.push({
        id: elkNode.id,
        x: elkNode.x || 0,
        y: elkNode.y || 0,
        width: elkNode.width || 0,
        height: elkNode.height || 0,
      });
    }

    // Extract edge routing
    const edges: RoutedEdge[] = [];
    for (const elkEdge of laidOut.edges || []) {
      const points: { x: number; y: number }[] = [];

      // ELK provides edge sections with start/end points and optional bend points
      if (elkEdge.sections && elkEdge.sections.length > 0) {
        for (const section of elkEdge.sections) {
          // Start point
          points.push({
            x: section.startPoint.x,
            y: section.startPoint.y,
          });

          // Bend points (intermediate routing points)
          if (section.bendPoints) {
            for (const bp of section.bendPoints) {
              points.push({ x: bp.x, y: bp.y });
            }
          }

          // End point
          points.push({
            x: section.endPoint.x,
            y: section.endPoint.y,
          });
        }
      } else {
        // Fallback: straight line between node centers
        const fromNode = nodes.find((n) => n.id === elkEdge.sources[0]);
        const toNode = nodes.find((n) => n.id === elkEdge.targets[0]);

        if (fromNode && toNode) {
          points.push(
            {
              x: fromNode.x + fromNode.width / 2,
              y: fromNode.y + fromNode.height / 2,
            },
            { x: toNode.x + toNode.width / 2, y: toNode.y + toNode.height / 2 }
          );
        }
      }

      edges.push({
        from: elkEdge.sources[0],
        to: elkEdge.targets[0],
        points,
      });
    }

    // Calculate overall diagram size
    let maxX = 0;
    let maxY = 0;

    for (const node of nodes) {
      const nodeRight = node.x + node.width;
      const nodeBottom = node.y + node.height;
      if (nodeRight > maxX) maxX = nodeRight;
      if (nodeBottom > maxY) maxY = nodeBottom;
    }

    // Add padding
    const size = {
      width: maxX + 20,
      height: maxY + 20,
    };

    return { nodes, edges, size };
  }

  /**
   * Convert Runiq direction to ELK direction
   */
  private convertDirection(direction: string): string {
    switch (direction.toUpperCase()) {
      case 'TB':
      case 'DOWN':
        return 'DOWN';
      case 'BT':
      case 'UP':
        return 'UP';
      case 'LR':
      case 'RIGHT':
        return 'RIGHT';
      case 'RL':
      case 'LEFT':
        return 'LEFT';
      default:
        return 'DOWN';
    }
  }
}
