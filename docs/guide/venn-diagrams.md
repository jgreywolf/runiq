---
title: Venn Diagrams
description: Create data-driven Venn diagrams for set overlap analysis with automatic circle detection.
lastUpdated: 2025-11-17
---

# Venn Diagrams

Venn diagrams visualize logical relationships between sets, showing overlaps and intersections. Runiq provides a unified Venn diagram shape that automatically adapts to 2, 3, or 4 circles based on your data.

## Quick Start

### Two-Circle Venn Diagram

```runiq
diagram "Skills Overlap" {
  shape overlapChart as @venn
    label:"Skills Overlap"
    data:[60, 40]
    labels:["Frontend", "Backend"]
}
```

**Output**: Two overlapping circles showing Frontend and Backend skill areas with automatic overlap visualization.

### Three-Circle Venn Diagram

```runiq
diagram "Technology Stack" {
  shape stack as @venn
    label:"Technology Stack"
    data:[50, 45, 40]
    labels:["JavaScript", "Python", "Go"]
    colors:["#4299e1", "#48bb78", "#ed8936"]
}
```

**Output**: Three overlapping circles in a triangular arrangement showing relationships between three programming languages.

### Four-Circle Venn Diagram

```runiq
diagram "Platform Coverage" {
  shape coverage as @venn
    label:"Platform Coverage"
    data:[35, 30, 40, 32]
    labels:["Web", "Mobile", "Desktop", "Cloud"]
    colors:["#4299e1", "#48bb78", "#ed8936", "#9f7aea"]
}
```

**Output**: Four overlapping circles in a 2x2 grid showing relationships across multiple platforms.

## The Venn Shape

| Shape   | Description                                      | Supported Configurations         |
| ------- | ------------------------------------------------ | -------------------------------- |
| `@venn` | Unified Venn diagram (auto-detects circle count) | 2, 3, or 4 circles based on data |

The shape automatically determines the number of circles based on the length of your `data` array:

- 2 elements → 2-circle Venn
- 3 elements → 3-circle Venn
- 4 elements → 4-circle Venn

## Core Features

### 1. Auto-Detection of Circle Count

The `@venn` shape automatically detects whether to render 2, 3, or 4 circles:

```runiq
diagram "Auto Detection Examples" {
  # 2 circles (horizontal layout)
  shape twoCircle as @venn
    label:"Design vs Development"
    data:[45, 55]
    labels:["UX Design", "Frontend Dev"]

  # 3 circles (triangular layout)
  shape threeCircle as @venn
    label:"Full Stack Skills"
    data:[40, 35, 45]
    labels:["Frontend", "Backend", "DevOps"]

  # 4 circles (2x2 grid layout)
  shape fourCircle as @venn
    label:"Platform Coverage"
    data:[30, 35, 40, 32]
    labels:["Web", "Mobile", "Desktop", "Cloud"]
}
```

### 2. Intersection Labels

Add labels to overlap regions to show shared characteristics:

**Two-Circle with Intersection:**

```runiq
shape skills as @venn
  label:"Skills Overlap"
  data:[60, 40]
  labels:["Frontend", "Backend"]
  intersections:["Full Stack"]
```

**Three-Circle with All Intersections:**

```runiq
shape stack as @venn
  label:"Technology Stack"
  data:[50, 45, 40]
  labels:["JavaScript", "Python", "Go"]
  intersections:["JS+Py", "JS+Go", "Py+Go", "All Three"]
```

**Intersection Array Format:**

- **2-circle**: `[AB]` (1 intersection)
- **3-circle**: `[AB, AC, BC, ABC]` (4 intersections)
- **4-circle**: `[AB, AC, AD, BC, BD, CD, ABC, ABD, ACD, BCD, ABCD]` (11 intersections)

### 3. Custom Styling

Full control over colors, stroke, and labels:

```runiq
shape colors as @venn
  label:"Primary Colors"
  data:[100, 100, 100]
  labels:["Red", "Blue", "Yellow"]
  colors:["#ff0000", "#0000ff", "#ffff00"]
  stroke:"#000"
  strokeWidth:3
  fontSize:16
  fontFamily:"Georgia, serif"
```

**Available Style Properties:**

- `stroke`: Border color (default: `#000000`)
- `strokeWidth`: Border thickness (default: `2`)
- `fontSize`: Label text size (default: `14`)
- `fontFamily`: Font family (default: `Arial, sans-serif`)

## Common Patterns

### Business Analysis

```runiq
diagram "Market Segments" {
  shape mSegments as @venn
    label:"Market Segments"
    data:[40, 60]
    labels:["Enterprise", "SMB"]
    colors:["#2c5aa0", "#48bb78"]
    intersections:["Hybrid"]
}
```

### Feature Comparison

```runiq
diagram "Product Tiers" {
  shape tiers as @venn
    label:"Product Features"
    data:[45, 50, 55]
    labels:["Basic Plan", "Pro Plan", "Enterprise"]
    colors:["#cbd5e0", "#4299e1", "#2c5aa0"]
    intersections:["Basic+Pro", "Basic+Ent", "Pro+Ent", "All Plans"]
}
```

