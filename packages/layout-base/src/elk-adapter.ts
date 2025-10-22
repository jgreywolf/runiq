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
 * Current Implementation Status:
 * ✅ Basic containers with nodes - WORKING
 * ✅ Cross-container edges - WORKING (12/16 tests passing)
 * ✅ Multiple containers - WORKING
 * ✅ Container padding - WORKING
 * ✅ Spacing option with containers - WORKING (spacing parameter passed to container layouts)
 * ⏳ Nested containers - PARTIAL (simple nesting works, multi-level needs positioning fix)
 *
 * @todo Nested Container Positioning: Multi-level nested containers need proper relative
 * positioning to parent. Currently using flat structure with placeholder bounds.
 * See container-layout.test.ts for 4 skipped tests (two-level, three-level, C4, spacing).
 *
 * @todo Container Grid Layout: Support flexible grid-like positioning of containers
 * (e.g., 3 containers top row, 2 containers bottom row where one spans multiple columns).
 * Currently containers layout in a single direction. Need to support:
 * - Multi-row/column container layouts
 * - Container spanning (width/height across multiple grid cells)
 * - Mixed horizontal/vertical container arrangements
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

  /**
   * Generate orthogonal (step) routing between two points.
   * Creates a path with right-angle bends using horizontal and vertical segments.
   */
  private generateOrthogonalRouting(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    direction: string
  ): { x: number; y: number }[] {
    const points: { x: number; y: number }[] = [];

    // Start point
    points.push({ x: fromX, y: fromY });

    // Determine routing based on layout direction
    if (direction === 'DOWN' || direction === 'UP') {
      // Vertical layout: prefer vertical-horizontal-vertical routing
      const midY = (fromY + toY) / 2;

      // Go down/up to midpoint
      points.push({ x: fromX, y: midY });

      // Go horizontal to target X
      points.push({ x: toX, y: midY });
    } else {
      // Horizontal layout: prefer horizontal-vertical-horizontal routing
      const midX = (fromX + toX) / 2;

      // Go right/left to midpoint
      points.push({ x: midX, y: fromY });

      // Go vertical to target Y
      points.push({ x: midX, y: toY });
    }

    // End point
    points.push({ x: toX, y: toY });

    return points;
  }

  /**
   * Extract node ID from potentially member-level reference
   * e.g., "Order.customerId" -> "Order", "Customer" -> "Customer"
   */
  private extractNodeId(reference: string): string {
    const dotIndex = reference.indexOf('.');
    return dotIndex > 0 ? reference.substring(0, dotIndex) : reference;
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
    const spacing = opts.spacing || 100; // Increased from 80 to 100 for better clarity

    // Detect if this is a pedigree chart
    const isPedigreeChart = diagram.nodes.some(
      (n) => n.shape === 'pedigree-male' || n.shape === 'pedigree-female'
    );

    // Build ELK graph structure with hierarchyHandling for containers
    const elkGraph: ElkNode = {
      id: 'root',
      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.direction': direction,
        'elk.spacing.nodeNode': spacing.toString(),
        'elk.layered.spacing.nodeNodeBetweenLayers': spacing.toString(),
        'elk.edgeRouting': 'ORTHOGONAL', // Use step/orthogonal routing (right-angle bends)
        // Edge crossing minimization
        'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
        'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX', // Better crossing reduction
        'elk.layered.considerModelOrder.strategy': 'PREFER_EDGES', // Optimize for edge clarity
        // For pedigree charts, enforce layer-based layouting
        ...(isPedigreeChart
          ? {
              'elk.layered.layering.strategy': 'INTERACTIVE',
              'elk.layered.considerModelOrder.strategy': 'NONE',
              'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
              'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
              'elk.layered.compaction.postCompaction.strategy': 'EDGE_LENGTH',
            }
          : {}),
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

    // Calculate generations for pedigree charts (isPedigreeChart already declared above)
    const nodeGenerations = new Map<string, number>();
    const spousePairs = new Map<string, string>(); // Track spouse relationships
    if (isPedigreeChart) {
      this.calculatePedigreeGenerations(diagram, nodeGenerations, spousePairs);
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

        const elkNode: any = {
          id: node.id,
          width: bounds.width,
          height: bounds.height,
        };

        // Apply layer constraint for pedigree charts
        if (isPedigreeChart && nodeGenerations.has(node.id)) {
          const generation = nodeGenerations.get(node.id)!;

          // Get spouse if any - spouses should have same position priority
          const spouse = spousePairs.get(node.id);
          const basePosition = spouse && node.id < spouse ? 0 : spouse ? 1 : 0;

          elkNode.layoutOptions = {
            'elk.layered.layering.layer': generation,
            'elk.layered.crossingMinimization.semiInteractive': 'true',
            'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
            'elk.priority': (generation * 100 + basePosition).toString(),
          };
        }

        elkGraph.children.push(elkNode);
      }
    }

    // Add edges between standalone nodes and container placeholders
    // For layout purposes, edges to/from container nodes connect to the container placeholder
    for (const edge of diagram.edges) {
      // Extract node IDs from potentially member-level references
      // e.g., "Order.customerId" -> "Order"
      const fromNodeId = this.extractNodeId(edge.from);
      const toNodeId = this.extractNodeId(edge.to);

      const fromContainer = nodeContainerMap.get(fromNodeId);
      const toContainer = nodeContainerMap.get(toNodeId);

      // Replace node IDs with container placeholder IDs if nodes are in containers
      const fromId = fromContainer
        ? `__container__${fromContainer}`
        : fromNodeId;
      const toId = toContainer ? `__container__${toContainer}` : toNodeId;

      if (!elkGraph.edges) elkGraph.edges = [];
      elkGraph.edges.push({
        id: `${edge.from}->${edge.to}`, // Keep original IDs (including member refs) in the edge ID
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
    const edges: RoutedEdge[] = [];

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
        edges,
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

    // Extract edge routing from top-level layout (ONLY edges between standalone nodes and cross-container edges)
    // Skip edges that are internal to containers - those were already extracted from container layouts
    const topLevelEdges = (laidOut.edges || []).filter((elkEdge) => {
      // Parse edge ID to get from/to
      const edgeId = elkEdge.id || '';
      const match = edgeId.match(/^(.+)->(.+)$/);
      if (!match) return true; // Keep if we can't parse

      const [, from, to] = match;
      // Extract node IDs from potentially member-level references
      const fromNodeId = this.extractNodeId(from);
      const toNodeId = this.extractNodeId(to);

      const fromContainer = nodeContainerMap.get(fromNodeId);
      const toContainer = nodeContainerMap.get(toNodeId);

      // Skip if both nodes are in the SAME container (internal edge, already extracted)
      const isInternalEdge =
        fromContainer && toContainer && fromContainer === toContainer;
      if (isInternalEdge) {
        console.log(
          `Skipping internal edge ${from} -> ${to} (already extracted from container ${fromContainer})`
        );
      }
      return !isInternalEdge;
    });

    this.extractEdges(topLevelEdges, nodes, edges);

    // Fix cross-container edges: Replace placeholder-based routing with actual node positions
    for (const edge of diagram.edges) {
      // Extract node IDs from potentially member-level references
      const fromNodeId = this.extractNodeId(edge.from);
      const toNodeId = this.extractNodeId(edge.to);

      const fromContainer = nodeContainerMap.get(fromNodeId);
      const toContainer = nodeContainerMap.get(toNodeId);

      // Check if this edge crosses a container boundary
      const isCrossContainer =
        (fromContainer && !toContainer) || (!fromContainer && toContainer);

      if (isCrossContainer) {
        // Find the existing edge that was extracted (it will have wrong routing)
        const existingEdgeIndex = edges.findIndex(
          (e) => e.from === edge.from && e.to === edge.to
        );

        // Find actual node positions
        const fromNode = nodes.find((n) => n.id === fromNodeId);
        const toNode = nodes.find((n) => n.id === toNodeId);

        if (fromNode && toNode) {
          // Generate orthogonal (step) routing instead of straight lines
          const fromCenterX = fromNode.x + fromNode.width / 2;
          const fromCenterY = fromNode.y + fromNode.height / 2;
          const toCenterX = toNode.x + toNode.width / 2;
          const toCenterY = toNode.y + toNode.height / 2;

          const newPoints = this.generateOrthogonalRouting(
            fromCenterX,
            fromCenterY,
            toCenterX,
            toCenterY,
            direction
          );

          if (existingEdgeIndex >= 0) {
            // Replace the edge with corrected routing
            edges[existingEdgeIndex] = {
              from: edge.from,
              to: edge.to,
              points: newPoints,
            };
            console.log(
              `Fixed cross-container edge: ${edge.from} -> ${edge.to} (orthogonal routing, ${newPoints.length} points)`
            );
          } else {
            // Edge wasn't extracted (Issue #10), add it manually
            edges.push({
              from: edge.from,
              to: edge.to,
              points: newPoints,
            });
          }
        }
      }
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
      // Map Runiq algorithm to ELK algorithm ID
      const algorithm = this.mapAlgorithmToElk(
        container.layoutOptions?.algorithm || 'layered'
      );
      const containerSpacing =
        container.layoutOptions?.spacing?.toString() || '50';

      // Create a mini ELK graph for this container's contents
      const containerGraph: ElkNode = {
        id: `__container_internal__${container.id}`,
        layoutOptions: {
          'elk.algorithm': algorithm,
          'elk.direction': 'DOWN',
          'elk.spacing.nodeNode': containerSpacing,
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
        // Extract node IDs from potentially member-level references
        const fromNodeId = this.extractNodeId(edge.from);
        const toNodeId = this.extractNodeId(edge.to);

        if (
          container.children.includes(fromNodeId) &&
          container.children.includes(toNodeId)
        ) {
          containerGraph.edges!.push({
            id: `${edge.from}->${edge.to}`,
            sources: [fromNodeId],
            targets: [toNodeId],
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
    edges: RoutedEdge[],
    result: PositionedContainer[]
  ): Promise<void> {
    console.log(
      `layoutContainersWithNodes called with ${containers.length} containers`
    );
    for (const container of containers) {
      console.log(
        `Processing container: ${container.id}, children:`,
        container.children
      );
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
      // Map Runiq algorithm to ELK algorithm ID
      const algorithm = this.mapAlgorithmToElk(
        container.layoutOptions?.algorithm || 'layered'
      );

      const containerGraph: ElkNode = {
        id: `container_${container.id}`,
        layoutOptions: {
          'elk.algorithm': algorithm,
          'elk.direction': direction, // Use direction from options
          'elk.spacing.nodeNode': spacing.toString(),
          'elk.layered.spacing.nodeNodeBetweenLayers': spacing.toString(),
          'elk.edgeRouting': 'ORTHOGONAL', // Use step/orthogonal routing for container edges
          // Edge crossing minimization for container layouts
          'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
          'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
        },
        children: [],
        edges: [],
      };

      // Add child nodes
      console.log(
        `Container ${container.id}: Looking for ${container.children.length} children in diagram.nodes (total: ${diagram.nodes.length})`
      );
      console.log('Container children IDs:', container.children);
      console.log(
        'Diagram node IDs:',
        diagram.nodes.map((n) => n.id)
      );

      for (const childId of container.children) {
        const node = diagram.nodes.find((n) => n.id === childId);
        if (node) {
          console.log(`Found node ${childId} with shape ${node.shape}`);
          const shapeImpl = shapeRegistry.get(node.shape);
          if (!shapeImpl) {
            console.warn(`Shape not found: ${node.shape}`);
            continue;
          }

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
        try {
          const laidOutContainer = await this.elk.layout(containerGraph);

          // Add nodes with positions relative to container
          for (const elkNode of laidOutContainer.children || []) {
            const positionedNode = {
              id: elkNode.id,
              x: containerPos.x + padding + (elkNode.x || 0),
              y: containerPos.y + padding + (elkNode.y || 0),
              width: elkNode.width || 0,
              height: elkNode.height || 0,
            };
            nodes.push(positionedNode);
          }

          // Extract internal container edges (CRITICAL: edges between nodes inside container)
          // These need to be extracted from the container layout, not the top-level layout
          console.log(
            `Container ${container.id}: laidOutContainer.edges =`,
            laidOutContainer.edges
          );

          const tempEdges: RoutedEdge[] = [];
          this.extractEdges(laidOutContainer.edges || [], nodes, tempEdges);

          console.log(
            `Before position adjustment, tempEdges for ${container.id}:`,
            tempEdges
          );

          // Adjust edge positions to be relative to container
          for (const edge of tempEdges) {
            for (const point of edge.points) {
              point.x += containerPos.x + padding;
              point.y += containerPos.y + padding;
            }
          }

          edges.push(...tempEdges);

          // Calculate container size from laid out content
          containerWidth = (laidOutContainer.width || 0) + padding * 2;
          containerHeight = (laidOutContainer.height || 0) + padding * 2;
        } catch (error) {
          // Fall back to default positioning if layout fails
        }
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
          edges,
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
  // @ts-expect-error - Kept for reference, may be needed for future layout strategies
  private calculateContainerBounds(
    containers: ContainerDeclaration[],
    nodes: PositionedNode[],
    nodeContainerMap: Map<string, string>,
    result: PositionedContainer[],
    _parentId?: string
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
  // @ts-expect-error - Kept for reference, alternative hierarchical layout approach
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
  // @ts-expect-error - Kept for reference, alternative extraction approach
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
  // @ts-expect-error - Kept for reference, alternative edge extraction approach
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
  // @ts-expect-error - Kept for reference, alternative edge distribution approach
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
   * Map Runiq LayoutAlgorithm to ELK algorithm ID
   */
  private mapAlgorithmToElk(algorithm: string): string {
    switch (algorithm) {
      case 'layered':
        return 'layered';
      case 'force':
        return 'org.eclipse.elk.force';
      case 'stress':
        return 'org.eclipse.elk.stress';
      case 'radial':
        return 'org.eclipse.elk.radial';
      case 'mrtree':
        return 'org.eclipse.elk.mrtree';
      default:
        return 'layered'; // Default fallback
    }
  }

  /**
   * Calculate generation (layer) for each node in a pedigree chart.
   * Uses BFS from root nodes (those with no incoming parent edges)
   * to assign generation numbers that enforce hierarchical layering.
   */
  private calculatePedigreeGenerations(
    diagram: DiagramAst,
    nodeGenerations: Map<string, number>,
    spousePairsOut?: Map<string, string>
  ): void {
    // Build adjacency lists for parent->child relationships
    const children = new Map<string, Set<string>>();
    const parents = new Map<string, Set<string>>();

    for (const node of diagram.nodes) {
      children.set(node.id, new Set());
      parents.set(node.id, new Set());
    }

    // Analyze edges to find parent-child relationships
    // In pedigree charts, edges from both parents point to children
    for (const edge of diagram.edges) {
      children.get(edge.from)?.add(edge.to);
      parents.get(edge.to)?.add(edge.from);
    }

    // Find root nodes (generation 0) - nodes with no parents or only spouse edges
    const roots: string[] = [];
    const spouseEdges = new Set<string>();
    const spousePairs = new Set<string>(); // Track spouse relationships

    // Detect spouse/marriage edges using multiple heuristics:
    // 1. Bidirectional edges (explicit marriage notation)
    for (const edge of diagram.edges) {
      const hasReverseEdge = diagram.edges.some(
        (e) => e.from === edge.to && e.to === edge.from
      );
      if (hasReverseEdge) {
        spouseEdges.add(`${edge.from}-${edge.to}`);
        spouseEdges.add(`${edge.to}-${edge.from}`);
        const pairKey = [edge.from, edge.to].sort().join('-');
        spousePairs.add(pairKey);
      }
    }

    // 2. Co-parents: if two nodes both point to the same child(ren), they're likely spouses
    const childToParents = new Map<string, Set<string>>();
    for (const edge of diagram.edges) {
      if (!childToParents.has(edge.to)) {
        childToParents.set(edge.to, new Set());
      }
      childToParents.get(edge.to)!.add(edge.from);
    }

    // If two parents point to the same child, mark them as spouses
    for (const [_child, parentSet] of childToParents.entries()) {
      const parentList = Array.from(parentSet);
      if (parentList.length === 2) {
        const [p1, p2] = parentList;
        // Check if both parents are pedigree shapes
        const p1Node = diagram.nodes.find((n) => n.id === p1);
        const p2Node = diagram.nodes.find((n) => n.id === p2);
        if (
          p1Node &&
          p2Node &&
          (p1Node.shape === 'pedigree-male' ||
            p1Node.shape === 'pedigree-female') &&
          (p2Node.shape === 'pedigree-male' ||
            p2Node.shape === 'pedigree-female')
        ) {
          spouseEdges.add(`${p1}-${p2}`);
          spouseEdges.add(`${p2}-${p1}`);
          const pairKey = [p1, p2].sort().join('-');
          spousePairs.add(pairKey);
        }
      }
    }

    // Populate output spouse pairs map if provided
    if (spousePairsOut) {
      for (const pairKey of spousePairs) {
        const [p1, p2] = pairKey.split('-');
        spousePairsOut.set(p1, p2);
        spousePairsOut.set(p2, p1);
      }
    }

    // Build spouse relationship map
    const spouseMap = new Map<string, string[]>();
    for (const pairKey of spousePairs) {
      const [p1, p2] = pairKey.split('-');
      if (!spouseMap.has(p1)) spouseMap.set(p1, []);
      if (!spouseMap.has(p2)) spouseMap.set(p2, []);
      spouseMap.get(p1)!.push(p2);
      spouseMap.get(p2)!.push(p1);
    }

    // Identify roots: nodes with no non-spouse parents
    // Key insight: A node is a root ONLY if:
    // 1. It has no real parents, AND
    // 2. Its spouse (if any) ALSO has no real parents
    // This prevents spouses who "married in" from being roots
    const processedRoots = new Set<string>();

    for (const node of diagram.nodes) {
      if (processedRoots.has(node.id)) continue;

      const nodeParents = parents.get(node.id)!;
      const realParents = Array.from(nodeParents).filter((p) => {
        return !spouseEdges.has(`${p}-${node.id}`);
      });

      const nodeChildren = children.get(node.id)!;
      const nonSpouseChildren = Array.from(nodeChildren).filter((c) => {
        return !spouseEdges.has(`${node.id}-${c}`);
      });

      // This node is a potential root if it has no real parents and has descendants
      if (realParents.length === 0 && nonSpouseChildren.length > 0) {
        // Check if this node has a spouse
        const spouses = spouseMap.get(node.id) || [];

        if (spouses.length > 0) {
          // Check if ANY spouse has real parents
          let anySpouseHasParents = false;
          for (const spouseId of spouses) {
            const spouseParents = parents.get(spouseId)!;
            const spouseRealParents = Array.from(spouseParents).filter((p) => {
              return !spouseEdges.has(`${p}-${spouseId}`);
            });
            if (spouseRealParents.length > 0) {
              anySpouseHasParents = true;
              break;
            }
          }

          // Only add as root if NO spouse has real parents
          if (!anySpouseHasParents) {
            roots.push(node.id);
            nodeGenerations.set(node.id, 0);
            processedRoots.add(node.id);
          }
        } else {
          // No spouse - single root
          roots.push(node.id);
          nodeGenerations.set(node.id, 0);
          processedRoots.add(node.id);
        }
      }
    }

    // Process all nodes using BFS, handling spouses and children
    const queue: string[] = [...roots];
    const visited = new Set<string>();

    // Mark roots as visited
    for (const root of roots) {
      visited.add(root);
    }

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      const currentGen = nodeGenerations.get(nodeId) || 0;

      // Process all edges from this node
      const nodeChildren = children.get(nodeId)!;
      for (const childId of nodeChildren) {
        if (spouseEdges.has(`${nodeId}-${childId}`)) {
          // Spouse edge - same generation
          const existingGen = nodeGenerations.get(childId);
          if (existingGen === undefined || existingGen !== currentGen) {
            nodeGenerations.set(childId, currentGen);
          }
          if (!visited.has(childId)) {
            visited.add(childId);
            queue.push(childId);
          }
        } else {
          // Parent-child edge - next generation
          const childGen = currentGen + 1;
          const existingGen = nodeGenerations.get(childId);
          if (existingGen === undefined || childGen < existingGen) {
            nodeGenerations.set(childId, childGen);
          }
          if (!visited.has(childId)) {
            visited.add(childId);
            queue.push(childId);
          }
        }
      }
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
