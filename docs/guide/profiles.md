---
title: Profiles
---

# Profiles: Diagram, Schematic, Wardley, Sequence, and P&ID

Runiq supports five primary profiles:

- **Diagram profile**: General-purpose diagrams (flowcharts, UML, architecture, block diagrams, mind maps, org charts, etc.). You can freely mix any supported shapes in a single diagram.
- **Electrical profile**: Technical schematics rendered with IEEE-style symbols and electrical rules. This profile unlocks exporters like SPICE and Verilog.
- **Wardley profile**: Strategic mapping with 2D axes (Evolution × Value Chain) for business analysis and technology planning.
- **Sequence profile**: UML sequence diagrams showing interactions between participants over time. Perfect for documenting API flows, authentication sequences, and system interactions.
- **P&ID profile**: Piping & Instrumentation Diagrams following ISA-5.1 standards for process engineering and industrial systems.

Most syntax is shared across profiles. The key differences are:

- Shape set and rendering style
- Positioning system (auto-layout vs. manual coordinates)
- Exporters available (SPICE/Verilog for electrical, SVG for all)
- Layout defaults (e.g., orthogonal wiring for electrical)

## Diagram Profile (Default)

To use the diagram profile (default):

```runiq
diagram "Mixed Diagram" {
  direction LR

  shape Start as @terminator label:"Start"
  shape Amp   as @gain       label:"Amplifier"
  shape Box   as @rounded    label:"UI Screen"

  Start -> Amp
  Amp   -> Box
}
```

## electrical Profile

To use the electrical profile:

```runiq
electrical"LED Circuit" {
  net VCC, GND, N1

  part V1 type:V value:"5V" pins:(VCC,GND)
  part R1 type:R value:"220" pins:(VCC,N1)
  part D1 type:LED pins:(N1,GND)
  part GND1 type:GND pins:(GND)
}
```

## Wardley Profile

To use the Wardley profile for strategic mapping:

```runiq
wardley "Strategic Map"{

  anchor "User Need" value:0.95

  component "Visible Service" evolution:0.75 value:0.85
  component "Infrastructure" evolution:0.95 value:0.3

  dependency from:"Visible Service" to:"Infrastructure"
}
```

**Key Differences:**

- Uses 2D coordinate system (evolution: 0-1, value: 0-1)
- Manual positioning (no auto-layout)
- Different syntax: `component`, `dependency`, `anchor`, `evolve`
- Rendered with strategic mapping visuals (grid, axes, evolution arrows)

See [Wardley Maps Examples](/examples/wardley-maps) for detailed documentation.

## Sequence Profile

To use the Sequence profile for interaction diagrams:

```runiq
sequence "User Login" {
  participant "User" as actor
  participant "Web App" as boundary
  participant "Auth Service" as control
  participant "Database" as database

  message from:"User" to:"Web App" label:"Enter credentials" type:sync
  message from:"Web App" to:"Auth Service" label:"Validate" type:sync activate:true
  message from:"Auth Service" to:"Database" label:"Query user" type:sync
  message from:"Database" to:"Auth Service" label:"User data" type:return
  message from:"Auth Service" to:"Web App" label:"Auth token" type:return
  message from:"Web App" to:"User" label:"Success" type:return
}
```

**Key Differences:**

- Timeline-based layout (time flows top to bottom)
- Uses participants instead of nodes: `participant "Name" as type`
- Messages instead of edges: `message from:"A" to:"B" label:"Text" type:sync`
- Supports fragments for control flow: `fragment loop "Retry" from:0 to:3`
- Rendered with lifelines, activation boxes, and UML-style arrows

See [Sequence Diagrams Examples](/examples/sequence-diagrams) for detailed documentation.

## P&ID Profile

To use the P&ID profile for process engineering diagrams:

```runiq
pid "Simple Process Flow" {
  // Equipment
  equipment T-101 type:storageTank volume:1000 unit:L material:CS rating:150#
  equipment P-101 type:pumpCentrifugal flowRate:50 unit:m³/h material:CS
  equipment FCV-101 type:valveControl rating:150#

  // Instruments (ISA-5.1 notation)
  instrument FT-101 type:flowTransmitter range:(0,100) unit:m³/h loop:101 location:field
  instrument FIC-101 type:flowIndicatorController range:(0,100) unit:m³/h loop:101 location:panel
  instrument LT-401 type:levelTransmitter range:(0,100) unit:% loop:401 location:field
  instrument LIC-401 type:levelIndicatorController range:(0,100) unit:% loop:401 location:panel

  // Process Lines
  line process from:T-101.outlet to:P-101.inlet size:3 unit:in schedule:SCH40 material:CS
  line process from:P-101.discharge to:FCV-101.inlet size:2 unit:in schedule:SCH40 material:CS

  // Signal Lines
  line signal from:FT-101 to:FIC-101
  line signal from:FIC-101 to:FCV-101
  line signal from:LT-401 to:LIC-401

  // Control Loops
  loop 101 controlled_variable:flow setpoint:40 unit:m³/h controller:FIC-101 mode:auto
  loop 401 controlled_variable:level setpoint:70 unit:% controller:LIC-401 mode:auto

  // Process Specifications
  fluid organic
  pressure 6 bar operating
  flowRate 50 m³/h
}
```

**Key Differences:**

- ISA-5.1 compliant symbols and tag notation (FT-101, TIC-201, etc.)
- Equipment, instruments, lines, and control loops as primary syntax
- Process specifications for fluid properties and operating conditions
- Different line types: process (solid), utility (blue), signal (dashed), electrical (dotted)
- Supports 64 equipment types and 27+ instrument types
- Material of construction, pressure ratings, pipe schedules
- Alarm systems with high/low/high-high/low-low variants

See [P&ID Diagrams Guide](/guide/pid-diagrams) and [P&ID Examples](/examples/pid/) for detailed documentation.

---

See the Reference for the full shape catalog and DSL syntax.
