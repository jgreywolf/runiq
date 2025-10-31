---
title: Pneumatic Circuits
---

# Pneumatic Circuits

Create pneumatic circuit diagrams for compressed air systems with Runiq's pneumatic profile.

## Overview

Pneumatic circuits use compressed air to transmit and control power. These diagrams follow ISO 1219-1 standards for fluid power systems and are commonly used in industrial automation, robotics, and manufacturing.

## Profile Syntax

```runiq
pneumatic "Circuit Name" {
  # Pneumatic-specific components and connections
}
```

## Key Components

### Air Supply

- **Compressor**: Source of compressed air
- **Filter**: Removes contaminants
- **Regulator**: Controls pressure
- **Lubricator**: Adds lubrication mist
- **FRL Unit**: Filter-Regulator-Lubricator combination

### Valves

- **Directional Control Valves**: 2/2, 3/2, 4/2, 5/2, 5/3
- **Check Valves**: Allow flow in one direction
- **Flow Control Valves**: Regulate flow rate
- **Pressure Relief Valves**: Limit maximum pressure
- **Quick Exhaust Valves**: Speed up exhaust

### Actuators

- **Cylinders**: Single-acting, double-acting
- **Rotary Actuators**: Convert linear to rotary motion
- **Grippers**: End-effectors for robotics
- **Motors**: Pneumatic motors

### Accessories

- **Pressure Gauges**: Measure system pressure
- **Mufflers**: Reduce exhaust noise
- **Air Reservoir**: Store compressed air
- **Tubing/Hoses**: Transmit air

## Basic Circuit Example

```runiq
pneumatic "Single-Acting Cylinder" {
  supply P labeled: "6 bar"

  component compressor as @compressor connected: P
  component frl as @frl connected: P output: P1
  component valve as @valve_3_2 connected: P1 type: "spring return"
  component cylinder as @cylinder_single connected: valve ports: (A, R)

  valve -> cylinder label: "Port A"
  valve -> exhaust label: "Port R"
}
```

## Double-Acting Cylinder Control

```runiq
pneumatic "Double-Acting Cylinder - 5/2 Valve" {
  supply P labeled: "6 bar"

  component frl as @frl connected: P output: P1 labeled: "FRL Unit"
  component valve as @valve_5_2 connected: P1 type: "solenoid" labeled: "5/2-way Valve"
  component cylinder as @cylinder_double connected: valve ports: (A, B) labeled: "Double-Acting Cylinder"

  valve -> cylinder.portA label: "Extend"
  valve -> cylinder.portB label: "Retract"
  valve -> exhaust.portR label: "Exhaust"
  valve -> exhaust.portS label: "Exhaust"
}
```

## Speed Control Circuit

```runiq
pneumatic "Speed Control" {
  supply P labeled: "6 bar"

  component frl as @frl connected: P output: P1
  component valve as @valve_5_2 connected: P1 labeled: "Directional Valve"
  component throttle_in as @throttle type: "meter-in" labeled: "Speed Control In"
  component throttle_out as @throttle type: "meter-out" labeled: "Speed Control Out"
  component cylinder as @cylinder_double ports: (A, B)

  valve.portA -> throttle_in -> cylinder.portA
  cylinder.portB -> throttle_out -> valve.portB
}
```

## Reciprocating Circuit

Automatic back-and-forth motion:

```runiq
pneumatic "Reciprocating Cylinder" {
  supply P labeled: "6 bar"

  component frl as @frl connected: P output: P1
  component valve as @valve_5_2 connected: P1 type: "pilot" labeled: "5/2 Pilot Valve"
  component cylinder as @cylinder_double ports: (A, B) labeled: "Main Cylinder"
  component limit_extend as @limit_valve position: "extended" labeled: "Limit Valve (Extended)"
  component limit_retract as @limit_valve position: "retracted" labeled: "Limit Valve (Retracted)"

  # Main circuit
  valve.portA -> cylinder.portA label: "Extend"
  valve.portB -> cylinder.portB label: "Retract"

  # Pilot control
  limit_extend.output -> valve.pilotZ label: "Switch to retract"
  limit_retract.output -> valve.pilotY label: "Switch to extend"

  # Cylinder activates limit valves
  cylinder -> limit_extend trigger: "at end"
  cylinder -> limit_retract trigger: "at start"
}
```

## Sequencing Circuit

Multiple cylinders in sequence:

```runiq
pneumatic "Sequential Operation A+ B+ B- A-" {
  supply P labeled: "6 bar"

  component frl as @frl connected: P output: P1

  # Cylinder A circuit
  component valveA as @valve_5_2 connected: P1 labeled: "Valve A"
  component cylinderA as @cylinder_double labeled: "Cylinder A"

  # Cylinder B circuit
  component valveB as @valve_5_2 connected: P1 labeled: "Valve B"
  component cylinderB as @cylinder_double labeled: "Cylinder B"

  # Sequence control
  component start as @button labeled: "Start Button"
  component limitA0 as @limit_valve labeled: "A0 (Retracted)"
  component limitA1 as @limit_valve labeled: "A1 (Extended)"
  component limitB0 as @limit_valve labeled: "B0 (Retracted)"
  component limitB1 as @limit_valve labeled: "B1 (Extended)"

  # Sequence: Start -> A+ -> B+ -> B- -> A-
  start -> valveA.pilotZ label: "1. Extend A"
  limitA1 -> valveB.pilotZ label: "2. Extend B"
  limitB1 -> valveB.pilotY label: "3. Retract B"
  limitB0 -> valveA.pilotY label: "4. Retract A"
}
```

