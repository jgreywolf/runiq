---
title: All Glyphsets Reference
description: Complete reference of all 61 glyphsets with parameters and examples
lastUpdated: 2025-01-14
---

# All Glyphsets Reference

Complete reference for all **61 glyphsets** available in Runiq.

## Quick Reference Table

| Glyphset | Category | Min Items | Max Items | Description |
| --- | --- | --- | --- | --- |
| `alternatingProcess` | process | 3 | 8 | Process steps alternating left and right in a zigzag pattern with connecting arrows |
| `basicProcess` | process | 2 | 10 | Linear process flow with horizontal or vertical orientation |
| `blockCycle` | process | 3 | 8 | Rectangular blocks arranged in a circle with arrows. Shows cyclical process with clear sequential phases. |
| `continuousBlockProcess` | process | 3 | 8 | Process with solid connected blocks and arrows showing continuous flow |
| `cycle` | process | 3 | 8 | Circular process flow where steps are arranged in a circle |
| `detailedProcess` | process | 2 | 5 | Process with main steps and substeps shown below each. Use pipe character | to separate main step from substeps. |
| `equationProcess` | process | 3 | 6 | Equation-style process showing inputs combining to produce output (A + B = C) |
| `gearCycle` | process | 2 | 6 | Interlocking gears showing interconnected processes. Represents mechanical or systematic relationships between process steps. |
| `groupedProcess` | process | 2 | 4 | Parallel process streams that converge to a single merge point. Shows concurrent workflows combining into one output. |
| `orbitCycle` | process | 2 | 9 | Planetary orbit style with central core and orbiting items. Shows items revolving around or dependent on a central concept. |
| `phasedProcess` | process | 2 | 6 | Sequential process phases with milestone markers between them. Ideal for project phases or staged workflows. |
| `pictureProcess` | process | 2 | 8 | Sequential process flow with images for each step |
| `radialCycle` | process | 3 | 8 | Center hub with spokes radiating to surrounding items. Shows relationship between central concept and related components. |
| `segmentedCycle` | process | 2 | 6 | Pie chart segments in circular arrangement. Shows how items make up parts of a whole cycle or process with percentage distribution. |
| `spiralCycle` | process | 3 | 8 | Spiral progression showing growth, evolution, or iterative improvement. Each item represents a stage in an expanding, evolving process. |
| `stepProcess` | process | 3 | 8 | Process steps arranged diagonally in a staircase pattern, showing progression |
| `alternatingList` | list | 3 | 8 | List with items alternating left and right in a zigzag pattern |
| `basicList` | list | 2 | 10 | Vertical list of items with styled boxes |
| `chevronList` | list | 2 | 8 | Progressive list with chevron/arrow shapes showing directional flow |
| `columnList` | list | 4 | 12 | Multi-column list distributing items evenly across columns |
| `framedPicture` | list | 2 | 6 | Images with decorative frames in gallery-style layout |
| `horizontalList` | list | 2 | 10 | Horizontal list of items with styled boxes arranged left-to-right |
| `increasingList` | list | 3 | 6 | List with progressively larger items showing increasing emphasis |
| `nestedList` | list | 2 | 10 | Hierarchical list with indented sub-items |
| `numberedChevronList` | list | 2 | 8 | Vertical list with numbered chevrons, labels, and optional descriptions |
| `pictureBlocks` | list | 2 | 6 | Alternating image and text blocks in magazine-style layout |
| `pictureList` | list | 2 | 8 | List of items with circular images and labels |
| `circleHierarchy` | hierarchy | 3 | 15 | Hierarchical levels shown as concentric circles with nodes distributed in rings |
| `horizontalOrgChart` | hierarchy | 2 | 50 | Hierarchical tree structure showing reporting relationships (left-to-right) |
| `invertedPyramid` | hierarchy | 3 | 8 | Upside-down pyramid (funnel) with levels from wide (top) to narrow (bottom) |
| `labeledHierarchy` | hierarchy | 3 | 20 | Tree hierarchy with labeled edges showing the nature of relationships between nodes |
| `matrixOrgChart` | hierarchy | 3 | 40 | Organization chart with dual reporting relationships (functional + project) |
| `orgChart` | hierarchy | 2 | 50 | Hierarchical tree structure showing reporting relationships (top-down) |
| `pyramid` | hierarchy | 3 | 8 | Hierarchical pyramid structure with levels from top to bottom |
| `pyramidList` | hierarchy | 3 | 6 | Split layout with pyramid on left and descriptive list items on right |
| `segmentedPyramid` | hierarchy | 3 | 6 | Pyramid with subdivided levels showing both vertical and horizontal organization |
| `tableHierarchy` | hierarchy | 3 | 15 | Hierarchical data presented in tabular rows with fan-out connections between levels |
| `teamHierarchy` | hierarchy | 4 | 20 | Organizational structure showing teams with leaders and members in grouped containers |
| `linearVenn` | comparison | 2 | 4 | Horizontally arranged overlapping circles showing progressive relationships between sets |
| `matrix` | comparison | 4 | 4 | 2x2 comparison matrix for analyzing four items across two dimensions |
| `matrix3x3` | comparison | 9 | 9 | Nine-quadrant grid for comprehensive analysis |
| `segmentedMatrix` | comparison | 4 | 4 | Matrix with subdivided quadrants for detailed analysis |
| `steppedVenn` | comparison | 2 | 4 | Three-dimensional stacked circles creating a stepped pyramid effect for hierarchical comparison |
| `titledMatrix` | comparison | 4 | 9 | Grid with row and column headers for structured comparison |
| `venn` | comparison | 2 | 4 | Venn diagram with overlapping circles to show relationships and intersections |
| `events` | visualization | 2 | 10 | Horizontal sequence of events connected in order |
| `funnel` | visualization | 3 | 8 | Funnel visualization showing progressive filtering or conversion stages (alias for invertedPyramid) |
| `pictureCallout` | visualization | 2 | 8 | Central image with callout annotations positioned around it |
| `pictureGrid` | visualization | 2 | 12 | Grid of images with captions in equal-sized cells |
| `balance` | relationship | 2 | 2 | Balance scale showing two-sided comparison (left vs right) |
| `cluster` | relationship | 3 | 8 | Central concept with related items arranged in a radial pattern around it |
| `converging` | relationship | 2 | 5 | Shows multiple sources converging to a single destination point |
| `counterBalance` | relationship | 2 | 2 | Tilted balance scale comparing two options with adjustable weights showing relative importance |
| `diverging` | relationship | 2 | 5 | Shows a single source diverging into multiple destination points |
| `equation` | relationship | 3 | 5 | Mathematical equation format (A + B = C) showing how inputs combine to produce an output |
| `hub` | relationship | 3 | 12 | Central hub with radiating spokes showing connections to peripheral elements |
| `interconnected` | relationship | 3 | 8 | Circular mesh network showing all-to-all connections between nodes in a ring layout |
| `opposing` | relationship | 2 | 4 | Shows opposing or conflicting items with arrows pointing away from each other |
| `plusMinus` | relationship | 2 | 10 | Compare pros and cons, advantages and disadvantages side by side |
| `puzzle` | relationship | 2 | 6 | Interlocking puzzle pieces showing how components fit together |
| `target` | relationship | 2 | 5 | Concentric circles showing nested priorities or categories (bullseye pattern) |

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

