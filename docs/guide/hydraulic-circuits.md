---
title: Hydraulic Circuits
description: Design hydraulic systems with pumps, valves, actuators, and ISO 1219-1 compliant symbols for industrial automation.
lastUpdated: 2025-01-09
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

## Complete Component Catalog

### Pumps

| Pump Type             | Symbol ID             | Description                          | Displacement Range | Efficiency |
| --------------------- | --------------------- | ------------------------------------ | ------------------ | ---------- |
| Gear Pump             | `@pump_gear`          | Fixed displacement, economical       | 0.5-250 cc/rev     | 85-90%     |
| Vane Pump             | `@pump_vane`          | Quiet operation, medium pressure     | 5-150 cc/rev       | 80-88%     |
| Piston Pump (Axial)   | `@pump_piston_axial`  | High pressure, variable displacement | 10-1000 cc/rev     | 90-95%     |
| Piston Pump (Radial)  | `@pump_piston_radial` | Very high pressure, compact          | 5-500 cc/rev       | 88-92%     |
| Screw Pump            | `@pump_screw`         | Smooth flow, low noise               | 10-200 cc/rev      | 85-90%     |
| Variable Displacement | `@pump_variable`      | Adjustable flow, load-sensing        | 20-500 cc/rev      | 90-93%     |
| Hand Pump             | `@pump_hand`          | Manual operation, emergency backup   | 1-5 cc/stroke      | 70-80%     |

**Pump Selection:**

- Low pressure (<100 bar): Gear, vane
- Medium pressure (100-250 bar): Piston (axial)
- High pressure (>250 bar): Piston (radial)
- Variable flow: Variable displacement piston

### Hydraulic Motors

| Motor Type            | Symbol ID              | Description                            | Speed Range  | Torque     |
| --------------------- | ---------------------- | -------------------------------------- | ------------ | ---------- |
| Gear Motor            | `@motor_gear`          | Economical, fixed displacement         | 500-5000 RPM | Low-medium |
| Vane Motor            | `@motor_vane`          | Good starting torque                   | 500-2000 RPM | Medium     |
| Piston Motor (Axial)  | `@motor_piston_axial`  | High efficiency, variable displacement | 500-8000 RPM | High       |
| Piston Motor (Radial) | `@motor_piston_radial` | Very high torque, low speed            | 10-1000 RPM  | Very high  |
| Orbit Motor (Gerotor) | `@motor_orbit`         | Low speed, high torque (LSHT)          | 10-500 RPM   | Very high  |

**Motor Selection:**

- High speed, low torque: Gear, vane
- High torque, low speed: Radial piston, orbit (gerotor)
- Variable speed: Variable displacement piston

### Directional Control Valves

| Valve Type         | Symbol ID             | Configuration  | Description                            | Flow Capacity |
| ------------------ | --------------------- | -------------- | -------------------------------------- | ------------- |
| 2/2 Valve          | `@valve_22`           | 2 ports, 2 pos | Simple shut-off                        | 10-500 L/min  |
| 3/2 Valve          | `@valve_32`           | 3 ports, 2 pos | Single-acting cylinder control         | 10-300 L/min  |
| 4/2 Valve          | `@valve_42`           | 4 ports, 2 pos | Double-acting, no center position      | 20-800 L/min  |
| 4/3 Closed Center  | `@valve_43_closed`    | 4 ports, 3 pos | All ports blocked in center            | 20-1000 L/min |
| 4/3 Open Center    | `@valve_43_open`      | 4 ports, 3 pos | P→T in center (unloads pump)           | 20-1000 L/min |
| 4/3 Tandem Center  | `@valve_43_tandem`    | 4 ports, 3 pos | P→T, A/B blocked (holds load)          | 20-1000 L/min |
| 4/3 Float Center   | `@valve_43_float`     | 4 ports, 3 pos | A/B→T, P blocked (free float)          | 20-1000 L/min |
| Proportional Valve | `@valve_proportional` | Variable       | Electronic infinitely variable control | 10-600 L/min  |
| Servo Valve        | `@valve_servo`        | Variable       | High precision, closed-loop control    | 1-200 L/min   |

**Actuation Types:**

- **Manual**: Lever, push button, foot pedal
- **Mechanical**: Roller, cam, spring
- **Solenoid**: 12V DC, 24V DC, 110V AC, 230V AC
- **Pilot**: Hydraulic or pneumatic pilot pressure
- **Hydraulic**: Direct or pilot-operated
- **Proportional**: Electronic (PWM or analog 0-10V, 4-20mA)

### Pressure Control Valves

| Valve Type            | Symbol ID         | Description                            | Pressure Range | Accuracy |
| --------------------- | ----------------- | -------------------------------------- | -------------- | -------- |
| Relief Valve (Direct) | `@relief_direct`  | Limits maximum pressure, direct-acting | 10-350 bar     | ±5-10%   |
| Relief Valve (Pilot)  | `@relief_pilot`   | High flow, pilot-operated              | 50-400 bar     | ±3-5%    |
| Unloading Valve       | `@unloading`      | Vents pump to tank at low pressure     | 10-300 bar     | ±5%      |
| Sequence Valve        | `@sequence`       | Enables second function at setpoint    | 20-350 bar     | ±5-10%   |
| Counterbalance Valve  | `@counterbalance` | Holds vertical load, prevents runaway  | 50-400 bar     | ±3-5%    |
| Pressure Reducing     | `@reducing`       | Lowers downstream pressure             | 10-250 bar     | ±2-5%    |
| Brake Valve           | `@brake`          | Prevents motor overspeed               | 50-350 bar     | ±5%      |

