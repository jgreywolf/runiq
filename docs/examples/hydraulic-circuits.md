# Hydraulic Circuits

Complete guide to creating hydraulic circuit diagrams using Runiq DSL with ISO 1219-1 compliant symbols.

## Table of Contents

- [Overview](#overview)
- [Syntax](#syntax)
- [Symbol Reference](#symbol-reference)
- [Examples](#examples)
- [Fluid Selection](#fluid-selection)
- [Best Practices](#best-practices)

## Overview

Runiq supports hydraulic circuit diagrams following ISO 1219-1 standards for fluid power systems. Hydraulic circuits use pressurized liquid (typically mineral oil) to transmit power for heavy-duty applications.

**Key Features:**

- 13 standard hydraulic symbols
- Pressure specification (bar, psi, kPa, MPa)
- Flow rate specification (L/min, GPM, m³/h)
- Fluid type and viscosity specifications
- Temperature range support
- Net-based connectivity
- Automatic SVG rendering

## Syntax

### Profile Declaration

```runiq
hydraulic "Circuit Name" {
  pressure 210 bar operating
  flowRate 40 L/min
  fluid mineral "ISO VG 46" temp:(10, 60, degC)

  net NET1
  net NET2

  part P1 type: PUMP_FIXED pins:(NET1, NET2) doc:"Fixed pump"
}
```

### Pressure Specification

Format: `pressure <value> <unit> [<type>]`

**Units:** `bar`, `psi`, `kPa`, `MPa`  
**Types (optional):** `operating`, `max`, `min`, `nominal`, `rated`

**Examples:**

```runiq
pressure 210 bar operating      // Standard mobile hydraulics
pressure 3000 psi max           // Maximum system pressure
pressure 16 MPa rated           // Rated component pressure
```

**Typical Pressure Ranges:**

- Light duty: 70-140 bar (1000-2000 psi)
- Medium duty: 140-210 bar (2000-3000 psi)
- Heavy duty: 210-350 bar (3000-5000 psi)
- Ultra-high pressure: 350-700 bar (5000-10000 psi)

### Flow Rate Specification

Format: `flowRate <value> <unit>`

**Units:** `L/min`, `L/s`, `GPM`, `m³/h`

**Examples:**

```runiq
flowRate 40 L/min       // Liters per minute
flowRate 10 GPM         // Gallons per minute (US)
flowRate 2.4 m³/h       // Cubic meters per hour
```

### Fluid Specification

Format: `fluid <type> "<viscosity>" temp:(<min>, <max>, <unit>)`

**Fluid Types:**

- `mineral` - Petroleum-based mineral oil (most common)
- `synthetic` - Synthetic hydrocarbons
- `biodegradable` - Environmentally friendly fluids
- `water-glycol` - Water-glycol mixtures
- `phosphate-ester` - Fire-resistant phosphate esters

**Viscosity Grades:**

- ISO VG 22, 32, 46, 68, 100 (ISO 3448 standard)
- Higher number = thicker oil

**Temperature Units:** `degC` (Celsius), `degF` (Fahrenheit), `K` (Kelvin)

**Examples:**

```runiq
// Mineral oil, standard industrial
fluid mineral "ISO VG 46"

// Mineral oil with temperature range
fluid mineral "ISO VG 46" temp:(10, 60, degC)

// Synthetic for extreme conditions
fluid synthetic "ISO VG 32" temp:(-20, 80, degC)

// Fire-resistant for critical applications
fluid phosphate-ester "Type IV" temp:(15, 80, degC)

// Biodegradable for environmental protection
fluid biodegradable "HETG" temp:(5, 70, degC)
```

### Parts (Components)

Format: `part <ref> <type> pins:(<net1>, <net2>, ...) doc:"<description>"`

**Required:**

- `ref` - Unique component reference (e.g., P1, V1, C1)
- `type` - Symbol type (see Symbol Reference below)

**Optional:**

- `pins:(...)` - Connected nets
- `doc:"..."` - Component description

### Nets (Hydraulic Lines)

Format: `net <name>`

Nets represent hydraulic lines: pressure lines, return lines, and drain lines. Components connect to nets via pins.

**Naming Conventions:**

- `PUMP` - Pump output (pressure line)
- `TANK` - Return to reservoir
- `PORT_A`, `PORT_B` - Cylinder/motor ports
- `PILOT` - Pilot control line
- `DRAIN` - Case drain line

## Symbol Reference

### Power Generation

| Symbol         | Type                       | Description                  | Pins                         |
| -------------- | -------------------------- | ---------------------------- | ---------------------------- |
| **PUMP_FIXED** | Fixed Displacement Pump    | Constant flow output         | 2 (inlet, outlet)            |
| **PUMP_VAR**   | Variable Displacement Pump | Adjustable flow output       | 2-3 (inlet, outlet, control) |
| **RESERVOIR**  | Hydraulic Tank             | Stores fluid, allows cooling | 2+ (return, suction)         |

**Example:**

```runiq
part T1 type: RESERVOIR pins:(TANK) doc:"100L reservoir"
part P1 type: PUMP_FIXED pins:(TANK, PUMP_OUT) doc:"Fixed pump 40cc"
```

### Actuators

| Symbol        | Type               | Description                      | Pins               |
| ------------- | ------------------ | -------------------------------- | ------------------ |
| **MOTOR_HYD** | Hydraulic Motor    | Converts fluid power to rotation | 2 (inlet, outlet)  |
| **CYL_HYD**   | Hydraulic Cylinder | Linear actuator                  | 2 (port A, port B) |

**Example:**

```runiq
part M1 type: MOTOR_HYD pins:(PRESSURE, RETURN) doc:"Hydraulic motor 100cc"
part C1 type: CYL_HYD pins:(PORT_A, PORT_B) doc:"Cylinder 80/50 x 500"
```

### Directional Control Valves

| Symbol       | Type          | Description                           | Pins |
| ------------ | ------------- | ------------------------------------- | ---- |
| **VALVE_43** | 4/3-Way Valve | 4 ports, 3 positions, center position | 4    |

**Typical Center Positions:**

- **Closed Center:** All ports blocked
- **Open Center:** Pressure to tank, work ports blocked
- **Tandem Center:** Pressure to tank, work ports to tank
- **Float Center:** All ports connected

**Example:**

```runiq
part V1 type: VALVE_43 pins:(PUMP, PORT_A, PORT_B, TANK)
     doc:"4/3 closed center"
```

### Pressure Control Valves

| Symbol             | Type                    | Description                | Pins              |
| ------------------ | ----------------------- | -------------------------- | ----------------- |
| **RELIEF_VALVE**   | Pressure Relief Valve   | Limits maximum pressure    | 2 (inlet, tank)   |
| **REDUCING_VALVE** | Pressure Reducing Valve | Creates secondary pressure | 2 (inlet, outlet) |

**Example:**

```runiq
part RV1 type: RELIEF_VALVE pins:(PUMP, TANK) doc:"Relief @ 210 bar"
part RD1 type: REDUCING_VALVE pins:(MAIN, PILOT) doc:"Reduce to 30 bar"
```

### Flow Control

| Symbol               | Type                  | Description                      | Pins |
| -------------------- | --------------------- | -------------------------------- | ---- |
| **FLOW_CONTROL_HYD** | Flow Control Valve    | Restricts flow for speed control | 2    |
| **CHECK_VALVE_HYD**  | Check Valve (One-Way) | Allows flow in one direction     | 2    |

**Example:**

```runiq
part FC1 type: FLOW_CONTROL_HYD pins:(PORT_A) doc:"Meter-in speed control"
part CV1 type: CHECK_VALVE_HYD pins:(PORT_B, RETURN) doc:"Free return flow"
```

### Conditioning

| Symbol          | Type                  | Description              | Pins              |
| --------------- | --------------------- | ------------------------ | ----------------- |
| **FILTER_HYD**  | Hydraulic Filter      | Removes contaminants     | 2 (inlet, outlet) |
| **ACCUMULATOR** | Hydraulic Accumulator | Stores pressurized fluid | 1                 |

**Example:**

```runiq
part F1 type: FILTER_HYD pins:(RETURN, TANK) doc:"Return filter 10µm"
part AC1 type: ACCUMULATOR pins:(PUMP) doc:"Accumulator 5L, 210 bar"
```

### Instrumentation

| Symbol          | Type           | Description                 | Pins |
| --------------- | -------------- | --------------------------- | ---- |
| **GAUGE_P_HYD** | Pressure Gauge | Displays hydraulic pressure | 1    |

**Example:**

```runiq
part G1 type: GAUGE_P_HYD pins:(PUMP) doc:"Pressure gauge 0-250 bar"
```

## Examples

### Example 1: Simple Hydraulic Power Unit

Basic power supply with pressure protection.

```runiq
hydraulic "Power Unit" {
  pressure 210 bar operating
  flowRate 40 L/min
  fluid mineral "ISO VG 46" temp:(10, 60, degC)

  net TANK
  net PUMP_OUT
  net RETURN

  part T1 type: RESERVOIR pins:(TANK, RETURN) doc:"100L reservoir"
  part P1 type: PUMP_FIXED pins:(TANK, PUMP_OUT) doc:"Fixed pump 40cc"
  part RV1 type: RELIEF_VALVE pins:(PUMP_OUT, RETURN) doc:"Relief @ 210 bar"
  part F1 type: FILTER_HYD pins:(RETURN, TANK) doc:"Return filter 10µm"
}
```

**Components:**

- Reservoir stores and cools hydraulic fluid
- Fixed pump provides constant flow
- Relief valve protects against overpressure
- Return filter maintains fluid cleanliness

---

### Example 2: Cylinder Control Circuit

Precise position control with speed regulation.

```runiq
hydraulic "Cylinder Control" {
  pressure 160 bar operating
  flowRate 30 L/min
  fluid mineral "ISO VG 32"

  net PUMP
  net PORT_A
  net PORT_B
  net TANK

  part V1 type: VALVE_43 pins:(PUMP, PORT_A, PORT_B, TANK)
       doc:"4/3 closed center proportional valve"
  part FC1 type: FLOW_CONTROL_HYD pins:(PORT_A) doc:"Extend speed control"
  part FC2 type: FLOW_CONTROL_HYD pins:(PORT_B) doc:"Retract speed control"
  part C1 type: CYL_HYD pins:(PORT_A, PORT_B) doc:"Double-acting cylinder"
}
```

**Features:**

- Proportional valve for variable speed
- Independent speed control for extend/retract
- Closed center conserves energy at idle

---

### Example 3: Hydraulic Motor with Load Sensing

Variable speed motor control with energy efficiency.

```runiq
hydraulic "Motor Control" {
  pressure 180 bar operating
  flowRate 60 L/min
  fluid synthetic "ISO VG 46" temp:(5, 70, degC)

  net TANK
  net PUMP_OUT
  net MOTOR_IN
  net MOTOR_OUT
  net RETURN

  part T1 type: RESERVOIR pins:(TANK, RETURN) doc:"Reservoir"
  part P1 type: PUMP_VAR pins:(TANK, PUMP_OUT) doc:"Variable pump with LS"
  part V1 type: VALVE_43 pins:(PUMP_OUT, MOTOR_IN, MOTOR_OUT, RETURN)
       doc:"Directional valve"
  part M1 type: MOTOR_HYD pins:(MOTOR_IN, MOTOR_OUT) doc:"Hydraulic motor"
  part F1 type: FILTER_HYD pins:(RETURN, TANK) doc:"Suction filter"
  part F2 type: FILTER_HYD pins:(MOTOR_OUT, RETURN) doc:"Return filter"
}
```

**Advanced Features:**

- Variable displacement pump adjusts to load
- Load sensing reduces energy consumption
- Dual filtration protects components
- Synthetic fluid for extended temperature range

---

### Example 4: Hydraulic Press System

High-force pressing application with intensifier.

```runiq
hydraulic "Hydraulic Press" {
  pressure 250 bar operating
  flowRate 100 L/min
  fluid phosphate-ester "Type IV" temp:(15, 80, degC)

  net TANK
  net PUMP
  net HIGH_PRESS
  net CYL_A

  part RES type: RESERVOIR pins:(TANK) doc:"Reservoir with cooling"
  part P1 type: PUMP_FIXED pins:(TANK, PUMP) doc:"Main pump"
  part INT type: ACCUMULATOR pins:(PUMP, HIGH_PRESS) doc:"Intensifier"
  part V1 type: VALVE_43 pins:(HIGH_PRESS, CYL_A, TANK)
       doc:"Main control valve"
  part C1 type: CYL_HYD pins:(CYL_A) doc:"Press cylinder"
  part RV1 type: RELIEF_VALVE pins:(HIGH_PRESS, TANK)
       doc:"Relief @ 250 bar"
}
```

**Applications:**

- Forging presses
- Injection molding
- Metal forming
- Compression testing

**Safety:**

- Fire-resistant fluid for high-temperature operation
- Relief valve prevents dangerous overpressure
- Accumulator provides emergency pressure

---

### Example 5: Counterbalance Circuit

Load holding for vertical actuators.

```runiq
hydraulic "Counterbalance" {
  pressure 180 bar operating
  flowRate 50 L/min
  fluid mineral "ISO VG 46"

  net PUMP
  net CYL_CAP
  net CYL_ROD
  net TANK

  part V1 type: VALVE_43 pins:(PUMP, CYL_CAP, CYL_ROD, TANK)
       doc:"Main valve"
  part CB1 type: REDUCING_VALVE pins:(CYL_CAP, TANK)
       doc:"Counterbalance valve"
  part PCV type: CHECK_VALVE_HYD pins:(PUMP, CYL_CAP)
       doc:"Pilot-operated check"
  part C1 type: CYL_HYD pins:(CYL_CAP, CYL_ROD)
       doc:"Vertical cylinder"
}
```

**Purpose:**

- Prevents load from free-falling
- Controls lowering speed
- Maintains position under load
- Applications: Lifts, cranes, vertical presses

## Fluid Selection

### Mineral Oils (Most Common)

**ISO VG 32:**

- Low viscosity, good cold start
- Typical temperature: -10°C to 60°C
- Applications: Mobile equipment, cold climates

**ISO VG 46:**

- General purpose, most popular
- Typical temperature: 10°C to 60°C
- Applications: Industrial machinery, presses

**ISO VG 68:**

- Higher viscosity, better lubrication
- Typical temperature: 20°C to 80°C
- Applications: High-load systems, hot environments

### Synthetic Fluids

**Advantages:**

- Wider temperature range (-40°C to 100°C)
- Better oxidation resistance
- Longer fluid life
- Cleaner operation

**Disadvantages:**

- Higher cost (2-3x mineral oil)
- Compatibility concerns with seals

**Applications:**

- Aircraft hydraulics
- Extreme temperature environments
- Long service intervals required

### Biodegradable Fluids

**Types:**

- HETG (Triglyceride esters)
- HEES (Synthetic esters)
- HEPG (Polyglycols)

**Applications:**

- Forestry equipment
- Marine applications
- Environmentally sensitive areas

### Fire-Resistant Fluids

**Phosphate-Ester (Type IV):**

- Excellent fire resistance
- Operating temperature: 15°C to 80°C
- Applications: Die casting, hot forming

**Water-Glycol:**

- Good fire resistance, lower cost
- 35-50% water content
- Applications: Mining, foundries

## Best Practices

### System Design

1. **Pressure Selection**
   - Match pressure to application requirements
   - Don't over-specify - higher pressure = more cost
   - Include 20% safety margin
   - Use relief valves on all pressure sources

2. **Flow Rate Calculation**

   ```
   Flow (L/min) = Cylinder Volume (L) / Time (min)
   Add 30% for line losses and valve restrictions
   ```

3. **Fluid Cleanliness**
   - ISO 4406 cleanliness codes
   - Target: 18/16/13 for general industrial
   - Target: 15/13/10 for servo valves
   - Use appropriate filter ratings (3-25µm)

4. **Temperature Management**
   - Ideal operating: 40-55°C
   - Maximum continuous: 65-70°C
   - Install heat exchanger if needed
   - Size reservoir for 3-5 minute dwell time

### Component Selection

**Pumps:**

- Fixed: Simple, reliable, constant flow
- Variable: Efficient, load-sensing, complex
- Size for peak flow + 10%

**Valves:**

- Match flow rating to system requirements
- Consider response time for application
- Specify proper actuation (manual, solenoid, pilot)

**Cylinders:**

- Calculate force: Area × Pressure
- Consider buckling on long strokes
- Account for rod-side area difference

### Maintenance Guidelines

**Daily Checks:**

- Visual leak inspection
- Check fluid level in reservoir
- Monitor operating temperature
- Listen for unusual noises

**Weekly:**

- Check pressure gauge readings
- Inspect filter indicators
- Clean reservoir breather

**Monthly:**

- Sample and test fluid
- Inspect hoses and fittings
- Check for external damage

**Annually:**

- Change hydraulic fluid
- Replace all filters
- Disassemble and inspect valves
- Test relief valve setting

### Safety Considerations

⚠️ **Critical Safety Rules:**

1. **High Pressure Hazards**
   - Hydraulic injection injuries can be fatal
   - Never search for leaks with hands
   - Depressurize before disconnecting lines
   - Use proper tools for high-pressure connections

2. **Fire Prevention**
   - Use fire-resistant fluids in hot environments
   - Keep work area clean of oil residue
   - Install fire suppression in critical areas
   - Maintain proper fluid temperature

3. **Fluid Contamination**
   - Always filter new fluid before adding
   - Keep reservoir caps closed
   - Use clean containers for fluid transfer
   - Never mix incompatible fluid types

4. **System Protection**
   - Install relief valves on all pressure sources
   - Use burst-resistant hoses
   - Implement emergency shutoff
   - Provide load holding valves for vertical loads

### Common Circuit Patterns

**Load Sensing:**

```runiq
// Pump adjusts output to match demand
part P1 type: PUMP_VAR pins:(TANK, PUMP) doc:"LS pump"
part V1 type: VALVE_43 pins:(PUMP, A, B, TANK) doc:"LS valve"
// Pilot line from valve to pump (load signal)
```

**Regenerative Circuit:**

```runiq
// Faster extension by routing rod-side flow to cap side
part V1 type: VALVE_43 pins:(PUMP, CAP, ROD, TANK) doc:"Regen valve"
part CV1 type: CHECK_VALVE_HYD pins:(ROD, CAP) doc:"Regen path"
part C1 type: CYL_HYD pins:(CAP, ROD) doc:"Cylinder"
```

**Accumulator Circuit:**

```runiq
// Energy storage for peak demand
part P1 type: PUMP_FIXED pins:(TANK, PUMP) doc:"Small pump"
part AC1 type: ACCUMULATOR pins:(PUMP) doc:"Stores energy"
part PS1 type: REDUCING_VALVE pins:(PUMP) doc:"Charge pressure"
// Accumulator supplies high flow when needed
```

## Pressure Unit Conversions

| bar | psi  | kPa   | MPa  |
| --- | ---- | ----- | ---- |
| 70  | 1015 | 7000  | 7.0  |
| 140 | 2030 | 14000 | 14.0 |
| 210 | 3045 | 21000 | 21.0 |
| 280 | 4061 | 28000 | 28.0 |
| 350 | 5076 | 35000 | 35.0 |

## Flow Rate Conversions

| L/min | GPM (US) | m³/h |
| ----- | -------- | ---- |
| 10    | 2.6      | 0.6  |
| 40    | 10.6     | 2.4  |
| 100   | 26.4     | 6.0  |
| 200   | 52.8     | 12.0 |

## Viscosity Selection Guide

| ISO VG Grade | Kinematic Viscosity @ 40°C | Typical Use                      |
| ------------ | -------------------------- | -------------------------------- |
| VG 22        | 19.8-24.2 cSt              | Low temperature, high speed      |
| VG 32        | 28.8-35.2 cSt              | Mobile equipment, cold climate   |
| VG 46        | 41.4-50.6 cSt              | General industrial (most common) |
| VG 68        | 61.2-74.8 cSt              | High load, elevated temperature  |
| VG 100       | 90-110 cSt                 | Heavy duty, slow speed           |

## Related Documentation

- [ISO 1219 Symbol Reference](../ISO-1219-SYMBOL-REFERENCE.md)
- [Pneumatic Circuits](./pneumatic-circuits.md)
- [Example Files](../../examples/hydraulic/)

## Troubleshooting

**Slow or Erratic Motion:**

- Check for air in system (bleed cylinders)
- Verify adequate flow rate
- Inspect for internal leakage
- Check fluid viscosity vs. temperature

**Overheating:**

- Reduce pressure if possible
- Check for excessive cycling
- Install or upgrade heat exchanger
- Verify proper fluid level

**Excessive Noise:**

- Check for cavitation (suction line restriction)
- Verify pump inlet design
- Inspect for mechanical looseness
- Check relief valve setting

**System Contamination:**

- Change hydraulic fluid immediately
- Replace all filters
- Flush lines and components
- Investigate contamination source

**Loss of Pressure:**

- Check relief valve setting
- Inspect for external leaks
- Test pump output flow
- Check for worn seals in cylinders/valves
