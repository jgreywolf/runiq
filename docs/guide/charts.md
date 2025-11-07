---
title: Charts & Graphs
---

# Charts & Graphs

Create data visualization diagrams including pie charts, bar charts, Venn diagrams, and pyramids with Runiq's diagram profile.

## Overview

Runiq provides specialized chart shapes for data visualization and conceptual diagrams. These charts are declarative and integrate seamlessly with other diagram elements.

## Key Shapes

- **Pie Chart**: `@pieChart` - Circular sector chart
- **Bar Chart**: `@barChart` - Vertical or horizontal bars (use `flipAxes:true` for horizontal)
- **Line Chart**: `@lineChart` - Time series and trend lines
- **Radar Chart**: `@radarChart` - Multi-dimensional spider chart
- **Pyramid**: `@pyramid` - Hierarchical pyramid
- **Venn 2**: `@venn2` - Two-circle Venn diagram
- **Venn 3**: `@venn3` - Three-circle Venn diagram
- **Venn 4**: `@venn4` - Four-circle Venn diagram

See the [Shape Reference - Chart Shapes](/reference/shapes#_7-chart-shapes-7-shapes) for the complete list.

> **💡 Data-Driven Charts:** All charts now support data upload from JSON/CSV files in the editor! Simply drag and drop your data file, and the editor will automatically inject it into your chart with proper labels and values.
>
> **💡 DSL Simplification Note:** When using the Runiq DSL syntax, use simple data arrays for chart properties. Complex features like boolean toggles (`showGrid:true`), nested objects, or multi-series data work best with JSON import or programmatic generation. For basic charts, keep it simple:
>
> ```runiq
> shape chart as @lineChart label:"Sales" data:[45, 52, 48, 61]
> shape chart as @barChart label:"Revenue" data:[120, 150, 180] flipAxes:true
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

Bar charts can be displayed vertically (default) or horizontally using the `flipAxes` property.

### Vertical Bar Chart (Default)

```runiq
diagram "Quarterly Revenue" {
  direction TB

  shape chart as @barChart
    label:"Revenue ($M)"
    data:[120, 150, 180, 210]
    labels:["Q1", "Q2", "Q3", "Q4"]
    colors:["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]
}
```

### Horizontal Bar Chart

Use `flipAxes:true` to create horizontal bars:

```runiq
diagram "Team Performance" {
  direction LR

  shape chart as @barChart
    label:"Tasks Completed"
    data:[85, 92, 78, 88]
    labels:["Frontend", "Backend", "DevOps", "QA"]
    colors:["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"]
    flipAxes:true
}
```

### Simple Array Format

For quick charts, use simple arrays (auto-generated labels):

```runiq
shape sales as @barChart
  label:"Monthly Sales"
  data:[45, 52, 48, 61, 58, 67]
```

### With Custom Labels and Colors

```runiq
shape performance as @barChart
  label:"Q4 Performance"
  data:[88, 92, 85, 90]
  labels:["Quality", "Speed", "Reliability", "Security"]
  colors:["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"]
```

### Grouped Bar Chart (Advanced)

For complex multi-series data, use JSON format:

```runiq
diagram "Product Comparison" {
  direction TB

  shape chart as @barChart label: "Features by Product"
    data: {
      groups: [
        {
          label: "Basic",
          values: [10, 5]
        },
        {
          label: "Pro",
          values: [25, 15]
        },
        {
          label: "Enterprise",
          values: [50, 40]
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
    shape revenue as @barChart label:"Revenue" data:[120, 150, 180, 210]
    shape market as @pieChart label:"Market Share" data:[30, 20, 50]
    shape conversion as @pyramid label:"Conversion Funnel"
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

Charts accept data in multiple formats for flexibility:

### Simple Arrays (Recommended for DSL)

Most straightforward for inline definitions:

```runiq
# Just values - auto-generated labels
data:[45, 52, 48, 61]

# With custom labels
data:[45, 52, 48, 61]
labels:["Q1", "Q2", "Q3", "Q4"]

# With colors per point
data:[45, 52, 48, 61]
labels:["Q1", "Q2", "Q3", "Q4"]
colors:["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"]
```

### JSON Format (Recommended for Uploads)

Best for data files and programmatic generation:

```typescript
// Bar Chart
{
  values: [
    { label: "A", value: 30 },
    { label: "B", value: 45 }
  ]
}

// Line Chart
{
  series: [{
    label: "Revenue",
    values: [45, 52, 48, 61],
    color: "#3b82f6"
  }]
}

// Radar Chart
{
  axes: [
    { label: "Speed", max: 100 },
    { label: "Power", max: 100 }
  ],
  series: [{
    label: "Character",
    values: [80, 90],
    color: "#ef4444"
  }]
}
```

### Data Upload (Editor Feature)

Drag and drop JSON or CSV files into the editor to automatically populate charts with labels and values!

## Line Charts ⭐

Line charts visualize trends over time with connected data points. Supports custom labels, per-point colors, and axis flipping.

### Basic Line Chart

Simple time series data:

```runiq
diagram "Sales Performance" {
  shape sales as @lineChart
    label:"Monthly Sales"
    data:[45, 52, 48, 61, 58, 65, 72, 68, 75, 80, 78, 85]
}
```

### With Custom Labels

Display meaningful labels on the X-axis:

```runiq
shape sales as @lineChart
  label:"2024 Sales"
  data:[45000, 52000, 48000, 61000, 58000, 67000]
  labels:["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
```

### With Per-Point Colors ⭐ NEW

Color each data point individually:

```runiq
shape trends as @lineChart
  label:"Temperature"
  data:[22, 24, 26, 28, 30, 29, 27]
  labels:["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  colors:["#3b82f6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#f59e0b", "#10b981"]
```

### Horizontal Line Chart ⭐ NEW

Use `flipAxes:true` to create horizontal line charts:

```runiq
shape performance as @lineChart
  label:"Performance Metrics"
  data:[85, 92, 78, 88, 95]
  labels:["Speed", "Accuracy", "Efficiency", "Quality", "Reliability"]
  flipAxes:true
```

### Features

- **Auto-scaling axes** with 10% Y-axis padding
- **Grid lines** (toggleable with `showGrid`)
- **Data point markers** (toggleable with `showMarkers`)
- **Custom labels** via `labels:[]` array
- **Per-point colors** via `colors:[]` array ⭐ NEW
- **Horizontal orientation** via `flipAxes:true` ⭐ NEW
- **Multiple series support** with custom colors (JSON format)
- **Legend** for multi-series charts (toggle with `showLegend`)

### Data Formats

**Simple array** (auto-indexed X values):

```runiq
data:[45, 52, 48, 61, 58, 65]
```

**With labels** (recommended):

```runiq
data:[45, 52, 48, 61]
labels:["Q1", "Q2", "Q3", "Q4"]
```

**With colors per point** (NEW):

```runiq
data:[45, 52, 48, 61]
labels:["Q1", "Q2", "Q3", "Q4"]
colors:["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"]
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

### Properties

| Property      | Type         | Default         | Description                    |
| ------------- | ------------ | --------------- | ------------------------------ |
| `label`       | string       | -               | Chart title                    |
| `data`        | array/object | -               | Data values (required)         |
| `labels`      | string[]     | auto-generated  | Custom X-axis labels ⭐ NEW    |
| `colors`      | string[]     | default palette | Per-point marker colors ⭐ NEW |
| `flipAxes`    | boolean      | false           | Horizontal orientation ⭐ NEW  |
| `showGrid`    | boolean      | true            | Show grid lines                |
| `showMarkers` | boolean      | true            | Show data point markers        |
| `showLegend`  | boolean      | false           | Show legend (multi-series)     |

### Dimensions

- Fixed size: 400×300 pixels
- Legend adds 150px width when enabled
- 4 anchor points: N, E, S, W

## Radar Charts ⭐

Radar (spider) charts display multi-dimensional data on radial axes. Supports custom labels and per-point colors.

### Basic Radar Chart

Simple skill assessment:

```runiq
diagram "Character Skills" {
  shape skills as @radarChart
    label:"RPG Character Stats"
    data:[90, 70, 40, 50, 60]
}
```

### With Custom Labels

Display meaningful axis labels instead of generic "Axis 1", "Axis 2":

```runiq
shape skills as @radarChart
  label:"Team Skills"
  data:[85, 72, 90, 78, 82]
  labels:["JavaScript", "TypeScript", "React", "Node.js", "Testing"]
```

### With Per-Point Colors ⭐ NEW

Color each data point individually:

```runiq
shape performance as @radarChart
  label:"Q1 Performance"
  data:[88, 92, 85, 90]
  labels:["Quality", "Speed", "Reliability", "Security"]
  colors:["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"]
  showLegend:true
```

### Features

- **Minimum 3 axes** required for valid radar chart
- **Radial grid circles** (toggleable with `showGrid`, configurable levels)
- **Data point markers** (toggleable with `showMarkers`)
- **Custom axis labels** via `labels:[]` array ⭐ NEW
- **Per-point colors** via `colors:[]` array ⭐ NEW
- **Multiple series overlay** with transparency
- **Auto-scaling** or explicit max values per axis
- **Legend** for comparing multiple datasets

### Data Formats

**Simple array** (auto-numbered axes):

```runiq
data:[90, 70, 40, 50, 60]
```

**With labels** (recommended):

```runiq
data:[90, 70, 40, 50, 60]
labels:["Strength", "Dexterity", "Intelligence", "Wisdom", "Charisma"]
```

**With colors per point** (NEW):

```runiq
data:[88, 92, 85, 90]
labels:["Quality", "Speed", "Reliability", "Security"]
colors:["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"]
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

| Property      | Type         | Default         | Description                    |
| ------------- | ------------ | --------------- | ------------------------------ |
| `label`       | string       | -               | Chart title                    |
| `data`        | array/object | -               | Data values (required)         |
| `labels`      | string[]     | auto-generated  | Custom axis labels ⭐ NEW      |
| `colors`      | string[]     | default palette | Per-point marker colors ⭐ NEW |
| `showGrid`    | boolean      | true            | Show grid circles              |
| `showMarkers` | boolean      | true            | Show data point markers        |
| `showLegend`  | boolean      | false           | Show legend (multi-series)     |
| `gridLevels`  | number       | 4               | Number of grid circles         |

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
- **Bar charts** ⭐ UPDATED
  - Vertical bars (default)
  - Horizontal bars (`flipAxes:true`)
  - Grouped and stacked bars
  - With custom labels and colors
- **Line charts** ⭐ UPDATED
  - Simple monthly sales
  - Performance trends with labels
  - Per-point colors for highlighting
  - Horizontal orientation (`flipAxes:true`)
- **Radar charts** ⭐ UPDATED
  - Character skill stats with labels
  - System performance metrics
  - Per-point colored data points
  - Product quality scores
  - Tech stack comparison
- Venn diagrams (2, 3, 4 sets)
- Pyramids and funnels

## Related

- [Shape Reference - Chart Shapes](/reference/shapes#_7-chart-shapes-7-shapes)
- [Styling](/guide/styling)
- [Containers](/guide/containers)

## Resources

- [Chart Design Best Practices](https://www.interaction-design.org/literature/article/best-practices-for-data-visualization)
- [Color Schemes for Data Visualization](https://colorbrewer2.org/)
- [Accessible Colors](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html)
