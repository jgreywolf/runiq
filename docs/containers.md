# Container Support in Runiq

**Status**: ✅ Implemented and tested (October 2025)

Containers allow you to group nodes visually with a surrounding boundary box. They're essential for creating system boundary diagrams, C4 architecture diagrams, and any scenario where you need to show logical groupings of components.

## Table of Contents

- [Quick Start](#quick-start)
- [DSL Syntax](#dsl-syntax)
- [Styling Containers](#styling-containers)
- [Layout Options](#layout-options)
- [Nested Containers](#nested-containers)
- [Examples](#examples)
- [Known Limitations](#known-limitations)

## Quick Start

```runiq
diagram "Simple System Boundary"

container backend "Backend System" {
  shape api as @rounded label: "API Server"
  shape db as @cylinder label: "Database"
  api -> db
}

shape user as @actor label: "User"
user -> api : requests
```

This creates a container named "Backend System" containing an API server and database, with a user connecting from outside.

## DSL Syntax

### Basic Container

```runiq
container <id> "<label>" {
  <nodes and edges>
}
```

- **id**: Unique identifier (optional - auto-generated if omitted)
- **label**: Display name shown in the container header
- **body**: Contains shape definitions and connections

### Container with Explicit ID

```runiq
container sys1 "System 1" {
  shape A as @rounded label: "Component A"
  shape B as @rounded label: "Component B"
  A -> B
}
```

### Container without ID

```runiq
container "Auto-ID Container" {
  shape Node1 as @rect label: "Node"
}
```

The parser will auto-generate an ID (e.g., `container_1`).

### Empty Containers

```runiq
container placeholder "Future System" {}
```

Empty containers render with minimum dimensions and can be useful for planning or showing system boundaries without implementation details.

## Styling Containers

Containers support custom styling through inline properties:

### Available Style Properties

| Property          | Type                                   | Default   | Description                         |
| ----------------- | -------------------------------------- | --------- | ----------------------------------- |
| `backgroundColor` | string                                 | `#f9f9f9` | Fill color for container background |
| `borderColor`     | string                                 | `#ddd`    | Stroke color for container border   |
| `borderWidth`     | number                                 | `2`       | Width of the border in pixels       |
| `borderStyle`     | `solid` \| `dashed` \| `dotted`        | `solid`   | Border line style                   |
| `opacity`         | number (0-1)                           | `1.0`     | Transparency of the container       |
| `padding`         | number                                 | `20`      | Inner padding in pixels             |
| `labelPosition`   | `top` \| `bottom` \| `left` \| `right` | `top`     | Position of the label               |

### Styling Syntax

Style properties are specified between the label and opening brace:

```runiq
container sys "System Name"
  backgroundColor: "#e0f0ff"
  borderColor: "#0066cc"
  borderWidth: 3
  borderStyle: dashed
  padding: 30 {
  shape Node1 as @rect label: "Component"
}
```

⚠️ **Important**: The opening brace `{` must be on the same line as the last property.

### Style Examples

#### Highlighted Container

```runiq
container important "Critical System"
  backgroundColor: "#fff7e6"
  borderColor: "#ff9900"
  borderWidth: 4 {
  shape core as @hex label: "Core Service"
}
```

#### Subtle Container

```runiq
container background "Background Services"
  backgroundColor: "#fafafa"
  borderColor: "#e0e0e0"
  borderStyle: dotted
  opacity: 0.7 {
  shape worker1 as @rect label: "Worker 1"
  shape worker2 as @rect label: "Worker 2"
}
```

## Layout Options

Containers support per-container layout configuration:

### Available Layout Options

| Property    | Type                                         | Default   | Description                     |
| ----------- | -------------------------------------------- | --------- | ------------------------------- |
| `direction` | `DOWN` \| `UP` \| `RIGHT` \| `LEFT`          | `DOWN`    | Flow direction inside container |
| `spacing`   | number                                       | `50`      | Space between nodes in pixels   |
| `algorithm` | `layered` \| `force` \| `radial` \| `stress` | `layered` | ELK algorithm (advanced)        |

### Layout Syntax

```runiq
container horizontal "Side-by-Side"
  direction: RIGHT
  spacing: 80 {
  shape A as @rounded label: "Service A"
  shape B as @rounded label: "Service B"
  shape C as @rounded label: "Service C"
  A -> B -> C
}
```

## Nested Containers

Containers can be nested to show hierarchical relationships:

### Two-Level Nesting

```runiq
diagram "Nested System"

container outer "Company System" {
  shape gateway as @diamond label: "Gateway"

  container subsystem1 "Subsystem A" {
    shape comp1 as @rounded label: "Component 1"
    shape comp2 as @rounded label: "Component 2"
    comp1 -> comp2
  }

  gateway -> comp1
}
```

### Current Nesting Support

- ✅ **Parser**: Fully supports multi-level nesting
- ✅ **Renderer**: Properly renders nested container backgrounds
- ⚠️ **Layout**: Position calculations for nested containers have known issues (see [Known Limitations](#known-limitations))

## Examples

### Example 1: Simple Microservices Architecture

```runiq
diagram "Microservices System" direction: LR

container frontend "Frontend Layer"
  backgroundColor: "#e3f2fd"
  borderColor: "#1976d2" {
  shape web as @rounded label: "Web UI"
  shape mobile as @rounded label: "Mobile App"
}

container backend "Backend Services"
  backgroundColor: "#f3e5f5"
  borderColor: "#7b1fa2" {
  shape auth as @hex label: "Auth Service"
  shape api as @hex label: "API Gateway"
  shape users as @hex label: "User Service"

  api -> auth
  api -> users
}

container data "Data Layer"
  backgroundColor: "#fff3e0"
  borderColor: "#f57c00" {
  shape db as @cylinder label: "PostgreSQL"
  shape cache as @cylinder label: "Redis"
}

web -> api
mobile -> api
auth -> db
users -> db
api -> cache
```

### Example 2: C4 System Context

```runiq
diagram "E-Commerce System Context"

shape customer as @actor label: "Customer"
shape admin as @actor label: "Administrator"

container system "E-Commerce Platform"
  backgroundColor: "#bbdefb"
  borderColor: "#1976d2"
  borderWidth: 3 {
  shape web as @rounded label: "Web Application"
  shape mobile as @rounded label: "Mobile App"
  shape api as @hex label: "API Backend"

  web -> api
  mobile -> api
}

shape payment as @cloud label: "Payment Gateway"
shape email as @cloud label: "Email Service"

customer -> web : browses/purchases
admin -> web : manages
api -> payment : processes payments
api -> email : sends notifications
```

### Example 3: Multi-Region Deployment

```runiq
diagram "Multi-Region Architecture" direction: RIGHT

container us_east "US East Region"
  backgroundColor: "#e8f5e9"
  borderColor: "#388e3c"
  direction: DOWN {
  shape lb1 as @trapezoid label: "Load Balancer"
  shape app1 as @rounded label: "App Server"
  shape db1 as @cylinder label: "DB Primary"

  lb1 -> app1 -> db1
}

container us_west "US West Region"
  backgroundColor: "#fff8e1"
  borderColor: "#f57f17"
  direction: DOWN {
  shape lb2 as @trapezoid label: "Load Balancer"
  shape app2 as @rounded label: "App Server"
  shape db2 as @cylinder label: "DB Replica"

  lb2 -> app2 -> db2
}

shape cdn as @cloud label: "CDN"

cdn -> lb1
cdn -> lb2
db1 -> db2 : replication
```

### Example 4: Docker Compose Services

```runiq
diagram "Docker Stack"

container webnet "Web Network"
  backgroundColor: "#f5f5f5"
  borderColor: "#424242" {
  shape nginx as @rect label: "Nginx"
  shape app as @rounded label: "Node.js App"

  nginx -> app
}

container backend "Backend Network"
  backgroundColor: "#e0f7fa"
  borderColor: "#00796b" {
  shape api as @hex label: "FastAPI"
  shape worker as @rect label: "Celery Worker"
  shape redis as @cylinder label: "Redis"

  api -> redis
  worker -> redis
}

container storage "Storage"
  backgroundColor: "#fce4ec"
  borderColor: "#c2185b" {
  shape postgres as @cylinder label: "PostgreSQL"
  shape s3 as @storage label: "S3 Bucket"
}

app -> api
api -> postgres
worker -> postgres
app -> s3
```

## Known Limitations

### Nested Container Positioning (4 skipped tests)

**Issue**: Deep nesting (2+ levels) may result in incorrect position calculations.

**Status**:

- ✅ Parser fully supports nested containers
- ✅ Renderer correctly draws nested backgrounds
- ⚠️ Layout engine position calculations need refinement

**Affected Tests**:

- `should layout two-level nested containers` (skipped)
- `should layout three-level nested containers` (skipped)
- `should layout a complete C4 system context diagram` (skipped)
- `should respect spacing option with containers` (skipped)

**Workaround**: Keep container nesting to 1-2 levels maximum for best results.

**Technical Details**: The current implementation uses ELK's flat layout approach with container placeholders. Nested container positioning requires coordinate transformation relative to parent containers, which is partially implemented.

### Cross-Container Edges

✅ **Fully supported**: Edges can connect nodes in different containers or from outside to inside containers.

```runiq
container c1 "System A" {
  shape A as @rounded label: "Component A"
}

container c2 "System B" {
  shape B as @rounded label: "Component B"
}

A -> B  // Cross-container edge works correctly
```

### Container Size Calculation

Containers automatically size to fit their contents plus padding. Manual width/height specification is not currently supported.

## Integration Status

| Component           | Status          | Tests                     |
| ------------------- | --------------- | ------------------------- |
| Core Types          | ✅ Complete     | 50 tests                  |
| Parser (Langium)    | ✅ Complete     | 24 tests                  |
| Layout Engine (ELK) | ✅ 90% Complete | 36/40 passing (4 skipped) |
| SVG Renderer        | ✅ Complete     | 34 tests                  |
| Integration Tests   | ✅ Complete     | 4 tests                   |
| **Total**           | **✅ 95%**      | **148 tests**             |

## API Reference

### TypeScript Types

```typescript
interface ContainerDeclaration {
  type: 'container';
  id: string;
  label?: string;
  children: string[]; // Node IDs
  containers?: ContainerDeclaration[]; // Nested containers
  containerStyle?: ContainerStyle;
  layoutOptions?: ContainerLayoutOptions;
}

interface ContainerStyle {
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  borderColor?: string;
  borderWidth?: number;
  backgroundColor?: string;
  opacity?: number;
  padding?: number;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
}

interface ContainerLayoutOptions {
  algorithm?: 'layered' | 'force' | 'radial' | 'stress';
  direction?: Direction;
  spacing?: number;
}

interface PositionedContainer {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  containers?: PositionedContainer[]; // Nested
}
```

## Related Documentation

- [Layout Engine Comparison](./layout-engine-comparison.md) - ELK vs Dagre
- [Hierarchical Containers Design](./hierarchical-containers-design.md) - Original design doc
- [Shape Requirements](./shape-requirements.md) - Available shapes for use in containers

## Feedback & Contributions

Container support is newly implemented. If you encounter issues or have feature requests, please:

1. Check the [Known Limitations](#known-limitations) section
2. Review existing issues on GitHub
3. Create a new issue with:
   - Minimal reproducible DSL example
   - Expected vs actual SVG output
   - Screenshots if visual issue

---

**Last Updated**: October 15, 2025  
**Feature Status**: Production Ready (with noted limitations on deep nesting)
