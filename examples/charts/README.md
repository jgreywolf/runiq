# Chart Examples

This directory contains comprehensive examples demonstrating all chart features in Runiq.

## Chart Types

### 1. Pie Charts (`pie-chart`)

**Basic Format:**
```json
{
  "type": "pie-chart",
  "data": {
    "values": [30, 25, 20, 15, 10]
  }
}
```

**With Labels:**
```json
{
  "type": "pie-chart",
  "data": {
    "values": [
      { "label": "Product A", "value": 35 },
      { "label": "Product B", "value": 25 }
    ]
  }
}
```

**Features:**
- ✅ Simple values (numbers only)
- ✅ Labeled values (objects with label and value)
- ✅ Legend support (`showLegend: true`)
- ✅ Custom colors (`colors: ["#ff0000", "#00ff00"]`)
- ✅ Title support (`title: "Chart Title"`)
- ✅ Automatic percentage calculation
- ✅ Color cycling for multiple slices

**Complete Example:**
```json
{
  "type": "pie-chart",
  "data": {
    "values": [
      { "label": "Q1", "value": 45 },
      { "label": "Q2", "value": 38 }
    ],
    "title": "Quarterly Revenue",
    "showLegend": true,
    "colors": ["#667eea", "#764ba2"]
  }
}
```

### 2. Vertical Bar Charts (`bar-chart-vertical`)

**Simple Format:**
```json
{
  "type": "bar-chart-vertical",
  "data": {
    "values": [30, 45, 25, 60]
  }
}
```

**Grouped Format:**
```json
{
  "type": "bar-chart-vertical",
  "data": {
    "values": [
      { "label": "Q1", "values": [30, 45, 25] },
      { "label": "Q2", "values": [35, 50, 30] }
    ]
  }
}
```

**Stacked Format:**
```json
{
  "type": "bar-chart-vertical",
  "data": {
    "stacked": true,
    "values": [
      { "label": "Q1", "values": [30, 45, 25] },
      { "label": "Q2", "values": [35, 50, 30] }
    ]
  }
}
```

**Features:**
- ✅ Simple bars (single values)
- ✅ Grouped bars (multiple series side-by-side)
- ✅ Stacked bars (multiple series stacked vertically)
- ✅ Custom colors (`colors: ["#e74c3c", "#f39c12"]`)
- ✅ Title support (`title: "Chart Title"`)
- ✅ X-axis label (`xLabel: "X Axis"`)
- ✅ Y-axis label (`yLabel: "Y Axis"`, rotated -90°)
- ✅ Automatic scaling based on max value
- ✅ Bar labels and value display

**Complete Example:**
```json
{
  "type": "bar-chart-vertical",
  "data": {
    "stacked": true,
    "values": [
      { "label": "Q1", "values": [30, 45, 25] },
      { "label": "Q2", "values": [35, 50, 30] }
    ],
    "title": "Quarterly Product Sales",
    "xLabel": "Quarters",
    "yLabel": "Units Sold (K)",
    "colors": ["#667eea", "#764ba2", "#f093fb"]
  }
}
```

### 3. Horizontal Bar Charts (`bar-chart-horizontal`)

**Simple Format:**
```json
{
  "type": "bar-chart-horizontal",
  "data": {
    "values": [30, 45, 25, 60]
  }
}
```

**Grouped Format:**
```json
{
  "type": "bar-chart-horizontal",
  "data": {
    "values": [
      { "label": "Region 1", "values": [30, 45] },
      { "label": "Region 2", "values": [35, 50] }
    ]
  }
}
```

**Stacked Format:**
```json
{
  "type": "bar-chart-horizontal",
  "data": {
    "stacked": true,
    "values": [
      { "label": "Product A", "values": [30, 45, 25] },
      { "label": "Product B", "values": [35, 50, 30] }
    ]
  }
}
```

**Features:**
- ✅ Simple bars (single values)
- ✅ Grouped bars (multiple series vertically arranged)
- ✅ Stacked bars (multiple series stacked horizontally)
- ✅ Custom colors (`colors: ["#e74c3c", "#f39c12"]`)
- ✅ Title support (`title: "Chart Title"`)
- ✅ X-axis label (`xLabel: "X Axis"`)
- ✅ Y-axis label (`yLabel: "Y Axis"`, rotated -90°)
- ✅ Automatic scaling based on max value
- ✅ Bar labels and value display

**Complete Example:**
```json
{
  "type": "bar-chart-horizontal",
  "data": {
    "values": [
      { "label": "North", "values": [30, 45] },
      { "label": "South", "values": [35, 50] }
    ],
    "title": "Regional Performance",
    "xLabel": "Revenue ($M)",
    "yLabel": "Regions",
    "colors": ["#667eea", "#764ba2"]
  }
}
```

