---
title: Pneumatic Circuits
description: Design pneumatic systems with cylinders, valves, sensors, and ISO 1219-1 compliant symbols for automation and control.
lastUpdated: 2025-01-09
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

## Complete Component Catalog

### Air Preparation Components

| Component            | Symbol ID             | Description                                | Typical Spec          |
| -------------------- | --------------------- | ------------------------------------------ | --------------------- |
| Air Compressor       | `@compressor`         | Generates compressed air                   | 10-500 CFM            |
| Air Filter           | `@air_filter`         | Removes particles (5-40 micron)            | 5 micron standard     |
| Pressure Regulator   | `@regulator`          | Controls downstream pressure               | 0-12 bar              |
| Lubricator           | `@lubricator`         | Adds oil mist for lubrication              | 1-3 drops/m³          |
| FRL Unit             | `@frl`                | Combined filter, regulator, lubricator     | 4-8 bar working       |
| Air Dryer            | `@air_dryer`          | Removes moisture                           | -40°C pressure dew    |
| Air Receiver         | `@air_tank`           | Stores compressed air                      | 50-5000 L             |
| Pressure Switch      | `@pressure_switch`    | Monitors pressure levels                   | Adjustable setpoint   |
| Pressure Gauge       | `@pressure_gauge`     | Visual pressure indication                 | 0-10 bar typical      |
| Water Separator      | `@water_separator`    | Removes condensate                         | 99% separation        |
| Aftercooler          | `@aftercooler`        | Cools air to remove moisture               | 5-10°C approach       |
| Coalescing Filter    | `@coalescing_filter`  | Removes oil and water aerosols             | 0.01 micron           |
| Activated Carbon     | `@carbon_filter`      | Removes oil vapor and odors                | 0.003 ppm oil vapor   |

### Directional Control Valves

| Valve Type           | Symbol ID             | Ports/Positions | Actuation Options                          |
| -------------------- | --------------------- | --------------- | ------------------------------------------ |
| 2/2 Valve            | `@valve_2_2`          | 2 ports, 2 pos  | Manual, solenoid, pilot, spring return     |
| 3/2 Valve (NC)       | `@valve_3_2_nc`       | 3 ports, 2 pos  | Normally closed, various actuation         |
| 3/2 Valve (NO)       | `@valve_3_2_no`       | 3 ports, 2 pos  | Normally open, various actuation           |
| 4/2 Valve            | `@valve_4_2`          | 4 ports, 2 pos  | Double solenoid, pilot, detented           |
| 5/2 Valve            | `@valve_5_2`          | 5 ports, 2 pos  | Standard cylinder control                  |
| 5/3 Valve (Closed)   | `@valve_5_3_closed`   | 5 ports, 3 pos  | All ports blocked in center                |
| 5/3 Valve (Exhaust)  | `@valve_5_3_exhaust`  | 5 ports, 3 pos  | Pressure blocked, A/B exhausted in center  |
| 5/3 Valve (Pressure) | `@valve_5_3_pressure` | 5 ports, 3 pos  | All ports pressurized in center            |

**Actuation Types:**
- Spring return: Returns to rest position when de-energized
- Pilot operated: Uses pneumatic pilot pressure
- Solenoid: Electrical coil actuation (24V DC typical)
- Manual: Push button, lever, foot pedal
- Mechanical: Roller, plunger, cam

### Flow Control Valves

| Component              | Symbol ID           | Description                                | Use Case              |
| ---------------------- | ------------------- | ------------------------------------------ | --------------------- |
| Throttle Valve         | `@throttle`         | Restricts flow in both directions          | Speed control         |
| Meter-In               | `@meter_in`         | Controls flow to actuator                  | Extend speed          |
| Meter-Out              | `@meter_out`        | Controls flow from actuator                | Retract speed         |
| One-Way Flow Control   | `@flow_control_1w`  | Flow control one direction, free reverse   | Controlled extend     |
| Quick Exhaust Valve    | `@quick_exhaust`    | Rapid exhaust close to cylinder            | Fast retraction       |
| Pressure Compensated   | `@flow_pc`          | Constant flow despite pressure variation   | Consistent speed      |
| Needle Valve           | `@needle_valve`     | Fine adjustment of flow                    | Precision tuning      |