### Process (16 glyphsets)

- `alternatingProcess` - Alternating Process
- `basicProcess` - Basic Process
- `blockCycle` - Block Cycle
- `continuousBlockProcess` - Continuous Block Process
- `cycle` - Cycle
- `detailedProcess` - Detailed Process
- `equationProcess` - Equation Process
- `gearCycle` - Gear Cycle
- `groupedProcess` - Grouped Process
- `orbitCycle` - Orbit Cycle
- `phasedProcess` - Phased Process
- `pictureProcess` - Picture Process
- `radialCycle` - Radial Cycle
- `segmentedCycle` - Segmented Cycle
- `spiralCycle` - Spiral Cycle
- `stepProcess` - Step Process

### List (11 glyphsets)

- `alternatingList` - Alternating List
- `basicList` - Basic List
- `chevronList` - Chevron List
- `columnList` - Column List
- `framedPicture` - Framed Picture
- `horizontalList` - Horizontal List
- `increasingList` - Increasing List
- `nestedList` - Nested List
- `numberedChevronList` - Numbered Chevron List
- `pictureBlocks` - Picture Blocks
- `pictureList` - Picture List

### Hierarchy (11 glyphsets)

- `circleHierarchy` - Circle Hierarchy
- `horizontalOrgChart` - Horizontal Organization Chart
- `invertedPyramid` - Inverted Pyramid
- `labeledHierarchy` - Labeled Hierarchy
- `matrixOrgChart` - Matrix Organization Chart
- `orgChart` - Organization Chart
- `pyramid` - Pyramid
- `pyramidList` - Pyramid List
- `segmentedPyramid` - Segmented Pyramid
- `tableHierarchy` - Table Hierarchy
- `teamHierarchy` - Team Hierarchy

