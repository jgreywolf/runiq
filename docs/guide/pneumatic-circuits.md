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

| Component          | Symbol ID            | Description                            | Typical Spec        |
| ------------------ | -------------------- | -------------------------------------- | ------------------- |
| Air Compressor     | `@compressor`        | Generates compressed air               | 10-500 CFM          |
| Air Filter         | `@air_filter`        | Removes particles (5-40 micron)        | 5 micron standard   |
| Pressure Regulator | `@regulator`         | Controls downstream pressure           | 0-12 bar            |
| Lubricator         | `@lubricator`        | Adds oil mist for lubrication          | 1-3 drops/m³        |
| FRL Unit           | `@frl`               | Combined filter, regulator, lubricator | 4-8 bar working     |
| Air Dryer          | `@air_dryer`         | Removes moisture                       | -40°C pressure dew  |
| Air Receiver       | `@air_tank`          | Stores compressed air                  | 50-5000 L           |
| Pressure Switch    | `@pressure_switch`   | Monitors pressure levels               | Adjustable setpoint |
| Pressure Gauge     | `@pressure_gauge`    | Visual pressure indication             | 0-10 bar typical    |
| Water Separator    | `@water_separator`   | Removes condensate                     | 99% separation      |
| Aftercooler        | `@aftercooler`       | Cools air to remove moisture           | 5-10°C approach     |
| Coalescing Filter  | `@coalescing_filter` | Removes oil and water aerosols         | 0.01 micron         |
| Activated Carbon   | `@carbon_filter`     | Removes oil vapor and odors            | 0.003 ppm oil vapor |

### Directional Control Valves

| Valve Type           | Symbol ID             | Ports/Positions | Actuation Options                         |
| -------------------- | --------------------- | --------------- | ----------------------------------------- |
| 2/2 Valve            | `@valve_2_2`          | 2 ports, 2 pos  | Manual, solenoid, pilot, spring return    |
| 3/2 Valve (NC)       | `@valve_3_2_nc`       | 3 ports, 2 pos  | Normally closed, various actuation        |
| 3/2 Valve (NO)       | `@valve_3_2_no`       | 3 ports, 2 pos  | Normally open, various actuation          |
| 4/2 Valve            | `@valve_4_2`          | 4 ports, 2 pos  | Double solenoid, pilot, detented          |
| 5/2 Valve            | `@valve_5_2`          | 5 ports, 2 pos  | Standard cylinder control                 |
| 5/3 Valve (Closed)   | `@valve_5_3_closed`   | 5 ports, 3 pos  | All ports blocked in center               |
| 5/3 Valve (Exhaust)  | `@valve_5_3_exhaust`  | 5 ports, 3 pos  | Pressure blocked, A/B exhausted in center |
| 5/3 Valve (Pressure) | `@valve_5_3_pressure` | 5 ports, 3 pos  | All ports pressurized in center           |

**Actuation Types:**

- Spring return: Returns to rest position when de-energized
- Pilot operated: Uses pneumatic pilot pressure
- Solenoid: Electrical coil actuation (24V DC typical)
- Manual: Push button, lever, foot pedal
- Mechanical: Roller, plunger, cam

### Flow Control Valves

| Component            | Symbol ID          | Description                              | Use Case          |
| -------------------- | ------------------ | ---------------------------------------- | ----------------- |
| Throttle Valve       | `@throttle`        | Restricts flow in both directions        | Speed control     |
| Meter-In             | `@meter_in`        | Controls flow to actuator                | Extend speed      |
| Meter-Out            | `@meter_out`       | Controls flow from actuator              | Retract speed     |
| One-Way Flow Control | `@flow_control_1w` | Flow control one direction, free reverse | Controlled extend |
| Quick Exhaust Valve  | `@quick_exhaust`   | Rapid exhaust close to cylinder          | Fast retraction   |
| Pressure Compensated | `@flow_pc`         | Constant flow despite pressure variation | Consistent speed  |
| Needle Valve         | `@needle_valve`    | Fine adjustment of flow                  | Precision tuning  |

