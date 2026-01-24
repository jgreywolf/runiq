# Runiq DSL Syntax Quick Reference

## Complete Syntax Rules

### 1. Diagram Structure

```runiq
diagram "Name" {
  // content here
}
```

- MUST have curly braces `{ }`
- Direction goes inside body

**Optional: Specify a color theme:**

```runiq
diagram "My Architecture" {
  theme ocean
  direction LR
  // shapes automatically use ocean theme colors
}
```

**Available Themes:**

- `runiq` (default - official brand), `professional`, `forest`, `sunset`, `ocean`, `monochrome`, `colorful`, `vibrant`, `warm`, `cool`

Themes are supported in the `diagram` profile. The `glyphset` profile supports a `theme` parameter.

See [Themes Guide](guide/themes.md) for complete theme documentation and examples.

### 2. Direction

```runiq
direction LR  // or RL, TB, BT
```

### 3. Style Declarations

```runiq
style name property: "value" property: number
```

**IMPORTANT**: Style keys end with `:` (e.g. `fillColor:`). Values can be strings, numbers, or IDs.

Examples:

```runiq
style default fill: "#f0f8ff" strokeColor: "#4682b4" fontSize: 14
style highlight fill: "#fffacd" strokeColor: "#daa520"
style link strokeColor: "#2a6fdb" strokeWidth: 2
```

### 4. Shape Declarations

```runiq
shape id as @type property:"value" property:number
```

**IMPORTANT**: Node properties have **NO SPACE before colon**

Examples:

```runiq
shape start as @rounded label:"Start" style:highlight
shape user as @actor label:"User" icon:fa/user link:"/profile"
shape data as @pie-chart label:"Sales" data:[30,45,25]
```

### 5. Container Declarations

```runiq
container id "Label" property:"value" property:number {
  // shapes and edges here
}
```

**IMPORTANT**: Container properties have **NO SPACE before colon**, all on one line

Examples:

```runiq
container backend "Backend" fillColor:"#e3f2fd" strokeColor:"#1976d2" strokeWidth:3 {
  shape api as @hexagon label:"API"
}

container "Network" algorithm:force spacing:60 {
  shape server1 as @server label:"Server 1"
}
```

### 6. Edge Declarations

**Simple edge** (no label):

```runiq
source -> target
```

**Labeled edge**:
There are two methods to define the label for an edge. Either inline with the arrow declaration, or as a separate "label" property

```runiq
source -labeltext-> target
```

```runiq
source -> target label: "labeltext"
```

**Edge with properties**:

```runiq
source -> target lineStyle:"solid" arrowType:none
```

**UML Class Diagram Relationships** (NEW! 🎉):

```runiq
// Multiplicity (Cardinality)
Customer -> Order multiplicitySource:"1" multiplicityTarget:"0..*"

// Aggregation (hollow diamond)
Department -> Employee edgeType:aggregation multiplicitySource:"1" multiplicityTarget:"1..*"

// Composition (filled diamond)
House -> Room edgeType:composition multiplicitySource:"1" multiplicityTarget:"1..*"

// Role names
Company -> Person edgeType:association roleSource:"employer" roleTarget:"employee"

// Complete example with all properties
Customer -> Order
  edgeType: association
  multiplicitySource: "1"
  multiplicityTarget: "0..*"
  roleSource: "customer"
  roleTarget: "order"
  label: "places"
  navigability: target
  constraints: ["ordered"]
```

**Edge Types for UML**:

- `association` - Standard association line
- `aggregation` - Hollow diamond (◇) for shared ownership
- `composition` - Filled diamond (◆) for strong ownership
- `dependency` - Dashed line with arrow
- `generalization` - Inheritance (hollow triangle arrow)
- `realization` - Interface implementation (dashed line with hollow triangle)

### 7. Common Property Syntax

#### Node Properties (no space before colon)

- `label:"text"`
- `style:stylename`
- `icon:fa/iconname`
- `link:"/url"`
- `tooltip:"text"`
- `data:[values]`
- `showLegend:true`
- `showMetrics:true` - Display graph metric badge
- `metricType:degree` - Metric to display (degree, betweenness, closeness, clustering)
- `metricPosition:top-right` - Badge position (top-right, top-left, bottom-right, bottom-left)

#### Edge Properties (no space before colon)

- `lineStyle:"solid"` (or "dashed", "dotted")
- `arrowType:standard` (or hollow, open, none)
- `stereotype:"<<include>>"` (UML stereotypes)
- `edgeType:association` (or aggregation, composition, dependency, generalization, realization)
- `multiplicitySource:"1"` (cardinality at source end)
- `multiplicityTarget:"0..*"` (cardinality at target end)
- `roleSource:"employer"` (role name at source end)
- `roleTarget:"employee"` (role name at target end)
- `navigability:target` (or source, bidirectional, none)
- `constraints:["ordered","unique"]` (UML constraints)

#### Container Properties (no space before colon)

- `fillColor:"#color"`
- `strokeColor:"#color"`
- `strokeWidth:number`
- `borderStyle:solid`
- `padding:number`
- `algorithm:layered` (or force, stress, radial, mrtree)
- `spacing:number`

#### Style Properties (space before colon)

- `fill: "#color"`
- `strokeColor: "#color"`
- `strokeWidth: number`
- `fontSize: number`
- `fontFamily: "fontname"`
- `fontWeight: number`
- `textAlign: left|center|right`
- `color: "#color"`

