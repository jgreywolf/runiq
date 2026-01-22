---
title: P&ID Diagrams
description: Create ISA-5.1 compliant piping and instrumentation diagrams for process engineering with equipment, piping, instrumentation, and control loops.
lastUpdated: 2025-01-09
---

# P&ID Diagrams (Piping & Instrumentation Diagrams)

## Overview

Runiq supports creating **ISA-5.1 compliant** Piping & Instrumentation Diagrams (P&IDs) for process engineering, chemical plants, and industrial systems. P&IDs show the interconnection of process equipment and instrumentation used to control a process.

## Quick Start

```runiq
pid "Simple Process Flow" {
  // Equipment
  equipment T-101 type:storageTank volume:1000 unit:L material:CS rating:150#
  equipment P-101 type:pumpCentrifugal flowRate:50 unit:m³/h material:CS
  equipment FCV-101 type:valveControl rating:150#

  // Instruments
  instrument FT-101 type:flowTransmitter range:(0,100) unit:m³/h loop:101 location:field
  instrument FIC-101 type:flowIndicatorController range:(0,100) unit:m³/h loop:101 location:panel
  instrument LT-401 type:levelTransmitter range:(0,100) unit:% loop:401 location:field
  instrument LIC-401 type:levelIndicatorController range:(0,100) unit:% loop:401 location:panel

  // Process Lines
  line process from:T-101.outlet to:P-101.inlet size:3 unit:in schedule:SCH40 material:CS
  line process from:P-101.discharge to:FCV-101.inlet size:2 unit:in schedule:SCH40 material:CS
  line process from:FCV-101.outlet to:PRODUCT-1.tank size:2 unit:in schedule:SCH40 material:CS

  // Signal Lines
  line signal from:FT-101 to:FIC-101
  line signal from:FIC-101 to:FCV-101
  line signal from:LT-401 to:LIC-401

  // Control Loops
  loop 101 controlled_variable:flow setpoint:40 unit:m³/h controller:FIC-101 mode:auto
  loop 401 controlled_variable:level setpoint:70 unit:% controller:LIC-401 mode:auto

  // Process Specifications
  fluid biodegradable
  pressure 6 bar operating
  flowRate 50 m³/h
}
```

## Equipment Types

P&IDs support **87 symbols** across multiple categories:

### Vessels & Process Equipment

- `vesselVertical` - Vertical pressure vessel
- `vesselHorizontal` - Horizontal pressure vessel
- `storageTank` - Atmospheric storage tank
- `reactor` - Chemical reactor
- `knockoutDrum` - Knockout drum/separator
- `distillationColumn` - Distillation column/tower
- `filter` - Filter vessel
- `separator` - Generic separator vessel
- `separatorHorizontal` - Horizontal separator
- `flashDrum` - Flash drum
- `refluxDrum` - Reflux drum/accumulator
- `cyclone` - Cyclone separator

### Rotating Equipment

- `pumpCentrifugal` - Centrifugal pump
- `pumpPositiveDisplacement` - Positive displacement pump
- `compressorCentrifugal` - Centrifugal compressor
- `compressorReciprocating` - Reciprocating compressor
- `turbineSteam` - Steam turbine
- `fan` - Fan/blower
- `agitator` - Agitator/mixer

### Valves

- `valveGate` - Gate valve
- `valveGlobe` - Globe valve
- `valveBall` - Ball valve
- `valveCheck` - Check valve
- `valveControl` - Control valve (automatic)
- `valveControlPositioner` - Control valve with positioner
- `valveSafetyRelief` - Safety relief valve (PSV)
- `valvePressureReducing` - Pressure reducing valve
- `valveButterfly` - Butterfly valve
- `valveThreeWay` - Three-way valve
- `valveNeedle` - Needle valve
- `valvePlug` - Plug valve
- `valveDiaphragm` - Diaphragm valve
- `valveAngle` - Angle valve
- `valvePinch` - Pinch valve
- `valveShutoff` - Shutoff/isolation valve

### Heat Exchangers

- `heatExchangerShellTube` - Shell-and-tube heat exchanger
- `cooler` - Generic cooler/intercooler
- `airCooler` - Air-cooled heat exchanger
- `heatExchangerPlate` - Plate heat exchanger
- `firedHeater` - Fired heater/furnace
- `coolingTower` - Cooling tower
- `condenser` - Condenser
- `reboiler` - Reboiler
- `jacket` - Reactor cooling/heating jacket

### Safety Equipment

