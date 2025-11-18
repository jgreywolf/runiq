---
title: List Glyphsets
description: Organized lists and styled item collections
lastUpdated: 2025-01-14
---

# List Glyphsets

List glyphsets create organized, styled lists perfect for features, benefits, key points, and visual galleries.

## Available List Glyphsets

### basicList

Simple vertical list with styled boxes.

**Parameters:**

- `item` (array, 2-10 items) - List items
- `theme` - Color theme

**Example:**

```runiq
glyphset basicList "Key Features" {
  item "Fast Performance"
  item "Easy to Use"
  item "Highly Scalable"
  item "Open Source"

  theme "professional"
}
```

### pictureList

List items with images or icons.

**Parameters:**

- `item` (array, 2-8 items) - Items with optional images
- `orientation` - "vertical" (default) or "horizontal"
- `theme` - Color theme

**Example:**

```runiq
glyphset pictureList "Team Members" {
  theme "professional"
  orientation "horizontal"

  image "https://i.pravatar.cc/150?img=1"
  image "https://i.pravatar.cc/150?img=2"
  image "https://i.pravatar.cc/150?img=3"

  // Data URLs are also supported for inline images
  image "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%234CAF50'/%3E%3C/svg%3E"
}

```

### framedPicture

Picture with decorative frame and label.

**Parameters:**

- `image` - Image reference
- `label` - Caption text
- `theme` - Color theme

**Example:**

```runiq
glyphset framedPicture "Product Screenshot" {
  image "dashboard.png"
  label "Beautiful Dashboard Interface"
  theme "ocean"
}
```

### pictureBlocks

Grid of picture blocks with labels.

**Parameters:**

- `block` (array, 2-9 blocks) - Picture blocks
- `columns` - Grid columns (default: 3)
- `theme` - Color theme

**Example:**

```runiq
 glyphset pictureBlocks "Key Benefits" {
    theme "professional"

    image "https://i.pravatar.cc/300?img=25" label "Premium Quality" description "Crafted from finest materials for lasting durability"
    image "https://i.pravatar.cc/300?img=26" label "Smart Technology" description "Integrated sensors and AI for optimal performance"
    image "https://i.pravatar.cc/300?img=27" label "Eco-Friendly" description "Sustainable design with minimal environmental impact"
  }
```

## Tips for List Glyphsets

### When to Use Lists

- **Features and benefits** → `basicList`
- **Team or product showcase** → `pictureList`, `pictureBlocks`
- **Single image highlight** → `framedPicture`

### Best Practices

1. **Parallel structure** - Keep items grammatically consistent
2. **Brief labels** - 3-5 words per item
3. **Logical order** - Most to least important, or chronological
4. **Visual consistency** - Use same theme across lists

## Next Steps

- [Process Glyphsets →](/guide/glyphsets-process)
- [Comparison Glyphsets →](/guide/glyphsets-comparison)
- [View All Glyphsets →](/guide/glyphsets)