### Pressure Control Valves

| Component              | Symbol ID           | Description                                | Setting Range         |
| ---------------------- | ------------------- | ------------------------------------------ | --------------------- |
| Relief Valve           | `@relief_valve`     | Limits maximum pressure                    | 0-12 bar              |
| Pressure Reducing      | `@pressure_reducer` | Lowers downstream pressure                 | 1-8 bar               |
| Sequence Valve         | `@sequence_valve`   | Triggers action at set pressure            | Adjustable setpoint   |
| Pressure Switch        | `@pressure_switch`  | Electrical output at threshold             | NO/NC contacts        |

### Check Valves

| Component              | Symbol ID           | Description                                | Cracking Pressure     |
| ---------------------- | ------------------- | ------------------------------------------ | --------------------- |
| Standard Check Valve   | `@check_valve`      | Allows flow in one direction               | 0.05-0.5 bar          |
| Pilot-Operated Check   | `@pilot_check`      | Opens reverse flow with pilot signal       | Locked until pilot    |
| Shuttle Valve (OR)     | `@shuttle_valve`    | Selects higher of two pressures            | Logic element         |
| Two-Pressure Valve     | `@two_pressure`     | Requires both inputs (AND logic)           | Logic element         |

### Pneumatic Actuators

| Actuator Type          | Symbol ID             | Description                                | Force/Torque Range    |
| ---------------------- | --------------------- | ------------------------------------------ | --------------------- |
| Single-Acting Cylinder | `@cylinder_single`    | Spring return, push or pull                | 10-5000 N @ 6 bar     |
| Double-Acting Cylinder | `@cylinder_double`    | Powered both directions                    | 20-10000 N @ 6 bar    |
| Rodless Cylinder       | `@cylinder_rodless`   | Magnetic or cable coupling                 | Long stroke (1-10 m)  |
| Telescopic Cylinder    | `@cylinder_telescopic`| Multi-stage for compact installation       | 2-5 stages            |
| Rotary Actuator        | `@rotary_actuator`    | Limited rotation (90°, 180°, 270°)         | 1-1000 Nm             |
| Pneumatic Motor        | `@motor_pneumatic`    | Continuous rotation                        | 0.1-20 kW             |
| Parallel Gripper       | `@gripper_parallel`   | Two-jaw parallel grip                      | 50-2000 N grip        |
| Angular Gripper        | `@gripper_angular`    | Pivoting jaw grip                          | 20-500 N grip         |
| Vacuum Gripper         | `@vacuum_gripper`     | Suction cup handling                       | -0.8 bar vacuum       |

### Sensors and Switches

| Component              | Symbol ID           | Description                                | Output Type           |
| ---------------------- | ------------------- | ------------------------------------------ | --------------------- |
| Limit Switch           | `@limit_switch`     | Detects cylinder position                  | NO/NC mechanical      |
| Reed Switch            | `@reed_switch`      | Magnetic position sensing                  | NO/NC reed            |
| Proximity Sensor       | `@proximity_sensor` | Non-contact position detection             | NPN/PNP 3-wire        |
| Pressure Sensor        | `@pressure_sensor`  | Analog pressure measurement                | 4-20 mA, 0-10V        |
| Vacuum Switch          | `@vacuum_switch`    | Detects vacuum level                       | -1 to 0 bar           |
| Flow Sensor            | `@flow_sensor`      | Measures flow rate                         | Pulse output          |

### Vacuum Components

| Component              | Symbol ID           | Description                                | Specification         |
| ---------------------- | ------------------- | ------------------------------------------ | --------------------- |
| Venturi Generator      | `@vacuum_generator` | Creates vacuum from compressed air         | -85 kPa max           |
| Vacuum Pump            | `@vacuum_pump`      | Electric vacuum pump                       | 20-200 L/min          |
| Vacuum Reservoir       | `@vacuum_reservoir` | Stores vacuum                              | 1-50 L                |
| Suction Cup            | `@suction_cup`      | Vacuum gripper pad                         | 10-200 mm diameter    |
| Vacuum Filter          | `@vacuum_filter`    | Protects generator from particles          | 40 micron             |
| Vacuum Switch          | `@vacuum_switch`    | Confirms sufficient vacuum                 | -0.5 bar setpoint     |
| Blow-Off Valve         | `@blow_off`         | Releases vacuum quickly                    | Quick release         |

