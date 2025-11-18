---
title: Comparison Glyphsets
description: Matrices and comparative analysis diagrams
lastUpdated: 2025-01-14
---

# Comparison Glyphsets

Comparison glyphsets help visualize contrasts, trade-offs, and multi-dimensional analysis.

## Available Comparison Glyphsets

### matrix

2×2 comparison matrix (4 quadrants).

**Parameters:**

- `quadrant` (exactly 4) - Quadrant labels
- `horizontalAxis` - X-axis label
- `verticalAxis` - Y-axis label
- `theme` - Color theme

**Example:**

```runiq
glyphset matrix "Eisenhower Matrix" {
  theme "professional"
  quadrant "Do First: Urgent & Important"
  quadrant "Schedule: Important, Not Urgent"
  quadrant "Delegate: Urgent, Not Important"
  quadrant "Eliminate: Neither"

   horizontalAxis "Urgency"
  verticalAxis "Importance"
  theme "professional"
}
```

**Common Use Cases:**

- Eisenhower matrix (priorities)
- SWOT analysis
- Risk assessment
- Feature prioritization

### matrix3x3

3×3 comparison grid (9 cells).

**Parameters:**

- `cell` (exactly 9) - Cell labels (left-to-right, top-to-bottom)
- `horizontalAxis` - X-axis label
- `verticalAxis` - Y-axis label
- `theme` - Color theme

**Example:**

```runiq
glyphset matrix3x3 "Risk Matrix" {
  cell "Low/Low"
  cell "Low/Med"
  cell "Low/High"
  cell "Med/Low"
  cell "Med/Med"
  cell "Med/High"
  cell "High/Low"
  cell "High/Med"
  cell "High/High"

  horizontalAxis "Probability"
  verticalAxis "Impact"
  theme "sunset"
}
```

### segmentedMatrix

Matrix with multiple sections and subsections.

**Parameters:**

- `section` (2-4 sections) - Major sections
- `subsection` - Items within sections
- `theme` - Color theme

**Example:**

```runiq
glyphset segmentedMatrix "Product Roadmap" {
  section "Q1" {
    subsection "Feature A"
    subsection "Feature B"
  }
  section "Q2" {
    subsection "Feature C"
    subsection "Feature D"
  }

  theme "ocean"
}
```

### titledMatrix

Matrix with titled rows/columns.

**Parameters:**

- `row` (2-4 rows) - Row titles
- `column` (2-4 columns) - Column titles
- `theme` - Color theme

**Example:**

```runiq
glyphset titledMatrix "Feature Comparison" {
  row "Basic Plan"
  row "Pro Plan"
  row "Enterprise Plan"

  column "Users"
  column "Storage"
  column "Support"

  theme "forest"
}
```

## Tips for Comparison Glyphsets

### Choosing the Right Matrix

- **2×2 decisions** → `matrix`
- **3×3 analysis** → `matrix3x3`
- **Time-based comparison** → `segmentedMatrix`
- **Feature comparison** → `titledMatrix`

### Best Practices

1. **Clear axes** - Label dimensions clearly
2. **Distinct quadrants** - Make categories mutually exclusive
3. **Balanced content** - Similar detail level in each cell
4. **Color coding** - Use themes to indicate priority/severity

### When to Use Diagram Profiles Instead

Switch to diagram profiles for:

- Complex decision trees
- Multi-level hierarchies
- Detailed flowcharts with conditions

## Next Steps

- [Process Glyphsets →](/guide/glyphsets-process)
- [Relationship Glyphsets →](/guide/glyphsets-relationship)
- [View All Glyphsets →](/guide/glyphsets)
