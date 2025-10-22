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

### 2. Direction

```runiq
direction:LR  // or RL, TB, BT (no space before colon)
```

### 3. Style Declarations

```runiq
style name property: "value" property: number
```

**IMPORTANT**: Style properties have **SPACE before colon** and **quoted string values**

Examples:

```runiq
style default fill: "#f0f8ff" stroke: "#4682b4" fontSize: 14
style highlight fill: "#fffacd" stroke: "#daa520"
style link stroke: "#2a6fdb" strokeWidth: 2
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
container backend "Backend" backgroundColor:"#e3f2fd" borderColor:"#1976d2" borderWidth:3 {
  shape api as @hex label:"API"
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

```runiq
source -labeltext-> target
```

**IMPORTANT**: Label goes **inside the arrow**, not as a property

**Edge with properties**:

```runiq
source -> target lineStyle:solid arrowType:none
```

### 7. Common Property Syntax

#### Node Properties (no space before colon)

- `label:"text"`
- `style:stylename`
- `icon:fa/iconname`
- `link:"/url"`
- `tooltip:"text"`
- `data:[values]`
- `showLegend:true`

#### Container Properties (no space before colon)

- `backgroundColor:"#color"`
- `borderColor:"#color"`
- `borderWidth:number`
- `borderStyle:solid`
- `padding:number`
- `algorithm:layered` (or force, stress, radial, mrtree)
- `spacing:number`

#### Style Properties (space before colon)

- `fill: "#color"`
- `stroke: "#color"`
- `strokeWidth: number`
- `fontSize: number`
- `fontFamily: "fontname"`
- `fontWeight: number`
- `textAlign: left|center|right`
- `color: "#color"`

⚠️ **RESERVED KEYWORDS - Cannot be used in generic style declarations:**

The following keywords are reserved for specific container or layout properties and **CANNOT** be used in generic `style` declarations. Use the alternatives shown:

| Reserved Keyword   | Used For           | Alternative for Styles             |
| ------------------ | ------------------ | ---------------------------------- |
| `padding:`         | Container property | `margin:` or custom property       |
| `opacity:`         | Container style    | `fillOpacity:` or `strokeOpacity:` |
| `borderStyle:`     | Container property | `lineStyle:` (for edges)           |
| `borderColor:`     | Container property | `stroke:` (for shapes)             |
| `borderWidth:`     | Container property | `strokeWidth:` (for shapes)        |
| `backgroundColor:` | Container property | `fill:` (for shapes)               |
| `labelPosition:`   | Container label    | Custom positioning                 |
| `algorithm:`       | Container layout   | N/A (layout property only)         |
| `spacing:`         | Container layout   | N/A (layout property only)         |

**Example - Correct Usage:**

```runiq
// ✅ CORRECT - Safe properties in style declarations
style myStyle fill: "#ff0000" stroke: "#000000" strokeWidth: 2 fontSize: 14 fontFamily: "Arial"

// ✅ CORRECT - Reserved keywords in container declarations
container "Box" backgroundColor:"#e3f2fd" borderColor:"#1976d2" borderWidth:3 padding:20 {
  shape node1 as @rect label:"Node"
}

// ❌ WRONG - Reserved keywords in style declarations (will cause parse errors)
style badStyle padding: 10 opacity: 0.8 backgroundColor: "#fff"
```

## Complete Examples

### Simple Flowchart

```runiq
diagram "Simple Flowchart" {
  direction:LR

  style default fill: "#f0f8ff" stroke: "#4682b4" fontSize: 14
  style highlight fill: "#fffacd" stroke: "#daa520"

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
  direction:LR

  container backend "Backend" backgroundColor:"#f3e5f5" borderColor:"#7b1fa2" borderWidth:3 {
    shape api as @hex label:"API"
    shape db as @cyl label:"Database"

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

## Common Mistakes

### ❌ WRONG

```runiq
// Missing braces
diagram "Name"
  shape x as @rect label:"X"

// Spaces in style properties
style default fill:#color stroke:#color

// Label as edge property
source -> target label:"text"

// Space before colon in node properties
shape x as @rect label: "X"

// Multi-line container properties
container "Name"
  backgroundColor:"#fff"
  borderColor:"#000" {
```

### ✅ CORRECT

```runiq
// Has braces
diagram "Name" {
  shape x as @rect label:"X"
}

// Space and quotes in style properties
style default fill: "#color" stroke: "#color"

// Label in arrow
source -text-> target

// No space in node properties
shape x as @rect label:"X"

// Single-line container properties
container "Name" backgroundColor:"#fff" borderColor:"#000" {
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
- `@cache` - Cache icon
- `@browser` - Browser icon

Block diagram shapes:

- `@box` - Simple box
- `@gain` - Gain block
- `@junction` - Summing junction
- `@transfer-fn` - Transfer function
- `@integrator` - Integrator block
- `@multiply-junction` - Multiplication point
- `@small-circle` - Small circle

Chart shapes:

- `@pie-chart` - Pie chart
- `@bar-chart-vertical` - Vertical bar chart
- `@bar-chart-horizontal` - Horizontal bar chart

## Profile Types

- `diagram "Name" { }` - Visual diagrams (default)
- `electrical "Name" { }` - Electrical circuits (parser only, not yet rendered)
- `digital "Name" { }` - Digital circuits (parser only, not yet rendered)
