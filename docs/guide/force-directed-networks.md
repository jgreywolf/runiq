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

## Examples

### Example 1: Computer Network (10 nodes)

Office network showing routers, servers, and workstations.

```runiq
diagram "Office Network" {
  container "Network" algorithm: force spacing: 100 {
    // Core infrastructure
    shape router as @hexagon label:"Router"
    shape firewall as @rect label:"Firewall"
    shape mainSwitch as @rhombus label:"Main Switch"

    // Servers
    shape webServer as @cylinder label:"Web Server"
    shape dbServer as @cylinder label:"Database"
    shape fileServer as @cylinder label:"File Server"

    // Workstations
    shape ws1 as @monitor label:"Sales-PC"
    shape ws2 as @monitor label:"Dev-PC"
    shape ws3 as @monitor label:"Admin-PC"

    // Network topology
    router -> firewall label:"WAN"
    firewall -> mainSwitch
    mainSwitch -> webServer
    mainSwitch -> dbServer
    mainSwitch -> fileServer
    mainSwitch -> ws1
    mainSwitch -> ws2
    mainSwitch -> ws3
    webServer -> dbServer label:"SQL"
  }
}
```

### Example 2: Citation Network (8 nodes)

Academic papers citing each other.

```runiq
diagram "Citation Network" {
  container "Papers" algorithm: force spacing: 130 {
    // Foundational papers
    shape p1 as @document label:"ML Basics (2015)"
    shape p2 as @document label:"Deep Learning (2016)"
    shape p3 as @document label:"Neural Nets (2015)"

    // Recent research
    shape p4 as @document label:"Transformers (2017)"
    shape p5 as @document label:"BERT (2018)"
    shape p6 as @document label:"GPT (2019)"
    shape p7 as @document label:"Vision Models (2020)"
    shape p8 as @document label:"Multimodal (2021)"

    // Citation relationships
    p4 -> p1
    p4 -> p2
    p5 -> p4
    p5 -> p2
    p6 -> p4
    p6 -> p5
    p7 -> p4
    p7 -> p6
    p8 -> p5
    p8 -> p7
  }
}
```

### Example 3: Social Network with Communities (7 nodes)

Friend connections showing natural clustering.

```runiq
diagram "Friend Network" {
  container "Friends" algorithm: force spacing: 110 {
    // Tech community
    shape alice as @actor label:"Alice"
    shape bob as @actor label:"Bob"
    shape carol as @actor label:"Carol"

    // Sports community
    shape david as @actor label:"David"
    shape eve as @actor label:"Eve"
    shape frank as @actor label:"Frank"

    // Bridge member
    shape grace as @actor label:"Grace"

    // Tech friendships
    alice -> bob
    alice -> carol
    bob -> carol

    // Sports friendships
    david -> eve
    david -> frank
    eve -> frank

    // Bridges between communities
    alice -> grace
    david -> grace
  }
}
```

### Example 4: Software Dependency Graph (9 nodes)

Package dependencies forming a network.

```runiq
diagram "Dependencies" {
  container "Packages" algorithm: force spacing: 100 {
    // Core packages
    shape core as @package label:"core"
    shape utils as @package label:"utils"
    shape types as @package label:"types"

    // Feature packages
    shape auth as @package label:"auth"
    shape api as @package label:"api"
    shape ui as @package label:"ui"

    // App packages
    shape web as @package label:"web-app"
    shape mobile as @package label:"mobile-app"
    shape cli as @package label:"cli"

    // Dependencies
    core -> types
    utils -> types
    auth -> core
    auth -> utils
    api -> core
    api -> auth
    ui -> types
    ui -> utils
    web -> api
    web -> ui
    mobile -> api
    mobile -> ui
    cli -> core
    cli -> utils
  }
}
```

### Example 5: Medium Network (25 nodes)

Collaboration network showing complex team relationships.