### Accessories

| Component              | Symbol ID           | Description                                | Specification         |
| ---------------------- | ------------------- | ------------------------------------------ | --------------------- |
| Muffler                | `@muffler`          | Reduces exhaust noise                      | -20 to -40 dB         |
| Silencer               | `@silencer`         | Inline noise reduction                     | -15 dB                |
| Air Nozzle             | `@air_nozzle`       | Focused air blast                          | Various patterns      |
| Air Knife              | `@air_knife`        | Continuous air curtain                     | 100-500 mm wide       |
| Manual Valve           | `@manual_valve`     | Hand-operated isolation                    | Ball, butterfly       |
| Safety Coupling        | `@quick_coupling`   | Quick connect/disconnect                   | Push-to-connect       |
| Pressure Intensifier   | `@intensifier`      | Boosts pressure locally                    | 2:1 to 8:1 ratio      |
| Air Counter            | `@counter`          | Counts cycles                              | Mechanical/electronic |

## Cylinder Sizing Guidelines

### Force Calculation

**Extend Force (double-acting):**
```
F_extend (N) = Pressure (bar) × π × (Bore²/4) × 10
```

**Retract Force (double-acting):**
```
F_retract (N) = Pressure (bar) × π × ((Bore² - Rod²)/4) × 10
```

**Example:** 50 mm bore, 20 mm rod, 6 bar pressure

```
F_extend = 6 × 3.14159 × (50²/4) × 10 = 11,781 N (1,178 kg)
F_retract = 6 × 3.14159 × ((50² - 20²)/4) × 10 = 9,896 N (989 kg)
```

### Cylinder Selection Chart

| Bore (mm) | @ 6 bar Push Force | @ 6 bar Pull Force | Typical Rod (mm) | Application           |
| --------- | ------------------ | ------------------ | ---------------- | --------------------- |
| 8         | 30 N (3 kg)        | 22 N (2.2 kg)      | 4                | Small grippers        |
| 12        | 68 N (6.8 kg)      | 53 N (5.3 kg)      | 6                | Light clamping        |
| 16        | 121 N (12 kg)      | 95 N (9.5 kg)      | 6                | Small part handling   |
| 20        | 189 N (19 kg)      | 151 N (15 kg)      | 8                | General purpose       |
| 25        | 295 N (29 kg)      | 242 N (24 kg)      | 10               | Assembly operations   |
| 32        | 483 N (48 kg)      | 403 N (40 kg)      | 12               | Clamping, pushing     |
| 40        | 754 N (75 kg)      | 642 N (64 kg)      | 16               | Heavy clamping        |
| 50        | 1178 N (118 kg)    | 1010 N (101 kg)    | 20               | Palletizing           |
| 63        | 1868 N (187 kg)    | 1624 N (162 kg)    | 25               | Press operations      |
| 80        | 3015 N (301 kg)    | 2649 N (265 kg)    | 32               | Heavy industrial      |
| 100       | 4712 N (471 kg)    | 4181 N (418 kg)    | 40               | Large presses         |
| 125       | 7363 N (736 kg)    | 6588 N (659 kg)    | 50               | Very heavy duty       |

**Safety Factor:** Always multiply calculated force by 1.5-2.0 for safety margin.

### Speed and Flow Requirements

**Air Consumption:**
```
Q (L/min) = (π × Bore² × Stroke) / (4 × 1000) × Cycles/min × Compression Ratio
```

**Where Compression Ratio = (Pressure + 1 bar) / 1 bar**

**Example:** 50 mm bore, 200 mm stroke, 10 cycles/min, 6 bar:
```
Q = (3.14 × 50² × 200) / 4000 × 10 × 7 = 275 L/min free air
```

### Stroke Speed Calculation

**Extend Speed:**
```
v (mm/s) = (Q_supply × 1000) / (π × Bore² / 4) × Pressure_factor
```

