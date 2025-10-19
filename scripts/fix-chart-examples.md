# Chart Examples Batch Fix Guide

## Common Pattern

All chart files in `examples/charts/` have the same issue:

- Missing `diagram` wrapper
- Multi-line properties
- Spaces after colons in properties

## Fix Template

```runiq
// Before
shape chart1 as @chart-type
  label: "Chart Label"
  data: [...]

// After
diagram "Chart Label" {
  shape chart1 as @chart-type label:"Chart Label" data:[...]
}
```

## Remaining Files to Fix (~16 files)

### Bar Chart Variants

1. **dsl-bar-grouped.runiq**
   - Add diagram wrapper
   - Condense properties (label, title, colors, data with groups)
   - Remove spaces after colons

2. **dsl-bar-labeled.runiq**
   - Add diagram wrapper
   - Condense properties (label, data with labels)
   - Remove spaces after colons

3. **dsl-bar-stacked.runiq**
   - Add diagram wrapper
   - Condense properties (label, title, colors, data with stacks)
   - Remove spaces after colons

4. **dsl-all-features.runiq**
   - Add diagram wrapper
   - Condense ALL properties (may have many)
   - Remove spaces after colons

### Test Files (Color Tests)

5. **test-colors-all-features-dsl.runiq**
6. **test-colors-bar-dsl.runiq**
7. **test-colors-pie-dsl.runiq**
8. **test-colors-stacked-dsl.runiq**

### Test Files (Label Tests)

9. **test-labels-bar-dsl.runiq**
10. **test-labels-grouped-dsl.runiq**
11. **test-labels-horizontal-dsl.runiq**
12. **test-labels-stacked-dsl.runiq**

### Test Files (Other)

13. **test-grouped-dsl.runiq**
14. **test-stacked-dsl.runiq**
15. **test-title-pie-dsl.runiq**

## Property Condensing Rules

### Simple Properties

```runiq
// Multi-line
label: "Text"
data: [1, 2, 3]

// Single-line
label:"Text" data:[1,2,3]
```

### Complex Data Arrays

```runiq
// Multi-line
data: [
  {"label": "A", "value": 10},
  {"label": "B", "value": 20}
]

// Single-line (remove spaces in objects)
data:[{"label":"A","value":10},{"label":"B","value":20}]
```

### Multiple Properties with Arrays

```runiq
// Multi-line
title: "Chart Title"
xLabel: "X Axis"
yLabel: "Y Axis"
colors: ["#ff0000", "#00ff00", "#0000ff"]
data: [...]

// Single-line (remove all spaces after colons and around punctuation)
title:"Chart Title" xLabel:"X Axis" yLabel:"Y Axis" colors:["#ff0000","#00ff00","#0000ff"] data:[...]
```

## Verification Checklist

After fixing each file:

- [ ] File has `diagram "Name" { }` wrapper
- [ ] All properties on single line
- [ ] No spaces after colons in properties
- [ ] No spaces after commas in arrays
- [ ] No spaces after colons in object properties
- [ ] Quotes preserved for string values

## Known Working Examples

Reference these fixed files as templates:

- `dsl-pie-simple.runiq` - Simple chart with minimal properties
- `dsl-pie-labeled.runiq` - Chart with colors and data objects
- `dsl-bar-simple.runiq` - Vertical bar chart with data array
- `dsl-bar-horizontal.runiq` - Complex with title, axis labels, colors, data objects

## Batch Fix Approach

1. Read file to see current structure
2. Identify diagram name (from label or title property)
3. Condense all properties to single line
4. Wrap in `diagram "Name" { ... }`
5. Verify no spaces after colons
6. Test file parses without errors
