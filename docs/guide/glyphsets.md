---
title: Glyphsets (Smart Art)
description: Pre-built diagram templates for quick and professional visualizations, similar to PowerPoint SmartArt
lastUpdated: 2025-01-14
---

# Glyphsets (Smart Art)

**Glyphsets** are pre-built diagram templates that let you create professional visualizations instantly by providing just your data. Think of them as **PowerPoint SmartArt for diagrams-as-code**.

## What are Glyphsets?

Glyphsets provide ready-to-use diagram patterns that automatically handle:

- ✅ **Layout** - Professional arrangement without manual positioning
- ✅ **Styling** - Consistent themes and colors
- ✅ **Structure** - Proven patterns for common diagram types
- ✅ **Speed** - Create diagrams in seconds, not minutes

## When to Use Glyphsets vs Diagram Profiles

| Feature            | Glyphsets (Smart Art)                  | Diagram Profiles                     |
| ------------------ | -------------------------------------- | ------------------------------------ |
| **Speed**          | ⚡ Very fast - just add data           | 🐢 Slower - manual layout            |
| **Customization**  | 🎨 Themed, limited options             | 🛠️ Full control over everything      |
| **Use Case**       | Quick presentations, standard patterns | Detailed technical diagrams          |
| **Learning Curve** | 📚 Easy - minimal syntax               | 📖 Moderate - more options           |
| **Examples**       | Process flows, org charts, matrices    | UML diagrams, circuits, architecture |

### Choose Glyphsets When You Need:

- Quick presentations and reports
- Standard visualization patterns
- Data-driven diagrams
- Consistency across multiple diagrams
- Minimal setup time

### Choose Diagram Profiles When You Need:

- Complex technical diagrams (UML, BPMN, circuits)
- Custom node positioning and relationships
- Fine-grained control over styling
- Specialized shapes and notations
- Detailed annotations and metadata

## Basic Syntax

```runiq
glyphset <glyphsetType> "Title" {
  <parameters>
  <data items>
}
```

**Example:**

```runiq
glyphset basicProcess "Software Development" {
  step "Plan"
  step "Code"
  step "Test"
  step "Deploy"

  theme "ocean"
  orientation "horizontal"
}
```

## Common Parameters

Most glyphsets support these parameters:

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------||
| `theme` | string | Color theme (colorful, professional, monochrome, vibrant, warm, cool, forest, sunset, ocean) | `colorful` |
| `orientation` | string | Layout direction (horizontal, vertical) | varies by glyphset |
| `shape` | string | Node shape override | varies by glyphset |
| `direction` | string | Layout flow direction (LR, RL, TB, BT) | varies by glyphset |

[View all themes →](/reference/glyphset-themes)

## Available Glyphset Categories

Runiq includes **60+ glyphsets** across 6 categories:

### 1. Process Glyphsets (17)

Linear flows, cycles, and sequential processes.

- `basicProcess` - Simple linear process (horizontal/vertical)
- `cycle` - Circular process with cycle-back
- `alternatingProcess` - Zigzag flow pattern
- `stepProcess` - Stair-step progression
- And 13 more cycle variants...

[View Process Glyphsets →](/guide/glyphsets-process)

### 2. List Glyphsets (6)

Organized lists and styled item collections.

- `basicList` - Simple vertical list
- `pictureList` - List with images/icons
- `framedPicture` - Picture with decorative frame
- `pictureBlocks` - Grid of picture blocks

[View List Glyphsets →](/guide/glyphsets-list)

### 3. Hierarchy Glyphsets (1)

Organizational structures and pyramids.

- `orgChart` - Organization chart with nested reporting

[View Hierarchy Glyphsets →](/guide/glyphsets-hierarchy)

### 4. Comparison Glyphsets (4)

Comparative analysis and contrasts.

- `matrix` - 2x2 comparison matrix
- `matrix3x3` - 3x3 comparison grid
- `segmentedMatrix` - Multi-section matrix
- `titledMatrix` - Matrix with section titles

