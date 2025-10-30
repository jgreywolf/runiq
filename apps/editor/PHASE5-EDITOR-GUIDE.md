# Phase 5: Templates & Presets - Editor Guide

## Overview

Phase 5 introduces **container templates** and **style presets** to the Runiq editor, enabling:
- **Reusable container patterns** with customizable parameters
- **Named style presets** for consistent visual styling
- **Container inheritance** with the `extends` property
- Reduced code duplication and improved maintainability

## Features

### 1. Container Templates

Templates define reusable container patterns with optional parameters:

```runiq
template "microservice" {
  label: "Microservice Template"
  description: "Standard microservice container"
  backgroundColor: "#e3f2fd"
  borderColor: "#2196f3"
  borderWidth: 2
  padding: 20
  collapseButtonVisible: true
}

// Use the template
container "User Service" templateId: "microservice" {
  shape api as @rectangle label: "User API"
}
```

**Template Parameters** (optional):
```runiq
template "dashboard-widget" {
  parameters: [
    "title": string = "Widget",
    "width": number = 300,
    "collapsible": boolean = true,
    "color": color = "#2196f3"
  ]
  backgroundColor: "#ffffff"
  padding: 15
}
```

Parameter types:
- `string` - Text values
- `number` - Numeric values
- `boolean` - True/false
- `color` - Hex color codes

### 2. Style Presets

Presets are named collections of style properties:

```runiq
preset "card" {
  label: "Card Style"
  padding: 15
  shadow: true
  borderWidth: 1
  borderStyle: "solid"
}

preset "highlighted" {
  label: "Highlighted Section"
  backgroundColor: "#fff3cd"
  borderColor: "#ffc107"
  borderWidth: 2
}

// Apply presets
container "Info Panel" preset: "card" {
  shape node as @rectangle
}
```

### 3. Container Inheritance

Containers can inherit properties from other containers or templates:

```runiq
container "Base Container" {
  backgroundColor: "#f0f0f0"
  padding: 20
  shape base as @rectangle label: "Base"
}

// Inherit from Base Container
container "Extended Container" extends: "Base Container" {
  borderColor: "#2196f3"
  borderWidth: 2
  shape child as @rectangle label: "Child"
}
```

### 4. Combining Features

All three features can be combined:

```runiq
template "service-template" {
  backgroundColor: "#e3f2fd"
  padding: 20
}

preset "card" {
  shadow: true
  borderWidth: 1
}

container "Base Service" {
  borderColor: "#ccc"
  shape base as @rectangle
}

// Combine: template + preset + extends + inline overrides
container "Advanced Service" 
  templateId: "service-template"
  preset: "card"
  extends: "Base Service"
  backgroundColor: "#custom" {
  shape api as @server label: "API"
}
```

**Property Resolution Order:**
1. Template properties
2. Preset properties
3. Extended container properties
4. Inline properties (highest priority - overrides all)

## Editor Integration

### Autocomplete Support

The editor provides IntelliSense for:
- `template` keyword - Create template definitions
- `preset` keyword - Create preset definitions
- `container` keyword - Create container blocks
- `templateId:` property - Reference templates
- `preset:` property - Apply presets
- `extends:` property - Inherit from containers
- `parameters:` property - Define template parameters
- All container style properties (backgroundColor, padding, shadow, etc.)

**Trigger autocomplete:** Press `Ctrl+Space` while typing

### Sample Diagrams

Access pre-built Phase 5 samples:
1. Click **"Sample Diagrams"** tab in the toolbox
2. Expand **"Templates & Presets (Phase 5)"** category
3. Click any sample to insert into editor

Available samples:
- **Basic Template** - Simple template definition and usage
- **Style Preset** - Preset creation and application
- **Template with Parameters** - Parameterized template
- **Container Inheritance** - Using extends property
- **Combined: Template + Preset** - Using both together
- **Complete Example** - Full microservices architecture
- **Multiple Presets** - Theme-based presets
- **Template Override** - Overriding template properties