```runiq
diagram "Collaboration Network" {
  container "Team" algorithm: force spacing: 120 {
    // Department leaders
    shape ceo as @actor label:"CEO"
    shape cto as @actor label:"CTO"
    shape cfo as @actor label:"CFO"
    shape cmo as @actor label:"CMO"

    // Engineering team
    shape eng1 as @circle label:"Dev 1"
    shape eng2 as @circle label:"Dev 2"
    shape eng3 as @circle label:"Dev 3"
    shape eng4 as @circle label:"Dev 4"
    shape eng5 as @circle label:"Dev 5"

    // Design team
    shape des1 as @circle label:"Designer 1"
    shape des2 as @circle label:"Designer 2"
    shape des3 as @circle label:"Designer 3"

    // Marketing team
    shape mkt1 as @circle label:"Marketing 1"
    shape mkt2 as @circle label:"Marketing 2"
    shape mkt3 as @circle label:"Marketing 3"

    // Finance team
    shape fin1 as @circle label:"Finance 1"
    shape fin2 as @circle label:"Finance 2"

    // Product team
    shape pm1 as @circle label:"PM 1"
    shape pm2 as @circle label:"PM 2"
    shape pm3 as @circle label:"PM 3"

    // Sales team
    shape sal1 as @circle label:"Sales 1"
    shape sal2 as @circle label:"Sales 2"
    shape sal3 as @circle label:"Sales 3"
    shape sal4 as @circle label:"Sales 4"

    // Reporting structure
    ceo -> cto
    ceo -> cfo
    ceo -> cmo
    cto -> eng1
    cto -> eng2
    cto -> pm1
    cfo -> fin1
    cfo -> fin2
    cmo -> mkt1
    cmo -> sal1

    // Cross-team collaboration
    eng1 -> eng2
    eng2 -> eng3
    eng3 -> eng4
    eng4 -> eng5
    eng1 -> des1
    eng2 -> des2
    eng3 -> des3
    pm1 -> eng1
    pm2 -> eng3
    pm3 -> eng5
    pm1 -> des1
    pm2 -> des2
    pm3 -> des3
    mkt1 -> mkt2
    mkt2 -> mkt3
    sal1 -> sal2
    sal2 -> sal3
    sal3 -> sal4
    mkt1 -> sal1
    pm1 -> mkt1
  }
}
```

### Example 6: Protein Interaction Network (10 nodes)

Biological network showing protein interactions.

```runiq
diagram "Protein Interactions" {
  container "Proteins" algorithm: force spacing: 90 {
    // Proteins
    shape p1 as @hexagon label:"P53"
    shape p2 as @hexagon label:"MDM2"
    shape p3 as @hexagon label:"ATM"
    shape p4 as @hexagon label:"ATR"
    shape p5 as @hexagon label:"CHK1"
    shape p6 as @hexagon label:"CHK2"
    shape p7 as @hexagon label:"CDC25"
    shape p8 as @hexagon label:"CDK2"
    shape p9 as @hexagon label:"Cyclin E"
    shape p10 as @hexagon label:"Rb"

    // Interactions
    p1 -> p2 label:"inhibits"
    p1 -> p6
    p3 -> p1 label:"activates"
    p3 -> p6
    p4 -> p5
    p4 -> p1
    p5 -> p7
    p6 -> p7
    p7 -> p8
    p8 -> p9
    p8 -> p10
    p9 -> p8
  }
}
```

### Example 7: Knowledge Graph (15 nodes)

Concepts and their relationships.

```runiq
diagram "Knowledge Graph" {
  container "Concepts" algorithm: force spacing: 110 {
    // Core concepts
    shape prog as @rect label:"Programming"
    shape web as @rect label:"Web Dev"
    shape mobile as @rect label:"Mobile Dev"
    shape db as @rect label:"Databases"
    shape ai as @rect label:"AI/ML"

    // Languages
    shape js as @circle label:"JavaScript"
    shape py as @circle label:"Python"
    shape java as @circle label:"Java"
    shape cpp as @circle label:"C++"

    // Frameworks
    shape react as @roundedRect label:"React"
    shape vue as @roundedRect label:"Vue"
    shape django as @roundedRect label:"Django"
    shape flask as @roundedRect label:"Flask"
    shape tensorflow as @roundedRect label:"TensorFlow"
    shape pytorch as @roundedRect label:"PyTorch"

    // Relationships
    prog -> web
    prog -> mobile
    prog -> db
    prog -> ai
    web -> js
    mobile -> java
    ai -> py
    ai -> cpp
    js -> react
    js -> vue
    py -> django
    py -> flask
    py -> tensorflow
    py -> pytorch
    web -> react
    web -> vue
  }
}
```

### Example 8: Large Network (50 nodes)

Complex organization structure with multiple departments.

