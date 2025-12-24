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

... (content preserved)
