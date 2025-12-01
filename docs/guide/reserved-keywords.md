---
title: Reserved Keywords
description: Complete reference of Runiq DSL reserved keywords and their purposes
lastUpdated: 2025-11-17
---

# Reserved Keywords

This guide documents all reserved keywords in the Runiq DSL, explaining why each is reserved and how it's used. Understanding reserved keywords helps avoid naming conflicts and ensures proper syntax.

## Overview

Reserved keywords fall into several categories:

- **Profile Types** - Define document structure and specialized diagram types
- **Statement Types** - Core building blocks (shapes, edges, containers, etc.)
- **Control Flow** - Data-driven iteration and conditional logic
- **Properties** - Built-in properties for styling and configuration
- **Layout & Routing** - Graph layout and edge routing directives
- **GlyphSet Items** - SmartArt-style template elements
- **Profile-Specific** - Keywords specific to electrical, digital, timeline, etc.

::: tip Using Keywords as Identifiers
Many common words are allowed as node IDs through the `FlexibleID` system. See [FlexibleID Keywords](#flexibleid-allowlist) below.
:::

## Profile Type Keywords

These keywords define the type of profile (document section) being created.

### `diagram`

**Purpose**: Creates a visual diagram profile for flowcharts, architecture diagrams, and general-purpose visualizations.

**Why Reserved**: Entry point for the most common Runiq document type. Contains shapes, edges, containers, and layout directives.

**Usage**:

```runiq
diagram "My Flowchart" {
  shape start as @stadium label: "Start"
  shape end as @stadium label: "End"
  start -> end
}
```

### `electrical` / `schematic`

**Purpose**: Creates an analog circuit profile for electrical schematics (accepts both keywords).

**Why Reserved**: Specialized profile for SPICE-compatible circuit definitions with parts, nets, and analyses.

**Usage**:

```runiq
electrical "Amplifier Circuit" {
  net VCC, GND, IN, OUT
  part R1 type: R value: 10k pins: (VCC, OUT)
  part C1 type: C value: 100n pins: (IN, GND)
  analysis tran "0 10m"
}
```

### `digital`

**Purpose**: Creates a digital circuit profile for logic designs (Verilog/VHDL-compatible).

**Why Reserved**: Specialized profile for digital logic with modules, instances, and digital nets.

**Usage**:

```runiq
digital "Counter" {
  module Counter ports: (clk, reset, count[7:0])
  inst U1 module: Counter
}
```

### `wardley`

**Purpose**: Creates a Wardley Map profile for strategic business mapping.

**Why Reserved**: Specialized profile with value chain positioning and evolution stages.

**Usage**:

```runiq
wardley "Business Strategy" {
  component "Customer" position: (0.95, 0.9)
  component "Web App" position: (0.65, 0.7)
  evolve "Web App" from: "custom" to: "product"
}
```

### `sequence`

**Purpose**: Creates a UML sequence diagram profile for message exchanges.

**Why Reserved**: Specialized profile for actor-to-actor message flows with lifelines.

**Usage**:

```runiq
sequence "Authentication Flow" {
  actor User
  participant Auth
  participant DB

  User -> Auth: login(credentials)
  Auth -> DB: validateUser()
  DB --> Auth: userRecord
  Auth --> User: authToken
}
```

### `pneumatic` / `hydraulic`

**Purpose**: Creates fluid power system profiles (ISO 1219 standard).

**Why Reserved**: Specialized profiles for pneumatic and hydraulic circuit diagrams.

**Usage**:

```runiq
pneumatic "Air Compressor System" {
  component C1 type: compressor
  component V1 type: valve_3_2
  pipe C1.out -> V1.in
}
```

### `pid`

**Purpose**: Creates Piping & Instrumentation Diagram (P&ID) profiles.

**Why Reserved**: Specialized profile for process engineering diagrams.

**Usage**:

```runiq
pid "Chemical Process" {
  equipment Tank1 type: tank
  instrument TT101 type: temperature_transmitter
  pipe Tank1.out -> TT101.in
}
```

### `timeline`

**Purpose**: Creates timeline/Gantt chart profiles for project schedules.

**Why Reserved**: Specialized profile for temporal visualization with events and periods.

**Usage**:

```runiq
timeline "Project Schedule" {
  event kickoff date: "2024-01-15" label: "Project Start"
  period planning startDate: "2024-01-15" endDate: "2024-02-28" label: "Planning"
}
```

### `glyphset`

**Purpose**: Creates SmartArt-style diagram templates with structured data.

**Why Reserved**: Specialized profile for template-driven diagrams (process flows, org charts, matrices).

**Usage**:

```runiq
glyphset process "Development Process" {
  step "Planning"
  step "Design"
  step "Implementation"
  step "Testing"
}
```

## Statement Type Keywords

These keywords create major structural elements within profiles.

### `shape`

**Purpose**: Declares a node/vertex in a diagram with a specific visual shape.

**Why Reserved**: Core building block of visual diagrams. All diagrams are composed of shapes and edges.

**Usage**:

```runiq
shape myNode as @rectangle label: "Process Step"
shape server as @server label: "API Server" icon: fa/server
```

### `edge`

**Purpose**: Declares an explicit edge connection with detailed properties.

**Why Reserved**: While `->` is the shorthand syntax, `edge` keyword allows specifying source node, target node, labels, and styling.

**Usage**:

```runiq
edge myNode -> server label: "HTTP Request" style: dashed
```

### `container`

**Purpose**: Creates a hierarchical grouping of shapes with visual boundaries.

**Why Reserved**: Essential for C4 diagrams, BPMN processes, architecture boundaries, and nested structures.

**Usage**:

```runiq
container "Backend Services" fillColor: "#e3f2fd" padding: 20 {
  shape api as @server label: "REST API"
  shape db as @cylinder label: "Database"
  api -> db
}
```

### `group`

**Purpose**: Creates a logical grouping of nodes (deprecated in favor of `container`).

**Why Reserved**: Legacy syntax for grouping; maintained for backward compatibility.

**Usage**:

```runiq
group backend [api, db, cache]
```

### `style`

**Purpose**: Defines a reusable named style that can be applied to multiple shapes.

**Why Reserved**: Enables style reuse and consistent theming across diagrams.

**Usage**:

```runiq
style highlight {
  fill: "#ffeb3b"
  strokeColor: "#f57c00"
  strokeWidth: 3
}

shape important as @rectangle label: "Critical" style: highlight
```

### `template`

**Purpose**: Defines a reusable container template with parameters (Phase 5 feature).

**Why Reserved**: Enables parameterized container patterns for microservices, components, etc.

**Usage**:

```runiq
template "microservice" {
  parameters: [
    "serviceName": string = "Service",
    "replicas": number = 3
  ]
  fillColor: "#e8f5e9"
  strokeColor: "#4caf50"
  padding: 15
}

container "Auth Service" templateId: "microservice" {
  shape auth as @server label: "Authentication"
}
```

### `preset`

**Purpose**: Defines a named style preset for containers (Phase 5 feature).

**Why Reserved**: Enables consistent container styling with named presets.

**Usage**:

```runiq
preset "card" {
  fillColor: "#ffffff"
  strokeColor: "#dee2e6"
  padding: 15
  shadow: true
}

container "Metrics" preset: "card" {
  shape chart as @barChartVertical label: "Users"
}
```

## Control Flow Keywords

Keywords for data-driven diagram generation.

### `data`

**Purpose**: Property name for data binding to external data sources or inline data arrays.

**Why Reserved**: Core property for data-driven shapes (charts, dynamic nodes).

**Usage**:

```runiq
shape sales as @pie-chart label: "Q4 Sales" data: [45, 30, 25]

data source salesData from: "api.json" key: "sales"
```

::: tip
`data` is allowed as a node ID through FlexibleID, so you can write: `shape data as @rectangle`
:::

### `for`

**Purpose**: Starts a for-each loop for iterating over data sources.

**Why Reserved**: Essential for generating multiple shapes from arrays or CSV data.

**Usage**:

```runiq
data source users from: "users.csv"

for user in users {
  shape {{user.id}} as @actor label: "{{user.name}}"
}
```

### `in`

**Purpose**: Used in for-each loops to specify the iteration variable.

**Why Reserved**: Part of `for ... in ...` loop syntax.

**Usage**:

```runiq
for item in dataSource {
  // Generate shapes dynamically
}
```

### `if`

**Purpose**: Conditional logic for data-driven generation (planned feature).

**Why Reserved**: Future conditional rendering based on data values.

**Usage** (planned):

```runiq
for user in users {
  if {{user.active}} {
    shape {{user.id}} as @actor label: "{{user.name}}"
  }
}
```

### `loop`

**Purpose**: Alternative loop keyword (reserved for future use).

**Why Reserved**: May support different loop types (while, do-while) in future versions.

### `call`

**Purpose**: Invokes a template or macro (reserved for future use).

**Why Reserved**: Planned feature for template composition and reuse.

## Layout & Routing Keywords

Keywords that control graph layout and edge routing.

### `direction`

**Purpose**: Sets the primary layout direction for the diagram.

**Why Reserved**: Critical for controlling whether diagrams flow left-to-right, top-to-bottom, etc.

**Usage**:

```runiq
diagram "Flowchart" {
  direction LR  // Left to Right

  shape start as @stadium label: "Start"
  shape end as @stadium label: "End"
  start -> end
}
```

**Valid Values**: `LR` (left-right), `RL` (right-left), `TB` (top-bottom), `BT` (bottom-top)

### `routing`

**Purpose**: Sets the edge routing algorithm for the diagram.

**Why Reserved**: Controls how edges are drawn (straight, orthogonal, curved).

**Usage**:

```runiq
diagram "Architecture" {
  routing orthogonal

  shape a as @rectangle label: "A"
  shape b as @rectangle label: "B"
  a -> b
}
```

**Valid Values**: `orthogonal`, `polyline`, `splines`, `straight`

### `algorithm`

**Purpose**: Container-specific layout algorithm (used in container blocks).

**Why Reserved**: Each container can use different layout algorithms (force-directed, radial, hierarchical).

**Usage**:

```runiq
container "Network" algorithm: force spacing: 60 {
  shape n1 as @circle label: "Node 1"
  shape n2 as @circle label: "Node 2"
  n1 -> n2
}
```

**Valid Values**: `force`, `radial`, `hierarchical`, `layered`

## Property Keywords

Common property names used throughout Runiq.

### `label`

**Purpose**: Human-readable text displayed on shapes, edges, or containers.

**Why Reserved**: Universal property for text annotation.

**Usage**:

```runiq
shape server as @server label: "API Server"
edge a -> b label: "HTTP Request"
```

::: tip
`label` is allowed as a node ID through FlexibleID.
:::

### `name`

**Purpose**: Alternative to label or identifier name in some contexts.

**Why Reserved**: Used in various profiles for naming components, modules, or entities.

**Usage**:

```runiq
module Counter name: "Counter8bit"
```

::: tip
`name` is allowed as a node ID through FlexibleID.
:::

### `id`

**Purpose**: Explicit identifier property in some contexts.

**Why Reserved**: Used in timeline events, GlyphSet items, and other structured elements.

**Usage**:

```runiq
event kickoff id: "evt1" date: "2024-01-15"
```

::: tip
`id` is allowed as a node ID through FlexibleID.
:::

### `type`

**Purpose**: Specifies the type of component, part, or shape in specialized profiles.

**Why Reserved**: Critical for electrical parts, digital modules, pneumatic components.

**Usage**:

```runiq
part R1 type: R value: 10k
component Valve1 type: valve_3_2
```

::: tip
`type` is allowed as a node ID through FlexibleID.
:::

### `value`

**Purpose**: Numeric or string value for parts, parameters, or data properties.

**Why Reserved**: Universal property for assigning values to components.

**Usage**:

```runiq
part R1 type: R value: 10k
shape gauge as @gauge-circular label: "Speed" value: 75
```

::: tip
`value` is allowed as a node ID through FlexibleID.
:::

### `color`

**Purpose**: Color property for styling or data visualization.

**Why Reserved**: Universal styling property across all profiles.

**Usage**:

```runiq
shape box as @rectangle label: "Alert" color: "#ff0000"
period planning color: "#e0e7ff"
```

::: tip
`color` is allowed as a node ID through FlexibleID.
:::

### `icon`

**Purpose**: Specifies an icon from FontAwesome or other icon libraries.

**Why Reserved**: Common visual enhancement property.

**Usage**:

```runiq
shape user as @actor label: "User" icon: fa/user
shape server as @server label: "API" icon: fa/server
```

### `link`

**Purpose**: Hyperlink URL for clickable shapes.

**Why Reserved**: Enables interactive diagrams with navigation.

**Usage**:

```runiq
shape docs as @rectangle label: "Documentation" link: "https://runiq.dev"
```

### `header`

**Purpose**: Header row indicator in CSV data sources.

**Why Reserved**: Controls CSV parsing behavior.

**Usage**:

```runiq
data source users from: "users.csv" header: true delimiter: ","
```

### `delimiter`

**Purpose**: Delimiter character for CSV parsing.

**Why Reserved**: Configures CSV data source parsing.

**Usage**:

```runiq
data source data from: "data.tsv" delimiter: "\t"
```

### `format`

**Purpose**: Format specification for data rendering or parsing.

**Why Reserved**: Controls how values are displayed or interpreted.

**Usage**:

```runiq
shape date as @rectangle label: "Date" value: "2024-01-15" format: "YYYY-MM-DD"
```

## Data Source Keywords

Keywords for data-driven diagram generation.

### `source`

**Purpose**: Defines a data source for dynamic shape generation.

**Why Reserved**: Part of data-driven syntax `data source ... from: "file.json"`.

**Usage**:

```runiq
data source users from: "users.json" key: "employees"

for user in users {
  shape {{user.id}} as @actor label: "{{user.name}}"
}
```

### `from`

**Purpose**: Specifies the source file or URL for data binding.

**Why Reserved**: Required property in data source declarations.

**Usage**:

```runiq
data source inventory from: "inventory.csv"
```

::: tip
`from` is allowed as a node ID through FlexibleID.
:::

### `to`

**Purpose**: Specifies target node in edge declarations or range endpoints.

**Why Reserved**: Part of edge syntax and data filtering.

**Usage**:

```runiq
edge source to: target label: "Connection"
```

::: tip
`to` is allowed as a node ID through FlexibleID.
:::

### `key`

**Purpose**: JSON path or property key for extracting nested data.

**Why Reserved**: Enables navigation into nested JSON structures.

**Usage**:

```runiq
data source employees from: "company.json" key: "departments.engineering.employees"
```

::: tip
`key` is allowed as a node ID through FlexibleID.
:::

### `filter`

**Purpose**: Filter expression for data sources (planned feature).

**Why Reserved**: Future support for filtering data before iteration.

**Usage** (planned):

```runiq
data source activeUsers from: "users.json" filter: "status == 'active'"
```

::: tip
`filter` is allowed as a node ID through FlexibleID.
:::

### `limit`

**Purpose**: Limits the number of items from a data source (planned feature).

**Why Reserved**: Future support for limiting dataset size.

**Usage** (planned):

```runiq
data source topTen from: "rankings.json" limit: 10
```

::: tip
`limit` is allowed as a node ID through FlexibleID.
:::

## GlyphSet Keywords

Keywords specific to SmartArt-style glyphset profiles.

### GlyphSet Item Types

These keywords define the type of item in a glyphset structure:

- `step` - Process step in a flow
- `item` - Generic item
- `person` - Person in an org chart or relationship diagram
- `level` - Hierarchical level
- `stage` - Stage in a process
- `event` - Event in a timeline
- `quadrant` - Quadrant in a matrix
- `circle` - Circle in a cycle
- `node` - Generic node
- `group` - Group container
- `side` - Side of a balance/comparison
- `left` / `right` - Left/right sides
- `input` / `output` - Input/output elements
- `center` - Center element
- `spoke` - Spoke in a radial diagram
- `team` - Team in an org structure
- `root` - Root node
- `child` - Child node
- `leader` - Leader in a hierarchy
- `member` - Team member

**Why Reserved**: These are structural keywords that define semantic meaning in template-driven diagrams.

**Usage**:

```runiq
glyphset process "Workflow" {
  step "Planning"
  step "Execution"
  step "Review"
}

glyphset org "Team Structure" {
  person "CEO" {
    person "VP Engineering"
    person "VP Sales"
  }
}
```

### `image`

**Purpose**: Embeds an image in a glyphset item.

**Why Reserved**: Special item type for image-based glyphset entries.

**Usage**:

```runiq
glyphset gallery "Product Gallery" {
  image "product1.jpg" label: "Product A" description: "Best seller"
  image "product2.jpg" label: "Product B"
}
```

### `orientation`

**Purpose**: Sets orientation (horizontal/vertical) for timeline or glyphset layouts.

**Why Reserved**: Layout control for profiles that support multiple orientations.

**Usage**:

```runiq
timeline "Project Plan" {
  orientation horizontal
  event launch date: "2024-01-15"
}
```

### `relationship`

**Purpose**: Defines relationships between glyphset items (planned feature).

**Why Reserved**: Future support for explicit relationships in org charts and relationship diagrams.

**Usage** (planned):

```runiq
glyphset org "Team" {
  person "Manager" relationship: "manages"
  person "Employee1"
}
```

## Profile-Specific Keywords

### Electrical/Schematic Keywords

- `net` - Declares electrical nets (signals)
- `part` - Declares circuit parts (resistors, capacitors, etc.)
- `analysis` - Defines SPICE analysis (transient, AC, DC, etc.)
- `pins` - Pin connections for parts

**Usage**:

```runiq
electrical "Circuit" {
  net VCC, GND, OUT
  part R1 type: R value: 10k pins: (VCC, OUT)
  analysis tran "0 10m"
}
```

### Digital Keywords

- `module` - Declares a digital logic module
- `inst` - Instantiates a module
- `ports` - Module port list
- `params` - Module parameters

**Usage**:

```runiq
digital "Counter" {
  module Counter ports: (clk, reset, out[7:0])
  inst U1 module: Counter
}
```

### Wardley Keywords

- `component` - Business component in value chain
- `position` - Position in evolution/value axis
- `evolve` - Evolution arrow between stages
- `anchor` - Anchor point for value chain

**Usage**:

```runiq
wardley "Strategy" {
  component "Customer" position: (0.95, 0.9)
  component "Web App" position: (0.65, 0.7)
  evolve "Web App" from: "custom" to: "product"
}
```

### Sequence Diagram Keywords

- `actor` - Human actor in sequence diagram
- `participant` - System participant
- `message` - Explicit message (or use `->`)
- `activate` / `deactivate` - Lifeline activation
- `note` - Annotations

**Usage**:

```runiq
sequence "Login" {
  actor User
  participant Auth

  User -> Auth: login()
  activate Auth
  Auth --> User: token
  deactivate Auth
}
```

### Timeline Keywords

- `event` - Point event in timeline
- `period` - Time period/span
- `date` - Event date
- `startDate` / `endDate` - Period boundaries
- `position` - Position (top/bottom/left/right)
- `opacity` - Visual opacity

**Usage**:

```runiq
timeline "Project" {
  event kickoff date: "2024-01-15" label: "Start"
  period planning startDate: "2024-01-15" endDate: "2024-02-28"
}
```

### Pneumatic/Hydraulic Keywords

- `component` - Pneumatic/hydraulic component
- `pipe` - Fluid connection
- `pressure` - Pressure specification
- `flow` - Flow rate
- `unit` - Unit of measurement

**Usage**:

```runiq
pneumatic "System" {
  component C1 type: compressor
  component V1 type: valve_3_2
  pipe C1.out -> V1.in pressure: 6 unit: bar
}
```

## Special Operators

### `as`

**Purpose**: Binds a shape declaration to a shape type.

**Why Reserved**: Core syntax element for shape declarations.

**Usage**:

```runiq
shape myNode as @rectangle label: "Node"
```

### `->`

**Purpose**: Edge connection operator (shorthand for edge declaration).

**Why Reserved**: Primary syntax for creating connections between shapes.

**Usage**:

```runiq
shape a as @rectangle label: "A"
shape b as @rectangle label: "B"
a -> b
```

### `-->`

**Purpose**: Dashed edge operator (shorthand for dashed edge).

**Why Reserved**: Visual distinction for return messages, async calls, etc.

**Usage**:

```runiq
a -> b label: "Request"
b --> a label: "Response"
```

## Container-Specific Keywords

### `extends`

**Purpose**: Inherits styles from another container (Phase 5 feature).

**Why Reserved**: Enables container inheritance and style composition.

**Usage**:

```runiq
container "Base" fillColor: "#f0f0f0" padding: 20 {
  shape base as @rectangle label: "Base"
}

container "Extended" extends: "Base" strokeColor: "#2196f3" {
  shape extended as @rectangle label: "Extended"
}
```

### `templateId`

**Purpose**: Applies a container template by ID (Phase 5 feature).

**Why Reserved**: Links container to a template definition.

**Usage**:

```runiq
template "service" {
  fillColor: "#e3f2fd"
  padding: 20
}

container "API" templateId: "service" {
  shape api as @server label: "REST API"
}
```

### Container Style Properties

These are reserved as container properties (not available in generic `style` blocks):

- `padding` - Internal padding (use `margin` in styles)
- `borderStyle` - Border style (use `lineStyle` for edges)
- `strokeColor` - Border color
- `strokeWidth` - Border width
- `fillColor` - Background color
- `opacity` - Container opacity (use `fillOpacity`/`strokeOpacity` in styles)
- `shadow` - Drop shadow effect
- `resizable` - User-resizable flag
- `collapsed` - Collapsed state
- `collapseButtonVisible` - Show/hide collapse button

**Why Reserved**: These properties have specific meaning in container context and different semantics than generic style properties.

## FlexibleID Allowlist

The following keywords are **allowed** as node IDs through the FlexibleID system to prevent common naming conflicts:

**Data-Driven Keywords**:

- `data`, `from`, `to`, `key`, `source`, `filter`, `limit`

**Property Keywords**:

- `label`, `name`, `id`, `type`, `value`, `format`, `color`, `header`, `delimiter`

**Control Flow Keywords**:

- `for`, `in`, `if`, `loop`, `call`

**Common Node Names**:

- `start`, `end`, `done`, `process`, `mobile`, `m`, `f`, `step`, `action`
- `input`, `output`, `config`, `settings`, `api`, `db`, `cache`, `queue`

**Usage Example**:

```runiq
# These are all valid despite using keywords
shape data as @cylinder label: "Data Store"
shape input as @parallelogram label: "User Input"
shape process as @rectangle label: "Process Step"
shape output as @parallelogram label: "Results"
shape end as @stadium label: "End"

data -> process
input -> process
process -> output
output -> end
```

## Keywords NOT Allowed as Node IDs

The following keywords **cannot** be used as node IDs because they have structural meaning:

- `diagram`, `shape`, `edge`, `container`, `group`, `style`, `template`, `preset`
- Profile types: `electrical`, `schematic`, `digital`, `wardley`, `sequence`, `pneumatic`, `hydraulic`, `pid`, `timeline`, `glyphset`
- Operators: `as`, `->`, `-->`
- Layout keywords when used as standalone statements: `direction`, `routing`

## Best Practices

### 1. Avoid Overriding Reserved Keywords

While FlexibleID allows some keywords as node IDs, prefer descriptive names:

```runiq
# ✅ Good: Descriptive names
shape userInput as @parallelogram label: "User Input"
shape dataStore as @cylinder label: "Database"

# ⚠️ Allowed but unclear
shape input as @parallelogram label: "User Input"
shape data as @cylinder label: "Database"
```

### 2. Use Semantic Names

Choose names that describe the purpose, not the keyword:

```runiq
# ✅ Good: Purpose-driven
shape authService as @server label: "Authentication Service"
shape userDB as @cylinder label: "User Database"

# ❌ Avoid: Generic keywords
shape server as @server label: "Server"
shape db as @cylinder label: "Database"
```

### 3. Check the Profile Type

Different profiles have different reserved keywords. When working with specialized profiles (electrical, sequence, etc.), review that profile's specific keywords.

### 4. Property Syntax Matters

Remember that **node properties** have no space before the colon, while **style properties** do:

```runiq
# Node properties - NO SPACE
shape node as @rectangle label:"Text" color:"#ff0000"

# Style properties - WITH SPACE
style myStyle {
  fill: "#ff0000"
  strokeColor: "#000000"
}
```

## Reserved vs. User-Defined

| Category              | Reserved                           | User-Defined                                                    |
| --------------------- | ---------------------------------- | --------------------------------------------------------------- |
| **Node IDs**          | Profile types, structural keywords | Anything else (including many property keywords via FlexibleID) |
| **Style Names**       | None                               | Any valid identifier                                            |
| **Template IDs**      | None                               | Any valid string                                                |
| **Preset IDs**        | None                               | Any valid string                                                |
| **Data Source Names** | None                               | Any valid identifier                                            |
| **Container IDs**     | None                               | Any valid identifier or string                                  |

## Summary

- **~50 core keywords** for structural elements (diagram, shape, container, etc.)
- **~30 property keywords** (label, color, icon, etc.) - many usable as node IDs via FlexibleID
- **~25 profile-specific keywords** (net, part, component, event, etc.)
- **~20 GlyphSet item keywords** (step, person, level, etc.)
- **~15 data-driven keywords** (data, for, in, source, etc.) - most usable as node IDs

**Key Takeaway**: While Runiq has many reserved keywords for structure and semantics, the FlexibleID system allows most common property keywords to be used as node identifiers, reducing naming conflicts in practice.

## See Also

- [DSL Syntax Reference](/reference/dsl) - Complete syntax guide
- [Containers Guide](/guide/containers) - Container templates and presets
- [Profile Types](/guide/profiles) - Specialized diagram profiles
