---
title: Profiles
description: Understand Runiq's 10 diagram profiles - Diagram, Electrical, Digital, Wardley, Sequence, Timeline, Pneumatic, Hydraulic, P&ID, and GlyphSet with specialized syntax and rendering.
lastUpdated: 2025-01-20
---

# Profiles

Runiq supports **10 primary profiles** for different diagramming needs:

- **Diagram profile**: General-purpose diagrams (flowcharts, UML, architecture, Control system diagrams, mind maps, org charts, etc.). You can freely mix any supported shapes in a single diagram.
- **GlyphSet profile**: SmartArt-style pre-built diagram templates (pyramids, matrices, cycles, org charts) with 61 glyphsets across 6 categories.
- **Sequence profile**: UML sequence diagrams showing interactions between participants over time. Perfect for documenting API flows, authentication sequences, and system interactions.
- **Timeline profile**: Timeline diagrams and Gantt-style visualizations for project planning, roadmaps, and chronological events.
- **Electrical profile**: Technical schematics rendered with IEEE-style symbols and electrical rules. This profile unlocks exporters like SPICE and Verilog.
- **Digital profile**: Digital logic circuits with standard gate symbols (AND, OR, NOT, NAND, NOR, XOR, etc.). Supports HDL export to Verilog.
- **Wardley profile**: Strategic mapping with 2D axes (Evolution × Value Chain) for business analysis and technology planning.
- **Pneumatic profile**: Pneumatic circuits following ISO 1219-1 standards with cylinders, valves, FRL units, and compressed air components.
- **Hydraulic profile**: Hydraulic circuits following ISO 1219-2 standards with pumps, motors, valves, and fluid power components.
- **P&ID profile**: Piping & Instrumentation Diagrams following ISA-5.1 standards for process engineering and industrial systems.

Most syntax is shared across profiles. The key differences are:

- Shape set and rendering style
- Positioning system (auto-layout vs. manual coordinates)
- Exporters available (SPICE/Verilog for electrical, SVG for all)
- Layout defaults (e.g., orthogonal wiring for electrical)

## Profile Comparison Table

Here's a comprehensive comparison of the 8 primary profiles to help you choose the right one for your project:

::: tip Additional Profiles
**Timeline** and **GlyphSet** profiles are also available:

- **Timeline Profile**: See [Timeline Diagrams Guide](/guide/diagram-types/timeline-diagrams)
- **GlyphSet Profile**: See [Glyphsets Guide](/guide/glyphsets) - 61 SmartArt-style templates
  :::