```runiq
diagram "Large Organization" {
  container "Company" algorithm: force spacing: 140 {
    // C-Level
    shape ceo as @actor label:"CEO"
    shape cto as @actor label:"CTO"
    shape cfo as @actor label:"CFO"
    shape cmo as @actor label:"CMO"
    shape coo as @actor label:"COO"

    // Engineering - 10 people
    shape engDir as @circle label:"Eng Director"
    shape engMgr1 as @circle label:"Eng Mgr 1"
    shape engMgr2 as @circle label:"Eng Mgr 2"
    shape dev1 as @circ label:"Dev 1"
    shape dev2 as @circ label:"Dev 2"
    shape dev3 as @circ label:"Dev 3"
    shape dev4 as @circ label:"Dev 4"
    shape dev5 as @circ label:"Dev 5"
    shape dev6 as @circ label:"Dev 6"
    shape dev7 as @circ label:"Dev 7"

    // Product - 8 people
    shape prodDir as @circle label:"Prod Director"
    shape pm1 as @circ label:"PM 1"
    shape pm2 as @circ label:"PM 2"
    shape pm3 as @circ label:"PM 3"
    shape des1 as @circ label:"Designer 1"
    shape des2 as @circ label:"Designer 2"
    shape ux1 as @circ label:"UX 1"
    shape ux2 as @circ label:"UX 2"

    // Marketing - 8 people
    shape mktDir as @circle label:"Mkt Director"
    shape mkt1 as @circ label:"Mkt 1"
    shape mkt2 as @circ label:"Mkt 2"
    shape mkt3 as @circ label:"Mkt 3"
    shape content1 as @circ label:"Content 1"
    shape content2 as @circ label:"Content 2"
    shape social1 as @circ label:"Social 1"
    shape social2 as @circ label:"Social 2"

    // Sales - 10 people
    shape salesDir as @circle label:"Sales Director"
    shape salesMgr1 as @circle label:"Sales Mgr 1"
    shape salesMgr2 as @circle label:"Sales Mgr 2"
    shape ae1 as @circ label:"AE 1"
    shape ae2 as @circ label:"AE 2"
    shape ae3 as @circ label:"AE 3"
    shape ae4 as @circ label:"AE 4"
    shape ae5 as @circ label:"AE 5"
    shape ae6 as @circ label:"AE 6"
    shape sdr1 as @circ label:"SDR 1"

    // Finance - 5 people
    shape finDir as @circle label:"Fin Director"
    shape acct1 as @circ label:"Accountant 1"
    shape acct2 as @circ label:"Accountant 2"
    shape fp1 as @circ label:"FP&A 1"
    shape fp2 as @circ label:"FP&A 2"

    // Operations - 4 people
    shape opsDir as @circle label:"Ops Director"
    shape ops1 as @circ label:"Ops 1"
    shape ops2 as @circ label:"Ops 2"
    shape ops3 as @circ label:"Ops 3"

    // Reporting lines
    ceo -> cto
    ceo -> cfo
    ceo -> cmo
    ceo -> coo
    cto -> engDir
    cto -> prodDir
    cmo -> mktDir
    cmo -> salesDir
    cfo -> finDir
    coo -> opsDir

    // Engineering
    engDir -> engMgr1
    engDir -> engMgr2
    engMgr1 -> dev1
    engMgr1 -> dev2
    engMgr1 -> dev3
    engMgr2 -> dev4
    engMgr2 -> dev5
    engMgr2 -> dev6
    engMgr2 -> dev7

    // Product
    prodDir -> pm1
    prodDir -> pm2
    prodDir -> pm3
    pm1 -> des1
    pm2 -> des2
    pm3 -> ux1
    pm3 -> ux2

    // Marketing
    mktDir -> mkt1
    mktDir -> mkt2
    mktDir -> mkt3
    mkt1 -> content1
    mkt1 -> content2
    mkt2 -> social1
    mkt2 -> social2

    // Sales
    salesDir -> salesMgr1
    salesDir -> salesMgr2
    salesMgr1 -> ae1
    salesMgr1 -> ae2
    salesMgr1 -> ae3
    salesMgr2 -> ae4
    salesMgr2 -> ae5
    salesMgr2 -> ae6
    salesMgr1 -> sdr1

    // Finance
    finDir -> acct1
    finDir -> acct2
    finDir -> fp1
    finDir -> fp2

    // Operations
    opsDir -> ops1
    opsDir -> ops2
    opsDir -> ops3

    // Cross-functional collaboration (selective to avoid clutter)
    pm1 -> dev1
    pm2 -> dev3
    pm3 -> dev5
    des1 -> dev2
    ux1 -> dev4
    mkt1 -> pm1
    ae1 -> pm2
    ops1 -> dev1
  }
}
```

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
- [Network Diagrams](./network-diagrams.md) - Network topology diagrams
- [Containers](../reference/containers.md) - Container syntax
- [Shapes Reference](../reference/shapes.md) - Available shapes

## Examples

See example files:

- `examples/force-network.runiq` - Basic force-directed network
- `examples/social-network.runiq` - Social network with communities
- `examples/dependency-graph.runiq` - Software dependencies
- `examples/knowledge-graph.runiq` - Concept relationships
