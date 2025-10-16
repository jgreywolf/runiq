# Data-Driven Rendering

> Design document for implementing data-driven chart rendering in Runiq

**Status:** 🚧 In Progress  
**Priority:** HIGH  
**Date:** October 15, 2025

## Overview

Enable Runiq to render charts (pie, bar, XY scatter) where shapes dynamically render based on provided data values, rather than static fixed shapes.

## Goals

1. **Pie Charts** - Slice angles calculated from data values
2. **Bar Charts** - Bar heights/widths scaled from data values
3. **XY Scatter Plots** - Point positions calculated from (x, y) data
4. **Data Binding** - Clean syntax for attaching data to nodes
5. **Type Safety** - Strongly typed data structures in TypeScript

## Non-Goals (Future)

- Live data fetching from APIs
- Animated/interactive charts
- Complex statistical visualizations (histograms, heatmaps)
- D3.js-style data joins and transformations

## Architecture

### Data Flow

```
DSL with data → Parser → AST with data → Layout → Render with data-driven SVG
```

### Type System

```typescript
// Core data types
type DataValue = number | { label: string; value: number };
type DataArray = DataValue[];

// Extended node declaration
interface NodeDeclaration {
  id: string;
  shape: string;
  label?: string;
  data?: DataArray | number; // NEW: Optional data property
  // ... existing properties
}
```

### DSL Syntax

```runiq
// Simple numeric array (pie chart)
shape sales as @pie-chart
  label: "Q4 Sales"
  data: [30, 45, 25]

// Labeled data (pie chart with legend)
// NOTE: Object keys must be quoted strings to avoid keyword conflicts
shape revenue as @pie-chart
  label: "Revenue by Region"
  data: [
    {"label": "North America", "value": 45},
    {"label": "Europe", "value": 30},
    {"label": "Asia", "value": 25}
  ]

// Bar chart with labeled bars
shape metrics as @bar-chart
  label: "Performance Metrics"
  data: [
    {"label": "Speed", "value": 85},
    {"label": "Quality", "value": 92},
    {"label": "Cost", "value": 78}
  ]

// XY scatter plot data
shape points as @scatter-plot
  label: "Customer Segments"
  data: [
    {"x": 10, "y": 20, "label": "Segment A"},
    {"x": 30, "y": 45, "label": "Segment B"},
    {"x": 50, "y": 15, "label": "Segment C"}
  ]
```

## Implementation Plan

### Phase 1: Core Types & Pie Charts (Current)

**Tasks:**

1. ✅ Design document (this file)
2. ✅ Add `data` property to `NodeDeclaration` type (18 tests passing)
3. ✅ Implement `pie-chart` shape with data-driven rendering (11 tests passing)
4. ✅ Write comprehensive tests for pie chart calculations
5. ✅ Add DSL parser support for data arrays (16 tests passing, negative numbers supported, keys must be quoted)
6. ⏳ Create pie chart examples

**Deliverables:**

- Working pie charts with data-driven slice angles
- ~30 passing tests
- Example files demonstrating pie charts

### Phase 2: Bar Charts

**Tasks:**

1. Implement `bar-chart-vertical` shape
2. Implement `bar-chart-horizontal` shape
3. Support multi-bar charts (grouped bars)
4. Add axes and labels
5. Write bar chart tests
6. Create bar chart examples

**Deliverables:**

- Working vertical and horizontal bar charts
- ~25 passing tests
- Example files demonstrating bar charts

### Phase 3: XY Scatter Plots

**Tasks:**

1. Implement `scatter-plot` shape
2. Create 2D layout engine for XY positioning
3. Support axis scales and labels
4. Support different point shapes (circle, square, triangle)
5. Write scatter plot tests
6. Create scatter plot examples

**Deliverables:**

- Working XY scatter plots
- ~20 passing tests
- Example files demonstrating scatter plots

## Pie Chart Specification

### Shape Definition

```typescript
// packages/core/src/shapes/charts/pie.ts
export const pieChart: ShapeDefinition = {
  id: 'pie-chart',
  bounds(ctx: RenderContext): { width: number; height: number } {
    const size = ctx.width || 200;
    return { width: size, height: size };
  },
  anchors(ctx: RenderContext): Anchor[] {
    // 4 anchor points at cardinal directions
    const size = ctx.width || 200;
    const r = size / 2;
    return [
      { x: r, y: 0, dir: 'n' },
      { x: size, y: r, dir: 'e' },
      { x: r, y: size, dir: 's' },
      { x: 0, y: r, dir: 'w' },
    ];
  },
  render(ctx: RenderContext, position: Position): string {
    // Extract data from context
    const data = normalizeData(ctx.data);
    const total = data.reduce((sum, d) => sum + d.value, 0);

    // Calculate slice angles
    const slices = calculateSlices(data, total);

    // Render SVG paths for each slice
    return renderPieSlices(slices, ctx, position);
  },
};
```

### Data Normalization

```typescript
function normalizeData(data: any): Array<{ label: string; value: number }> {
  if (!data || !Array.isArray(data)) return [];

  return data.map((item, i) => {
    if (typeof item === 'number') {
      return { label: `Slice ${i + 1}`, value: item };
    }
    return { label: item.label || `Slice ${i + 1}`, value: item.value };
  });
}
```

### Slice Calculation

```typescript
function calculateSlices(
  data: Array<{ label: string; value: number }>,
  total: number
) {
  let startAngle = 0;

  return data.map((item) => {
    const angle = (item.value / total) * 360;
    const slice = {
      label: item.label,
      value: item.value,
      percentage: (item.value / total) * 100,
      startAngle,
      endAngle: startAngle + angle,
      angle,
    };
    startAngle += angle;
    return slice;
  });
}
```

