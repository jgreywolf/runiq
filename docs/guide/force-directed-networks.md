# Force-Directed Networks & Graph Theory

Force-directed networks visualize relationships between entities using physics-based layouts where nodes repel each other and edges act like springs. This creates organic, natural-looking graphs that reveal patterns and communities.

## Quick Start

### Simple Social Network

```runiq
diagram "Social Network" {
  container "Network" algorithm: force spacing: 120 {
    shape Alice as @circle label:"Alice"
    shape Bob as @circle label:"Bob"
    shape Carol as @circle label:"Carol"
    shape David as @circle label:"David"
    shape Eve as @circle label:"Eve"

    Alice -> Bob
    Alice -> Carol
    Bob -> David
    Carol -> David
    Carol -> Eve
    David -> Eve
  }
}
```

The `algorithm: force` option uses force-directed placement where:

- **Nodes repel** each other (like magnets with same poles)
- **Edges attract** their connected nodes (like springs)
- The system finds **equilibrium** automatically

## Algorithm Comparison

| Algorithm   | Use Case                            | Node Count | Edge Routing   |
| ----------- | ----------------------------------- | ---------- | -------------- |
| **force**   | Networks, clusters, organic layouts | 10-100     | Straight lines |
| **layered** | Hierarchies, flowcharts, trees      | Any        | Orthogonal     |
| **stress**  | Similarity graphs, MDS              | 10-50      | Straight lines |
| **radial**  | Hierarchies with central focus      | 10-50      | Radial         |

## When to Use Force Layout

✅ **Good for:**

- Social networks (friends, followers)
- Citation networks (paper references)
- Computer networks (servers, routers)
- Dependency graphs (software packages)
- Collaboration networks (teamwork)
- Biological networks (protein interactions)
- Knowledge graphs (concepts, relationships)

❌ **Not ideal for:**

- Strict hierarchies (use `layered`)
- Sequential processes (use `layered` with `direction: LR`)
- Large networks >200 nodes (performance)

## Syntax & Options

### Container-Level Configuration

```runiq
container "Network"
  algorithm: force     // Force-directed layout
  spacing: 120         // Node separation (default: 80)
  direction: TB {      // Optional hint for initial placement
  // ... nodes and edges
}
```

### Spacing Guidelines

- **60-80**: Compact networks (tight clustering)
- **100-120**: Standard networks (balanced)
- **150-200**: Spacious networks (clear separation)
- **200+**: Very loose networks (emphasize individual nodes)

## Performance Considerations

### Node Count Guidelines

| Nodes   | Performance | Recommendation                        |
| ------- | ----------- | ------------------------------------- |
| 1-20    | Instant     | Perfect for small networks            |
| 20-50   | < 1s        | Good for medium networks              |
| 50-100  | 1-3s        | Acceptable for complex networks       |
| 100-200 | 3-5s        | Use with caution, consider filtering  |
| 200+    | 5s+         | Not recommended, split into subgraphs |

### Optimization Tips

1. **Reduce Edge Count**: Each edge adds computational cost
2. **Use Higher Spacing**: 150-200 can improve performance
3. **Simplify Shapes**: Use `circle` or `circ` instead of complex shapes
4. **Limit Labels**: Shorter labels render faster
5. **Try Stress Algorithm**: For <50 nodes, `algorithm: stress` may be faster

## Advanced Techniques

### Hybrid Layouts

Mix force layout with hierarchical structure:

```runiq
diagram "Hybrid Network" {
  // Top-level hierarchy (layered)
  container "Core Team" direction: TB {
    shape lead as @actor label:"Team Lead"

    // Force-directed subnetwork
    container "Developers" algorithm: force spacing: 100 {
      shape dev1 as @circle label:"Dev 1"
      shape dev2 as @circle label:"Dev 2"
      shape dev3 as @circle label:"Dev 3"

      dev1 -> dev2
      dev2 -> dev3
      dev3 -> dev1
    }

    lead -> dev1
  }
}
```

