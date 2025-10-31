# Styling

Customize the appearance of your diagrams with colors, fonts, line styles, and themes.

## Style Declarations

### Default Styles

Apply styles to all shapes and edges:

```runiq
diagram "Styled Diagram"

style default fill:#f7f7ff stroke:#444 strokeWidth:2
style default fontFamily:"Inter, sans-serif" fontSize:14

shape A as @rect label: "Node A"
shape B as @rect label: "Node B"
A -> B
```

### Named Styles

Define reusable named styles:

```runiq
diagram "Named Styles"

style primary fill:#2196f3 stroke:#1565c0 color:#ffffff
style accent fill:#ff9800 stroke:#f57c00 color:#ffffff
style subtle fill:#f5f5f5 stroke:#9e9e9e color:#333333

shape Button as @rect label: "Submit" style:primary
shape Warning as @rect label: "Cancel" style:accent
shape Info as @rect label: "Help" style:subtle
```

## Color Properties

### Shape Colors

```runiq
diagram "Colors"

shape A as @rect
  label: "Custom Colors"
  fill: "#e3f2fd"         # Background color
  stroke: "#2196f3"       # Border color
  color: "#1565c0"        # Text color
  strokeWidth: 2          # Border width
```

### Hex, RGB, and Named Colors

```runiq
# Hex colors
fill: "#2196f3"

# RGB colors
fill: "rgb(33, 150, 243)"

# RGBA with transparency
fill: "rgba(33, 150, 243, 0.5)"

# Named colors
fill: "blue"
stroke: "red"
color: "white"
```

## Typography

### Font Properties

```runiq
diagram "Typography"

style default
  fontFamily: "Inter, -apple-system, sans-serif"
  fontSize: 14
  fontWeight: 400

style heading
  fontSize: 18
  fontWeight: 600

shape Title as @rect label: "Heading" style:heading
shape Body as @rect label: "Regular text"
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
diagram "Line Styles"

shape A as @rect label: "A"
shape B as @rect label: "B"
shape C as @rect label: "C"
shape D as @rect label: "D"

# Line styles
A -> B lineStyle: solid strokeColor: "#2196f3"
A -> C lineStyle: dashed strokeColor: "#ff9800"
A -> D lineStyle: dotted strokeColor: "#4caf50"
```

### Line Width

```runiq
# Thin line
A -> B strokeWidth: 1

# Medium line (default)
A -> B strokeWidth: 2

# Thick line
A -> B strokeWidth: 4
```

## Shape-Specific Styling

### Individual Shape Styles

```runiq
diagram "Individual Styling"

shape Start as @rounded
  label: "Start"
  fill: "#4caf50"
  stroke: "#2e7d32"
  color: "#ffffff"

shape Process as @rect
  label: "Process"
  fill: "#2196f3"
  stroke: "#1565c0"
  color: "#ffffff"

shape End as @rounded
  label: "End"
  fill: "#f44336"
  stroke: "#c62828"
  color: "#ffffff"
```

## Theme Presets

### Light Theme (Default)

```runiq
style default
  fill: "#ffffff"
  stroke: "#444444"
  color: "#333333"
  strokeWidth: 2
```

### Dark Theme

```runiq
diagram "Dark Theme"
direction LR

style default
  fill: "#1e1e1e"
  stroke: "#6e6e6e"
  color: "#e0e0e0"
  strokeWidth: 2
  fontFamily: "Consolas, monospace"

style highlight
  fill: "#2196f3"
  stroke: "#1976d2"
  color: "#ffffff"

shape A as @rect label: "Dark Node"
shape B as @rect label: "Highlight" style:highlight
A -> B strokeColor: "#6e6e6e"
```

### Pastel Theme

```runiq
diagram "Pastel Theme"

style default
  fill: "#f5f5f5"
  stroke: "#999999"
  strokeWidth: 1

style success fill:#c8e6c9 stroke:#81c784
style warning fill:#fff9c4 stroke:#fff176
style error fill:#ffcdd2 stroke:#ef9a9a
style info fill:#bbdefb stroke:#64b5f6

shape OK as @hexagon label: "Success" style:success
shape Wait as @rect label: "Processing" style:warning
shape Fail as @doc label: "Error" style:error
shape Help as @rounded label: "Info" style:info
```

### Professional Theme

