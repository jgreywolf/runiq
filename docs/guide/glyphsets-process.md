---
title: Process Glyphsets
description: Linear flows, cycles, and sequential process diagrams
lastUpdated: 2025-01-14
---

# Process Glyphsets

Process glyphsets visualize sequential workflows, cycles, and step-by-step procedures. Perfect for business processes, development workflows, and iterative cycles.

## Linear Process Glyphsets

### basicProcess

Simple linear process flow with horizontal or vertical orientation.

**Parameters:**

- `step` (array, 2-10 items) - Process steps
- `orientation` - "horizontal" (default) or "vertical"
- `theme` - Color theme
- `useContainers` - Use container styling (default: false)

**Example:**

```runiq
glyphset basicProcess "Software Release Process" {
  step "Development"
  step "Code Review"
  step "Testing"
  step "Staging"
  step "Production"

  orientation "horizontal"
  theme "professional"
}
```

### stepProcess

Diagonal stair-step pattern showing progression or growth.

**Parameters:**

- `item` (array, 3-8 items) - Steps to display
- `direction` - "up" (default) or "down"
- `theme` - Color theme

**Example:**

```runiq
glyphset stepProcess "Career Growth" {
  item "Junior Developer"
  item "Senior Developer"
  item "Tech Lead"
  item "Engineering Manager"

  direction "up"
  theme "forest"
}
```

### alternatingProcess

Zigzag S-curve flow showing back-and-forth progression.

**Parameters:**

- `item` (array, 3-8 items) - Process items
- `theme` - Color theme

**Example:**

```runiq
glyphset alternatingProcess "Design Iteration" {
  item "Research"
  item "Design"
  item "Feedback"
  item "Refine"
  item "Deliver"

  theme "sunset"
}
```

### detailedProcess

Process with main steps and substeps beneath each.

**Parameters:**

- `item` (array, 2-5 items) - Format: "Main | Sub1 | Sub2 | ..."
- `direction` - "LR" (horizontal, default) or "TB" (vertical)
- `theme` - Color theme

**Example:**

```runiq
glyphset detailedProcess "Product Launch" {
  item "Planning | Market Research | Define Goals | Budget"
  item "Development | Design | Build | Test"
  item "Marketing | Campaign | Social Media | PR"
  item "Launch | Release | Monitor | Support"

  direction "LR"
  theme "ocean"
}
```

## Cycle Glyphsets

Circular process flows showing iterative or continuous processes.

### cycle

Basic circular process where steps flow in a cycle.

**Parameters:**

- `step` (array, 3-8 items) - Cycle steps
- `theme` - Color theme

**Example:**

```runiq
glyphset cycle "PDCA Cycle" {
  step "Plan"
  step "Do"
  step "Check"
  step "Act"

  theme "professional"
}
```

### spiralCycle

Spiral pattern showing evolution or progressive refinement.

**Parameters:**

- `item` (array, 3-8 items) - Spiral stages
- `theme` - Color theme

**Example:**

```runiq
glyphset spiralCycle "Product Evolution" {
  item "MVP"
  item "Beta"
  item "v1.0"
  item "v2.0"
  item "Enterprise"

  theme "sunset"
}
```

### radialCycle

Radial/spoke pattern with center hub.

**Parameters:**

- `item` (array, 3-8 items) - Radial items
- `theme` - Color theme

**Example:**

```runiq
glyphset radialCycle "Ecosystem" {
  item "Core Platform"
  item "APIs"
  item "Integrations"
  item "Marketplace"
  item "Community"

  theme "ocean"
}
```

### blockCycle

Block-based circular cycle with distinct sections.

**Parameters:**

- `item` (array, 3-6 items) - Block sections
- `theme` - Color theme

**Example:**

```runiq
glyphset blockCycle "Business Quarters" {
  item "Q1: Planning"
  item "Q2: Execution"
  item "Q3: Optimization"
  item "Q4: Review"

  theme "professional"
}
```

### orbitCycle

Orbital pattern showing hierarchical relationships.

**Parameters:**

- `item` (array, 3-8 items) - Orbital elements
- `theme` - Color theme

**Example:**

