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
glyphset converging "Sales Funnel" {
  outer "Website Visitors"
  outer "Email Campaign"
  outer "Social Media"
  outer "Referrals"
  inner "Qualified Leads"

  theme "professional"
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
glyphset diverging "Content Distribution" {
  inner "Blog Post"
  outer "LinkedIn"
  outer "Twitter"
  outer "Newsletter"
  outer "Medium"

  theme "ocean"
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
glyphset balance "Work-Life Balance" {
  left "Career Growth"
  left "Income"
  right "Family Time"
  right "Health"
  right "Hobbies"

  theme "forest"
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
glyphset opposing "Tech Stack Choice" {
  left "Microservices"
  left "Flexibility"
  left "Scalability"
  right "Monolith"
  right "Simplicity"
  right "Speed"

  theme "sunset"
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
glyphset plusMinus "Remote Work" {
  plus "Flexibility"
  plus "No Commute"
  plus "Cost Savings"
  minus "Isolation"
  minus "Communication Challenges"
  minus "Work-Life Boundaries"

  theme "monochrome"
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
glyphset cluster "Skill Categories" {
  cluster "Frontend" {
    item "React"
    item "TypeScript"
    item "CSS"
  }
  cluster "Backend" {
    item "Node.js"
    item "PostgreSQL"
    item "Redis"
  }
  cluster "DevOps" {
    item "Docker"
    item "Kubernetes"
    item "AWS"
  }

  theme "professional"
}
```

### puzzle

Interlocking puzzle pieces showing how parts fit together.

**Parameters:**

- `piece` (2-6 pieces) - Puzzle pieces
- `theme` - Color theme

**Example:**

```runiq
glyphset puzzle "Solution Components" {
  piece "Infrastructure"
  piece "Application"
  piece "Data"
  piece "Security"

  theme "ocean"
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
glyphset target "Market Segmentation" {
  ring "Total Market"
  ring "Target Market"
  ring "Core Customers"
  ring "Key Accounts"

  theme "sunset"
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
- [Comparison Glyphsets →](/guide/glyphsets-comparison)
- [View All Glyphsets →](/guide/glyphsets)