### Pressure Control Valves

| Component         | Symbol ID           | Description                     | Setting Range       |
| ----------------- | ------------------- | ------------------------------- | ------------------- |
| Relief Valve      | `@relief_valve`     | Limits maximum pressure         | 0-12 bar            |
| Pressure Reducing | `@pressure_reducer` | Lowers downstream pressure      | 1-8 bar             |
| Sequence Valve    | `@sequence_valve`   | Triggers action at set pressure | Adjustable setpoint |
| Pressure Switch   | `@pressure_switch`  | Electrical output at threshold  | NO/NC contacts      |

### Check Valves

| Component            | Symbol ID        | Description                          | Cracking Pressure  |
| -------------------- | ---------------- | ------------------------------------ | ------------------ |
| Standard Check Valve | `@check_valve`   | Allows flow in one direction         | 0.05-0.5 bar       |
| Pilot-Operated Check | `@pilot_check`   | Opens reverse flow with pilot signal | Locked until pilot |
| Shuttle Valve (OR)   | `@shuttle_valve` | Selects higher of two pressures      | Logic element      |
| Two-Pressure Valve   | `@two_pressure`  | Requires both inputs (AND logic)     | Logic element      |

### Pneumatic Actuators

| Actuator Type          | Symbol ID              | Description                          | Force/Torque Range   |
| ---------------------- | ---------------------- | ------------------------------------ | -------------------- |
| Single-Acting Cylinder | `@cylinder_single`     | Spring return, push or pull          | 10-5000 N @ 6 bar    |
| Double-Acting Cylinder | `@cylinder_double`     | Powered both directions              | 20-10000 N @ 6 bar   |
| Rodless Cylinder       | `@cylinder_rodless`    | Magnetic or cable coupling           | Long stroke (1-10 m) |
| Telescopic Cylinder    | `@cylinder_telescopic` | Multi-stage for compact installation | 2-5 stages           |
| Rotary Actuator        | `@rotary_actuator`     | Limited rotation (90°, 180°, 270°)   | 1-1000 Nm            |
| Pneumatic Motor        | `@motor_pneumatic`     | Continuous rotation                  | 0.1-20 kW            |
| Parallel Gripper       | `@gripper_parallel`    | Two-jaw parallel grip                | 50-2000 N grip       |
| Angular Gripper        | `@gripper_angular`     | Pivoting jaw grip                    | 20-500 N grip        |
| Vacuum Gripper         | `@vacuum_gripper`      | Suction cup handling                 | -0.8 bar vacuum      |

### Sensors and Switches

| Component        | Symbol ID           | Description                    | Output Type      |
| ---------------- | ------------------- | ------------------------------ | ---------------- |
| Limit Switch     | `@limit_switch`     | Detects cylinder position      | NO/NC mechanical |
| Reed Switch      | `@reed_switch`      | Magnetic position sensing      | NO/NC reed       |
| Proximity Sensor | `@proximity_sensor` | Non-contact position detection | NPN/PNP 3-wire   |
| Pressure Sensor  | `@pressure_sensor`  | Analog pressure measurement    | 4-20 mA, 0-10V   |
| Vacuum Switch    | `@vacuum_switch`    | Detects vacuum level           | -1 to 0 bar      |
| Flow Sensor      | `@flow_sensor`      | Measures flow rate             | Pulse output     |

### Vacuum Components

| Component         | Symbol ID           | Description                        | Specification      |
| ----------------- | ------------------- | ---------------------------------- | ------------------ |
| Venturi Generator | `@vacuum_generator` | Creates vacuum from compressed air | -85 kPa max        |
| Vacuum Pump       | `@vacuum_pump`      | Electric vacuum pump               | 20-200 L/min       |
| Vacuum Reservoir  | `@vacuum_reservoir` | Stores vacuum                      | 1-50 L             |
| Suction Cup       | `@suction_cup`      | Vacuum gripper pad                 | 10-200 mm diameter |
| Vacuum Filter     | `@vacuum_filter`    | Protects generator from particles  | 40 micron          |
| Vacuum Switch     | `@vacuum_switch`    | Confirms sufficient vacuum         | -0.5 bar setpoint  |
| Blow-Off Valve    | `@blow_off`         | Releases vacuum quickly            | Quick release      |

