# Container Templates & Presets

Reusable container patterns with templates, style presets, and inheritance.

## Overview

Runiq's container template system enables:

- **Templates**: Parameterized, reusable container definitions
- **Presets**: Named style collections for consistent theming
- **Inheritance**: Extend containers to inherit properties via `extends`
- **Composition**: Combine templates, presets, and inheritance
- **Overrides**: Inline properties override inherited styles

## Quick Start

### Basic Template

```runiq
diagram "Microservices"

template "service" {
  fillColor: "#e3f2fd"
  strokeColor: "#2196f3"
  padding: 20
}

container "Auth Service" templateId: "service" {
  shape auth as @server label: "Authentication"
}

container "Payment Service" templateId: "service" {
  shape payment as @server label: "Payment Gateway"
}
```

### Basic Preset

```runiq
diagram "Dashboard"

preset "card" {
  fillColor: "#ffffff"
  strokeColor: "#dee2e6"
  padding: 15
  shadow: true
}

container "Metrics" preset: "card" {
  shape users as @barChartVertical label: "Users: 1,250"
}

container "Revenue" preset: "card" {
  shape rev as @lineChart label: "Revenue: $2.4M"
}
```

## Templates

### Template Definition

Templates define reusable container patterns with optional parameters:

```runiq
template "microservice" {
  label: "Microservice Template"
  description: "Standard microservice container"
  fillColor: "#e8f5e9"
  strokeColor: "#4caf50"
  borderWidth: 2
  padding: 20
  shadow: true
  collapseButtonVisible: true
  resizable: true
}
```

**Template Properties**:

- `label` (string): Display name for the template
- `description` (string): Template description
- `parameters` (array): Template parameters (see below)
- All container style properties (backgroundColor, padding, etc.)

### Using Templates

Reference templates with `templateId`:

```runiq
container "User Service" templateId: "microservice" {
  shape api as @rectangle label: "User API"
  shape cache as @cylinder label: "Cache"
}

container "Order Service" templateId: "microservice" {
  shape api as @rectangle label: "Order API"
  shape db as @cylinder label: "Database"
}
```

### Template with Parameters

Define parameterized templates:

```runiq
template "dashboard-widget" {
  label: "Dashboard Widget"
  description: "Configurable dashboard component"
  parameters: [
    "title": string = "Widget",
    "height": number = 250,
    "collapsible": boolean = true,
    "theme": string = "light"
  ]
  fillColor: "#ffffff"
  padding: 15
  shadow: true
  collapseButtonVisible: true
}
```

**Parameter Types**:

- `string` - Text values
- `number` - Numeric values
- `boolean` - True/false values
- `color` - Color hex codes

**Parameter Syntax**:

```
"paramName": type = defaultValue
```

### Template Overrides

Inline properties override template defaults:

```runiq
container "Custom Service" templateId: "microservice"
  fillColor: "#f3e5f5"
  strokeColor: "#9c27b0"
{
  shape custom as @server label: "Custom API"
}
```

**Precedence**: Template style → Inline override

## Presets

### Preset Definition

Presets define named style collections:

```runiq
preset "card" {
  label: "Card Style"
  fillColor: "#ffffff"
  strokeColor: "#dee2e6"
  borderWidth: 1
  padding: 15
  shadow: true
}

preset "highlighted" {
  label: "Highlighted Section"
  fillColor: "#fff3cd"
  strokeColor: "#ffc107"
  borderWidth: 2
}

preset "panel" {
  label: "Panel Style"
  fillColor: "#f8f9fa"
  strokeColor: "#6c757d"
  padding: 20
  shadow: false
}
```

**Preset Properties**:

- `label` (string): Display name
- All container style properties (partial)

### Using Presets

Apply presets with `preset:`:

```runiq
container "Important" preset: "highlighted" {
  shape alert as @rhombus label: "Critical Alert"
}

container "Standard" preset: "panel" {
  shape data as @rectangle label: "Data"
}
```

### Built-in Presets

Runiq provides common presets:

| Preset ID     | Description           | Colors                              |
| ------------- | --------------------- | ----------------------------------- |
| `card`        | Card-style container  | White background, light gray border |
| `panel`       | Panel-style container | Light gray background               |
| `highlighted` | Emphasized container  | Yellow background, orange border    |
| `primary`     | Primary theme         | Blue background                     |
| `success`     | Success theme         | Green background                    |
| `warning`     | Warning theme         | Orange background                   |
| `error`       | Error theme           | Red background                      |

