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
- **Line Chart**: `@lineChart` - Time series and trend lines
- **Radar Chart**: `@radarChart` - Multi-dimensional spider chart

See the [Shape Reference - Chart Shapes](/reference/shapes#_7-chart-shapes-7-shapes) for the complete list.

> **💡 DSL Simplification Note:** When using the Runiq DSL syntax, use simple data arrays for chart properties. Complex features like boolean toggles (`showGrid:true`), nested objects, or multi-series data work best with JSON import or programmatic generation. For basic charts, keep it simple:
>
> ```runiq
> shape chart as @lineChart label:"Sales" data:[45, 52, 48, 61]
> ```

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

## Line Charts ⭐ NEW

Line charts visualize trends over time with connected data points.

### Basic Line Chart

Simple time series data:

```runiq
diagram "Sales Performance" {
  shape sales as @lineChart label:"Monthly Sales" data:[45, 52, 48, 61, 58, 65, 72, 68, 75, 80, 78, 85]
}
```

### Features

- **Auto-scaling axes** with 10% Y-axis padding
- **Grid lines** (toggleable with `showGrid`)
- **Data point markers** (toggleable with `showMarkers`)
- **Multiple series support** with custom colors
- **Legend** for multi-series charts (toggle with `showLegend`)

### Data Formats

**Simple array** (auto-indexed X values):

```runiq
data:[45, 52, 48, 61, 58, 65]
```

**Structured series** (for programmatic/JSON use):

```json
{
  "series": [
    {
      "label": "Revenue",
      "values": [45, 52, 48, 61],
      "color": "#3b82f6"
    }
  ],
  "showGrid": true,
  "showMarkers": true,
  "showLegend": true
}
```

**Points with labels** (for programmatic/JSON use):

```json
{
  "points": [
    { "x": 0, "y": 72, "label": "Mon" },
    { "x": 1, "y": 75, "label": "Tue" }
  ]
}
```

### Properties

| Property      | Type         | Default         | Description                |
| ------------- | ------------ | --------------- | -------------------------- |
| `label`       | string       | -               | Chart title                |
| `data`        | array/object | -               | Data values (required)     |
| `showGrid`    | boolean      | true            | Show grid lines            |
| `showMarkers` | boolean      | true            | Show data point markers    |
| `showLegend`  | boolean      | false           | Show legend (multi-series) |
| `colors`      | string[]     | default palette | Custom color array         |

### Dimensions

- Fixed size: 400×300 pixels
- Legend adds 150px width when enabled
- 4 anchor points: N, E, S, W

## Radar Charts ⭐ NEW

Radar (spider) charts display multi-dimensional data on radial axes.

### Basic Radar Chart

Simple skill assessment:

```runiq
diagram "Character Skills" {
  shape skills as @radarChart label:"RPG Character Stats" data:[90, 70, 40, 50, 60]
}
```

### Features

- **Minimum 3 axes** required for valid radar chart
- **Radial grid circles** (toggleable with `showGrid`, configurable levels)
- **Data point markers** (toggleable with `showMarkers`)
- **Multiple series overlay** with transparency
- **Auto-scaling** or explicit max values per axis
- **Legend** for comparing multiple datasets

### Data Formats

**Simple array** (auto-numbered axes):

```runiq
data:[90, 70, 40, 50, 60]
```

**Structured with axis labels** (for programmatic/JSON use):

```json
{
  "axes": [
    { "label": "Strength", "max": 100 },
    { "label": "Dexterity", "max": 100 },
    { "label": "Intelligence", "max": 100 }
  ],
  "series": [
    {
      "label": "Warrior",
      "values": [90, 70, 40],
      "color": "#ef4444"
    }
  ],
  "showGrid": true,
  "showMarkers": true,
  "gridLevels": 5
}
```

**Multiple series comparison** (for programmatic/JSON use):

```json
{
  "axes": [{ "label": "Speed" }, { "label": "Power" }, { "label": "Defense" }],
  "series": [
    { "label": "Hero A", "values": [80, 90, 70], "color": "#3b82f6" },
    { "label": "Hero B", "values": [60, 70, 95], "color": "#10b981" }
  ],
  "showLegend": true
}
```

### Properties

| Property      | Type         | Default         | Description                |
| ------------- | ------------ | --------------- | -------------------------- |
| `label`       | string       | -               | Chart title                |
| `data`        | array/object | -               | Data values (required)     |
| `showGrid`    | boolean      | true            | Show grid circles          |
| `showMarkers` | boolean      | true            | Show data point markers    |
| `showLegend`  | boolean      | false           | Show legend (multi-series) |
| `gridLevels`  | number       | 4               | Number of grid circles     |
| `colors`      | string[]     | default palette | Custom color array         |

### Dimensions

- Fixed size: 400×400 pixels
- 4 anchor points: N, E, S, W

### Use Cases

- **Skill assessments** - Character stats, competency matrices
- **Product comparisons** - Multi-attribute feature analysis
- **Performance metrics** - System monitoring, KPIs
- **Technology evaluation** - Framework comparisons, tech stack assessment

## Examples

See the [examples/charts](https://github.com/jgreywolf/runiq/tree/main/examples/charts) directory for complete examples:

- Simple pie chart
- Labeled pie chart
- Pie chart with legend
- Vertical bar chart
- Horizontal bar chart
- Grouped bar charts
- **Line charts** ⭐ NEW
  - Simple monthly sales
  - Performance trends
  - Temperature data with points
- **Radar charts** ⭐ NEW
  - Character skill stats
  - System performance metrics
  - Product quality scores
  - Tech stack comparison
- Venn diagrams (2, 3, 4 sets)

## Related

- [Shape Reference - Chart Shapes](/reference/shapes#_7-chart-shapes-7-shapes)
- [Styling](/guide/styling)
- [Containers](/guide/containers)

## Resources

- [Chart Design Best Practices](https://www.interaction-design.org/literature/article/best-practices-for-data-visualization)
- [Color Schemes for Data Visualization](https://colorbrewer2.org/)
- [Accessible Colors](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html)