### Flow Control Valves

| Valve Type              | Symbol ID           | Description                              | Flow Range   | Accuracy |
| ----------------------- | ------------------- | ---------------------------------------- | ------------ | -------- |
| Throttle Valve          | `@throttle`         | Fixed orifice, flow varies with pressure | 1-500 L/min  | ±15-20%  |
| Needle Valve            | `@needle`           | Fine adjustment, metering                | 0.1-50 L/min | ±10%     |
| Pressure Compensated    | `@flow_compensated` | Constant flow despite pressure change    | 1-600 L/min  | ±5%      |
| Temperature Compensated | `@flow_temp_comp`   | Compensates for viscosity changes        | 1-400 L/min  | ±3-5%    |
| Priority Valve          | `@priority`         | Ensures flow to critical circuit first   | 10-400 L/min | ±5%      |
| Flow Divider            | `@flow_divider`     | Splits flow equally (synchronization)    | 10-400 L/min | ±2-5%    |

### Check Valves

| Valve Type           | Symbol ID        | Description                     | Cracking Pressure  |
| -------------------- | ---------------- | ------------------------------- | ------------------ |
| Standard Check       | `@check`         | One-way flow, spring-loaded     | 0.3-3 bar          |
| Pilot-Operated Check | `@pilot_check`   | Locks flow until pilot signal   | Locked (infinite)  |
| Shuttle Valve (OR)   | `@shuttle`       | Selects higher of two pressures | 0.1-0.5 bar        |
| Pilot-to-Open Check  | `@pilot_to_open` | Opens reverse flow with pilot   | Locked until pilot |

### Linear Actuators (Cylinders)

| Cylinder Type        | Symbol ID              | Description                                   | Pressure Rating | Stroke Range   |
| -------------------- | ---------------------- | --------------------------------------------- | --------------- | -------------- |
| Single-Rod Standard  | `@cylinder_single_rod` | Most common, differential area                | 160-350 bar     | 10-5000 mm     |
| Double-Rod           | `@cylinder_double_rod` | Equal area both sides                         | 160-250 bar     | 10-3000 mm     |
| Telescopic           | `@cylinder_telescopic` | Multi-stage, long stroke, compact             | 100-250 bar     | 1000-15000 mm  |
| Mill Cylinder        | `@cylinder_mill`       | Heavy duty, high force                        | 200-400 bar     | 50-2000 mm     |
| Tie-Rod Construction | `@cylinder_tie_rod`    | Bolt-together, economical                     | 100-210 bar     | 25-3000 mm     |
| Welded Construction  | `@cylinder_welded`     | Heavy duty, mobile equipment                  | 160-350 bar     | 50-5000 mm     |
| Position Transducer  | `@cylinder_feedback`   | Integrated position sensor (magnetostrictive) | Any             | Sensor: 0.01mm |

### Rotary Actuators

| Actuator Type          | Symbol ID        | Description                      | Rotation Range        | Torque Range  |
| ---------------------- | ---------------- | -------------------------------- | --------------------- | ------------- |
| Vane Rotary Actuator   | `@rotary_vane`   | Limited rotation, compact        | 90°, 180°, 270°, 360° | 10-50000 Nm   |
| Piston Rotary Actuator | `@rotary_piston` | High torque, precise positioning | 90°, 180°, 270°       | 100-500000 Nm |
| Rack & Pinion          | `@rack_pinion`   | Converts linear to rotary        | Variable              | 50-5000 Nm    |
| Helical Actuator       | `@helical`       | Smooth rotation, high torque     | 90°-360° typical      | 100-10000 Nm  |

### Accumulators

| Accumulator Type      | Symbol ID                | Description                            | Volume Range | Precharge     |
| --------------------- | ------------------------ | -------------------------------------- | ------------ | ------------- |
| Bladder Accumulator   | `@accumulator_bladder`   | Fast response, contamination-resistant | 0.05-300 L   | 90% of P_min  |
| Piston Accumulator    | `@accumulator_piston`    | Large volume, slow response            | 0.1-1000 L   | 90% of P_min  |
| Diaphragm Accumulator | `@accumulator_diaphragm` | Small volume, fast response            | 0.01-10 L    | 90% of P_min  |
| Weight-Loaded         | `@accumulator_weight`    | Constant pressure, very large volume   | 100-50000 L  | N/A (gravity) |

**Applications:**

- **Energy storage**: Supplement pump flow during high-demand cycles
- **Shock dampening**: Absorb pressure spikes
- **Thermal expansion**: Compensate for fluid volume change with temperature
- **Emergency power**: Provide backup power source
- **Leakage compensation**: Maintain pressure in clamping circuits

### Filters

| Filter Type     | Symbol ID          | Description                         | Filtration Rating | Location      |
| --------------- | ------------------ | ----------------------------------- | ----------------- | ------------- |
| Suction Filter  | `@filter_suction`  | Coarse filtration, pump inlet       | 75-200 micron     | Before pump   |
| Pressure Filter | `@filter_pressure` | Fine filtration, high-side          | 3-25 micron       | After pump    |
| Return Filter   | `@filter_return`   | Most common, low-side filtration    | 3-25 micron       | Return line   |
| Offline Filter  | `@filter_offline`  | Kidney-loop, continuous circulation | 1-10 micron       | Separate loop |
| Breather Filter | `@filter_breather` | Prevents airborne contaminants      | 3-10 micron       | Reservoir cap |
| Spin-On Filter  | `@filter_spin_on`  | Easy replacement, threaded          | 10-25 micron      | Various       |