### Preset Overrides

Inline properties override preset styles:

```runiq
container "Custom Card" preset: "card"
  fillColor: "#e3f2fd"
{
  shape content as @rectangle label: "Content"
}
```

**Precedence**: Preset style → Inline override

## Container Inheritance

### Basic Inheritance

Inherit properties from another container using `extends`:

```runiq
diagram "Inheritance Example"

container "Base"
  fillColor: "#f0f0f0"
  strokeColor: "#999"
  padding: 20
{
  shape base as @rectangle label: "Base Component"
}

container "Derived"
  extends: "Base"
  strokeColor: "#2196f3"
{
  shape derived as @rectangle label: "Derived Component"
}
```

**Inherited Properties**: All container style properties from the base container

### Referencing Containers by ID

The `extends` property references a container by its ID (the container name):

```runiq
container "ServiceBase" {
  shape common as @rectangle label: "Common"
}

container "AuthService" extends: "ServiceBase" {
  shape auth as @rectangle label: "Auth"
}

container "PaymentService" extends: "ServiceBase" {
  shape payment as @rectangle label: "Payment"
}
```

### Extending Templates

Containers can extend template definitions:

```runiq
template "microservice" {
  fillColor: "#e8f5e9"
  padding: 20
}

container "EnhancedService" extends: "microservice"
  strokeColor: "#4caf50"
{
  shape api as @server label: "Enhanced API"
}
```

### Multi-level Inheritance

Create inheritance chains:

```runiq
container "Level1"
  fillColor: "#f0f0f0"
  padding: 10
{
  shape l1 as @rectangle label: "Level 1"
}

container "Level2" extends: "Level1"
  padding: 15
{
  shape l2 as @rectangle label: "Level 2"
}

container "Level3" extends: "Level2"
  padding: 20
  strokeColor: "#2196f3"
{
  shape l3 as @rectangle label: "Level 3"
}
```

**Resolution**: Level1 styles → Level2 overrides → Level3 overrides

## Combining Templates, Presets & Inheritance

### Style Precedence

When combining multiple style sources, precedence is:

**extends (lowest) → template → preset → inline (highest)**

### Template + Preset

```runiq
template "service" {
  fillColor: "#e8f5e9"
  padding: 20
}

preset "card" {
  shadow: true
  borderWidth: 1
}

container "MyService" templateId: "service" preset: "card" {
  shape api as @server label: "API"
}
```

**Resolved Style**:

- `fillColor: "#e8f5e9"` (from template)
- `padding: 20` (from template)
- `shadow: true` (from preset)
- `borderWidth: 1` (from preset)

### Template + Inheritance

```runiq
template "base-service" {
  fillColor: "#f0f0f0"
  padding: 15
}

container "Foundation" {
  strokeColor: "#999"
  shadow: false
}

container "Service" templateId: "base-service" extends: "Foundation" {
  shape api as @server label: "API"
}
```

**Resolved Style**:

- `strokeColor: "#999"` (from Foundation via extends)
- `shadow: false` (from Foundation via extends)
- `fillColor: "#f0f0f0"` (from base-service template, overrides extends)
- `padding: 15` (from base-service template, overrides extends)

### Preset + Inheritance

```runiq
container "Base"
  fillColor: "#f0f0f0"
  padding: 20
{
  shape base as @rectangle label: "Base"
}

preset "highlighted" {
  strokeColor: "#ffc107"
  borderWidth: 2
}

container "Derived" extends: "Base" preset: "highlighted" {
  shape derived as @rectangle label: "Derived"
}
```

**Resolved Style**:

- `fillColor: "#f0f0f0"` (from Base via extends)
- `padding: 20` (from Base via extends)
- `strokeColor: "#ffc107"` (from highlighted preset, overrides extends)
- `borderWidth: 2` (from highlighted preset, overrides extends)

### All Three Combined

```runiq
template "service" {
  fillColor: "#e3f2fd"
  padding: 20
}

preset "card" {
  shadow: true
  borderWidth: 1
}

container "Base"
  strokeColor: "#999"
{
  shape base as @rectangle label: "Base"
}

container "AdvancedService"
  extends: "Base"
  templateId: "service"
  preset: "card"
  padding: 25
{
  shape api as @server label: "API"
}
```