- `ruptureDisk` - Rupture disk (pressure relief)

### Equipment Properties

Equipment can have various properties:

```runiq
equipment E-101 type:heatExchangerShellTube
  material:SS316        // Material of construction
  rating:300#           // Pressure rating
  volume:10000          // Volume capacity
  unit:L                // Volume unit
  flowRate:75           // Design flow rate
  dimension:2.5         // Physical dimension
```

**Supported Materials:**

- `CS` - Carbon steel
- `SS304` - Stainless steel 304
- `SS316` - Stainless steel 316
- `SS316L` - Stainless steel 316L
- `Alloy20` - Alloy 20
- `Hastelloy` - Hastelloy
- `Monel` - Monel
- `Titanium` - Titanium
- `PVC` - PVC plastic
- `PP` - Polypropylene
- `PTFE` - Teflon

**Pressure Ratings:**

- ANSI: `150#`, `300#`, `600#`, `900#`, `1500#`, `2500#`
- PN (European): `PN10`, `PN16`, `PN25`, `PN40`

## Instrument Types

P&IDs support **27+ instrument types** following ISA-5.1 tag notation:

### Transmitters (Measurement Devices)

- `flowTransmitter` (FT) - Flow transmitter
- `temperatureTransmitter` (TT) - Temperature transmitter
- `pressureTransmitter` (PT) - Pressure transmitter
- `levelTransmitter` (LT) - Level transmitter
- `analyzerTransmitter` (AT) - Analyzer/composition transmitter
- `phTransmitter` (pH) - pH transmitter
- `conductivityTransmitter` (CT) - Conductivity transmitter
- `vibrationTransmitter` (VT) - Vibration transmitter

### Indicators (Local Display)

- `flowIndicator` (FI) - Flow indicator
- `temperatureIndicator` (TI) - Temperature indicator
- `pressureIndicator` (PI) - Pressure indicator
- `levelIndicator` (LI) - Level indicator

### Controllers

- `flowController` (FC) - Flow controller
- `temperatureController` (TC) - Temperature controller
- `pressureController` (PC) - Pressure controller
- `levelController` (LC) - Level controller
- `speedController` (SC) - Speed controller

### Indicator Controllers (Combined Display + Control)

- `flowIndicatorController` (FIC) - Flow indicator controller
- `temperatureIndicatorController` (TIC) - Temperature indicator controller
- `levelIndicatorController` (LIC) - Level indicator controller
- `pressureIndicatorController` (PIC) - Pressure indicator controller

### Switches (On/Off Devices)

- `flowSwitch` (FSH/FSL) - Flow switch
- `levelSwitch` (LSH/LSL) - Level switch
- `pressureSwitch` (PSH/PSL) - Pressure switch
- `temperatureSwitch` (TSH/TSL) - Temperature switch

### Alarms

- `temperatureAlarmHigh` (TAH) - High temperature alarm
- `temperatureAlarmLow` (TAL) - Low temperature alarm
- `temperatureAlarmHighHigh` (TAHH) - High-high temperature alarm
- `temperatureAlarmLowLow` (TALL) - Low-low temperature alarm
- `pressureAlarmHigh` (PAH) - High pressure alarm
- `pressureAlarmLow` (PAL) - Low pressure alarm
- `pressureAlarmHighHigh` (PAHH) - High-high pressure alarm
- `pressureAlarmLowLow` (PALL) - Low-low pressure alarm
- `levelAlarmHigh` (LAH) - High level alarm
- `levelAlarmLow` (LAL) - Low level alarm
- `levelAlarmHighHigh` (LAHH) - High-high level alarm
- `levelAlarmLowLow` (LALL) - Low-low level alarm
- `flowAlarmHigh` (FAH) - High flow alarm
- `flowAlarmLow` (FAL) - Low flow alarm

### Recorders

- `flowRecorder` (FR) - Flow recorder
- `pressureRecorder` (PR) - Pressure recorder
- `temperatureRecorder` (TR) - Temperature recorder

### Instrument Properties

```runiq
instrument TT-201
  type:temperatureTransmitter    // Instrument type
  range:(0,200)                   // Measurement range (min, max)
  unit:degC                       // Measurement unit
  loop:201                        // Control loop number
  location:field                  // Mounting location
  accuracy:0.5                    // Accuracy (optional)
```

**Locations:**

- `field` - Mounted in the field/process area
- `panel` - Mounted in control panel
- `local` - Local to equipment

**Measurement Units:**

