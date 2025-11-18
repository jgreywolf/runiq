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
glyphset pictureGrid "Featured Products" {
  theme "colorful"
  columns 3

  // Using pravatar.cc for test images (random faces)
  image "https://i.pravatar.cc/300?img=1" label "Product A"
  image "https://i.pravatar.cc/300?img=2" label "Product B"
  image "https://i.pravatar.cc/300?img=3" label "Product C"
  image "https://i.pravatar.cc/300?img=4" label "Product D"
  image "https://i.pravatar.cc/300?img=5" label "Product E"
  image "https://i.pravatar.cc/300?img=6" label "Product F"
}
```

### pictureCallout

Central image with callout boxes.

**Parameters:**

- `image` - Central image
- `callout` (2-6 callouts) - Callout labels, with positioning info (topSide, bottomSide, leftSide, rightSide)
- `theme` - Color theme

**Example:**

```runiq
glyphset pictureCallout "Smart Watch" {
  theme "professional"
  image "https://i.pravatar.cc/400?img=20"

  callout "Water Resistant" topSide
  callout "Heart Rate Monitor" rightSide
  callout "Long Battery Life" bottomSide
  callout "GPS Tracking" leftSide
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
glyphset pictureProcess "Baking Process" {
  theme "colorful"
  direction "horizontal"

  // Using pravatar.cc for test images
  image "https://i.pravatar.cc/200?img=11" label "Gather Ingredients"
  image "https://i.pravatar.cc/200?img=12" label "Mix Thoroughly"
  image "https://i.pravatar.cc/200?img=13" label "Bake at 350°F"
  image "https://i.pravatar.cc/200?img=14" label "Cool & Serve"
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
