# Weighted Graphs

Weighted graphs assign numeric values (weights) to edges, representing costs, distances, capacities, or other metrics. Runiq supports weighted edges through the `weight` property.

## Current Capabilities & Limitations

::: tip What Works

- ✅ **Parsing & Storage**: Weights are fully parsed and stored in the diagram AST
- ✅ **Graph Metrics**: Weights are used internally for shortest path, betweenness centrality, and other graph analysis algorithms
- ✅ **Data Model**: Weights integrate seamlessly with the type system and validation
  :::

::: warning Known Limitations

- ⚠️ **Layout Engine**: Weights are **not** currently passed to ELK layout engine and do not affect node positioning or edge routing
- ⚠️ **Visualization**: Weights are **not** automatically displayed on edges (you must manually add labels)
- ⚠️ **API Access**: Internal graph algorithms are not yet exposed as user-facing APIs
  :::

**Workaround**: Manually duplicate weight values in edge labels to make them visible:

```runiq
A -> B weight: 10 label: "10 mi"  # Weight for metrics + label for display
```

## Syntax

Add the `weight` property to any edge:

```runiq
A -> B weight: 10
A -> B weight: 5.5 label: "5.5 miles"
```

## Use Cases

### Distance Networks

Model geographic distances, travel times, or physical measurements:

```runiq
diagram "Road Network" {
  container "US East Coast" algorithm: force {
    shape boston as @circle label:"Boston"
    shape nyc as @circle label:"New York"
    shape philly as @circle label:"Philadelphia"
    shape waDC as @circle label:"Washington DC"

    boston -> nyc weight: 215 label:"215 mi"
    nyc -> philly weight: 95 label:"95 mi"
    philly -> waDC weight: 140 label:"140 mi"
    boston -> philly weight: 310 label:"310 mi"
  }
}
```

### Network Latency

Represent communication costs, latency, or response times:

```runiq
diagram "Network Latency" {
  container "Server Network" algorithm: force {
    shape server1 as @server label:"Server 1"
    shape server2 as @server label:"Server 2"
    shape server3 as @server label:"Server 3"
    shape db as @database label:"Database"

    server1 -> server2 weight: 5 label:"5ms"
    server2 -> server3 weight: 3 label:"3ms"
    server1 -> db weight: 10 label:"10ms"
    server3 -> db weight: 8 label:"8ms"
  }
}
```

### Capacity Networks

Model bandwidth, throughput, or flow capacity:

```runiq
diagram "Network Capacity" {
  container "Data Flow" algorithm: force {
    shape a as @circle label:"A"
    shape b as @circle label:"B"
    shape c as @circle label:"C"
    shape d as @circle label:"D"

    a -> b weight: 100 strokeWidth: 5 label:"100 Mbps"
    b -> c weight: 50 strokeWidth: 3 label:"50 Mbps"
    a -> d weight: 75 strokeWidth: 4 label:"75 Mbps"
    c -> d weight: 25 strokeWidth: 2 label:"25 Mbps"
  }
}
```

Use `strokeWidth` to visually encode capacity alongside the numeric weight.

### Cost Networks

Represent monetary costs, resource consumption, or priorities:

```runiq
diagram "Delivery Costs" {
  container "Shipping Routes" algorithm: force {
    shape warehouse as @rectangle label:"Warehouse"
    shape store1 as @rectangle label:"Store 1"
    shape store2 as @rectangle label:"Store 2"
    shape store3 as @rectangle label:"Store 3"

    warehouse -> store1 weight: 45 label:"$45"
    warehouse -> store2 weight: 30 label:"$30"
    warehouse -> store3 weight: 60 label:"$60"
  }
}
```

## Visualization Techniques

### Visual Encoding

Use edge styling to reinforce weight values:

```runiq
# Thicker edges = higher capacity
a -> b weight: 100 strokeWidth: 5
a -> c weight: 50 strokeWidth: 3
a -> d weight: 25 strokeWidth: 2

# Color intensity = cost/priority
a -> b weight: 10 strokeColor: "#ff0000" strokeWidth: 3  # High cost (red, thick)
a -> c weight: 5 strokeColor: "#ffa500" strokeWidth: 2   # Medium cost (orange)
a -> d weight: 1 strokeColor: "#00ff00" strokeWidth: 1   # Low cost (green, thin)
```

### Labels

Always include labels to make weights human-readable:

```runiq
# Show weight with units
a -> b weight: 215 label:"215 mi"
a -> c weight: 5.5 label:"5.5 ms"

# Show weight with context
a -> b weight: 100 label:"100 Mbps capacity"
a -> c weight: 45 label:"$45 shipping"
```

## Integer and Decimal Weights

Runiq supports both integer and decimal weights:

```runiq
# Integer weights
a -> b weight: 10
a -> c weight: 100

# Decimal weights
a -> b weight: 5.5
a -> c weight: 10.75
a -> d weight: 3.14159

# Zero weight
a -> b weight: 0

# Negative weights (for graphs with negative costs)
a -> b weight: -5
```

## Mixed Weighted/Unweighted Edges

You can mix weighted and unweighted edges in the same diagram:

```runiq
diagram "Mixed Network" {
  container "Connections" algorithm: force {
    shape a as @circle label:"A"
    shape b as @circle label:"B"
    shape c as @circle label:"C"
    shape d as @circle label:"D"

    a -> b weight: 10 label:"10 mi"  # Weighted
    b -> c                            # Unweighted
    c -> d weight: 5 label:"5 mi"    # Weighted
    a -> d                            # Unweighted
  }
}
```

