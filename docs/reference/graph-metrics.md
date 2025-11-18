# Graph Metrics

Graph metrics provide quantitative analysis of network structures, identifying important nodes, communities, and connectivity patterns.

## Overview

Runiq automatically calculates graph theory metrics for diagrams with edges (network structures). These metrics help identify:

- **Hub nodes**: Nodes with many connections (high degree)
- **Bridge nodes**: Nodes connecting different communities (high betweenness)
- **Central nodes**: Nodes with shortest paths to all others (high closeness)
- **Clustered nodes**: Nodes with interconnected neighbors (high clustering)

## Available Metrics

### Degree Centrality

**What it measures**: Number of connections a node has

- `inDegree`: Number of incoming edges
- `outDegree`: Number of outgoing edges
- `degree`: Total connections (in + out for directed, unique neighbors for undirected)

**Use cases**:

- Identifying popular or influential nodes
- Finding hubs in social networks
- Detecting highly connected infrastructure components

### Betweenness Centrality

**What it measures**: Fraction of shortest paths passing through a node (0-1)

**Use cases**:

- Identifying bridge nodes between communities
- Finding bottlenecks in networks
- Detecting critical connection points

### Closeness Centrality

**What it measures**: Inverse of average distance to all other nodes (0-1)

**Use cases**:

- Finding nodes with best overall connectivity
- Optimizing placement of distribution centers
- Identifying influential positions in communication networks

### Clustering Coefficient

**What it measures**: How interconnected a node's neighbors are (0-1)

**Use cases**:

- Detecting tightly-knit communities
- Identifying cliques or clusters
- Measuring local network density

## Calculating Metrics

### TypeScript API

```typescript
import { calculateGraphMetrics } from '@runiq/core';

const diagram = {
  nodes: [
    { id: 'A', shape: 'circle' },
    { id: 'B', shape: 'circle' },
    { id: 'C', shape: 'circle' },
  ],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
  ],
};

const metrics = calculateGraphMetrics(diagram);

console.log(`Network density: ${metrics.density.toFixed(2)}`);
console.log(`Average degree: ${metrics.averageDegree.toFixed(2)}`);
console.log(`Is connected: ${metrics.isConnected}`);

// Per-node metrics
metrics.nodes.forEach((node) => {
  console.log(`${node.nodeId}:`);
  console.log(`  Degree: ${node.degree}`);
  console.log(`  Betweenness: ${node.betweenness.toFixed(3)}`);
  console.log(`  Closeness: ${node.closeness.toFixed(3)}`);
  console.log(`  Clustering: ${node.clustering.toFixed(3)}`);
});
```

### Helper Functions

```typescript
import {
  findHubNodes,
  findBridgeNodes,
  findPeripheralNodes,
} from '@runiq/core';

// Find most connected nodes (top 20% by degree)
const hubs = findHubNodes(metrics);

// Find bridge nodes (top 20% by betweenness)
const bridges = findBridgeNodes(metrics);

// Find isolated nodes (bottom 20% by closeness)
const peripheral = findPeripheralNodes(metrics);
```

## Visualizing Metrics

### DSL Syntax

Display metrics as badges on nodes using three properties:

```runiq
diagram "Network with Metrics" {
  shape node1 as @circle label: "Node 1"
    showMetrics: true
    metricType: degree
    metricPosition: top-right

  shape node2 as @circle label: "Node 2"
    showMetrics: true
    metricType: betweenness
    metricPosition: top-left

  node1 -> node2
}
```

### Properties

#### `showMetrics`

**Type**: `boolean`  
**Default**: `false`

Enable or disable metric badge display for this node.

```runiq
shape myNode as @circle label: "Node" showMetrics: true
```

#### `metricType`

**Type**: `degree | betweenness | closeness | clustering`  
**Default**: `degree`

Which metric to display on the badge.

```runiq
shape myNode as @circle label: "Node"
  showMetrics: true
  metricType: betweenness
```

**Badge Labels**:

- `D:` - Degree (shows integer count)
- `B:` - Betweenness (shows 0.00 - 1.00)
- `C:` - Closeness (shows 0.00 - 1.00)
- `CC:` - Clustering Coefficient (shows 0.00 - 1.00)

#### `metricPosition`

**Type**: `top-right | top-left | bottom-right | bottom-left`  
**Default**: `top-right`

Where to position the metric badge relative to the node.

```runiq
shape myNode as @circle label: "Node"
  showMetrics: true
  metricPosition: top-left
```

### Examples

#### Social Network (Degree Centrality)

