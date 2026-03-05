# P&ID Examples

Piping & Instrumentation Diagrams (P&ID) following ISA-5.1 standards for process control systems.

## Simple Tank-Pump System

A basic tank with level control and pump transfer system.

### DSL Code

```runiq
pid "Tank Pump Transfer" {
  equipment T-101 type:storageTank volume:3800 unit:L material:CS rating:150#
  equipment P-101 type:pumpCentrifugal flowRate:50 unit:kg/h material:CS
  equipment T-102 type:storageTank volume:3800 unit:L material:CS rating:150#

  instrument LT-101 type:levelTransmitter range:(0,100) unit:% loop:101 location:field
  instrument LI-101 type:levelIndicator range:(0,100) unit:% loop:101 location:panel
  instrument LIC-101 type:levelIndicatorController range:(0,100) unit:% loop:101 location:panel
  instrument FT-101 type:flowTransmitter range:(0,100) unit:kg/h loop:101 location:field

  line process from:T-101.outlet to:P-101.inlet size:2 unit:in schedule:SCH40 material:CS
  line process from:P-101.discharge to:T-102.inlet size:2 unit:in schedule:SCH40 material:CS

  line signal from:LT-101 to:LIC-101
  line signal from:LIC-101 to:P-101
  line signal from:FT-101 to:LIC-101

  loop 101 controlled_variable:level setpoint:75 unit:% controller:LIC-101 mode:auto
}
```

### Key Features

- **Equipment**: Storage tanks (TK-101, TK-102), centrifugal pump (P-101)
- **Instruments**: Level transmitter (LT-101), level indicator (LI-101), flow transmitter (FT-101)
- **Process Lines**: 2" carbon steel lines rated for 150 psi
- **Control Loop**: Automatic level control (LC-101) maintaining 75% setpoint

### ISA-5.1 Compliance

- Tag numbering follows ISA-5.1 convention (function-loop-sequence)
- Instrument types use standard abbreviations (LT = Level Transmitter, FT = Flow Transmitter)
- Signal types specified (4-20mA analog signals)

---

## Heat Exchanger System

Shell and tube heat exchanger with temperature control.

### DSL Code

```runiq
pid "Heat Exchanger Temperature Control" {
  equipment E-201 type:heatExchangerShellTube material:CS rating:300#
  equipment P-201 type:pumpCentrifugal flowRate:75 unit:kg/h material:CS
  equipment TV-201 type:valveControl rating:150#

  instrument TT-201 type:temperatureTransmitter range:(50,300) unit:degF loop:201 location:field
  instrument TT-202 type:temperatureTransmitter range:(50,300) unit:degF loop:201 location:field
  instrument TI-201 type:temperatureIndicator range:(50,300) unit:degF loop:201 location:local
  instrument TIC-201 type:temperatureIndicatorController range:(50,300) unit:degF loop:201 location:panel
  instrument PT-201 type:pressureTransmitter range:(0,150) unit:psi loop:201 location:field

  line process from:P-201.discharge to:E-201.inlet size:3 unit:in schedule:SCH40 material:CS
  line process from:E-201.outlet to:DOWNSTREAM-201.inlet size:3 unit:in schedule:SCH40 material:CS
  line utility from:STEAM-201.outlet to:TV-201.inlet size:1 unit:in schedule:SCH40 material:SS316
  line utility from:TV-201.outlet to:E-201.shell size:1 unit:in schedule:SCH40 material:SS316
  line utility from:E-201.shell to:CONDENSATE-201.inlet size:1 unit:in schedule:SCH40 material:SS316

  line signal from:TT-202 to:TIC-201
  line signal from:TIC-201 to:TV-201

  loop 201 controlled_variable:temperature setpoint:180 unit:degF controller:TIC-201 mode:auto
}
```

### Key Features

- **Equipment**: Shell & tube heat exchanger (E-201), hot oil circulation pump (P-201)
- **Temperature Control**: Dual temperature transmitters monitor inlet/outlet temperatures
- **Control Valve**: Steam control valve (TV-201) with fail-close action
- **PID Control**: Temperature control loop (TC-201) maintains 180°F outlet temperature
- **Pressure Monitoring**: Pressure transmitter (PT-201) monitors shell pressure

### Process Details

- **Heat Duty**: 1.5 MMBtu/hr
- **Heat Transfer Area**: 500 sqft
- **Control Strategy**: Cascade control with steam flow modulation
- **Safety Features**: Fail-close valve, pressure monitoring

---

## Three-Phase Separator

Oil, gas, and water separation with level and pressure control.

### DSL Code

