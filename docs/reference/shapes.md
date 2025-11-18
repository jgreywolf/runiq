# Shape Reference

Runiq provides **142+ shapes** across 17 categories for building professional diagrams.

## Quick Reference

| Shape             | Syntax      | Use Case                         |
| ----------------- | ----------- | -------------------------------- |
| Rectangle         | `@rect`     | Process steps, general purpose   |
| Rounded Rectangle | `@rounded`  | Terminal points (start/end)      |
| Diamond           | `@rhombus`  | Decisions, branching             |
| Hexagon           | `@hex`      | Preparation, success states      |
| Circle            | `@circle`   | Simple state, connector          |
| Ellipse           | `@ellipse`  | Elongated state                  |
| Cylinder          | `@cyl`      | Databases, storage               |
| Document          | `@doc`      | Documents, outputs               |
| Parallelogram     | `@para`     | Input/output                     |
| Trapezoid         | `@trap`     | Manual operation                 |
| Cloud             | `@cloud`    | Cloud services, external systems |
| Pentagon          | `@pent`     | Process container                |
| Triangle          | `@triangle` | Flow direction                   |
| Octagon           | `@octagon`  | Stop, halt                       |
| Star              | `@star`     | Special events                   |

[See all 142+ shapes below ↓](#all-shapes)

## Shape Categories by Profile

Shapes are organized by their primary use case and profile. Most shapes work across profiles, but some are specialized for specific diagram types.

---

## Categories

### 1. Basic Shapes (19 shapes)

**Profile:** `diagram` (default)

Fundamental geometric shapes for general-purpose diagramming:

| Shape             | Syntax              | Description               |
| ----------------- | ------------------- | ------------------------- |
| Rectangle         | `@rectangle`        | Standard rectangle        |
| Rounded Rectangle | `@roundedRectangle` | Rounded corners rectangle |
| Circle            | `@circle`           | Standard circle           |
| Small Circle      | `@smallCircle`      | Smaller circle variant    |
| Double Circle     | `@doubleCircle`     | Concentric circles        |
| Framed Circle     | `@framedCircle`     | Circle with inner frame   |
| Cross Circle      | `@crossCircle`      | Circle with cross         |
| Filled Circle     | `@filledCircle`     | Solid filled circle       |
| Ellipse Wide      | `@ellipseWide`      | Horizontal ellipse        |
| Rhombus           | `@rhombus`          | Diamond shape             |
| Hexagon           | `@hex`              | Six-sided polygon         |
| Stadium           | `@stadium`          | Pill/capsule shape        |
| Triangle          | `@triangle`         | Pointing up triangle      |
| Flipped Triangle  | `@flippedTriangle`  | Pointing down triangle    |
| Parallelogram     | `@parallelogram`    | Slanted rectangle         |
| Trapezoid         | `@trapezoid`        | Trapezoid shape           |
| Flipped Trapezoid | `@flippedTrapezoid` | Inverted trapezoid        |
| Star              | `@star`             | Five-pointed star outline |
| Star Filled       | `@starFilled`       | Five-pointed star filled  |
| Octagon           | `@octagon`          | Eight-sided polygon       |
| Plus              | `@plus`             | Plus/cross symbol         |

**Example:**

```runiq
diagram "Basic Shapes" {
  shape box as @rectangle label: "Process"
  shape start as @roundedRectangle label: "Start"
  shape decision as @rhombus label: "Check?"
  shape state as @circle label: "A"
}
```

### 2. Flowchart Shapes (14 shapes)

**Profile:** `diagram` (default)

Specialized flowchart symbols following ISO 5807 standard:

| Shape              | Syntax               | Description                    |
| ------------------ | -------------------- | ------------------------------ |
| Document           | `@document`          | Single document with wave base |
| Lined Document     | `@linedDocument`     | Document with lines            |
| Multi-Document     | `@multiDocument`     | Stack of documents             |
| Tagged Document    | `@taggedDocument`    | Document with tag              |
| Predefined Process | `@predefinedProcess` | Subprocess box                 |
| Preparation Alt    | `@preparationAlt`    | Alternative preparation        |
| Manual Input       | `@manualInput`       | Keyboard/manual entry          |
| Decision Manual    | `@decisionManual`    | Manual decision diamond        |
| Delay              | `@delay`             | Time delay symbol              |
| Display            | `@display`           | Screen/monitor output          |
| Off-Page Connector | `@offPageConnector`  | Continuation to another page   |
| Card               | `@card`              | Punch card (legacy)            |
| Paper Tape         | `@paperTape`         | Paper tape (legacy)            |
| Lean Left          | `@leanLeft`          | Lean left parallelogram        |

**Example:**

```runiq
diagram "Document Processing" {
  shape input as @manualInput label: "Enter Data"
  shape process as @predefinedProcess label: "Validate"
  shape output as @document label: "Report"
}
```

### 3. Storage Shapes (7 shapes)

**Profile:** `diagram` (default)

Database and data storage representations:

| Shape              | Syntax               | Description               |
| ------------------ | -------------------- | ------------------------- |
| Cylinder           | `@cylinder`          | Database (vertical)       |
| H-Cylinder         | `@hCylinder`         | Database (horizontal)     |
| Disk Storage       | `@diskStorage`       | Magnetic disk             |
| Stored Data        | `@storedData`        | Data at rest              |
| Internal Storage   | `@internalStorage`   | RAM, cache, registers     |
| Sequential Storage | `@sequentialStorage` | Sequential access storage |
| Direct Storage     | `@directStorage`     | Direct access storage     |

**Example:**

```runiq
diagram "Data Architecture" {
  shape db as @cylinder label: "PostgreSQL"
  shape cache as @internalStorage label: "Redis"
  shape archive as @sequentialStorage label: "S3"
}
```

### 4. Rectangle Variants (7 shapes)

**Profile:** `diagram` (default)

Specialized rectangle styles for emphasis and organization:

| Shape             | Syntax              | Description                |
| ----------------- | ------------------- | -------------------------- |
| Framed Rectangle  | `@framedRectangle`  | Rectangle with inner frame |
| Multi Rectangle   | `@multiRectangle`   | Stacked rectangles         |
| Lined Rectangle   | `@linedRectangle`   | Rectangle with lines       |
| Divided Rectangle | `@dividedRectangle` | Horizontally divided       |
| Tagged Rectangle  | `@taggedRectangle`  | Rectangle with tag corner  |
| Notched Rectangle | `@notchedRectangle` | Rectangle with notch       |
| Notched Pentagon  | `@notchedPentagon`  | Pentagon with notch        |

**Example:**

```runiq
diagram "Emphasis Styles" {
  shape normal as @rectangle label: "Standard"
  shape framed as @framedRectangle label: "Important"
  shape multi as @multiRectangle label: "Multiple"
}
```

### 5. Control System Shapes (10 shapes)

**Profile:** `diagram` (default)

Control system diagram elements for control systems and signal processing:

| Shape             | Syntax              | Description                    |
| ----------------- | ------------------- | ------------------------------ |
| Transfer Function | `@transferFunction` | System transfer function block |
| Gain              | `@gain`             | Amplifier/gain block           |
| Integrator        | `@integrator`       | Integration block (1/s)        |
| Differentiator    | `@differentiator`   | Differentiation block (s)      |
| Time Delay        | `@timeDelay`        | Transport delay (e^-Ts)        |
| Saturation        | `@saturation`       | Limiter/saturator              |
| Summing Junction  | `@summingJunction`  | Adder/summer (Σ)               |
| Multiply Junction | `@multiplyJunction` | Multiplier (×)                 |
| Divide Junction   | `@divideJunction`   | Divider (÷)                    |
| Compare Junction  | `@compareJunction`  | Comparator                     |

**Example:**

```runiq
diagram "PID Controller" {
  shape kp as @gain label: "Kp"
  shape ki as @integrator label: "Ki/s"
  shape kd as @differentiator label: "Kd·s"
  shape sum as @summingJunction label: "Σ"
}
```

::: tip Control Systems
See the [Control system Diagrams Guide](../guide/control-diagrams.md) for comprehensive documentation on control system diagrams with LaTeX and Simulink export.
:::

### 6. Special Shapes (6 shapes)

**Profile:** `diagram` (default)

Miscellaneous special-purpose shapes:

| Shape          | Syntax           | Description             |
| -------------- | ---------------- | ----------------------- |
| Text Block     | `@textBlock`     | Plain text annotation   |
| Brace Left     | `@braceLeft`     | Left curly brace        |
| Brace Right    | `@braceRight`    | Right curly brace       |
| Lightning Bolt | `@lightningBolt` | Electrical/power symbol |
| Hourglass      | `@hourglass`     | Time/wait indicator     |
| Fork Join      | `@forkJoin`      | Parallel sync bar       |
| Or             | `@or`            | Logical OR symbol       |

**Example:**

```runiq
diagram "Special Symbols" {
  shape note as @textBlock label: "Plain text"
  shape power as @lightningBolt label: "AC Power"
}
```

### 7. Chart Shapes (7 shapes)

**Profile:** `diagram` (default)

Data visualization and chart components:

| Shape                | Syntax                | Description               |
| -------------------- | --------------------- | ------------------------- |
| Pie Chart            | `@pieChart`           | Circular pie chart        |
| Bar Chart Vertical   | `@barChartVertical`   | Vertical bar chart        |
| Bar Chart Horizontal | `@barChartHorizontal` | Horizontal bar chart      |
| Pyramid              | `@pyramid`            | Pyramid/hierarchy chart   |
| Venn 2               | `@venn2`              | Two-circle Venn diagram   |
| Venn 3               | `@venn3`              | Three-circle Venn diagram |
| Venn 4               | `@venn4`              | Four-circle Venn diagram  |

**Example:**

```runiq
diagram "Data Visualization" {
  shape sales as @barChartVertical label: "Q4 Sales"
  shape market as @pieChart label: "Market Share"
}
```

### 8. Network Shapes (7 shapes)

**Profile:** `diagram` (default)

Network topology and infrastructure components:

| Shape         | Syntax          | Description            |
| ------------- | --------------- | ---------------------- |
| Server        | `@server`       | Server/computer        |
| Router        | `@router`       | Network router         |
| Switch        | `@switch`       | Network switch         |
| Firewall      | `@firewall`     | Firewall device        |
| Load Balancer | `@loadBalancer` | Load balancer          |
| Cloud         | `@cloud`        | Cloud service          |
| Storage       | `@storage`      | Network storage device |

**Example:**

```runiq
diagram "Network Topology" {
  shape web as @server label: "Web Server"
  shape lb as @loadBalancer label: "Load Balancer"
  shape fw as @firewall label: "Firewall"
  shape cloud as @cloud label: "Internet"
}
```

### 9. Quantum Circuit Shapes (12 shapes)

**Profile:** `diagram` (default, but designed for quantum circuits)

Quantum computing gate symbols following IBM Qiskit visual standard:

| Shape       | Syntax         | Description                   |
| ----------- | -------------- | ----------------------------- |
| Gate X      | `@gateX`       | Pauli-X gate (NOT gate)       |
| Gate Y      | `@gateY`       | Pauli-Y gate                  |
| Gate Z      | `@gateZ`       | Pauli-Z gate                  |
| Gate H      | `@gateH`       | Hadamard gate (superposition) |
| Gate S      | `@gateS`       | S gate (phase π/2)            |
| Gate T      | `@gateT`       | T gate (phase π/4)            |
| Control Dot | `@controlDot`  | Control qubit indicator (●)   |
| CNOT Target | `@cnotTarget`  | CNOT target indicator (⊕)     |
| SWAP X      | `@swapX`       | SWAP gate symbol (⨉)          |
| Measurement | `@measurement` | Measurement operator          |
| Qubit Wire  | `@qubitWire`   | Horizontal qubit line         |
| Barrier     | `@barrier`     | Circuit phase separator       |

**Example:**

```runiq
diagram "Bell State" {
  shape q0 as @qubitWire label: "q0"
  shape H as @gateH label: "H"
  shape control as @controlDot label: "●"
  shape target as @cnotTarget label: "⊕"

  q0 -> H -> control
}
```

::: tip Quantum Circuits
See the [Quantum Circuits Guide](../guide/quantum-circuits.md) for comprehensive documentation on quantum computing diagrams.
:::

### 10. UML Shapes (22 shapes)

**Profile:** `diagram` (default)

Unified Modeling Language (UML) diagram elements:

| Shape           | Syntax            | Description                    |
| --------------- | ----------------- | ------------------------------ |
| Class           | `@class`          | UML class box                  |
| Actor           | `@actor`          | Stick figure actor             |
| System Boundary | `@systemBoundary` | Use case system boundary       |
| Interface       | `@interface`      | Interface definition           |
| Abstract        | `@abstract`       | Abstract class                 |
| Enum            | `@enum`           | Enumeration type               |
| Package         | `@package`        | Package/namespace              |
| Note            | `@note`           | UML note/comment               |
| Lifeline        | `@lifeline`       | Sequence diagram lifeline      |
| Activation      | `@activation`     | Activation box                 |
| Fragment        | `@fragment`       | Interaction fragment           |
| Deletion        | `@deletion`       | Object deletion symbol         |
| State           | `@state`          | State machine state            |
| Initial State   | `@initialState`   | Starting state (filled circle) |
| Final State     | `@finalState`     | Ending state (double circle)   |
| Choice          | `@choice`         | Decision diamond               |
| Fork            | `@fork`           | Fork/split bar                 |
| Join            | `@join`           | Join/merge bar                 |
| Activity        | `@activity`       | Activity box                   |
| Component       | `@component`      | Component box                  |
| Artifact        | `@artifact`       | Deployment artifact            |
| Node            | `@node`           | Deployment node                |

**Example:**

```runiq
diagram "Use Case Diagram" {
  shape user as @actor label: "Customer"
  shape login as @systemBoundary label: "Login"
  shape db as @component label: "Database"
}
```

### 11. Pedigree Shapes (3 shapes)

**Profile:** `diagram` (default)

Medical/genetic family tree symbols following standard pedigree notation:

| Shape            | Syntax             | Description                      |
| ---------------- | ------------------ | -------------------------------- |
| Pedigree Male    | `@pedigreeMale`    | Male individual (square)         |
| Pedigree Female  | `@pedigreeFemale`  | Female individual (circle)       |
| Pedigree Unknown | `@pedigreeUnknown` | Unknown sex individual (diamond) |

**Special Properties:**

- `affected:true` - Black fill (has genetic condition)
- `carrier:true` - Half-fill pattern (carries one copy)
- `deceased:true` - Diagonal line overlay

**Example:**

```runiq
diagram "Family History" {
  direction TB

  shape father as @pedigreeMale label: "Father" carrier: true
  shape mother as @pedigreeFemale label: "Mother" carrier: true
  shape son as @pedigreeMale label: "Son" affected: true
  shape daughter as @pedigreeFemale label: "Daughter"

  father -> mother arrowType: none
  father -> son
  mother -> daughter
}
```

::: tip Pedigree Charts
See the [Pedigree Charts Guide](../guide/pedigree-charts.md) for comprehensive documentation on creating medical family trees with inheritance patterns.
:::

### 12. C4 Architecture Shapes (4 shapes)

**Profile:** `diagram` (default)

C4 model shapes for software architecture diagrams:

| Shape        | Syntax         | Description                   |
| ------------ | -------------- | ----------------------------- |
| C4 Person    | `@c4Person`    | External person/user          |
| C4 System    | `@c4System`    | Software system               |
| C4 Container | `@c4Container` | Application/service container |
| C4 Component | `@c4Component` | Component within container    |

**Example:**

```runiq
diagram "C4 System Context" {
  shape user as @c4Person label: "Customer"
  shape system as @c4System label: "Banking System"
  shape external as @c4System label: "Email Service"

  user -> system
  system -> external
}
```

### 13. BPMN Shapes (6 shapes)

**Profile:** `diagram` (default)

Business Process Model and Notation (BPMN) 2.0 elements:

| Shape            | Syntax            | Description                  |
| ---------------- | ----------------- | ---------------------------- |
| BPMN Task        | `@bpmnTask`       | Process task/activity        |
| BPMN Event       | `@bpmnEvent`      | Start/end/intermediate event |
| BPMN Gateway     | `@bpmnGateway`    | Decision/merge gateway       |
| BPMN Data Object | `@bpmnDataObject` | Data object/artifact         |
| BPMN Message     | `@bpmnMessage`    | Message/communication        |
| BPMN Pool        | `@bpmnPool`       | Process pool/participant     |

**Example:**

```runiq
diagram "Order Process" {
  shape start as @bpmnEvent label: "Order Received"
  shape validate as @bpmnTask label: "Validate Order"
  shape decide as @bpmnGateway label: "Valid?"
  shape fulfill as @bpmnTask label: "Fulfill"

  start -> validate -> decide -> fulfill
}
```

### 14. AWS Shapes (6 shapes)

**Profile:** `diagram` (default)

Amazon Web Services infrastructure icons:

| Shape           | Syntax           | Description           |
| --------------- | ---------------- | --------------------- |
| AWS EC2         | `@awsEc2`        | EC2 compute instance  |
| AWS S3          | `@awsS3`         | S3 storage bucket     |
| AWS Lambda      | `@awsLambda`     | Lambda function       |
| AWS RDS         | `@awsRds`        | RDS database          |
| AWS VPC         | `@awsVpc`        | Virtual Private Cloud |
| AWS API Gateway | `@awsApiGateway` | API Gateway           |

**Example:**

```runiq
diagram "AWS Architecture" {
  shape web as @awsEc2 label: "Web Server"
  shape lambda as @awsLambda label: "API"
  shape db as @awsRds label: "PostgreSQL"
  shape storage as @awsS3 label: "Assets"

  web -> lambda -> db
  web -> storage
}
```

### 15. ERD Shapes (6 shapes)

**Profile:** `diagram` (default)

Entity-Relationship Diagram (ERD) symbols:

| Shape                | Syntax                     | Description                  |
| -------------------- | -------------------------- | ---------------------------- |
| ERD Entity           | `@erdEntity`               | Strong entity (rectangle)    |
| ERD Weak Entity      | `@erdWeakEntity`           | Weak entity (double rect)    |
| ERD Relationship     | `@erdRelationship`         | Relationship (diamond)       |
| ERD Attribute        | `@erdAttribute`            | Attribute (ellipse)          |
| ERD Key Attribute    | `@erdKeyAttribute`         | Primary key (underlined)     |
| ERD Multivalued Attr | `@erdMultivaluedAttribute` | Multivalued (double ellipse) |

**Example:**

```runiq
diagram "Database Schema" {
  shape user as @erdEntity label: "User"
  shape order as @erdEntity label: "Order"
  shape places as @erdRelationship label: "places"
  shape userId as @erdKeyAttribute label: "user_id"

  user -> places -> order
  user -> userId
}
```

### 16. Data Flow Diagram Shapes (6 shapes)

**Profile:** `diagram` (default)

Data Flow Diagram (DFD) symbols (Gane-Sarson notation):

| Shape                  | Syntax                  | Description                 |
| ---------------------- | ----------------------- | --------------------------- |
| External Entity        | `@externalEntity`       | External entity (rectangle) |
| External Entity Corner | `@externalEntityCorner` | Alternative corner style    |
| Process Circle         | `@processCircle`        | Process (circle)            |
| Data Store Line        | `@dataStoreLine`        | Data store (parallel lines) |
| Data Store Left        | `@dataStoreLeft`        | Left-aligned data store     |
| Data Store Open        | `@dataStoreOpen`        | Open-ended data store       |

**Example:**

```runiq
diagram "Order Processing DFD" {
  shape customer as @externalEntity label: "Customer"
  shape process as @processCircle label: "1.0\nProcess Order"
  shape db as @dataStoreLine label: "D1 Orders"

  customer -> process
  process -> db
}
```

### 17. Electrical & Digital Shapes

**Profiles:** `electrical`, `digital`, `pneumatic`, `hydraulic`

Specialized schematic symbols for circuits. See dedicated guides:

- **[Electrical Circuits Guide](../guide/electrical.md)** - Resistors, capacitors, transistors, op-amps, etc.
- **[Digital Circuits Guide](../guide/digital-circuits.md)** - Logic gates, flip-flops, registers, etc.

---

## All Shapes by Category

Complete listing organized by category:

| Category           | Count | Common Uses                                    |
| ------------------ | ----- | ---------------------------------------------- |
| Basic Shapes       | 19    | General-purpose geometric shapes               |
| Flowchart          | 14    | Process flows, ISO 5807 standard               |
| Storage            | 7     | Databases, data persistence                    |
| Rectangle Variants | 7     | Emphasis, organization, styling                |
| Control Systems    | 10    | Control system diagrams, signal processing     |
| Special            | 6     | Miscellaneous symbols                          |
| Charts             | 7     | Data visualization (pie, bar, Venn)            |
| Network            | 7     | Infrastructure, topology diagrams              |
| Quantum            | 12    | Quantum computing circuits                     |
| UML                | 22    | Software modeling, class/sequence diagrams     |
| Pedigree           | 3     | Medical family trees, genetics                 |
| C4 Architecture    | 4     | Software architecture (C4 model)               |
| BPMN               | 6     | Business process modeling                      |
| AWS                | 6     | Amazon Web Services infrastructure             |
| ERD                | 6     | Database entity-relationship diagrams          |
| Data Flow          | 6     | DFD process/data flows (Gane-Sarson)           |
| Electrical/Digital | 40+   | Circuits (resistors, gates, transistors, etc.) |

**Total: 142+ shapes** (excluding electrical/digital circuit components)

## Shape Properties

All shapes support these properties:

```runiq
shape MyShape as @rect
  label: "Display Text"
  fill: "#4caf50"
  textColor: "#ffffff"
  stroke: "#333333"
  strokeWidth: 2
  opacity: 0.9
```

### Color Properties

- `fill` - Background color (hex or CSS color)
- `textColor` - Label text color
- `strokeColor` - Border color
- `strokeWidth` - Border width in pixels
- `opacity` - Transparency (0.0 to 1.0)

### Layout Properties

- `width` - Override shape width
- `height` - Override shape height
- `padding` - Internal padding

## Next Steps

- [View Examples →](/examples/) - See shapes in action
- [Quick Start →](/guide/quick-start) - Build your first diagram
- [API Reference →](/reference/api/core) - Programmatic usage

---

::: tip Choosing Shapes
When in doubt:

- **@rounded** for start/end
- **@rect** for processes
- **@rhombus** for decisions
- **@cyl** for databases
- **@doc** for documents
  :::