### Accessories

| Component            | Symbol ID         | Description              | Specification         |
| -------------------- | ----------------- | ------------------------ | --------------------- |
| Muffler              | `@muffler`        | Reduces exhaust noise    | -20 to -40 dB         |
| Silencer             | `@silencer`       | Inline noise reduction   | -15 dB                |
| Air Nozzle           | `@air_nozzle`     | Focused air blast        | Various patterns      |
| Air Knife            | `@air_knife`      | Continuous air curtain   | 100-500 mm wide       |
| Manual Valve         | `@manual_valve`   | Hand-operated isolation  | Ball, butterfly       |
| Safety Coupling      | `@quick_coupling` | Quick connect/disconnect | Push-to-connect       |
| Pressure Intensifier | `@intensifier`    | Boosts pressure locally  | 2:1 to 8:1 ratio      |
| Air Counter          | `@counter`        | Counts cycles            | Mechanical/electronic |

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

| Bore (mm) | @ 6 bar Push Force | @ 6 bar Pull Force | Typical Rod (mm) | Application         |
| --------- | ------------------ | ------------------ | ---------------- | ------------------- |
| 8         | 30 N (3 kg)        | 22 N (2.2 kg)      | 4                | Small grippers      |
| 12        | 68 N (6.8 kg)      | 53 N (5.3 kg)      | 6                | Light clamping      |
| 16        | 121 N (12 kg)      | 95 N (9.5 kg)      | 6                | Small part handling |
| 20        | 189 N (19 kg)      | 151 N (15 kg)      | 8                | General purpose     |
| 25        | 295 N (29 kg)      | 242 N (24 kg)      | 10               | Assembly operations |
| 32        | 483 N (48 kg)      | 403 N (40 kg)      | 12               | Clamping, pushing   |
| 40        | 754 N (75 kg)      | 642 N (64 kg)      | 16               | Heavy clamping      |
| 50        | 1178 N (118 kg)    | 1010 N (101 kg)    | 20               | Palletizing         |
| 63        | 1868 N (187 kg)    | 1624 N (162 kg)    | 25               | Press operations    |
| 80        | 3015 N (301 kg)    | 2649 N (265 kg)    | 32               | Heavy industrial    |
| 100       | 4712 N (471 kg)    | 4181 N (418 kg)    | 40               | Large presses       |
| 125       | 7363 N (736 kg)    | 6588 N (659 kg)    | 50               | Very heavy duty     |

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

| Flow Rate (L/min) | Tube ID (mm) | Typical Use                 |
| ----------------- | ------------ | --------------------------- |
| 0-50              | 4            | Small cylinders (<16 mm)    |
| 50-150            | 6            | General purpose (20-32 mm)  |
| 150-300           | 8            | Medium cylinders (40-50 mm) |
| 300-600           | 10           | Large cylinders (63-80 mm)  |
| 600-1200          | 12           | Very large (100 mm+)        |

**Pressure Drop:** Keep below 0.5 bar in supply lines, below 0.2 bar in control lines.

## Real-World Application Examples

### Industrial Automation: Pick-and-Place

```runiq
pneumatic "Pick-and-Place Robot Cell" {
  net SUPPLY, Z_CTRL, X_CTRL, GRIP_CTRL, VAC_CTRL

  pressure 6 bar operating
  flowRate 1500 L/min

  part filterPart type:FILTER pins:(SUPPLY,SUPPLY) doc:"Air Filter"
  part regulatorPart type:REGULATOR pins:(SUPPLY,SUPPLY) doc:"Pressure Regulator"
  part lubricatorPart type:LUBRICATOR pins:(SUPPLY,CTRL) doc:"Lubricator"
  part valve_z type:VALVE_52 pins:(Z_CTRL) doc:"Z-Axis Valve"
  part cylinder_z type:CYL_DA pins:(Z_CTRL) doc:"Vertical Cylinder"
  part valve_x type:VALVE_52 pins:(X_CTRL) doc:"X-Axis Valve"
  part valve_gripper type:VALVE_32 pins:(GRIP_CTRL) doc:"Gripper Valve"
  part pressure_grip type:GAUGE_P doc:"Grip Confirm"
  part valve_vacuum type:VALVE_32 pins:(VAC_CTRL) doc:"Vacuum Valve"
}
```