- Flow: `kg/h`, `t/h`, `L/min`, `m³/h`
- Temperature: `degC`, `degF`
- Pressure: `bar`, `psi`, `kPa`
- Level: `m`, `mm`, `%`
- Speed: `rpm`
- Vibration: `mm/s`

## Line Types

P&IDs support multiple line types with different visual styles:

### Process Lines

```runiq
line process from:P-101.discharge to:V-101.inlet
  size:4              // Pipe size
  unit:in             // Size unit (in, mm, cm)
  schedule:SCH40      // Pipe schedule
  material:CS         // Material of construction
  insulation:hot      // Insulation type (optional)
  tracing:steam       // Heat tracing (optional)
```

**Line Types:**

- `process` - Main process lines (solid lines)
- `utility` - Utility lines: steam, cooling water, air (blue solid lines)
- `signal` - Instrument signals (dashed lines)
- `electrical` - Electrical connections (dotted lines)
- `pneumatic` - Pneumatic signal lines (dashed)
- `hydraulic` - Hydraulic signal lines (thicker solid)
- `data` - Software/data links (fine dotted)

### Line Type Example

```runiq
// Signal variants
line signal from:FT-101 to:FIC-101
line pneumatic from:FIC-101 to:PCV-101
line hydraulic from:PCV-101 to:ACT-101
line data from:PLC-1 to:VFD-201
```

**Pipe Schedules:**

- `SCH10`, `SCH20`, `SCH30`, `SCH40` (Standard)
- `SCH60`, `SCH80`, `SCH100`, `SCH120`, `SCH140`, `SCH160` (Heavy wall)
- `STD` (Standard), `XS` (Extra strong), `XXS` (Double extra strong)

**Insulation Types:**

- `hot` - Hot insulation
- `cold` - Cold insulation
- `personnel` - Personnel protection

**Tracing Types:**

- `steam` - Steam tracing
- `electric` - Electric heat tracing

## Control Loops

Control loops define the control strategy:

```runiq
loop 201
  controlled_variable:temperature    // What is being controlled
  setpoint:80                        // Target value
  unit:degC                          // Unit
  controller:TIC-201                 // Controller instrument tag
  mode:auto                          // Control mode
```

**Controlled Variables:**

- `flow` - Flow rate control
- `temperature` - Temperature control
- `pressure` - Pressure control
- `level` - Level control
- `composition` - Composition/analysis control
- `ph` - pH control
- `conductivity` - Conductivity control
- `speed` - Speed control (motors, agitators)

**Control Modes:**

- `manual` - Manual control (operator sets output)
- `auto` - Automatic control (controller adjusts output)
- `cascade` - Cascade control (output drives another controller)
- `ratio` - Ratio control
- `feedforward` - Feedforward control

## Process Specifications

Add process conditions and metadata:

```runiq
// Fluid properties
fluid organic            // Fluid type
fluid petrochemical
fluid water
fluid steam
fluid air

// Operating conditions
pressure 6 bar operating         // Operating pressure
pressure 10 bar design           // Design pressure
flowRate 50 m³/h                 // Design flow rate
temperature 80 degC operating    // Operating temperature
```

## ISA-5.1 Tag Notation

Runiq follows ISA-5.1 standard tag notation:

### Tag Structure

```
[Variable][Function]-[Loop#][Suffix]

Examples:
FT-101    - Flow Transmitter, Loop 101
TIC-201   - Temperature Indicator Controller, Loop 201
PAH-903   - Pressure Alarm High, Loop 903
LCV-401A  - Level Control Valve, Loop 401, Suffix A
```

### Common Tag Prefixes (Measured Variable)

- **F** - Flow
- **T** - Temperature
- **P** - Pressure
- **L** - Level
- **A** - Analysis (composition)
- **V** - Vibration
- **S** - Speed
- **W** - Weight
- **pH** - pH
- **C** - Conductivity

### Common Tag Suffixes (Readout Function)

- **T** - Transmitter (measurement signal)
- **I** - Indicator (local display)
- **C** - Controller (automatic control)
- **IC** - Indicator Controller (display + control)
- **R** - Recorder (historical logging)
- **S** - Switch (on/off)
- **SH** - Switch High (high limit)
- **SL** - Switch Low (low limit)
- **AH** - Alarm High
- **AL** - Alarm Low
- **AHH** - Alarm High-High
- **ALL** - Alarm Low-Low
- **CV** - Control Valve
- **Y** - Relay/Converter

## Complete Example

Here's a complete heat exchanger system with temperature control:

