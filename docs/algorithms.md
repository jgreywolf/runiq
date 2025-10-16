# Layout Algorithms Guide

Runiq supports multiple layout algorithms powered by Eclipse Layout Kernel (ELK). Each algorithm is optimized for different diagram types and structures.

## Available Algorithms

### 1. Layered (Default)

**Best for:** Hierarchical structures, workflows, pipelines

The layered algorithm arranges nodes in horizontal or vertical layers based on their connections. This is the default algorithm and works well for most diagrams with clear hierarchical relationships.

```runiq
container "Data Pipeline" algorithm: layered {
  shape ingest as @database label: "Ingest"
  shape process as @service label: "Process"
  shape store as @database label: "Store"
}
```

**Characteristics:**

- Minimizes edge crossings between layers
- Respects flow direction (top-down, left-right, etc.)
- Best for acyclic directed graphs (DAGs)

### 2. Force-Directed

**Best for:** Network topologies, peer-to-peer systems, mesh networks

The force-directed algorithm treats edges as springs and nodes as charged particles, creating an organic, balanced layout where connected nodes are pulled together and unconnected nodes repel each other.

```runiq
container "Service Mesh" algorithm: force spacing: 60 {
  shape svc1 as @service label: "Service 1"
  shape svc2 as @service label: "Service 2"
  shape svc3 as @service label: "Service 3"
  shape lb as @load-balancer label: "Load Balancer"
}
```

**Characteristics:**

- Nodes are evenly distributed
- Connected nodes are closer together
- No fixed direction or layering
- Good for cyclic graphs

### 3. Stress Minimization

**Best for:** Complex graphs with many interconnections

The stress algorithm minimizes the "stress" in the graph layout by optimizing the distance between all pairs of nodes. It's excellent for reducing edge crossings in highly connected graphs.

```runiq
container "Microservices" algorithm: stress spacing: 70 {
  shape api as @service label: "API Gateway"
  shape auth as @service label: "Auth"
  shape user as @service label: "User"
  shape order as @service label: "Order"
  shape payment as @service label: "Payment"
}
```

**Characteristics:**

- Minimizes visual clutter
- Reduces edge length variance
- Good for dense, interconnected graphs
- Computationally more expensive

### 4. Radial

**Best for:** Organization charts, tree structures, hub-and-spoke networks

The radial algorithm places nodes in concentric circles around a central root node, creating a tree-like structure that radiates outward.

```runiq
container "Organization" algorithm: radial spacing: 80 {
  shape ceo as @person label: "CEO"
  shape cto as @person label: "CTO"
  shape cfo as @person label: "CFO"
  shape vp1 as @person label: "VP Engineering"
  shape vp2 as @person label: "VP Sales"
}
```

**Characteristics:**

- Root node at center
- Children arranged in circular layers
- Good for displaying hierarchies
- Clear parent-child relationships

### 5. Multi-Rooted Tree (mrtree)

**Best for:** Graphs with multiple root nodes, forests, shared dependencies

The multi-rooted tree algorithm handles graphs with multiple independent trees or trees that converge on shared nodes.

```runiq
container "Departments" algorithm: mrtree spacing: 50 {
  shape eng as @rect label: "Engineering"
  shape product as @rect label: "Product"
  shape shared as @service label: "Shared Services"
}
```

**Characteristics:**

- Supports multiple root nodes
- Handles convergent trees
- Good for dependency graphs
- Clear separation of independent subtrees

## Spacing Control

All algorithms support the `spacing` property to control the distance between nodes:

```runiq
// Tight spacing for compact diagrams
container "Compact" algorithm: layered spacing: 30 {
  // ...
}

// Generous spacing for clarity
container "Spacious" algorithm: force spacing: 100 {
  // ...
}
```

**Default spacing:** 50 pixels (if not specified)

## Mixing Algorithms

Different containers in the same diagram can use different algorithms:

```runiq
diagram "Mixed Layout"

// Hierarchical pipeline
container "ETL Process" algorithm: layered spacing: 40 {
  shape extract as @database label: "Extract"
  shape transform as @service label: "Transform"
  shape load as @database label: "Load"
}

// Network cluster
container "Service Mesh" algorithm: force spacing: 60 {
  shape svc1 as @service label: "Service A"
  shape svc2 as @service label: "Service B"
  shape svc3 as @service label: "Service C"
}
```

## Algorithm Selection Guidelines

| Diagram Type        | Recommended Algorithm | Why                  |
| ------------------- | --------------------- | -------------------- |
| Data pipelines      | `layered`             | Clear flow direction |
| Workflows           | `layered`             | Sequential steps     |
| Network topology    | `force`               | Peer relationships   |
| Organization charts | `radial`              | Central authority    |
| Dependency graphs   | `mrtree`              | Multiple roots       |
| Microservices       | `stress` or `force`   | Many connections     |
| Class hierarchies   | `layered` or `radial` | Inheritance trees    |

## Examples

See the `examples/` directory for complete working examples:

- **force-network.runiq** - Force-directed layout for network topology
- **radial-org.runiq** - Radial and mrtree layouts for organizational structures
- **stress-graph.runiq** - Stress and layered algorithms compared

## Implementation Details

### ELK Algorithm Mapping

Runiq algorithm names map to ELK algorithm IDs as follows:

- `layered` → `layered` (ELK's native layered algorithm)
- `force` → `org.eclipse.elk.force`
- `stress` → `org.eclipse.elk.stress`
- `radial` → `org.eclipse.elk.radial`
- `mrtree` → `org.eclipse.elk.mrtree`

### Type Definitions

```typescript
export type LayoutAlgorithm =
  | 'layered' // Hierarchical (default)
  | 'force' // Force-directed for networks
  | 'stress' // Stress-minimization
  | 'radial' // Radial tree for org charts
  | 'mrtree'; // Multi-rooted tree

export interface ContainerLayoutOptions {
  algorithm?: LayoutAlgorithm;
  direction?: Direction;
  spacing?: number;
}
```

### Grammar Syntax

```langium
ContainerProperty:
    StyleRefProperty
    | ContainerStyleProperty
    | ContainerLayoutProperty;

ContainerLayoutProperty:
    'algorithm:' algorithm=LayoutAlgorithmValue
    | 'spacing:' spacing=NUMBER;

LayoutAlgorithmValue returns string:
    'layered' | 'force' | 'stress' | 'radial' | 'mrtree';
```

## Limitations

1. **Container Edges**: Currently, edges between nodes inside the same container are not fully supported by the ELK adapter. Each container lays out its nodes independently.

2. **Cross-Container Edges**: Edges between containers work correctly.

3. **Default Algorithm**: If no algorithm is specified, `layered` is used.

4. **Direction Override**: Container-specific direction settings are not yet implemented (coming soon).

## Future Enhancements

- [ ] Support for edges within containers
- [ ] Per-container direction settings
- [ ] Additional ELK algorithm options (box, random, etc.)
- [ ] Custom algorithm parameters (node separation, layer spacing, etc.)
- [ ] Interactive algorithm selection in web editor
- [ ] Visual algorithm comparison tool