### Packaging: Carton Sealing

```runiq
pneumatic "Carton Sealing Machine" {
  net SUPPLY, TOP_LINE, SIDE_LINE, TAPE_LINE

  pressure 6 bar operating
  flowRate 800 L/min

  part filterPart type:FILTER pins:(SUPPLY,SUPPLY) doc:"Air Filter"
  part regulatorPart type:REGULATOR pins:(SUPPLY,SUPPLY) doc:"Pressure Regulator"
  part lubricatorPart type:LUBRICATOR pins:(SUPPLY,CTRL) doc:"Lubricator"
  part valve_top type:VALVE_52 pins:(TOP_LINE) doc:"Top Folder Valve"
  part cylinder_top type:CYL_DA pins:(TOP_LINE) doc:"Top Flap Cylinder"
  part valve_side type:VALVE_52 pins:(SIDE_LINE) doc:"Side Folders Valve"
  part cylinder_left type:CYL_SA pins:(SIDE_LINE) doc:"Left Flap"
  part cylinder_right type:CYL_SA pins:(SIDE_LINE) doc:"Right Flap"
  part valve_tape type:VALVE_32 pins:(TAPE_LINE) doc:"Tape Press Valve"
  part cylinder_tape type:CYL_DA pins:(TAPE_LINE) doc:"Tape Press Cylinder"
  part quick_exhaust_tape type:EXHAUST pins:(TAPE_LINE) doc:"Fast Return"
}
```

### Automotive Assembly: Door Installation

```runiq
pneumatic "Automotive Door Installation Fixture" {
  net SUPPLY, LIFT_LINE, CLAMP_LINE, ADJ_X, ADJ_Y, SAFETY

  pressure 6 bar operating
  flowRate 2000 L/min

  part filterPart type:FILTER pins:(SUPPLY,SUPPLY) doc:"Air Filter"
  part regulatorPart type:REGULATOR pins:(SUPPLY,SUPPLY) doc:"Pressure Regulator"
  part lubricatorPart type:LUBRICATOR pins:(SUPPLY,CTRL) doc:"Lubricator"
  part valve_lift type:valve_52 pins:(LIFT_LINE) doc:"Lift Valve"
  part cylinder_lift_left type:CYL_DA pins:(LIFT_LINE) doc:"Left Lift Cylinder"
  part cylinder_lift_right type:CYL_DA pins:(LIFT_LINE) doc:"Right Lift Cylinder"
  part valve_clamp type:VALVE_52 pins:(CLAMP_LINE) doc:"Clamp Valve"
  part cylinder_clamp_tl type:CYL_DA pins:(CLAMP_LINE) doc:"Top-Left Clamp"
  part cylinder_clamp_tr type:CYL_DA pins:(CLAMP_LINE) doc:"Top-Right Clamp"
  part cylinder_clamp_bl type:CYL_DA pins:(CLAMP_LINE) doc:"Bottom-Left Clamp"
  part cylinder_clamp_br type:CYL_DA pins:(CLAMP_LINE) doc:"Bottom-Right Clamp"
  part pressure_monitor type:GAUGE_P pins:(CLAMP_LINE) doc:"All Clamps Pressurized"
  part cylinder_adjust_x type:CYL_DA pins:(ADJ_X) doc:"X Adjustment"
  part cylinder_adjust_y type:CYL_DA pins:(ADJ_Y) doc:"Y Adjustment"
  part safety_valve type:VALVE_32 pins:(SAFETY) doc:"Safety Exhaust"
}
```

