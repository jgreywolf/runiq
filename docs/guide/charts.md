---
title: Charts & Graphs
description: Create data visualizations with bar charts, line charts, pie charts, ring charts, scatter charts, radar charts, Venn diagrams, and force-directed network graphs.
lastUpdated: 2025-01-09
---

# Charts & Graphs

Create data visualization diagrams including pie charts, ring charts, scatter charts, bar charts, Venn diagrams, and pyramids with Runiq's diagram profile.

## Overview

Runiq provides specialized chart shapes for data visualization and conceptual diagrams. These charts are declarative and integrate seamlessly with other diagram elements.

## Key Shapes

- **Pie Chart**: `@pieChart` - Circular sector chart
- **Ring Chart**: `@ringChart` - Donut-style proportional chart
- **Bar Chart**: `@barChart` - Vertical or horizontal bars (use `flipAxes:true` for horizontal)
- **Scatter Chart**: `@scatterChart` - X/Y point plotting with optional labels
- **Line Chart**: `@lineChart` - Time series and trend lines
- **Radar Chart**: `@radarChart` - Multi-dimensional spider chart
- **Pyramid**: `@pyramid` - Hierarchical pyramid
- **Venn 2**: `@venn` - Two-circle Venn diagram

See the [Shape Reference - Chart Shapes](/reference/shapes#_7-chart-shapes-7-shapes) for the complete list.

> **💡 Data-Driven Charts:** All charts now support data upload from JSON/CSV files in the editor! Simply drag and drop your data file, and the editor will automatically inject it into your chart with proper labels and values.
>
> **💡 DSL Simplification Note:** When using the Runiq DSL syntax, use simple data arrays for chart properties. Complex features like boolean toggles (`showGrid:true`), nested objects, or multi-series data work best with JSON import or programmatic generation. For basic charts, keep it simple:
>
> ```runiq
> shape chart as @lineChart label:"Sales" data:[45, 52, 48, 61]
> shape chart as @barChart label:"Revenue" data:[120, 150, 180] flipAxes:true
> ```

### Data Sources in DSL

You can declare inline JSON or CSV data sources in the DSL and bind them to chart shapes:

```runiq
diagram "Sales Metrics" {
  datasource "csv" key:metrics from:"id,label,value\nm1,Q1,120\nm2,Q2,150"
  shape sales as @barChart label:"Quarterly Sales" from:metrics
}
```

For structured chart data (like Sankey), use `data use` + `map ... as ...` to normalize fields before rendering. See [Data-Driven Diagrams](/reference/data-driven) and [Sankey Diagrams](/guide/sankey-diagrams).

## Pie Charts ⭐

Pie charts visualize proportional data as colored slices. Supports custom labels, colors, legends, and titles.

### Basic Pie Chart

Simple proportional data with auto-generated labels:

```runiq
diagram "Market Share" {
  shape chart as @pieChart
    label:"Browser Market"
    data:[45, 30, 15, 10]
}
```

### With Custom Labels ⭐ NEW

Display meaningful slice labels instead of generic "Slice 1", "Slice 2":

```runiq
diagram "Budget Breakdown" {
  shape budget as @pieChart
    label:"Monthly Budget"
    data:[30, 25, 20, 15, 10]
    labels:["Rent", "Food", "Transport", "Entertainment", "Savings"]
}
```

### With Custom Colors ⭐ NEW

Color each slice individually:

```runiq
diagram "Product Sales" {
  shape sales as @pieChart
  label:"Sales by Product"
  data:[35, 28, 18, 12, 7]
  labels:["Chrome", "Safari", "Edge", "Firefox", "Other"]
  colors:["#4285F4", "#000000", "#0078D7", "#FF7139", "#9E9E9E"]
}
```

### Full-Featured with Legend

```runiq
diagram "Market Share" {
  shape market_share as @pieChart
  label:"Browser Market Share 2024"
  data:[35, 28, 18, 12, 7]
  labels:["Chrome", "Safari", "Edge", "Firefox", "Other"]
  colors:["#4285F4", "#000000", "#0078D7", "#FF7139", "#9E9E9E"]
  showLegend:true
  legendPosition:"bottom"
}
```

### Features

- **Auto-percentage calculation** from raw values
- **Legend support** (right, left, top, bottom positions)
- **Custom labels** via `labels:[]` array ⭐ NEW
- **Custom colors** via `colors:[]` array ⭐ NEW
- **Value filtering** (auto-removes zero/negative values)

### Properties

| Property         | Type         | Default   | Description                              |
| ---------------- | ------------ | --------- | ---------------------------------------- |
| `label`          | string       | -         | Chart title (displayed above chart)      |
| `data`           | array/object | -         | Slice values (required)                  |
| `labels`         | string[]     | generated | Custom slice labels ⭐ NEW               |
| `colors`         | string[]     | palette   | Custom slice colors                      |
| `showLegend`     | boolean      | false     | Show legend                              |
| `legendPosition` | string       | "right"   | Legend placement (right/left/top/bottom) |

## Ring Charts

Ring charts use the same proportional model as pie charts, but leave an empty center so the chart reads better in dashboards and summary views.

### Basic Ring Chart

```runiq
diagram "Revenue Mix" {
  shape revenue as @ringChart
    label:"Revenue Mix"
    data:[42, 38, 20]
    labels:["Services", "Subscriptions", "Support"]
}
```

### Custom Inner Radius

Use `innerRadius` to control how thick or thin the ring should be. Values typically work best between `0.45` and `0.75`.

```runiq
diagram "Operating Margin" {
  shape margin as @ringChart
    label:"Operating Margin"
    data:[72, 28]
    labels:["Healthy", "At Risk"]
    innerRadius:0.68
}
```

### Ring Chart Properties

Ring charts support the same `data`, `labels`, `colors`, `showLegend`, and `legendPosition` options as pie charts, plus:

| Property      | Type   | Default | Description                          |
| ------------- | ------ | ------- | ------------------------------------ |
| `innerRadius` | number | `0.58`  | Relative donut hole size (0.05-0.85) |

### Dimensions

- Fixed size: 400×300 pixels
- Legend adds space based on position
- 4 anchor points: N, E, S, W

## Bar Charts

Bar charts can be displayed vertically (default) or horizontally using the `flipAxes` property.

### Vertical Bar Chart (Default)

```runiq
diagram "Quarterly Revenue" {
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
diagram "Quarterly Sales by Product - Grouped" {

  shape sales as @barChart label:"Q1-Q4 Sales by Product Category" data:[
    {"label":"Q1","values":[120,85,95]},
    {"label":"Q2","values":[150,110,105]},
    {"label":"Q3","values":[135,95,115]},
    {"label":"Q4","values":[180,130,140]}
  ]
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
  shape options as @scatterChart label:"Cost vs Latency" data:[{"x":20,"y":120},{"x":55,"y":60},{"x":80,"y":210}]
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

  shape chart1 as @pieChart
    label:"Modern Pie"
    data:[60, 40]
    labels:["A", "B"]
    colors:["#3b82f6", "#10b981"]
    strokeColor:"#3b82f6"
    strokeWidth:2

  shape chart2 as @barChart
    label:"Revenue"
    data:[30, 50, 70]
    colors:["#3b82f6", "#10b981", "#ed8936"]
}
```

## Scatter Charts

Scatter charts plot independent points on numeric X and Y axes. They work well for portfolio comparisons, benchmarking, cost-versus-performance analysis, and other relationship-based datasets.

### Basic Scatter Chart

```runiq
diagram "Cost vs Latency" {
  shape options as @scatterChart
    label:"Cost vs Latency"
    data:[{"x":20,"y":120,"label":"Option A"},{"x":55,"y":60,"label":"Option B"},{"x":80,"y":210,"label":"Option C"}]
    showPointLabels:true
}
```

### Multi-Series Scatter Chart

```runiq
diagram "Current vs Target" {
  shape compare as @scatterChart
    label:"Current vs Target"
    data:{
      showLegend:true,
      series:[
        {label:"Current", points:[{x:15,y:40},{x:25,y:58}]},
        {label:"Target", points:[{x:45,y:22},{x:60,y:30}]}
      ]
    }
}
```

### Scatter Chart Properties

| Property          | Type      | Default | Description                                |
| ----------------- | --------- | ------- | ------------------------------------------ |
| `data`            | array     | -       | Array of points or `series` object         |
| `showGrid`        | boolean   | true    | Show X/Y grid lines                        |
| `showLegend`      | boolean   | false   | Show series legend                         |
| `showPointLabels` | boolean   | false   | Show labels next to individual data points |
| `colors`          | string[]  | palette | Series or point colors                     |
| `labels`          | string[]  | -       | Fallback point labels                      |

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

## Comparison with Other Tools

How do Runiq charts compare to other diagramming tools?

| Feature                      | Runiq | Mermaid | Lucidchart | Draw.io | D3.js |
| ---------------------------- | ----- | ------- | ---------- | ------- | ----- |
| **Text-Based DSL**           | ✅    | ✅      | ❌         | ❌      | ❌    |
| **Version Control Friendly** | ✅    | ✅      | ✅         | ❌      | ❌    |
| **Pie Charts**               | ✅    | ✅      | ✅         | ✅      | ✅    |
| **Bar Charts**               | ✅    | ❌      | ✅         | ✅      | ✅    |
| **Line Charts**              | ✅    | ✅      | ✅         | ✅      | ✅    |
| **Radar Charts**             | ✅    | ✅      | ✅         | ✅      | ✅    |
| **Venn Diagrams**            | ✅    | ❌      | ✅         | ✅      | ✅    |
| **Pyramids**                 | ✅    | ❌      | ✅         | ✅      | ✅    |
| **Custom Labels**            | ✅    | ✅      | ✅         | ✅      | ✅    |
| **Per-Point Colors**         | ✅    | ❌      | ✅         | ✅      | ✅    |
| **CSV/JSON Import**          | ✅    | ❌      | ✅         | ✅      | ✅    |
| **Multi-Series**             | ✅    | ✅      | ✅         | ✅      | ✅    |
| **Integrated Diagrams**      | ✅    | ✅      | ✅         | ✅      | ❌    |
| **Auto-Layout**              | ✅    | ✅      | ✅         | ❌      | ❌    |
| **Learning Curve**           | Low   | Low     | Med        | Low     | High  |

**Key Advantages of Runiq:**

- **Unified language** - Charts use the same DSL as all other diagram types
- **Seamless integration** - Combine charts with flowcharts, architecture diagrams, etc.
- **Simple syntax** - No complex configuration objects or API calls
- **Data flexibility** - Simple arrays for DSL, complex objects for JSON imports
- **Modern features** - Per-point colors, axis flipping, custom labels out of the box
- **Extensible** - Add custom chart types via the shape system

**When to Use Alternatives:**

- **Mermaid**: Quick markdown-native charts when you only need the limited built-in set
- **Lucidchart**: Collaborative visual editing for business users who prefer a GUI
- **Draw.io**: Free drag-and-drop charting in mixed office environments
- **D3.js**: Fully custom interactive data visualization in web applications

## Examples

See the [Charts examples](/examples/chart-diagrams) for more

## Related

- [Shape Reference - Chart Shapes](/reference/shapes#_7-chart-shapes-7-shapes)
- [Venn Diagrams](/guide/venn-diagrams) - Detailed guide with set theory examples
- [Pyramid Diagrams](/guide/pyramid-diagrams) - Hierarchies and conversion funnels
- [Sankey Diagrams](/guide/sankey-diagrams) - Flow and energy diagrams
- [Styling](/guide/styling)
- [Containers](/guide/containers)

## Resources

- [Chart Design Best Practices](https://www.interaction-design.org/literature/article/best-practices-for-data-visualization)
- [Color Schemes for Data Visualization](https://colorbrewer2.org/)
- [Accessible Colors](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html)