**Cleanliness Standards (ISO 4406):**

- **Critical servo systems**: 16/14/11 or better
- **Proportional valves**: 18/16/13
- **General systems**: 20/18/15
- **Mobile equipment**: 21/19/16

### Heat Exchangers

| Cooler Type  | Symbol ID           | Description                            | Cooling Capacity |
| ------------ | ------------------- | -------------------------------------- | ---------------- |
| Air-Cooled   | `@cooler_air`       | Fan-forced air cooling                 | 5-200 kW         |
| Water-Cooled | `@cooler_water`     | Shell-and-tube or plate heat exchanger | 10-1000 kW       |
| Oil-to-Air   | `@cooler_oil_air`   | Direct oil cooling                     | 5-150 kW         |
| Oil-to-Water | `@cooler_oil_water` | High efficiency cooling                | 20-1000 kW       |

**Sizing:**

```
Heat Generation (kW) = (Pump Pressure × Flow × (1 - Efficiency)) / 600
```

**Target Temperature:**

- Continuous operation: 40-60°C
- Maximum: 70-80°C (mineral oil)
- Alarm: 75°C, Shutdown: 80°C

### Reservoirs

| Size                | Capacity   | Description                          |
| ------------------- | ---------- | ------------------------------------ |
| Small (Mobile)      | 10-100 L   | Compact, often integral to machinery |
| Medium (Industrial) | 100-500 L  | Standard industrial systems          |
| Large (Stationary)  | 500-5000 L | Central hydraulic power units        |

**Reservoir Sizing Rule:**

```
Volume (L) = Pump Flow (L/min) × 3 (stationary) or × 1 (mobile)
```

**Features:**

- Baffles for air separation
- Breather/filler cap with filter
- Drain plug (magnetic preferred)
- Return line diffuser
- Sight gauge
- Temperature sensor
- Heater (cold climates)

### Manifolds

| Manifold Type  | Symbol ID             | Description                       | Valve Stations |
| -------------- | --------------------- | --------------------------------- | -------------- |
| Sandwich Plate | `@manifold_sandwich`  | Stackable, compact                | 1-12 sections  |
| Monoblock      | `@manifold_monoblock` | Machined from single block, rigid | 2-8 stations   |
| Modular        | `@manifold_modular`   | Flexible, expandable              | 1-20+ stations |
| Cartridge      | `@manifold_cartridge` | Valve inserts into manifold       | 1-16 cavities  |

## Hydraulic Cylinder Sizing

### Force Calculations

**Extend Force (cap end):**

```
F_extend (kN) = Pressure (bar) × π × (Bore²/4) / 100
```

**Retract Force (rod end):**

```
F_retract (kN) = Pressure (bar) × π × ((Bore² - Rod²)/4) / 100
```

**Example:** 100 mm bore, 56 mm rod, 200 bar pressure

```
F_extend = 200 × 3.14159 × (100²/4) / 100 = 157.1 kN (16 ton)
F_retract = 200 × 3.14159 × ((100² - 56²)/4) / 100 = 107.8 kN (11 ton)
```

**Ratio = F_retract / F_extend = 0.686 (typical for 100 mm bore)**

### Cylinder Selection Chart

| Bore (mm) | @ 200 bar Push (kN) | @ 200 bar Pull (kN) | Rod Diameter (mm) | Typical Application     |
| --------- | ------------------- | ------------------- | ----------------- | ----------------------- |
| 25        | 10                  | 7                   | 14                | Light clamping          |
| 32        | 16                  | 11                  | 18                | Small machine tools     |
| 40        | 25                  | 17                  | 22                | Assembly machinery      |
| 50        | 39                  | 27                  | 28                | General purpose         |
| 63        | 62                  | 43                  | 36                | Medium machines         |
| 80        | 100                 | 69                  | 45                | Presses, injection mold |
| 100       | 157                 | 108                 | 56                | Large presses           |
| 125       | 245                 | 170                 | 70                | Heavy equipment         |
| 160       | 402                 | 280                 | 90                | Construction machinery  |
| 200       | 628                 | 440                 | 110               | Very heavy duty         |
| 250       | 982                 | 690                 | 140               | Large presses           |
| 320       | 1608                | 1132                | 180               | Forging, heavy presses  |

**Safety Factor:** Use 1.5-2.0 safety factor for calculated force

### Speed and Flow Requirements

**Extend Speed:**

```
v_extend (mm/s) = (Flow (L/min) × 1000) / (π × Bore² / 4)
```

**Retract Speed:**

```
v_retract (mm/s) = (Flow (L/min) × 1000) / (π × (Bore² - Rod²) / 4)
```

**Example:** 100 mm bore, 56 mm rod, 100 L/min flow

```
v_extend = (100 × 1000) / (3.14159 × 100² / 4) = 127 mm/s
v_retract = (100 × 1000) / (3.14159 × (100² - 56²) / 4) = 186 mm/s
```

**Typical Cylinder Speeds:**

- Slow (control): 10-50 mm/s
- Medium (general): 50-200 mm/s
- Fast (rapid): 200-500 mm/s
- Very fast (servo): 500-1000 mm/s

### Flow Rate Requirements

**Cylinder Flow:**

```
Q (L/min) = (π × Bore² × Stroke × Cycles/min) / (4 × 1000)
```

**Example:** 100 mm bore, 500 mm stroke, 10 cycles/min