### Food Processing: Pneumatic Conveyor

```runiq
pneumatic "Pneumatic Conveyor System" {
  net SUPPLY, FILTERED, REGULATED, INLET, CONVEY, EXHAUST

  pressure 4 bar operating
  flowRate 3000 L/min

  part air_source type:AIR_SOURCE pins:(SUPPLY) doc:"Air Compressor"
  part filter_main type:FILTER pins:(SUPPLY,FILTERED) doc:"Main Filter"
  part regulator_main type:REGULATOR pins:(FILTERED,REGULATED) doc:"Main Regulator 4 bar"
  part flow_inlet type:FLOW_CONTROL pins:(REGULATED,INLET) doc:"Inlet Flow Control"
  part valve_conveying type:VALVE_32 pins:(INLET,CONVEY) doc:"Conveying Air Valve"
  part valve_divert1 type:VALVE_32 pins:(CONVEY) doc:"Divert to Line 1"
  part valve_divert2 type:VALVE_32 pins:(CONVEY) doc:"Divert to Line 2"
  part filter_exhaust type:FILTER pins:(EXHAUST,EXHAUST) doc:"Exhaust Filter"
  part exhaust_main type:EXHAUST pins:(EXHAUST) doc:"Exhaust to Atmosphere"
  part gauge type:GAUGE_P pins:(REGULATED) doc:"System Pressure"
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
  net SUPPLY, CTRL

  pressure 6 bar operating

  part source type:AIR_SOURCE pins:(SUPPLY) doc:"Compressed Air Source"
  part filterPart type:FILTER pins:(SUPPLY,SUPPLY) doc:"Air Filter"
  part regulatorPart type:REGULATOR pins:(SUPPLY,CTRL) doc:"Pressure Regulator"
  part valve type:VALVE_32 pins:(CTRL) doc:"3/2 Way Valve"
  part cylinder type:CYL_SA pins:(CTRL) doc:"Single-Acting Cylinder"
}
```

## Double-Acting Cylinder Control

```runiq
pneumatic "Double-Acting Cylinder - 5/2 Valve" {
  net SUPPLY, CTRL

  pressure 6 bar operating

  part filterPart type:FILTER pins:(SUPPLY,SUPPLY) doc:"Air Filter"
  part regulatorPart type:REGULATOR pins:(SUPPLY,SUPPLY) doc:"Pressure Regulator"
  part lubricatorPart type:LUBRICATOR pins:(SUPPLY,CTRL) doc:"Lubricator"
  part valve type:VALVE_52 pins:(CTRL) doc:"5/2-way Valve"
  part cylinder type:CYL_DA pins:(CTRL) doc:"Double-Acting Cylinder"
}
```

## Speed Control Circuit

```runiq
pneumatic "Speed Control" {
  net SUPPLY, CTRL, CYL_IN, CYL_OUT

  pressure 6 bar operating

  part frl type:frl pins:(SUPPLY,CTRL)
  part valve type:VALVE_52 pins:(CTRL,CYL_IN,CYL_OUT) doc:"Directional Valve"
  part throttle_in type:throttle pins:(CYL_IN) doc:"Speed Control In"
  part throttle_out type:throttle pins:(CYL_OUT) doc:"Speed Control Out"
  part cylinder type:CYL_DA pins:(CYL_IN,CYL_OUT)
}
```

## Reciprocating Circuit

Automatic back-and-forth motion:

```runiq
pneumatic "Reciprocating Cylinder" {
  net SUPPLY, CTRL

  pressure 6 bar operating

  part filterPart type:FILTER pins:(SUPPLY,SUPPLY) doc:"Air Filter"
  part regulatorPart type:REGULATOR pins:(SUPPLY,CTRL) doc:"Pressure Regulator"
  part valve type:VALVE_52 pins:(CTRL) doc:"5/2 Pilot-Operated Valve"
  part cylinder type:CYL_DA pins:(CTRL) doc:"Main Cylinder"
  part check1 type:CHECK_VALVE pins:(CTRL) doc:"Extend Position Sensor"
  part check2 type:CHECK_VALVE pins:(CTRL) doc:"Retract Position Sensor"
}
```

