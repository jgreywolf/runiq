---
title: Visualization Glyphsets
description: Data visualization and presentation graphics
lastUpdated: 2025-01-14
---

# Visualization Glyphsets

Visualization glyphsets create engaging presentation graphics with pictures, timelines, and data-driven layouts.

## Available Visualization Glyphsets

### pictureGrid

Grid layout of images with labels.

**Parameters:**
- `item` (array, 2-9 items) - Grid items
- `columns` - Grid columns (default: 3)
- `theme` - Color theme

**Example:**

```runiq
glyphset pictureGrid "Product Features" {
  item "Speed"
  item "Security"
  item "Scalability"
  item "Reliability"
  item "Analytics"
  item "Support"
  
  columns 3
  theme "professional"
}
```

### pictureCallout

Central image with callout boxes.

**Parameters:**
- `image` - Central image
- `callout` (2-6 callouts) - Callout labels
- `theme` - Color theme

**Example:**

```runiq
glyphset pictureCallout "Product Overview" {
  image "product.png"
  callout "Feature 1"
  callout "Feature 2"
  callout "Feature 3"
  callout "Feature 4"
  
  theme "ocean"
}
```

### pictureProcess

Process flow with central picture.

**Parameters:**
- `image` - Central image
- `step` (3-6 steps) - Process steps around image
- `theme` - Color theme

**Example:**

```runiq
glyphset pictureProcess "Development Cycle" {
  image "logo.png"
  step "Plan"
  step "Build"
  step "Test"
  step "Deploy"
  
  theme "forest"
}
```

### events

Horizontal sequence of events (timeline).

**Parameters:**
- `event` (2-10 events) - Timeline events
- `showConnections` - Show connecting lines (default: true)
- `theme` - Color theme

**Example:**

```runiq
glyphset events "Project Milestones" {
  event "Kickoff - Jan 1"
  event "Alpha - Mar 15"
  event "Beta - Jun 1"
  event "Launch - Sep 1"
  
  showConnections true
  theme "sunset"
}
```

## Tips for Visualization Glyphsets

### Choosing the Right Visualization

- **Photo gallery** → `pictureGrid`, `pictureBlocks`
- **Product showcase** → `pictureCallout`
- **Timeline/roadmap** → `events`
- **Process with branding** → `pictureProcess`

### Best Practices

1. **High-quality images** - Use consistent image sizes
2. **Clear labels** - Brief, descriptive text
3. **Visual hierarchy** - Most important items first
4. **Spacing** - Don't overcrowd the layout

## Next Steps

- [Process Glyphsets →](/guide/glyphsets-process)
- [List Glyphsets →](/guide/glyphsets-list)
- [View All Glyphsets →](/guide/glyphsets)
