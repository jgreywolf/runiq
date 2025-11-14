---
title: All Glyphsets Reference
description: Complete reference of all 60+ glyphsets with parameters and examples
lastUpdated: 2025-01-14
---

# All Glyphsets Reference

Complete reference for all **60+ glyphsets** available in Runiq.

## Quick Reference Table

| Glyphset | Category | Min Items | Max Items | Description |
|----------|----------|-----------|-----------|-------------|
| `basicProcess` | Process | 2 | 10 | Linear horizontal/vertical process |
| `cycle` | Process | 3 | 8 | Circular process cycle |
| `spiralCycle` | Process | 3 | 8 | Spiral evolution pattern |
| `radialCycle` | Process | 3 | 8 | Radial spoke pattern |
| `blockCycle` | Process | 3 | 6 | Block-based cycle |
| `orbitCycle` | Process | 3 | 8 | Orbital hierarchy |
| `gearCycle` | Process | 2 | 5 | Interlocking gears |
| `segmentedCycle` | Process | 3 | 8 | Segmented circular cycle |
| `alternatingProcess` | Process | 3 | 8 | Zigzag S-curve flow |
| `stepProcess` | Process | 3 | 8 | Diagonal stair-step |
| `detailedProcess` | Process | 2 | 5 | Process with substeps |
| `phasedProcess` | Process | 2 | 6 | Distinct phase milestones |
| `groupedProcess` | Process | 2 | 4 | Grouped workstreams |
| `continuousBlockProcess` | Process | 3 | 8 | Connected block flow |
| `equationProcess` | Process | 3 | 5 | Equation-style process |
| `pictureProcess` | Visualization | 3 | 6 | Process with central image |
| `basicList` | List | 2 | 10 | Simple vertical list |
| `pictureList` | List | 2 | 8 | List with pictures |
| `framedPicture` | List | 1 | 1 | Framed picture with label |
| `pictureBlocks` | List | 2 | 9 | Grid of picture blocks |
| `orgChart` | Hierarchy | 1 | ∞ | Organization chart |
| `matrix` | Comparison | 4 | 4 | 2×2 matrix |
| `matrix3x3` | Comparison | 9 | 9 | 3×3 matrix |
| `segmentedMatrix` | Comparison | 2 | 4 | Multi-section matrix |
| `titledMatrix` | Comparison | 2 | 4 | Matrix with row/col titles |
| `pictureGrid` | Visualization | 2 | 9 | Grid of images |
| `pictureCallout` | Visualization | 3 | 7 | Image with callouts |
| `events` | Visualization | 2 | 10 | Timeline/event sequence |
| `converging` | Relationship | 4 | 9 | Many to one convergence |
| `diverging` | Relationship | 4 | 9 | One to many divergence |
| `balance` | Relationship | 2 | 6 | Two-sided balance |
| `opposing` | Relationship | 2 | 6 | Opposing forces |
| `plusMinus` | Relationship | 2 | 10 | Pros and cons |
| `cluster` | Relationship | 2 | 4 | Grouped clusters |
| `puzzle` | Relationship | 2 | 6 | Interlocking pieces |
| `target` | Relationship | 2 | 5 | Concentric rings |

## Common Parameters

### Theme Parameters

All glyphsets support these theme values:

- `colorful` (default) - Classic Office color palette
- `professional` - Professional gray-blue tones
- `monochrome` - Monochrome blue gradient
- `vibrant` - Energetic multi-color palette
- `warm` - Warm corals, oranges, and yellows
- `cool` - Cool cyans, blues, and purples
- `forest` - Natural greens
- `sunset` - Warm oranges and ambers
- `ocean` - Cool blues and teals

[Learn more about themes →](/reference/glyphset-themes)

### Orientation Parameters

Process and list glyphsets support:

- `horizontal` / `LR` - Left to right
- `vertical` / `TB` - Top to bottom

### Direction Parameters

Some glyphsets support additional directions:

- `LR` - Left to right
- `RL` - Right to left
- `TB` - Top to bottom
- `BT` - Bottom to top

## Glyphsets by Category

### Process (17 glyphsets)

Linear flows, cycles, and sequential processes.

[View Process Glyphsets Guide →](/guide/glyphsets-process)

**Linear:**
- `basicProcess` - Simple linear process
- `alternatingProcess` - Zigzag pattern
- `stepProcess` - Stair-step progression
- `detailedProcess` - Process with substeps
- `phasedProcess` - Phase milestones
- `groupedProcess` - Grouped workstreams
- `continuousBlockProcess` - Connected blocks
- `equationProcess` - Equation-style

**Cyclic:**
- `cycle` - Basic circular cycle
- `spiralCycle` - Spiral evolution
- `radialCycle` - Radial/spoke
- `blockCycle` - Block-based cycle
- `orbitCycle` - Orbital hierarchy
- `gearCycle` - Interlocking gears
- `segmentedCycle` - Segmented cycle