## Sequencing Circuit

Multiple cylinders in sequence:

```runiq
pneumatic "Sequential Operation A+ B+ B- A-" {
  net SUPPLY, CTRL_A, CTRL_B

  pressure 6 bar operating

  part filterPart type:FILTER pins:(SUPPLY,SUPPLY) doc:"Air Filter"
  part regulatorPart type:REGULATOR pins:(SUPPLY,CTRL_A,CTRL_B) doc:"Pressure Regulator"
  part valveA type:VALVE_52 pins:(CTRL_A) doc:"Valve A - 5/2 Way"
  part cylinderA type:CYL_DA pins:(CTRL_A) doc:"Cylinder A"
  part valveB type:VALVE_52 pins:(CTRL_B) doc:"Valve B - 5/2 Way"
  part cylinderB type:CYL_DA pins:(CTRL_B) doc:"Cylinder B"
  part checkA type:CHECK_VALVE pins:(CTRL_A) doc:"A Position Sensing"
  part checkB type:CHECK_VALVE pins:(CTRL_B) doc:"B Position Sensing"
  part gauge type:GAUGE_P pins:(SUPPLY) doc:"System Pressure"
}
```

## Gripper Circuit

Pick-and-place gripper control:

```runiq
pneumatic "Pneumatic Gripper" {
  net SUPPLY, GRIP_CTRL

  pressure 4 bar operating

  part filterPart type:FILTER pins:(SUPPLY,SUPPLY) doc:"Air Filter"
  part regulatorPart type:REGULATOR pins:(SUPPLY,GRIP_CTRL) doc:"4 bar Reduced Pressure"
  part valve type:VALVE_32 pins:(GRIP_CTRL) doc:"Gripper Valve 3/2"
  part cylinder_grip type:CYL_DA pins:(GRIP_CTRL) doc:"Gripper Cylinder"
  part gauge type:GAUGE_P pins:(GRIP_CTRL) doc:"Grip Pressure Monitor"
}
```

## Safety Circuit

Emergency stop and safety features:

```runiq
pneumatic "Safety Circuit" {
  net SUPPLY, SAFETY_LINE, MAIN_CTRL

  pressure 6 bar operating

  part air_source type:AIR_SOURCE pins:(SUPPLY) doc:"Compressed Air"
  part filterPart type:FILTER pins:(SUPPLY,SUPPLY) doc:"Air Filter"
  part regulatorPart type:REGULATOR pins:(SUPPLY,SAFETY_LINE) doc:"Pressure Regulator"
  part safety_valve type:VALVE_32 pins:(SAFETY_LINE,MAIN_CTRL) doc:"Safety 3/2 Valve"
  part main_valve type:VALVE_52 pins:(MAIN_CTRL) doc:"Main 5/2 Valve"
  part cylinder type:CYL_DA pins:(MAIN_CTRL) doc:"Double-Acting Cylinder"
  part exhaust type:EXHAUST pins:(MAIN_CTRL) doc:"Safety Exhaust"
}
```

## Vacuum Circuit

Vacuum generation and control:

```runiq
pneumatic "Vacuum Gripper" {
  net SUPPLY, VAC_LINE

  pressure 6 bar operating

  part filterPart type:FILTER pins:(SUPPLY,SUPPLY) doc:"Air Filter"
  part regulatorPart type:REGULATOR pins:(SUPPLY,VAC_LINE) doc:"Pressure Regulator"
  part valve type:VALVE_32 pins:(VAC_LINE) doc:"Vacuum Control 3/2 Valve"
  part check type:CHECK_VALVE pins:(VAC_LINE) doc:"Vacuum Check Valve"
  part gauge type:GAUGE_P pins:(VAC_LINE) doc:"Vacuum Gauge"
  part exhaust type:EXHAUST pins:(VAC_LINE) doc:"Vacuum Release"
}
```

## Styling