```runiq
pid "Shell and Tube Heat Exchanger" {
  // Equipment
  equipment E-101 type:heatExchangerShellTube material:SS316 rating:300#
  equipment P-101 type:pumpCentrifugal flowRate:75 unit:m³/h material:CS
  equipment P-102 type:pumpCentrifugal flowRate:100 unit:m³/h material:CS
  equipment TCV-201 type:valveControl rating:150#

  // Temperature Instruments
  instrument TT-201 type:temperatureTransmitter range:(0,200) unit:degC loop:201 location:field
  instrument TT-202 type:temperatureTransmitter range:(0,200) unit:degC loop:201 location:field
  instrument TIC-201 type:temperatureIndicatorController range:(0,200) unit:degC loop:201 location:panel

  // Flow Instruments
  instrument FT-101 type:flowTransmitter range:(0,150) unit:m³/h location:field
  instrument FT-102 type:flowTransmitter range:(0,200) unit:m³/h location:field

  // Pressure Indicators
  instrument PI-101 type:pressureIndicator range:(0,10) unit:bar location:local
  instrument PI-102 type:pressureIndicator range:(0,5) unit:bar location:local

  // Process Lines - Hot Side
  line process from:P-101.discharge to:E-101.tubeIn size:4 unit:in schedule:SCH40 material:CS
  line process from:E-101.tubeOut to:TT-202 size:4 unit:in schedule:SCH40 material:CS

  // Cooling Water Lines
  line utility from:CW-1.supply to:P-102.inlet size:6 unit:in schedule:STD material:CS
  line utility from:P-102.discharge to:TCV-201.inlet size:4 unit:in schedule:STD material:CS
  line utility from:TCV-201.outlet to:E-101.shellIn size:4 unit:in schedule:STD material:CS
  line utility from:E-101.shellOut to:CW-1.returnLine size:6 unit:in schedule:STD material:CS

  // Signal Lines
  line signal from:TT-201 to:TIC-201
  line signal from:TIC-201 to:TCV-201

  // Control Loop
  loop 201 controlled_variable:temperature setpoint:80 unit:degC controller:TIC-201 mode:auto

  // Process Specifications
  fluid synthetic
  pressure 8 bar operating
  flowRate 75 m³/h
}
```

## Best Practices

### Naming Conventions

- Use standard tag notation (e.g., `FT-101`, not `FlowTransmitter1`)
- Group equipment by area: `P-101`, `P-102` (pumps in area 100)
- Use consistent loop numbering: `TIC-201` controls loop `201`
- Keep tag loop numbers aligned with `loop:` properties (the parser warns on mismatches)

### Organization

- Group related equipment together in the DSL
- Define equipment before instruments
- Define lines after equipment/instruments
- Add control loops after lines
- Add process specifications at the end

### Safety Systems

- Always include safety instrumentation (PSV, alarms)
- Use high-high (PAHH) and low-low (LALL) alarms for critical variables
- Document interlock logic in comments

### Documentation

- Add comments to explain process purpose
- Document unusual configurations
- Note design basis and assumptions

## Common Patterns

### Temperature Control Loop

```runiq
instrument TT-201 type:temperatureTransmitter range:(0,200) unit:degC loop:201 location:field
instrument TIC-201 type:temperatureIndicatorController range:(0,200) unit:degC loop:201 location:panel
equipment TCV-201 type:valveControl rating:150#

line signal from:TT-201 to:TIC-201
line signal from:TIC-201 to:TCV-201

loop 201 controlled_variable:temperature setpoint:85 unit:degC controller:TIC-201 mode:auto
```

### Level Control with Alarms

```runiq
instrument LT-401 type:levelTransmitter range:(0,100) unit:% loop:401 location:field
instrument LIC-401 type:levelIndicatorController range:(0,100) unit:% loop:401 location:panel
instrument LAH-901 type:levelAlarmHigh range:(0,100) unit:% location:panel
instrument LAHH-902 type:levelAlarmHighHigh range:(0,100) unit:% location:panel

line signal from:LT-401 to:LIC-401
line signal from:LT-401 to:LAH-901
line signal from:LT-401 to:LAHH-902

loop 401 controlled_variable:level setpoint:70 unit:% controller:LIC-401 mode:auto
```

### Safety Relief System