Unweighted edges have `undefined` weight and won't participate in shortest path or metric calculations.

## Graph Algorithms

Weighted edges enable graph analysis algorithms internally:

- **Shortest Path**: Find minimum-cost routes between nodes
- **Minimum Spanning Tree**: Connect all nodes with minimum total weight
- **Centrality Metrics**: Identify important nodes based on weighted paths (betweenness, closeness)

::: info Internal Use
Edge weights are currently used internally for graph metrics calculations (shortest path, betweenness centrality). These algorithms are not yet exposed as user-facing APIs but may be in future releases.
:::

See [Graph Metrics](../reference/graph-metrics.md) for more details on graph analysis.

## Best Practices

1. **Consistent Units**: Use the same units for all weights in a diagram (miles, milliseconds, dollars, etc.)
2. **Meaningful Labels**: Always label weighted edges with value and unit
3. **Visual Encoding**: Use `strokeWidth` or `stroke` color to reinforce weight magnitude
4. **Scale Appropriately**: Normalize weights if values span multiple orders of magnitude
5. **Document Purpose**: Explain what weights represent in diagram title or documentation

## Integration with Layouts

::: warning Current Limitation
Edge weights are currently **not** passed to the layout engine. Weights are parsed and stored but do not affect node positioning or edge routing. This is a known limitation that may be addressed in future releases.
:::

You can still use weights for documentation and metrics purposes:

```runiq
# Weights are parsed and available for metrics, but don't affect layout
container "Force Network" algorithm: force {
  a -> b weight: 10 label: "10 mi"
  b -> c weight: 5 label: "5 mi"
}

# Weights don't influence hierarchical positioning
container "Hierarchy" algorithm: layered {
  a -> b weight: 100 label: "high cost"
  b -> c weight: 50 label: "medium cost"
}
```

## Comparison with Other Tools

| Feature                      | Runiq          | Mermaid        | PlantUML       | Lucidchart  | Gephi          | Cytoscape      | yEd            | NetworkX       |
| ---------------------------- | -------------- | -------------- | -------------- | ----------- | -------------- | -------------- | -------------- | -------------- |
| **Weighted edges**           | ✅             | ⚠️ Labels only | ⚠️ Labels only | ✅          | ✅             | ✅             | ✅             | ✅             |
| **Edge labels**              | ✅             | ✅             | ✅             | ✅          | ✅             | ✅             | ✅             | ✅             |
| **Shortest path**            | ⚠️ Planned     | ❌             | ❌             | ❌          | ✅             | ✅             | ✅             | ✅             |
| **Network metrics**          | ✅             | ❌             | ❌             | ❌          | ✅             | ✅             | ✅             | ✅             |
| **Force-directed layout**    | ✅             | ✅             | ✅             | ⚠️ Limited  | ✅             | ✅             | ✅             | ✅             |
| **Custom styling**           | ✅             | ⚠️ Limited     | ⚠️ Limited     | ✅          | ✅             | ✅             | ✅             | ⚠️ Via code    |
| **Interactive analysis**     | ❌             | ❌             | ❌             | ✅          | ✅             | ✅             | ✅             | ⚠️ Via Jupyter |
| **Large graphs**             | ⚠️ Medium      | ⚠️ Small       | ⚠️ Small       | ⚠️ Medium   | ✅             | ✅             | ✅             | ✅             |
| **Statistical analysis**     | ❌             | ❌             | ❌             | ❌          | ✅             | ✅             | ⚠️ Limited     | ✅             |
| **Text-based DSL**           | ✅             | ✅             | ✅             | ❌          | ❌             | ❌             | ❌             | ⚠️ Python      |
| **Version control friendly** | ✅             | ✅             | ✅             | ⚠️ Partial  | ❌             | ⚠️ XGMML       | ⚠️ GraphML     | ✅             |
| **Export formats**           | SVG, PNG       | SVG, PNG       | SVG, PNG       | Multiple    | Multiple       | Multiple       | Multiple       | Multiple       |
| **Documentation generation** | ✅             | ✅             | ✅             | ⚠️ Partial  | ❌             | ❌             | ❌             | ⚠️ Via code    |
| **Learning curve**           | Low            | Low            | Medium         | Low         | Medium         | Medium         | Medium         | High           |
| **Cost**                     | Free           | Free           | Free           | Paid        | Free           | Free           | Free           | Free           |
| **Platform**                 | Cross-platform | Cross-platform | Cross-platform | Web/Desktop | Cross-platform | Cross-platform | Cross-platform | Python         |

**Key Advantages of Runiq:**

- **Documentation-First**: Perfect for documenting weighted networks in technical docs
- **Version Control**: Track network topology changes over time in Git
- **Unified DSL**: Consistent syntax with other diagram types
- **Lightweight**: Quick visualization without heavy analysis tools

**When to Use Alternatives:**

- **Gephi/Cytoscape**: Large-scale network analysis with advanced metrics and clustering
- **yEd**: Complex graph layout customization with drag-and-drop editing
- **NetworkX**: Programmatic graph analysis in Python with full algorithm library
- **Lucidchart**: Real-time collaboration on network diagrams with stakeholders\n\n## See Also

- [Edges Guide](./edges.md) - All edge properties and syntax
- [Force-Directed Networks](./force-directed-networks.md) - Network visualization
- [Graph Metrics](../reference/graph-metrics.md) - Compute graph metrics with weights
- [Layout Guide](./layout.md) - Layout algorithm options
