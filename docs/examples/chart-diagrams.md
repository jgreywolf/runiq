---
title: Chart Diagram Examples
description: Data visualization with bar charts, pie charts, line charts, radar charts, and sankey diagrams
lastUpdated: 2025-01-21
---

# Chart Diagram Examples

Charts are essential tools for data visualization, making complex data easy to understand at a glance. Runiq supports bar charts, pie charts, line charts, radar charts, sankey diagrams, and more for business reports, presentations, and analytics dashboards.

## Bar Charts

Bar charts compare categorical data using rectangular bars.

### Vertical Bar Chart

Basic column chart for comparing values:

```runiq
diagram "Sales Performance" {
  shape sales as @barChart
    label:"Q4 Sales by Region"
    data:[450, 380, 520, 410]
    labels:["North", "South", "East", "West"]
}
```

### Horizontal Bar Chart

Better for long category labels:

```runiq
diagram "Feature Adoption" {
  shape features as @barChart
    label:"Feature Usage"
    flipAxes:true
    data:[95, 78, 62, 45]
    labels:["User Authentication", "Dashboard Analytics", "Export Reports", "Team Collaboration"]
}
```

### Grouped Bar Chart

Compare multiple series side-by-side:

```runiq
diagram "Revenue Comparison" {
  shape revenue as @barChart
    label:"Revenue: Actual vs Target"
}
```

Multi-series charts are best driven from JSON data. Use the Data Panel in the editor or an external JSON file:

```json
{
  "revenue": {
    "labels": ["Q1", "Q2", "Q3", "Q4"],
    "series": [
      { "name": "Actual", "values": [450, 520, 480, 610] },
      { "name": "Target", "values": [400, 500, 550, 600] }
    ]
  }
}
```

### Stacked Bar Chart

Show part-to-whole relationships:

```runiq
diagram "Sales Breakdown" {
  shape breakdown as @barChart
    label:"Sales by Product Category"
}
```

Stacked data is also provided via JSON:

```json
{
  "breakdown": {
    "stacked": true,
    "labels": ["Jan", "Feb", "Mar", "Apr"],
    "series": [
      { "name": "Electronics", "values": [120, 140, 130, 150] },
      { "name": "Clothing", "values": [80, 90, 85, 95] },
      { "name": "Home Goods", "values": [60, 70, 75, 80] }
    ]
  }
}
```

## Pie Charts

Pie charts show proportions and percentages.

### Basic Pie Chart

```runiq
diagram "Market Share" {
  shape market as @pieChart
    label:"Browser Market Share"
    data:[65, 19, 8, 5, 3]
    labels:["Chrome", "Safari", "Firefox", "Edge", "Other"]
}
```

### Pie Chart with Custom Colors

```runiq
diagram "Budget Allocation" {
  shape budget as @pieChart
    label:"Annual Budget"
    data:[450, 280, 220, 180, 70]
    labels:["Engineering", "Sales", "Marketing", "Operations", "Other"]
    colors:["#4299e1", "#48bb78", "#ed8936", "#9f7aea", "#a0aec0"]
}
```

## Line Charts

Line charts visualize trends and changes over time.

### Time Series Line Chart

```runiq
diagram "User Growth" {
  shape growth as @lineChart
    label:"Monthly Active Users"
    data:[1200, 1450, 1380, 1620, 1890, 2100]
    labels:["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
}
```

### Multi-Line Chart

Compare multiple metrics:

```runiq
diagram "Performance Metrics" {
  shape metrics as @lineChart
    label:"System Performance"
}
```

Multi-line data should be supplied via JSON:

```json
{
  "metrics": {
    "labels": ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
    "series": [
      { "name": "CPU %", "values": [45, 38, 62, 78, 85, 52], "color": "#3b82f6" },
      { "name": "Memory %", "values": [58, 55, 68, 72, 80, 65], "color": "#10b981" },
      { "name": "Disk %", "values": [30, 28, 35, 42, 48, 38], "color": "#f59e0b" }
    ]
  }
}
```

## Radar Charts

Radar (spider) charts display multi-dimensional data on radial axes.

### Skills Assessment

```runiq
diagram "Developer Skills" {
  shape skills as @radarChart
    label:"Full Stack Developer Profile"
    data:[90, 85, 78, 82, 88, 75, 92]
    labels:["JavaScript", "TypeScript", "React", "Node.js", "SQL", "Docker", "Git"]
}
```

### Team Comparison

```runiq
diagram "Team Capabilities" {
  shape comparison as @radarChart
    label:"Development Team Skills"
}
```

Multi-series radar data should be provided via JSON:

```json
{
  "comparison": {
    "axes": ["Frontend", "Backend", "DevOps", "Testing", "Database"],
    "series": [
      { "label": "Team A", "values": [85, 72, 68, 90, 75], "color": "#3b82f6" },
      { "label": "Team B", "values": [70, 88, 82, 75, 85], "color": "#10b981" }
    ],
    "showLegend": true
  }
}
```