```runiq
equipment R-101 type:reactor volume:10000 unit:L material:SS316L rating:600#
equipment PSV-801 type:valveSafetyRelief rating:600#
equipment RD-801 type:ruptureDisk rating:600#

instrument PT-601 type:pressureTransmitter range:(0,10) unit:bar loop:601 location:field
instrument PAH-903 type:pressureAlarmHigh range:(0,10) unit:bar location:panel
instrument PAHH-904 type:pressureAlarmHighHigh range:(0,10) unit:bar location:panel

line process from:R-101.relief to:PSV-801.inlet size:3 unit:in schedule:XXS material:SS316L
line process from:PSV-801.outlet to:RD-801.inlet size:3 unit:in schedule:XXS material:SS316L
line process from:RD-801.outlet to:VENT-1.header size:4 unit:in schedule:XXS material:SS316L

line signal from:PT-601 to:PAH-903
line signal from:PT-601 to:PAHH-904
```

## Rendering

P&ID diagrams are rendered with:

- **ISA-5.1 compliant symbols** for all equipment and instruments
- **Automatic layout** with flow-based positioning
- **Dynamic sizing** based on content
- **Visual differentiation** for line types (solid, dashed, dotted)
- **Tag labels** above equipment
- **Property annotations** below equipment
- **Loop information** below instruments

## Comparison with Other Tools

| Feature                      | Runiq          | Lucidchart  | SmartPlant P&ID | AutoCAD P&ID | MS Visio   | AVEVA Diagrams |
| ---------------------------- | -------------- | ----------- | --------------- | ------------ | ---------- | -------------- |
| **Text-based DSL**           | ✅             | ❌          | ❌              | ❌           | ❌         | ⚠️ Scripting   |
| **Version control friendly** | ✅             | ⚠️ Partial  | ⚠️ Database     | ⚠️ Partial   | ❌         | ⚠️ Database    |
| **Automatic layout**         | ✅             | ❌          | ❌              | ❌           | ❌         | ❌             |
| **ISA-5.1 symbols**          | ✅             | ⚠️ Custom   | ✅              | ✅           | ⚠️ Custom  | ✅             |
| **Equipment symbols**        | ✅             | ✅          | ✅              | ✅           | ✅         | ✅             |
| **Instrument tagging**       | ✅             | ✅          | ✅              | ✅           | ✅         | ✅             |
| **Line types**               | ✅             | ✅          | ✅              | ✅           | ✅         | ✅             |
| **Control loops**            | ✅             | ⚠️ Manual   | ✅              | ✅           | ⚠️ Manual  | ✅             |
| **Database integration**     | ❌             | ⚠️ Limited  | ✅              | ✅           | ⚠️ Limited | ✅             |
| **Documentation generation** | ✅             | ⚠️ Partial  | ✅              | ⚠️ Partial   | ⚠️ Partial | ✅             |
| **3D integration**           | ❌             | ❌          | ✅              | ✅           | ❌         | ✅             |
| **Material tracking**        | ✅             | ⚠️ Manual   | ✅              | ✅           | ⚠️ Manual  | ✅             |
| **Export formats**           | SVG, PNG       | Multiple    | DWG, PDF        | DWG, PDF     | Multiple   | Multiple       |
| **Learning curve**           | Low            | Low         | High            | High         | Medium     | High           |
| **Cost**                     | Free           | Paid        | Enterprise      | Enterprise   | Paid       | Enterprise     |
| **Platform**                 | Cross-platform | Web/Desktop | Windows         | Windows      | Windows    | Windows        |

**Key Advantages of Runiq:**

- **ISA-5.1 Compliance**: Industry-standard instrumentation symbols and tagging
- **Version Control**: Track P&ID changes alongside process documentation
- **Programmatic**: Generate from plant databases or specifications
- **Lightweight**: No CAD software or licenses required

**When to Use Alternatives:**

- **SmartPlant P&ID/AVEVA**: Enterprise-grade with 3D integration and database management
- **AutoCAD P&ID**: Industry standard with extensive symbol libraries and CAD integration
- **MS Visio**: General-purpose diagramming with P&ID stencils for smaller projects
- **Lucidchart**: Cloud collaboration for smaller P&ID projects

## See Also

- [Profile Types](profiles.md) - Overview of all diagram types
- [Examples](/examples/pid-diagrams) - Complete P&ID examples
- [DSL Syntax Reference](/reference/dsl) - Complete syntax reference

## Standards Compliance

Runiq P&IDs follow these industry standards:

- **ISA-5.1** - Instrumentation Symbols and Identification
- **ANSI/ISA-5.1-2009** - Instrumentation Symbols and Identification
- **ISO 14617** - Graphical symbols for diagrams (partially)
