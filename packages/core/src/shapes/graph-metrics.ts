/**
 * Graph Metrics Module
 *
 * Computes graph theory metrics for network analysis:
 * - Degree centrality (in-degree, out-degree, total degree)
 * - Betweenness centrality (shortest paths through node)
 * - Closeness centrality (average distance to all nodes)
 * - Clustering coefficient (interconnectedness of neighbors)
 *
 * These metrics help identify important nodes, communities, and network structure.
 */

import type { DiagramAst } from '../types/index.js';

/**
 * Graph metrics for a single node
 */
export interface NodeMetrics {
  nodeId: string;

  /** Number of incoming edges */
  inDegree: number;

  /** Number of outgoing edges */
  outDegree: number;

  /** Total number of connected edges (in + out for directed, unique neighbors for undirected) */
  degree: number;

  /** Betweenness centrality (0-1): fraction of shortest paths passing through this node */
  betweenness: number;

  /** Closeness centrality (0-1): inverse average distance to all other nodes */
  closeness: number;

  /** Clustering coefficient (0-1): how interconnected are this node's neighbors */
  clustering: number;
}

/**
 * Overall graph metrics
 */
export interface GraphMetrics {
  /** Total number of nodes */
  nodeCount: number;

  /** Total number of edges */
  edgeCount: number;

  /** Average degree across all nodes */
  averageDegree: number;

  /** Network density (0-1): actual edges / possible edges */
  density: number;

  /** Whether the graph is connected (all nodes reachable) */
  isConnected: boolean;

  /** Per-node metrics */
  nodes: NodeMetrics[];
}

/**
 * Internal adjacency list representation for graph algorithms
 */
interface GraphData {
  nodes: Set<string>;
  edges: Map<string, Set<string>>; // from -> [to, ...]
  reverseEdges: Map<string, Set<string>>; // to -> [from, ...]
  weights: Map<string, number>; // "from->to" -> weight
  undirected: boolean;
}

/**
 * Build graph data structure from diagram AST
 */
function buildGraphData(diagram: DiagramAst): GraphData {
  const nodes = new Set<string>();
  const edges = new Map<string, Set<string>>();
  const reverseEdges = new Map<string, Set<string>>();
  const weights = new Map<string, number>();

  // Collect all diagram-level nodes
  for (const node of diagram.nodes) {
    nodes.add(node.id);
  }

  // Collect all diagram-level edges
  for (const edge of diagram.edges) {
    const from = edge.from;
    const to = edge.to;

    // Add nodes if not already present (edges can reference undeclared nodes)
    nodes.add(from);
    nodes.add(to);

    // Add forward edge
    if (!edges.has(from)) edges.set(from, new Set());
    edges.get(from)!.add(to);

    // Add reverse edge
    if (!reverseEdges.has(to)) reverseEdges.set(to, new Set());
    reverseEdges.get(to)!.add(from);

    // Store weight if present
    if (edge.weight !== undefined) {
      weights.set(`${from}->${to}`, edge.weight);
    }
  }

  return {
    nodes,
    edges,
    reverseEdges,
    weights,
    undirected: false, // Assume directed unless specified
  };
}

/**
 * Compute degree centrality for all nodes
 */
function computeDegrees(
  graph: GraphData
): Map<string, { in: number; out: number; total: number }> {
  const degrees = new Map<string, { in: number; out: number; total: number }>();

  for (const node of graph.nodes) {
    const outDegree = graph.edges.get(node)?.size || 0;
    const inDegree = graph.reverseEdges.get(node)?.size || 0;

    // For directed graphs, total = in + out
    // For undirected graphs, total = unique neighbors
    const total = graph.undirected
      ? new Set([
          ...(graph.edges.get(node) || []),
          ...(graph.reverseEdges.get(node) || []),
        ]).size
      : inDegree + outDegree;

    degrees.set(node, { in: inDegree, out: outDegree, total });
  }

  return degrees;
}

/**
 * Compute shortest paths using Floyd-Warshall algorithm
 * Returns distance matrix: distances[from][to] = shortest path length
 */
function computeShortestPaths(
  graph: GraphData
): Map<string, Map<string, number>> {
  const nodes = Array.from(graph.nodes);
  const distances = new Map<string, Map<string, number>>();

  // Initialize distances
  for (const from of nodes) {
    const row = new Map<string, number>();
    for (const to of nodes) {
      if (from === to) {
        row.set(to, 0);
      } else if (graph.edges.get(from)?.has(to)) {
        // Use weight if available, otherwise 1
        const weight = graph.weights.get(`${from}->${to}`) || 1;
        row.set(to, weight);
      } else {
        row.set(to, Infinity);
      }
    }
    distances.set(from, row);
  }

  // Floyd-Warshall algorithm
  for (const k of nodes) {
    for (const i of nodes) {
      for (const j of nodes) {
        const distIK = distances.get(i)!.get(k)!;
        const distKJ = distances.get(k)!.get(j)!;
        const distIJ = distances.get(i)!.get(j)!;

        if (distIK + distKJ < distIJ) {
          distances.get(i)!.set(j, distIK + distKJ);
        }
      }
    }
  }

  return distances;
}

