---
title: Styling Guide
description: Customize diagram appearance with colors, borders, fonts, fills, gradients, and theming for shapes, edges, and containers.
lastUpdated: 2025-01-09
---

# Styling

Customize the appearance of your diagrams with colors, fonts, line styles, and themes.

## Style Declarations

### Default Styles

Apply styles to all shapes and edges:

```runiq
diagram "Styled Diagram" {

  style default fillColor:"#f7f7ff" strokeColor:"#444" strokeWidth:2
  style default2 fillColor:"#ef1" fontFamily:"Inter, sans-serif" fontSize:14

  shape A as @rect label: "Node A" style:default
  shape B as @rect label: "Node B" style:default2
  A -> B
}
```

### Named Styles

Define reusable named styles:

```runiq
diagram "Named Styles" {

  style primary fillColor:"#2196f3" strokeColor:"#1565c0" color:"#ffffff"
  style accent fillColor:"#ff9800" strokeColor:"#f57c00" color:"#ffffff"
  style subtle fillColor:"#f5f5f5" strokeColor:"#9e9e9e" color:"#333333"

  shape Button as @rect label: "Submit" style:primary
  shape Warning as @rect label: "Cancel" style:accent
  shape Info as @rect label: "Help" style:subtle
}
```

## Color Properties

### Shape Colors

```runiq
diagram "Colors" {

  shape A as @rect
    label: "Custom Colors"
    fillColor: "#e3f2fd"         # Background color
    strokeColor: "#2196f3"       # Border color
    color: "#1565c0"        # Text color
    strokeWidth: 2          # Border width
}
```

### Hex, RGB, and Named Colors

```runiq
# Hex colors
fillColor: "#2196f3"

# RGB colors
fillColor: "rgb(33, 150, 243)"

# RGBA with transparency
fillColor: "rgba(33, 150, 243, 0.5)"

# Named colors
fillColor: "blue"
strokeColor: "red"
color: "white"
```

## Typography

### Font Properties

```runiq
diagram "Typography" {
  style default
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 14
    fontWeight: 400

  style heading
    fontSize: 18
    fontWeight: 600

  shape Title as @rect label: "Heading" style:heading
  shape Body as @rect label: "Regular text"
}
```

### Text Alignment

```runiq
shape Centered as @rect
  label: "Centered Text"
  textAlign: center

shape Left as @rect
  label: "Left Aligned"
  textAlign: left
```

## Line Styles

### Edge Styles

```runiq
diagram "Line Styles" {

  shape A as @rect label: "A"
  shape B as @rect label: "B"
  shape C as @rect label: "C"
  shape D as @rect label: "D"

  # Line styles
  A -> B lineStyle: "solid" strokeColor: "#2196f3"
  A -> C lineStyle: "dashed" strokeColor: "#ff9800"
  A -> D lineStyle: "dotted" strokeColor: "#4caf50"
}
```

### Line Width

```runiq
diagram "Line Widths" {

  shape A as @rect label: "A"
  shape B as @rect label: "B"
  shape C as @rect label: "C"
  shape D as @rect label: "D"

  # Thin line
  A -> B strokeWidth: 1

  # Medium line (default)
  B -> C strokeWidth: 2

  # Thick line
  C -> D strokeWidth: 4
}
```

## Shape-Specific Styling

### Individual Shape Styles

```runiq
diagram "Individual Styling" {

  shape Start as @rounded
    label: "Start"
    fillColor: "#4caf50"
    strokeColor: "#2e7d32"
    color: "#ffffff"

  shape Process as @rect
    label: "Process"
    fillColor: "#2196f3"
    strokeColor: "#1565c0"
    color: "#ffffff"

  shape End as @rounded
    label: "End"
    fillColor: "#f44336"
    strokeColor: "#c62828"
    color: "#ffffff"
}
```

## Theme Presets

### Light Theme (Default)

```runiq
style default
  fillColor: "#ffffff"
  strokeColor: "#444444"
  color: "#333333"
  strokeWidth: 2
```

### Dark Theme

```runiq
diagram "Dark Theme" {
  direction LR

  style default
    fillColor: "#1e1e1e"
    strokeColor: "#6e6e6e"
    color: "#e0e0e0"
    strokeWidth: 2
    fontFamily: "Consolas, monospace"

  style highlight
    fillColor: "#2196f3"
    strokeColor: "#1976d2"
    color: "#ffffff"

  shape A as @rect label: "Dark Node"
  shape B as @rect label: "Highlight" style:highlight
  A -> B strokeColor: "#6e6e6e"
}
```

### Pastel Theme

```runiq
diagram "Pastel Theme"{

  style default
    fillColor: "#f5f5f5"
    strokeColor: "#999999"
    strokeWidth: 1

  style success fillColor:"#c8e6c9" strokeColor:"#81c784"
  style warning fillColor:"#fff9c4" strokeColor:"#fff176"
  style error fillColor:"#ffcdd2" strokeColor:"#ef9a9a"
  style info fillColor:"#bbdefb" strokeColor:"#64b5f6"

  shape OK as @hexagon label: "Success" style:success
  shape Wait as @rect label: "Processing" style:warning
  shape Fail as @doc label: "Error" style:error
  shape Help as @rounded label: "Info" style:info
}
```