```runiq
diagram "Social Network" {
  shape alice as @person label: "Alice" showMetrics: true
  shape bob as @person label: "Bob" showMetrics: true
  shape charlie as @person label: "Charlie" showMetrics: true

  alice -> bob label: "friends"
  alice -> charlie label: "friends"
  bob -> charlie label: "friends"
}
```

Result: Alice shows `D:2`, Bob shows `D:2`, Charlie shows `D:2`

#### Citation Network (Betweenness Centrality)

```runiq
diagram "Citation Network" {
  shape paper1 as @document label: "Paper 1"
    showMetrics: true metricType: betweenness
  shape paper2 as @document label: "Paper 2 (Bridge)"
    showMetrics: true metricType: betweenness
  shape paper3 as @document label: "Paper 3"
    showMetrics: true metricType: betweenness

  paper1 -> paper2 label: "cites"
  paper2 -> paper3 label: "cites"
}
```

Result: Paper 2 (bridge node) has higher betweenness value

#### Infrastructure (Closeness Centrality)

```runiq
diagram "Server Infrastructure" {
  shape lb as @server label: "Load Balancer"
    showMetrics: true metricType: closeness
  shape web as @server label: "Web Server"
    showMetrics: true metricType: closeness
  shape db as @database label: "Database"
    showMetrics: true metricType: closeness

  lb -> web
  web -> db
}
```

Result: Web server (central position) has highest closeness value

## Metric Algorithms

### Degree Calculation

Simple count of edges connected to each node:

- **In-degree**: Count incoming edges
- **Out-degree**: Count outgoing edges
- **Total degree**: Sum (for directed graphs) or unique neighbors (for undirected)

Time complexity: O(E) where E is number of edges

### Betweenness Calculation

Uses Brandes' algorithm for efficient all-pairs shortest paths:

1. For each node, compute shortest paths to all other nodes (BFS/Dijkstra)
2. Count how many shortest paths pass through each node
3. Normalize by total possible paths

Time complexity: O(VE) for unweighted graphs, O(VE + V²log V) for weighted

### Closeness Calculation

Measures average distance from node to all others:

1. Compute shortest paths from node to all reachable nodes
2. Calculate average distance
3. Take inverse (closer = higher value)
4. Handle disconnected components

Time complexity: O(VE) for unweighted graphs

### Clustering Coefficient

Measures local density around a node:

1. Count actual connections between neighbors
2. Compare to maximum possible connections
3. Ratio gives clustering coefficient (0-1)

Time complexity: O(V³) in worst case (dense graphs)

## Edge Weights

Metrics respect edge weights when present:

```runiq
diagram "Weighted Network" {
  shape a as @circle label: "A" showMetrics: true metricType: closeness
  shape b as @circle label: "B" showMetrics: true metricType: closeness
  shape c as @circle label: "C" showMetrics: true metricType: closeness

  a -> b weight: 1
  b -> c weight: 10
  a -> c weight: 2
}
```

Closeness considers weighted path distances: A→C direct (weight 2) is shorter than A→B→C (total weight 11)

## Performance Considerations

- Metrics are calculated once when diagram is rendered
- Calculation time scales with graph size:
  - Small networks (< 100 nodes): Instant
  - Medium networks (100-1000 nodes): < 1 second
  - Large networks (1000+ nodes): May take several seconds
- Betweenness is the most expensive metric (O(VE))
- Consider showing metrics only on key nodes for large graphs

## Best Practices

### Choosing Metric Types

- **Degree**: Good for identifying hubs, influencers, critical components
- **Betweenness**: Best for finding bridges, bottlenecks, control points
- **Closeness**: Ideal for distribution centers, broadcast points
- **Clustering**: Useful for detecting communities, tightly-knit groups

### Visual Design

```runiq
// Mix metrics for different insights
diagram "Mixed Analysis" {
  shape hub as @circle label: "Hub"
    showMetrics: true metricType: degree

  shape bridge as @circle label: "Bridge"
    showMetrics: true metricType: betweenness

  shape center as @circle label: "Center"
    showMetrics: true metricType: closeness

  hub -> bridge
  bridge -> center
}
```

### Selective Display

Don't show metrics on every node - highlight only interesting ones:

```runiq
diagram "Selective Metrics" {
  // Show metrics on important nodes
  shape server as @server label: "Main Server"
    showMetrics: true metricType: closeness

  // Don't show on leaf nodes
  shape client1 as @rectangle label: "Client 1"
  shape client2 as @rectangle label: "Client 2"

  client1 -> server
  client2 -> server
}
```

## See Also

- [Edge Weights](./edges.md) - Edge weight syntax for weighted graphs
- [Network Layouts](../guide/layout.md) - Layout algorithms for network diagrams
- [DSL Syntax Reference](../DSL-SYNTAX-REFERENCE.md) - Complete syntax reference