```
Q_extend = (3.14159 × 100² × 500 × 10) / 4000 = 393 L/min
```

**With differential area (retract):**

```
Q_retract = Q_extend × (Bore² - Rod²) / Bore² = 393 × 0.686 = 269 L/min
```

### Buckling Analysis

For long stroke cylinders, check for column buckling:

**Critical Load (Euler buckling):**

```
F_critical (kN) = (π² × E × I) / (L_eff²)
```

Where:

- E = Modulus of elasticity (200 GPa for steel)
- I = Moment of inertia of rod (π × d⁴ / 64)
- L_eff = Effective length (depends on mounting)

**Mounting Factor (k):**

- Fixed-fixed: k = 0.5
- Fixed-pinned: k = 0.7
- Pinned-pinned: k = 1.0
- Fixed-free: k = 2.0

**Rule of thumb:** Stroke-to-bore ratio should be <10:1 without intermediate support

## Pump and Motor Sizing

### Pump Selection

**Flow Rate:**

```
Q (L/min) = (Cylinder Volume × Cycles/min) / Volumetric Efficiency
```

**Volumetric Efficiency:**

- Gear pump: 0.85-0.90
- Vane pump: 0.80-0.88
- Piston pump: 0.90-0.95

**Power Required:**

```
P (kW) = (Pressure (bar) × Flow (L/min)) / (600 × Overall Efficiency)
```

**Overall Efficiency:**

- Gear pump: 0.75-0.85
- Vane pump: 0.70-0.82
- Piston pump: 0.85-0.92

**Example:** 200 bar, 100 L/min, piston pump (η = 0.90)

```
P = (200 × 100) / (600 × 0.90) = 37 kW (50 HP)
```

### Motor Selection (Prime Mover)

Add 10-20% margin for:

- Starting torque
- Load variations
- Altitude (derating)
- Temperature

**Motor Selection:**

```
Motor HP = Pump kW × 1.36 (conversion) × 1.15 (margin)
```

For example: 37 kW pump requires 37 × 1.36 × 1.15 = 58 HP motor (use 60 HP)

### Hydraulic Motor Sizing

**Torque Output:**

```
T (Nm) = (Pressure (bar) × Displacement (cc/rev)) / (20 × π)
```

**Speed:**

```
RPM = (Flow (L/min) × 1000) / (Displacement (cc/rev) × Volumetric Efficiency)
```

**Power Output:**

```
P (kW) = (Torque (Nm) × RPM) / 9549
```

**Example:** 200 bar, 100 cc/rev motor, 100 L/min flow

```
T = (200 × 100) / (20 × 3.14159) = 318 Nm
RPM = (100 × 1000) / (100 × 0.92) = 1087 RPM
P = (318 × 1087) / 9549 = 36 kW
```

## Real-World Application Examples

### Manufacturing: Hydraulic Press

```runiq
hydraulic "Hydraulic Press System" {
  net PUMP, HIGH_PRESS, CYLINDER_A, CYLINDER_B, TANK

  pressure 250 bar operating
  flowRate 100 L/min
  fluid phosphate-ester "Type IV" temp:(15, 80, degC)

  // Components with pin connections
  // Circuit: TANK -> PUMP -> FILTER -> INTENSIFIER -> HIGH_PRESS
  // HIGH_PRESS -> VALVE_MAIN -> CYL_MAIN (with sequence control)
  // Separate clamp cylinder circuit with lower pressure relief

  // Power supply
  part RESERVOIR type:RESERVOIR pins:(TANK) doc:"50L hydraulic reservoir"
  part PUMP_MAIN type:PUMP_FIX pins:(TANK,PUMP) doc:"Main hydraulic pump"

  // Pressure intensifier section
  part INTENSIFIER type:ACC_HYD pins:(PUMP,HIGH_PRESS) doc:"Pressure intensifier 2:1 ratio"
  part VALVE_CHARGE type:VALVE_CHECK pins:(PUMP,HIGH_PRESS) doc:"Intensifier charge valve"

  // Press cylinders
  part CYL_MAIN type:CYL_HYD pins:(CYLINDER_A,CYLINDER_B) doc:"Main press cylinder 200mm bore"
  part CYL_CLAMP type:CYL_HYD pins:(CYLINDER_A) doc:"Workpiece clamp cylinder"

  // Control valves
  part VALVE_MAIN type:VALVE_4_3 pins:(HIGH_PRESS,CYLINDER_A,CYLINDER_B,TANK) doc:"Main cylinder control"
  part VALVE_CLAMP type:VALVE_3_2 pins:(PUMP,CYLINDER_A,TANK) doc:"Clamp cylinder control"
  part VALVE_SEQUENCE type:VALVE_3_2 pins:(CYLINDER_A,CYLINDER_B) doc:"Sequence valve"

  // Safety and monitoring
  part RELIEF_MAIN type:VALVE_RELIEF pins:(HIGH_PRESS,TANK) doc:"Main relief at 250 bar"
  part RELIEF_CLAMP type:VALVE_RELIEF pins:(CYLINDER_A,TANK) doc:"Clamp relief at 100 bar"
  part GAUGE_MAIN type:GAUGE_PRESS pins:(HIGH_PRESS) doc:"Main pressure gauge"
  part GAUGE_CLAMP type:GAUGE_PRESS pins:(CYLINDER_A) doc:"Clamp pressure gauge"

  // Filtration
  part FILTER_PRESSURE type:FILTER pins:(PUMP,HIGH_PRESS) doc:"High pressure filter"
  part FILTER_RETURN type:FILTER pins:(TANK) doc:"Return line filter"
}
```

