import ELK, { ElkNode, ElkExtendedEdge } from 'elkjs/lib/elk.bundled.js';
import type {
  DiagramAst,
  LayoutEngine,
  LayoutOptions,
  LaidOutDiagram,
  PositionedNode,
  RoutedEdge,
  PositionedContainer,
  ContainerDeclaration,
} from '@runiq/core';
import { shapeRegistry, createTextMeasurer } from '@runiq/core';

/**
 * ELK (Eclipse Layout Kernel) layout engine adapter for Runiq.
 * Provides superior layout quality compared to Dagre with multiple algorithms.
 * 
 * @todo Container Layout: Current implementation adds containers as ELK compound nodes,
 * but edges at root level cannot find nodes inside containers. Need to either:
 * 1. Add all edges at container level where both source/target exist
 * 2. Use flat node structure with parent references instead of nested children
 * 3. Calculate container bounds manually from positioned child nodes
 * See container-layout.test.ts for failing tests (15/16 tests need ELK hierarchy fix)
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
    if (diagram.nodes.length === 0 && !diagram.containers?.length) {
      return {
        nodes: [],
        edges: [],
        size: { width: 0, height: 0 },
        containers: [],
      };
    }

    const measureText = createTextMeasurer();

    // Convert direction: TB/LR -> DOWN/RIGHT
    const direction = this.convertDirection(
      opts.direction || diagram.direction || 'TB'
    );
    const spacing = opts.spacing || 80;

    // Build ELK graph structure with hierarchyHandling for containers
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
        'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
      },
      children: [] as ElkNode[],
      edges: [] as ElkExtendedEdge[],
    };

    // Track which nodes belong to containers
    const nodeContainerMap = new Map<string, string>();
    const containerMap = new Map<string, ContainerDeclaration>();

    // Build container hierarchy
    if (diagram.containers) {
      this.buildContainerMap(
        diagram.containers,
        nodeContainerMap,
        containerMap
      );
    }

    // Add top-level containers to ELK graph
    if (diagram.containers) {
      for (const container of diagram.containers) {
        const elkContainer = this.buildElkContainer(
          container,
          diagram,
          measureText,
          spacing,
          direction
        );
        elkGraph.children.push(elkContainer);
      }
    }

    // Add standalone nodes (not in any container)
    for (const node of diagram.nodes) {
      if (!nodeContainerMap.has(node.id)) {
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
    const containers: PositionedContainer[] = [];

    // Extract all nodes and containers recursively
    this.extractNodesAndContainers(
      laidOut.children || [],
      nodes,
      containers,
      containerMap
    );

    // Extract edge routing
    const edges: RoutedEdge[] = [];
    this.extractEdges(laidOut.edges || [], nodes, edges);

    // Calculate overall diagram size
    let maxX = 0;
    let maxY = 0;

    for (const node of nodes) {
      const nodeRight = node.x + node.width;
      const nodeBottom = node.y + node.height;
      if (nodeRight > maxX) maxX = nodeRight;
      if (nodeBottom > maxY) maxY = nodeBottom;
    }

    for (const container of containers) {
      const containerRight = container.x + container.width;
      const containerBottom = container.y + container.height;
      if (containerRight > maxX) maxX = containerRight;
      if (containerBottom > maxY) maxY = containerBottom;
    }

    // Add padding
    const size = {
      width: maxX + 20,
      height: maxY + 20,
    };

    return { nodes, edges, size, containers };
  }

  /**
   * Build map of node IDs to container IDs (for hierarchical placement)
   */
  private buildContainerMap(
    containers: ContainerDeclaration[],
    nodeContainerMap: Map<string, string>,
    containerMap: Map<string, ContainerDeclaration>
  ): void {
    for (const container of containers) {
      if (container.id) {
        containerMap.set(container.id, container);
      }

      // Map direct children
      for (const childId of container.children) {
        nodeContainerMap.set(childId, container.id || '');
      }

      // Recursively process nested containers
      if (container.containers) {
        this.buildContainerMap(
          container.containers,
          nodeContainerMap,
          containerMap
        );
      }
    }
  }

  /**
   * Build ELK container node (compound node) with children
   */
  private buildElkContainer(
    container: ContainerDeclaration,
    diagram: DiagramAst,
    measureText: ReturnType<typeof createTextMeasurer>,
    spacing: number,
    direction?: string
  ): ElkNode {
    const padding =
      container.containerStyle?.padding !== undefined
        ? container.containerStyle.padding
        : 30;

    const elkContainer: ElkNode = {
      id: container.id || '',
      labels: container.label ? [{ text: container.label, width: 0, height: 0 }] : undefined,
      layoutOptions: {
        'elk.padding': `[top=${padding},left=${padding},bottom=${padding},right=${padding}]`,
        'elk.algorithm': 'layered',
        'elk.spacing.nodeNode': spacing.toString(),
        ...(direction && { 'elk.direction': direction }),
      },
      children: [],
      // Set minimum size for empty containers
      width: container.children.length === 0 && !container.containers?.length ? 200 : undefined,
      height: container.children.length === 0 && !container.containers?.length ? 150 : undefined,
    };

    // Add child nodes
    for (const childId of container.children) {
      const node = diagram.nodes.find((n) => n.id === childId);
      if (node) {
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

        elkContainer.children!.push({
          id: node.id,
          width: bounds.width,
          height: bounds.height,
          labels: node.label
            ? [{ text: node.label, width: 0, height: 0 }]
            : undefined,
        });
      }
    }

    // Add nested containers
    if (container.containers) {
      for (const nestedContainer of container.containers) {
        const elkNested = this.buildElkContainer(
          nestedContainer,
          diagram,
          measureText,
          spacing,
          direction
        );
        elkContainer.children!.push(elkNested);
      }
    }

    return elkContainer;
  }

  /**
   * Extract nodes and containers from ELK result
   */
  private extractNodesAndContainers(
    elkChildren: ElkNode[],
    nodes: PositionedNode[],
    containers: PositionedContainer[],
    containerMap: Map<string, ContainerDeclaration>
  ): void {
    for (const elkNode of elkChildren) {
      const isContainer = containerMap.has(elkNode.id);

      if (isContainer) {
        // This is a container
        const container: PositionedContainer = {
          id: elkNode.id,
          x: elkNode.x || 0,
          y: elkNode.y || 0,
          width: elkNode.width || 0,
          height: elkNode.height || 0,
          label: elkNode.labels?.[0]?.text,
          containers: [],
        };

        // Recursively extract nested children
        const nestedContainers: PositionedContainer[] = [];
        this.extractNodesAndContainers(
          elkNode.children || [],
          nodes,
          nestedContainers,
          containerMap
        );

        if (nestedContainers.length > 0) {
          container.containers = nestedContainers;
        }

        containers.push(container);
      } else {
        // This is a regular node
        nodes.push({
          id: elkNode.id,
          x: elkNode.x || 0,
          y: elkNode.y || 0,
          width: elkNode.width || 0,
          height: elkNode.height || 0,
        });
      }
    }
  }

  /**
   * Extract edge routing information
   */
  private extractEdges(
    elkEdges: ElkExtendedEdge[],
    nodes: PositionedNode[],
    edges: RoutedEdge[]
  ): void {
    for (const elkEdge of elkEdges) {
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
