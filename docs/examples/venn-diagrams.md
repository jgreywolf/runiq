---
title: Venn Diagram Examples
description: Complete examples of Venn diagrams for set overlap visualization
lastUpdated: 2025-11-17
---

# Venn Diagram Examples

This page demonstrates practical examples of Venn diagrams using Runiq's unified `@venn` shape with automatic circle detection.

## Two-Circle Examples

### Example 1: Skills Overlap

Basic two-circle Venn showing skill intersection:

```runiq
diagram "Skills Analysis" {
  shape skills as @venn
    label:"Developer Skills"
    data:[60, 40]
    labels:["Frontend", "Backend"]
    intersections:["Full Stack"]
}
```

### Example 2: Market Segmentation

Customer overlap between channels:

```runiq
diagram "Customer Channels" {
  shape channels as @venn
    label:"Customer Distribution"
    data:[450, 380]
    labels:["Online Store", "Physical Store"]
    colors:["#4299e1", "#48bb78"]
    intersections:["Omnichannel"]
}
```

### Example 3: Product Usage

```runiq
diagram "Product Adoption" {
  shape products as @venn
    label:"Product Usage"
    data:[500, 350]
    labels:["Product A", "Product B"]
    colors:["#2b6cb0", "#2f855a"]
    intersections:["Both Products"]
    fontSize: 15
    strokeWidth: 2.5
}
```

## Three-Circle Examples

### Example 4: Technology Stack

Three-circle Venn showing programming language overlap:

```runiq
diagram "Programming Languages" {
  shape languages as @venn
    label:"Developer Proficiency"
    data:[1200, 1000, 800]
    labels:["JavaScript", "Python", "Go"]
    colors:["#f0db4f", "#306998", "#00add8"]
    intersections:["JS+Py", "JS+Go", "Py+Go", "All Three"]
}
```

### Example 5: Feature Comparison

Product plan features:

```runiq
diagram "Subscription Plans" {
  shape plans as @venn
    label:"Feature Availability"
    data:[100, 200, 300]
    labels:["Basic", "Pro", "Enterprise"]
    colors:["#cbd5e0", "#4299e1", "#2c5aa0"]
    intersections:["Basic+Pro", "Basic+Ent", "Pro+Ent", "All Plans"]
    fontSize: 14
    strokeColor: "#2d3748"
    strokeWidth: 2
}
```

### Example 6: Team Structure

Organizational role overlap:

```runiq
diagram "Team Roles" {
  shape roles as @venn
    label:"Cross-Functional Teams"
    data:[80, 75, 70]
    labels:["Engineering", "Product", "Design"]
    colors:["#4299e1", "#48bb78", "#ed8936"]
    intersections:["Eng+Prod", "Eng+Design", "Prod+Design", "Full Team"]
    fontSize: 16
    fontFamily: "Inter, sans-serif"
    strokeWidth: 2.5
}
```

## Four-Circle Examples

### Example 7: Platform Coverage

Four-circle Venn for multi-platform analysis:

```runiq
diagram "Platform Support" {
  shape platforms as @venn
    label:"Platform Coverage"
    data:[350, 300, 400, 320]
    labels:["Web", "Mobile", "Desktop", "Cloud"]
    colors:["#4299e1", "#48bb78", "#ed8936", "#9f7aea"]
}
```

### Example 8: Technology Domains

```runiq
diagram "Tech Domains" {
  shape domains as @venn
    label:"Technology Expertise"
    data:[250, 220, 280, 200]
    labels:["Frontend", "Backend", "Database", "DevOps"]
    colors:["#f56565", "#4299e1", "#48bb78", "#ed8936"]
    fontSize: 13
    strokeWidth: 2
}
```

## Advanced Styling Examples

### Example 9: Custom Typography

```runiq
diagram "Styled Venn" {
  shape custom as @venn
    label:"Custom Typography"
    data:[100, 90, 80]
    labels:["Design", "Development", "Marketing"]
    colors:["#e53e3e", "#3182ce", "#38a169"]
    intersections:["Design+Dev", "Design+Mkt", "Dev+Mkt", "All Three"]
    fontSize: 18
    fontFamily: "Georgia, serif"
    strokeColor: "#1a202c"
    strokeWidth: 3
}
```

### Example 10: Semantic Color Coding

Using traffic light colors for status:

```runiq
diagram "Project Status" {
  shape status as @venn
    label:"Sprint Progress"
    data:[30, 50, 20]
    labels:["Blocked", "In Progress", "Complete"]
    colors:["#f56565", "#ed8936", "#48bb78"]
    intersections:["Review", "Testing", "Final Review", "All Clear"]
    fontSize: 14
    strokeColor: "#2d3748"
    strokeWidth: 2
    fontFamily: "Roboto, sans-serif"
}
```