```runiq
diagram "Professional Theme"

style default
  fill: "#ffffff"
  stroke: "#263238"
  color: "#263238"
  strokeWidth: 2
  fontFamily: "Segoe UI, sans-serif"
  fontSize: 13

style primary fill:#0d47a1 stroke:#01579b color:#ffffff
style secondary fill:#37474f stroke:#263238 color:#ffffff
style accent fill:#d84315 stroke:#bf360c color:#ffffff

shape Header as @rect label: "Header" style:primary
shape Content as @rect label: "Content" style:secondary
shape Action as @hexagon label: "Action" style:accent
```

## Container Styling

### Container Colors

```runiq
diagram "Styled Containers"

container "Frontend"
  backgroundColor: "#fff3e0"
  borderColor: "#ff9800"
  borderWidth: 2
  padding: 20
{
  shape UI as @rect label: "UI Component"
}

container "Backend"
  backgroundColor: "#e8f5e9"
  borderColor: "#4caf50"
  borderWidth: 2
  padding: 20
{
  shape API as @rect label: "API Service"
}
```

### Container Shadows

```runiq
container "Elevated Card"
  backgroundColor: "#ffffff"
  borderColor: "#e0e0e0"
  shadow: true
  padding: 25
{
  shape Content as @rect label: "Content"
}
```

## Advanced Styling

### Gradient Fills (Future)

::: warning Not Yet Implemented
SVG gradient fills are not yet supported but are planned for a future release.
:::

```runiq
# Planned syntax:
shape Gradient as @rect
  label: "Gradient"
  fill: "linear-gradient(#2196f3, #1565c0)"
```

### Opacity

```runiq
diagram "Opacity"

shape Solid as @rect
  label: "Solid"
  fill: "#2196f3"
  opacity: 1.0

shape Semi as @rect
  label: "Semi-Transparent"
  fill: "#2196f3"
  opacity: 0.5

shape Light as @rect
  label: "Very Transparent"
  fill: "#2196f3"
  opacity: 0.2
```

### Border Radius (Shape-Specific)

Some shapes support custom border radius:

```runiq
shape Rounded as @rounded
  label: "Rounded"
  borderRadius: 10

shape VeryRounded as @rounded
  label: "Very Rounded"
  borderRadius: 20
```

## Color Palettes

### Material Design Colors

```runiq
# Blue
fill: "#2196f3" stroke: "#1565c0"  # Primary
fill: "#bbdefb" stroke: "#64b5f6"  # Light
fill: "#0d47a1" stroke: "#01579b"  # Dark

# Green
fill: "#4caf50" stroke: "#2e7d32"  # Primary
fill: "#c8e6c9" stroke: "#81c784"  # Light
fill: "#1b5e20" stroke: "#2e7d32"  # Dark

# Orange
fill: "#ff9800" stroke: "#f57c00"  # Primary
fill: "#ffe0b2" stroke: "#ffb74d"  # Light
fill: "#e65100" stroke: "#ef6c00"  # Dark

# Red
fill: "#f44336" stroke: "#c62828"  # Primary
fill: "#ffcdd2" stroke: "#ef9a9a"  # Light
fill: "#b71c1c" stroke: "#c62828"  # Dark
```

### Grayscale

```runiq
fill: "#ffffff"  # White
fill: "#f5f5f5"  # Very Light Gray
fill: "#e0e0e0"  # Light Gray
fill: "#9e9e9e"  # Medium Gray
fill: "#616161"  # Dark Gray
fill: "#212121"  # Very Dark Gray
fill: "#000000"  # Black
```

## Best Practices

### 1. **Consistent Color Scheme**

Pick 3-5 colors and stick to them throughout the diagram:

```runiq
# Define your palette
style primary fill:#2196f3 stroke:#1565c0
style secondary fill:#4caf50 stroke:#2e7d32
style accent fill:#ff9800 stroke:#f57c00
style neutral fill:#9e9e9e stroke:#616161
style danger fill:#f44336 stroke:#c62828
```

### 2. **Adequate Contrast**

Ensure text is readable against backgrounds:

```runiq
# Good contrast
shape Good as @rect
  fill: "#2196f3"   # Dark blue background
  color: "#ffffff"  # White text ✅

# Poor contrast (avoid)
shape Poor as @rect
  fill: "#bbdefb"   # Light blue background
  color: "#ffffff"  # White text ❌
```