| Feature                  | Diagram                                            | Electrical                                                                              | Digital                                                                           | Wardley                                                                           | Sequence                                                                            | Pneumatic                                                                             | Hydraulic                                                                             | P&ID                                        |
| ------------------------ | -------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------- |
| **Primary Use Case**     | General purpose, flowcharts, UML, architecture     | Circuit design, analog electronics                                                      | Logic circuits, digital design                                                    | Strategic mapping, technology evolution                                           | Object interactions, API flows                                                      | Compressed air systems                                                                | Fluid power systems                                                                   | Process engineering, industrial plants      |
| **Rendering Style**      | Vector shapes, auto-layout                         | IEEE schematic symbols                                                                  | Logic gate symbols                                                                | 2D axis plot                                                                      | Sequence notation                                                                   | ISO 1219-1 symbols                                                                    | ISO 1219-2 symbols                                                                    | ISA-5.1 symbols                             |
| **Layout System**        | Auto (ELK), manual                                 | Orthogonal, schematic                                                                   | Auto-layout                                                                       | Manual 2D positioning                                                             | Vertical timeline                                                                   | Schematic layout                                                                      | Schematic layout                                                                      | Process flow layout                         |
| **Shapes Available**     | 52+ (all categories)                               | Resistors, caps, inductors, sources, diodes, transistors, ICs                           | Logic gates, flip-flops, mux, decoders                                            | Components, pipelines                                                             | Actors, lifelines, fragments                                                        | Cylinders, valves, FRL, sensors                                                       | Pumps, motors, valves, cylinders, accumulators                                        | Equipment, pipes, instruments, valves       |
| **Export Formats**       | SVG, PNG, PDF                                      | SPICE netlist, SVG                                                                      | Verilog HDL, SVG                                                                  | SVG                                                                               | SVG                                                                                 | SVG                                                                                   | SVG                                                                                   | SVG                                         |
| **Simulation Support**   | No                                                 | Yes (LTspice, ngspice)                                                                  | Yes (Icarus, ModelSim)                                                            | No                                                                                | No                                                                                  | Manual analysis                                                                       | Manual analysis                                                                       | Process simulation                          |
| **Standards Compliance** | None (flexible)                                    | IEEE 315                                                                                | ANSI Y32.14                                                                       | Wardley mapping methodology                                                       | UML 2.5                                                                             | ISO 1219-1:2012                                                                       | ISO 1219-2:2012                                                                       | ISA-5.1-2009                                |
| **Key Syntax**           | `shape`, `@shape_id`                               | `part`, `net`, `pins:()`                                                                | `module`, `instance`, `input/output`                                              | `anchor`, `component`, `pipeline`                                                 | `participant`, `lifeline`, `message`                                                | `equipment`, `line`, `actuator:`                                                      | `equipment`, `line`, `fluid:`                                                         | `equipment`, `pipe`, `instrument:`          |
| **Direction Control**    | TB, LR, BT, RL                                     | Auto (schematic)                                                                        | Auto (logic)                                                                      | Manual coords                                                                     | Vertical (fixed)                                                                    | Schematic flow                                                                        | Schematic flow                                                                        | Process flow                                |
| **Edge Styling**         | Arrows, labels, dashed                             | Wires, nets, connections                                                                | Wires, bus notation                                                               | Evolution arrows                                                                  | Messages, sync/async                                                                | Air/pilot lines                                                                       | Pressure/return lines                                                                 | Process/instrument lines                    |
| **Typical Users**        | Software developers, architects, business analysts | Electrical engineers, electronics hobbyists                                             | Digital designers, FPGA engineers                                                 | CTOs, product strategists, consultants                                            | Software developers, API designers                                                  | Automation engineers, mechatronics                                                    | Hydraulic engineers, mobile equipment designers                                       | Process engineers, chemical plant designers |
| **Learning Curve**       | Easy (familiar shapes)                             | Medium (circuit knowledge)                                                              | Medium-Hard (logic design)                                                        | Medium (strategy concepts)                                                        | Easy-Medium (UML basics)                                                            | Medium (pneumatic principles)                                                         | Medium-Hard (hydraulic principles)                                                    | Hard (process engineering)                  |
| **Documentation**        | [Getting Started](/guide/getting-started)          | [Electrical Guide](/guide/electrical)                                                   | [Digital Guide](/guide/digital-circuits)                                          | [Wardley Maps](/guide/wardley-maps)                                               | [Sequence Guide](/guide/diagram-types/sequence-diagrams)                            | [Pneumatic Guide](/guide/pneumatic-circuits)                                          | [Hydraulic Guide](/guide/hydraulic-circuits)                                          | [P&ID Guide](/guide/pid-diagrams)           |
| **Example Files**        | [Examples](/examples/)                             | [examples/electrical](https://github.com/jgreywolf/runiq/tree/main/examples/electrical) | [examples/digital](https://github.com/jgreywolf/runiq/tree/main/examples/digital) | [examples/wardley](https://github.com/jgreywolf/runiq/tree/main/examples/wardley) | [examples/sequence](https://github.com/jgreywolf/runiq/tree/main/examples/sequence) | [examples/pneumatic](https://github.com/jgreywolf/runiq/tree/main/examples/pneumatic) | [examples/hydraulic](https://github.com/jgreywolf/runiq/tree/main/examples/hydraulic) | [examples/pid](/examples/pid-diagrams)      |
| **Export Capabilities**  | Standard graphics                                  | Circuit netlists                                                                        | HDL synthesis                                                                     | Strategic visualization                                                           | Collaboration docs                                                                  | System documentation                                                                  | System documentation                                                                  | Plant documentation                         |
| **Typical Complexity**   | Simple to complex                                  | Medium circuits                                                                         | Small to medium                                                                   | Strategic level                                                                   | API/system level                                                                    | Machine level                                                                         | Machine/system level                                                                  | Plant level                                 |
| **Real-Time Updates**    | Yes (editor)                                       | Yes (editor)                                                                            | Yes (editor)                                                                      | Yes (editor)                                                                      | Yes (editor)                                                                        | Yes (editor)                                                                          | Yes (editor)                                                                          | Yes (editor)                                |
| **Collaborative**        | Yes (text-based)                                   | Yes (text-based)                                                                        | Yes (text-based)                                                                  | Yes (text-based)                                                                  | Yes (text-based)                                                                    | Yes (text-based)                                                                      | Yes (text-based)                                                                      | Yes (text-based)                            |

### Quick Selection Guide

**Choose Diagram Profile** when:

- Creating general-purpose diagrams (flowcharts, org charts, mind maps)
- Modeling software architecture (C4, component diagrams)
- Designing UML class diagrams, state machines, activity diagrams
- Visualizing data flows, pipelines, or business processes
- You need maximum flexibility and variety of shapes

**Choose Glyphsets Profile** when:

- Quick presentations and reports
- Standard visualization patterns
- Data-driven diagrams
- Consistency across multiple diagrams
- Minimal setup time

**Choose Electrical Profile** when:

- Designing analog circuits (amplifiers, filters, power supplies)
- Creating schematics for PCB design
- Simulating circuits with SPICE (LTspice, ngspice, Xyce)
- Documenting electronic prototypes
- Teaching electronics fundamentals

**Choose Digital Profile** when:

- Designing combinational logic (gates, mux, decoders)
- Creating sequential circuits (flip-flops, registers, counters)
- Exporting to Verilog for FPGA/ASIC implementation
- Simulating logic with digital simulators (Icarus Verilog, ModelSim)
- Teaching digital logic design

**Choose Wardley Profile** when:

- Analyzing business strategy and technology positioning
- Planning product evolution and market movement
- Communicating technology decisions to executives
- Identifying build vs. buy decisions
- Understanding competitive landscape

**Choose Sequence Profile** when:

- Documenting API interactions and protocols
- Modeling authentication/authorization flows
- Designing distributed system communication
- Creating UML sequence diagrams for software documentation
- Explaining time-ordered interactions between components

**Choose Pneumatic Profile** when:

- Designing automation systems with compressed air
- Specifying pneumatic cylinders, valves, and FRL units
- Documenting ISO 1219-1 compliant circuits
- Working on robotics, pick-and-place, or packaging machinery
- Teaching pneumatic fundamentals

**Choose Hydraulic Profile** when:

- Designing fluid power systems for heavy machinery
- Specifying pumps, motors, cylinders, and valves
- Documenting ISO 1219-2 compliant circuits
- Working on construction equipment, presses, or mobile machinery
- Calculating forces, flows, and pressures

**Choose P&ID Profile** when:

- Designing process plants (chemical, oil & gas, pharmaceutical)
- Creating ISA-5.1 compliant instrumentation diagrams
- Specifying piping, equipment, and control loops
- Documenting industrial process flows
- Teaching process engineering

### Profile Interoperability

::: warning Planned Feature
Cross-profile file references are not yet implemented. The `ref:` syntax shown below is a planned feature for future releases.
:::

While profiles are specialized, you can organize multi-profile projects using separate files and manual composition. Each profile diagram should be in its own `.runiq` file:

**File Structure:**

```
project/
  ├── main-architecture.runiq        # High-level diagram profile
  ├── digital/
  │   └── controller.runiq           # Digital profile circuit
  ├── hydraulic/
  │   └── actuators.runiq            # Hydraulic profile circuit
  └── pid/
      └── sensors.runiq              # P&ID profile diagram
```

**Current Workflow:**

1. Create separate `.runiq` files for each profile
2. Render each file independently to SVG
3. Compose SVGs in documentation or presentations
4. Reference diagrams via hyperlinks or embedded images

**Planned Feature (Not Yet Available):**

In future releases, you will be able to reference external files directly:

```runiq
# FUTURE SYNTAX - NOT YET IMPLEMENTED
diagram "System Overview" {
  container "Control Logic" {
    ref: "./digital/controller.runiq"
  }

  container "Hydraulic System" {
    ref: "./hydraulic/actuators.runiq"
  }
}
```

This will allow you to:

- Maintain specialized subsystems in their native profiles
- Combine high-level architecture (diagram profile) with technical details (electrical/hydraulic/P&ID)
- Export each subsystem appropriately (SPICE, Verilog, SVG)
- Keep documentation modular and maintainable

::: tip Current Alternative
For now, use the **container** feature to group related shapes within a single diagram, or maintain separate diagram files and compose them manually in your documentation.
:::

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

## Glyphset Profile

To use the glyphset profile:

```runiq
glyphset basicProcess "Onboarding Steps" {
  item "Application"
  item "Interview"
  item "Offer"
  item "Start Date"

  theme forest
  orientation "horizontal"
}
```

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
- **UML 2.5 Interaction Use:** Supports `ref` fragments to reference other sequence diagrams by name

**Sequence Diagram References (Interaction Use):**

You can reference other sequence diagrams using UML 2.5 interaction use syntax:

```runiq
sequence "User Registration Flow" {
  participant "User" as actor
  participant "System" as control

  message from:"User" to:"System" label:"Submit form" type:sync

  # Reference another sequence diagram (UML Interaction Use)
  fragment ref "Input Validation" from:2 to:3 ref:"ValidationSequence"

  fragment ref "Create Credentials" from:4 to:5 ref:"AuthSequence"

  message from:"System" to:"User" label:"Success" type:return
}
```

::: tip Sequence-Specific References
The `ref:` syntax works in Sequence profiles for UML Interaction Use, referencing other sequence diagram names (not file paths). This is different from the planned cross-profile file references mentioned above.
:::

See [Sequence Diagrams Examples](/examples/sequence-diagrams) for detailed documentation.

## Electrical Profile

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

## Digital Profile

To use the digital profile for logic circuits:

```runiq
digital "CMOS Inverter" {
  module inv {
    input A
    output Y

    instance pmos type:pmos width:2 pins:(Y,A,VDD,VDD)
    instance nmos type:nmos width:1 pins:(Y,A,GND,GND)
  }
}
```

**Key Differences:**

- Module-based hierarchy with inputs/outputs
- Digital logic gates: AND, OR, NOT, NAND, NOR, XOR, XNOR
- Sequential elements: flip-flops, latches, registers
- Memory components: RAM, ROM
- Supports Verilog HDL export
- Rendered with standard logic symbols

See [Digital Circuits Guide](/guide/digital-circuits) for detailed documentation.

## Pneumatic Profile

To use the pneumatic profile for compressed air circuits:

```runiq
pneumatic "Double-Acting Cylinder Circuit" {
  net SUPPLY, PORT_A, PORT_B, EXHAUST_A, EXHAUST_B

  pressure 6 bar operating
  flowRate 800 L/min

  part VALVE type:VALVE_52 pins:(SUPPLY,PORT_A,PORT_B,EXHAUST_A,EXHAUST_B) doc:"5/2-way valve"
  part CYLINDER type:CYL_DA pins:(PORT_A,PORT_B) doc:"Double-acting cylinder"
  part SENSOR_EXT type:SENSOR_PROX pins:(PORT_A) doc:"Extended sensor"
  part SENSOR_RET type:SENSOR_PROX pins:(PORT_B) doc:"Retracted sensor"
  part FLOW_A type:CHECK_VALVE pins:(PORT_A) doc:"Flow control A"
  part FLOW_B type:CHECK_VALVE pins:(PORT_B) doc:"Flow control B"
}
```

**Key Differences:**

- ISO 1219-1 compliant symbols
- Cylinders (single/double acting), valves, FRL units
- Pressure and flow specifications
- Air line sizing
- Actuator types (manual, solenoid, pilot, spring)

See [Pneumatic Circuits Guide](/guide/pneumatic-circuits) for detailed documentation.

## Hydraulic Profile

To use the hydraulic profile for fluid power circuits:

```runiq
hydraulic "Hydraulic Press System" {
  net SUPPLY, FAST, SLOW, PRESS, RETURN, TANK

  pressure 250 bar max
  pressure 200 bar operating
  flowRate 80 L/min
  fluid mineral "ISO VG 68"

  part PUMP_MAIN type:PUMP_FIXED pins:(TANK,SUPPLY) doc:"Main pump"
  part VALVE_SEQ type:VALVE_43 pins:(SUPPLY,FAST,SLOW,RETURN) doc:"Sequence valve"
  part CYL_PRESS type:CYL_HYD pins:(PRESS,RETURN) doc:"Press cylinder"
  part RELIEF_SYS type:RELIEF_VALVE pins:(SUPPLY,TANK) doc:"System relief 250 bar"
  part RELIEF_PRESS type:RELIEF_VALVE pins:(PRESS,RETURN) doc:"Press relief 200 bar"
  part PRESS_SENS type:SENSOR_PRESS pins:(PRESS) doc:"Pressure sensor"
  part POS_SENS type:SENSOR_PROX pins:(PRESS) doc:"Position sensor"
}
```

**Key Differences:**

- ISO 1219-2 compliant symbols
- Pumps, motors, valves, cylinders, accumulators
- Fluid properties (type, viscosity, temperature)
- Pressure ratings and flow rates
- Line sizing and schedules
- Force and torque calculations

See [Hydraulic Circuits Guide](/guide/hydraulic-circuits) for detailed documentation.

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
  fluid mineral
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

See [P&ID Diagrams Guide](/guide/pid-diagrams) and [P&ID Examples](/examples/pid-diagrams) for detailed documentation.

---

See the Reference for the full shape catalog and DSL syntax.