## Real-World Use Cases

### Example 11: Browser Compatibility

```runiq
diagram "Browser Support" {
  shape browsers as @venn
    label:"Browser Feature Support"
    data:[95, 88, 85]
    labels:["Chrome", "Firefox", "Safari"]
    colors:["#4285f4", "#ff7139", "#006cff"]
    intersections:["Chrome+FF", "Chrome+Safari", "FF+Safari", "All Browsers"]
}
```

### Example 12: Skill Requirements Matrix

```runiq
diagram "Job Requirements" {
  shape requirements as @venn
    label:"Required Skills"
    data:[70, 65, 60]
    labels:["Frontend Engineer", "Backend Engineer", "Full Stack Engineer"]
    colors:["#f56565", "#4299e1", "#48bb78"]
    intersections:["FE+BE", "FE+FS", "BE+FS", "Universal Skills"]
    fontSize: 15
    strokeWidth: 2.5
    fontFamily: "Inter, sans-serif"
}
```

### Example 13: Market Analysis

```runiq
diagram "Customer Segments" {
  shape markets as @venn
    label:"Customer Distribution"
    data:[2000, 1500, 1200]
    labels:["Enterprise", "Mid-Market", "SMB"]
    colors:["#2c5aa0", "#4299e1", "#60a5fa"]
    intersections:["Ent+Mid", "Ent+SMB", "Mid+SMB", "All Segments"]
    fontSize: 16
    strokeColor: "#1a365d"
    strokeWidth: 3
}
```

### Example 14: Service Overlap

```runiq
diagram "Service Portfolio" {
  shape services as @venn
    label:"Service Offerings"
    data:[100, 120, 90, 80]
    labels:["Consulting", "Development", "Support", "Training"]
    colors:["#5a67d8", "#48bb78", "#ed8936", "#9f7aea"]
    fontSize: 14
    strokeColor: "#2d3748"
    strokeWidth: 2
}
```

## Complex Data Scenarios

### Example 15: Using Object Format

Alternative data format with inline labels:

```runiq
diagram "Object Format Example" {
  shape objectFormat as @venn
    label:"Browser Market Share"
    data:[65, 18, 5]
    labels:["Chrome", "Safari", "Edge"]
    colors:["#4285f4", "#006cff", "#0078d4"]
    intersections:["Chrome+Safari", "Chrome+Edge", "Safari+Edge", "All Browsers"]
}
```

### Example 16: Minimal Example

Simplest possible Venn diagram:

```runiq
diagram "Minimal" {
  shape minimal as @venn
    data:[50, 50]
    labels:["A", "B"]
}
```

### Example 17: Maximum Detail

Fully specified with all options:

```runiq
diagram "Maximum Detail" {
  shape maxDetail as @venn
    label:"Comprehensive Example"
    data:[1000, 900, 850, 800]
    labels:["Frontend", "Backend", "Mobile", "Cloud"]
    colors:["#f56565", "#4299e1", "#48bb78", "#ed8936"]
    strokeColor: "#1a202c"
    strokeWidth: 3
    fontSize: 16
    fontFamily: "Inter, -apple-system, sans-serif"
}
```

## Tips for Effective Venn Diagrams

### Tip 1: Keep Proportions Reasonable

```runiq
# ✅ Good: Similar magnitudes
diagram "Good Proportions" {
  shape good as @venn
    data:[45, 50, 55]
    labels:["Small", "Medium", "Large"]
}

# ❌ Avoid: Extreme differences
diagram "Bad Proportions" {
  shape bad as @venn
    data:[5, 500, 1000]
    labels:["Tiny", "Large", "Huge"]
}
```

### Tip 2: Use Descriptive Labels

```runiq
# ✅ Good: Clear labels
diagram "Clear Labels" {
  shape clear as @venn
    label:"Frontend Frameworks"
    data:[65, 45]
    labels:["React Ecosystem", "Vue Ecosystem"]
    intersections:["Shared Concepts"]
}

# ❌ Avoid: Generic labels
diagram "Generic Labels" {
  shape generic as @venn
    label:"Comparison"
    data:[50, 50]
    labels:["Option 1", "Option 2"]
}
```

## Related Examples

- [Pyramid Diagram Examples](/examples/pyramid-diagrams) - Hierarchical data visualization
- [Data Flow Diagram Examples](/examples/dfd-diagrams) - Process flow visualization
- [Mindmap Examples](/examples/mindmap-diagrams) - Concept mapping

## Resources

- [Venn Diagram Guide](/guide/venn-diagrams) - Complete documentation
- [DSL Reference](/reference/dsl) - Syntax details
- [Styling Guide](/guide/styling) - Advanced styling techniques
