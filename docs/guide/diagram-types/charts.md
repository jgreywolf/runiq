---
title: Charts & Graphs
description: Create data visualizations with bar charts, line charts, pie charts, radar charts, Venn diagrams, and force-directed network graphs.
lastUpdated: 2025-01-09
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

... (content preserved)