[View Comparison Glyphsets →](/guide/glyphsets-comparison)

### 5. Visualization Glyphsets (8)

Data visualization and presentation graphics.

- `pictureGrid` - Grid of images with labels
- `pictureCallout` - Image with callout boxes
- `pictureProcess` - Process with central image
- And 5 more variants...

[View Visualization Glyphsets →](/guide/glyphsets-visualization)

### 6. Relationship Glyphsets (24)

Show connections and relationships between concepts.

- `converging` - Multiple inputs to single output
- `diverging` - Single input to multiple outputs
- `balance` - Two-sided balance scale
- `target` - Concentric target/bullseye
- `puzzle` - Interlocking puzzle pieces
- `cluster` - Grouped clusters
- `opposing` - Opposing forces
- `plusMinus` - Pros and cons
- And 16 more patterns...

[View Relationship Glyphsets →](/guide/glyphsets-relationship)

## Quick Examples

### Process Flow

```runiq
glyphset basicProcess "Onboarding Steps" {
  step "Application"
  step "Interview"
  step "Offer"
  step "Start Date"

  theme "forest"
  orientation "horizontal"
}
```

### Organization Chart

```runiq
glyphset orgChart "Team Structure" {
  person "Engineering Manager" {
    person "Frontend Lead" {
      person "Developer 1"
      person "Developer 2"
    }
    person "Backend Lead" {
      person "Developer 3"
      person "Developer 4"
    }
  }
}
```

### Comparison Matrix

```runiq
glyphset matrix "Priority Matrix" {
  quadrant "Do First" label: "Urgent & Important"
  quadrant "Schedule" label: "Important, Not Urgent"
  quadrant "Delegate" label: "Urgent, Not Important"
  quadrant "Eliminate" label: "Neither"

  horizontalAxis "Urgency"
  verticalAxis "Importance"
}
```

### Convergence Diagram

```runiq
glyphset converging "Sales Funnel" {
  outer "Website Visitors"
  outer "Email Signups"
  outer "Free Trial Users"
  inner "Paying Customers"

  theme "sunset"
}
```

## Themes

All glyphsets support 5 built-in themes:

- **professional** (default) - Blue business tones
- **forest** - Natural greens
- **sunset** - Warm oranges and reds
- **ocean** - Cool blues and teals
- **monochrome** - Sophisticated grays

```runiq
glyphset basicProcess "Themed Process" {
  step "A"
  step "B"
  step "C"

  theme "sunset"  // Try: professional, forest, sunset, ocean, monochrome
}
```

[Learn more about themes →](/reference/glyphset-themes)

## Tips and Best Practices

### 1. Keep It Simple

Glyphsets work best with focused content:

- ✅ 3-7 items for most glyphsets
- ✅ Clear, concise labels
- ✅ Single concept per diagram

### 2. Choose the Right Pattern

Match the glyphset to your message:

- **Sequential flow** → `basicProcess`, `cycle`
- **Hierarchy** → `orgChart`, `pyramid`
- **Comparison** → `matrix`, `balance`
- **Relationships** → `converging`, `diverging`, `cluster`

### 3. Use Themes Consistently

Stick to one theme across related diagrams for visual consistency.

### 4. When to Switch to Diagram Profiles

Use diagram profiles instead when you need:

- Complex custom connections
- Technical notation (UML, BPMN, circuits)
- Precise positioning control
- Mixed shape types
- Detailed annotations

## Next Steps

- [Process Glyphsets →](/guide/glyphsets-process)
- [List Glyphsets →](/guide/glyphsets-list)
- [Comparison Glyphsets →](/guide/glyphsets-comparison)
- [Visualization Glyphsets →](/guide/glyphsets-visualization)
- [Hierarchy Glyphsets →](/guide/glyphsets-hierarchy)
- [Relationship Glyphsets →](/guide/glyphsets-relationship)
- [Glyphset Themes Reference →](/reference/glyphset-themes)
- [Try the Online Editor →](https://editor.runiq.org)
