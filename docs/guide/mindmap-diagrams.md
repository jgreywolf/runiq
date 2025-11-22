---
title: Mindmap Diagrams
description: Create visual thinking tools with radial layouts for brainstorming, planning, and knowledge mapping.
lastUpdated: 2025-11-17
---

# Mindmap Diagrams

Mindmaps are visual thinking tools that help organize information hierarchically around a central concept. They use a radial layout where ideas branch out from a central node, making them perfect for brainstorming, planning, and knowledge mapping.

## Quick Start

### Simple Mindmap with Auto-Shapes

Runiq supports simplified syntax using `type:mindmap` on containers, which automatically assigns shapes:

```runiq
diagram "Quick Mindmap" {
  container "Ideas" type:mindmap algorithm:radial spacing:80 {
    // First node becomes @circ (circle) automatically
    shape central label:"Main Idea"

    // All other nodes become @rounded automatically
    shape branch1 label:"Branch 1"
    shape branch2 label:"Branch 2"
    shape branch3 label:"Branch 3"

    central -> branch1
    central -> branch2
    central -> branch3
  }
}
```

**Benefits of `type:mindmap`:**

- ✅ Less verbose - no repetitive `as @circ` or `as @rounded`
- ✅ Faster to write - focus on content, not formatting
- ✅ Consistent appearance - follows mindmap conventions
- ✅ Override when needed - can still specify explicit shapes

## When to Use Mindmaps

Mindmaps excel at:

- **Brainstorming** - Generate and organize ideas visually
- **Project Planning** - Break down projects into phases and tasks
- **Learning** - Create study guides and knowledge maps
- **Strategy** - Visualize business goals and tactics
- **Problem Solving** - Explore solutions and their components
- **Meeting Notes** - Capture and structure discussion points

## Features

- **Radial Layout** - Central node with branches radiating outward
- **Hierarchical Structure** - Support for 3-4 levels of subtopics
- **Mixed Shapes** - Use different shapes for different node types
- **Styled Nodes** - Apply custom colors to highlight importance
- **Flexible Spacing** - Control distance between nodes for clarity

## Complete Example: Project Planning

```runiq
diagram "Website Redesign Plan" {

  style main fill:"#ffeb3b" stroke:"#f57c00" strokeWidth:3
  style phase fill:"#e3f2fd" stroke:"#1976d2" strokeWidth:2
  style task fill:"#f3e5f5" stroke:"#7b1fa2"

  container "Project" type:mindmap algorithm:radial spacing:100 {

    // Central goal
    shape main label:"Website Redesign" style:main

    // Main phases
    shape research label:"Research" style:phase
    shape design label:"Design" style:phase
    shape development label:"Development" style:phase
    shape testing label:"Testing" style:phase

    // Research tasks
    shape surveys as @rect label:"User Surveys" style:task
    shape competitors as @rect label:"Competitor Analysis" style:task

    // Design tasks
    shape wireframes as @rect label:"Wireframes" style:task
    shape mockups as @rect label:"Mockups" style:task

    // Development tasks
    shape frontend as @rect label:"Frontend" style:task
    shape backend as @rect label:"Backend" style:task

    // Testing tasks
    shape unit_tests as @rect label:"Unit Tests" style:task
    shape user_testing as @rect label:"User Testing" style:task

    // Main connections
    main -> research
    main -> design
    main -> development
    main -> testing

    // Task connections
    research -> surveys
    research -> competitors
    design -> wireframes
    design -> mockups
    development -> frontend
    development -> backend
    testing -> unit_tests
    testing -> user_testing
  }
}
```

## Syntax Reference

### Basic Structure

```runiq
diagram "My Mindmap" {
  container "Name" type:mindmap algorithm:radial spacing:50 {
    shape main label:"Main Topic"
    shape branch1 label:"Branch 1"
    shape branch2 label:"Branch 2"

    main -> branch1
    main -> branch2
  }
}
```

::: warning Reserved Keywords
Avoid using reserved keywords as node IDs: `center`, `left`, `right`, `top`, `bottom`, `start`, `end`. These are reserved by the layout engine and may cause unexpected behavior.

✅ Good: `shape mainTopic`, `shape centralNode`, `shape core`  
❌ Bad: `shape center`, `shape start`, `shape end`
:::

### Required Properties