## Feature Summary

| Feature | Pie Chart | Vertical Bars | Horizontal Bars |
|---------|-----------|---------------|-----------------|
| Simple values | ✅ | ✅ | ✅ |
| Labeled values | ✅ | ✅ | ✅ |
| Grouped series | ❌ | ✅ | ✅ |
| Stacked series | ❌ | ✅ | ✅ |
| Custom colors | ✅ | ✅ | ✅ |
| Title | ✅ | ✅ | ✅ |
| X-axis label | ❌ | ✅ | ✅ |
| Y-axis label | ❌ | ✅ | ✅ |
| Legend | ✅ | ❌ | ❌ |
| Auto-scaling | N/A | ✅ | ✅ |
| Percentages | ✅ | ❌ | ❌ |

## Color System

All charts support custom color palettes:

```json
{
  "data": {
    "values": [...],
    "colors": ["#ff0000", "#00ff00", "#0000ff"]
  }
}
```

**Default Palette** (8 colors, cycles automatically):
- `#4299e1` - Blue
- `#48bb78` - Green
- `#ed8936` - Orange
- `#9f7aea` - Purple
- `#f56565` - Red
- `#38b2ac` - Teal
- `#ed64a6` - Pink
- `#ecc94b` - Yellow

**Color Cycling:**
- If you have more data points than colors, colors automatically cycle
- Custom colors override the default palette
- Falls back to default if `colors` array is empty

## Example Files

1. **`pie-chart-complete.json`** - All pie chart features
   - Simple values
   - Legends
   - Custom colors
   - Titles
   - Complete example with all features

2. **`bar-chart-vertical-complete.json`** - All vertical bar features
   - Simple bars
   - Grouped bars
   - Stacked bars
   - Custom colors
   - Titles and axis labels
   - Complete example with all features

3. **`bar-chart-horizontal-complete.json`** - All horizontal bar features
   - Simple bars
   - Grouped bars
   - Stacked bars
   - Custom colors
   - Titles and axis labels
   - Complete example with all features

4. **`dashboard-complete.json`** - Full dashboard example
   - Multiple chart types in one diagram
   - Real-world use case (sales analytics)
   - Mix of pie charts and bar charts
   - All features demonstrated

## Usage with CLI

```bash
# Render a chart example to SVG
runiq render examples/charts/pie-chart-complete.json output.svg

# Render the dashboard
runiq render examples/charts/dashboard-complete.json dashboard.svg
```

## Tips

1. **Titles and Labels:**
   - Titles appear centered above the chart
   - X-axis labels appear centered at the bottom
   - Y-axis labels appear rotated on the left side

2. **Grouped vs Stacked:**
   - Grouped: Series appear side-by-side (comparison)
   - Stacked: Series stack on top (cumulative totals)
   - Use `"stacked": true` to enable stacking

3. **Color Selection:**
   - Use contrasting colors for better visibility
   - Limit custom colors to 3-5 for clarity
   - Default palette provides good contrast automatically

4. **Data Preparation:**
   - Filter out zero/negative values (charts do this automatically)
   - Label your data for better readability
   - Use meaningful titles and axis labels

5. **Performance:**
   - Charts handle up to 20+ data points efficiently
   - Legends work best with 3-8 items
   - Grouped/stacked work best with 2-5 series

## Programmatic Usage

```typescript
import { getShapeByType } from '@runiq/core';

const pieChart = getShapeByType('pie-chart');

const context = {
  node: {
    id: 'chart1',
    type: 'pie-chart',
    label: 'My Chart',
    data: {
      values: [30, 25, 20],
      title: 'Revenue Distribution',
      showLegend: true,
      colors: ['#667eea', '#764ba2', '#f093fb']
    }
  },
  styles: {}
};

const svg = pieChart.render(context, { x: 0, y: 0 });
console.log(svg); // SVG markup
```

## Test Coverage

All chart features are thoroughly tested:
- **Pie charts:** 26 tests
- **Vertical bars:** 47 tests
- **Horizontal bars:** 44 tests
- **Total:** 117 chart tests, all passing

## DSL Syntax

Runiq DSL now fully supports chart features including nested arrays for grouped and stacked bars!

### Basic Pie Chart (DSL)
```runiq
shape pie1 as @pie-chart label: "Simple Pie" data: [30, 45, 25]
```

### Labeled Pie Chart (DSL)
```runiq
shape pie1 as @pie-chart label: "Product Sales" data: [
  {"label": "Product A", "value": 450},
  {"label": "Product B", "value": 320},
  {"label": "Product C", "value": 230}
]
```

### Simple Bar Chart (DSL)
```runiq
shape chart1 as @bar-chart-vertical label: "Monthly Sales" data: [30, 45, 60, 55, 70]
```