### Construction Equipment: Excavator

```runiq
hydraulic "Excavator Hydraulic System - 20 Ton Class" {
  net T, P, P_pilot

  pressure 350 bar operating
  flowRate 360 L/min
  fluid mineral "ISO VG 46"

  // Power supply
  part TANK type:RESERVOIR pins:(T) doc:"200L hydraulic reservoir"
  part PUMP_MAIN type:PUMP_PISTON pins:(T,P) doc:"Tandem load-sensing pump"
  part PUMP_PILOT type:PUMP_GEAR pins:(T,P_pilot) doc:"Pilot pressure pump"
  part RELIEF type:RELIEF_VALVE pins:(P,T) doc:"Main relief valve 350 bar"

  // Boom circuit
  part VALVE_BOOM type:VALVE_43 pins:(P,A_BOOM,B_BOOM,T) doc:"Boom control valve"
  part CYL_BOOM type:CYL_HYD pins:(A_BOOM,B_BOOM) doc:"Boom cylinder 160mm"
  part CB_BOOM type:CHECK_VALVE pins:(A_BOOM,B_BOOM) doc:"Boom counterbalance"

  // Arm circuit
  part VALVE_ARM type:VALVE_43 pins:(P,A_ARM,B_ARM,T) doc:"Arm control valve"
  part CYL_ARM type:CYL_HYD pins:(A_ARM,B_ARM) doc:"Arm cylinder 140mm"
  part CB_ARM type:CHECK_VALVE pins:(A_ARM,B_ARM) doc:"Arm counterbalance"

  // Bucket circuit
  part VALVE_BUCKET type:VALVE_43 pins:(P,A_BUCKET,B_BUCKET,T) doc:"Bucket control"
  part CYL_BUCKET type:CYL_HYD pins:(A_BUCKET,B_BUCKET) doc:"Bucket cylinder"

  // Swing motor
  part VALVE_SWING type:VALVE_43 pins:(P,A_SWING,B_SWING,T) doc:"Swing control"
  part MOTOR_SWING type:MOTOR_HYD pins:(A_SWING,B_SWING) doc:"Swing motor"

  // Travel motors
  part VALVE_LEFT type:VALVE_43 pins:(P,A_LEFT,B_LEFT,T) doc:"Left travel"
  part MOTOR_LEFT type:MOTOR_HYD pins:(A_LEFT,B_LEFT) doc:"Left track motor"

  part VALVE_RIGHT type:VALVE_43 pins:(P,A_RIGHT,B_RIGHT,T) doc:"Right travel"
  part MOTOR_RIGHT type:MOTOR_HYD pins:(A_RIGHT,B_RIGHT) doc:"Right track motor"
}
```

**Note:** The excavator hydraulic system features:

- Operating weight: 20 tons
- Bucket capacity: 0.9 m³
- Digging force (bucket): 90 kN
- Max reach: 9.5 m
- Dig depth: 6.5 m
- Swing speed: 12 RPM
- Travel speed: 5.5 km/h
- Hydraulic flow: 360 L/min (2 pumps)
- System pressure: 350 bar

## Component Selection Guidelines

### Valve Sizing

**Flow Capacity:**

```
Q_valve (L/min) = Cylinder Flow × 1.3 (safety factor)
```

**Pressure Drop:**

- Target: <5 bar at rated flow
- Maximum: 10 bar

**Response Time:**

- Standard solenoid: 20-100 ms
- Proportional: 50-200 ms
- Servo: 5-20 ms

### Hose and Tube Sizing

| Flow (L/min) | Pressure Line ID (mm) | Return Line ID (mm) | Max Velocity (m/s) |
| ------------ | --------------------- | ------------------- | ------------------ |
| 0-20         | 6-10                  | 10-13               | 4-5                |
| 20-40        | 10-13                 | 13-16               | 4-5                |
| 40-80        | 13-16                 | 16-20               | 4-5                |
| 80-160       | 16-20                 | 20-25               | 4-5                |
| 160-250      | 20-25                 | 25-32               | 4-5                |
| 250-400      | 25-32                 | 32-40               | 4-5                |

**Return Line:** 1.5-2× larger diameter than pressure line for low velocity

**Velocity Guidelines:**

- Pressure lines: 3-5 m/s
- Return lines: 1.5-2.5 m/s
- Suction lines: 0.5-1.2 m/s (max)

**Pressure Drop:**

```
ΔP (bar) = (L × Q² × ρ) / (d⁵ × 1.2 × 10⁷)
```

Where L = length (m), Q = flow (L/min), d = ID (mm)

Target: <0.5 bar per 10 meters

### Accumulator Sizing

**Bladder/Piston Precharge:**

```
P_precharge = 0.9 × P_minimum
```

**Volume Calculation (adiabatic):**

```
V = (V_fluid × P_max × P_min) / ((P_min - P_precharge) × ((P_max^1.4 / P_min^1.4) - 1))
```

**Simplified (isothermal):**

```
V (L) ≈ Fluid Volume Needed × (P_max / (P_max - P_min)) × 1.1
```

**Example:** Need 5 L of oil from 200 bar to 160 bar

```
V = 5 × (200 / (200 - 160)) × 1.1 = 27.5 L accumulator
```

Use next size up: 32 L bladder accumulator

## Energy Efficiency Strategies

### Load-Sensing Systems

**Energy Savings: 30-60% vs. open-center**

