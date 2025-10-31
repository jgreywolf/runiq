---
title: Charts & Graphs
---

# Charts & Graphs

Create data visualization diagrams including pie charts, bar charts, Venn diagrams, and pyramids with Runiq's diagram profile.

## Overview

Runiq provides specialized chart shapes for data visualization and conceptual diagrams. These charts are declarative and integrate seamlessly with other diagram elements.

## Key Shapes

- **Pie Chart**: `@pieChart` - Circular sector chart
- **Bar Chart Vertical**: `@barChartVertical` - Vertical bars
- **Bar Chart Horizontal**: `@barChartHorizontal` - Horizontal bars
- **Pyramid**: `@pyramid` - Hierarchical pyramid
- **Venn 2**: `@venn2` - Two-circle Venn diagram
- **Venn 3**: `@venn3` - Three-circle Venn diagram
- **Venn 4**: `@venn4` - Four-circle Venn diagram

See the [Shape Reference - Chart Shapes](/reference/shapes#_7-chart-shapes-7-shapes) for the complete list.

## Pie Charts

Simple pie chart showing proportions:

```runiq
diagram "Market Share Q4" {
  direction TB

  shape chart as @pieChart label: "Market Share" 
    data: {
      segments: [
        { label: "Product A", value: 45, fill: "#3b82f6" },
        { label: "Product B", value: 30, fill: "#10b981" },
        { label: "Product C", value: 15, fill: "#f59e0b" },
        { label: "Others", value: 10, fill: "#6b7280" }
      ]
    }
}
```

With legend:

```runiq
diagram "Sales by Region" {
  direction LR

  shape chart as @pieChart label: "Regional Sales"
    data: {
      segments: [
        { label: "North America", value: 40, fill: "#3b82f6" },
        { label: "Europe", value: 35, fill: "#10b981" },
        { label: "Asia Pacific", value: 20, fill: "#f59e0b" },
        { label: "Other", value: 5, fill: "#6b7280" }
      ],
      showLegend: true,
      showLabels: true
    }
}
```

## Bar Charts

Vertical bar chart:

```runiq
diagram "Quarterly Revenue" {
  direction TB

  shape chart as @barChartVertical label: "Revenue ($M)"
    data: {
      bars: [
        { label: "Q1", value: 120, fill: "#3b82f6" },
        { label: "Q2", value: 150, fill: "#10b981" },
        { label: "Q3", value: 180, fill: "#f59e0b" },
        { label: "Q4", value: 210, fill: "#ef4444" }
      ],
      showValues: true
    }
}
```

Horizontal bar chart:

```runiq
diagram "Team Performance" {
  direction LR

  shape chart as @barChartHorizontal label: "Tasks Completed"
    data: {
      bars: [
        { label: "Frontend", value: 85, fill: "#3b82f6" },
        { label: "Backend", value: 92, fill: "#10b981" },
        { label: "DevOps", value: 78, fill: "#f59e0b" },
        { label: "QA", value: 88, fill: "#8b5cf6" }
      ],
      showValues: true,
      showGrid: true
    }
}
```

Grouped bar chart:

```runiq
diagram "Product Comparison" {
  direction TB

  shape chart as @barChartVertical label: "Features by Product"
    data: {
      groups: [
        { 
          label: "Basic", 
          bars: [
            { series: "Features", value: 10, fill: "#3b82f6" },
            { series: "Integrations", value: 5, fill: "#10b981" }
          ]
        },
        { 
          label: "Pro", 
          bars: [
            { series: "Features", value: 25, fill: "#3b82f6" },
            { series: "Integrations", value: 15, fill: "#10b981" }
          ]
        },
        { 
          label: "Enterprise", 
          bars: [
            { series: "Features", value: 50, fill: "#3b82f6" },
            { series: "Integrations", value: 40, fill: "#10b981" }
          ]
        }
      ],
      showLegend: true
    }
}
```

## Venn Diagrams

Two-set Venn diagram:

```runiq
diagram "Skills Overlap" {
  direction TB

  shape venn as @venn2 label: "Developer Skills"
    data: {
      setA: { label: "Frontend", fill: "#3b82f6", opacity: 0.5 },
      setB: { label: "Backend", fill: "#10b981", opacity: 0.5 },
      intersection: { label: "Full Stack", value: "30%" }
    }
}
```

Three-set Venn diagram:

```runiq
diagram "Project Requirements" {
  direction TB

  shape venn as @venn3 label: "Feasibility Analysis"
    data: {
      setA: { label: "Desirable", fill: "#3b82f6", opacity: 0.4 },
      setB: { label: "Viable", fill: "#10b981", opacity: 0.4 },
      setC: { label: "Feasible", fill: "#f59e0b", opacity: 0.4 },
      center: { label: "Sweet Spot", fill: "#ef4444" }
    }
}
```

Four-set Venn diagram:

```runiq
diagram "Team Responsibilities" {
  direction TB

  shape venn as @venn4 label: "Department Overlap"
    data: {
      setA: { label: "Engineering", fill: "#3b82f6", opacity: 0.3 },
      setB: { label: "Product", fill: "#10b981", opacity: 0.3 },
      setC: { label: "Design", fill: "#f59e0b", opacity: 0.3 },
      setD: { label: "Marketing", fill: "#8b5cf6", opacity: 0.3 }
    }
}
```

## Pyramids

Hierarchical pyramid:

```runiq
diagram "Organizational Hierarchy" {
  direction TB

  shape pyramid as @pyramid label: "Company Structure"
    data: {
      levels: [
        { label: "Executive", value: 5, fill: "#dc2626" },
        { label: "Directors", value: 15, fill: "#f59e0b" },
        { label: "Managers", value: 50, fill: "#3b82f6" },
        { label: "Individual Contributors", value: 200, fill: "#10b981" }
      ],
      showLabels: true,
      showValues: true
    }
}
```

Process funnel:

```runiq
diagram "Sales Funnel" {
  direction TB

  shape funnel as @pyramid label: "Lead to Customer"
    data: {
      levels: [
        { label: "Leads", value: 1000, fill: "#3b82f6", percentage: "100%" },
        { label: "Qualified", value: 500, fill: "#10b981", percentage: "50%" },
        { label: "Proposals", value: 200, fill: "#f59e0b", percentage: "20%" },
        { label: "Customers", value: 50, fill: "#ef4444", percentage: "5%" }
      ],
      showLabels: true,
      showValues: true,
      showPercentages: true
    }
}
```

## Integration with Diagrams

Charts can be combined with other diagram elements:

```runiq
diagram "Dashboard Overview" {
  direction TB

  shape title as @textBlock label: "Q4 Business Metrics"
  
  container metrics as @systemBoundary label: "Key Performance Indicators" {
    shape revenue as @barChartVertical label: "Revenue"
    shape market as @pieChart label: "Market Share"
    shape conversion as @pyramid label: "Conversion Funnel"
  }

  shape analysis as @rectangle label: "Detailed Analysis Report"

  title -> metrics
  metrics -> analysis
}
```

## Styling

Customize chart appearance:

```runiq
diagram "Styled Charts" {
  direction LR

  shape chart1 as @pieChart label: "Modern Style"
    fill: "#ffffff"
    stroke: "#3b82f6"
    strokeWidth: 2
    data: {
      segments: [
        { value: 60, fill: "#3b82f6" },
        { value: 40, fill: "#10b981" }
      ]
    }

  shape chart2 as @barChartVertical label: "Gradient Style"
    fill: "#f0f9ff"
    stroke: "#1e40af"
    data: {
      bars: [
        { value: 30, fill: "linear-gradient(#3b82f6, #1e40af)" },
        { value: 50, fill: "linear-gradient(#10b981, #059669)" }
      ]
    }
}
```

## Best Practices

1. **Choose appropriate chart type**
   - Pie charts: Proportions of a whole (< 7 segments)
   - Bar charts: Comparisons across categories
   - Venn diagrams: Set relationships and overlaps
   - Pyramids: Hierarchies or funnels

2. **Use color effectively**
   - Consistent color schemes
   - Sufficient contrast
   - Colorblind-friendly palettes

3. **Label clearly**
   - Always include chart titles
   - Add axis labels for bar charts
   - Show percentages or values when helpful

4. **Keep it simple**
   - Limit to 5-7 categories in pie charts
   - Use grouped bars for multi-series data
   - Avoid 3D effects

5. **Provide context**
   - Include units (%, $, count)
   - Add legends when needed
   - Show data sources

## Data Formats

Charts accept data in JSON format:

```typescript
// Pie Chart
{
  segments: Array<{ label: string, value: number, fill: string }>,
  showLegend?: boolean,
  showLabels?: boolean,
  showPercentages?: boolean
}

// Bar Chart
{
  bars: Array<{ label: string, value: number, fill: string }>,
  showValues?: boolean,
  showGrid?: boolean,
  orientation?: "vertical" | "horizontal"
}

// Venn Diagram
{
  setA: { label: string, fill: string, opacity: number },
  setB: { label: string, fill: string, opacity: number },
  setC?: { label: string, fill: string, opacity: number },
  setD?: { label: string, fill: string, opacity: number },
  intersection?: { label: string, value?: string }
}

// Pyramid
{
  levels: Array<{ label: string, value: number, fill: string }>,
  showLabels?: boolean,
  showValues?: boolean
}
```

## Examples

See the [examples/charts](https://github.com/jgreywolf/runiq/tree/main/examples/charts) directory for complete examples:

- Simple pie chart
- Labeled pie chart
- Pie chart with legend
- Vertical bar chart
- Horizontal bar chart
- Grouped bar charts
- Venn diagrams (2, 3, 4 sets)

## Related

- [Shape Reference - Chart Shapes](/reference/shapes#_7-chart-shapes-7-shapes)
- [Styling](/guide/styling)
- [Containers](/guide/containers)

## Resources

- [Chart Design Best Practices](https://www.interaction-design.org/literature/article/best-practices-for-data-visualization)
- [Color Schemes for Data Visualization](https://colorbrewer2.org/)
- [Accessible Colors](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html)