### Labeled Bar Chart (DSL)
```runiq
shape chart1 as @bar-chart-vertical label: "Quarterly Revenue" data: [
  {"label": "Q1", "value": 120},
  {"label": "Q2", "value": 150},
  {"label": "Q3", "value": 180},
  {"label": "Q4", "value": 200}
]
```

### Grouped Bar Chart (DSL)
Nested arrays create grouped bars (side-by-side):
```runiq
shape chart1 as @bar-chart-vertical label: "Revenue by Region" data: [
  {"label": "Q1", "values": [30, 45, 25]},
  {"label": "Q2", "values": [35, 50, 30]},
  {"label": "Q3", "values": [40, 55, 35]},
  {"label": "Q4", "values": [45, 60, 40]}
]
```

### Stacked Bar Chart (DSL)
Add `stacked: true` to stack bars vertically:
```runiq
shape chart1 as @bar-chart-vertical label: "Revenue Breakdown" stacked: true data: [
  {"label": "Q1", "values": [30, 45, 25]},
  {"label": "Q2", "values": [35, 50, 30]},
  {"label": "Q3", "values": [40, 55, 35]},
  {"label": "Q4", "values": [45, 60, 40]}
]
```

### Horizontal Bars (DSL)
```runiq
shape chart1 as @bar-chart-horizontal label: "Department Budget" data: [
  {"label": "Engineering", "value": 500},
  {"label": "Marketing", "value": 350},
  {"label": "Sales", "value": 420}
]
```

### Show Legend (DSL)
Add `showLegend: true` to display a legend:
```runiq
shape pie1 as @pie-chart label: "Market Share" showLegend: true data: [
  {"label": "Product A", "value": 35},
  {"label": "Product B", "value": 28}
]
```

### Custom Colors (DSL)
Add `colors: [...]` to specify custom colors:
```runiq
shape pie1 as @pie-chart 
  label: "Product Sales" 
  colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00"]
  data: [
    {"label": "Product A", "value": 35},
    {"label": "Product B", "value": 28},
    {"label": "Product C", "value": 22},
    {"label": "Product D", "value": 15}
  ]
```

For grouped/stacked bars, colors apply to each bar group:
```runiq
shape chart1 as @bar-chart-vertical 
  label: "Sales by Region"
  colors: ["#e53e3e", "#38b2ac", "#9f7aea"]
  data: [
    {"label": "Q1", "values": [30, 45, 25]},
    {"label": "Q2", "values": [35, 50, 30]}
  ]
```

### DSL Properties Reference

**Chart Properties:**
- `label: "string"` - Chart title
- `showLegend: true/false` - Display legend
- `stacked: true/false` - Stack bars vertically (bar charts only)
- `colors: ["#hex", ...]` - Custom color array for slices/bars

**Data Formats:**
- Simple values: `data: [30, 45, 25]`
- Labeled values: `data: [{"label": "Q1", "value": 120}]`
- Nested arrays (grouped/stacked): `data: [{"label": "Q1", "values": [30, 45, 25]}]`

**Color Specification:**
- Use hex colors: `["#ff0000", "#00ff00", "#0000ff"]`
- Colors cycle if fewer colors than data points
- For grouped/stacked bars: colors apply to each bar in the group

**DSL Example Files:**
- `dsl-pie-simple.runiq` - Basic pie chart
- `dsl-pie-labeled.runiq` - Labeled pie chart with colors
- `dsl-bar-simple.runiq` - Simple bar chart
- `dsl-bar-labeled.runiq` - Labeled bar chart
- `dsl-bar-grouped.runiq` - Grouped bars with custom colors
- `dsl-bar-stacked.runiq` - Stacked bars with custom colors
- `dsl-bar-horizontal.runiq` - Horizontal bars
- `dsl-all-features.runiq` - Complete example with all features
- `test-colors-pie-dsl.runiq` - Pie chart color test
- `test-colors-bar-dsl.runiq` - Grouped bars color test
- `test-colors-stacked-dsl.runiq` - Stacked bars color test

### Rendering DSL Charts

```bash
# Render a DSL chart file
runiq render dsl-bar-stacked.runiq output.svg

# Or using Node directly
node packages/cli/dist/cli.js render dsl-bar-stacked.runiq output.svg
```

## Next Steps

- ✅ DSL syntax for nested arrays (COMPLETE!)
- ✅ DSL syntax for stacked property (COMPLETE!)
- ✅ DSL syntax for showLegend property (COMPLETE!)
- ✅ DSL syntax for color arrays (COMPLETE!)
- Title/axis label properties in DSL - coming soon
- Interactive chart examples in web editor - coming soon