### Professional Theme

```runiq
diagram "Professional Theme" {

  style default
    fillColor: "#ffffff"
    strokeColor: "#263238"
    color: "#263238"
    strokeWidth: 2
    fontFamily: "Segoe UI, sans-serif"
    fontSize: 13

  style primary fillColor:"#0d47a1" strokeColor:"#01579b" color:"#ffffff"
  style secondary fillColor:"#37474f" strokeColor:"#263238" color:"#ffffff"
  style accent fillColor:"#d84315" strokeColor:"#bf360c" color:"#ffffff"

  shape Header as @rect label: "Header" style:primary
  shape Content as @rect label: "Content" style:secondary
  shape Action as @hexagon label: "Action" style:accent
}
```

## Container Styling

### Container Colors

```runiq
diagram "Styled Containers" {

  container "Frontend"
    fillColor: "#fff3e0"
    strokeColor: "#ff9800"
    strokeWidth: 2
    padding: 20
  {
    shape UI as @rect label: "UI Component"
  }

  container "Backend"
    fillColor: "#e8f5e9"
    strokeColor: "#4caf50"
    strokeWidth: 2
    padding: 20
  {
    shape API as @rect label: "API Service"
  }
}
```

### Container Shadows

```runiq
diagram "Styled Containers" {

  container "Elevated Card"
    fillColor: "#ffffff"
    strokeColor: "#e0e0e0"
    shadow: true
    padding: 25
  {
    shape Content as @rect label: "Content"
  }
}
```

## Advanced Styling

### Opacity

```runiq
diagram "Opacity" {

  shape Solid as @rect label: "Solid" fillColor: "#2196f3" opacity: 1.0
  shape Semi as @rect label: "Semi-Transparent" fillColor: "#e1f" opacity: 0.5
  shape Light as @rect label: "Very Transparent" fillColor: "#2196f3" opacity: 0.2
}
```

### Border Radius (Shape-Specific)

Some shapes support custom border radius:

```runiq
diagram "Custom Border" {
  shape Rounded as @rounded
    label: "Rounded"
    borderRadius: 5

  shape VeryRounded as @rounded
    label: "Very Rounded"
    borderRadius: 30
}
```

### Gradient Fills (Future)

::: warning Not Yet Implemented
SVG gradient fills are not yet supported but are planned for a future release.
:::

```runiq
# Planned syntax:
shape Gradient as @rect
  label: "Gradient"
  fillColor: "linear-gradient(#2196f3, #1565c0)"
```

## Color Palettes

### Material Design Colors

```runiq
# Blue
fillColor: "#2196f3" strokeColor: "#1565c0"  # Primary
fillColor: "#bbdefb" strokeColor: "#64b5f6"  # Light
fillColor: "#0d47a1" strokeColor: "#01579b"  # Dark

# Green
fillColor: "#4caf50" strokeColor: "#2e7d32"  # Primary
fillColor: "#c8e6c9" strokeColor: "#81c784"  # Light
fillColor: "#1b5e20" strokeColor: "#2e7d32"  # Dark

# Orange
fillColor: "#ff9800" strokeColor: "#f57c00"  # Primary
fillColor: "#ffe0b2" strokeColor: "#ffb74d"  # Light
fillColor: "#e65100" strokeColor: "#ef6c00"  # Dark

# Red
fillColor: "#f44336" strokeColor: "#c62828"  # Primary
fillColor: "#ffcdd2" strokeColor: "#ef9a9a"  # Light
fillColor: "#b71c1c" strokeColor: "#c62828"  # Dark
```

### Grayscale

```runiq
fillColor: "#ffffff"  # White
fillColor: "#f5f5f5"  # Very Light Gray
fillColor: "#e0e0e0"  # Light Gray
fillColor: "#9e9e9e"  # Medium Gray
fillColor: "#616161"  # Dark Gray
fillColor: "#212121"  # Very Dark Gray
fillColor: "#000000"  # Black
```

## Best Practices

### 1. **Consistent Color Scheme**

Pick 3-5 colors and stick to them throughout the diagram:

```runiq
# Define your palette
style primary fillColor:"#2196f3" strokeColor:"#1565c0"
style secondary fillColor:"#4caf50" strokeColor:"#2e7d32"
style accent fillColor:"#ff9800" strokeColor:"#f57c00"
style neutral fillColor:"#9e9e9e" strokeColor:"#616161"
style danger fillColor:"#f44336" strokeColor:"#c62828"
```

### 2. **Adequate Contrast**

Ensure text is readable against backgrounds:

```runiq
# Good contrast
shape Good as @rect
  fillColor: "#2196f3"   // Dark blue background
  color: "#ffffff"  # White text ✅

# Poor contrast (avoid)
shape Poor as @rect
  fillColor: "#bbdefb"   # Light blue background
  color: "#ffffff"  # White text ❌
```

