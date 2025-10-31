# Pneumatic Circuits

Complete guide to creating pneumatic circuit diagrams using Runiq DSL with ISO 1219-1 compliant symbols.

## Table of Contents

- [Overview](#overview)
- [Syntax](#syntax)
- [Symbol Reference](#symbol-reference)
- [Examples](#examples)
- [Best Practices](#best-practices)

## Overview

Runiq supports pneumatic circuit diagrams following ISO 1219-1 standards for fluid power systems. Pneumatic circuits use compressed air (typically 6-10 bar) for actuation, control, and automation.

**Key Features:**

- 12 standard pneumatic symbols
- Pressure specification (bar, psi, kPa, MPa)
- Flow rate specification (L/min, CFM, m³/h)
- Net-based connectivity
- Automatic SVG rendering

## Syntax

### Profile Declaration

```runiq
pneumatic "Circuit Name" {
  pressure 6 bar operating
  flowRate 500 L/min

  net NET1
  net NET2

  part P1 type:CYL_DA pins:(NET1,NET2) doc:"Description"
}
```

### Pressure Specification

Format: `pressure <value> <unit> [<type>]`

**Units:** `bar`, `psi`, `kPa`, `MPa`  
**Types (optional):** `operating`, `max`, `min`, `nominal`, `rated`

**Examples:**

```runiq
pressure 6 bar operating        // Standard factory air
pressure 87 psi max             // Maximum system pressure
pressure 600 kPa nominal        // Nominal operating point
```

### Flow Rate Specification

Format: `flowRate <value> <unit>`

**Units:** `L/min`, `L/s`, `CFM`, `GPM`, `m³/h`

**Examples:**

```runiq
flowRate 500 L/min      // Liters per minute
flowRate 18 CFM         // Cubic feet per minute
flowRate 30 m³/h        // Cubic meters per hour
```

### Parts (Components)

Format: `part <ref> type:<type> pins:(<net1>,<net2>,...) doc:"<description>"`

**Required:**

- `ref` - Unique component reference (e.g., C1, V1)
- `type` - Symbol type (see Symbol Reference below)

**Optional:**

- `pins:(...)` - Connected nets
- `doc:"..."` - Component description

### Nets (Air Lines)

Format: `net <name>`

Nets represent air supply lines, pilot lines, and exhaust paths. Components connect to nets via pins.

**Naming Conventions:**

- `SUPPLY` - Main air supply
- `PORT_A`, `PORT_B` - Cylinder ports
- `PILOT_EXT`, `PILOT_RET` - Pilot control lines
- `EXHAUST` - Exhaust to atmosphere

## Symbol Reference

### Actuators

| Symbol     | Type                   | Description                                       | Pins               |
| ---------- | ---------------------- | ------------------------------------------------- | ------------------ |
| **CYL_SA** | Single-Acting Cylinder | Spring return cylinder, extends with air pressure | 2 (inlet, exhaust) |
| **CYL_DA** | Double-Acting Cylinder | Powered extend and retract                        | 2 (port A, port B) |

**Example:**

```runiq
part C1 type:CYL_DA pins:(PORT_A,PORT_B) doc:"Main cylinder"
```

### Valves

| Symbol          | Type                  | Description                           | Pins |
| --------------- | --------------------- | ------------------------------------- | ---- |
| **VALVE_32**    | 3/2-Way Valve         | 3 ports, 2 positions, normally closed | 3    |
| **VALVE_52**    | 5/2-Way Valve         | 5 ports, 2 positions, pilot operated  | 5    |
| **CHECK_VALVE** | Check Valve (One-Way) | Allows flow in one direction only     | 2    |

**Example:**

```runiq
part V1 type:VALVE_52 pins:(SUPPLY,PORT_A,PORT_B,EXHAUST_A,EXHAUST_B)
```

### Air Preparation

| Symbol         | Type                    | Description                    | Pins |
| -------------- | ----------------------- | ------------------------------ | ---- |
| **AIR_SOURCE** | Air Supply / Compressor | Compressed air source          | 1    |
| **FILTER**     | Air Filter              | Removes particulates and water | 2    |
| **REGULATOR**  | Pressure Regulator      | Reduces and maintains pressure | 2    |
| **LUBRICATOR** | Air Lubricator          | Adds oil mist to air           | 2    |

**FRL Unit Example:**

```runiq
part F1 type:FILTER pins:(SUPPLY,FILTERED)
part R1 type:REGULATOR pins:(FILTERED,REGULATED)
part L1 type:LUBRICATOR pins:(REGULATED,OUTPUT)
```

### Flow Control

| Symbol           | Type               | Description                      | Pins |
| ---------------- | ------------------ | -------------------------------- | ---- |
| **FLOW_CONTROL** | Flow Control Valve | Restricts flow for speed control | 2    |
| **EXHAUST**      | Exhaust Muffler    | Silenced exhaust to atmosphere   | 1    |

### Instrumentation

| Symbol      | Type           | Description              | Pins |
| ----------- | -------------- | ------------------------ | ---- |
| **GAUGE_P** | Pressure Gauge | Displays system pressure | 1    |

## Examples

### Example 1: Basic Cylinder Control

Simple single-acting cylinder with manual control.

```runiq
pneumatic "Basic Cylinder" {
  pressure 6 bar operating
  flowRate 200 L/min

  net SUPPLY
  net CYLINDER
  net EXHAUST

  part AS type:AIR_SOURCE pins:(SUPPLY) doc:"Compressor"
  part V1 type:VALVE_32 pins:(SUPPLY,CYLINDER,EXHAUST) doc:"Manual valve"
  part C1 type:CYL_SA pins:(CYLINDER) doc:"Single-acting cylinder"
}
```

**Operation:** Pressing the valve button extends the cylinder. Spring returns when released.

---

### Example 2: Double-Acting Cylinder with Speed Control

Advanced control with extend/retract speed regulation.

```runiq
pneumatic "Speed Control Cylinder" {
  pressure 6 bar operating
  flowRate 800 L/min

  net SUPPLY
  net PORT_A
  net PORT_B
  net EXHAUST_A
  net EXHAUST_B

  part V1 type:VALVE_52 pins:(SUPPLY,PORT_A,PORT_B,EXHAUST_A,EXHAUST_B)
       doc:"5/2 double solenoid valve"
  part FC1 type:FLOW_CONTROL pins:(PORT_A) doc:"Extend speed control"
  part FC2 type:FLOW_CONTROL pins:(PORT_B) doc:"Retract speed control"
  part C1 type:CYL_DA pins:(PORT_A,PORT_B) doc:"Double-acting cylinder"
}
```

**Features:**

- Independent speed control for extend/retract
- Meter-out flow control for smooth operation
- Double solenoid valve for positive positioning

---

### Example 3: FRL Air Preparation

Complete air conditioning system.

```runiq
pneumatic "FRL Unit" {
  pressure 6 bar operating
  flowRate 1000 L/min

  net RAW_AIR
  net FILTERED
  net REGULATED
  net OUTPUT

  part AS type:AIR_SOURCE pins:(RAW_AIR) doc:"Main compressor"
  part F1 type:FILTER pins:(RAW_AIR,FILTERED) doc:"Air filter with drain"
  part R1 type:REGULATOR pins:(FILTERED,REGULATED) doc:"Pressure regulator"
  part G1 type:GAUGE_P pins:(REGULATED) doc:"Pressure gauge"
  part L1 type:LUBRICATOR pins:(REGULATED,OUTPUT) doc:"Oil mist lubricator"
}
```

**Purpose:** Prepares compressed air for pneumatic tools and actuators by:

1. Filtering water and particulates
2. Regulating pressure to safe working level
3. Adding lubrication for moving parts

---

### Example 4: Sequential Control (A+ B+ B- A-)

Two cylinders operating in sequence.

```runiq
pneumatic "Sequential Control" {
  pressure 6 bar operating
  flowRate 1200 L/min

  net SUPPLY
  net A_EXT
  net A_RET
  net B_EXT
  net B_RET

  // Cylinder A circuit
  part VA type:VALVE_52 pins:(SUPPLY,A_EXT,A_RET) doc:"Valve A"
  part CA type:CYL_DA pins:(A_EXT,A_RET) doc:"Cylinder A"

  // Cylinder B circuit
  part VB type:VALVE_52 pins:(SUPPLY,B_EXT,B_RET) doc:"Valve B"
  part CB type:CYL_DA pins:(B_EXT,B_RET) doc:"Cylinder B"
}
```

**Sequence:**

1. **A+** - Cylinder A extends
2. **B+** - Cylinder B extends (when A reaches end position)
3. **B-** - Cylinder B retracts
4. **A-** - Cylinder A retracts (when B fully retracted)

Typical application: Assembly stations, material handling

---

### Example 5: Reciprocating Circuit

Continuous back-and-forth motion.

```runiq
pneumatic "Reciprocating Cylinder" {
  pressure 6 bar operating
  flowRate 600 L/min

  net SUPPLY
  net PORT_A
  net PORT_B

  part V1 type:VALVE_52 pins:(SUPPLY,PORT_A,PORT_B) doc:"Control valve"
  part C1 type:CYL_DA pins:(PORT_A,PORT_B) doc:"Oscillating cylinder"
  part FC1 type:FLOW_CONTROL pins:(PORT_A) doc:"Speed adjustment"
}
```

**Application:** Sifting, vibrating feeders, agitation

## Best Practices

### Design Guidelines

1. **Pressure Selection**
   - Standard factory air: 6 bar (87 psi)
   - Low pressure circuits: 2-4 bar
   - Never exceed component ratings

2. **Flow Rate Sizing**
   - Calculate based on cylinder volume and cycle time
   - Add 20-30% margin for losses
   - Consider all actuators operating simultaneously

3. **Air Preparation**
   - Always include FRL unit for tool protection
   - Place filter close to compressor
   - Locate lubricator near point of use

4. **Component Placement**
   - Group related components
   - Minimize line lengths
   - Position valves for easy access

### Naming Conventions

**Nets:**

```runiq
net SUPPLY          // Main air supply
net PORT_A          // Cylinder port A
net PORT_B          // Cylinder port B
net PILOT_EXT       // Pilot line for extend
net EXHAUST         // Exhaust to atmosphere
```

**Parts:**

```runiq
part C1, C2, C3     // Cylinders
part V1, V2, V3     // Valves
part F1, F2         // Filters
part R1, R2         // Regulators
part L1             // Lubricator
part G1, G2         // Gauges
```

### Safety Considerations

⚠️ **Important Safety Notes:**

1. **Pressure Limits**
   - Verify all components rated for system pressure
   - Include pressure relief valves on compressor
   - Monitor pressure with gauges

2. **Emergency Stops**
   - Provide manual shutoff valves
   - Design for safe exhaust under all conditions
   - Consider fail-safe valve positions

3. **Air Quality**
   - Use proper filtration to prevent component damage
   - Drain water from filters regularly
   - Maintain lubricator oil level

4. **Maintenance**
   - Inspect for air leaks regularly
   - Replace filter elements per schedule
   - Check regulator output pressure

### Common Patterns

**Meter-Out Speed Control:**

```runiq
// Restricts exhaust flow for smooth cylinder motion
part V1 type:VALVE_52 pins:(SUPPLY,PORT_A,PORT_B,EXH_A,EXH_B)
part FC1 type:FLOW_CONTROL pins:(EXH_A) doc:"Meter-out extend"
part C1 type:CYL_DA pins:(PORT_A,PORT_B)
```

**Quick Exhaust:**

```runiq
// Rapid cylinder retraction
part V1 type:VALVE_32 pins:(SUPPLY,CYL_A,EXH)
part QE type:EXHAUST pins:(CYL_A) doc:"Quick exhaust valve"
part C1 type:CYL_SA pins:(CYL_A)
```

**Dual Pressure System:**

```runiq
// High pressure for power, low pressure for control
part R1 type:REGULATOR pins:(SUPPLY,HIGH_PRESS) doc:"Main pressure"
part R2 type:REGULATOR pins:(HIGH_PRESS,LOW_PRESS) doc:"Pilot pressure"
```

## Pressure Unit Conversions

| bar | psi  | kPa  | MPa |
| --- | ---- | ---- | --- |
| 1   | 14.5 | 100  | 0.1 |
| 6   | 87   | 600  | 0.6 |
| 8   | 116  | 800  | 0.8 |
| 10  | 145  | 1000 | 1.0 |

## Flow Rate Conversions

| L/min | CFM | m³/h |
| ----- | --- | ---- |
| 100   | 3.5 | 6    |
| 500   | 18  | 30   |
| 1000  | 35  | 60   |

## Related Documentation

- [ISO 1219 Symbol Reference](../ISO-1219-SYMBOL-REFERENCE.md)
- [Hydraulic Circuits](./hydraulic-circuits.md)
- [Example Files](../../examples/pneumatic/)

## Troubleshooting

**Slow Cylinder Motion:**

- Check for air leaks
- Verify adequate flow rate
- Inspect flow control settings

**Erratic Operation:**

- Clean or replace air filter
- Check pressure regulation
- Verify valve spool movement

**Cylinder Stalling:**

- Increase air pressure (within limits)
- Reduce load or friction
- Check for blocked exhaust

**Excessive Noise:**

- Install exhaust mufflers
- Reduce operating pressure if possible
- Check for loose connections
