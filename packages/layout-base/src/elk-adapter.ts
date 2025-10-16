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
    // Disable web workers for Node.js compatibility
    this.elk = new ELK({
      workerUrl: undefined,
    });
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
    const elkGraph: ElkNode = {
      id: 'root',
      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.direction': direction,
        'elk.spacing.nodeNode': spacing.toString(),
        'elk.layered.spacing.nodeNodeBetweenLayers': spacing.toString(),
      },
      children: [],
      edges: [],
    };

    // Track which nodes belong to containers
    const nodeContainerMap = new Map<string, string>();
    const containerMap = new Map<string, ContainerDeclaration>();

    // Build container hierarchy map
    if (diagram.containers) {
      this.buildContainerMap(
        diagram.containers,
        nodeContainerMap,
        containerMap
      );
    }

    // Option #2: Add placeholder nodes for containers, layout separately
    // Then arrange nodes within their container bounds

    // Add container placeholder nodes
    const containerPlaceholders = new Map<
      string,
      { width: number; height: number }
    >();
    if (diagram.containers) {
      this.addContainerPlaceholders(
        diagram.containers,
        elkGraph,
        diagram,
        measureText,
        containerPlaceholders
      );
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

        if (!elkGraph.children) elkGraph.children = [];
        elkGraph.children.push({
          id: node.id,
          width: bounds.width,
          height: bounds.height,
        });
      }
    }

    // Add edges between standalone nodes and container placeholders
    // For layout purposes, edges to/from container nodes connect to the container placeholder
    for (const edge of diagram.edges) {
      const fromContainer = nodeContainerMap.get(edge.from);
      const toContainer = nodeContainerMap.get(edge.to);

      // Replace node IDs with container placeholder IDs if nodes are in containers
      const fromId = fromContainer
        ? `__container__${fromContainer}`
        : edge.from;
      const toId = toContainer ? `__container__${toContainer}` : edge.to;

      if (!elkGraph.edges) elkGraph.edges = [];
      elkGraph.edges.push({
        id: `${edge.from}->${edge.to}`, // Keep original IDs in the edge ID
        sources: [fromId],
        targets: [toId],
      });
    }

    // Run ELK layout algorithm (with container placeholders)
    const laidOut = await this.elk.layout(elkGraph);

    // Extract container placeholder positions
    const containerPositions = new Map<string, { x: number; y: number }>();
    for (const elkNode of laidOut.children || []) {
      if (elkNode.id.startsWith('__container__')) {
        const containerId = elkNode.id.replace('__container__', '');
        containerPositions.set(containerId, {
          x: elkNode.x || 0,
          y: elkNode.y || 0,
        });
      }
    }

    // Layout nodes within each container and position containers
    const nodes: PositionedNode[] = [];
    const containers: PositionedContainer[] = [];

    if (diagram.containers) {
      await this.layoutContainersWithNodes(
        diagram.containers,
        diagram,
        measureText,
        nodeContainerMap,
        containerPositions,
        spacing,
        direction,
        nodes,
        containers
      );
    }

    // Add standalone nodes (not in containers)
    for (const elkNode of laidOut.children || []) {
      if (!elkNode.id.startsWith('__container__')) {
        nodes.push({
          id: elkNode.id,
          x: elkNode.x || 0,
          y: elkNode.y || 0,
          width: elkNode.width || 0,
          height: elkNode.height || 0,
        });
      }
    }

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
    containerMap: Map<string, ContainerDeclaration>,
    parentId?: string
  ): void {
    for (const container of containers) {
      if (container.id) {
        containerMap.set(container.id, container);

        // Track parent relationship for LCA calculation
        if (parentId) {
          nodeContainerMap.set(`__parent__${container.id}`, parentId);
        }
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
          containerMap,
          container.id
        );
      }
    }
  }

  /**
   * Add placeholder nodes for containers and layout their internal nodes
   */
  private addContainerPlaceholders(
    containers: ContainerDeclaration[],
    elkGraph: ElkNode,
    diagram: DiagramAst,
    measureText: ReturnType<typeof createTextMeasurer>,
    placeholders: Map<string, { width: number; height: number }>
  ): void {
    for (const container of containers) {
      // Create a mini ELK graph for this container's contents
      const containerGraph: ElkNode = {
        id: `__container_internal__${container.id}`,
        layoutOptions: {
          'elk.algorithm': 'layered',
          'elk.direction': 'DOWN',
        },
        children: [],
        edges: [],
      };

      // Add child nodes to container graph
      for (const childId of container.children) {
        const node = diagram.nodes.find((n) => n.id === childId);
        if (node) {
          const shapeImpl = shapeRegistry.get(node.shape);
          if (!shapeImpl) continue;

          const style = node.style ? diagram.styles?.[node.style] || {} : {};
          const bounds = shapeImpl.bounds({ node, style, measureText });

          containerGraph.children!.push({
            id: node.id,
            width: bounds.width,
            height: bounds.height,
          });
        }
      }

      // Add edges within this container
      for (const edge of diagram.edges) {
        if (
          container.children.includes(edge.from) &&
          container.children.includes(edge.to)
        ) {
          containerGraph.edges!.push({
            id: `${edge.from}->${edge.to}`,
            sources: [edge.from],
            targets: [edge.to],
          });
        }
      }

      // Calculate container size (placeholder dimensions)
      const padding =
        container.containerStyle?.padding !== undefined
          ? container.containerStyle.padding
          : 30;

      // Estimate container size based on children
      const childCount = container.children.length;
      const avgNodeSize = 100;
      const estimatedWidth = Math.max(
        200,
        Math.sqrt(childCount) * avgNodeSize + padding * 2
      );
      const estimatedHeight = Math.max(
        150,
        Math.sqrt(childCount) * avgNodeSize + padding * 2
      );

      // Add placeholder node representing this container
      if (!elkGraph.children) elkGraph.children = [];
      elkGraph.children.push({
        id: `__container__${container.id}`,
        width: estimatedWidth,
        height: estimatedHeight,
      });

      placeholders.set(container.id!, {
        width: estimatedWidth,
        height: estimatedHeight,
      });

      // Recursively handle nested containers
      if (container.containers) {
        this.addContainerPlaceholders(
          container.containers,
          elkGraph,
          diagram,
          measureText,
          placeholders
        );
      }
    }
  }

  /**
   * Layout nodes within containers and position everything
   */
  private async layoutContainersWithNodes(
    containers: ContainerDeclaration[],
    diagram: DiagramAst,
    measureText: ReturnType<typeof createTextMeasurer>,
    nodeContainerMap: Map<string, string>,
    containerPositions: Map<string, { x: number; y: number }>,
    spacing: number,
    direction: string,
    nodes: PositionedNode[],
    result: PositionedContainer[]
  ): Promise<void> {
    for (const container of containers) {
      const padding =
        container.containerStyle?.padding !== undefined
          ? container.containerStyle.padding
          : 30;

      // Get container position from placeholder
      const containerPos = containerPositions.get(container.id!) || {
        x: 0,
        y: 0,
      };

      // Create mini ELK graph for container contents
      const containerGraph: ElkNode = {
        id: `container_${container.id}`,
        layoutOptions: {
          'elk.algorithm': 'layered',
          'elk.direction': direction, // Use direction from options
          'elk.spacing.nodeNode': spacing.toString(),
          'elk.layered.spacing.nodeNodeBetweenLayers': spacing.toString(),
        },
        children: [],
        edges: [],
      };

      // Add child nodes
      for (const childId of container.children) {
        const node = diagram.nodes.find((n) => n.id === childId);
        if (node) {
          const shapeImpl = shapeRegistry.get(node.shape);
          if (!shapeImpl) continue;

          const style = node.style ? diagram.styles?.[node.style] || {} : {};
          const bounds = shapeImpl.bounds({ node, style, measureText });

          containerGraph.children!.push({
            id: node.id,
            width: bounds.width,
            height: bounds.height,
          });
        }
      }

      // Add internal edges
      for (const edge of diagram.edges) {
        if (
          container.children.includes(edge.from) &&
          container.children.includes(edge.to)
        ) {
          containerGraph.edges!.push({
            id: `${edge.from}->${edge.to}`,
            sources: [edge.from],
            targets: [edge.to],
          });
        }
      }

      // Layout container contents
      let containerWidth = 200;
      let containerHeight = 150;

      if (containerGraph.children!.length > 0) {
        const laidOutContainer = await this.elk.layout(containerGraph);

        // Add nodes with positions relative to container
        for (const elkNode of laidOutContainer.children || []) {
          nodes.push({
            id: elkNode.id,
            x: containerPos.x + padding + (elkNode.x || 0),
            y: containerPos.y + padding + (elkNode.y || 0),
            width: elkNode.width || 0,
            height: elkNode.height || 0,
          });
        }

        // Calculate container size from laid out content
        containerWidth = (laidOutContainer.width || 0) + padding * 2;
        containerHeight = (laidOutContainer.height || 0) + padding * 2;
      }

      // Handle nested containers recursively
      const nestedContainers: PositionedContainer[] = [];
      if (container.containers) {
        // For nested containers, adjust their positions relative to parent
        const nestedPositions = new Map<string, { x: number; y: number }>();
        for (const [id, pos] of containerPositions.entries()) {
          // Adjust nested container positions to be relative to this container
          nestedPositions.set(id, {
            x: pos.x - containerPos.x - padding,
            y: pos.y - containerPos.y - padding,
          });
        }

        await this.layoutContainersWithNodes(
          container.containers,
          diagram,
          measureText,
          nodeContainerMap,
          nestedPositions,
          spacing,
          direction,
          nodes,
          nestedContainers
        );

        // Adjust nested container positions back to absolute coordinates
        for (const nested of nestedContainers) {
          nested.x += containerPos.x + padding;
          nested.y += containerPos.y + padding;
        }
      }

      result.push({
        id: container.id || '',
        x: containerPos.x,
        y: containerPos.y,
        width: containerWidth,
        height: containerHeight,
        label: container.label,
        containers: nestedContainers.length > 0 ? nestedContainers : undefined,
      });
    }
  }

  /**
   * Calculate container bounds from their children's positions (post-layout)
   * NOTE: This method is now unused - we use layoutContainersWithNodes instead
   */
  private calculateContainerBounds(
    containers: ContainerDeclaration[],
    nodes: PositionedNode[],
    nodeContainerMap: Map<string, string>,
    result: PositionedContainer[],
    parentId?: string
  ): void {
    for (const container of containers) {
      const padding =
        container.containerStyle?.padding !== undefined
          ? container.containerStyle.padding
          : 30;

      // Find all direct child nodes in this container
      const childNodes = nodes.filter(
        (node) => nodeContainerMap.get(node.id) === container.id
      );

      // Recursively calculate nested container bounds
      const nestedContainers: PositionedContainer[] = [];
      if (container.containers) {
        this.calculateContainerBounds(
          container.containers,
          nodes,
          nodeContainerMap,
          nestedContainers,
          container.id
        );
      }

      // Calculate bounds from children (nodes + nested containers)
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      for (const node of childNodes) {
        minX = Math.min(minX, node.x);
        minY = Math.min(minY, node.y);
        maxX = Math.max(maxX, node.x + node.width);
        maxY = Math.max(maxY, node.y + node.height);
      }

      for (const nested of nestedContainers) {
        minX = Math.min(minX, nested.x);
        minY = Math.min(minY, nested.y);
        maxX = Math.max(maxX, nested.x + nested.width);
        maxY = Math.max(maxY, nested.y + nested.height);
      }

      // Handle empty containers
      if (childNodes.length === 0 && nestedContainers.length === 0) {
        minX = 0;
        minY = 0;
        maxX = 200;
        maxY = 150;
      }

      // Add padding
      const x = minX - padding;
      const y = minY - padding;
      const width = maxX - minX + padding * 2;
      const height = maxY - minY + padding * 2;

      result.push({
        id: container.id || '',
        x,
        y,
        width,
        height,
        label: container.label,
        containers: nestedContainers.length > 0 ? nestedContainers : undefined,
      });
    }
  }

  /**
   * Build ELK container node (compound node) with children
   * NOTE: This method is now unused - we use flat layout instead
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
      // Note: Labels are optional for layout
      layoutOptions: {
        'elk.padding': `[top=${padding},left=${padding},bottom=${padding},right=${padding}]`,
      },
      children: [],
      // Don't initialize edges array - will be added by distributeEdges if needed
      // Set minimum size for empty containers
      width:
        container.children.length === 0 && !container.containers?.length
          ? 200
          : undefined,
      height:
        container.children.length === 0 && !container.containers?.length
          ? 150
          : undefined,
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
          // Note: Labels are optional for layout, ELK can handle them or we can omit them
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
  /**
   * Recursively extract edges from the ELK result, including edges in nested containers
   */
  private extractEdgesRecursive(
    elkNode: ElkNode,
    nodes: PositionedNode[],
    edges: RoutedEdge[]
  ): void {
    // Extract edges at this level
    if (elkNode.edges) {
      this.extractEdges(elkNode.edges, nodes, edges);
    }

    // Recurse into child containers
    if (elkNode.children) {
      for (const child of elkNode.children) {
        this.extractEdgesRecursive(child, nodes, edges);
      }
    }
  }

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

      // Extract original from/to from edge ID (format: "from->to")
      const edgeParts = elkEdge.id.split('->');
      const from = edgeParts[0];
      const to = edgeParts[1] || elkEdge.targets[0];

      edges.push({
        from,
        to,
        points,
      });
    }
  }

  /**
   * Distribute edges to the appropriate container levels.
   * Each edge must be added to the lowest common ancestor (LCA) container
   * that contains both the source and target nodes.
   */
  private distributeEdges(
    edges: DiagramAst['edges'],
    elkGraph: ElkNode,
    nodeContainerMap: Map<string, string>
  ): void {
    for (const edge of edges) {
      const fromContainer = nodeContainerMap.get(edge.from);
      const toContainer = nodeContainerMap.get(edge.to);

      // Find the lowest common ancestor container
      const lcaId = this.findLowestCommonAncestor(
        fromContainer,
        toContainer,
        nodeContainerMap
      );

      const elkEdge: ElkExtendedEdge = {
        id: `${edge.from}->${edge.to}`,
        sources: [edge.from],
        targets: [edge.to],
        // Note: Labels are optional for layout
      };

      // Add edge to the appropriate container
      if (lcaId === null) {
        // Both nodes are at root level or cross root containers
        elkGraph.edges!.push(elkEdge);
      } else {
        // Find and add to the container
        const container = this.findElkNodeById(elkGraph, lcaId);
        if (container) {
          // Initialize edges array if not present
          if (!container.edges) {
            container.edges = [];
          }
          container.edges.push(elkEdge);
        } else {
          // Fallback to root if container not found
          elkGraph.edges!.push(elkEdge);
        }
      }
    }
  }

  /**
   * Find lowest common ancestor of two nodes based on their container hierarchy
   */
  private findLowestCommonAncestor(
    containerId1: string | undefined,
    containerId2: string | undefined,
    nodeContainerMap: Map<string, string>
  ): string | null {
    // If both are at root level (undefined), LCA is root
    if (!containerId1 && !containerId2) {
      return null;
    }

    // If one is at root, LCA is root
    if (!containerId1 || !containerId2) {
      return null;
    }

    // If both in same container, that's the LCA
    if (containerId1 === containerId2) {
      return containerId1;
    }

    // Build ancestor chains
    const ancestors1 = this.getAncestorChain(containerId1, nodeContainerMap);
    const ancestors2 = this.getAncestorChain(containerId2, nodeContainerMap);

    // Find common ancestor by comparing chains
    for (const ancestor of ancestors1) {
      if (ancestors2.includes(ancestor)) {
        return ancestor;
      }
    }

    // No common ancestor means LCA is root
    return null;
  }

  /**
   * Get chain of ancestor container IDs for a given container
   */
  private getAncestorChain(
    containerId: string,
    nodeContainerMap: Map<string, string>
  ): string[] {
    const chain: string[] = [containerId];
    let current = containerId;

    // Walk up the hierarchy using parent tracking
    while (true) {
      const parentKey = `__parent__${current}`;
      const parent = nodeContainerMap.get(parentKey);
      if (!parent) {
        break; // Reached root
      }
      chain.push(parent);
      current = parent;
    }

    return chain;
  }

  /**
   * Find an ELK node by ID (recursively search through hierarchy)
   */
  private findElkNodeById(node: ElkNode, targetId: string): ElkNode | null {
    if (node.id === targetId) {
      return node;
    }

    if (node.children) {
      for (const child of node.children) {
        const found = this.findElkNodeById(child, targetId);
        if (found) {
          return found;
        }
      }
    }

    return null;
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