- Pump adjusts displacement to match demand
- Maintains constant ΔP (typically 15-20 bar) above load
- No throttling losses
- Ideal for: Multi-actuator systems with varying loads

### Variable-Speed Drives (VFD)

**Energy Savings: 20-50% vs. fixed-speed**

- Motor speed varies with demand
- Eliminates unloading losses
- Best for: Systems with cyclic operation

**Example:** Press with 20% duty cycle

```
Fixed-speed waste = 75 kW × 0.8 idle time × $0.10/kWh × 4000 hr/year = $24,000/year
VFD savings ≈ 60% = $14,400/year
Payback period < 2 years
```

### Accumulator-Assisted Systems

**Peak Shaving:**

- Small pump + accumulator vs. large pump
- Accumulator supplies high flow during short peaks
- Pump sized for average flow

**Example:** Press requiring 200 L/min for 3 sec, 20 L/min for 10 sec

```
Peak system: 200 L/min pump = 37 kW motor
Accumulator system: 35 L/min pump + 50 L accumulator = 7 kW motor
Energy savings: 81%
```

### Hydraulic Transformers

**Energy Recovery:**

- Captures potential energy from lowering loads
- Transfers to other actuators or stores in accumulator
- Efficiency: 60-80%

**Applications:**

- Cranes (lower boom energy → raise load)
- Excavators (swing deceleration energy → next function)
- Presses (return stroke energy → next cycle)

### System Efficiency Checklist

1. **Pump Selection**
   - Load-sensing variable displacement (best)
   - Fixed displacement with unloading (good)
   - Open-center constant flow (inefficient)

2. **Valve Sizing**
   - Minimize pressure drop (<5 bar at rated flow)
   - Use proportional valves for variable speed
   - Load-sensing valves reduce throttling

3. **Circuit Design**
   - Regenerative circuits for fast retract
   - Differential circuits for unbalanced loads
   - Counterbalance valves (not relief valves) for holding loads

4. **Component Efficiency**
   - High-efficiency pumps (>90%)
   - Minimize line lengths and fittings
   - Proper hose/tube sizing (low velocity)

5. **Temperature Control**
   - Maintain 40-60°C (optimal viscosity)
   - Proper cooler sizing
   - Use synthetic fluids for wider temp range

## Safety Considerations

### Pressure Safety

**Overpressure Protection:**

- Always install relief valve on pump output
- Set 10% above maximum working pressure
- Size for full pump flow at relief setting
- Test relief valves annually

**Pressure Ratings:**

- Hoses/tubes: 4:1 safety factor (burst pressure / working pressure)
- Cylinders: Test pressure = 1.5 × working pressure
- Accumulators: ASME certification required (in USA)

### Stored Energy

**Accumulator Safety:**

- Clearly label precharge pressure
- Install isolation valve
- Bleed pressure before maintenance
- Never cut or weld pressurized accumulator

**Cylinder Creep:**

- Use pilot-operated check valves for vertical loads
- Never rely on directional valve alone
- Install mechanical locks for extended holding

### Fluid Safety

**Fire Hazards:**

- Mineral oil: Flash point 200-260°C
- Use fire-resistant fluids near heat sources
  - HFA (oil-in-water emulsion)
  - HFB (water-in-oil emulsion)
  - HFC (water glycol)
  - HFD (synthetic)

**Pinhole Leaks:**

- High-pressure fluid injection injury
- Can penetrate skin (>7 bar)
- Seek medical attention immediately
- Never use hand to check for leaks (use cardboard)

### Maintenance Safety

**Lockout/Tagout:**

1. Shut off prime mover
2. Lock out electrical disconnect
3. Bleed all pressure (zero energy state)
4. Install mechanical blocks on cylinders
5. Tag all control points

**Hydraulic Shock:**

- Sudden valve closure creates pressure spikes
- Can exceed 2-3× normal pressure
- Use cushioned cylinders
- Install shock suppressors on fast-acting valves
- Soft-start solenoids

### Environmental Protection

**Spill Containment:**

- Reservoir area: 110% of tank capacity
- Biodegradable fluids for environmentally sensitive areas
- Drip pans under connections

**Disposal:**

- Used hydraulic oil is hazardous waste
- Recycle through certified facility
- Never dump or burn

## Basic Hydraulic Circuit

```runiq
hydraulic "Cylinder Position Control" {
  net PUMP, PORT_A, PORT_B, TANK

  pressure 160 bar operating
  flowRate 30 L/min
  fluid mineral "ISO VG 32"

  // Components with pin connections
  // PUMP -> VALVE controls PORT_A/PORT_B for extend/retract -> TANK
  // Flow control and counterbalance provide speed/load control
  part VALVE type:VALVE_43 pins:(PUMP,PORT_A,PORT_B,TANK) doc:"4/3-way proportional valve, closed center"
  part CYLINDER type:CYL_HYD pins:(PORT_A,PORT_B) doc:"Double-acting hydraulic cylinder"
  part PILOT_A type:VALVE_32 pins:(PORT_A) doc:"Extend pilot control"
  part PILOT_B type:VALVE_32 pins:(PORT_B) doc:"Retract pilot control"
  part BALANCE type:CHECK_VALVE pins:(PORT_A,PORT_B) doc:"Counterbalance valve"
  part FLOW_CTRL type:CHECK_VALVE pins:(PORT_A) doc:"Meter-in flow control"
}
```

## Pump and Motor Circuit