| Property    | Value     | Description                        |
| ----------- | --------- | ---------------------------------- |
| `algorithm` | `radial`  | Uses radial layout (required)      |
| `spacing`   | `60-150`  | Distance between nodes (px)        |
| `type`      | `mindmap` | Optional: auto-assigns shape types |

### Hierarchical Levels

Build multi-level hierarchies by chaining connections:

```runiq
// Level 1: Main topic
root -> topic1
root -> topic2

// Level 2: Subtopics
topic1 -> subtopic1a

// Level 3: Details
subtopic1a -> detail1
```

## Automatic Shape Assignment

When using `type:mindmap`, shapes are assigned automatically based on hierarchy:

| Level      | Auto Shape | Visual Purpose                      |
| ---------- | ---------- | ----------------------------------- |
| First node | `@circ`    | Circle - draws attention to center  |
| All others | `@rounded` | Rounded rectangles - clean branches |

**Manual Override (Optional):**

You can still specify shapes explicitly when you need semantic meaning:

```runiq
// Override with explicit shapes
shape action as @hexagon label:"Deploy"      // Action-oriented
shape decision as @rhombus label:"Approve?"  // Decision point
shape metric as @stadium label:"50% Growth"  // Key metric
```

## Styling Mindmaps

### Color Coding by Level

```runiq
style level1 fill:"#ffeb3b" stroke:"#f57c00" strokeWidth:3 fontSize:16
style level2 fill:"#e3f2fd" stroke:"#1976d2" strokeWidth:2 fontSize:14
style level3 fill:"#f3e5f5" stroke:"#7b1fa2" fontSize:12

container "Mindmap" type:mindmap algorithm:radial {
  shape root label:"Main" style:level1
  shape branch label:"Branch" style:level2
  shape detail label:"Detail" style:level3

  root -> branch
  branch -> detail
}
```

### Color Coding by Category

```runiq
style goals fill:"#c8e6c9" stroke:"#388e3c"
style actions fill:"#bbdefb" stroke:"#1976d2"
style risks fill:"#ffcdd2" stroke:"#d32f2f"
style metrics fill:"#e1bee7" stroke:"#7b1fa2"
```

### Container Styling

```runiq
container "Mindmap"
  algorithm:radial
  spacing:100
  backgroundColor:"#f5f5f5"
  borderColor:"#9e9e9e"
  borderWidth:2
  padding:20 {
  // nodes here
}
```

## Layout Options

### Spacing Guidelines

- **60-80**: Compact, good for simple mindmaps (5-10 nodes)
- **90-100**: Balanced, most common (10-20 nodes)
- **110-150**: Spacious, good for complex hierarchies (20-50 nodes)

### Radial Algorithm (ELK)

The `algorithm:radial` setting:

- Places the first connected node at the center
- Arranges children in concentric circles
- Minimizes edge crossings
- Optimizes angular distribution for visual balance

## Best Practices

### 1. Limit Depth

For clarity, limit mindmaps to **3-4 levels**. Beyond that:

- Create separate mindmaps for sub-topics
- Use different diagram types (flowcharts, org charts)

### 2. Balance Branches

Distribute nodes evenly around the center:

- **3-6 main branches** work best
- Too few (1-2): Consider a different layout
- Too many (7+): Group related branches

### 3. Keep Labels Short and Descriptive

Use concise labels (2-4 words) with meaningful naming:

**Label Length:**

- ✅ "User Research"
- ✅ "API Development"
- ❌ "Conduct comprehensive user research including surveys and interviews"

**Label Style:**

- **Nouns** for topics: "Marketing", "Development"
- **Verbs** for actions: "Launch Campaign", "Build API"
- **Metrics** for KPIs: "50% Growth", "Q1 Revenue"

## Advanced Techniques

### Mixed Shapes for Semantic Meaning

```runiq
diagram "Strategic Planning" {
  container "Strategy" type:mindmap algorithm:radial spacing:120 {

    shape goal as @circ label:"Expand Market" fill:"#4caf50"

    // Strategic pillars (hexagons)
    shape strat1 as @hexagon label:"Product Innovation" fill:"#2196f3"
    shape strat2 as @hexagon label:"Customer Service" fill:"#2196f3"

    // Tactical actions (rounded)
    shape tactic1 as @rounded label:"Launch Mobile App" fill:"#ff9800"
    shape tactic2 as @rounded label:"24/7 Support" fill:"#ff9800"

    // Metrics (diamonds)
    shape kpi1 as @rhombus label:"10k Users" fill:"#9c27b0"
    shape kpi2 as @rhombus label:"95% CSAT" fill:"#9c27b0"

    goal -> strat1
    goal -> strat2
    strat1 -> tactic1
    strat1 -> kpi1
    strat2 -> tactic2
    strat2 -> kpi2
  }
}
```