**Resolved Style** (in precedence order):

1. `strokeColor: "#999"` ← extends
2. `fillColor: "#e3f2fd"` ← template (overrides extends)
3. `padding: 20` ← template (overrides extends)
4. `shadow: true` ← preset (overrides extends + template)
5. `borderWidth: 1` ← preset (overrides extends + template)
6. `padding: 25` ← inline (overrides all)

**Final Result**:

- `fillColor: "#e3f2fd"`
- `strokeColor: "#999"`
- `borderWidth: 1`
- `padding: 25` (inline wins!)
- `shadow: true`

## Complete Examples

### Example 1: Themed Dashboard

```runiq
diagram "Analytics Dashboard"

// Define templates
template "widget" {
  label: "Dashboard Widget"
  fillColor: "#ffffff"
  borderWidth: 1
  padding: 15
  shadow: true
  collapseButtonVisible: true
  resizable: true
}

template "chart" {
  label: "Chart Container"
  fillColor: "#f8f9fa"
  padding: 20
  shadow: false
}

// Define theme presets
preset "primary" {
  strokeColor: "#2196f3"
  fillColor: "#e3f2fd"
}

preset "success" {
  strokeColor: "#4caf50"
  fillColor: "#e8f5e9"
}

preset "warning" {
  strokeColor: "#ff9800"
  fillColor: "#fff3e0"
}

// Use templates and presets
container "User Metrics" templateId: "widget" preset: "primary" {
  shape users as @barChartVertical label: "Total Users: 1,250"
  shape active as @gauge label: "Active: 987"
  shape growth as @lineChart label: "+15% growth"
}

container "Revenue" templateId: "widget" preset: "success" {
  shape monthly as @barChartVertical label: "Monthly: $125K"
  shape ytd as @pieChart label: "YTD: $2.4M"
  shape trend as @lineChart label: "↑ Trending"
}

container "Alerts" templateId: "widget" preset: "warning" {
  shape critical as @rhombus label: "2 Critical"
  shape warnings as @rhombus label: "5 Warnings"
}

container "Performance Chart" templateId: "chart" preset: "primary" {
  shape cpu as @lineChart label: "CPU Usage"
  shape memory as @lineChart label: "Memory"
  shape disk as @lineChart label: "Disk I/O"
}
```

### Example 2: Microservices Architecture

```runiq
diagram "Microservices Platform"

// Service template
template "microservice" {
  label: "Microservice"
  description: "Standard microservice container"
  fillColor: "#e3f2fd"
  strokeColor: "#2196f3"
  borderWidth: 2
  padding: 20
  collapseButtonVisible: true
  shadow: true
}

// Database template
template "database" {
  label: "Database"
  fillColor: "#fff3e0"
  strokeColor: "#ff9800"
  borderWidth: 2
  padding: 15
  shadow: true
}

// Presets for different layers
preset "frontend" {
  strokeColor: "#9c27b0"
  fillColor: "#f3e5f5"
}

preset "backend" {
  strokeColor: "#2196f3"
  fillColor: "#e3f2fd"
}

preset "data" {
  strokeColor: "#ff9800"
  fillColor: "#fff3e0"
}

// Frontend layer
container "API Gateway" templateId: "microservice" preset: "frontend" {
  shape gateway as @server label: "Gateway"
  shape auth as @rectangle label: "Auth Check"
  shape routing as @rectangle label: "Router"
}

// Backend services
container "User Service" templateId: "microservice" preset: "backend" {
  shape api1 as @rectangle label: "User API"
  shape cache1 as @cylinder label: "Cache"
}

container "Order Service" templateId: "microservice" preset: "backend" {
  shape api2 as @rectangle label: "Order API"
  shape queue as @cylinder label: "Queue"
}

// Data layer
container "Databases" templateId: "database" preset: "data" {
  shape userdb as @cylinder label: "User DB"
  shape orderdb as @cylinder label: "Order DB"
  shape analytics as @cylinder label: "Analytics"
}

// Edges
gateway -> api1
gateway -> api2
api1 -> userdb
api2 -> orderdb
```

### Example 3: Inheritance Chain

