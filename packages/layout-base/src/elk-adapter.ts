import type {
  ContainerDeclaration,
  DiagramAst,
  EdgeAst,
  LaidOutDiagram,
  LayoutEngine,
  LayoutOptions,
  PositionedContainer,
  PositionedNode,
  RoutedEdge,
} from '@runiq/core';
import {
  createTextMeasurer,
  LayoutAlgorithm,
  shapeRegistry,
} from '@runiq/core';
import ELK, { ElkExtendedEdge, ElkNode } from 'elkjs/lib/elk.bundled.js';
import { circularLayout } from './circular-layout.js';

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
 * ❌ Nested containers - NOT WORKING (known limitation, see below)
 *
 * @todo HIGH PRIORITY: Nested Container Positioning
 * Multi-level nested containers need proper relative positioning to parent.
 * Currently using flat structure with placeholder bounds - nested containers position
 * outside their parents. This is CRITICAL for:
 * - C4 architecture diagrams (System → Container → Component hierarchy)
 * - BPMN pools with nested lanes
 * - Complex organizational charts
 * - Deployment diagrams with nested environments
 *
 * See container-layout.test.ts for 4 skipped tests (two-level, three-level, C4, spacing).
 *
 * WORKAROUND: C4 and other hierarchical diagrams currently use FLAT container hierarchies
 * (multiple containers side-by-side at same level) which works correctly.
 *
 * @todo Container Grid Layout: Support flexible grid-like positioning of containers
 * (e.g., 3 containers top row, 2 containers bottom row where one spans multiple columns).
 * Currently containers layout in a single direction. Need to support:
 * - Multi-row/column container layouts
 * - Container spanning (width/height across multiple grid cells)
 * - Mixed horizontal/vertical container arrangements
 */
// Narrowed runtime API surface we use from ELK
interface ElkApi {
  layout(graph: ElkNode): Promise<ElkNode>;
}

export class ElkLayoutEngine implements LayoutEngine {
  id = 'elk';
  supportsManualPositions = true;
  private elk: ElkApi;

  constructor() {
    // Disable web workers for Node.js compatibility
    // ELK bundler typings don't expose a constructable type under NodeNext; cast to a constructor
    const ElkCtor = ELK as unknown as new (opts?: {
      workerUrl?: string;
    }) => ElkApi;
    this.elk = new ElkCtor({ workerUrl: undefined });
  }

