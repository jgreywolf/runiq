---
title: Treemap Diagrams
description: Create hierarchical treemap visualizations using the treemap profile.
lastUpdated: 2025-02-08
---

# Treemap Diagrams

Treemaps show hierarchical data as nested rectangles sized by value. Use the `treemap` profile for product usage, budgets, or portfolio allocations.

## Basic Treemap

```runiq
treemap "Product Usage" {
  layout slice-dice
  padding 10
  gap 6

  group "North America" value:60 color:"#bfdbfe" {
    item "Enterprise" value:40
    item "SMB" value:20
  }
  group "EMEA" value:25 color:"#fecdd3" {
    item "Enterprise" value:15
    item "SMB" value:10
  }
  group "APAC" value:15 color:"#bbf7d0" {
    item "Enterprise" value:8
    item "SMB" value:7
  }
}
```

## Nested Categories

```runiq
treemap "Engineering Portfolio" {
  layout squarify
  padding 8
  gap 4

  group "Core Platform" color:"#e2e8f0" {
    item "Authentication" value:32
    item "Billing" value:20
    item "Search" value:18
  }
  group "Customer Experience" color:"#fef3c7" {
    item "Onboarding" value:16
    item "Support" value:12
    item "Analytics" value:14
  }
}
```

## Key Features

- **Groups and items**: Use `group` blocks for hierarchy and `item` for leaves.
- **Values**: `value:` drives area size; groups can omit value to sum children.
- **Layouts**: `slice-dice` or `squarify`.
- **Spacing**: `padding` (inner spacing) and `gap` (between nodes).

See [Profiles](/guide/profiles) for the full profile overview.