### SVG Path Rendering

```typescript
function renderPieSlices(slices, ctx, position): string {
  const cx = position.x + ctx.width / 2;
  const cy = position.y + ctx.height / 2;
  const radius = ctx.width / 2 - 10; // Leave margin

  const paths = slices.map((slice, i) => {
    const startRad = ((slice.startAngle - 90) * Math.PI) / 180;
    const endRad = ((slice.endAngle - 90) * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const largeArc = slice.angle > 180 ? 1 : 0;

    // Color from palette
    const color = getSliceColor(i);

    return `
      <path
        d="M ${cx},${cy} L ${x1},${y1} A ${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z"
        fill="${color}"
        stroke="${ctx.style?.stroke || '#333'}"
        stroke-width="${ctx.style?.strokeWidth || 2}"
      />
    `;
  });

  return paths.join('');
}
```

### Color Palette

```typescript
const DEFAULT_PALETTE = [
  '#4299e1', // blue
  '#48bb78', // green
  '#ed8936', // orange
  '#9f7aea', // purple
  '#f56565', // red
  '#38b2ac', // teal
  '#ed64a6', // pink
  '#ecc94b', // yellow
];

function getSliceColor(index: number): string {
  return DEFAULT_PALETTE[index % DEFAULT_PALETTE.length];
}
```

## Bar Chart Specification

### Shape Definition (Vertical)

```typescript
// packages/core/src/shapes/charts/bar-chart-vertical.ts
export const barChartVertical: ShapeDefinition = {
  id: 'bar-chart-vertical',
  bounds(ctx: RenderContext): { width: number; height: number } {
    const data = normalizeData(ctx.data);
    const barWidth = 60;
    const spacing = 20;
    const width = data.length * (barWidth + spacing) + spacing;
    const height = ctx.height || 300;
    return { width, height };
  },
  render(ctx: RenderContext, position: Position): string {
    const data = normalizeData(ctx.data);
    const maxValue = Math.max(...data.map((d) => d.value));

    // Render bars, axes, labels
    return renderBars(data, maxValue, ctx, position);
  },
};
```

## Testing Strategy

### Unit Tests

**Pie Chart Tests** (`packages/core/src/__tests__/pie-chart.test.ts`):

- ✅ Shape ID is correct
- ✅ Bounds calculation with default size
- ✅ Bounds calculation with custom size
- ✅ Data normalization (numbers → labeled data)
- ✅ Data normalization (labeled data → unchanged)
- ✅ Slice angle calculation (equal values)
- ✅ Slice angle calculation (unequal values)
- ✅ Slice angle calculation (single value)
- ✅ Percentage calculation
- ✅ SVG path generation
- ✅ Color palette cycling
- ✅ Empty data handling
- ✅ Invalid data handling
- ✅ Anchor point calculation

**Parser Tests** (`packages/parser-dsl/src/__tests__/data-parser.test.ts`):

- ✅ Parse simple numeric array
- ✅ Parse labeled data objects
- ✅ Parse nested data structures
- ✅ Error on invalid data syntax
- ✅ Optional data property

### Integration Tests

**End-to-End** (`packages/cli/src/__tests__/data-rendering.test.ts`):

- ✅ DSL → AST → Layout → SVG pipeline with data
- ✅ Rendered pie chart has correct slice angles
- ✅ Rendered bar chart has correct heights
- ✅ Data changes produce different outputs

## Examples

### Simple Pie Chart

```runiq
diagram "Sales by Category"

shape sales as @pie-chart
  label: "Q4 Sales"
  data: [30, 45, 25]
```

### Labeled Pie Chart

```runiq
diagram "Market Share"

shape market as @pie-chart
  label: "Browser Market Share 2025"
  data: [
    {label: "Chrome", value: 65},
    {label: "Safari", value: 18},
    {label: "Edge", value: 8},
    {label: "Firefox", value: 6},
    {label: "Other", value: 3}
  ]
```

### Multiple Charts

```runiq
diagram "Dashboard" direction: LR

shape q1 as @pie-chart label: "Q1" data: [10, 20, 30]
shape q2 as @pie-chart label: "Q2" data: [15, 25, 35]
shape q3 as @pie-chart label: "Q3" data: [20, 30, 40]

q1 -> q2 : "growth"
q2 -> q3 : "growth"
```

## Open Questions

1. **Color customization** - How to allow custom color palettes?
   - Option A: `colors: ["#ff0000", "#00ff00"]` property
   - Option B: Style system with `palette` property
   - **Decision:** Use style system (more flexible)

2. **Label positioning** - Inside slices, outside with lines, or legend?
   - Option A: Inside slices (simple, can overlap)
   - Option B: Outside with connector lines (complex, cleaner)
   - Option C: Separate legend (most flexible)
   - **Decision:** Start with inside labels, add legend support later

3. **Size constraints** - Fixed size or responsive?
   - **Decision:** Fixed size with optional width/height properties

4. **Zero/negative values** - How to handle?
   - **Decision:** Filter out zeros, error on negatives

## Success Criteria

- [ ] Pie chart shape renders correctly with data
- [ ] DSL parser handles data arrays
- [ ] 30+ tests passing for pie charts
- [ ] Example files render successfully
- [ ] Documentation complete
- [ ] Integration with CLI and editor

## Timeline

- **Week 1:** Core types + Pie charts (Phase 1)
- **Week 2:** Bar charts (Phase 2)
- **Week 3:** XY scatter plots (Phase 3)

---

**Next Steps:**

1. Add `data` property to core types
2. Implement pie chart shape
3. Write tests
4. Add parser support
5. Create examples
