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

## Next Steps

- DSL syntax support for nested arrays (coming soon)
- DSL syntax for color arrays (coming soon)
- Interactive chart examples in web editor (coming soon)