**Typical Speeds:**
- Slow/controlled: 50-200 mm/s
- Medium: 200-500 mm/s
- Fast: 500-1000 mm/s
- Very fast: 1000-2000 mm/s (with quick exhaust valves)

### Tube Sizing

| Flow Rate (L/min) | Tube ID (mm) | Typical Use                  |
| ----------------- | ------------ | ---------------------------- |
| 0-50              | 4            | Small cylinders (<16 mm)     |
| 50-150            | 6            | General purpose (20-32 mm)   |
| 150-300           | 8            | Medium cylinders (40-50 mm)  |
| 300-600           | 10           | Large cylinders (63-80 mm)   |
| 600-1200          | 12           | Very large (100 mm+)         |

**Pressure Drop:** Keep below 0.5 bar in supply lines, below 0.2 bar in control lines.

## Real-World Application Examples

### Industrial Automation: Pick-and-Place

```runiq
pneumatic "Pick-and-Place Robot Cell" {
  supply P labeled: "6 bar" flow: "200 L/min"

  # Air preparation
  component frl as @frl connected: P output: P1 
    pressure: "5.5 bar" 
    filtration: "5 micron"
    labeled: "FRL Unit"

  # Vertical axis (Z-axis)
  component valve_z as @valve_5_2 
    connected: P1 
    type: "double solenoid" 
    labeled: "Z-Axis Valve"
  component cylinder_z as @cylinder_double 
    bore: "40 mm" 
    stroke: "300 mm"
    labeled: "Vertical Cylinder"
  component flow_z_up as @meter_in labeled: "Z Up Speed"
  component flow_z_down as @meter_out labeled: "Z Down Speed"
  component reed_z_top as @reed_switch labeled: "Z Top Position"
  component reed_z_bottom as @reed_switch labeled: "Z Bottom Position"

  valve_z.portA -> flow_z_up -> cylinder_z.portA label: "Extend (down)"
  valve_z.portB -> flow_z_down -> cylinder_z.portB label: "Retract (up)"
  cylinder_z -> reed_z_top trigger: "top"
  cylinder_z -> reed_z_bottom trigger: "bottom"

  # Horizontal axis (X-axis)
  component valve_x as @valve_5_2 
    connected: P1 
    type: "double solenoid"
    labeled: "X-Axis Valve"
  component cylinder_x as @cylinder_rodless 
    stroke: "1000 mm"
    labeled: "Horizontal Rodless Cylinder"
  component reed_x_home as @reed_switch labeled: "X Home"
  component reed_x_pick as @reed_switch labeled: "X Pick Position"
  component reed_x_place as @reed_switch labeled: "X Place Position"

  valve_x.portA -> cylinder_x.portA label: "Forward"
  valve_x.portB -> cylinder_x.portB label: "Reverse"

  # Gripper
  component valve_gripper as @valve_3_2_no 
    connected: P1 
    type: "solenoid"
    labeled: "Gripper Valve"
  component gripper as @gripper_parallel 
    jaw_open: "60 mm"
    grip_force: "200 N"
    labeled: "Parallel Gripper"
  component pressure_grip as @pressure_sensor 
    connected: gripper
    threshold: "3 bar"
    labeled: "Grip Confirm"

  valve_gripper -> gripper label: "Close gripper"
  gripper -> pressure_grip label: "Pressure feedback"

  # Vacuum system for delicate parts
  component vacuum_gen as @vacuum_generator 
    connected: P1
    labeled: "Venturi Vacuum"
  component valve_vacuum as @valve_3_2_nc 
    type: "solenoid"
    labeled: "Vacuum Valve"
  component suction_cup as @suction_cup 
    diameter: "50 mm"
    labeled: "Vacuum Cup Array (4x)"
  component vacuum_switch as @vacuum_switch 
    connected: suction_cup
    setpoint: "-0.6 bar"
    labeled: "Vacuum OK"

  vacuum_gen.vacuum -> valve_vacuum -> suction_cup
  suction_cup -> vacuum_switch label: "Vacuum confirm"

  note "Cycle time: 3.5 seconds\nPayload: 2 kg\nPrecision: ±0.5 mm" at: cylinder_x
}
```