```runiq
diagram "Service Inheritance"

// Base service container
container "BaseService"
  fillColor: "#f0f0f0"
  strokeColor: "#999"
  borderWidth: 1
  padding: 15
{
  shape base as @rectangle label: "Base Component"
}

// Authenticated service extends base
container "AuthenticatedService" extends: "BaseService"
  strokeColor: "#2196f3"
  collapseButtonVisible: true
{
  shape auth as @rectangle label: "Auth Middleware"
}

// Admin service extends authenticated
container "AdminService" extends: "AuthenticatedService"
  fillColor: "#fff3cd"
  strokeColor: "#ffc107"
  borderWidth: 2
{
  shape admin as @rectangle label: "Admin Endpoint"
  shape rbac as @rectangle label: "RBAC"
}

// Connections
base -> auth
auth -> admin
```

### Example 4: Multi-Template Dashboard

```runiq
diagram "Operations Dashboard"

// Widget template
template "dashboard-widget" {
  fillColor: "#ffffff"
  borderWidth: 1
  padding: 15
  shadow: true
  collapseButtonVisible: true
}

// Section template
template "dashboard-section" {
  fillColor: "#f8f9fa"
  strokeColor: "#6c757d"
  padding: 25
  shadow: false
}

// Container for entire dashboard
container "Dashboard" templateId: "dashboard-section" {

  // Nested containers using widget template
  container "System Health" templateId: "dashboard-widget" strokeColor: "#4caf50" {
    shape cpu as @gauge label: "CPU: 45%"
    shape memory as @gauge label: "Memory: 67%"
    shape disk as @gauge label: "Disk: 23%"
  }

  container "Active Services" templateId: "dashboard-widget" strokeColor: "#2196f3" {
    shape api as @circle label: "API: Running"
    shape db as @circle label: "DB: Running"
    shape cache as @circle label: "Cache: Running"
  }

  container "Alerts" templateId: "dashboard-widget" strokeColor: "#ff9800" {
    shape errors as @rhombus label: "Errors: 2"
    shape warnings as @rhombus label: "Warnings: 7"
  }
}
```

## Template Best Practices

### 1. Naming Conventions

**Use descriptive template names**:

```runiq
// Good - Clear purpose
template "microservice-container"
template "dashboard-widget"
template "data-table"

// Avoid - Too generic
template "container1"
template "template-a"
```

### 2. Template Organization

**Group related templates**:

```runiq
// Service templates
template "api-service" { ... }
template "worker-service" { ... }
template "gateway-service" { ... }

// UI templates
template "card-widget" { ... }
template "panel-widget" { ... }
template "modal-widget" { ... }
```

### 3. Preset Theming

**Define consistent themes**:

```runiq
// Color palette
preset "primary" {
  strokeColor: "#2196f3"
  fillColor: "#e3f2fd"
}

preset "secondary" {
  strokeColor: "#6c757d"
  fillColor: "#e9ecef"
}

preset "success" {
  strokeColor: "#4caf50"
  fillColor: "#e8f5e9"
}

preset "danger" {
  strokeColor: "#f44336"
  fillColor: "#ffebee"
}
```

### 4. Minimal Templates

**Keep templates focused**:

```runiq
// Good - Focused template
template "service" {
  fillColor: "#e3f2fd"
  strokeColor: "#2196f3"
  padding: 20
}

// Avoid - Too many properties
template "everything" {
  fillColor: "#e3f2fd"
  strokeColor: "#2196f3"
  padding: 20
  margin: 10
  shadow: true
  borderWidth: 2
  borderStyle: "dashed"
  collapseButtonVisible: true
  resizable: true
  // ... too many properties
}
```

### 5. Template Parameters

**Use parameters for variations**:

```runiq
template "sized-container" {
  parameters: [
    "width": number = 300,
    "height": number = 200,
    "padding": number = 15
  ]
  fillColor: "#ffffff"
  borderWidth: 1
}
```

### 6. Inheritance Depth

**Limit inheritance chains**:

```runiq
// Good - 2-3 levels max
container "Base" { ... }
container "Level2" extends: "Base" { ... }
container "Level3" extends: "Level2" { ... }

// Avoid - Deep chains (hard to debug)
container "Level5" extends: "Level4" { ... }
container "Level6" extends: "Level5" { ... }
```

### 7. Documentation

**Document templates with labels and descriptions**:

