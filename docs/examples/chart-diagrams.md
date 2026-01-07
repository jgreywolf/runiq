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
    data:[
      {label:"North", value:450},
      {label:"South", value:380},
      {label:"East", value:520},
      {label:"West", value:410}
    ]
}
```

### Horizontal Bar Chart

Better for long category labels:

```runiq
diagram "Feature Adoption" {
  shape features as @barChart
    label:"Feature Usage"
    flipAxes:true
    data:[
      {label:"User Authentication", value:95},
      {label:"Dashboard Analytics", value:78},
      {label:"Export Reports", value:62},
      {label:"Team Collaboration", value:45}
    ]
}
```

### Grouped Bar Chart

Compare multiple series side-by-side:

```runiq
diagram "Revenue Comparison" {
  shape revenue as @barChart
    label:"Revenue: Actual vs Target"
    data:{
      labels:["Q1", "Q2", "Q3", "Q4"],
      series:[
        {name:"Actual", values:[450, 520, 480, 610]},
        {name:"Target", values:[400, 500, 550, 600]}
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
    stacked:true
    data:{
      labels:["Jan", "Feb", "Mar", "Apr"],
      series:[
        {name:"Electronics", values:[120, 140, 130, 150]},
        {name:"Clothing", values:[80, 90, 85, 95]},
        {name:"Home Goods", values:[60, 70, 75, 80]}
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
    data:[
      {label:"Chrome", value:65},
      {label:"Safari", value:19},
      {label:"Firefox", value:8},
      {label:"Edge", value:5},
      {label:"Other", value:3}
    ]
}
```

### Pie Chart with Custom Colors

```runiq
diagram "Budget Allocation" {
  shape budget as @pieChart
    label:"Annual Budget"
    data:[
      {label:"Engineering", value:450, fillColor:"#4299e1"},
      {label:"Sales", value:280, fillColor:"#48bb78"},
      {label:"Marketing", value:220, fillColor:"#ed8936"},
      {label:"Operations", value:180, fillColor:"#9f7aea"},
      {label:"Other", value:70, fillColor:"#a0aec0"}
    ]
}
```

## Line Charts

Line charts visualize trends and changes over time.

### Time Series Line Chart

```runiq
diagram "User Growth" {
  shape growth as @lineChart
    label:"Monthly Active Users"
    data:[
      {label:"Jan", value:1200},
      {label:"Feb", value:1450},
      {label:"Mar", value:1380},
      {label:"Apr", value:1620},
      {label:"May", value:1890},
      {label:"Jun", value:2100}
    ]
}
```

### Multi-Line Chart

Compare multiple metrics:

```runiq
diagram "Performance Metrics" {
  shape metrics as @lineChart
    label:"System Performance"
    data:{
      labels:["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
      series:[
        {name:"CPU %", values:[45, 38, 62, 78, 85, 52], fillColor:"#3b82f6"},
        {name:"Memory %", values:[58, 55, 68, 72, 80, 65], fillColor:"#10b981"},
        {name:"Disk %", values:[30, 28, 35, 42, 48, 38], fillColor:"#f59e0b"}
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
    data:{
      axes:[
        {label:"Frontend"},
        {label:"Backend"},
        {label:"DevOps"},
        {label:"Testing"},
        {label:"Database"}
      ],
      series:[
        {label:"Team A", values:[85, 72, 68, 90, 75], fillColor:"#3b82f6"},
        {label:"Team B", values:[70, 88, 82, 75, 85], fillColor:"#10b981"}
      ]
    }
    showLegend:true
}
```

## Sankey Diagrams

Sankey diagrams visualize flows and connections between nodes.

### Data Flow

```runiq
diagram "Website Traffic Flow" {
  shape traffic as @sankeyChart
    label:"User Journey"
    nodes:[
      {id:"homepage", label:"Homepage"},
      {id:"products", label:"Products"},
      {id:"cart", label:"Cart"},
      {id:"checkout", label:"Checkout"},
      {id:"complete", label:"Complete"}
    ]
    flows:[
      {from:"homepage", to:"products", value:1000},
      {from:"products", to:"cart", value:450},
      {from:"cart", to:"checkout", value:280},
      {from:"checkout", to:"complete", value:220}
    ]
}
```

### Resource Allocation

```runiq
diagram "Budget Flow" {
  shape budget as @sankeyChart
    label:"Budget Allocation"
    nodes:[
      {id:"revenue", label:"Total Revenue"},
      {id:"eng", label:"Engineering"},
      {id:"sales", label:"Sales"},
      {id:"ops", label:"Operations"},
      {id:"prod", label:"Product Dev"},
      {id:"infra", label:"Infrastructure"}
    ]
    flows:[
      {from:"revenue", to:"eng", value:450},
      {from:"revenue", to:"sales", value:280},
      {from:"revenue", to:"ops", value:180},
      {from:"eng", to:"prod", value:300},
      {from:"eng", to:"infra", value:150}
    ]
}
```

## Chart DSL Syntax

Runiq supports a chart-specific DSL for cleaner syntax:

### Simple Bar Chart (DSL)

```runiq
chart bar "Quarterly Sales" {
  data: [120, 150, 135, 180]
  labels: ["Q1", "Q2", "Q3", "Q4"]
  fillColor: "#4299e1"
}
```

### Grouped Bar Chart (DSL)

```runiq
chart bar "Revenue Comparison" {
  labels: ["Jan", "Feb", "Mar", "Apr"]
  series: [
    {name: "2024", values: [120, 140, 130, 150], fillColor: "#3b82f6"},
    {name: "2023", values: [100, 120, 115, 130], fillColor: "#10b981"}
  ]
}
```

### Pie Chart (DSL)

```runiq
chart pie "Market Share" {
  data: [
    {label: "Product A", value: 450},
    {label: "Product B", value: 320},
    {label: "Product C", value: 180}
  ]
  showPercentages: true
}
```

## Styling and Customization

### Custom Colors

```runiq
diagram "Custom Colors" {
  shape chart as @barChart
    data:[
      {label:"Category A", value:85, fillColor:"#4299e1"},
      {label:"Category B", value:72, fillColor:"#48bb78"},
      {label:"Category C", value:90, fillColor:"#ed8936"}
    ]
}
```

### Grid and Axes

```runiq
diagram "Styled Chart" {
  shape chart as @lineChart
    label:"Monthly Sales"
    data:[120, 145, 132, 168, 195, 210]
    labels:["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    showGrid:true
    gridColor:"#e2e8f0"
    axisColor:"#4a5568"
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