## Sankey Diagrams

Sankey diagrams visualize flows and connections between nodes.

### Data Flow

```runiq
diagram "Website Traffic Flow" {
  shape traffic as @sankeyChart
    label:"User Journey"
}
```

Provide Sankey data via JSON:

```json
{
  "traffic": {
    "nodes": [
      { "id": "homepage", "label": "Homepage" },
      { "id": "products", "label": "Products" },
      { "id": "cart", "label": "Cart" },
      { "id": "checkout", "label": "Checkout" },
      { "id": "complete", "label": "Complete" }
    ],
    "links": [
      { "source": "homepage", "target": "products", "value": 1000 },
      { "source": "products", "target": "cart", "value": 450 },
      { "source": "cart", "target": "checkout", "value": 280 },
      { "source": "checkout", "target": "complete", "value": 220 }
    ]
  }
}
```

### Resource Allocation

```runiq
diagram "Budget Flow" {
  shape budget as @sankeyChart
    label:"Budget Allocation"
}
```

```json
{
  "budget": {
    "nodes": [
      { "id": "revenue", "label": "Total Revenue" },
      { "id": "eng", "label": "Engineering" },
      { "id": "sales", "label": "Sales" },
      { "id": "ops", "label": "Operations" },
      { "id": "prod", "label": "Product Dev" },
      { "id": "infra", "label": "Infrastructure" }
    ],
    "links": [
      { "source": "revenue", "target": "eng", "value": 450 },
      { "source": "revenue", "target": "sales", "value": 280 },
      { "source": "revenue", "target": "ops", "value": 180 },
      { "source": "eng", "target": "prod", "value": 300 },
      { "source": "eng", "target": "infra", "value": 150 }
    ]
  }
}
```

## Chart DSL Syntax

Runiq currently uses the standard diagram syntax for charts. For complex multi-series data, use JSON import.

### Simple Bar Chart

```runiq
diagram "Quarterly Sales" {
  shape sales as @barChart
    data:[120, 150, 135, 180]
    labels:["Q1", "Q2", "Q3", "Q4"]
    fillColor:"#4299e1"
}
```

## Styling and Customization

### Custom Colors

```runiq
diagram "Custom Colors" {
  shape chart as @barChart
    data:[85, 72, 90]
    labels:["Category A", "Category B", "Category C"]
    colors:["#4299e1", "#48bb78", "#ed8936"]
}
```

### Grid and Axes

```runiq
diagram "Styled Chart" {
  shape chart as @lineChart
    label:"Monthly Sales"
    data:[120, 145, 132, 168, 195, 210]
    labels:["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
}
```

## Use Cases

### Business Reporting

- Revenue and sales analysis
- KPI dashboards
- Performance metrics
- Financial statements

### Project Management

- Progress tracking
- Resource utilization
- Timeline milestones
- Team capacity

### Data Analysis

- Trend analysis
- Comparative studies
- Distribution analysis
- Correlation visualization

### Presentations

- Executive summaries
- Quarterly reviews
- Strategy presentations
- Stakeholder reports

## Best Practices

1. **Choose the Right Chart Type**:
   - Bar charts for comparisons
   - Line charts for trends over time
   - Pie charts for proportions (max 6-7 slices)
   - Radar charts for multi-dimensional comparisons
   - Sankey for flows and processes

2. **Keep It Simple**:
   - Limit data points to avoid clutter
   - Use clear, concise labels
   - Avoid 3D effects and excessive styling

3. **Use Color Effectively**:
   - Use brand colors for consistency
   - Ensure sufficient contrast
   - Use color-blind friendly palettes
   - Highlight important data with accent colors

4. **Label Clearly**:
   - Always include a descriptive title
   - Label axes with units
   - Show data values when space allows
   - Include a legend for multiple series

5. **Consider Your Audience**:
   - Match detail level to audience expertise
   - Use familiar chart types
   - Provide context and comparisons
   - Tell a story with your data

## Chart Types Summary

| Chart Type      | Best For                     | Data Shape                   |
| --------------- | ---------------------------- | ---------------------------- |
| **Bar Chart**   | Comparing categories         | Categorical with values      |
| **Pie Chart**   | Part-to-whole (< 7 slices)   | Categories with percentages  |
| **Line Chart**  | Trends over time             | Sequential data points       |
| **Radar Chart** | Multi-dimensional comparison | Multiple metrics per item    |
| **Sankey**      | Flows and processes          | Source-target-value triplets |

## Next Steps

- See [Venn Diagrams](/examples/venn-diagrams) for set overlaps
- Check [Pyramid Diagrams](/examples/pyramid-diagrams) for hierarchical data
- Explore [Timeline Diagrams](/examples/timeline-diagrams) for chronological data
- Browse the [examples/charts](https://github.com/anthropics/runiq/tree/main/examples/charts) directory for more examples
