# Mindmap Level-Aware Styling

## Overview

Runiq now automatically detects hierarchy levels in radial/mindmap layouts and applies comprehensive automatic styling including:

- **Node colors** based on hierarchy level
- **Font sizes and stroke widths** for visual hierarchy
- **Thick, straight edges** for clear connections (2.5px width)
- All automatic - no manual styling required!

## How It Works

### Automatic Level Detection

When using `algorithm: radial` in a container, Runiq automatically:

1. **Detects the root node** (central concept)
   - Nodes with no incoming edges
   - Circle/circ shaped nodes (preferred)
   - First node as fallback

2. **Calculates levels using BFS** (Breadth-First Search)
   - Level 0: Central/root node
   - Level 1: Nodes directly connected to root
   - Level 2: Nodes connected to level 1 nodes
   - Level N: Nodes N steps away from root

3. **Applies automatic styling by level**
   - **Level 0 (Central)**:
     - Font size: 16, stroke width: 3, padding: 16
     - Color: White fill with purple accent border (#ffffff / #8b5cf6)
   - **Level 1 (Main branches)**:
     - Font size: 14, stroke width: 2, padding: 14
     - Color: Vibrant palette cycling through blue, green, amber, pink, purple, cyan, red, lime
   - **Level 2 (Sub-branches)**:
     - Font size: 12, stroke width: 1, padding: 12
     - Color: Lighter tints (60% lighter) of parent branch color
   - **Level 3+ (Details)**:
     - Font size: 11, stroke width: 1, padding: 10
     - Color: Even lighter tints (80% lighter) of parent branch color

### Color Palette

Level 1 branches automatically cycle through these colors:

1. Blue (#3b82f6 / #2563eb)
2. Green (#10b981 / #059669)
3. Amber (#f59e0b / #d97706)
4. Pink (#ec4899 / #db2777)
5. Purple (#8b5cf6 / #7c3aed)
6. Cyan (#06b6d4 / #0891b2)
7. Red (#ef4444 / #dc2626)
8. Lime (#84cc16 / #65a30d)

### Edge Styling

Mindmap edges are automatically styled for clarity:

- **Stroke Width**: 2.5px (thicker than default 1px)
- **Color**: Neutral gray (#6b7280) that works with all branch colors
- **Routing**: Straight lines (POLYLINE) instead of orthogonal bends
- Perfect for radial layouts where connections should be visually prominent

### Styling Precedence

The automatic level styling is **non-intrusive**:

- Only applied if node doesn't have explicit inline styling
- Custom colors, fonts, etc. override automatic styling
- Combines with style references
- **No color specifications needed** for beautiful mindmaps!

## Examples

### Minimal Mindmap (Zero Styling!)

```runiq
diagram "My Mind Map" {
  container "Ideas" algorithm: radial spacing: 80 {
    // NO color specifications needed!
    // Central node - auto: white fill, purple border, large font
    shape central as @circle label: "Main Topic"

    // Branches - auto: vibrant colors (blue, green, amber, pink...), medium font
    shape idea1 as @roundedRectangle label: "Idea 1"
    shape idea2 as @roundedRectangle label: "Idea 2"

    // Sub-branches - auto: lighter tints of parent colors, smaller font
    shape detail1 as @rectangle label: "Detail 1"
    shape detail2 as @rectangle label: "Detail 2"

    central -> idea1
    central -> idea2
    idea1 -> detail1
    idea1 -> detail2
  }
}
```

Result: Beautiful, colorful mindmap with zero manual styling!

### With Custom Colors

```runiq
diagram "Colored Mindmap" {
  container "Strategy" algorithm: radial spacing: 100 {
    // Level detection still works with custom colors
    shape central as @circle label: "Strategy"
      fill:"#6366f1" strokeColor:"#4338ca"

    shape branch1 as @roundedRectangle label: "Branch 1"
      fill:"#10b981" strokeColor:"#059669"

    shape detail as @rectangle label: "Detail"
      fill:"#d1fae5" strokeColor:"#059669"

    central -> branch1
    branch1 -> detail
  }
}
```

## Technical Details

### Implementation

- **Location**: `packages/layout-base/src/elk-adapter.ts`
- **Functions**:
  - `calculateMindmapLevels()`: BFS-based level detection
  - `applyMindmapLevelStyling()`: Applies level-based defaults to `node.data`
- **Integration**: Automatically triggered when `algorithm: radial` is detected in container layout options

### Level Data

Each node gets a `mindmapLevel` property in its data:

```typescript
node.data.mindmapLevel = 0 | 1 | 2 | ...
```

This can be used by renderers or exporters for additional styling or metadata.

## Benefits

1. **No Manual Styling Required**: Hierarchy is visually clear automatically
2. **True Mindmap Structure**: Based on edges, not containers
3. **Flexible**: Works with any shape types
4. **Customizable**: Override defaults with inline properties
5. **Multi-Level**: Supports unlimited depth (3+ levels use level 2 styling)

## Migration from Container-Based Approach

### Old Approach (Nested Containers)

```runiq
container "Main" {
  shape central
  shape branch1

  container "Branch1Details" {
    shape detail1
    shape detail2
  }
}
```

### New Approach (Flat Structure with Edges)

```runiq
container "Main" algorithm: radial {
  shape central as @circle
  shape branch1 as @roundedRectangle
  shape detail1 as @rectangle
  shape detail2 as @rectangle

  central -> branch1
  branch1 -> detail1
  branch1 -> detail2
}
```

The new approach is simpler, more intuitive, and automatically styled!

## See Also

- [Mind Map Wikipedia](https://en.wikipedia.org/wiki/Mind_map)
- Examples: `examples/mindmaps/deep-multi-level.runiq`
- Examples: `examples/mindmaps/multi-level-mindmap.runiq`