**Hybrid:**
- `pictureProcess` - Process with central image

### List (6 glyphsets)

Organized lists and styled collections.

[View List Glyphsets Guide →](/guide/glyphsets-list)

- `basicList` - Simple vertical list
- `pictureList` - List with images
- `framedPicture` - Framed single picture
- `pictureBlocks` - Grid of picture blocks

### Hierarchy (1 glyphset)

Organizational structures.

[View Hierarchy Glyphsets Guide →](/guide/glyphsets-hierarchy)

- `orgChart` - Organization chart with unlimited nesting

### Comparison (4 glyphsets)

Matrices and comparative analysis.

[View Comparison Glyphsets Guide →](/guide/glyphsets-comparison)

- `matrix` - 2×2 matrix (4 quadrants)
- `matrix3x3` - 3×3 grid (9 cells)
- `segmentedMatrix` - Multi-section matrix
- `titledMatrix` - Matrix with titles

### Visualization (8 glyphsets)

Data visualization and presentation graphics.

[View Visualization Glyphsets Guide →](/guide/glyphsets-visualization)

- `pictureGrid` - Grid of images
- `pictureCallout` - Image with callouts
- `pictureProcess` - Process with central image
- `events` - Timeline/event sequence

### Relationship (24 glyphsets)

Connections and relationships between concepts.

[View Relationship Glyphsets Guide →](/guide/glyphsets-relationship)

**Convergence/Divergence:**
- `converging` - Many to one
- `diverging` - One to many

**Balance/Opposition:**
- `balance` - Two-sided balance
- `opposing` - Opposing forces
- `plusMinus` - Pros and cons

**Grouping:**
- `cluster` - Grouped clusters
- `puzzle` - Interlocking pieces

**Targeting:**
- `target` - Concentric rings

## Usage Examples

### Basic Process

```runiq
glyphset basicProcess "Development Pipeline" {
  step "Plan"
  step "Code"
  step "Test"
  step "Deploy"
  
  orientation "horizontal"
  theme "professional"
}
```

### Organization Chart

```runiq
glyphset orgChart "Team" {
  person "Manager" {
    person "Lead Developer" {
      person "Dev 1"
      person "Dev 2"
    }
    person "QA Lead" {
      person "QA Engineer"
    }
  }
  
  theme "ocean"
}
```

### Comparison Matrix

```runiq
glyphset matrix "Eisenhower Matrix" {
  quadrant "Do First" label: "Urgent & Important"
  quadrant "Schedule" label: "Important"
  quadrant "Delegate" label: "Urgent"
  quadrant "Eliminate" label: "Neither"
  
  horizontalAxis "Urgency"
  verticalAxis "Importance"
  theme "sunset"
}
```

### Relationship Diagram

```runiq
glyphset converging "Lead Sources" {
  outer "Website"
  outer "Social Media"
  outer "Email"
  outer "Referrals"
  inner "Qualified Leads"
  
  theme "forest"
}
```

## Parameter Reference

### Array Parameters

Most glyphsets use array parameters for items:

```runiq
// Using named items
glyphset basicProcess "Example" {
  step "First"
  step "Second"
  step "Third"
}

// Alternative array syntax (if supported)
glyphset basicProcess "Example" {
  steps: ["First", "Second", "Third"]
}
```

### Nested Parameters

Some glyphsets support nesting:

```runiq
glyphset orgChart "Hierarchy" {
  person "Root" {
    person "Child 1" {
      person "Grandchild 1"
      person "Grandchild 2"
    }
    person "Child 2"
  }
}
```

### Complex Parameters

Advanced glyphsets may use structured data:

```runiq
glyphset detailedProcess "Complex" {
  item "Phase 1 | Task A | Task B | Task C"
  item "Phase 2 | Task D | Task E"
}
```

## Best Practices

1. **Choose the right glyphset** - Match pattern to your message
2. **Use consistent themes** - Same theme across related diagrams
3. **Keep it simple** - 3-7 items optimal for most glyphsets
4. **Clear labels** - Brief, descriptive text
5. **Test with data** - Verify with real content, not placeholders

## When to Use Diagram Profiles Instead

Switch from glyphsets to diagram profiles when you need:

- **Custom shapes** - Beyond standard glyphset shapes
- **Complex connections** - Multi-directional or conditional
- **Technical notation** - UML, BPMN, circuit symbols
- **Fine control** - Precise positioning and styling
- **Detailed metadata** - Attributes, annotations, properties

[Learn about Diagram Profiles →](/guide/profiles)

## Next Steps

- [Getting Started with Glyphsets →](/guide/glyphsets)
- [Process Glyphsets →](/guide/glyphsets-process)
- [Glyphset Themes →](/reference/glyphset-themes)
- [Try Online Editor →](https://editor.runiq.org)