  /**
   * Create standard ports for a node (north, south, east, west)
   * These allow edge anchor constraints to work with ELK
   */
  private createNodePorts(nodeWidth: number, nodeHeight: number) {
    return [
      {
        id: 'north',
        x: nodeWidth / 2,
        y: 0,
        width: 1,
        height: 1,
        properties: { 'port.side': 'NORTH' },
      },
      {
        id: 'south',
        x: nodeWidth / 2,
        y: nodeHeight,
        width: 1,
        height: 1,
        properties: { 'port.side': 'SOUTH' },
      },
      {
        id: 'east',
        x: nodeWidth,
        y: nodeHeight / 2,
        width: 1,
        height: 1,
        properties: { 'port.side': 'EAST' },
      },
      {
        id: 'west',
        x: 0,
        y: nodeHeight / 2,
        width: 1,
        height: 1,
        properties: { 'port.side': 'WEST' },
      },
    ];
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
    // Strip member access (e.g., "obj.field" -> "obj")
    const dotIndex = reference.indexOf('.');
    let id = dotIndex > 0 ? reference.substring(0, dotIndex) : reference;

    // Strip edge index (e.g., "node#0" -> "node")
    const hashIndex = id.indexOf('#');
    if (hashIndex > 0) {
      id = id.substring(0, hashIndex);
    }

    return id;
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

    // Check if any container uses circular algorithm
    const hasCircularContainer = diagram.containers?.some(
      (c) => c.layoutOptions?.algorithm === LayoutAlgorithm.CIRCULAR
    );

    // If circular algorithm detected, delegate to custom circular layout
    if (
      hasCircularContainer &&
      diagram.containers &&
      diagram.containers.length === 1
    ) {
      // For single circular container, extract its contents and layout
      const container = diagram.containers[0];
      const containerId = container.id || `container-${Date.now()}`;

      const containerDiagram: DiagramAst = {
        astVersion: diagram.astVersion || '1.0',
        title: diagram.title,
        nodes: diagram.nodes.filter((n) => container.children.includes(n.id)),
        edges: diagram.edges.filter((e) => {
          const fromId = this.extractNodeId(e.from);
          const toId = this.extractNodeId(e.to);
          return (
            container.children.includes(fromId) &&
            container.children.includes(toId)
          );
        }),
        styles: diagram.styles,
        direction: diagram.direction,
      };

      const result = circularLayout(containerDiagram, {
        spacing: container.layoutOptions?.spacing || opts.spacing,
      });

      // Wrap result in container
      return {
        ...result,
        containers: [
          {
            id: containerId,
            label: container.label,
            x: 0,
            y: 0,
            width: result.size.width,
            height: result.size.height,
          },
        ],
      };
    }

    const measureText = createTextMeasurer();

    // Convert direction TB/LR -> DOWN/RIGHT
    const direction = this.convertDirection(
      opts.direction || diagram.direction || 'TB'
    );

    // Increase spacing if diagram has containers (to avoid overlaps)
    const hasContainers = diagram.containers && diagram.containers.length > 0;
    const baseSpacing = hasContainers ? 150 : 100; // Extra spacing for container diagrams
    const spacing = opts.spacing || baseSpacing;

    // Detect if this is a pedigree chart
    const isPedigreeChart = diagram.nodes.some(
      (n) => n.shape === 'pedigree-male' || n.shape === 'pedigree-female'
    );

    // Check if any edges have anchor constraints - if so, we need to allow all port sides
    const hasAnchorConstraints = diagram.edges.some(
      (e: EdgeAst) => e.anchorFrom || e.anchorTo
    );

    // Build ELK graph structure with hierarchyHandling for containers
    const elkGraph: ElkNode = {
      id: 'root',
      layoutOptions: isPedigreeChart
        ? {
            // For pedigree/family tree charts, use MrTree algorithm which is designed for trees
            'elk.algorithm': 'mrtree',
            'elk.direction': direction,
            'elk.spacing.nodeNode': '80',
            'elk.mrtree.searchOrder': 'DFS',
            'elk.edgeRouting': 'ORTHOGONAL', // Use orthogonal routing (right-angles only, no diagonals)
            'elk.portConstraints': 'FIXED_SIDE', // Honor port side constraints
          }
        : {
            'elk.algorithm': LayoutAlgorithm.LAYERED,
            'elk.direction': direction,
            'elk.spacing.nodeNode': spacing.toString(),
            'elk.layered.spacing.nodeNodeBetweenLayers': (
              spacing * 1.5
            ).toString(), // Extra layer spacing for containers
            // Force pure orthogonal (right-angle) routing - no diagonals
            'elk.edgeRouting': 'ORTHOGONAL',
            'elk.layered.unnecessaryBendpoints': 'true', // Remove unnecessary bend points
            // IMPORTANT: Only restrict to north/south ports if no anchor constraints specified
            // Otherwise, allow all port sides (north/south/east/west) for explicit anchor control
            ...(hasAnchorConstraints
              ? {}
              : { 'elk.layered.northOrSouthPort': 'true' }),
            // Port constraints - respect port sides when ports are specified
            'elk.portConstraints': 'FIXED_SIDE', // Honor port side constraints (north/south/east/west)
            // Edge spacing to prevent overlap - increased for better separation
            'elk.spacing.edgeEdge': '25', // Space between parallel edges
            'elk.spacing.edgeNode': '35', // Space between edges and nodes
            'elk.layered.spacing.edgeEdgeBetweenLayers': '25', // Space between edges crossing layers
            'elk.layered.spacing.edgeNodeBetweenLayers': '35', // Space between edges and nodes across layers
            // Edge crossing minimization
            'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
            'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX', // Better crossing reduction
            'elk.layered.considerModelOrder.strategy': 'PREFER_EDGES', // Optimize for edge clarity
            // Improve edge separation
            'elk.layered.thoroughness': '10', // Higher value = better edge routing (1-100)
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

    // Determine which nodes need ports (nodes that have edges with anchor constraints)
    const nodesNeedingPorts = new Set<string>();
    for (const edge of diagram.edges) {
      if (edge.anchorFrom || edge.anchorTo) {
        const fromNodeId = this.extractNodeId(edge.from);
        const toNodeId = this.extractNodeId(edge.to);
        if (edge.anchorFrom) nodesNeedingPorts.add(fromNodeId);
        if (edge.anchorTo) nodesNeedingPorts.add(toNodeId);
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

        // Add extra width for icons
        const hasIcon = !!(node as any).icon;
        const iconPadding = hasIcon ? 30 : 0; // Extra space for icon (16px icon + padding)

        if (!elkGraph.children) elkGraph.children = [];

        const elkNode: any = {
          id: node.id,
          width: bounds.width + iconPadding,
          height: bounds.height,
        };

        // If node has manual position, set it (fixed algorithm will respect it)
        if (node.position) {
          elkNode.x = node.position.x;
          elkNode.y = node.position.y;
        }

        // Add ports if this node has edges with anchor constraints
        if (nodesNeedingPorts.has(node.id)) {
          elkNode.ports = this.createNodePorts(
            bounds.width + iconPadding,
            bounds.height
          );
          // CRITICAL: Set port constraints on the node itself
          elkNode.layoutOptions = elkNode.layoutOptions || {};
          elkNode.layoutOptions['elk.portConstraints'] = 'FIXED_SIDE';
        }

        // Apply layer constraint for pedigree charts
        if (isPedigreeChart && nodeGenerations.has(node.id)) {
          const generation = nodeGenerations.get(node.id)!;

          // Get spouse if any - spouses should have same position priority
          const spouse = spousePairs.get(node.id);
          const basePosition = spouse && node.id < spouse ? 0 : spouse ? 1 : 0;

          elkNode.layoutOptions = elkNode.layoutOptions || {};
          elkNode.layoutOptions['elk.layered.layering.layer'] = generation;
          elkNode.layoutOptions[
            'elk.layered.crossingMinimization.semiInteractive'
          ] = 'true';
          elkNode.layoutOptions['elk.layered.nodePlacement.bk.fixedAlignment'] =
            'BALANCED';
          elkNode.layoutOptions['elk.priority'] = (
            generation * 100 +
            basePosition
          ).toString();
        }

        elkGraph.children.push(elkNode);
      }
    }

    // Add edges between standalone nodes and container placeholders
    // For layout purposes, edges to/from container nodes connect to the container placeholder
    for (let edgeIndex = 0; edgeIndex < diagram.edges.length; edgeIndex++) {
      const edge = diagram.edges[edgeIndex];
      // Extract node IDs from potentially member-level references
      // e.g., "Order.customerId" -> "Order"
      const fromNodeId = this.extractNodeId(edge.from);
      const toNodeId = this.extractNodeId(edge.to);

      const fromContainer = nodeContainerMap.get(fromNodeId);
      const toContainer = nodeContainerMap.get(toNodeId);

      // Skip edges where BOTH nodes are inside containers (these will be handled in container layouts)
      if (fromContainer && toContainer) {
        continue;
      }

      // Replace node IDs with container placeholder IDs if nodes are in containers
      const fromId = fromContainer
        ? `__container__${fromContainer}`
        : fromNodeId;
      const toId = toContainer ? `__container__${toContainer}` : toNodeId;

      if (!elkGraph.edges) elkGraph.edges = [];
      const elkEdge: any = {
        id: `${edge.from}->${edge.to}#${edgeIndex}`, // Include index to distinguish multiple edges between same nodes
        sources: [fromId],
        targets: [toId],
      };

      // Add port constraints if edge has anchor specifications
      if (edge.anchorFrom && !fromContainer) {
        // Only add sourcePort if not connecting to container (containers don't have ports)
        elkEdge.sourcePort = edge.anchorFrom;
      }
      if (edge.anchorTo && !toContainer) {
        // Only add targetPort if not connecting to container
        elkEdge.targetPort = edge.anchorTo;
      }

      elkGraph.edges.push(elkEdge);
    }

    // PASS 1: Calculate actual container sizes by laying out their contents
    // We do this BEFORE the top-level layout so ELK can position containers with accurate sizes
    if (diagram.containers) {
      await this.calculateContainerSizesRecursively(
        diagram.containers,
        diagram,
        measureText,
        containerPlaceholders,
        spacing,
        direction
      );

      // Update placeholder nodes in elkGraph with actual sizes from PASS 1
      for (const elkNode of elkGraph.children || []) {
        if (elkNode.id.startsWith('__container__')) {
          const containerId = elkNode.id.replace('__container__', '');
          const actualSize = containerPlaceholders.get(containerId);
          if (actualSize) {
            elkNode.width = actualSize.width;
            elkNode.height = actualSize.height;
          }
        }
      }
    }

    // Run ELK layout algorithm (with updated container sizes)
    // Now ELK can position containers correctly without overlap
    const laidOut = await this.elk.layout(elkGraph);

    // PASS 2: Extract container positions from ELK layout results
    // ELK has positioned container placeholders correctly relative to standalone nodes
    // respecting the top-level direction (TB, LR, etc.) and actual container sizes
    const hasSwimlanes =
      diagram.containers?.some(
        (c: ContainerDeclaration) => c.layoutOptions?.orientation
      ) ?? false;

    const containerPositions = new Map<string, { x: number; y: number }>();
    if (diagram.containers) {
      // For swimlanes OR vertical direction (TB/BT), use manual arrangement
      // ELK's layered algorithm doesn't respect document order for vertical layouts
      // and tends to position containers based on edge connections rather than sequence
      const isVerticalDirection = direction === 'DOWN' || direction === 'UP';

      if (hasSwimlanes || isVerticalDirection) {
        const manualPositions = this.arrangeSiblingContainers(
          diagram.containers,
          spacing,
          containerPlaceholders,
          direction
        );
        for (const [id, pos] of manualPositions.entries()) {
          containerPositions.set(id, pos);
        }
      } else {
        // For horizontal direction (LR/RL), use ELK layout positions
        // ELK handles horizontal spacing well and respects actual container sizes
        for (const elkNode of laidOut.children || []) {
          if (elkNode.id.startsWith('__container__')) {
            const containerId = elkNode.id.replace('__container__', '');
            containerPositions.set(containerId, {
              x: elkNode.x || 0,
              y: elkNode.y || 0,
            });
          }
        }
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
        containerPlaceholders,
        spacing,
        direction,
        nodes,
        edges,
        containers,
        hasSwimlanes
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
    const topLevelEdges = (laidOut.edges || []).filter(
      (elkEdge: ElkExtendedEdge) => {
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
      }
    );

    this.extractEdges(topLevelEdges, nodes, edges);

    // Fix cross-container edges: Replace placeholder-based routing with actual node positions
    // NOTE: This must be called AFTER layoutContainersWithNodes so that all nodes (including
    // those in containers) are in the nodes array
    this.recalculateCrossContainerEdges(
      diagram,
      nodeContainerMap,
      nodes,
      edges,
      direction
    );

    // Calculate overall diagram bounds (including negative space)
    let minX = 0;
    let minY = 0;
    let maxX = 0;
    let maxY = 0;

    for (const node of nodes) {
      const nodeLeft = node.x;
      const nodeRight = node.x + node.width;
      const nodeTop = node.y;
      const nodeBottom = node.y + node.height;

      if (nodeLeft < minX) minX = nodeLeft;
      if (nodeRight > maxX) maxX = nodeRight;
      if (nodeTop < minY) minY = nodeTop;
      if (nodeBottom > maxY) maxY = nodeBottom;
    }

    for (const container of containers) {
      const containerLeft = container.x;
      const containerRight = container.x + container.width;
      const containerTop = container.y;
      const containerBottom = container.y + container.height;

      if (containerLeft < minX) minX = containerLeft;
      if (containerRight > maxX) maxX = containerRight;
      if (containerTop < minY) minY = containerTop;
      if (containerBottom > maxY) maxY = containerBottom;
    }

    // Account for edge labels that may extend beyond nodes
    for (const edge of edges) {
      if (edge.points && edge.points.length > 0) {
        // Find the midpoint of the edge (where label is typically placed)
        const midIndex = Math.floor(edge.points.length / 2);
        const midPoint = edge.points[midIndex];

        // Find corresponding edge in diagram AST to get label
        const edgeAst = diagram.edges.find(
          (e) => e.from === edge.from && e.to === edge.to
        );

        if (edgeAst && (edgeAst as any).label) {
          // Estimate label dimensions (average character width ~8px, height ~14px)
          const labelText = (edgeAst as any).label as string;
          const estimatedLabelWidth = labelText.length * 8;
          const estimatedLabelHeight = 14;

          // Edge labels are rendered centered on the edge with dominant-baseline="middle"
          // (see edge.ts - labels at midPoint.y with vertical centering)
          const labelCenterX = midPoint.x;
          const labelCenterY = midPoint.y; // Centered on edge

          // Calculate label bounding box
          // With dominant-baseline="middle", the label extends equally above and below
          const labelLeft = labelCenterX - estimatedLabelWidth / 2;
          const labelRight = labelCenterX + estimatedLabelWidth / 2;
          const labelTop = labelCenterY - estimatedLabelHeight / 2;
          const labelBottom = labelCenterY + estimatedLabelHeight / 2;

          // Extend bounds to include label
          if (labelLeft < minX) minX = labelLeft;
          if (labelRight > maxX) maxX = labelRight;
          if (labelTop < minY) minY = labelTop;
          if (labelBottom > maxY) maxY = labelBottom;
        }
      }
    }

    // If we have negative bounds, shift everything to start at 0
    const offsetX = minX < 0 ? Math.abs(minX) : 0;
    const offsetY = minY < 0 ? Math.abs(minY) : 0;

    if (offsetX > 0 || offsetY > 0) {
      // Shift all nodes
      for (const node of nodes) {
        node.x += offsetX;
        node.y += offsetY;
      }

      // Shift all containers
      for (const container of containers) {
        container.x += offsetX;
        container.y += offsetY;
      }

      // Shift all edge points
      for (const edge of edges) {
        if (edge.points) {
          for (const point of edge.points) {
            point.x += offsetX;
            point.y += offsetY;
          }
        }
      }

      // Adjust max bounds
      maxX += offsetX;
      maxY += offsetY;
    }

    // Add padding
    const size = {
      width: maxX + 20,
      height: maxY + 20,
    };

    // Remove duplicate edges (keep only the last occurrence of each from->to pair)
    const edgeMap = new Map<string, RoutedEdge>();
    for (const edge of edges) {
      const key = `${edge.from}->${edge.to}`;
      edgeMap.set(key, edge);
    }
    const uniqueEdges = Array.from(edgeMap.values());

    // Snap edge endpoints to shape anchor points for better visual accuracy
    this.snapEdgesToAnchors(diagram, uniqueEdges, nodes, measureText);

    // Simplify edges to straight lines for radial/mindmap layouts
    this.simplifyRadialEdges(diagram, uniqueEdges);

    return { nodes, edges: uniqueEdges, size, containers };
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
   * Snap edge endpoints to shape anchor points for better visual accuracy
   */
  private snapEdgesToAnchors(
    diagram: DiagramAst,
    edges: RoutedEdge[],
    nodes: PositionedNode[],
    measureText: ReturnType<typeof createTextMeasurer>
  ): void {
    for (const edge of edges) {
      if (!edge.points || edge.points.length < 2) continue;

      // Get source and target node IDs
      const fromNodeId = this.extractNodeId(edge.from);
      const toNodeId = this.extractNodeId(edge.to);

      // Find the nodes
      const fromNode = nodes.find((n) => n.id === fromNodeId);
      const toNode = nodes.find((n) => n.id === toNodeId);

      if (!fromNode || !toNode) continue;

      // Get the diagram node definitions to access shape info
      const fromNodeDef = diagram.nodes.find((n) => n.id === fromNodeId);
      const toNodeDef = diagram.nodes.find((n) => n.id === toNodeId);

      if (!fromNodeDef || !toNodeDef) continue;

      // Get shape implementations
      const fromShape = shapeRegistry.get(fromNodeDef.shape);
      const toShape = shapeRegistry.get(toNodeDef.shape);

      if (!fromShape || !toShape) continue;

      // Get styles
      const fromStyle = fromNodeDef.style
        ? diagram.styles?.[fromNodeDef.style] || {}
        : {};
      const toStyle = toNodeDef.style
        ? diagram.styles?.[toNodeDef.style] || {}
        : {};

      // Snap first point (source) to fromNode's anchor
      let newStartPoint: { x: number; y: number } | null = null;
      let startAnchor: { x: number; y: number; name?: string } | null = null;
      if (fromShape.anchors) {
        const anchors = fromShape.anchors({
          node: fromNodeDef,
          style: fromStyle,
          measureText,
        });
        const firstPoint = edge.points[0];
        startAnchor = this.findNearestAnchor(firstPoint, anchors, fromNode);
        if (startAnchor) {
          newStartPoint = {
            x: fromNode.x + startAnchor.x,
            y: fromNode.y + startAnchor.y,
          };
        }
      }

      // Snap last point (target) to toNode's anchor
      let newEndPoint: { x: number; y: number } | null = null;
      let endAnchor: { x: number; y: number; name?: string } | null = null;
      if (toShape.anchors) {
        const anchors = toShape.anchors({
          node: toNodeDef,
          style: toStyle,
          measureText,
        });
        const lastPoint = edge.points[edge.points.length - 1];
        endAnchor = this.findNearestAnchor(lastPoint, anchors, toNode);
        if (endAnchor) {
          newEndPoint = {
            x: toNode.x + endAnchor.x,
            y: toNode.y + endAnchor.y,
          };
        }
      }

      // Apply the anchor snapping with orthogonal waypoints if needed
      if (newStartPoint || newEndPoint) {
        this.applyAnchorSnapping(
          edge,
          newStartPoint,
          newEndPoint,
          startAnchor,
          endAnchor,
          fromNode,
          toNode
        );
      }
    }
  }

  /**
   * Simplify edges to straight lines for radial/mindmap layouts.
   * Radial layouts look better with direct connections rather than orthogonal routing.
   */
  private simplifyRadialEdges(diagram: DiagramAst, edges: RoutedEdge[]): void {
    // Check if any container uses radial algorithm
    const hasRadialContainer = diagram.containers?.some(
      (c) => c.layoutOptions?.algorithm === LayoutAlgorithm.RADIAL
    );

    if (!hasRadialContainer) return;

    // Build set of node IDs in radial containers
    const radialNodeIds = new Set<string>();
    if (diagram.containers) {
      for (const container of diagram.containers) {
        if (container.layoutOptions?.algorithm === LayoutAlgorithm.RADIAL) {
          for (const childId of container.children) {
            radialNodeIds.add(childId);
          }
        }
      }
    }

    // Simplify edges between nodes in radial containers
    for (const edge of edges) {
      const fromNodeId = this.extractNodeId(edge.from);
      const toNodeId = this.extractNodeId(edge.to);

      // Only simplify if both nodes are in radial containers
      if (radialNodeIds.has(fromNodeId) && radialNodeIds.has(toNodeId)) {
        // Keep only start and end points for straight line
        if (edge.points.length > 2) {
          const start = edge.points[0];
          const end = edge.points[edge.points.length - 1];
          edge.points = [start, end];
        }
      }
    }
  }

  /**
   * Find the nearest anchor point to a given position
   */
  private findNearestAnchor(
    point: { x: number; y: number },
    anchors: Array<{ x: number; y: number; name?: string }>,
    node: PositionedNode
  ): { x: number; y: number; name?: string } | null {
    if (anchors.length === 0) return null;

    let nearestAnchor = anchors[0];
    let minDistance = Number.MAX_VALUE;

    for (const anchor of anchors) {
      const anchorX = node.x + anchor.x;
      const anchorY = node.y + anchor.y;
      const distance = Math.sqrt(
        Math.pow(point.x - anchorX, 2) + Math.pow(point.y - anchorY, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestAnchor = anchor;
      }
    }

    return nearestAnchor;
  }

  /**
   * Apply anchor snapping to an edge while maintaining orthogonal routing.
   * If the edge only has 2 points (straight line), insert intermediate waypoints
   * to create right-angle bends based on the anchor directions.
   */
  private applyAnchorSnapping(
    edge: RoutedEdge,
    newStartPoint: { x: number; y: number } | null,
    newEndPoint: { x: number; y: number } | null,
    startAnchor: { x: number; y: number; name?: string } | null,
    _endAnchor: { x: number; y: number; name?: string } | null,
    _fromNode: PositionedNode,
    _toNode: PositionedNode
  ): void {
    const oldStart = edge.points[0];
    const oldEnd = edge.points[edge.points.length - 1];

    // If edge has intermediate waypoints, update endpoints and fix first/last segments
    if (edge.points.length > 2) {
      if (newStartPoint && startAnchor?.name) {
        edge.points[0] = newStartPoint;
        // Fix the first segment to be orthogonal based on anchor direction
        const startDir = this.getAnchorDirection(startAnchor.name);
        if (startDir === 'horizontal') {
          // First segment should be horizontal
          edge.points[1] = { x: edge.points[1].x, y: newStartPoint.y };
        } else if (startDir === 'vertical') {
          // First segment should be vertical
          edge.points[1] = { x: newStartPoint.x, y: edge.points[1].y };
        }
      }
      if (newEndPoint) {
        edge.points[edge.points.length - 1] = newEndPoint;
        // TODO: Could also fix the last segment to arrive orthogonally at the end anchor
      }
      return;
    }

    // Edge only has 2 points (straight line) - need to add orthogonal waypoints
    const start = newStartPoint || oldStart;
    const end = newEndPoint || oldEnd;

    // Determine initial direction based on start anchor name
    const startDirection = this.getAnchorDirection(startAnchor?.name);

    // Create orthogonal routing based on anchor directions
    if (startDirection === 'horizontal') {
      // Exit horizontally from start anchor
      const midX = start.x + (end.x - start.x) * 0.5;
      edge.points = [
        start,
        { x: midX, y: start.y }, // Horizontal segment
        { x: midX, y: end.y }, // Vertical segment
        end,
      ];
    } else if (startDirection === 'vertical') {
      // Exit vertically from start anchor
      const midY = start.y + (end.y - start.y) * 0.5;
      edge.points = [
        start,
        { x: start.x, y: midY }, // Vertical segment
        { x: end.x, y: midY }, // Horizontal segment
        end,
      ];
    } else {
      // No anchor info - fallback to distance-based logic
      const dx = Math.abs(end.x - start.x);
      const dy = Math.abs(end.y - start.y);

      if (dx > dy) {
        const midX = start.x + (end.x - start.x) * 0.5;
        edge.points = [
          start,
          { x: midX, y: start.y },
          { x: midX, y: end.y },
          end,
        ];
      } else {
        const midY = start.y + (end.y - start.y) * 0.5;
        edge.points = [
          start,
          { x: start.x, y: midY },
          { x: end.x, y: midY },
          end,
        ];
      }
    }
  }

  /**
   * Determine the direction an edge should leave from an anchor based on its name.
   * Returns 'horizontal' for left/right anchors, 'vertical' for top/bottom anchors.
   */
  private getAnchorDirection(
    anchorName?: string
  ): 'horizontal' | 'vertical' | null {
    if (!anchorName) return null;

    const name = anchorName.toLowerCase();
    if (name === 'left' || name === 'right') {
      return 'horizontal';
    }
    if (name === 'top' || name === 'bottom') {
      return 'vertical';
    }
    return null;
  }

  /**
   * Calculate positions for sibling containers based on orientation
   * For swimlanes: Calculate initial positions with uniform dimensions
   * For regular containers: Position sequentially based on direction
   */
  private arrangeSiblingContainers(
    containers: ContainerDeclaration[],
    spacing: number,
    placeholders: Map<string, { width: number; height: number }>,
    direction?: string
  ): Map<string, { x: number; y: number }> {
    const positions = new Map<string, { x: number; y: number }>();

    // First pass: determine if we have swimlanes and calculate uniform dimensions
    const hasHorizontalSwim = containers.some(
      (c) => c.layoutOptions?.orientation === 'horizontal'
    );
    const hasVerticalSwim = containers.some(
      (c) => c.layoutOptions?.orientation === 'vertical'
    );

    let uniformWidth: number | undefined;
    let uniformHeight: number | undefined;

    // For horizontal swimlanes: all should have same width (widest one)
    if (hasHorizontalSwim) {
      let maxWidth = 0;
      for (const container of containers) {
        if (container.layoutOptions?.orientation === 'horizontal') {
          const placeholder = placeholders.get(container.id!);
          const width = placeholder?.width || 400;
          maxWidth = Math.max(maxWidth, width);
        }
      }
      uniformWidth = maxWidth;
    }

    // For vertical swimlanes: all should have same height (tallest one)
    if (hasVerticalSwim) {
      let maxHeight = 0;
      for (const container of containers) {
        if (container.layoutOptions?.orientation === 'vertical') {
          const placeholder = placeholders.get(container.id!);
          const height = placeholder?.height || 300;
          maxHeight = Math.max(maxHeight, height);
        }
      }
      uniformHeight = maxHeight;
    }

    // Second pass: position containers
    let currentX = 0;
    let currentY = 0;

    for (const container of containers) {
      const placeholder = placeholders.get(container.id!);
      const orientation = container.layoutOptions?.orientation;

      // For swimlanes: use uniform dimensions and arrange spatially
      // For regular containers: position at (0,0) initially - will be repositioned after layout
      if (orientation) {
        // This is a swimlane - use uniform dimensions
        const width =
          orientation === 'horizontal' && uniformWidth
            ? uniformWidth
            : placeholder?.width || 400;
        const height =
          orientation === 'vertical' && uniformHeight
            ? uniformHeight
            : placeholder?.height || 300;

        positions.set(container.id!, { x: currentX, y: currentY });
        placeholders.set(container.id!, { width, height });

        if (orientation === 'horizontal') {
          currentY += height + spacing;
        } else {
          currentX += width + spacing;
        }
      } else {
        // Regular container - arrange based on direction
        // After PASS 1 (calculateContainerSizesRecursively), placeholder contains REAL size from ELK layout
        const width = placeholder?.width || 200;
        const height = placeholder?.height || 150;

        positions.set(container.id!, { x: currentX, y: currentY });

        // Arrange containers based on direction
        const isHorizontal = direction === 'RIGHT' || direction === 'LEFT';
        if (isHorizontal) {
          currentX += width + spacing;
        } else {
          // Vertical (DOWN/UP) or default
          currentY += height + spacing;
        }
      }
    }

    return positions;
  }

  /**
   * Apply uniform dimensions to swimlanes after content layout
   * All horizontal swimlanes get the same width (widest)
   * All vertical swimlanes get the same height (tallest)
   * Also recalculates positions to account for actual content sizes
   * and adjusts child node/edge positions accordingly
   */
  private applyUniformSwimlaneDimensions(
    containers: ContainerDeclaration[],
    positionedContainers: PositionedContainer[],
    nodes: PositionedNode[],
    edges: RoutedEdge[],
    direction: string,
    nodeContainerMap: Map<string, string>
  ): void {
    // Find max dimensions for each orientation
    let maxHorizontalWidth = 0;
    let maxVerticalHeight = 0;

    for (let i = 0; i < containers.length; i++) {
      const container = containers[i];
      const positioned = positionedContainers[i];
      const orientation = container.layoutOptions?.orientation;

      if (orientation === 'horizontal') {
        maxHorizontalWidth = Math.max(maxHorizontalWidth, positioned.width);
      } else if (orientation === 'vertical') {
        maxVerticalHeight = Math.max(maxVerticalHeight, positioned.height);
      }
    }

    // Apply uniform dimensions and recalculate positions
    let currentX = 0;
    let currentY = 0;
    const spacing = 80; // Default spacing between swimlanes

    for (let i = 0; i < containers.length; i++) {
      const container = containers[i];
      const positioned = positionedContainers[i];
      const orientation = container.layoutOptions?.orientation;

      // Update position for sibling swimlanes (only at root level where x=0 or y=0)
      if (orientation === 'horizontal' && positioned.x === 0) {
        // Horizontal swimlanes: update Y position and track the delta
        const oldY = positioned.y;
        const newY = currentY;
        const deltaY = newY - oldY;

        positioned.y = newY;
        positioned.width = maxHorizontalWidth;

        // Adjust all nodes in this container
        for (const node of nodes) {
          // Check if node belongs to this container
          if (container.children.includes(node.id)) {
            node.y += deltaY;
          }
        }

        // Adjust internal edge points (both nodes in this container)
        for (const edge of edges) {
          const fromNodeInContainer = container.children.includes(
            this.extractNodeId(edge.from)
          );
          const toNodeInContainer = container.children.includes(
            this.extractNodeId(edge.to)
          );

          if (fromNodeInContainer && toNodeInContainer) {
            // Internal edge - adjust all points
            for (const point of edge.points) {
              point.y += deltaY;
            }
          }
          // Cross-container edges will be recalculated after this function returns
        }

        currentY += positioned.height + spacing;
      } else if (orientation === 'vertical' && positioned.y === 0) {
        // Vertical swimlanes: update X position and track the delta
        const oldX = positioned.x;
        const newX = currentX;
        const deltaX = newX - oldX;

        positioned.x = newX;
        positioned.height = maxVerticalHeight;

        // Adjust all nodes in this container
        for (const node of nodes) {
          if (container.children.includes(node.id)) {
            node.x += deltaX;
          }
        }

        // Adjust internal edge points (both nodes in this container)
        for (const edge of edges) {
          const fromNodeInContainer = container.children.includes(
            this.extractNodeId(edge.from)
          );
          const toNodeInContainer = container.children.includes(
            this.extractNodeId(edge.to)
          );

          if (fromNodeInContainer && toNodeInContainer) {
            // Internal edge - adjust all points
            for (const point of edge.points) {
              point.x += deltaX;
            }
          }
          // Cross-container edges will be recalculated after all containers are positioned
        }

        currentX += positioned.width + spacing;
      }
    }

    // Regenerate cross-container edge routing with updated node positions
    this.regenerateCrossContainerEdgeRouting(
      nodes,
      edges,
      direction,
      nodeContainerMap
    );
  }

  /**
   * Reposition regular (non-swimlane) containers to avoid overlap
   * Stacks containers vertically based on their actual laid-out heights
   */
  /**
   * Regenerate routing for cross-container edges after node positions change
   */
  private regenerateCrossContainerEdgeRouting(
    nodes: PositionedNode[],
    edges: RoutedEdge[],
    direction: string,
    nodeContainerMap: Map<string, string>
  ): void {
    // Use the provided nodeContainerMap which was built recursively
    // (no need to rebuild - it already contains all nested containers)

    // Regenerate routing for cross-container edges
    for (const edge of edges) {
      const fromNodeId = this.extractNodeId(edge.from);
      const toNodeId = this.extractNodeId(edge.to);

      const fromContainer = nodeContainerMap.get(fromNodeId);
      const toContainer = nodeContainerMap.get(toNodeId);

      // Check if this is a cross-container edge
      const isCrossContainer =
        (fromContainer && toContainer && fromContainer !== toContainer) ||
        (fromContainer && !toContainer) ||
        (!fromContainer && toContainer);

      if (isCrossContainer) {
        const fromNode = nodes.find((n) => n.id === fromNodeId);
        const toNode = nodes.find((n) => n.id === toNodeId);

        if (fromNode && toNode) {
          const fromCenterX = fromNode.x + fromNode.width / 2;
          const fromCenterY = fromNode.y + fromNode.height / 2;
          const toCenterX = toNode.x + toNode.width / 2;
          const toCenterY = toNode.y + toNode.height / 2;

          edge.points = this.generateOrthogonalRouting(
            fromCenterX,
            fromCenterY,
            toCenterX,
            toCenterY,
            direction
          );
        }
      }
    }
  }

  /**
   * Recalculate cross-container edge routing based on current node positions
   */
  private recalculateCrossContainerEdges(
    diagram: DiagramAst,
    nodeContainerMap: Map<string, string>,
    nodes: PositionedNode[],
    edges: RoutedEdge[],
    direction: string
  ): void {
    for (const edge of diagram.edges) {
      // Extract node IDs from potentially member-level references
      const fromNodeId = this.extractNodeId(edge.from);
      const toNodeId = this.extractNodeId(edge.to);

      const fromContainer = nodeContainerMap.get(fromNodeId);
      const toContainer = nodeContainerMap.get(toNodeId);

      // Check if this edge crosses a container boundary
      // Cross-container means: different containers OR one in container and one not
      const isCrossContainer =
        (fromContainer && !toContainer) ||
        (!fromContainer && toContainer) ||
        (fromContainer && toContainer && fromContainer !== toContainer);

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
    // For BPMN pools, calculate uniform width (max of all pools)
    const bpmnPools = containers.filter((c) => c.shape === 'bpmnPool');
    let uniformPoolWidth: number | undefined;

    if (bpmnPools.length > 1) {
      // Calculate max width needed across all pools
      let maxWidth = 0;
      for (const pool of bpmnPools) {
        const padding =
          pool.containerStyle?.padding !== undefined
            ? pool.containerStyle.padding
            : 30;
        const childCount = pool.children.length;
        const avgNodeSize = 100;
        const estimatedWidth = Math.max(
          400, // Minimum width for pools
          Math.sqrt(childCount) * avgNodeSize * 1.5 + padding * 2
        );
        maxWidth = Math.max(maxWidth, estimatedWidth);
      }
      uniformPoolWidth = maxWidth;
    }

    for (const container of containers) {
      // Map Runiq algorithm to ELK algorithm ID
      const algorithm = this.mapAlgorithmToElk(
        container.layoutOptions?.algorithm || LayoutAlgorithm.LAYERED
      );
      const containerSpacing =
        container.layoutOptions?.spacing?.toString() || '50';

      // Determine layout direction based on container options or shape
      // Priority: container.layoutOptions.direction > container.shape override > default
      let direction = 'DOWN'; // Default: vertical

      if (container.layoutOptions?.direction) {
        // Use explicit direction if specified
        direction = this.mapDirectionToElk(container.layoutOptions.direction);
      } else if (container.shape === 'bpmnPool') {
        // BPMN pools default to horizontal flow
        direction = 'RIGHT';
      }

      // For radial/mindmap layouts, use straight lines instead of orthogonal routing
      const isRadialLayout =
        container.layoutOptions?.algorithm === LayoutAlgorithm.RADIAL;

      // Create a mini ELK graph for this container's contents
      const containerGraph: ElkNode = {
        id: `__container_internal__${container.id}`,
        layoutOptions: isRadialLayout
          ? {
              'elk.algorithm': algorithm,
              'elk.direction': direction,
              'elk.spacing.nodeNode': containerSpacing,
              'elk.edgeRouting': 'ORTHOGONAL', // Use orthogonal routing (right-angles only, no diagonals)
              'elk.portConstraints': 'FIXED_SIDE', // Honor port side constraints
            }
          : {
              'elk.algorithm': algorithm,
              'elk.direction': direction,
              'elk.spacing.nodeNode': containerSpacing,
              'elk.portConstraints': 'FIXED_SIDE', // Honor port side constraints
            },
        children: [],
        edges: [],
      };

      // For radial/mindmap layouts, calculate levels and apply level-based styling
      if (isRadialLayout) {
        // Create a sub-diagram with just this container's nodes and edges
        const containerSubDiagram: DiagramAst = {
          astVersion: diagram.astVersion || '1.0',
          title: diagram.title,
          nodes: diagram.nodes.filter((n) => container.children.includes(n.id)),
          edges: diagram.edges.filter((e) => {
            const fromNodeId = this.extractNodeId(e.from);
            const toNodeId = this.extractNodeId(e.to);
            return (
              container.children.includes(fromNodeId) &&
              container.children.includes(toNodeId)
            );
          }),
          styles: diagram.styles,
          direction: diagram.direction,
        };

        // Calculate mindmap levels
        const nodeLevels = new Map<string, number>();
        const rootNode = this.calculateMindmapLevels(
          containerSubDiagram,
          nodeLevels
        );

        // Apply level-based styling
        if (rootNode) {
          this.applyMindmapLevelStyling(containerSubDiagram, nodeLevels);
        }
      }

      // Determine which container nodes need ports (nodes with anchor constraints)
      const containerNodesNeedingPorts = new Set<string>();
      for (const edge of diagram.edges) {
        const fromNodeId = this.extractNodeId(edge.from);
        const toNodeId = this.extractNodeId(edge.to);
        if (
          container.children.includes(fromNodeId) &&
          container.children.includes(toNodeId)
        ) {
          if (edge.anchorFrom) containerNodesNeedingPorts.add(fromNodeId);
          if (edge.anchorTo) containerNodesNeedingPorts.add(toNodeId);
        }
      }

      // Add child nodes to container graph
      for (const childId of container.children) {
        const node = diagram.nodes.find((n) => n.id === childId);
        if (node) {
          const shapeImpl = shapeRegistry.get(node.shape);
          if (!shapeImpl) continue;

          const style = node.style ? diagram.styles?.[node.style] || {} : {};
          const bounds = shapeImpl.bounds({ node, style, measureText });

          const containerNode: any = {
            id: node.id,
            width: bounds.width,
            height: bounds.height,
          };

          // Add ports if this node has edges with anchor constraints
          if (containerNodesNeedingPorts.has(node.id)) {
            containerNode.ports = this.createNodePorts(
              bounds.width,
              bounds.height
            );
            // CRITICAL: Set port constraints on the node itself
            containerNode.layoutOptions = {
              'elk.portConstraints': 'FIXED_SIDE',
            };
          }

          containerGraph.children!.push(containerNode);
        }
      }

      // Add edges within this container
      for (let edgeIndex = 0; edgeIndex < diagram.edges.length; edgeIndex++) {
        const edge = diagram.edges[edgeIndex];
        // Extract node IDs from potentially member-level references
        const fromNodeId = this.extractNodeId(edge.from);
        const toNodeId = this.extractNodeId(edge.to);

        if (
          container.children.includes(fromNodeId) &&
          container.children.includes(toNodeId)
        ) {
          const containerEdge: any = {
            id: `${edge.from}->${edge.to}#${edgeIndex}`,
            sources: [fromNodeId],
            targets: [toNodeId],
          };

          // Add port constraints if edge has anchor specifications
          if (edge.anchorFrom) {
            containerEdge.sourcePort = edge.anchorFrom;
          }
          if (edge.anchorTo) {
            containerEdge.targetPort = edge.anchorTo;
          }

          containerGraph.edges!.push(containerEdge);
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

      // Use uniform width for BPMN pools, otherwise calculate individually
      let estimatedWidth: number;
      if (container.shape === 'bpmnPool' && uniformPoolWidth) {
        estimatedWidth = uniformPoolWidth;
      } else {
        estimatedWidth = Math.max(
          200,
          Math.sqrt(childCount) * avgNodeSize + padding * 2
        );
      }

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
   * PASS 1: Calculate actual container sizes by laying out contents
   * This runs BEFORE positioning to get accurate dimensions
   */
  private async calculateContainerSizesRecursively(
    containers: ContainerDeclaration[],
    diagram: DiagramAst,
    measureText: ReturnType<typeof createTextMeasurer>,
    containerPlaceholders: Map<string, { width: number; height: number }>,
    spacing: number,
    direction: string
  ): Promise<void> {
    for (const container of containers) {
      const padding =
        container.containerStyle?.padding !== undefined
          ? container.containerStyle.padding
          : 30;

      // Step 1: Recursively calculate nested container sizes first (depth-first)
      if (container.containers && container.containers.length > 0) {
        await this.calculateContainerSizesRecursively(
          container.containers,
          diagram,
          measureText,
          containerPlaceholders,
          spacing,
          direction
        );
      }

      // Step 2: Layout this container's direct children with ELK to get content size
      const algorithm = this.mapAlgorithmToElk(
        container.layoutOptions?.algorithm || LayoutAlgorithm.LAYERED
      );

      // Determine container direction: explicit option > shape override > parent direction
      let containerDirection = direction;
      if (container.layoutOptions?.direction) {
        containerDirection = this.mapDirectionToElk(
          container.layoutOptions.direction
        );
      } else if (container.shape === 'bpmnPool') {
        containerDirection = 'RIGHT';
      }

      const containerGraph: ElkNode = {
        id: `container_${container.id}`,
        layoutOptions: {
          'elk.algorithm': algorithm,
          'elk.direction': containerDirection,
          'elk.spacing.nodeNode': spacing.toString(),
          'elk.layered.spacing.nodeNodeBetweenLayers': spacing.toString(),
          // Force pure orthogonal routing
          'elk.edgeRouting': 'ORTHOGONAL',
          'elk.layered.unnecessaryBendpoints': 'true',
          'elk.layered.northOrSouthPort': 'true',
          // Edge spacing to prevent overlap - increased for better separation
          'elk.spacing.edgeEdge': '25',
          'elk.spacing.edgeNode': '35',
          'elk.layered.spacing.edgeEdgeBetweenLayers': '25',
          'elk.layered.spacing.edgeNodeBetweenLayers': '35',
          'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
          'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
          'elk.layered.thoroughness': '10',
        },
        children: [],
        edges: [],
      };

      // Add child nodes to graph
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

      // NOTE: We do NOT add placeholder nodes for nested containers in PASS 1
      // because we manually position nested containers below direct children.
      // Adding placeholders would cause ELK to lay out direct children differently
      // in PASS 1 vs PASS 2, leading to incorrect container sizing.

      // Add internal edges
      for (let edgeIndex = 0; edgeIndex < diagram.edges.length; edgeIndex++) {
        const edge = diagram.edges[edgeIndex];
        if (
          container.children.includes(edge.from) &&
          container.children.includes(edge.to)
        ) {
          containerGraph.edges!.push({
            id: `${edge.from}->${edge.to}#${edgeIndex}`,
            sources: [edge.from],
            targets: [edge.to],
          });
        }
      }

      // Step 3: Layout with ELK to get actual content dimensions
      let contentWidth = 200; // Minimum defaults
      let contentHeight = 150;
      let directChildrenHeight = 0; // Track height of direct child shapes

      if (containerGraph.children!.length > 0) {
        try {
          const laidOutContainer = await this.elk.layout(containerGraph);
          contentWidth = (laidOutContainer.width || 0) + padding * 2;
          contentHeight = (laidOutContainer.height || 0) + padding * 2;

          // Calculate the actual height used by direct child shapes (excluding placeholders)
          for (const node of laidOutContainer.children || []) {
            if (!node.id.startsWith('__nestedcontainer__')) {
              const nodeBottom = (node.y || 0) + (node.height || 0);
              directChildrenHeight = Math.max(directChildrenHeight, nodeBottom);
            }
          }
        } catch (error) {
          // Fall back to defaults if layout fails
        }
      }

      // Step 4: If has nested containers, position them BELOW the direct child shapes
      if (container.containers && container.containers.length > 0) {
        // Start nested containers after the direct children, with spacing
        const nestedStartY =
          directChildrenHeight > 0 ? directChildrenHeight + spacing : 0;

        // Arrange nested containers starting from nestedStartY
        const tempPositions = this.arrangeSiblingContainers(
          container.containers,
          spacing,
          containerPlaceholders
        );

        // Adjust Y positions to start after direct children
        const adjustedPositions = new Map<string, { x: number; y: number }>();
        for (const [id, pos] of tempPositions.entries()) {
          adjustedPositions.set(id, {
            x: pos.x,
            y: pos.y + nestedStartY,
          });
        }

        // Calculate extent of nested containers with adjusted positions
        let maxRight = 0;
        let maxBottom = nestedStartY; // Start from where nested containers begin

        for (const nested of container.containers) {
          const nestedSize = containerPlaceholders.get(nested.id!);
          const nestedPos = adjustedPositions.get(nested.id!);

          if (nestedSize && nestedPos) {
            maxRight = Math.max(maxRight, nestedPos.x + nestedSize.width);
            maxBottom = Math.max(maxBottom, nestedPos.y + nestedSize.height);
          }
        }

        // Add padding on all sides
        const nestedContainerWidth = padding + maxRight + padding;
        const nestedContainerHeight = padding + maxBottom + padding;

        // Use the larger of: content from direct children OR nested containers
        contentWidth = Math.max(contentWidth, nestedContainerWidth);
        contentHeight = Math.max(contentHeight, nestedContainerHeight);

        // Store adjusted positions for later use (we'll need to pass this to PASS 2)
        // For now, we'll recalculate in PASS 2
      }

      // Step 5: Store the calculated size in placeholders
      containerPlaceholders.set(container.id!, {
        width: contentWidth,
        height: contentHeight,
      });
    }
  }

  /**
   * PASS 2: Layout nodes within containers and position everything
   * This runs AFTER size calculation, using accurate dimensions
   */
  private async layoutContainersWithNodes(
    containers: ContainerDeclaration[],
    diagram: DiagramAst,
    measureText: ReturnType<typeof createTextMeasurer>,
    nodeContainerMap: Map<string, string>,
    containerPositions: Map<string, { x: number; y: number }>,
    containerPlaceholders: Map<string, { width: number; height: number }>,
    spacing: number,
    direction: string,
    nodes: PositionedNode[],
    edges: RoutedEdge[],
    result: PositionedContainer[],
    hasSwimlanes: boolean
  ): Promise<void> {
    // layout containers and contents
    for (const container of containers) {
      // process one container
      const padding =
        container.containerStyle?.padding !== undefined
          ? container.containerStyle.padding
          : 30;

      // Get container position from placeholder
      // Note: This position is relative to the parent container's content area
      const containerPos = containerPositions.get(container.id!) || {
        x: 0,
        y: 0,
      };

      // Create mini ELK graph for container contents
      // Map Runiq algorithm to ELK algorithm ID
      const algorithm = this.mapAlgorithmToElk(
        container.layoutOptions?.algorithm || LayoutAlgorithm.LAYERED
      );

      // Determine container direction: explicit option > shape override > parent direction
      let containerDirection = direction; // Default: use diagram direction
      if (container.layoutOptions?.direction) {
        containerDirection = this.mapDirectionToElk(
          container.layoutOptions.direction
        );
      } else if (container.shape === 'bpmnPool') {
        containerDirection = 'RIGHT'; // Horizontal flow for BPMN pools
      }

      const containerGraph: ElkNode = {
        id: `container_${container.id}`,
        layoutOptions: {
          'elk.algorithm': algorithm,
          'elk.direction': containerDirection, // Use container-specific direction
          'elk.spacing.nodeNode': spacing.toString(),
          'elk.layered.spacing.nodeNodeBetweenLayers': spacing.toString(),
          // Force pure orthogonal (right-angle) routing - no diagonals
          'elk.edgeRouting': 'ORTHOGONAL',
          // Orthogonal edge routing specific options
          'elk.layered.unnecessaryBendpoints': 'true', // Remove unnecessary bend points
          'elk.layered.northOrSouthPort': 'true', // Use north/south ports for better orthogonal routing
          // Edge spacing to prevent overlap - increased for better separation
          'elk.spacing.edgeEdge': '25',
          'elk.spacing.edgeNode': '35',
          'elk.layered.spacing.edgeEdgeBetweenLayers': '25',
          'elk.layered.spacing.edgeNodeBetweenLayers': '35',
          // Edge crossing minimization for container layouts
          'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
          'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
          'elk.layered.thoroughness': '10', // Better edge routing
        },
        children: [],
        edges: [],
      };

      // Add child nodes
      // resolve child nodes in diagram

      for (const childId of container.children) {
        const node = diagram.nodes.find((n) => n.id === childId);
        if (node) {
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
      for (let edgeIndex = 0; edgeIndex < diagram.edges.length; edgeIndex++) {
        const edge = diagram.edges[edgeIndex];
        if (
          container.children.includes(edge.from) &&
          container.children.includes(edge.to)
        ) {
          containerGraph.edges!.push({
            id: `${edge.from}->${edge.to}#${edgeIndex}`,
            sources: [edge.from],
            targets: [edge.to],
          });
        }
      }

      // Use container size from PASS 1 (already calculated by calculateContainerSizesRecursively)
      const placeholder = containerPlaceholders.get(container.id!);
      const containerWidth = placeholder?.width || 200;
      const containerHeight = placeholder?.height || 150;

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
          // edges laid out within container

          const tempEdges: RoutedEdge[] = [];
          this.extractEdges(laidOutContainer.edges || [], nodes, tempEdges);

          // adjust edge points relative to container

          // Adjust edge positions to be relative to container
          for (const edge of tempEdges) {
            for (const point of edge.points) {
              point.x += containerPos.x + padding;
              point.y += containerPos.y + padding;
            }
          }

          edges.push(...tempEdges);

          // DON'T update placeholder - it was already calculated in PASS 1!
          // We're using the pre-calculated size from calculateContainerSizesRecursively
        } catch (error) {
          // Fall back to default positioning if layout fails
        }
      }

      // Handle nested containers recursively
      const nestedContainers: PositionedContainer[] = [];
      if (container.containers) {
        // Calculate the height used by direct child shapes (if any)
        let directChildrenHeight = 0;
        if (containerGraph.children!.length > 0) {
          try {
            const laidOutContainer = await this.elk.layout(containerGraph);
            for (const node of laidOutContainer.children || []) {
              if (!node.id.startsWith('__nestedcontainer__')) {
                const nodeBottom = (node.y || 0) + (node.height || 0);
                directChildrenHeight = Math.max(
                  directChildrenHeight,
                  nodeBottom
                );
              }
            }
          } catch (error) {
            // Ignore errors, will use default positioning
          }
        }

        // Position nested containers BELOW direct child shapes
        const nestedStartY =
          directChildrenHeight > 0 ? directChildrenHeight + spacing : 0;

        // Calculate positions for nested sibling containers (relative to this container's content area)
        const tempPositions = this.arrangeSiblingContainers(
          container.containers,
          spacing,
          containerPlaceholders
        );

        // Adjust positions to start after direct children
        const nestedPositions = new Map<string, { x: number; y: number }>();
        for (const [id, pos] of tempPositions.entries()) {
          nestedPositions.set(id, {
            x: pos.x,
            y: pos.y + nestedStartY,
          });
        }

        // Convert relative positions to absolute by adding parent container's position + padding
        const absoluteNestedPositions = new Map<
          string,
          { x: number; y: number }
        >();
        for (const [id, pos] of nestedPositions.entries()) {
          absoluteNestedPositions.set(id, {
            x: containerPos.x + padding + pos.x,
            y: containerPos.y + padding + pos.y,
          });
        }

        await this.layoutContainersWithNodes(
          container.containers,
          diagram,
          measureText,
          nodeContainerMap,
          absoluteNestedPositions, // Pass absolute positions
          containerPlaceholders,
          spacing,
          direction,
          nodes,
          edges,
          nestedContainers,
          hasSwimlanes
        );

        // No need to adjust positions after the fact - they're already absolute
      }

      // Container size was already calculated in PASS 1 (calculateContainerSizesRecursively)
      // Don't recalculate here - just use the pre-computed size from placeholders
      // The PASS 1 calculation correctly handles nested container extents with relative positioning

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

    // Post-process containers based on their type
    const hasSwim = containers.some((c) => c.layoutOptions?.orientation);
    const hasRegular = containers.some((c) => !c.layoutOptions?.orientation);

    if (hasSwim) {
      // Apply uniform dimensions to swimlanes and adjust positions
      this.applyUniformSwimlaneDimensions(
        containers,
        result,
        nodes,
        edges,
        direction,
        nodeContainerMap
      );
    }

    if (hasRegular) {
      // Regular containers are already properly positioned by arrangeSiblingContainers
      // No need to reposition them - that would reset nested containers to y=0
      // But we still need to regenerate cross-container edge routing
      this.regenerateCrossContainerEdgeRouting(
        nodes,
        edges,
        direction,
        nodeContainerMap
      );
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

      // Extract original from/to from edge ID (format: "from->to#index")
      const edgeParts = elkEdge.id.split('->');
      const from = edgeParts[0];
      const toPart = edgeParts[1] || elkEdge.targets[0];

      // Parse edge index if present
      const indexMatch = toPart.match(/^(.+)#(\d+)$/);
      let to: string;
      let edgeIndex: number | undefined;

      if (indexMatch) {
        to = indexMatch[1];
        edgeIndex = parseInt(indexMatch[2], 10);
      } else {
        to = toPart;
      }

      edges.push({
        from,
        to,
        points,
        edgeIndex,
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
      case LayoutAlgorithm.LAYERED:
        return 'layered';
      case LayoutAlgorithm.FORCE:
        return 'org.eclipse.elk.force';
      case LayoutAlgorithm.STRESS:
        return 'org.eclipse.elk.stress';
      case LayoutAlgorithm.RADIAL:
        return 'org.eclipse.elk.radial';
      case LayoutAlgorithm.MRTREE:
        return 'org.eclipse.elk.mrtree';
      case LayoutAlgorithm.CIRCULAR:
        return 'circular'; // Custom algorithm, handled separately
      default:
        return 'layered'; // Default fallback
    }
  }

  private mapDirectionToElk(direction: string): string {
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
        return 'DOWN'; // Default fallback
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
   * Calculate mindmap levels using BFS from root node(s).
   * Level 0 = root/central node (no incoming edges or explicitly marked)
   * Level 1 = nodes directly connected to root
   * Level 2 = nodes connected to level 1, etc.
   *
   * Stores level for each node in the provided Map.
   */
  private calculateMindmapLevels(
    diagram: DiagramAst,
    nodeLevels: Map<string, number>
  ): string | null {
    // Build adjacency list (directed graph)
    const outgoing = new Map<string, Set<string>>();
    const incoming = new Map<string, Set<string>>();

    for (const node of diagram.nodes) {
      outgoing.set(node.id, new Set());
      incoming.set(node.id, new Set());
    }

    for (const edge of diagram.edges) {
      outgoing.get(edge.from)?.add(edge.to);
      incoming.get(edge.to)?.add(edge.from);
    }

    // Find root node(s) - nodes with no incoming edges
    const roots: string[] = [];
    for (const node of diagram.nodes) {
      const incomingEdges = incoming.get(node.id);
      if (!incomingEdges || incomingEdges.size === 0) {
        roots.push(node.id);
      }
    }

    // If no clear root (cyclic graph), use first circle node, or first node
    let rootNode: string | null = null;
    if (roots.length === 0) {
      // Look for circle shape as central node
      const circleNode = diagram.nodes.find(
        (n) => n.shape === 'circle' || n.shape === 'circ'
      );
      rootNode = circleNode ? circleNode.id : diagram.nodes[0]?.id || null;
    } else if (roots.length === 1) {
      rootNode = roots[0];
    } else {
      // Multiple roots - prefer circle shape, otherwise first root
      const circleRoot = roots.find((id) => {
        const node = diagram.nodes.find((n) => n.id === id);
        return node?.shape === 'circle' || node?.shape === 'circ';
      });
      rootNode = circleRoot || roots[0];
    }

    if (!rootNode) return null;

    // BFS to calculate levels
    const queue: Array<{ nodeId: string; level: number }> = [
      { nodeId: rootNode, level: 0 },
    ];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { nodeId, level } = queue.shift()!;

      if (visited.has(nodeId)) continue;
      visited.add(nodeId);

      nodeLevels.set(nodeId, level);

      // Add all outgoing neighbors to queue with level + 1
      const neighbors = outgoing.get(nodeId);
      if (neighbors) {
        for (const neighborId of neighbors) {
          if (!visited.has(neighborId)) {
            queue.push({ nodeId: neighborId, level: level + 1 });
          }
        }
      }
    }

    return rootNode;
  }

  /**
   * Apply level-based styling to nodes in a mindmap/radial diagram.
   * Different levels get different visual treatments to show hierarchy.
   * Includes automatic color theming for visual clarity.
   */
  private applyMindmapLevelStyling(
    diagram: DiagramAst,
    nodeLevels: Map<string, number>
  ): void {
    // Level-based style defaults with colors
    const levelStyles = [
      // Level 0 (root/central) - white with purple accent
      {
        fontSize: 16,
        strokeWidth: 3,
        padding: 16,
        fillColor: '#ffffff',
        strokeColor: '#8b5cf6',
      },
      // Level 1 (main branches) - vibrant colors cycling through palette
      {
        fontSize: 14,
        strokeWidth: 2,
        padding: 14,
        // Will be assigned from color palette per branch
      },
      // Level 2 (sub-branches) - lighter tints of level 1 colors
      {
        fontSize: 12,
        strokeWidth: 1,
        padding: 12,
        // Will be assigned based on parent's color
      },
      // Level 3+ (detail branches) - even lighter tints
      {
        fontSize: 11,
        strokeWidth: 1,
        padding: 10,
        // Will be assigned based on parent's color
      },
    ];

    // Color palette for level 1 branches (vibrant, distinct colors)
    const level1ColorPalette = [
      { fill: '#3b82f6', stroke: '#2563eb' }, // Blue
      { fill: '#10b981', stroke: '#059669' }, // Green
      { fill: '#f59e0b', stroke: '#d97706' }, // Amber
      { fill: '#ec4899', stroke: '#db2777' }, // Pink
      { fill: '#8b5cf6', stroke: '#7c3aed' }, // Purple
      { fill: '#06b6d4', stroke: '#0891b2' }, // Cyan
      { fill: '#ef4444', stroke: '#dc2626' }, // Red
      { fill: '#84cc16', stroke: '#65a30d' }, // Lime
    ];

    // Map to track parent colors for inheritance
    const nodeColors = new Map<string, { fill: string; stroke: string }>();

    // Track which level 1 color index to use next
    let level1ColorIndex = 0;

    // First pass: assign colors to level 0 and level 1 nodes
    for (const node of diagram.nodes) {
      const level = nodeLevels.get(node.id);
      if (level === undefined || level > 1) continue;

      if (!node.data) node.data = {};

      if (level === 0) {
        // Central node - white with purple accent
        if (node.data.fillColor === undefined) {
          node.data.fillColor = levelStyles[0].fillColor;
        }
        if (node.data.strokeColor === undefined) {
          node.data.strokeColor = levelStyles[0].strokeColor;
        }
        nodeColors.set(node.id, {
          fill: node.data.fillColor as string,
          stroke: node.data.strokeColor as string,
        });
      } else if (level === 1) {
        // Main branch - assign from color palette
        if (
          node.data.fillColor === undefined &&
          node.data.strokeColor === undefined
        ) {
          const colorPair =
            level1ColorPalette[level1ColorIndex % level1ColorPalette.length];
          node.data.fillColor = colorPair.fill;
          node.data.strokeColor = colorPair.stroke;
          nodeColors.set(node.id, colorPair);
          level1ColorIndex++;
        } else {
          // Store explicitly set colors
          nodeColors.set(node.id, {
            fill: (node.data.fillColor as string) || '#3b82f6',
            stroke: (node.data.strokeColor as string) || '#2563eb',
          });
        }
      }
    }

    // Build parent map to inherit colors for level 2+
    const nodeParent = new Map<string, string>();
    for (const edge of diagram.edges) {
      const fromLevel = nodeLevels.get(edge.from);
      const toLevel = nodeLevels.get(edge.to);
      if (
        fromLevel !== undefined &&
        toLevel !== undefined &&
        toLevel > fromLevel
      ) {
        nodeParent.set(edge.to, edge.from);
      }
    }

    // Helper to lighten a color
    const lightenColor = (hex: string, percent: number): string => {
      const num = parseInt(hex.replace('#', ''), 16);
      const r = Math.min(
        255,
        Math.floor((num >> 16) + (255 - (num >> 16)) * percent)
      );
      const g = Math.min(
        255,
        Math.floor(
          ((num >> 8) & 0x00ff) + (255 - ((num >> 8) & 0x00ff)) * percent
        )
      );
      const b = Math.min(
        255,
        Math.floor((num & 0x0000ff) + (255 - (num & 0x0000ff)) * percent)
      );
      return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    };

    // Second pass: assign colors to level 2+ nodes based on parent
    for (const node of diagram.nodes) {
      const level = nodeLevels.get(node.id);
      if (level === undefined || level <= 1) continue;

      if (!node.data) node.data = {};

      // Get style for this level (use level 3+ style for all levels >= 3)
      const styleIndex = Math.min(level, levelStyles.length - 1);
      const levelStyle = levelStyles[styleIndex];

      // Apply base styling (fontSize, strokeWidth)
      if (node.data.fontSize === undefined) {
        node.data.fontSize = levelStyle.fontSize;
      }
      if (node.data.strokeWidth === undefined) {
        node.data.strokeWidth = levelStyle.strokeWidth;
      }

      // Inherit and lighten color from parent if not explicitly set
      if (
        node.data.fillColor === undefined ||
        node.data.strokeColor === undefined
      ) {
        const parentId = nodeParent.get(node.id);
        const parentColor = parentId ? nodeColors.get(parentId) : null;

        if (parentColor) {
          // Lighten based on level depth
          const lightenAmount = level === 2 ? 0.6 : 0.8;
          const lightFill = lightenColor(parentColor.fill, lightenAmount);
          const lightStroke = lightenColor(
            parentColor.stroke,
            lightenAmount * 0.5
          );

          if (node.data.fillColor === undefined) {
            node.data.fillColor = lightFill;
          }
          if (node.data.strokeColor === undefined) {
            node.data.strokeColor = lightStroke;
          }

          nodeColors.set(node.id, {
            fill: node.data.fillColor as string,
            stroke: node.data.strokeColor as string,
          });
        }
      }

      // Store level for potential renderer use
      node.data.mindmapLevel = level;
    }

    // Third pass: ensure all level 0 and 1 nodes have mindmapLevel stored
    for (const node of diagram.nodes) {
      const level = nodeLevels.get(node.id);
      if (level !== undefined && level <= 1) {
        if (!node.data) node.data = {};
        node.data.mindmapLevel = level;
      }
    }

    // Fourth pass: apply thick edge styling for mindmap connections
    // Edges should be visually prominent in mindmaps
    // Mindmaps traditionally don't show arrows - just connecting lines
    for (const edge of diagram.edges) {
      // Only style if not already explicitly styled
      if (edge.strokeWidth === undefined) {
        // Apply thick stroke for mindmap edges (default is 1)
        edge.strokeWidth = 2.5;
      }
      if (edge.strokeColor === undefined) {
        // Use a neutral gray that works with all branch colors
        edge.strokeColor = '#6b7280';
      }
      if (edge.arrowType === undefined) {
        // Mindmaps traditionally don't use arrows
        edge.arrowType = 'none';
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