### Comparison (7 glyphsets)

- `linearVenn` - Linear Venn Diagram
- `matrix` - Matrix (2x2)
- `matrix3x3` - 3x3 Matrix
- `segmentedMatrix` - Segmented Matrix
- `steppedVenn` - Stepped Venn Diagram
- `titledMatrix` - Titled Matrix
- `venn` - Venn Diagram

### Visualization (4 glyphsets)

- `events` - Events
- `funnel` - Funnel
- `pictureCallout` - Picture Callout
- `pictureGrid` - Picture Grid

### Relationship (12 glyphsets)

- `balance` - Balance Diagram
- `cluster` - Cluster Diagram
- `converging` - Converging Diagram
- `counterBalance` - Counterbalance
- `diverging` - Diverging Diagram
- `equation` - Equation
- `hub` - Hub and Spoke
- `interconnected` - Interconnected
- `opposing` - Opposing Diagram
- `plusMinus` - Plus/Minus Diagram
- `puzzle` - Puzzle Diagram
- `target` - Target Diagram

## Usage Examples

### Basic Process

```runiq
glyphset basicProcess "Development Pipeline" {
  item "Plan"
  item "Code"
  item "Test"
  item "Deploy"

  orientation "horizontal"
  theme professional
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

  theme ocean
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
  theme sunset
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

  theme forest
}
```

### Stepped Venn Diagram

Three-dimensional stacked circles creating a pyramid effect.

```runiq
glyphset steppedVenn "Market Segments" {
  circle "Enterprise"
  circle "Mid-Market"
  circle "SMB"

  theme vibrant
}
```

### Linear Venn Diagram

Horizontal overlapping circles showing intersections.

```runiq
glyphset linearVenn "Product Features" {
  circle "Basic"
  circle "Standard"
  circle "Premium"
  circle "Enterprise"

  theme professional
}
```

### Counterbalance Diagram

Balance scale showing comparison between two concepts.

```runiq
glyphset counterBalance "Cost vs Value" {
  item"Low Cost"
  item"High Value"

  theme cool
}
```

### Equation Diagram

Mathematical equation format (A + B = C or similar).

```runiq
glyphset equation "Revenue Model" {
  input "Product Sales"
  input "Subscriptions"
  output "Total Revenue"

  theme warm
}
```

### Interconnected Network

Circular mesh network showing all-to-all connections.

```runiq
glyphset interconnected "Microservices" {
  node "API Gateway"
  node "Auth Service"
  node "User Service"
  node "Payment Service"
  node "Analytics"

  theme ocean
}
```

### Hub Diagram

Central hub with radial spokes (star topology).

```runiq
glyphset hub "Distribution Network" {
  center "Warehouse"
  spoke "Store A"
  spoke "Store B"
  spoke "Store C"
  spoke "Store D"

  theme forest
}
```

### Circle Hierarchy

Concentric circles showing hierarchical layers.

```runiq
glyphset circleHierarchy "System Layers" {
  root "Core"
  child "Business Logic"
  child "API Layer"
  child "UI Layer"

  theme professional
}
```

### Labeled Hierarchy

Tree structure with labeled edges showing relationships. Supports nested hierarchies.

```runiq
glyphset labeledHierarchy "Team Structure" {
  root "Engineering Manager" {
    child "Tech Lead" oversees {
      child "Senior Engineer" mentors {
        child "Junior Engineer"
      }
    }
    child "QA Lead" manages {
      child "QA Engineer"
    }
  }

  theme vibrant
}
```

**Flat syntax (no nesting):**

```runiq
glyphset labeledHierarchy "Simple Reporting" {
  root "CEO"
  child "CTO" reports_to
  child "CFO" reports_to
  child "CMO" reports_to

  theme cool
}
```

### Table Hierarchy

Tabular rows grouped by hierarchical categories.

```runiq
glyphset tableHierarchy "System Architecture" {
  level "Controller A" Presentation
  level "Controller B" Presentation
  level "Service A" BusinessLogic
  level "Service B" BusinessLogic
  level "Repository 1" DataAccess
  level "Repository 2" DataAccess

  theme monochrome
}
```

### Team Hierarchy

Team containers with leaders and members.

```runiq
glyphset teamHierarchy "Project Teams" {
  team "Frontend"
  leader "Sarah Chen"
  member "Alice"
  member "Bob"

  team "Backend"
  leader "Mike Johnson"
  member "Charlie"
  member "Diana"

  team "DevOps"
  leader "Emma Wilson"
  member "Frank"

  theme sunset
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