```runiq
pid "Three-Phase Separator" {
  equipment V-301 type:vesselHorizontal material:CS rating:300#
  equipment PSV-301 type:valveSafetyRelief rating:300#
  equipment LV-301 type:valveControl rating:300#
  equipment LV-302 type:valveControl rating:150#
  equipment PV-301 type:valveControl rating:300#

  instrument LT-301 type:levelTransmitter range:(0,100) unit:% loop:301 location:field
  instrument LT-302 type:levelTransmitter range:(0,100) unit:% loop:302 location:field
  instrument LI-301 type:levelIndicator range:(0,100) unit:% loop:301 location:panel
  instrument PT-301 type:pressureTransmitter range:(0,300) unit:psi loop:303 location:field
  instrument PI-301 type:pressureIndicator range:(0,300) unit:psi loop:303 location:local
  instrument LIC-301 type:levelIndicatorController range:(0,100) unit:% loop:301 location:panel
  instrument LIC-302 type:levelIndicatorController range:(0,100) unit:% loop:302 location:panel
  instrument PIC-301 type:pressureIndicatorController range:(0,300) unit:psi loop:303 location:panel

  line process from:WELL-301.outlet to:V-301.inlet size:6 unit:in schedule:SCH80 material:CS
  line process from:V-301.gas to:PV-301.inlet size:4 unit:in schedule:SCH40 material:CS
  line process from:PV-301.outlet to:GAS-301.inlet size:4 unit:in schedule:SCH40 material:CS
  line process from:V-301.oil to:LV-301.inlet size:2 unit:in schedule:SCH40 material:CS
  line process from:LV-301.outlet to:OIL-301.inlet size:2 unit:in schedule:SCH40 material:CS
  line process from:V-301.water to:LV-302.inlet size:2 unit:in schedule:SCH40 material:CS
  line process from:LV-302.outlet to:WATER-301.inlet size:2 unit:in schedule:SCH40 material:CS

  line signal from:LT-301 to:LIC-301
  line signal from:LIC-301 to:LV-301
  line signal from:LT-302 to:LIC-302
  line signal from:LIC-302 to:LV-302
  line signal from:PT-301 to:PIC-301
  line signal from:PIC-301 to:PV-301

  loop 301 controlled_variable:level setpoint:60 unit:% controller:LIC-301 mode:auto
  loop 302 controlled_variable:level setpoint:40 unit:% controller:LIC-302 mode:auto
  loop 303 controlled_variable:pressure setpoint:225 unit:psi controller:PIC-301 mode:auto
}
```

### Key Features

- **Multi-Phase Separation**: Separates oil, gas, and water by gravity
- **Advanced Instrumentation**: 
  - Guided-wave radar for oil level (LT-301)
  - Displacer technology for water level (LT-302)
  - Interface detection with dual level transmitters
- **Three Control Loops**:
  - LC-301: Oil level control at 60%
  - LC-302: Water level control at 40%
  - PC-301: Pressure control at 225 psig
- **Safety Systems**: 
  - Pressure safety valve (PSV-301) set at 275 psig
  - Fail-close action on liquid outlets
  - Fail-open action on gas outlet (safer for pressure relief)

### Process Description

1. **Feed**: Wellhead stream enters through 6" line (L-301)
2. **Gas Separation**: Gas rises to top, exits through pressure control valve (PV-301)
3. **Oil/Water Interface**: 
   - Oil accumulates in upper liquid zone
   - Water settles to bottom zone
   - Interface maintained by coordinated level controls
4. **Liquid Discharge**: 
   - Oil exits at 60% level through LV-301
   - Water exits at 40% level through LV-302

### Design Specifications

- **Operating Pressure**: 250 psig design, 225 psig normal operating
- **Vessel Dimensions**: 15 ft long × 4 ft diameter horizontal vessel
- **Material**: Carbon steel construction
- **Capacity**: Sized for typical wellhead production rates

---

## Compressor System

Reciprocating compressor with suction scrubber and discharge cooling.

### DSL Code

```runiq
pid "Gas Compressor Package" {
  equipment V-401 type:vesselVertical material:CS rating:300#
  equipment C-401 type:compressorReciprocating material:CS rating:600#
  equipment E-401 type:airCooler material:CS rating:600#
  equipment V-402 type:vesselVertical material:CS rating:600#
  equipment LV-401 type:valveControl rating:300#
  equipment PCV-401 type:valveControl rating:600#

  instrument PT-401 type:pressureTransmitter range:(0,200) unit:psi loop:401 location:field
  instrument TT-401 type:temperatureTransmitter range:(0,200) unit:degF loop:401 location:field
  instrument PT-402 type:pressureTransmitter range:(0,800) unit:psi loop:402 location:field
  instrument TT-402 type:temperatureTransmitter range:(0,400) unit:degF loop:402 location:field
  instrument VT-401 type:vibrationTransmitter range:(0,10) unit:mm/s loop:402 location:field
  instrument LT-401 type:levelTransmitter range:(0,100) unit:% loop:401 location:field
  instrument LIC-401 type:levelIndicatorController range:(0,100) unit:% loop:401 location:panel
  instrument PIC-401 type:pressureIndicatorController range:(0,800) unit:psi loop:402 location:panel

  line process from:FEED-401.outlet to:V-401.inlet size:4 unit:in schedule:SCH40 material:CS
  line process from:V-401.outlet to:C-401.inlet size:4 unit:in schedule:SCH40 material:CS
  line process from:C-401.discharge to:E-401.inlet size:3 unit:in schedule:SCH80 material:CS
  line process from:E-401.outlet to:V-402.inlet size:3 unit:in schedule:SCH80 material:CS
  line process from:V-402.outlet to:PRODUCT-401.inlet size:3 unit:in schedule:SCH80 material:CS
  line process from:C-401.discharge to:PCV-401.inlet size:3 unit:in schedule:SCH80 material:CS
  line process from:PCV-401.outlet to:V-401.inlet size:3 unit:in schedule:SCH80 material:CS

  line signal from:LT-401 to:LIC-401
  line signal from:LIC-401 to:LV-401
  line signal from:PT-402 to:PIC-401
  line signal from:PIC-401 to:PCV-401

  loop 401 controlled_variable:level setpoint:50 unit:% controller:LIC-401 mode:auto
  loop 402 controlled_variable:pressure setpoint:450 unit:psi controller:PIC-401 mode:auto
}
```

