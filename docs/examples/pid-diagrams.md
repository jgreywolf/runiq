# P&ID Examples

Piping & Instrumentation Diagrams (P&ID) following ISA-5.1 standards for process control systems.

## Simple Tank-Pump System

A basic tank with level control and pump transfer system.

### DSL Code

```runiq
pid "Tank Pump Transfer" {
  
  equipment TK-101 
    type:storageTank 
    label:"Storage Tank" 
    capacity:"1000 gal" 
    material:"CS"
    position:(100, 100)
  
  equipment P-101 
    type:centrifugalPump 
    label:"Transfer Pump" 
    flow:"50 gpm" 
    head:"100 ft"
    position:(300, 200)
  
  equipment TK-102 
    type:storageTank 
    label:"Receiving Tank" 
    capacity:"1000 gal"
    position:(500, 100)
  
  # Level transmitter and indicator
  instrument LT-101 
    type:level-transmitter 
    label:"Level" 
    range:"0-100%" 
    output:"4-20mA"
    connectedTo:TK-101
    position:(120, 80)
  
  instrument LI-101 
    type:level-indicator 
    label:"Level" 
    location:"control-room"
    connectedTo:LT-101
    position:(120, 50)
  
  # Flow transmitter
  instrument FT-101 
    type:flow-transmitter 
    label:"Flow" 
    range:"0-100 gpm" 
    output:"4-20mA"
    position:(350, 180)
  
  # Process lines
  line L-101 
    from:TK-101 
    to:P-101 
    size:"2 inch" 
    spec:"CS-150"
  
  line L-102 
    from:P-101 
    to:TK-102 
    size:"2 inch" 
    spec:"CS-150"
  
  # Control loop
  loop LC-101 
    type:level-control 
    setpoint:"75%" 
    mode:automatic 
    instruments:[LT-101, LI-101]
    finalElement:P-101
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
  
  equipment E-201 
    type:heatExchanger 
    subtype:shellAndTube
    label:"Heat Exchanger" 
    area:"500 sqft" 
    duty:"1.5 MMBtu/hr"
    position:(300, 200)
  
  equipment P-201 
    type:centrifugalPump 
    label:"Hot Oil Pump"
    position:(100, 250)
  
  # Temperature instruments
  instrument TT-201 
    type:temperature-transmitter 
    label:"Inlet Temp" 
    range:"50-300 degF" 
    output:"4-20mA"
    connectedTo:E-201
    position:(250, 150)
  
  instrument TT-202 
    type:temperature-transmitter 
    label:"Outlet Temp" 
    range:"50-300 degF" 
    output:"4-20mA"
    connectedTo:E-201
    position:(350, 150)
  
  instrument TI-201 
    type:temperature-indicator 
    label:"Outlet Temp" 
    location:"local"
    connectedTo:TT-202
    position:(350, 120)
  
  # Control valve
  equipment TV-201 
    type:controlValve 
    label:"Steam Control" 
    size:"1 inch" 
    cv:12
    action:"fail-close"
    position:(300, 280)
  
  # Pressure instruments
  instrument PT-201 
    type:pressure-transmitter 
    label:"Shell Pressure" 
    range:"0-150 psig" 
    output:"4-20mA"
    connectedTo:E-201
    position:(320, 180)
  
  # Process lines
  line L-201 
    from:P-201 
    to:E-201 
    size:"3 inch" 
    spec:"CS-300"
    label:"Process Fluid In"
  
  line L-202 
    from:E-201 
    to:"DOWNSTREAM" 
    size:"3 inch" 
    spec:"CS-300"
    label:"Process Fluid Out"
  
  line L-203 
    to:E-201 
    size:"1 inch" 
    spec:"SS-150"
    label:"Steam In"
  
  line L-204 
    from:E-201 
    size:"1 inch" 
    spec:"SS-150"
    label:"Condensate Out"
  
  # Control loop
  loop TC-201 
    type:temperature-control 
    setpoint:"180 degF" 
    mode:automatic 
    algorithm:"PID"
    instruments:[TT-202, TI-201]
    finalElement:TV-201
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
  
  equipment V-301 
    type:vessel 
    subtype:horizontal
    label:"3-Phase Separator" 
    length:"15 ft" 
    diameter:"4 ft"
    pressure:"250 psig"
    material:"CS"
    position:(300, 200)
  
  # Level instruments - oil/water interface
  instrument LT-301 
    type:level-transmitter 
    label:"Oil Level" 
    range:"0-100%" 
    output:"4-20mA"
    technology:"guided-wave-radar"
    connectedTo:V-301
    position:(280, 150)
  
  instrument LT-302 
    type:level-transmitter 
    label:"Water Level" 
    range:"0-100%" 
    output:"4-20mA"
    technology:"displacer"
    connectedTo:V-301
    position:(300, 150)
  
  instrument LI-301 
    type:level-indicator 
    label:"Oil/Water Interface" 
    location:"control-room"
    position:(290, 120)
  
  # Pressure instruments
  instrument PT-301 
    type:pressure-transmitter 
    label:"Vessel Pressure" 
    range:"0-300 psig" 
    output:"4-20mA"
    connectedTo:V-301
    position:(320, 170)
  
  instrument PI-301 
    type:pressure-indicator 
    label:"Pressure" 
    location:"local"
    connectedTo:PT-301
    position:(320, 140)
  
  # Pressure safety valve
  instrument PSV-301 
    type:safety-valve 
    label:"PSV" 
    setpoint:"275 psig" 
    size:"3 inch"
    connectedTo:V-301
    position:(350, 180)
  
  # Control valves
  equipment LV-301 
    type:controlValve 
    label:"Oil Outlet" 
    size:"2 inch" 
    cv:25
    action:"fail-close"
    position:(400, 220)
  
  equipment LV-302 
    type:controlValve 
    label:"Water Outlet" 
    size:"2 inch" 
    cv:20
    action:"fail-close"
    position:(400, 250)
  
  equipment PV-301 
    type:controlValve 
    label:"Gas Outlet" 
    size:"4 inch" 
    cv:50
    action:"fail-open"
    position:(350, 140)
  
  # Process lines
  line L-301 
    to:V-301 
    size:"6 inch" 
    spec:"CS-600"
    label:"Wellhead Feed"
  
  line L-302 
    from:V-301 
    size:"4 inch" 
    spec:"CS-300"
    label:"Gas Out"
  
  line L-303 
    from:V-301 
    size:"2 inch" 
    spec:"CS-300"
    label:"Oil Out"
  
  line L-304 
    from:V-301 
    size:"2 inch" 
    spec:"CS-150"
    label:"Water Out"
  
  # Control loops
  loop LC-301 
    type:level-control 
    setpoint:"60%" 
    mode:automatic 
    instruments:[LT-301, LI-301]
    finalElement:LV-301
    description:"Oil level control"
  
  loop LC-302 
    type:level-control 
    setpoint:"40%" 
    mode:automatic 
    instruments:[LT-302]
    finalElement:LV-302
    description:"Water level control"
  
  loop PC-301 
    type:pressure-control 
    setpoint:"225 psig" 
    mode:automatic 
    instruments:[PT-301, PI-301]
    finalElement:PV-301
    description:"Vessel pressure control"
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
  
  # Suction scrubber
  equipment V-401 
    type:vessel 
    subtype:vertical
    label:"Suction Scrubber" 
    height:"8 ft" 
    diameter:"2 ft"
    pressure:"150 psig"
    material:"CS"
    position:(150, 200)
  
  # Compressor
  equipment C-401 
    type:compressor 
    subtype:reciprocating
    label:"Gas Compressor" 
    power:"250 HP" 
    stages:2
    position:(300, 200)
  
  # Aftercooler
  equipment E-401 
    type:heatExchanger 
    subtype:airCooler
    label:"Discharge Cooler" 
    fans:2 
    duty:"0.5 MMBtu/hr"
    position:(450, 200)
  
  # Discharge scrubber
  equipment V-402 
    type:vessel 
    subtype:vertical
    label:"Discharge Scrubber" 
    height:"6 ft" 
    diameter:"2 ft"
    pressure:"600 psig"
    material:"CS"
    position:(600, 200)
  
  # Suction instruments
  instrument PT-401 
    type:pressure-transmitter 
    label:"Suction Pressure" 
    range:"0-200 psig" 
    output:"4-20mA"
    connectedTo:V-401
    position:(150, 150)
  
  instrument TT-401 
    type:temperature-transmitter 
    label:"Suction Temp" 
    range:"0-200 degF" 
    output:"4-20mA"
    connectedTo:V-401
    position:(170, 150)
  
  # Discharge instruments
  instrument PT-402 
    type:pressure-transmitter 
    label:"Discharge Pressure" 
    range:"0-800 psig" 
    output:"4-20mA"
    connectedTo:E-401
    position:(450, 150)
  
  instrument TT-402 
    type:temperature-transmitter 
    label:"Discharge Temp" 
    range:"0-400 degF" 
    output:"4-20mA"
    connectedTo:E-401
    position:(470, 150)
  
  # Vibration monitoring
  instrument VT-401 
    type:vibration-transmitter 
    label:"Vibration" 
    range:"0-10 mm/s" 
    output:"4-20mA"
    connectedTo:C-401
    position:(300, 170)
  
  # Level control - suction scrubber
  instrument LT-401 
    type:level-transmitter 
    label:"Level" 
    range:"0-100%" 
    output:"4-20mA"
    connectedTo:V-401
    position:(130, 220)
  
  equipment LV-401 
    type:controlValve 
    label:"Drain" 
    size:"1 inch" 
    cv:8
    action:"fail-close"
    position:(130, 250)
  
  # Anti-surge control
  equipment PCV-401 
    type:controlValve 
    label:"Anti-Surge" 
    size:"3 inch" 
    cv:40
    action:"fail-open"
    position:(500, 250)
  
  # Process lines
  line L-401 
    to:V-401 
    size:"4 inch" 
    spec:"CS-300"
    label:"Gas Feed"
  
  line L-402 
    from:V-401 
    to:C-401 
    size:"4 inch" 
    spec:"CS-300"
    label:"Compressor Suction"
  
  line L-403 
    from:C-401 
    to:E-401 
    size:"3 inch" 
    spec:"CS-900"
    label:"Compressor Discharge"
  
  line L-404 
    from:E-401 
    to:V-402 
    size:"3 inch" 
    spec:"CS-900"
    label:"Cooled Gas"
  
  line L-405 
    from:V-402 
    size:"3 inch" 
    spec:"CS-900"
    label:"Product Gas"
  
  line L-406 
    from:L-403 
    to:L-401 
    size:"3 inch" 
    spec:"CS-900"
    label:"Recycle"
  
  # Control loops
  loop LC-401 
    type:level-control 
    setpoint:"50%" 
    mode:automatic 
    instruments:[LT-401]
    finalElement:LV-401
    description:"Scrubber drain control"
  
  loop PC-401 
    type:pressure-control 
    setpoint:"450 psig" 
    mode:automatic 
    algorithm:"PID"
    instruments:[PT-402]
    finalElement:PCV-401
    description:"Anti-surge control"
  
  # Interlock
  interlock SIS-401 
    type:safety 
    condition:"PT-402 > 550 psig OR VT-401 > 8 mm/s"
    action:"shutdown C-401"
    description:"High pressure or vibration shutdown"
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