```runiq
hydraulic "Motor Speed Control Circuit" {
  net TANK, PUMP_OUT, PRESSURE, MOTOR_IN, MOTOR_OUT, RETURN

  pressure 180 bar operating
  flowRate 60 L/min
  fluid synthetic "ISO VG 46" temp:(5, 70, degC)

  // Components with pin connections
  // Circuit: TANK -> FILTER -> PUMP -> VALVE_DIR -> MOTOR -> RETURN -> FILTER -> TANK
  // With pressure relief, compensator, and comprehensive instrumentation

  // Pump assembly
  part RESERVOIR type:RESERVOIR pins:(TANK,RETURN) doc:"Main reservoir"
  part PUMP type:PUMP_VAR pins:(TANK,PUMP_OUT) doc:"Variable displacement pump"
  part COMPENSATOR type:RELIEF_VALVE pins:(PUMP_OUT) doc:"Load sensing compensator"

  // Motor circuit
  part MOTOR type:MOTOR_HYD pins:(MOTOR_IN,MOTOR_OUT) doc:"Hydraulic motor"
  part VALVE_DIR type:VALVE_43 pins:(PUMP_OUT,MOTOR_IN,MOTOR_OUT,RETURN) doc:"Directional control valve"

  // Protection and control
  part RELIEF type:RELIEF_VALVE pins:(PRESSURE,RETURN) doc:"System relief valve"
  part FILTER_SUCTION type:FILTER pins:(TANK,PUMP_OUT) doc:"Suction filter"
  part FILTER_RETURN type:FILTER pins:(RETURN,TANK) doc:"Return line filter"

  // Instrumentation
  part GAUGE_PUMP type:GAUGE_P pins:(PUMP_OUT) doc:"Pump pressure"
  part GAUGE_MOTOR type:GAUGE_P pins:(MOTOR_IN) doc:"Motor pressure"
  part FLOW_METER type:GAUGE_FLOW pins:(MOTOR_IN) doc:"Flow rate meter"
}
```

## Counterbalance Valve Circuit

Prevent load from running away:

```runiq
hydraulic "Counterbalance - Vertical Load" {
  net T, P, A, B

  pressure 200 bar operating
  flowRate 40 L/min
  fluid mineral "ISO VG 46"

  // Power supply
  part TANK type:RESERVOIR pins:(T) doc:"Hydraulic reservoir"
  part PUMP type:PUMP_FIXED pins:(T,P) doc:"Fixed displacement pump"
  part RELIEF type:RELIEF_VALVE pins:(P,T) doc:"Main relief valve 200 bar"

  // Control and actuation
  part VALVE type:VALVE_43 pins:(P,A,B,T) doc:"Directional control valve"
  part CYLINDER type:CYL_HYD pins:(A,B) doc:"Vertical cylinder"
  part CB_VALVE type:CHECK_VALVE pins:(A,T) doc:"Counterbalance valve 120 bar"
}
```

## Accumulator Circuit

Energy storage and shock dampening:

```runiq
hydraulic "Accumulator Circuit" {
  net T, P, P_ACC, A, B

  pressure 200 bar operating
  flowRate 100 L/min
  fluid mineral "ISO VG 46"

  // Power supply with accumulator
  part TANK type:RESERVOIR pins:(T) doc:"Hydraulic reservoir"
  part PUMP type:PUMP_FIXED pins:(T,P) doc:"Fixed displacement pump"
  part RELIEF type:RELIEF_VALVE pins:(P,T) doc:"Main relief 200 bar"
  part ACC type:ACC_HYD pins:(P_ACC) doc:"Bladder accumulator 10L"
  part ISO_VALVE type:VALVE_22 pins:(P,P_ACC) doc:"Isolation valve"

  // Actuation
  part VALVE type:VALVE_43 pins:(P_ACC,A,B,T) doc:"Fast-acting control"
  part CYLINDER type:CYL_HYD pins:(A,B) doc:"High-speed cylinder"
}
```

## Regenerative Circuit

Increase extend speed:

```runiq
hydraulic "Regenerative Circuit" {
  net T, P, A, B

  pressure 160 bar operating
  flowRate 60 L/min
  fluid mineral "ISO VG 46"

  // Power supply
  part TANK type:RESERVOIR pins:(T) doc:"Hydraulic reservoir"
  part PUMP type:PUMP_FIXED pins:(T,P) doc:"Fixed displacement pump"
  part RELIEF type:RELIEF_VALVE pins:(P,T) doc:"Main relief valve"

  // Regenerative circuit
  part VALVE type:VALVE_43 pins:(P,A,B,T) doc:"Tandem center valve"
  part CYLINDER type:CYL_HYD pins:(A,B) doc:"2:1 area ratio cylinder"
  part REGEN type:CHECK_VALVE pins:(B,A) doc:"Regeneration check valve"
}
```

## Pressure-Reducing Circuit

Multiple pressure zones:

```runiq
hydraulic "Dual-Pressure Circuit" {
  net T, P, P_LOW, A_CLAMP, B_CLAMP, A_FEED, B_FEED

  pressure 200 bar operating
  flowRate 80 L/min
  fluid mineral "ISO VG 46"

  // Power supply
  part TANK type:RESERVOIR pins:(T) doc:"Hydraulic reservoir"
  part PUMP type:PUMP_FIXED pins:(T,P) doc:"Fixed displacement pump"
  part RELIEF_MAIN type:RELIEF_VALVE pins:(P,T) doc:"Main relief 200 bar"

  // High-pressure circuit
  part VALVE_CLAMP type:VALVE_43 pins:(P,A_CLAMP,B_CLAMP,T) doc:"Clamp control"
  part CYL_CLAMP type:CYL_HYD pins:(A_CLAMP,B_CLAMP) doc:"Clamp cylinder"

  // Reduced-pressure circuit
  part REDUCER type:VALVE_PRESS pins:(P,P_LOW) doc:"Pressure reducer 100 bar"
  part RELIEF_LOW type:RELIEF_VALVE pins:(P_LOW,T) doc:"Secondary relief 110 bar"
  part VALVE_FEED type:VALVE_43 pins:(P_LOW,A_FEED,B_FEED,T) doc:"Feed control"
  part CYL_FEED type:CYL_HYD pins:(A_FEED,B_FEED) doc:"Feed cylinder"
}
```