### Syntax Validation

The editor validates:
- Template definition syntax
- Preset definition syntax
- Property names and values
- Container structure

Syntax errors appear as:
- Red underlines in the editor
- Error markers in the left gutter
- Diagnostic messages on hover

## Examples

### Example 1: Microservices Architecture

```runiq
diagram "Microservices"

template "microservice" {
  label: "Microservice Template"
  backgroundColor: "#e3f2fd"
  borderColor: "#2196f3"
  borderWidth: 2
  padding: 20
  collapseButtonVisible: true
}

preset "card" {
  padding: 15
  shadow: true
}

container "User Service" templateId: "microservice" preset: "card" {
  shape api as @rectangle label: "User API"
  shape cache as @cylinder label: "Cache"
}

container "Order Service" templateId: "microservice" preset: "card" {
  shape api2 as @rectangle label: "Order API"
  shape db as @cylinder label: "Database"
}

api -> api2
```

### Example 2: Dashboard Widgets

```runiq
diagram "Dashboard"

template "widget" {
  backgroundColor: "#ffffff"
  borderWidth: 1
  padding: 15
  shadow: true
  resizable: true
}

preset "primary" {
  borderColor: "#2196f3"
  backgroundColor: "#e3f2fd"
}

preset "success" {
  borderColor: "#4caf50"
  backgroundColor: "#e8f5e9"
}

container "User Stats" templateId: "widget" preset: "primary" {
  shape total as @bar-chart-vertical label: "Total: 1,250"
}

container "Revenue" templateId: "widget" preset: "success" {
  shape monthly as @pie-chart label: "Monthly: $45K"
}
```

### Example 3: Themed Sections

```runiq
diagram "App Layout"

preset "panel" {
  padding: 20
  borderStyle: "solid"
  shadow: false
}

preset "highlighted" {
  backgroundColor: "#fff3cd"
  borderColor: "#ffc107"
  borderWidth: 2
}

container "Header" preset: "panel" {
  backgroundColor: "#f5f5f5"
  shape logo as @rectangle label: "Logo"
}

container "Important Notice" preset: "highlighted" {
  shape alert as @rhombus label: "⚠ Action Required"
}
```

## Best Practices

1. **Define Templates Early**: Create templates at the diagram start for consistency
2. **Use Descriptive IDs**: Name templates/presets clearly (e.g., "microservice-blue", "card-shadow")
3. **Leverage Parameters**: Use parameters for values that change between instances
4. **Preset for Themes**: Create theme-based presets (primary, success, warning, danger)
5. **Combine Wisely**: Use template for structure, preset for styling, extends for variations
6. **Override Sparingly**: Only override when truly necessary for specific instances
7. **Document Templates**: Use `label` and `description` fields for clarity

## Testing

Playwright E2E tests verify:
- Sample insertion from toolbox
- Autocomplete functionality
- Syntax validation
- Complete workflows with templates, presets, and inheritance

Run tests:
```bash
cd apps/editor
pnpm test:e2e
```

## Related Documentation

- [Container Enhancement Design](../../../docs/hierarchical-containers-design.md) - Full Phase 1-5 specification
- [DSL Syntax Reference](../../../DSL-SYNTAX-REFERENCE.md) - Complete syntax guide
- [Example Diagrams](../../../examples/) - More .runiq examples
- [Shape Reference](../../../SHAPE-ID-REFERENCE.md) - Available shapes

## Implementation Status

✅ **Completed:**
- Template definition syntax
- Preset definition syntax
- Container template usage
- Container inheritance
- Parameter types (string, number, boolean, color)
- Parser integration (62 tests)
- Autocomplete support
- Sample diagrams (8 samples)
- Playwright E2E tests (18 tests)
- Example .runiq files

🚧 **Future Enhancements:**
- Template/preset browser panel with live preview
- Visual feedback for inherited properties
- Template parameter editor UI
- Preset gallery with thumbnails
- Template import/export
- Validation warnings for missing references