### Skill Mapping

```runiq
diagram "Developer Roles" {
  shape roles as @venn
    label:"Developer Skills"
    data:[60, 50, 45]
    labels:["Frontend", "Backend", "DevOps"]
    colors:["#f56565", "#4299e1", "#48bb78"]
    intersections:["Full Stack", "Backend+Ops", "Front+Ops", "Unicorn"]
}
```

### Four-Way Analysis

```runiq
diagram "Multi-Platform" {
  shape platforms as @venn
    label:"Platform Coverage"
    data:[35, 30, 40, 32]
    labels:["Web", "Mobile", "Desktop", "Cloud"]
    colors:["#4299e1", "#48bb78", "#ed8936", "#9f7aea"]
}
```

## Best Practices

### 1. Choose the Right Circle Count

- **2-circle**: Binary comparisons, skill overlaps, before/after scenarios
- **3-circle**: Multi-way comparisons, feature matrices, role overlaps
- **4-circle**: Complex multi-dimensional comparisons, platform coverage

Avoid using more than 4 circles as the diagram becomes difficult to interpret.

### 2. Use Meaningful Labels

```runiq
# ✅ Good: Clear, descriptive labels
shape good as @venn
  label:"Frontend Frameworks"
  data:[65, 45]
  labels:["React Ecosystem", "Vue Ecosystem"]
  intersections:["Shared Concepts"]

# ❌ Avoid: Generic labels
shape bad as @venn
  label:"Comparison"
  data:[50, 50]
  labels:["A", "B"]
```

### 3. Consider Color Semantics

```runiq
# Traffic light metaphor for status
shape status as @venn
  label:"Project Status"
  data:[30, 50, 20]
  labels:["Blocked", "In Progress", "Complete"]
  colors:["#f56565", "#ed8936", "#48bb78"]

# Brand colors for products
shape products as @venn
  label:"Product Overlap"
  data:[40, 45]
  labels:["Product A", "Product B"]
  colors:["#1e40af", "#059669"]
```

### 4. Add Intersection Labels When Meaningful

Only add intersection labels when the overlap represents something specific:

```runiq
# ✅ Good: Meaningful intersection
shape meaningful as @venn
  label:"Team Structure"
  data:[50, 60]
  labels:["Engineering", "Product"]
  intersections:["Product Engineers"]

# ❌ Avoid: Generic intersection
shape generic as @venn
  label:"Sets"
  data:[50, 60]
  labels:["Set A", "Set B"]
  intersections:["Both"]
```

### 5. Keep Data Values Proportional

While the circles don't scale perfectly to data values, maintain reasonable proportions:

```runiq
# ✅ Good: Similar magnitudes
shape proportional as @venn
  data:[45, 50, 55]
  labels:["Small", "Medium", "Large"]

# ❌ Avoid: Extreme differences
shape disproportionate as @venn
  data:[10, 500, 1000]
  labels:["Tiny", "Large", "Huge"]
```

## Advanced Examples

### Market Segmentation with Detailed Intersections

```runiq
diagram "Market Analysis" {
  shape market as @venn
    label:"Customer Segments"
    data:[1200, 950, 800]
    labels:["Enterprise", "Mid-Market", "SMB"]
    colors:["#2c5aa0", "#4299e1", "#60a5fa"]
    intersections:["Enterprise+Mid", "Enterprise+SMB", "Mid+SMB", "All Segments"]
    fontSize:15
    strokeWidth:2.5
}
```

### Technology Stack Analysis

```runiq
diagram "Tech Stack" {
  shape stack as @venn
    label:"Development Technologies"
    data:[80, 75, 70, 65]
    labels:["Languages", "Frameworks", "Tools", "Cloud"]
    colors:["#4299e1", "#48bb78", "#ed8936", "#9f7aea"]
    stroke:"#2d3748"
    strokeWidth:2
    fontSize:14
    fontFamily:"Inter, sans-serif"
}
```

### Skill Overlap with Custom Styling

```runiq
diagram "Skills Matrix" {
  shape skills as @venn
    label:"Developer Competencies"
    data:[90, 85, 80]
    labels:["Frontend", "Backend", "Database"]
    colors:["#f56565", "#4299e1", "#48bb78"]
    intersections:["Full Stack Web", "API Dev", "Data Layer", "Complete Stack"]
    stroke:"#1a202c"
    strokeWidth:3
    fontSize:16
    fontFamily:"Roboto, sans-serif"
}
```

## Reference

### Data Properties

| Property        | Type                     | Description                        | Required      |
| --------------- | ------------------------ | ---------------------------------- | ------------- |
| `data`          | `number[]` or `object[]` | Values for each circle (2-4 items) | Yes           |
| `labels`        | `string[]`               | Labels for each circle             | Conditional\* |
| `colors`        | `string[]`               | Custom colors (hex/rgb)            | No            |
| `intersections` | `string[]`               | Labels for overlap regions         | No            |

\* Required if using simple array format for `data`; optional if using object format with inline labels.

### Style Properties