### Packaging: Carton Sealing

```runiq
pneumatic "Carton Sealing Machine" {
  supply P labeled: "7 bar" flow: "150 L/min"

  component frl as @frl connected: P output: P1 pressure: "6 bar"

  # Top flap folder
  component valve_top as @valve_5_3_exhaust 
    connected: P1 
    type: "double solenoid"
    labeled: "Top Folder Valve"
  component cylinder_top as @cylinder_double 
    bore: "32 mm"
    stroke: "100 mm"
    labeled: "Top Flap Cylinder"
  component limit_top_retract as @limit_switch labeled: "Top Retracted"
  component limit_top_extend as @limit_switch labeled: "Top Extended"

  valve_top -> cylinder_top
  cylinder_top -> limit_top_retract trigger: "retracted"
  cylinder_top -> limit_top_extend trigger: "extended"

  # Side flap folders (parallel operation)
  component valve_side as @valve_5_2 
    connected: P1 
    type: "double solenoid"
    labeled: "Side Folders Valve"
  component cylinder_left as @cylinder_single 
    bore: "25 mm"
    stroke: "80 mm"
    labeled: "Left Flap"
  component cylinder_right as @cylinder_single 
    bore: "25 mm"
    stroke: "80 mm"
    labeled: "Right Flap"

  valve_side.portA -> cylinder_left label: "Fold left"
  valve_side.portA -> cylinder_right label: "Fold right"

  # Tape applicator
  component valve_tape as @valve_3_2_nc 
    connected: P1 
    type: "solenoid"
    labeled: "Tape Press Valve"
  component cylinder_tape as @cylinder_double 
    bore: "40 mm"
    stroke: "50 mm"
    force: "500 N"
    labeled: "Tape Press Cylinder"
  component quick_exhaust_tape as @quick_exhaust labeled: "Fast Return"

  valve_tape -> cylinder_tape.portA label: "Apply tape"
  cylinder_tape.portB -> quick_exhaust_tape -> exhaust label: "Quick return"

  # Carton presence detection
  component sensor_carton as @proximity_sensor 
    type: "through-beam"
    labeled: "Carton Detected"

  # Sequence control via PLC
  component plc as @controller labeled: "PLC Sequence Control"
  sensor_carton -> plc label: "Trigger sequence"
  plc -> valve_side label: "1. Fold sides"
  plc -> valve_top label: "2. Fold top"
  plc -> valve_tape label: "3. Apply tape"

  note "Sequence: Sides -> Top -> Tape -> Reset\nCycle: 2.5 sec\nCartons/min: 24" at: plc
}
```

### Automotive Assembly: Door Installation