/**
 * Compute betweenness centrality for all nodes
 * Measures how often a node appears on shortest paths between other nodes
 */
function computeBetweenness(graph: GraphData): Map<string, number> {
  const betweenness = new Map<string, number>();
  const nodes = Array.from(graph.nodes);

  // Initialize all nodes to 0
  for (const node of nodes) {
    betweenness.set(node, 0);
  }

  // For each pair of nodes, count shortest paths through each intermediate node
  for (const source of nodes) {
    // BFS to find shortest paths from source
    const distances = new Map<string, number>();
    const pathCounts = new Map<string, number>();
    const predecessors = new Map<string, Set<string>>();
    const queue: string[] = [source];

    distances.set(source, 0);
    pathCounts.set(source, 1);

    while (queue.length > 0) {
      const current = queue.shift()!;
      const currentDist = distances.get(current)!;
      const neighbors = graph.edges.get(current) || new Set();

      for (const neighbor of neighbors) {
        const weight = graph.weights.get(`${current}->${neighbor}`) || 1;
        const newDist = currentDist + weight;

        if (!distances.has(neighbor)) {
          // First time visiting neighbor
          distances.set(neighbor, newDist);
          pathCounts.set(neighbor, pathCounts.get(current)!);
          predecessors.set(neighbor, new Set([current]));
          queue.push(neighbor);
        } else if (newDist === distances.get(neighbor)!) {
          // Found another shortest path to neighbor
          pathCounts.set(
            neighbor,
            pathCounts.get(neighbor)! + pathCounts.get(current)!
          );
          predecessors.get(neighbor)!.add(current);
        }
      }
    }

    // Accumulate betweenness scores
    const dependency = new Map<string, number>();
    for (const node of nodes) {
      dependency.set(node, 0);
    }

    // Process nodes in reverse BFS order
    const sorted = Array.from(distances.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([node]) => node);

    for (const w of sorted) {
      if (w === source) continue;

      const preds = predecessors.get(w) || new Set();
      for (const v of preds) {
        const contribution =
          (pathCounts.get(v)! / pathCounts.get(w)!) * (1 + dependency.get(w)!);
        dependency.set(v, dependency.get(v)! + contribution);
      }

      betweenness.set(w, betweenness.get(w)! + dependency.get(w)!);
    }
  }

  // Normalize by dividing by (n-1)(n-2) for directed graphs
  const n = nodes.length;
  const normFactor = n > 2 ? (n - 1) * (n - 2) : 1;

  for (const [node, value] of betweenness) {
    betweenness.set(node, value / normFactor);
  }

  return betweenness;
}

/**
 * Compute closeness centrality for all nodes
 * Measures average distance from a node to all other nodes
 */
function computeCloseness(
  graph: GraphData,
  distances: Map<string, Map<string, number>>
): Map<string, number> {
  const closeness = new Map<string, number>();
  const nodes = Array.from(graph.nodes);

  for (const node of nodes) {
    const nodeDistances = distances.get(node)!;
    let totalDistance = 0;
    let reachableCount = 0;

    for (const [target, dist] of nodeDistances) {
      if (target !== node && dist !== Infinity) {
        totalDistance += dist;
        reachableCount++;
      }
    }

    // Closeness = (n-1) / sum of distances
    // Normalized by reachable count for disconnected graphs
    if (reachableCount > 0) {
      closeness.set(node, reachableCount / totalDistance);
    } else {
      closeness.set(node, 0);
    }
  }

  return closeness;
}

/**
 * Compute clustering coefficient for all nodes
 * Measures how interconnected a node's neighbors are
 */
function computeClustering(graph: GraphData): Map<string, number> {
  const clustering = new Map<string, number>();

  for (const node of graph.nodes) {
    const neighbors = new Set([
      ...(graph.edges.get(node) || []),
      ...(graph.reverseEdges.get(node) || []),
    ]);

    if (neighbors.size < 2) {
      clustering.set(node, 0);
      continue;
    }

    // Count edges between neighbors
    let edgeCount = 0;
    const neighborArray = Array.from(neighbors);

    for (let i = 0; i < neighborArray.length; i++) {
      for (let j = i + 1; j < neighborArray.length; j++) {
        const n1 = neighborArray[i];
        const n2 = neighborArray[j];

        if (graph.edges.get(n1)?.has(n2) || graph.edges.get(n2)?.has(n1)) {
          edgeCount++;
        }
      }
    }

    // Clustering coefficient = actual edges / possible edges
    const possibleEdges = (neighbors.size * (neighbors.size - 1)) / 2;
    clustering.set(node, edgeCount / possibleEdges);
  }

  return clustering;
}