⚠️ **RESERVED KEYWORDS - Cannot be used in generic style declarations:**

The following keywords are reserved for specific container or layout properties and **CANNOT** be used in generic `style` declarations. Use the alternatives shown:

| Reserved Keyword | Used For           | Alternative for Styles             |
| ---------------- | ------------------ | ---------------------------------- |
| `padding:`       | Container property | `margin:` or custom property       |
| `opacity:`       | Container style    | `fillOpacity:` or `strokeOpacity:` |
| `borderStyle:`   | Container property | `lineStyle:` (for edges)           |
| `strokeColor:`   | Container property | `strokeColor:` (for shapes)        |
| `strokeWidth:`   | Container property | `strokeWidth:` (for shapes)        |
| `fillColor:`     | Container property | `fill:` (for shapes)               |
| `labelPosition:` | Container label    | Custom positioning                 |
| `algorithm:`     | Container layout   | N/A (layout property only)         |
| `spacing:`       | Container layout   | N/A (layout property only)         |

**Example - Correct Usage:**

```runiq
// ✅ CORRECT - Safe properties in style declarations
style myStyle fill: "#ff0000" strokeColor: "#000000" strokeWidth: 2 fontSize: 14 fontFamily: "Arial"

// ✅ CORRECT - Reserved keywords in container declarations
container "Box" fillColor:"#e3f2fd" strokeColor:"#1976d2" strokeWidth:3 padding:20 {
  shape node1 as @rect label:"Node"
}

// ❌ WRONG - Reserved keywords in style declarations (will cause parse errors)
style badStyle padding: 10 opacity: 0.8 fillColor: "#fff"
```

## Complete Examples

### Simple Flowchart

```runiq
diagram "Simple Flowchart" {
  direction LR

  style default fill: "#f0f8ff" strokeColor: "#4682b4" fontSize: 14
  style highlight fill: "#fffacd" strokeColor: "#daa520"

  shape start as @rounded label:"Start" style:highlight
  shape process as @rect label:"Process"
  shape end as @rounded label:"End" style:highlight

  start -begin-> process
  process -complete-> end
}
```

### Container with Edges

```runiq
diagram "Microservices" {
  direction LR

  container backend "Backend" fillColor:"#f3e5f5" strokeColor:"#7b1fa2" strokeWidth:3 {
    shape api as @hexagon label:"API"
    shape db as @cylinder label:"Database"

    api -> db
  }

  shape web as @rounded label:"Web"
  web -> api
}
```

### Chart Example

```runiq
diagram "Sales Chart" {

  shape sales as @pie-chart label:"Q1-Q4 Sales" data:[{"label":"Q1","value":100},{"label":"Q2","value":150}] showLegend:true
}
```

### Graph Metrics Example

```runiq
diagram "Social Network Analysis" {

  // Display degree centrality (number of connections)
  shape alice as @person label:"Alice" showMetrics:true
  shape bob as @person label:"Bob" showMetrics:true metricType:degree

  // Display betweenness centrality (bridge nodes)
  shape charlie as @person label:"Charlie" showMetrics:true metricType:betweenness

  // Display closeness centrality (central position)
  shape diana as @person label:"Diana" showMetrics:true metricType:closeness metricPosition:top-left

  alice -> bob
  alice -> charlie
  bob -> diana
  charlie -> diana
}
```

See [Graph Metrics Reference](./reference/graph-metrics.md) for detailed information on metric types and visualization.

## Common Mistakes

### ❌ WRONG

```runiq
// Missing braces
diagram "Name"
  shape x as @rect label:"X"

// Spaces in style properties
style default fill:"#color" strokeColor:"#color"

// Space before colon in node properties
shape x as @rect label: "X"

// Multi-line container properties
container "Name"
  fillColor:"#fff"
  strokeColor:"#000" {
```

### ✅ CORRECT

```runiq
// Has braces
diagram "Name" {
  shape x as @rect label:"X"
}

// Space and quotes in style properties
style default fill: "#color" strokeColor: "#color"

// No space in node properties
shape x as @rect label:"X"

// Single-line container properties
container "Name" fillColor:"#fff" strokeColor:"#000" {
```

## Shape Names Reference

Common shapes:

- `@rounded` - Rounded rectangle
- `@rect` - Rectangle
- `@rhombus` - Diamond (decision)
- `@hex` - Hexagon
- `@circle` - Circle
- `@cyl` - Cylinder (database)
- `@actor` - Stick figure
- `@doc` - Document
- `@lean-r` - Parallelogram (input/output)
- `@server` - Server icon
- `@service` - Service icon
- `@database` - Database icon
- `@browser` - Browser icon

Control system block diagram shapes (legacy, diagram profile):

- `@box` - Simple box
- `@gain` - Gain block
- `@junction` - Summing junction
- `@transfer-fn` - Transfer function
- `@integrator` - Integrator block
- `@multiply-junction` - Multiplication point
- `@small-circle` - Small circle

Note: New control logic work should use the `control` profile with `part` and `net` syntax.

Chart shapes:

- `@pie-chart` - Pie chart
- `@bar-chart-vertical` - Vertical bar chart
- `@bar-chart-horizontal` - Horizontal bar chart

## Profile Types

- `diagram "Name" { }` - Visual diagrams (default)
- `electrical "Name" { }` - Electrical circuits (parser only, not yet rendered)
- `digital "Name" { }` - Digital circuits (parser only, not yet rendered)
- `control "Name" { }` - PLC ladder and function block diagrams