### Clustered Networks

Use multiple containers to show distinct communities:

```runiq
diagram "Communities" direction: LR {
  container "Cluster A" algorithm: force spacing: 90 {
    shape a1 as @circle label:"A1"
    shape a2 as @circle label:"A2"
    shape a3 as @circle label:"A3"
    a1 -> a2
    a2 -> a3
  }

  container "Cluster B" algorithm: force spacing: 90 {
    shape b1 as @circle label:"B1"
    shape b2 as @circle label:"B2"
    shape b3 as @circle label:"B3"
    b1 -> b2
    b2 -> b3
  }

  // Bridge between clusters
  edge a2 -> b1 label:"connection"
}
```

## Best Practices

### 1. Choose Appropriate Spacing

- **Tight** (60-80): Emphasize connections
- **Standard** (100-120): Balanced (default)
- **Loose** (150+): Emphasize individual nodes

### 2. Use Meaningful Shapes

- **Circles**: Generic nodes, people
- **Rectangles**: Processes, systems, concepts
- **Hexagons**: Special nodes, hubs
- **Diamonds**: Decision points, gateways
- **Cylinders**: Databases, storage

### 3. Keep It Readable

- **Limit nodes**: < 50 for clarity
- **Label strategically**: Only important nodes
- **Use colors**: Group related nodes
- **Add legends**: Explain node types

### 4. Design for Discovery

Force layouts reveal natural patterns:

- **Clusters** emerge automatically
- **Hub nodes** become central
- **Bridges** between communities visible
- **Isolated nodes** appear at edges

## Comparison with Layered Layout

### Force vs Layered

```runiq
diagram "Layout Comparison" direction: LR {
  // Hierarchical (layered)
  container "Layered" direction: TB {
    shape a as @circle label:"A"
    shape b as @circle label:"B"
    shape c as @circle label:"C"
    a -> b
    a -> c
  }

  // Organic (force)
  container "Force" algorithm: force {
    shape d as @circle label:"D"
    shape e as @circle label:"E"
    shape f as @circle label:"F"
    d -> e
    d -> f
  }
}
```

| Aspect             | Layered            | Force             |
| ------------------ | ------------------ | ----------------- |
| **Structure**      | Strict hierarchy   | Organic, fluid    |
| **Direction**      | Clear flow         | Multi-directional |
| **Predictability** | Highly predictable | Varies per run    |
| **Use Case**       | Processes, trees   | Networks, graphs  |
| **Edge Crossings** | Minimized          | Not optimized     |

## Troubleshooting

### Nodes Overlapping

**Solution**: Increase spacing

```runiq
container "Network" algorithm: force spacing: 150 { ... }
```

### Layout Too Spread Out

**Solution**: Decrease spacing

```runiq
container "Network" algorithm: force spacing: 70 { ... }
```

### Slow Performance

**Solution**: Reduce nodes or use stress algorithm

```runiq
container "Network" algorithm: stress spacing: 100 { ... }
```

### Too Many Edge Crossings

**Solution**: Force layout doesn't minimize crossings. For hierarchical data, use:

```runiq
container "Network" direction: TB { ... }  // Uses layered algorithm
```

## Related Topics

- [Layout & Direction](./layout.md) - General layout documentation
- [Weighted Graphs](./weighted-graphs.md) - Add weights to edges for cost/distance networks
- [Graph Metrics](../reference/graph-metrics.md) - Compute centrality and clustering metrics
- [Network Diagrams](./network-diagrams.md) - Network topology diagrams
- [Containers](./containers.md) - Container syntax
- [Shapes Reference](../reference/shapes.md) - Available shapes

## Examples

See the [examples/force](../examples/force-directed) directory for more complete examples:

- Basic force-directed network
- Social network with communities
- Software dependencies
- Concept relationships