```runiq
template "microservice" {
  label: "Microservice Container"
  description: "Standard container for microservices with collapse and resize"
  fillColor: "#e3f2fd"
  strokeColor: "#2196f3"
  padding: 20
  collapseButtonVisible: true
  resizable: true
}
```

## Template Properties Reference

### Template Definition Properties

| Property         | Type   | Required | Description                |
| ---------------- | ------ | -------- | -------------------------- |
| `id`             | string | Yes      | Unique template identifier |
| `label`          | string | No       | Display name               |
| `description`    | string | No       | Template description       |
| `parameters`     | array  | No       | Template parameters        |
| `containerStyle` | object | No       | Default container styles   |

### Parameter Properties

| Property       | Type                                         | Required | Description           |
| -------------- | -------------------------------------------- | -------- | --------------------- |
| `name`         | string                                       | Yes      | Parameter name        |
| `type`         | `string` \| `number` \| `boolean` \| `color` | Yes      | Parameter type        |
| `defaultValue` | any                                          | No       | Default value         |
| `description`  | string                                       | No       | Parameter description |

### Preset Definition Properties

| Property | Type   | Required | Description                |
| -------- | ------ | -------- | -------------------------- |
| `id`     | string | Yes      | Unique preset identifier   |
| `label`  | string | No       | Display name               |
| `style`  | object | Yes      | Container style properties |

### Container Usage Properties

| Property     | Type   | Description                                        |
| ------------ | ------ | -------------------------------------------------- |
| `templateId` | string | Reference to template ID                           |
| `preset`     | string | Reference to preset ID                             |
| `extends`    | string | Reference to container/template ID to inherit from |

## Style Resolution Algorithm

When a container uses templates, presets, and inheritance, styles are resolved in this order:

1. **Base Styles** (from `extends`)
   - Recursively resolve extended container/template
   - All properties inherited

2. **Template Styles** (from `templateId`)
   - Apply template's `containerStyle` properties
   - Overrides base styles

3. **Preset Styles** (from `preset`)
   - Apply preset's `style` properties
   - Overrides base + template styles

4. **Inline Styles**
   - Apply properties defined directly on container
   - Highest priority, overrides all

**Example Resolution**:

```typescript
// Pseudocode for style resolution
function resolveContainerStyle(container, diagram) {
  let style = {};

  // 1. Apply extended container's styles
  if (container.extends) {
    const base = findContainer(container.extends);
    style = { ...style, ...resolveContainerStyle(base, diagram) };
  }

  // 2. Apply template styles
  if (container.templateId) {
    const template = findTemplate(container.templateId);
    style = { ...style, ...template.containerStyle };
  }

  // 3. Apply preset styles
  if (container.preset) {
    const preset = findPreset(container.preset);
    style = { ...style, ...preset.style };
  }

  // 4. Apply inline styles (highest priority)
  style = { ...style, ...container.containerStyle };

  return style;
}
```

## TypeScript API

### Template Types

```typescript
/**
 * Container template definition
 */
interface ContainerTemplate {
  id: string;
  label?: string;
  description?: string;
  parameters?: TemplateParameter[];
  containerStyle?: ContainerStyle;
  children?: string[];
}

/**
 * Template parameter
 */
interface TemplateParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'color';
  defaultValue?: string | number | boolean;
  description?: string;
}

/**
 * Container preset definition
 */
interface ContainerPreset {
  id: string;
  label?: string;
  style: Partial<ContainerStyle>;
}

/**
 * Container with template/preset usage
 */
interface ContainerDeclaration {
  type: 'container';
  id: string;
  label?: string;
  children: Node[];
  containerStyle?: {
    templateId?: string;
    preset?: string;
    extends?: string;
    // ... other style properties
  };
}
```

### Style Resolution Function

```typescript
import { resolveContainerStyle } from '@runiq/renderer-svg';

/**
 * Resolve container style with precedence
 */
function resolveContainerStyle(
  container: ContainerDeclaration,
  diagram: DiagramAst
): ContainerStyle {
  // Returns fully resolved style
  // Handles: extends → template → preset → inline
}
```

## See Also

- **[Containers Guide](/guide/containers)** - Complete container system documentation
- **[Data-Driven Diagrams](/reference/data-driven)** - Template-based diagram generation
- **[Styling](/guide/styling)** - General styling reference
- **[Component Diagrams](/guide/component-diagrams)** - UML component templates