### 3. **Semantic Colors**

Use colors that match meaning:

```runiq
style success fillColor:"#4caf50" strokeColor:"#2e7d32"  # Green for success
style error fillColor:"#f44336" strokeColor:"#c62828"    # Red for errors
style warning fillColor:"#ff9800" strokeColor:"#f57c00"  # Orange for warnings
style info fillColor:"#2196f3" strokeColor:"#1565c0"     # Blue for info
```

### 4. **Accessibility**

Consider colorblind users:

- Don't rely solely on color to convey information
- Use shapes, patterns, or labels as well
- Test with colorblind simulator tools
- Use high contrast ratios (WCAG 2.1 AA: 4.5:1 for text)

### 5. **Professional Appearance**

```runiq
# Use subtle colors
fillColor: "#f7f7ff"   # Very light blue-gray
strokeColor: "#444444" # Dark gray (not black)

# Add whitespace
padding: 30

# Consistent sizing
strokeWidth: 2
fontSize: 14

# Professional fonts
fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
```

## Style Property Reference

### Shape Properties

| Property      | Type                    | Default    | Example                  |
| ------------- | ----------------------- | ---------- | ------------------------ |
| `fill`        | color                   | #f7f7ff    | `fillColor: "#2196f3"`   |
| `stroke`      | color                   | #444       | `strokeColor: "#1565c0"` |
| `color`       | color                   | #333       | `color: "#ffffff"`       |
| `strokeWidth` | number                  | 2          | `strokeWidth: 3`         |
| `opacity`     | number                  | 1.0        | `opacity: 0.5`           |
| `fontFamily`  | string                  | sans-serif | `fontFamily: "Inter"`    |
| `fontSize`    | number                  | 14         | `fontSize: 16`           |
| `fontWeight`  | number                  | 400        | `fontWeight: 600`        |
| `textAlign`   | left \| center \| right | center     | `textAlign: left`        |

### Edge Properties

| Property      | Type                               | Default | Example                  |
| ------------- | ---------------------------------- | ------- | ------------------------ |
| `stroke`      | color                              | #444    | `strokeColor: "#2196f3"` |
| `strokeWidth` | number                             | 2       | `strokeWidth: 3`         |
| `lineStyle`   | (string) solid \| dashed \| dotted | solid   | `lineStyle: "dashed"`    |

### Container Properties

| Property      | Type                      | Default     | Example                  |
| ------------- | ------------------------- | ----------- | ------------------------ |
| `fill`        | color                     | transparent | `fillColor: "#e3f2fd"`   |
| `strokeColor` | color                     | #444        | `strokeColor: "#2196f3"` |
| `strokeWidth` | number                    | 1           | `strokeWidth: 2`         |
| `borderStyle` | solid \| dashed \| dotted | solid       | `borderStyle: dashed`    |
| `shadow`      | boolean                   | false       | `shadow: true`           |
| `opacity`     | number                    | 1.0         | `opacity: 0.9`           |

## Examples

### Flowchart with Color Coding

```runiq
diagram "Order Processing" {
  direction TB

  style default fillColor:"#f5f5f5" strokeColor:"#616161"
  style processStyle fillColor:"#2196f3" strokeColor:"#1565c0" color:"#ffffff"
  style decision fillColor:"#ff9800" strokeColor:"#f57c00" color:"#ffffff"
  style success fillColor:"#4caf50" strokeColor:"#2e7d32" color:"#ffffff"
  style error fillColor:"#f44336" strokeColor:"#c62828" color:"#ffffff"

  shape Start as @rounded label: "Start" style:success
  shape Validate as @rect label: "Validate Order" style:processStyle
  shape Check as @rhombus label: "Valid?" style:decision
  shape Process as @rect label: "Process Payment" style:processStyle
  shape Complete as @hexagon label: "Complete" style:success
  shape Reject as @doc label: "Reject Order" style:error

  Start -> Validate
  Validate -> Check
  Check -yes-> Process
  Check -no-> Reject
  Process -> Complete
}
```

### System Architecture

```runiq
diagram "Microservices" {

  style default fontFamily:"Inter, sans-serif" fontSize:13

  container "Frontend" fillColor:"#fff3e0" strokeColor:"#ff9800" {
    shape React as @rect label: "React App"
      fillColor:"#ffffff" strokeColor:"#ff9800"
  }

  container "Backend" fillColor:"#e8f5e9" strokeColor:"#4caf50" {
    shape API as @rect label: "API Gateway"
      fillColor:"#ffffff" strokeColor:"#4caf50"
    shape Auth as @rect label: "Auth Service"
      fillColor:"#ffffff" strokeColor:"#4caf50"
  }

  container "Data" fillColor:"#f3e5f5" strokeColor:"#9c27b0" {
    shape DB as @cylinder label: "PostgreSQL"
      fillColor:"#ffffff" strokeColor:"#9c27b0"
  }
}
```

## See Also

- [Shapes Overview](/guide/shapes) - Available shape types
- [Containers](/guide/containers) - Container styling
- [Examples](/examples/) - Styled diagram examples
