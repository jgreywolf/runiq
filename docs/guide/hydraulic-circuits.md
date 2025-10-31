---
title: Hydraulic Circuits
---

# Hydraulic Circuits

Create hydraulic circuit diagrams for fluid power systems with Runiq's hydraulic profile.

## Overview

Hydraulic circuits use pressurized fluid (typically oil) to transmit power and control movement. These diagrams follow ISO 1219-1 standards and are used in heavy machinery, construction equipment, aerospace, and industrial applications requiring high force and precise control.

## Profile Syntax

```runiq
hydraulic "Circuit Name" {
  # Hydraulic-specific components and connections
}
```

## Key Components

### Power Supply

- **Pump**: Fixed displacement, variable displacement
- **Motor**: Prime mover (electric, diesel, etc.)
- **Reservoir**: Hydraulic fluid tank
- **Filter**: Remove contaminants
- **Heat Exchanger**: Cool hydraulic fluid

### Valves

- **Directional Control Valves**: 2/2, 3/2, 4/3
- **Pressure Control Valves**: Relief, reducing, sequence
- **Flow Control Valves**: Throttle, compensated
- **Check Valves**: Allow one-way flow
- **Proportional Valves**: Electronic control

### Actuators

- **Linear Cylinders**: Single-rod, double-rod, telescopic
- **Hydraulic Motors**: Gear, vane, piston motors
- **Rotary Actuators**: Limited rotation

### Accessories

- **Accumulators**: Store energy, dampen shocks
- **Pressure Gauges**: Monitor system pressure
- **Temperature Sensors**: Monitor fluid temperature
- **Manifolds**: Valve mounting blocks

## Basic Hydraulic Circuit

```runiq
hydraulic "Simple Cylinder Circuit" {
  tank T labeled: "Reservoir"

  component pump as @pump type: "fixed" connected: T output: P pressure: "210 bar" labeled: "Hydraulic Pump"
  component relief as @relief_valve connected: P setting: "200 bar" labeled: "Relief Valve"
  component valve as @valve_4_3 connected: P type: "closed-center" labeled: "4/3 DCV"
  component cylinder as @cylinder_double connected: valve ports: (A, B) labeled: "Hydraulic Cylinder"

  # Pressure line
  pump -> relief -> valve

  # Cylinder ports
  valve.portA -> cylinder.portA label: "Extend"
  valve.portB -> cylinder.portB label: "Retract"

  # Return to tank
  valve.portT -> T label: "Return"
  relief.return -> T label: "Relief"
}
```

## Pump and Motor Circuit

```runiq
hydraulic "Open-Loop Motor Circuit" {
  tank T labeled: "Reservoir"

  component motor_drive as @motor type: "electric" labeled: "Prime Mover"
  component pump as @pump type: "gear" connected: T output: P labeled: "Gear Pump"
  component filter as @filter connected: T labeled: "Return Filter"
  component relief as @relief_valve connected: P setting: "150 bar"
  component valve as @valve_4_3 connected: P type: "tandem-center"
  component motor as @motor_hydraulic connected: valve type: "gear" labeled: "Hydraulic Motor"

  motor_drive -> pump label: "Mechanical drive"
  pump -> relief -> valve label: "Pressure: 210 bar"
  valve.portA -> motor.portA label: "Forward"
  valve.portB -> motor.portB label: "Reverse"
  motor.drain -> filter -> T label: "Case drain"
  valve.portT -> filter -> T label: "Return"
}
```

## Closed-Center Circuit

High-efficiency circuit with pressure compensation:

```runiq
hydraulic "Closed-Center Load-Sensing" {
  tank T labeled: "Reservoir"

  component pump as @pump type: "variable-displacement" output: P labeled: "Load-Sensing Pump"
  component relief as @relief_valve connected: P setting: "250 bar"
  component valve as @valve_4_3 connected: P type: "closed-center" labeled: "Proportional Valve"
  component cylinder as @cylinder_double connected: valve
  component ls_line as @pilot_line labeled: "Load-Sensing Line"

  # Load sensing feedback
  valve.portP -> cylinder
  cylinder.portA -> ls_line label: "Load pressure"
  ls_line -> pump.ls_port label: "Adjust displacement"

  # Pump adjusts flow based on load
  note "Pump displacement varies\nwith load demand" at: pump
}
```

## Counterbalance Valve Circuit

Prevent load from running away:

```runiq
hydraulic "Counterbalance - Vertical Load" {
  tank T labeled: "Reservoir"

  component pump as @pump connected: T output: P
  component relief as @relief_valve connected: P setting: "200 bar"
  component valve as @valve_4_3 connected: P type: "open-center"
  component cylinder as @cylinder_double type: "vertical" labeled: "Vertical Cylinder"
  component counterbalance as @counterbalance connected: cylinder.portA setting: "120 bar" labeled: "Counterbalance Valve"
  component load as @weight connected: cylinder labeled: "5000 kg Load"

  # Lowering circuit
  valve.portA -> cylinder.portA label: "Raise"
  cylinder.portA -> counterbalance -> valve.portB label: "Lower (controlled)"

  # Prevents load drop
  note "Counterbalance holds load\nwhen valve is neutral" at: counterbalance
}
```

## Accumulator Circuit

Energy storage and shock dampening:

```runiq
hydraulic "Accumulator Circuit" {
  tank T labeled: "Reservoir"

  component pump as @pump connected: T output: P pressure: "210 bar"
  component relief as @relief_valve connected: P setting: "200 bar"
  component accumulator as @accumulator connected: P type: "bladder" precharge: "140 bar" volume: "10L" labeled: "Accumulator"
  component isolation as @valve_2_2 connected: accumulator type: "solenoid NO"
  component valve as @valve_4_3 connected: P
  component cylinder as @cylinder_double connected: valve labeled: "Fast Stroke Cylinder"

  # Accumulator charges during idle
  pump -> accumulator label: "Charge"

  # Rapid discharge for fast motion
  isolation.open -> valve label: "Boost flow"

  note "Accumulator provides\nhigh flow for fast cycles" at: accumulator
}
```

## Regenerative Circuit

Increase extend speed:

```runiq
hydraulic "Regenerative Circuit" {
  tank T labeled: "Reservoir"

  component pump as @pump connected: T output: P flow: "60 L/min"
  component valve as @valve_4_3 connected: P type: "tandem-center"
  component cylinder as @cylinder_double connected: valve ratio: "2:1" labeled: "Cylinder (2:1 area ratio)"
  component regen_valve as @check_valve labeled: "Regeneration Check Valve"

  # Regeneration path
  valve.portA -> cylinder.portA label: "Cap end"
  cylinder.portB -> regen_valve -> cylinder.portA label: "Rod end (regenerated)"

  # Normal retract
  valve.portB -> cylinder.portB label: "Retract"
  cylinder.portA -> valve.portT -> T label: "Return"

  note "Extend speed = 3x normal\n(reduced force)" at: regen_valve
}
```

## Pressure-Reducing Circuit

Multiple pressure zones:

```runiq
hydraulic "Dual-Pressure Circuit" {
  tank T labeled: "Reservoir"

  component pump as @pump connected: T output: P pressure: "210 bar"
  component relief_main as @relief_valve connected: P setting: "200 bar" labeled: "Main Relief"

  # High-pressure circuit
  component valve_high as @valve_4_3 connected: P labeled: "Clamp Valve"
  component cylinder_clamp as @cylinder_double connected: valve_high labeled: "Clamp Cylinder (200 bar)"

  # Reduced-pressure circuit
  component reducer as @reducing_valve connected: P setting: "100 bar" labeled: "Pressure Reducer"
  component relief_low as @relief_valve connected: reducer setting: "110 bar" labeled: "Secondary Relief"
  component valve_low as @valve_4_3 connected: reducer labeled: "Feed Valve"
  component cylinder_feed as @cylinder_double connected: valve_low labeled: "Feed Cylinder (100 bar)"

  note "High pressure for clamping\nLow pressure for positioning" at: reducer
}
```

## Sequence Circuit

Automatic cylinder sequencing:

```runiq
hydraulic "Sequence Valve Circuit" {
  tank T labeled: "Reservoir"

  component pump as @pump connected: T output: P
  component relief as @relief_valve connected: P setting: "200 bar"
  component valve as @valve_4_3 connected: P

  # Primary cylinder
  component cylinder_1 as @cylinder_double labeled: "Cylinder 1 (Clamp)"
  component sequence as @sequence_valve setting: "150 bar" labeled: "Sequence Valve"

  # Secondary cylinder
  component cylinder_2 as @cylinder_double labeled: "Cylinder 2 (Feed)"

  # Sequence operation
  valve.portA -> cylinder_1.portA label: "Clamp first"
  cylinder_1.portA -> sequence label: "Pressure builds"
  sequence.output -> cylinder_2.portA label: "Feed when clamped"

  note "Cylinder 2 extends only after\nCylinder 1 reaches 150 bar" at: sequence
}
```

## Proportional Control

Electronic flow and pressure control:

```runiq
hydraulic "Proportional Valve Control" {
  tank T labeled: "Reservoir"

  component pump as @pump connected: T output: P
  component relief as @relief_valve connected: P
  component valve as @proportional_valve connected: P type: "4-way" labeled: "Proportional Valve"
  component cylinder as @cylinder_double connected: valve labeled: "Servo Cylinder"
  component controller as @controller labeled: "PLC/Motion Controller"
  component position_sensor as @lvdt connected: cylinder labeled: "Position Feedback"

  # Electronic control
  controller -> valve label: "±10V control signal"
  position_sensor -> controller label: "Position feedback"

  # Closed-loop position control
  note "Variable flow control\nfor precise positioning" at: valve
}
```

## Styling

```runiq
hydraulic "Styled Circuit" {
  style: {
    pressureLineColor: "#dc2626",
    returnLineColor: "#3b82f6",
    pilotLineColor: "#f59e0b",
    drainLineColor: "#64748b",
    tankColor: "#94a3b8",
    componentFill: "#ffffff",
    componentStroke: "#000000",
    showPressureValues: true
  }

  tank T
  component pump as @pump style: { fill: "#fef3c7", stroke: "#f59e0b" }
}
```

## Best Practices

1. **System pressure** - Specify operating pressure (100-350 bar typical)
2. **Filtration** - Include filters on return lines (10-25 micron)
3. **Cooling** - Add heat exchangers for continuous operation
4. **Relief valves** - Always protect pump with relief valve
5. **Accumulators** - Use for shock dampening and energy storage
6. **Case drains** - Route motor/valve case drains to tank separately
7. **Line sizing** - Proper hose/tube diameter for flow rates
8. **Maintenance** - Plan for filter changes, fluid sampling

## ISO 1219-1 Standards

**Line Types:**

- **Heavy solid**: Main pressure lines
- **Medium solid**: Return lines
- **Dashed**: Pilot/control lines
- **Dotted**: Drain lines
- **Double lines**: Mechanical connections

**Symbols:**

- **Triangle**: Pump, motor
- **Square**: Valves
- **Circle**: Rotary components
- **Rectangle**: Cylinders, filters

## Hydraulic Formulas

**Flow Rate:**

```
Q (L/min) = Cylinder Area (cm²) × Stroke (cm) × Cycles/min ÷ 1000
```

**Cylinder Force:**

```
F (kN) = Pressure (bar) × Area (cm²) ÷ 100
```

**Pump Power:**

```
P (kW) = Pressure (bar) × Flow (L/min) ÷ 600
```

**Pressure Drop:**

```
ΔP (bar) = Flow² × Length × Viscosity ÷ (Diameter⁴ × Constant)
```

## Common Operating Pressures

| Application          | Pressure Range |
| -------------------- | -------------- |
| Mobile equipment     | 200-350 bar    |
| Industrial presses   | 150-250 bar    |
| Machine tools        | 50-150 bar     |
| Aircraft systems     | 200-300 bar    |
| Low-pressure systems | 50-100 bar     |

## Troubleshooting Guide

| Issue          | Possible Cause                   | Check                              |
| -------------- | -------------------------------- | ---------------------------------- |
| Low pressure   | Pump wear, relief set too low    | Pump efficiency, relief setting    |
| Overheating    | Inadequate cooling, high load    | Cooler capacity, cycle time        |
| Slow operation | Low flow, restriction            | Flow rate, filter condition        |
| Cylinder drift | Internal leakage, counterbalance | Seal condition, valve setting      |
| Noise          | Cavitation, air in system        | Inlet restriction, reservoir level |
| Contamination  | Poor filtration, seal wear       | Filter rating, oil analysis        |

## Hydraulic Fluids

**Mineral Oil-Based:**

- ISO VG 32, 46, 68
- Temperature range: -20°C to +80°C
- Most common, economical

**Synthetic:**

- Fire-resistant (HFC, HFD)
- High temperature (HEES)
- Biodegradable (HETG)

**Maintenance:**

- Regular oil analysis
- Change filters per schedule
- Maintain fluid cleanliness (ISO 4406)

## Examples

See the [examples/hydraulic](https://github.com/jgreywolf/runiq/tree/main/examples/hydraulic) directory for complete examples.

## Related

- [Profiles](/guide/profiles)
- [Pneumatic Circuits](/guide/pneumatic-circuits)
- [Electrical Circuits](/guide/electrical)

## Resources

- [ISO 1219-1:2012](https://www.iso.org/standard/51952.html) - Fluid power systems standard
- [Hydraulics & Pneumatics Magazine](https://www.hydraulicspneumatics.com/)
- [Eaton Hydraulics](https://www.eaton.com/us/en-us/products/hydraulics.html)
- [Bosch Rexroth](https://www.boschrexroth.com/) - Component manufacturer
- [Parker Hannifin](https://www.parker.com/hydraulics) - Training and components