```runiq
glyphset orbitCycle "Service Architecture" {
  item "Database"
  item "API Gateway"
  item "Microservices"
  item "Load Balancer"
  item "CDN"

  theme "forest"
}
```

### gearCycle

Interlocking gears showing interconnected processes.

**Parameters:**

- `item` (array, 2-5 items) - Gear components
- `theme` - Color theme

**Example:**

```runiq
glyphset gearCycle "DevOps Pipeline" {
  item "Development"
  item "Testing"
  item "Deployment"

  theme "monochrome"
}
```

### segmentedCycle

Cycle with segmented sections and labels.

**Parameters:**

- `item` (array, 3-8 items) - Segment labels
- `theme` - Color theme

**Example:**

```runiq
glyphset segmentedCycle "Agile Sprint" {
  item "Planning"
  item "Daily Standups"
  item "Development"
  item "Testing"
  item "Review"
  item "Retrospective"

  theme "ocean"
}
```

## Specialized Process Glyphsets

### phasedProcess

Process with distinct phases and milestones.

**Parameters:**

- `phase` (array, 2-6 phases) - Process phases
- `theme` - Color theme

**Example:**

```runiq
glyphset phasedProcess "Project Phases" {
  item "Initiation"
  item "Planning"
  item "Execution"
  item "Monitoring"
  item "Closure"

  theme "professional"
}
```

### groupedProcess

Process grouped into categories or workstreams.

**Parameters:**

- `group` (array, 2-4 groups) - Process groups
- `theme` - Color theme

**Example:**

```runiq
// Grouped Process - Parallel Streams Converging
glyphset groupedProcess "Cross-Functional Project" {
  theme "forest"
  group "Design Team" {
    item "User Research"
    item "UI Design"
  }
  group "Engineering" {
    item "Architecture"
    item "Backend API"
    item "Frontend"
  }
  group "QA" {
    item "Test Strategy"
    item "Automation"
  }

  mergePoint "Product Launch"
}

```

### continuousBlockProcess

Continuous flow with connected blocks.

**Parameters:**

- `block` (array, 3-8 blocks) - Process blocks
- `theme` - Color theme

**Example:**

```runiq
// Continuous Block Process - Manufacturing Flow
glyphset continuousBlockProcess "Production Line" {
  theme "forest"
  item "Raw Materials"
  item "Processing"
  item "Assembly"
  item "Quality Check"
  item "Packaging"
  item "Shipping"

  direction "LR"
}

```

### equationProcess

Mathematical or logical equation-style process.

**Parameters:**

- `element` (array, 3-5 elements) - Equation elements
- `theme` - Color theme

**Example:**

```runiq
// Equation Process - Success Formula
glyphset equationProcess "Business Success" {
  theme "forest"
  item "Great Product"
  item "Strong Team"
  item "Market Timing"
  item "Success"
}

```

## Tips for Process Glyphsets

### Choosing the Right Process Pattern

- **Linear sequential** → `basicProcess`
- **Progressive growth** → `stepProcess`
- **Iterative/repetitive** → `cycle`, `spiralCycle`
- **Back-and-forth** → `alternatingProcess`
- **Hierarchical detail** → `detailedProcess`
- **Interconnected** → `orbitCycle`, `gearCycle`

### Best Practices

1. **Keep steps concise** - 2-3 words per step
2. **Use 3-7 steps** - Sweet spot for readability
3. **Match pattern to process** - Linear for sequential, cycle for iterative
4. **Consistent themes** - Use same theme across related diagrams
5. **Orientation matters** - Horizontal for presentations, vertical for documents

### When to Use Diagram Profiles Instead

Switch to diagram profiles when you need:

- Custom decision points and branches
- BPMN notation (events, gateways, pools)
- Complex swimlanes with multiple actors
- Activity diagrams with forks/joins
- Detailed subprocess modeling

## Next Steps

- [List Glyphsets →](/guide/glyphsets-list)
- [Comparison Glyphsets →](/guide/glyphsets-comparison)
- [Visualization Glyphsets →](/guide/glyphsets-visualization)
- [View All Glyphsets →](/guide/glyphsets)
- [Glyphset Themes →](/reference/glyphset-themes)