### Key Features

- **Two-Stage Compression**: 250 HP reciprocating compressor (C-401)
- **Pre-Treatment**: Suction scrubber (V-401) removes liquids before compression
- **Cooling**: Air-cooled heat exchanger (E-401) with dual fans
- **Post-Treatment**: Discharge scrubber (V-402) for final liquid removal
- **Anti-Surge Protection**: Recycle control valve (PCV-401) prevents surge
- **Vibration Monitoring**: VT-401 provides real-time machinery health monitoring

### Control Strategy

1. **Level Control (LC-401)**: Maintains 50% level in suction scrubber
2. **Anti-Surge Control (PC-401)**: 
   - Monitors discharge pressure (PT-402)
   - Opens recycle valve (PCV-401) when pressure exceeds 450 psig
   - Prevents compressor surge and damage
3. **Safety Interlock (SIS-401)**:
   - Shuts down compressor if discharge pressure > 550 psig
   - Shuts down compressor if vibration > 8 mm/s
   - Fail-open action on anti-surge valve ensures safe depressurization

### Instrumentation Details

- **Pressure**: PT-401 (suction), PT-402 (discharge)
- **Temperature**: TT-401 (suction), TT-402 (discharge)
- **Vibration**: VT-401 (machinery monitoring)
- **Level**: LT-401 (scrubber level)
- **All transmitters**: 4-20mA analog signals for DCS integration

---

## Signal and Valve Variants

Showcases additional valve symbols and non-process signal line types.

### DSL Code

```runiq
pid "Signal and Valve Variants" {
  equipment PRV-501 type:valvePressureReducing rating:300#
  equipment PCV-501 type:valveControlPositioner rating:300#
  equipment ISV-501 type:valveShutoff rating:300#

  instrument FT-501 type:flowTransmitter range:(0,200) unit:mA3/h loop:501 location:field
  instrument FIC-501 type:flowIndicatorController range:(0,200) unit:mA3/h loop:501 location:panel

  line pneumatic from:FIC-501 to:PCV-501
  line hydraulic from:PCV-501 to:ACT-501
  line data from:PLC-501 to:ISV-501

  loop 501 controlled_variable:flow setpoint:120 unit:mA3/h controller:FIC-501 mode:auto
}
```

### Key Features

- **Valves**: Pressure reducing, control valve with positioner, and shutoff valve
- **Signals**: Pneumatic, hydraulic, and data links for actuators and controllers

---

## Related Resources

- [P&ID Profile Guide](/guide/pid-diagrams) - Complete syntax reference
- [ISA-5.1 Standard](https://www.isa.org/standards-and-publications/isa-standards/isa-5-1) - Official ISA instrumentation symbols
- [Process Control Guide](/guide/profiles#pid-profile) - Overview of P&ID capabilities

## Best Practices

### Tag Naming Convention

Follow ISA-5.1 standard tag format: `[Function][Loop]-[Number]`

- **Function Letters**: First letter indicates measured variable (L=Level, P=Pressure, T=Temperature, F=Flow)
- **Subsequent Letters**: Indicate instrument type (T=Transmitter, I=Indicator, C=Controller, V=Valve)
- **Loop Number**: Unique identifier for the control loop
- **Sequence**: Additional number for multiple instruments in same loop

### Signal Types

Always specify signal types for proper documentation:
- **Analog**: 4-20mA (most common), 0-10V
- **Digital**: HART, FOUNDATION Fieldbus, Profibus
- **Pneumatic**: 3-15 psig (legacy systems)

### Safety Instrumentation

- Use **PSV** prefix for pressure safety valves
- Specify set pressures and sizes
- Document interlock logic with clear conditions and actions
- Consider fail-safe states for all control valves

### Equipment Specifications

Include critical design information:
- **Vessels**: Diameter, length/height, pressure rating, material
- **Pumps**: Flow rate, head, driver power
- **Heat Exchangers**: Type, area, duty
- **Compressors**: Type, stages, power