| Property      | Type     | Default             | Description      |
| ------------- | -------- | ------------------- | ---------------- |
| `stroke`      | `string` | `#000000`           | Border color     |
| `strokeWidth` | `number` | `2`                 | Border thickness |
| `fontSize`    | `number` | `14`                | Label text size  |
| `fontFamily`  | `string` | `Arial, sans-serif` | Font family      |

### Default Colors

If no colors are specified, Runiq uses a default palette:

- Circle 1: `#4299e1` (Blue)
- Circle 2: `#48bb78` (Green)
- Circle 3: `#ed8936` (Orange)
- Circle 4: `#9f7aea` (Purple)

### Intersection Array Formats

**2-Circle Venn:**

```typescript
intersections: [AB];
```

- `AB`: Intersection of circles A and B

**3-Circle Venn:**

```typescript
intersections: [AB, AC, BC, ABC];
```

- `AB`: Intersection of A and B only
- `AC`: Intersection of A and C only
- `BC`: Intersection of B and C only
- `ABC`: Intersection of all three circles

**4-Circle Venn:**

```typescript
intersections: [AB, AC, AD, BC, BD, CD, ABC, ABD, ACD, BCD, ABCD];
```

- Pairwise: `AB, AC, AD, BC, BD, CD` (6 intersections)
- Triple: `ABC, ABD, ACD, BCD` (4 intersections)
- Quadruple: `ABCD` (1 intersection)

## Examples

See the [Venn Diagram Examples](/examples/venn-diagrams) page for more complete examples including:

- Market segmentation analysis
- Skill overlap visualization
- Feature comparison matrices
- Multi-platform coverage maps
- Technology stack relationships

## Comparison with Other Tools

| Feature                      | Runiq          | Mermaid        | PlantUML       | Lucidchart  | Creately   | SmartDraw    | Canva     | Venny      |
| ---------------------------- | -------------- | -------------- | -------------- | ----------- | ---------- | ------------ | --------- | ---------- |
| **2-circle Venn**            | ✅             | ❌             | ❌             | ✅          | ✅         | ✅           | ✅        | ✅         |
| **3-circle Venn**            | ✅             | ❌             | ❌             | ✅          | ✅         | ✅           | ✅        | ✅         |
| **4-circle Venn**            | ✅             | ❌             | ❌             | ✅          | ⚠️ Limited | ✅           | ✅        | ✅         |
| **5+ circle Venn**           | ❌             | ❌             | ❌             | ✅          | ⚠️ Limited | ✅           | ✅        | ✅         |
| **Data-driven values**       | ✅             | ❌             | ❌             | ⚠️ Manual   | ⚠️ Manual  | ⚠️ Manual    | ⚠️ Manual | ✅         |
| **Intersection labels**      | ✅             | ❌             | ❌             | ✅          | ✅         | ✅           | ✅        | ✅         |
| **Custom colors**            | ✅             | ❌             | ❌             | ✅          | ✅         | ✅           | ✅        | ⚠️ Limited |
| **Statistical analysis**     | ❌             | ❌             | ❌             | ❌          | ❌         | ❌           | ❌        | ✅         |
| **Text-based DSL**           | ✅             | ❌             | ❌             | ❌          | ❌         | ❌           | ❌        | ⚠️ CSV     |
| **Version control friendly** | ✅             | ❌             | ❌             | ⚠️ Partial  | ❌         | ❌           | ❌        | ⚠️ Partial |
| **Auto-layout**              | ✅             | ❌             | ❌             | ❌          | ❌         | ⚠️ Templates | ❌        | ✅         |
| **Documentation generation** | ✅             | ❌             | ❌             | ⚠️ Partial  | ❌         | ❌           | ❌        | ❌         |
| **Export formats**           | SVG, PNG       | SVG, PNG       | SVG, PNG       | Multiple    | PDF, Image | PDF, Image   | Multiple  | PNG, SVG   |
| **Learning curve**           | Low            | Low            | Medium         | Low         | Low        | Low          | Very Low  | Very Low   |
| **Cost**                     | Free           | Free           | Free           | Paid        | Free/Paid  | Paid         | Free/Paid | Free       |
| **Platform**                 | Cross-platform | Cross-platform | Cross-platform | Web/Desktop | Web        | Windows/Mac  | Web       | Web        |

**Key Advantages of Runiq:**

- **Auto-Detection**: Single `@venn` shape automatically handles 2/3/4 circles
- **Version Control**: Track set relationship changes in Git
- **Data-Driven**: Specify values programmatically from analytics or surveys
- **Documentation**: Natural integration with technical and research documentation

**When to Use Alternatives:**

- **Venny**: Bioinformatics and statistical analysis with set operations
- **Canva**: Presentation-quality graphics with extensive design options
- **Lucidchart**: Real-time collaboration and 5+ circle complex Venns
- **SmartDraw**: Business templates with drag-and-drop simplicity

## Next Steps

- Explore [Pyramid Diagrams](/guide/pyramid-diagrams) for hierarchical data
- Learn about [Data Flow Diagrams](/guide/dfd-diagrams) for process visualization
- Check the [DSL Reference](/reference/dsl) for complete syntax details
