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
  theme professional
  quadrant "Do First: Urgent & Important"
  quadrant "Schedule: Important, Not Urgent"
  quadrant "Delegate: Urgent, Not Important"
  quadrant "Eliminate: Neither"

   horizontalAxis "Urgency"
  verticalAxis "Importance"
  theme professional
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
  quadrant "Low/Low"
  quadrant "Low/Med"
  quadrant "Low/High"
  quadrant "Med/Low"
  quadrant "Med/Med"
  quadrant "Med/High"
  quadrant "High/Low"
  quadrant "High/Med"
  quadrant "High/High"

  horizontalAxis "Probability"
  verticalAxis "Impact"
  theme sunset
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
glyphset segmentedMatrix "Market Segments" {
   theme forest
  quadrant "Enterprise\nPremium"
  quadrant "Enterprise\nStandard"
  quadrant "SMB\nPremium"
  quadrant "SMB\nStandard"
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
glyphset titledMatrix "Vendor Evaluation (3x3)" {
   theme forest
  quadrant "$$"
  quadrant "$$$"
  quadrant "$"
  quadrant "Good"
  quadrant "Excellent"
  quadrant "Fair"
  quadrant "24/7"
  quadrant "Business Hrs"
  quadrant "24/7"
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
- [List Glyphsets →](/guide/glyphsets-list)
- [Visualization Glyphsets →](/guide/glyphsets-visualization)
- [Hierarchy Glyphsets →](/guide/glyphsets-hierarchy)
- [Relationship Glyphsets →](/guide/glyphsets-relationship)
- [Glyphset Themes Reference →](/reference/glyphset-themes)
- [Try the Online Editor →](https://editor.runiq.org)