```runiq
pneumatic "Automotive Door Installation Fixture" {
  supply P labeled: "6.5 bar" flow: "300 L/min"

  component frl as @frl connected: P output: P1 pressure: "6 bar"

  # Lifting mechanism (two synchronized cylinders)
  component valve_lift as @valve_5_2 
    connected: P1 
    type: "double solenoid"
    labeled: "Lift Valve"
  component cylinder_lift_left as @cylinder_double 
    bore: "80 mm"
    stroke: "500 mm"
    labeled: "Left Lift Cylinder"
  component cylinder_lift_right as @cylinder_double 
    bore: "80 mm"
    stroke: "500 mm"
    labeled: "Right Lift Cylinder"
  component flow_divider as @flow_divider 
    ratio: "1:1"
    labeled: "Synchronization"

  valve_lift -> flow_divider label: "Equal flow distribution"
  flow_divider.out1 -> cylinder_lift_left
  flow_divider.out2 -> cylinder_lift_right

  # Positioning clamps (4 points)
  component valve_clamp as @valve_5_2 
    connected: P1 
    type: "double solenoid"
    labeled: "Clamp Valve"
  component cylinder_clamp_tl as @cylinder_double bore: "50 mm" labeled: "Top-Left Clamp"
  component cylinder_clamp_tr as @cylinder_double bore: "50 mm" labeled: "Top-Right Clamp"
  component cylinder_clamp_bl as @cylinder_double bore: "50 mm" labeled: "Bottom-Left Clamp"
  component cylinder_clamp_br as @cylinder_double bore: "50 mm" labeled: "Bottom-Right Clamp"
  
  valve_clamp.portA -> cylinder_clamp_tl label: "Clamp"
  valve_clamp.portA -> cylinder_clamp_tr label: "Clamp"
  valve_clamp.portA -> cylinder_clamp_bl label: "Clamp"
  valve_clamp.portA -> cylinder_clamp_br label: "Clamp"

  # Pressure monitoring for all clamps
  component pressure_monitor as @pressure_sensor 
    threshold: "5 bar"
    labeled: "All Clamps Pressurized"
  
  valve_clamp.portA -> pressure_monitor label: "Monitor clamp pressure"

  # Precision adjustment cylinders (fine positioning)
  component valve_adjust_x as @valve_5_3_closed 
    connected: P1 
    type: "proportional"
    labeled: "X-Axis Adjust"
  component cylinder_adjust_x as @cylinder_double 
    bore: "25 mm"
    stroke: "±25 mm"
    labeled: "X Adjustment"

  component valve_adjust_y as @valve_5_3_closed 
    connected: P1 
    type: "proportional"
    labeled: "Y-Axis Adjust"
  component cylinder_adjust_y as @cylinder_double 
    bore: "25 mm"
    stroke: "±25 mm"
    labeled: "Y Adjustment"

  # Safety circuit
  component estop as @button 
    type: "emergency-stop NC"
    labeled: "E-Stop"
  component safety_valve as @valve_3_2 
    type: "safety"
    labeled: "Safety Exhaust"
  
  P1 -> estop -> safety_valve -> valve_lift
  estop.NC_open -> safety_valve.exhaust label: "Dump on E-stop"

  note "Door weight: 25 kg\nPositioning accuracy: ±1 mm\nCycle time: 12 seconds" at: cylinder_lift_left
}
```

### Food Processing: Pneumatic Conveyor

```runiq
pneumatic "Pneumatic Conveyor System" {
  supply P labeled: "8 bar" flow: "500 L/min"

  # High-flow air preparation
  component filter_main as @air_filter 
    connected: P 
    size: "5 micron"
    flow: "600 L/min"
    labeled: "Main Filter"
  component dryer as @air_dryer 
    connected: filter_main
    dewpoint: "-40°C"
    labeled: "Refrigerated Dryer"
  component regulator_main as @regulator 
    connected: dryer
    output: P1
    pressure: "6 bar"
    labeled: "Main Regulator"

  # Material inlet valve (rotary airlock)
  component valve_inlet as @valve_2_2 
    connected: P1 
    type: "solenoid NO"
    labeled: "Inlet Valve"
  component airlock as @rotary_actuator 
    connected: valve_inlet
    speed: "20 RPM"
    labeled: "Rotary Airlock"

  valve_inlet -> airlock label: "Material feed"

  # Conveying air supply
  component valve_conveying as @valve_2_2 
    connected: P1 
    type: "solenoid NO"
    labeled: "Conveying Air Valve"
  component conveying_line as @air_line 
    diameter: "100 mm"
    length: "50 m"
    labeled: "Conveying Line"

  valve_conveying -> conveying_line label: "Transport air: 6 bar, 400 L/min"

  # Booster blower for long distance
  component blower as @blower 
    connected: conveying_line
    pressure: "+0.5 bar"
    flow: "600 L/min"
    labeled: "Booster Blower"

  conveying_line -> blower label: "Boost for 50m run"

  # Diverter valves for multiple destinations
  component valve_divert1 as @valve_3_2_nc 
    connected: blower 
    type: "solenoid"
    labeled: "Divert to Line 1"
  component valve_divert2 as @valve_3_2_nc 
    connected: blower 
    type: "solenoid"
    labeled: "Divert to Line 2"

  blower.out -> valve_divert1 label: "To storage bin 1"
  blower.out -> valve_divert2 label: "To storage bin 2"

  # Material level sensors
  component level_low as @proximity_sensor labeled: "Bin Low Level"
  component level_high as @proximity_sensor labeled: "Bin High Level"

  # Filter receiver (destination)
  component receiver as @cyclone_separator labeled: "Cyclone Separator"
  component bag_filter as @bag_filter 
    connected: receiver
    filtration: "1 micron"
    labeled: "Bag Filter"

  valve_divert1 -> receiver label: "Material to bin"
  receiver -> bag_filter label: "Exhaust air filtered"

  # Pulse cleaning for filters
  component valve_pulse as @valve_2_2 
    connected: P 
    type: "solenoid NO"
    labeled: "Pulse Cleaning"
  component pulse_timer as @timer 
    interval: "60 sec"
    duration: "200 ms"
    labeled: "Pulse Timer"

  pulse_timer -> valve_pulse label: "Periodic pulse"
  valve_pulse -> bag_filter label: "Reverse pulse cleaning"

  note "Material: Flour\nCapacity: 5 ton/hour\nDistance: 50 meters\nVelocity: 20 m/s" at: conveying_line
}
```