```runiq
pneumatic "Styled Circuit" {
  net SUPPLY, CTRL

  pressure 6 bar operating

  part filterPart type:FILTER pins:(SUPPLY,SUPPLY) doc:"Filter"
  part regulatorPart type:REGULATOR pins:(SUPPLY,CTRL) doc:"Regulator"
  part valve type:VALVE_52 pins:(CTRL) doc:"5/2 Valve"
  part cylinder type:CYL_DA pins:(CTRL) doc:"Cylinder"
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

## Comparison with Other Tools

| Feature                      | Runiq          | Mermaid        | PlantUML       | Lucidchart  | FluidSIM   | Automation Studio | Festo FluidDraw |
| ---------------------------- | -------------- | -------------- | -------------- | ----------- | ---------- | ----------------- | --------------- |
| **Basic Support**            | ✅             | ❌             | ❌             | ✅          | ✅         | ✅                | ✅              |
| **ISO 1219-1 symbols**       | ✅             | ❌             | ❌             | ⚠️ Custom   | ✅         | ✅                | ✅              |
| **Interactive simulation**   | ❌             | ❌             | ❌             | ❌          | ✅         | ✅                | ✅              |
| **Pressure calculation**     | ❌             | ❌             | ❌             | ❌          | ✅         | ✅                | ✅              |
| **Component libraries**      | ✅             | ❌             | ❌             | ⚠️ Basic    | ✅         | ✅                | ✅              |
| **Custom components**        | ✅             | ❌             | ❌             | ✅          | ⚠️ Limited | ⚠️ Limited        | ⚠️ Limited      |
| **Documentation generation** | ✅             | ✅             | ✅             | ⚠️ Partial  | ⚠️ Partial | ⚠️ Partial        | ⚠️ Partial      |
| **Multi-circuit projects**   | ✅             | ❌             | ❌             | ✅          | ✅         | ✅                | ✅              |
| **Text-based DSL**           | ✅             | ✅             | ✅             | ❌          | ❌         | ❌                | ❌              |
| **Version control friendly** | ✅             | ✅             | ✅             | ⚠️ Partial  | ❌         | ❌                | ❌              |
| **Automatic layout**         | ✅             | ✅             | ✅             | ❌          | ❌         | ❌                | ❌              |
| **Export formats**           | SVG, PNG       | SVG, PNG       | SVG, PNG       | Multiple    | PDF, Image | PDF, Image        | PDF, DXF        |
| **Real-time collaboration**  | ✅ Via Git     | ❌             | ❌             | ✅          | ❌         | ❌                | ❌              |
| **Learning curve**           | Low            | Low            | Medium         | Low         | Medium     | Medium            | Low             |
| **Cost**                     | Free           | Free           | Free           | Paid        | Paid       | Paid              | Free            |
| **Platform**                 | Cross-platform | Cross-platform | Cross-platform | Web/Desktop | Windows    | Windows           | Windows         |

**Key Advantages of Runiq:**

- **Version Control**: Text-based format integrates with Git workflows
- **Automation**: Generate diagrams from system specifications programmatically
- **Documentation**: Works naturally in CI/CD documentation pipelines
- **Portability**: No vendor lock-in, human-readable text files

**When to Use Alternatives:**

- **FluidSIM/Automation Studio**: Need interactive simulation and validation
- **Festo FluidDraw**: Educational purposes with interactive training modules
- **Lucidchart**: Real-time collaboration with non-technical stakeholders
- **Mermaid/PlantUML**: Simple pneumatic concepts in existing markdown docs

## Related

- [Profiles](/guide/profiles)
- [Hydraulic Circuits](/guide/hydraulic-circuits)
- [Electrical Circuits](/guide/electrical)

## Resources

- [ISO 1219-1:2012](https://www.iso.org/standard/51952.html) - Fluid power systems standard
- [SMC Pneumatics](https://www.smcpneumatics.com/) - Component manufacturer
- [Festo Didactic](https://www.festo-didactic.com/) - Training resources
- [Pneumatic Circuit Design](https://www.hydraulicspneumatics.com/)