### 3. **Semantic Colors**

Use colors that match meaning:

```runiq
style success fill:#4caf50 stroke:#2e7d32  # Green for success
style error fill:#f44336 stroke:#c62828    # Red for errors
style warning fill:#ff9800 stroke:#f57c00  # Orange for warnings
style info fill:#2196f3 stroke:#1565c0     # Blue for info
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
fill: "#f7f7ff"   # Very light blue-gray
stroke: "#444444" # Dark gray (not black)

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

| Property      | Type                    | Default    | Example               |
| ------------- | ----------------------- | ---------- | --------------------- |
| `fill`        | color                   | #f7f7ff    | `fill: "#2196f3"`     |
| `stroke`      | color                   | #444       | `stroke: "#1565c0"`   |
| `color`       | color                   | #333       | `color: "#ffffff"`    |
| `strokeWidth` | number                  | 2          | `strokeWidth: 3`      |
| `opacity`     | number                  | 1.0        | `opacity: 0.5`        |
| `fontFamily`  | string                  | sans-serif | `fontFamily: "Inter"` |
| `fontSize`    | number                  | 14         | `fontSize: 16`        |
| `fontWeight`  | number                  | 400        | `fontWeight: 600`     |
| `textAlign`   | left \| center \| right | center     | `textAlign: left`     |

### Edge Properties

| Property      | Type                      | Default | Example                  |
| ------------- | ------------------------- | ------- | ------------------------ |
| `strokeColor` | color                     | #444    | `strokeColor: "#2196f3"` |
| `strokeWidth` | number                    | 2       | `strokeWidth: 3`         |
| `lineStyle`   | solid \| dashed \| dotted | solid   | `lineStyle: dashed`      |

### Container Properties

| Property          | Type                      | Default     | Example                      |
| ----------------- | ------------------------- | ----------- | ---------------------------- |
| `backgroundColor` | color                     | transparent | `backgroundColor: "#e3f2fd"` |
| `borderColor`     | color                     | #444        | `borderColor: "#2196f3"`     |
| `borderWidth`     | number                    | 1           | `borderWidth: 2`             |
| `borderStyle`     | solid \| dashed \| dotted | solid       | `borderStyle: dashed`        |
| `shadow`          | boolean                   | false       | `shadow: true`               |
| `opacity`         | number                    | 1.0         | `opacity: 0.9`               |

## Examples

### Flowchart with Color Coding

```runiq
diagram "Order Processing" direction TB

style default fill:#f5f5f5 stroke:#616161
style process fill:#2196f3 stroke:#1565c0 color:#ffffff
style decision fill:#ff9800 stroke:#f57c00 color:#ffffff
style success fill:#4caf50 stroke:#2e7d32 color:#ffffff
style error fill:#f44336 stroke:#c62828 color:#ffffff

shape Start as @rounded label: "Start" style:success
shape Validate as @rect label: "Validate Order" style:process
shape Check as @rhombus label: "Valid?" style:decision
shape Process as @rect label: "Process Payment" style:process
shape Complete as @hexagon label: "Complete" style:success
shape Reject as @doc label: "Reject Order" style:error

Start -> Validate
Validate -> Check
Check -yes-> Process
Check -no-> Reject
Process -> Complete
```

### System Architecture

```runiq
diagram "Microservices"

style default fontFamily:"Inter, sans-serif" fontSize:13

container "Frontend" backgroundColor:"#fff3e0" borderColor:"#ff9800" {
  shape React as @rect label: "React App"
    fill:"#ffffff" stroke:"#ff9800"
}

container "Backend" backgroundColor:"#e8f5e9" borderColor:"#4caf50" {
  shape API as @rect label: "API Gateway"
    fill:"#ffffff" stroke:"#4caf50"
  shape Auth as @rect label: "Auth Service"
    fill:"#ffffff" stroke:"#4caf50"
}

container "Data" backgroundColor:"#f3e5f5" borderColor:"#9c27b0" {
  shape DB as @cylinder label: "PostgreSQL"
    fill:"#ffffff" stroke:"#9c27b0"
}
```

## See Also

- [Shapes Overview](/guide/shapes) - Available shape types
- [Containers](/guide/containers) - Container styling
- [Examples](/examples/) - Styled diagram examples