## Component Selection Guidelines

### Valve Selection Criteria

**Application:**
- **2/2 Valve**: Simple on/off control (blow-off, clamping)
- **3/2 Valve**: Control single-acting cylinders, pilot signals
- **5/2 Valve**: Control double-acting cylinders (standard choice)
- **5/3 Valve**: Mid-position needed (floating, clamped, pressurized)

**Actuation:**
- **Solenoid**: Electrical control, fast response (10-50 ms)
- **Pilot**: Pneumatic control, explosion-proof environments
- **Manual**: Emergency overrides, setup/testing
- **Mechanical**: Position-based triggering

**Response Time:**
- Standard valves: 20-50 ms
- High-speed valves: 5-15 ms
- Proportional valves: Variable control

### FRL Unit Sizing

**Filter:**
- 5 micron: Standard pneumatic components
- 0.01 micron: Sensitive instrumentation
- Bowl capacity: 30-50 mL per 100 L/min flow

**Regulator:**
- Adjust range: 0-10 bar typical
- Precision: ±0.05 bar (standard), ±0.01 bar (precision)
- Relief flow: Auto-relief vs. non-relief

**Lubricator:**
- Oil consumption: 1-3 drops per m³ of free air
- Bowl capacity: 40-100 mL
- Use oil-free components when possible (modern seals don't require lubrication)

### Compressor Selection

**Types:**
- **Reciprocating**: 1-50 HP, intermittent duty
- **Rotary Screw**: 10-500 HP, continuous duty
- **Centrifugal**: 100+ HP, large facilities

**Sizing Formula:**
```
CFM_required = (Total L/min of all circuits) × 1.3 (safety factor) × 0.0353 (conversion)
```

**Duty Cycle:**
- Intermittent: <50% on-time (reciprocating OK)
- Continuous: >75% on-time (rotary screw recommended)

**Receiver Tank:**
```
Tank Volume (gallons) = CFM × 5 (for reciprocating compressors)
```

## Energy Efficiency Tips

1. **Fix Leaks**: 30-50% of compressed air is lost to leaks
   - Detection: Ultrasonic leak detector
   - Annual loss: 0.5 mm leak = $1,200/year @ $0.10/kWh

2. **Reduce Pressure**: Every 1 bar reduction saves 7-8% energy
   - Use local regulators instead of high system pressure

3. **Shut Off Unused Lines**: Automatic shut-off valves during idle times

4. **Optimize Cylinder Sizing**: Oversized = wasted air and slower cycle

5. **Use Exhaust Air Recovery**: Heat recovery for space heating

6. **Prefer Electric Over Pneumatic**: When force/speed allows

## Safety Considerations

**Pressure Limits:**
- Maximum working pressure: 10-12 bar (typical factory systems)
- Never exceed component ratings
- Use pressure relief valves (set 10% above working pressure)

**Noise Control:**
- Exhaust noise: 80-100 dB without mufflers
- OSHA limit: 85 dB (8-hour TWA)
- Always use mufflers on exhaust ports

**Lockout/Tagout:**
- Isolate air supply during maintenance
- Bleed all pressure before disassembly
- Use stored energy awareness (accumulators)

**Hose Safety:**
- Whipping hose hazard: Use safety cables/whip checks
- Replace damaged hoses immediately
- Secure all fittings with thread sealant

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
