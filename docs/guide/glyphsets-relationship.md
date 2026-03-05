---
title: Relationship Glyphsets
description: Show connections and relationships between concepts
lastUpdated: 2025-01-14
---

# Relationship Glyphsets

Relationship glyphsets visualize how concepts connect, converge, diverge, or relate to each other.

## Convergence & Divergence

### converging

Multiple inputs converging to a single output.

**Parameters:**

- `outer` (3-8 items) - Outer items
- `inner` (1 item) - Central convergence point
- `theme` - Color theme

**Example:**

```runiq
glyphset converging "Data Aggregation Flow" {
  theme forest
  item "Customer Database"
  item "Sales Records"
  item "Analytics Events"
  item "Third-Party APIs"
}

```

### diverging

Single input diverging to multiple outputs.

**Parameters:**

- `inner` (1 item) - Central source
- `outer` (3-8 items) - Diverging outputs
- `theme` - Color theme

**Example:**

```runiq
glyphset diverging "Notification Channels" {
  theme forest
  item "Email"
  item "SMS"
  item "Push Notification"
  item "In-App Alert"
  item "Webhook"
}
```

## Balance & Opposition

### balance

Two-sided balance scale showing trade-offs.

**Parameters:**

- `left` (1-3 items) - Left side items
- `right` (1-3 items) - Right side items
- `theme` - Color theme

**Example:**

```runiq
glyphset balance "professional" {
  theme forest
  item"Costs: Initial Investment, Training, Maintenance"
  item"Benefits: Productivity, ROI, Scalability"
}
```

### opposing

Opposing forces or contrasting concepts.

**Parameters:**

- `left` (1-3 items) - Left opposition
- `right` (1-3 items) - Right opposition
- `theme` - Color theme

**Example:**

```runiq
glyphset opposing "Tech Stack" {
  theme forest
  item "Open Source"
  item "Proprietary"
  item "Hybrid Model"
}
```

### plusMinus

Pros and cons comparison.

**Parameters:**

- `plus` (1-5 items) - Positive aspects
- `minus` (1-5 items) - Negative aspects
- `theme` - Color theme

**Example:**

```runiq
glyphset plusMinus "Remote Work Analysis" {
  theme forest
  item "Flexibility"
  item "No Commute"
  item "Lower Costs"
  item "Isolation"
  item "Communication Challenges"
}
```

## Grouping & Clustering

### cluster

Grouped clusters of related items.

**Parameters:**

- `cluster` (2-4 clusters) - Item groups
- `theme` - Color theme

**Example:**

```runiq
glyphset cluster "Development Team" {
  theme forest
  item "Frontend Developer"
  item "Backend Developer"
  item "UI/UX Designer"
  item "QA Engineer"
  item "DevOps Engineer"
  item "Product Owner"
}
```

### puzzle

Interlocking puzzle pieces showing how parts fit together.

**Parameters:**

- `piece` (2-6 pieces) - Puzzle pieces
- `theme` - Color theme

**Example:**

```runiq
glyphset puzzle "Development Team" {
  theme forest
  item "Planning"
  item "Design"
  item "Development"
  item "Testing"
  item "Deployment"
  item "Maintenance"
}
```

## Targeting & Focus

### target

Concentric target/bullseye pattern.

**Parameters:**

- `ring` (2-5 rings, outer to inner) - Target rings
- `theme` - Color theme

**Example:**

```runiq
glyphset target "Product Priorities" {
  theme forest
  circle "Core Features"
  circle "Key Features"
  circle "Nice to Have"
}
```

## Tips for Relationship Glyphsets

### Choosing the Right Pattern

- **Many to one** → `converging`
- **One to many** → `diverging`
- **Trade-offs** → `balance`, `plusMinus`
- **Contrast** → `opposing`
- **Categories** → `cluster`
- **Integration** → `puzzle`
- **Priority/focus** → `target`

### Best Practices

1. **Clear relationships** - Make connections obvious
2. **Balanced sides** - Similar detail on each side
3. **Logical grouping** - Group related items together
4. **Consistent themes** - Use appropriate colors for meaning

### When to Use Diagram Profiles Instead

Switch to diagram profiles for:

- Complex network topologies
- Detailed relationship types (UML associations)
- Multi-directional flows
- Conditional relationships

## Next Steps

- [Process Glyphsets →](/guide/glyphsets-process)
- [List Glyphsets →](/guide/glyphsets-list)
- [Comparison Glyphsets →](/guide/glyphsets-comparison)
- [Visualization Glyphsets →](/guide/glyphsets-visualization)
- [Hierarchy Glyphsets →](/guide/glyphsets-hierarchy)
- [Glyphset Themes Reference →](/reference/glyphset-themes)
- [Try the Online Editor →](https://editor.runiq.org)