## Gripper Circuit

Pick-and-place gripper control:

```runiq
pneumatic "Pneumatic Gripper" {
  supply P labeled: "6 bar"

  component frl as @frl connected: P output: P1 pressure: "4 bar" labeled: "Reduced Pressure for Gripper"
  component valve as @valve_3_2 connected: P1 type: "solenoid NO" labeled: "Gripper Valve (3/2 NO)"
  component gripper as @gripper connected: valve type: "parallel" labeled: "Parallel Gripper"
  component pressure_sensor as @pressure_sensor connected: gripper labeled: "Grip Confirmation"

  valve -> gripper label: "Close"
  gripper -> pressure_sensor label: "Pressure feedback"

  note "NC valve = gripper open\nEnergize = gripper close" at: valve
}
```

## Safety Circuit

Emergency stop and safety features:

```runiq
pneumatic "Safety Circuit" {
  supply P labeled: "6 bar"

  component frl as @frl connected: P output: P1
  component estop as @button type: "emergency-stop" labeled: "E-Stop (NC)"
  component safety_valve as @valve_3_2 type: "safety" labeled: "Safety Exhaust Valve"
  component main_valve as @valve_5_2 connected: P1 labeled: "Main Control Valve"
  component cylinder as @cylinder_double

  # Normal operation
  P1 -> estop -> safety_valve -> main_valve
  main_valve -> cylinder

  # E-stop pressed: exhaust entire system
  estop.NC_open -> safety_valve.exhaust label: "Dump air on E-stop"

  note "E-stop cuts air supply\nand exhausts system" at: safety_valve
}
```

## Vacuum Circuit

Vacuum generation and control:

```runiq
pneumatic "Vacuum Gripper" {
  supply P labeled: "6 bar"

  component frl as @frl connected: P output: P1
  component vacuum_gen as @vacuum_generator connected: P1 labeled: "Venturi Generator"
  component valve as @valve_3_2 type: "solenoid NC" labeled: "Vacuum Valve"
  component suction_cup as @suction_cup connected: valve labeled: "Suction Cup"
  component vacuum_sensor as @vacuum_sensor connected: suction_cup labeled: "Vacuum Switch"

  P1 -> vacuum_gen label: "Compressed air"
  vacuum_gen.vacuum -> valve label: "Vacuum"
  valve -> suction_cup label: "Activate suction"
  suction_cup -> vacuum_sensor label: "Confirm vacuum"

  note "Vacuum ready when\nsensor < -0.5 bar" at: vacuum_sensor
}
```

## Styling

```runiq
pneumatic "Styled Circuit" {
  style: {
    supplyColor: "#3b82f6",
    exhaustColor: "#64748b",
    workingLineColor: "#10b981",
    pilotLineColor: "#f59e0b",
    componentFill: "#ffffff",
    componentStroke: "#000000"
  }

  supply P labeled: "6 bar"

  component valve as @valve_5_2
    style: { fill: "#dbeafe", stroke: "#1e40af", strokeWidth: 2 }
}
```

## Best Practices

1. **Pressure ratings** - Always specify system pressure (typically 4-8 bar)
2. **FRL units** - Include filter, regulator, lubricator at air supply
3. **Exhaust silencing** - Add mufflers to reduce noise
4. **Speed control** - Use flow controls for consistent cylinder speed
5. **Safety first** - Include emergency stops and pressure relief
6. **Label ports** - Mark A, B, P, R, S ports clearly
7. **Sequence logic** - Document operational sequences
8. **Pilot pressure** - Indicate pilot control lines with dashed lines

## ISO 1219-1 Standards

- **Solid lines**: Main working lines (pressure, return)
- **Dashed lines**: Pilot control lines
- **Dotted lines**: Drain lines
- **Triangle**: Direction of flow
- **Square**: Connection point
- **Circle**: Measurement point

## Common Valve Notations

- **2/2**: 2 ports, 2 positions
- **3/2**: 3 ports, 2 positions
- **4/2**: 4 ports, 2 positions
- **5/2**: 5 ports, 2 positions
- **5/3**: 5 ports, 3 positions (mid-position)

**Actuation Types:**

- Spring return
- Pilot operated
- Solenoid (single or double)
- Manual (push button, lever)
- Mechanical (roller, plunger)

## Troubleshooting Guide

| Issue               | Possible Cause                     | Check                           |
| ------------------- | ---------------------------------- | ------------------------------- |
| Slow cylinder       | Low pressure, restricted flow      | FRL pressure, flow controls     |
| Cylinder won't move | No air supply, valve stuck         | Air supply, valve position      |
| Leaking             | Worn seals, loose fittings         | Replace seals, tighten fittings |
| Chattering          | Contaminated air, pressure too low | Check filter, increase pressure |
| Won't hold position | Valve leaking, cylinder seal bad   | Replace valve/seals             |

## Examples

See the [examples/pneumatic](https://github.com/jgreywolf/runiq/tree/main/examples/pneumatic) directory for complete examples.

## Related

- [Profiles](/guide/profiles)
- [Hydraulic Circuits](/guide/hydraulic-circuits)
- [Electrical Circuits](/guide/electrical)

## Resources

- [ISO 1219-1:2012](https://www.iso.org/standard/51952.html) - Fluid power systems standard
- [SMC Pneumatics](https://www.smcpneumatics.com/) - Component manufacturer
- [Festo Didactic](https://www.festo-didactic.com/) - Training resources
- [Pneumatic Circuit Design](https://www.hydraulicspneumatics.com/)