## Sequence Circuit

Automatic cylinder sequencing:

```runiq
hydraulic "Sequence Valve Circuit" {
  net T, P, A1, B1, A2, B2, SEQ

  pressure 200 bar operating
  flowRate 50 L/min
  fluid mineral "ISO VG 46"

  // Power supply
  part TANK type:RESERVOIR pins:(T) doc:"Hydraulic reservoir"
  part PUMP type:PUMP_FIXED pins:(T,P) doc:"Fixed displacement pump"
  part RELIEF type:RELIEF_VALVE pins:(P,T) doc:"Main relief 200 bar"

  // Control
  part VALVE type:VALVE_43 pins:(P,A1,B1,T) doc:"Main control valve"

  // Primary circuit
  part CYL_1 type:CYL_HYD pins:(A1,B1) doc:"Clamp cylinder"
  part SEQ_VALVE type:VALVE_SEQ pins:(A1,SEQ) doc:"Sequence valve 150 bar"

  // Secondary circuit
  part CYL_2 type:CYL_HYD pins:(A2,B2) doc:"Feed cylinder"
}
```

## Proportional Control

Electronic flow and pressure control:

```runiq
hydraulic "Proportional Valve Control" {
  net T, P, A, B

  pressure 180 bar operating
  flowRate 80 L/min
  fluid mineral "ISO VG 46"

  // Power supply
  part TANK type:RESERVOIR pins:(T) doc:"Hydraulic reservoir"
  part PUMP type:PUMP_VAR pins:(T,P) doc:"Variable displacement pump"
  part RELIEF type:RELIEF_VALVE pins:(P,T) doc:"Main relief valve"

  // Proportional control
  part PROP_VALVE type:VALVE_PROP pins:(P,A,B,T) doc:"Proportional 4-way valve"
  part CYLINDER type:CYL_HYD pins:(A,B) doc:"Servo cylinder with position sensor"
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

## Comparison with Other Tools

| Feature                       | Runiq          | FluidSIM   | Automation Studio | MATLAB/Simulink Simscape | Festo FluidDraw | Hydraulic Schematic |
| ----------------------------- | -------------- | ---------- | ----------------- | ------------------------ | --------------- | ------------------- |
| **Text-based DSL**            | ✅             | ❌         | ❌                | ❌                       | ❌              | ❌                  |
| **Version control friendly**  | ✅             | ❌         | ❌                | ⚠️ Partial               | ❌              | ❌                  |
| **Automatic layout**          | ✅             | ❌         | ❌                | ⚠️ Partial               | ❌              | ❌                  |
| **ISO 1219-1 symbols**        | ✅             | ✅         | ✅                | ✅                       | ✅              | ✅                  |
| **Interactive simulation**    | ❌             | ✅         | ✅                | ✅                       | ✅              | ❌                  |
| **Pressure/flow calculation** | ❌             | ✅         | ✅                | ✅                       | ✅              | ❌                  |
| **Component libraries**       | ✅             | ✅         | ✅                | ✅                       | ✅              | ⚠️ Basic            |
| **Custom components**         | ✅             | ⚠️ Limited | ⚠️ Limited        | ✅                       | ⚠️ Limited      | ❌                  |
| **Documentation generation**  | ✅             | ⚠️ Partial | ⚠️ Partial        | ✅                       | ⚠️ Partial      | ❌                  |
| **Multi-circuit projects**    | ✅             | ✅         | ✅                | ✅                       | ✅              | ⚠️ Limited          |
| **Export formats**            | SVG, PNG       | PDF, Image | PDF, Image        | Multiple                 | PDF, DXF        | PDF, Image          |
| **Real-time collaboration**   | ✅ Via Git     | ❌         | ❌                | ❌                       | ❌              | ❌                  |
| **Learning curve**            | Low            | Medium     | Medium            | High                     | Low             | Low                 |
| **Cost**                      | Free           | Commercial | Commercial        | Commercial               | Free            | Free                |
| **Platform**                  | Cross-platform | Windows    | Windows           | Cross-platform           | Windows         | Cross-platform      |

**Key Advantages of Runiq:**

- **Version Control**: Text-based format works seamlessly with Git for tracking changes
- **Automation**: Easy to generate diagrams programmatically from system specifications
- **Documentation**: Integrates naturally with documentation pipelines
- **Portability**: No vendor lock-in, diagrams are human-readable text files
- **Consistency**: Automatic layout ensures professional appearance

**When to Use Alternatives:**

- **FluidSIM/Automation Studio**: Need interactive simulation and system validation
- **MATLAB Simscape**: Complex dynamic analysis and control system design
- **Festo FluidDraw**: Training and educational purposes with interactive learning
- **Traditional CAD**: Detailed mechanical integration and manufacturing drawings

## Examples

See the [examples/hydraulic](/examples/hydraulic) directory for complete examples.

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