/**
 * Check if graph is connected using DFS
 */
function isConnected(graph: GraphData): boolean {
  if (graph.nodes.size === 0) return true;

  const visited = new Set<string>();
  const stack = [Array.from(graph.nodes)[0]];

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (visited.has(node)) continue;

    visited.add(node);

    // Add all neighbors (both directions for undirected)
    const neighbors = new Set([
      ...(graph.edges.get(node) || []),
      ...(graph.reverseEdges.get(node) || []),
    ]);

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
      }
    }
  }

  return visited.size === graph.nodes.size;
}

/**
 * Calculate comprehensive graph metrics for a diagram
 *
 * @param diagram - Diagram AST to analyze
 * @returns Graph metrics including per-node and overall statistics
 *
 * @example
 * ```typescript
 * const metrics = calculateGraphMetrics(diagram);
 * console.log(`Network density: ${metrics.density.toFixed(2)}`);
 * console.log(`Most central node: ${metrics.nodes[0].nodeId}`);
 * ```
 */
export function calculateGraphMetrics(diagram: DiagramAst): GraphMetrics {
  const graph = buildGraphData(diagram);

  // Compute all metrics
  const degrees = computeDegrees(graph);
  const distances = computeShortestPaths(graph);
  const betweenness = computeBetweenness(graph);
  const closeness = computeCloseness(graph, distances);
  const clustering = computeClustering(graph);

  // Build per-node metrics
  const nodeMetrics: NodeMetrics[] = Array.from(graph.nodes).map((nodeId) => {
    const degree = degrees.get(nodeId)!;
    return {
      nodeId,
      inDegree: degree.in,
      outDegree: degree.out,
      degree: degree.total,
      betweenness: betweenness.get(nodeId) || 0,
      closeness: closeness.get(nodeId) || 0,
      clustering: clustering.get(nodeId) || 0,
    };
  });

  // Sort by degree (most connected first)
  nodeMetrics.sort((a, b) => b.degree - a.degree);

  // Compute overall metrics
  const nodeCount = graph.nodes.size;
  const edgeCount = Array.from(graph.edges.values()).reduce(
    (sum, set) => sum + set.size,
    0
  );
  const averageDegree = nodeCount > 0 ? edgeCount / nodeCount : 0;

  // Density = actual edges / possible edges
  // For directed graph: possible edges = n * (n-1)
  // For undirected graph: possible edges = n * (n-1) / 2
  const possibleEdges = graph.undirected
    ? (nodeCount * (nodeCount - 1)) / 2
    : nodeCount * (nodeCount - 1);
  const density = possibleEdges > 0 ? edgeCount / possibleEdges : 0;

  return {
    nodeCount,
    edgeCount,
    averageDegree,
    density,
    isConnected: isConnected(graph),
    nodes: nodeMetrics,
  };
}

/**
 * Find hub nodes (high degree centrality)
 *
 * @param metrics - Graph metrics from calculateGraphMetrics
 * @param threshold - Minimum degree to be considered a hub (default: top 20%)
 * @returns Array of hub nodes sorted by degree
 */
export function findHubNodes(
  metrics: GraphMetrics,
  threshold?: number
): NodeMetrics[] {
  const cutoff = threshold || metrics.averageDegree * 1.5;
  return metrics.nodes.filter((node) => node.degree >= cutoff);
}

/**
 * Find bridge nodes (high betweenness centrality)
 *
 * @param metrics - Graph metrics from calculateGraphMetrics
 * @param threshold - Minimum betweenness to be considered a bridge (default: top 20%)
 * @returns Array of bridge nodes sorted by betweenness
 */
export function findBridgeNodes(
  metrics: GraphMetrics,
  threshold?: number
): NodeMetrics[] {
  const sorted = [...metrics.nodes].sort(
    (a, b) => b.betweenness - a.betweenness
  );
  const cutoff = threshold || 0.1;
  return sorted.filter((node) => node.betweenness >= cutoff);
}

/**
 * Find peripheral nodes (low closeness centrality)
 *
 * @param metrics - Graph metrics from calculateGraphMetrics
 * @param threshold - Maximum closeness to be considered peripheral (default: bottom 20%)
 * @returns Array of peripheral nodes sorted by closeness
 */
export function findPeripheralNodes(
  metrics: GraphMetrics,
  threshold?: number
): NodeMetrics[] {
  const sorted = [...metrics.nodes].sort((a, b) => a.closeness - b.closeness);
  const cutoff = threshold || 0.3;
  return sorted.filter((node) => node.closeness <= cutoff);
}