### Inline Icons for Visual Context

```runiq
diagram "Tech Stack" {
  container "Technologies" type:mindmap algorithm:radial {
    shape stack label:"Our Stack" icon: fa/code
    shape frontend label:"Frontend" icon: fa/desktop
    shape backend label:"Backend" icon: fa/server
    shape data label:"Data" icon: fa/database

    stack -> frontend
    stack -> backend
    stack -> data
  }
}
```

## Integration with Other Diagrams

Mindmaps complement other diagram types:

| Use Case         | Start With    | Then Use          |
| ---------------- | ------------- | ----------------- |
| Project Planning | Mindmap (WBS) | Gantt/Timeline    |
| Feature Planning | Mindmap       | Use Case Diagram  |
| System Design    | Mindmap       | Component Diagram |
| Strategy         | Mindmap       | Wardley Map       |
| Process Design   | Mindmap       | Flowchart/BPMN    |

## Performance Considerations

Mindmaps scale well with proper structure:

- ✅ **Under 50 nodes**: Excellent performance, renders instantly
- ✅ **50-100 nodes**: Good performance, slight delay
- ⚠️ **100-200 nodes**: Consider splitting into sub-mindmaps
- ❌ **Over 200 nodes**: Use hierarchical approach with linked mindmaps

**Tip**: If your mindmap exceeds 100 nodes, split by main branch into separate diagrams.

## Comparison with Other Tools

| Feature                      | Runiq             | Mermaid      | PlantUML        | MindMup         | XMind    |
| ---------------------------- | ----------------- | ------------ | --------------- | --------------- | -------- |
| **Text-Based DSL**           | ✅                | ✅           | ✅              | ❌              | ❌       |
| **Version control friendly** | ✅ Git-friendly   | ✅           | ✅              | ❌              | ❌       |
| **Auto-layout**              | ✅                | ✅           | ✅              | ✅              | ✅       |
| **Mixed shapes**             | ✅                | ⚠️ Limited   | ⚠️ Circles only | ⚠️ Limited      | ✅       |
| **Hierarchical edges**       | ✅                | ✅           | ⚠️ Auto-only    | ✅              | ✅       |
| **Custom styling**           | ✅ Full CSS-like  | ⚠️ Limited   | ⚠️ Colors only  | ✅              | ✅       |
| **Container support**        | ✅                | ❌           | ❌              | ❌              | ❌       |
| **Export formats**           | SVG, PNG          | SVG, PNG     | SVG             | ✅              | ✅       |
| **Collaboration**            | ✅ Git-based      | ✅ Git-based | ✅ Git-based    | ✅ Cloud (Paid) | ✅ Cloud |
| **Learning Curve**           | ⚠️ Moderate (DSL) | ✅ Low       | ⚠️ Moderate     | ✅ Low (GUI)    | ✅ Low   |
| **Real-Time Collaboration**  | ⚠️ Via Git        | ⚠️ Via tools | ⚠️ Via tools    | ✅              | ✅       |
| **Open Source**              | ✅ MIT License    | ✅ MIT       | ✅ GPL          | ❌              | ❌       |

## Examples

See the [View Mindmap Examples →](/examples/mindmap-diagrams) directory for more complete examples:

Includes:

- Simple three-branch mindmap
- Hierarchical project breakdown (19 nodes)
- Educational knowledge map with styling (21 nodes)
- Strategic planning with mixed shapes (21 nodes)

## Related

- [Layout Algorithms](/guide/layout) - Understanding radial layout
- [Containers](/guide/containers) - Container properties and styling
- [Styling Guide](/guide/styling) - Advanced styling techniques

## Resources

- [Tony Buzan's Mind Mapping](https://www.tonybuzan.com/about/mind-mapping/) - Original mindmapping methodology
- [ELK Radial Algorithm](https://www.eclipse.org/elk/reference/algorithms/org-eclipse-elk-radial.html) - Technical details of layout engine
- [Mind Map Wikipedia](https://en.wikipedia.org/wiki/Mind_map) - History and applications

---

**Next Steps**: Try creating your first mindmap with the simple example above, then explore the [example files](https://github.com/jgreywolf/runiq/tree/main/examples/mindmaps) for more complex use cases.
