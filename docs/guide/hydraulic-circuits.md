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

| Pump Type             | Symbol ID              | Description                               | Displacement Range    | Efficiency |
| --------------------- | ---------------------- | ----------------------------------------- | --------------------- | ---------- |
| Gear Pump             | `@pump_gear`           | Fixed displacement, economical            | 0.5-250 cc/rev        | 85-90%     |
| Vane Pump             | `@pump_vane`           | Quiet operation, medium pressure          | 5-150 cc/rev          | 80-88%     |
| Piston Pump (Axial)   | `@pump_piston_axial`   | High pressure, variable displacement      | 10-1000 cc/rev        | 90-95%     |
| Piston Pump (Radial)  | `@pump_piston_radial`  | Very high pressure, compact               | 5-500 cc/rev          | 88-92%     |
| Screw Pump            | `@pump_screw`          | Smooth flow, low noise                    | 10-200 cc/rev         | 85-90%     |
| Variable Displacement | `@pump_variable`       | Adjustable flow, load-sensing             | 20-500 cc/rev         | 90-93%     |
| Hand Pump             | `@pump_hand`           | Manual operation, emergency backup        | 1-5 cc/stroke         | 70-80%     |

**Pump Selection:**
- Low pressure (<100 bar): Gear, vane
- Medium pressure (100-250 bar): Piston (axial)
- High pressure (>250 bar): Piston (radial)
- Variable flow: Variable displacement piston

### Hydraulic Motors

| Motor Type            | Symbol ID              | Description                               | Speed Range           | Torque      |
| --------------------- | ---------------------- | ----------------------------------------- | --------------------- | ----------- |
| Gear Motor            | `@motor_gear`          | Economical, fixed displacement            | 500-5000 RPM          | Low-medium  |
| Vane Motor            | `@motor_vane`          | Good starting torque                      | 500-2000 RPM          | Medium      |
| Piston Motor (Axial)  | `@motor_piston_axial`  | High efficiency, variable displacement    | 500-8000 RPM          | High        |
| Piston Motor (Radial) | `@motor_piston_radial` | Very high torque, low speed               | 10-1000 RPM           | Very high   |
| Orbit Motor (Gerotor) | `@motor_orbit`         | Low speed, high torque (LSHT)             | 10-500 RPM            | Very high   |

**Motor Selection:**
- High speed, low torque: Gear, vane
- High torque, low speed: Radial piston, orbit (gerotor)
- Variable speed: Variable displacement piston

### Directional Control Valves

| Valve Type            | Symbol ID              | Configuration   | Description                               | Flow Capacity      |
| --------------------- | ---------------------- | --------------- | ----------------------------------------- | ------------------ |
| 2/2 Valve             | `@valve_2_2`           | 2 ports, 2 pos  | Simple shut-off                           | 10-500 L/min       |
| 3/2 Valve             | `@valve_3_2`           | 3 ports, 2 pos  | Single-acting cylinder control            | 10-300 L/min       |
| 4/2 Valve             | `@valve_4_2`           | 4 ports, 2 pos  | Double-acting, no center position         | 20-800 L/min       |
| 4/3 Closed Center     | `@valve_4_3_closed`    | 4 ports, 3 pos  | All ports blocked in center               | 20-1000 L/min      |
| 4/3 Open Center       | `@valve_4_3_open`      | 4 ports, 3 pos  | P→T in center (unloads pump)              | 20-1000 L/min      |
| 4/3 Tandem Center     | `@valve_4_3_tandem`    | 4 ports, 3 pos  | P→T, A/B blocked (holds load)             | 20-1000 L/min      |
| 4/3 Float Center      | `@valve_4_3_float`     | 4 ports, 3 pos  | A/B→T, P blocked (free float)             | 20-1000 L/min      |
| Proportional Valve    | `@valve_proportional`  | Variable        | Electronic infinitely variable control    | 10-600 L/min       |
| Servo Valve           | `@valve_servo`         | Variable        | High precision, closed-loop control       | 1-200 L/min        |

**Actuation Types:**
- **Manual**: Lever, push button, foot pedal
- **Mechanical**: Roller, cam, spring
- **Solenoid**: 12V DC, 24V DC, 110V AC, 230V AC
- **Pilot**: Hydraulic or pneumatic pilot pressure
- **Hydraulic**: Direct or pilot-operated
- **Proportional**: Electronic (PWM or analog 0-10V, 4-20mA)

### Pressure Control Valves

| Valve Type            | Symbol ID              | Description                               | Pressure Range        | Accuracy    |
| --------------------- | ---------------------- | ----------------------------------------- | --------------------- | ----------- |
| Relief Valve (Direct) | `@relief_direct`       | Limits maximum pressure, direct-acting    | 10-350 bar            | ±5-10%      |
| Relief Valve (Pilot)  | `@relief_pilot`        | High flow, pilot-operated                 | 50-400 bar            | ±3-5%       |
| Unloading Valve       | `@unloading`           | Vents pump to tank at low pressure        | 10-300 bar            | ±5%         |
| Sequence Valve        | `@sequence`            | Enables second function at setpoint       | 20-350 bar            | ±5-10%      |
| Counterbalance Valve  | `@counterbalance`      | Holds vertical load, prevents runaway     | 50-400 bar            | ±3-5%       |
| Pressure Reducing     | `@reducing`            | Lowers downstream pressure                | 10-250 bar            | ±2-5%       |
| Brake Valve           | `@brake`               | Prevents motor overspeed                  | 50-350 bar            | ±5%         |

### Flow Control Valves

| Valve Type            | Symbol ID              | Description                               | Flow Range            | Accuracy    |
| --------------------- | ---------------------- | ----------------------------------------- | --------------------- | ----------- |
| Throttle Valve        | `@throttle`            | Fixed orifice, flow varies with pressure  | 1-500 L/min           | ±15-20%     |
| Needle Valve          | `@needle`              | Fine adjustment, metering                 | 0.1-50 L/min          | ±10%        |
| Pressure Compensated  | `@flow_compensated`    | Constant flow despite pressure change     | 1-600 L/min           | ±5%         |
| Temperature Compensated | `@flow_temp_comp`    | Compensates for viscosity changes         | 1-400 L/min           | ±3-5%       |
| Priority Valve        | `@priority`            | Ensures flow to critical circuit first    | 10-400 L/min          | ±5%         |
| Flow Divider          | `@flow_divider`        | Splits flow equally (synchronization)     | 10-400 L/min          | ±2-5%       |

### Check Valves

| Valve Type            | Symbol ID              | Description                               | Cracking Pressure     |
| --------------------- | ---------------------- | ----------------------------------------- | --------------------- |
| Standard Check        | `@check`               | One-way flow, spring-loaded               | 0.3-3 bar             |
| Pilot-Operated Check  | `@pilot_check`         | Locks flow until pilot signal             | Locked (infinite)     |
| Shuttle Valve (OR)    | `@shuttle`             | Selects higher of two pressures           | 0.1-0.5 bar           |
| Pilot-to-Open Check   | `@pilot_to_open`       | Opens reverse flow with pilot             | Locked until pilot    |

### Linear Actuators (Cylinders)

| Cylinder Type         | Symbol ID              | Description                               | Pressure Rating       | Stroke Range  |
| --------------------- | ---------------------- | ----------------------------------------- | --------------------- | ------------- |
| Single-Rod Standard   | `@cylinder_single_rod` | Most common, differential area            | 160-350 bar           | 10-5000 mm    |
| Double-Rod            | `@cylinder_double_rod` | Equal area both sides                     | 160-250 bar           | 10-3000 mm    |
| Telescopic            | `@cylinder_telescopic` | Multi-stage, long stroke, compact         | 100-250 bar           | 1000-15000 mm |
| Mill Cylinder         | `@cylinder_mill`       | Heavy duty, high force                    | 200-400 bar           | 50-2000 mm    |
| Tie-Rod Construction  | `@cylinder_tie_rod`    | Bolt-together, economical                 | 100-210 bar           | 25-3000 mm    |
| Welded Construction   | `@cylinder_welded`     | Heavy duty, mobile equipment              | 160-350 bar           | 50-5000 mm    |
| Position Transducer   | `@cylinder_feedback`   | Integrated position sensor (magnetostrictive) | Any                   | Sensor: 0.01mm |

### Rotary Actuators

| Actuator Type         | Symbol ID              | Description                               | Rotation Range        | Torque Range  |
| --------------------- | ---------------------- | ----------------------------------------- | --------------------- | ------------- |
| Vane Rotary Actuator  | `@rotary_vane`         | Limited rotation, compact                 | 90°, 180°, 270°, 360° | 10-50000 Nm   |
| Piston Rotary Actuator | `@rotary_piston`      | High torque, precise positioning          | 90°, 180°, 270°       | 100-500000 Nm |
| Rack & Pinion         | `@rack_pinion`         | Converts linear to rotary                 | Variable              | 50-5000 Nm    |
| Helical Actuator      | `@helical`             | Smooth rotation, high torque              | 90°-360° typical      | 100-10000 Nm  |

### Accumulators

| Accumulator Type      | Symbol ID              | Description                               | Volume Range          | Precharge     |
| --------------------- | ---------------------- | ----------------------------------------- | --------------------- | ------------- |
| Bladder Accumulator   | `@accumulator_bladder` | Fast response, contamination-resistant    | 0.05-300 L            | 90% of P_min  |
| Piston Accumulator    | `@accumulator_piston`  | Large volume, slow response               | 0.1-1000 L            | 90% of P_min  |
| Diaphragm Accumulator | `@accumulator_diaphragm` | Small volume, fast response             | 0.01-10 L             | 90% of P_min  |
| Weight-Loaded         | `@accumulator_weight`  | Constant pressure, very large volume      | 100-50000 L           | N/A (gravity) |

**Applications:**
- **Energy storage**: Supplement pump flow during high-demand cycles
- **Shock dampening**: Absorb pressure spikes
- **Thermal expansion**: Compensate for fluid volume change with temperature
- **Emergency power**: Provide backup power source
- **Leakage compensation**: Maintain pressure in clamping circuits

### Filters

| Filter Type           | Symbol ID              | Description                               | Filtration Rating     | Location      |
| --------------------- | ---------------------- | ----------------------------------------- | --------------------- | ------------- |
| Suction Filter        | `@filter_suction`      | Coarse filtration, pump inlet             | 75-200 micron         | Before pump   |
| Pressure Filter       | `@filter_pressure`     | Fine filtration, high-side                | 3-25 micron           | After pump    |
| Return Filter         | `@filter_return`       | Most common, low-side filtration          | 3-25 micron           | Return line   |
| Offline Filter        | `@filter_offline`      | Kidney-loop, continuous circulation       | 1-10 micron           | Separate loop |
| Breather Filter       | `@filter_breather`     | Prevents airborne contaminants            | 3-10 micron           | Reservoir cap |
| Spin-On Filter        | `@filter_spin_on`      | Easy replacement, threaded                | 10-25 micron          | Various       |

**Cleanliness Standards (ISO 4406):**
- **Critical servo systems**: 16/14/11 or better
- **Proportional valves**: 18/16/13
- **General systems**: 20/18/15
- **Mobile equipment**: 21/19/16

### Heat Exchangers

| Cooler Type           | Symbol ID              | Description                               | Cooling Capacity      |
| --------------------- | ---------------------- | ----------------------------------------- | --------------------- |
| Air-Cooled            | `@cooler_air`          | Fan-forced air cooling                    | 5-200 kW              |
| Water-Cooled          | `@cooler_water`        | Shell-and-tube or plate heat exchanger    | 10-1000 kW            |
| Oil-to-Air            | `@cooler_oil_air`      | Direct oil cooling                        | 5-150 kW              |
| Oil-to-Water          | `@cooler_oil_water`    | High efficiency cooling                   | 20-1000 kW            |

**Sizing:**
```
Heat Generation (kW) = (Pump Pressure × Flow × (1 - Efficiency)) / 600
```

**Target Temperature:**
- Continuous operation: 40-60°C
- Maximum: 70-80°C (mineral oil)
- Alarm: 75°C, Shutdown: 80°C

### Reservoirs

| Size                  | Capacity              | Description                               |
| --------------------- | --------------------- | ----------------------------------------- |
| Small (Mobile)        | 10-100 L              | Compact, often integral to machinery      |
| Medium (Industrial)   | 100-500 L             | Standard industrial systems               |
| Large (Stationary)    | 500-5000 L            | Central hydraulic power units             |

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

| Manifold Type         | Symbol ID              | Description                               | Valve Stations        |
| --------------------- | ---------------------- | ----------------------------------------- | --------------------- |
| Sandwich Plate        | `@manifold_sandwich`   | Stackable, compact                        | 1-12 sections         |
| Monoblock             | `@manifold_monoblock`  | Machined from single block, rigid         | 2-8 stations          |
| Modular               | `@manifold_modular`    | Flexible, expandable                      | 1-20+ stations        |
| Cartridge             | `@manifold_cartridge`  | Valve inserts into manifold               | 1-16 cavities         |

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

| Bore (mm) | @ 200 bar Push (kN) | @ 200 bar Pull (kN) | Rod Diameter (mm) | Typical Application       |
| --------- | ------------------- | ------------------- | ----------------- | ------------------------- |
| 25        | 10                  | 7                   | 14                | Light clamping            |
| 32        | 16                  | 11                  | 18                | Small machine tools       |
| 40        | 25                  | 17                  | 22                | Assembly machinery        |
| 50        | 39                  | 27                  | 28                | General purpose           |
| 63        | 62                  | 43                  | 36                | Medium machines           |
| 80        | 100                 | 69                  | 45                | Presses, injection mold   |
| 100       | 157                 | 108                 | 56                | Large presses             |
| 125       | 245                 | 170                 | 70                | Heavy equipment           |
| 160       | 402                 | 280                 | 90                | Construction machinery    |
| 200       | 628                 | 440                 | 110               | Very heavy duty           |
| 250       | 982                 | 690                 | 140               | Large presses             |
| 320       | 1608                | 1132                | 180               | Forging, heavy presses    |

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
hydraulic "400-Ton Hydraulic Press" {
  tank T capacity: "1000 L" labeled: "Main Reservoir"

  # Power unit
  component motor as @motor_electric 
    power: "75 kW" 
    speed: "1450 RPM"
    labeled: "75 kW Motor"
  component pump as @pump_piston_axial 
    connected: T 
    displacement: "125 cc/rev"
    output: P 
    pressure: "250 bar"
    flow: "180 L/min"
    labeled: "Variable Displacement Pump"
  component filter_suction as @filter_suction 
    connected: T
    rating: "100 micron"
    labeled: "Suction Strainer"

  motor -> pump label: "Direct coupling"
  filter_suction -> pump label: "Inlet"

  # Pressure control
  component relief_main as @relief_pilot 
    connected: P 
    setting: "250 bar"
    flow: "200 L/min"
    labeled: "Main Relief Valve"
  component pressure_gauge_main as @pressure_gauge 
    connected: P
    range: "0-400 bar"
    labeled: "Main Pressure"

  relief_main.return -> T label: "Relief to tank"

  # Main control valve
  component valve_main as @valve_proportional 
    connected: P 
    type: "4-way"
    flow: "180 L/min"
    labeled: "Proportional Valve"
  component controller as @plc 
    labeled: "PLC Controller"
  component joystick as @joystick 
    output: "±10V"
    labeled: "Operator Joystick"

  joystick -> controller label: "Manual input"
  controller -> valve_main label: "Proportional control signal"

  # Main press cylinder
  component cylinder_main as @cylinder_single_rod 
    bore: "500 mm"
    rod: "280 mm"
    stroke: "1000 mm"
    force: "4000 kN @ 200 bar"
    labeled: "Main Press Cylinder"
  component position_sensor as @lvdt 
    connected: cylinder_main
    resolution: "0.01 mm"
    labeled: "Position Feedback"
  
  valve_main.portA -> cylinder_main.portA label: "Extend (press down)"
  valve_main.portB -> cylinder_main.portB label: "Retract (rapid up)"
  position_sensor -> controller label: "Position feedback"

  # Counterbalance for tonnage safety
  component counterbalance as @counterbalance 
    connected: cylinder_main.portA
    setting: "180 bar"
    ratio: "3:1"
    labeled: "Tonnage Control"
  
  cylinder_main.portA -> counterbalance label: "Prevent overload"
  counterbalance.drain -> valve_main.portB label: "Controlled return"

  # Pressure transducer for force feedback
  component force_sensor as @pressure_transducer 
    connected: cylinder_main.portA
    range: "0-250 bar"
    output: "4-20 mA"
    labeled: "Tonnage Sensor"
  
  force_sensor -> controller label: "Force feedback"

  # Rapid approach circuit (high flow, low pressure)
  component valve_rapid as @valve_2_2 
    connected: P
    type: "solenoid NO"
    flow: "180 L/min"
    labeled: "Rapid Approach Valve"
  component pressure_switch_approach as @pressure_switch 
    connected: cylinder_main.portA
    setpoint: "50 bar"
    labeled: "Approach Pressure Switch"

  valve_rapid -> valve_main label: "High flow for rapid"
  pressure_switch_approach -> valve_rapid label: "Close at work pressure"

  # Return circuit with regeneration
  component regen_check as @check 
    labeled: "Regeneration Check"
  
  cylinder_main.portB -> regen_check -> cylinder_main.portA label: "Regenerative retract"

  # Cooling system
  component cooler as @cooler_water 
    connected: T
    capacity: "50 kW"
    flow_water: "10 L/min"
    labeled: "Water-Cooled Heat Exchanger"
  component pump_cooling as @pump_gear 
    connected: T
    displacement: "20 cc/rev"
    labeled: "Cooling Circuit Pump"
  component temp_sensor as @temperature_sensor 
    connected: T
    range: "0-100°C"
    alarm: "75°C"
    shutdown: "80°C"
    labeled: "Oil Temperature"

  pump_cooling -> cooler -> T label: "Cooling circulation"
  temp_sensor -> controller label: "Temperature monitoring"

  # Filtration
  component filter_return as @filter_return 
    connected: valve_main.portT
    rating: "10 micron"
    flow: "200 L/min"
    indicator: "Clogging indicator"
    labeled: "Return Line Filter"
  
  valve_main.portT -> filter_return -> T label: "Filtered return"
  counterbalance.drain -> filter_return label: "Counterbalance drain"

  # Accumulator for rapid approach
  component accumulator as @accumulator_bladder 
    connected: P
    volume: "50 L"
    precharge: "135 bar"
    max: "240 bar"
    labeled: "Energy Accumulator"
  component isolation_acc as @valve_2_2 
    connected: accumulator
    type: "solenoid NO"
    labeled: "Accumulator Isolation"
  
  accumulator -> isolation_acc -> valve_rapid label: "Boost flow"
  controller -> isolation_acc label: "Engage for rapid stroke"

  # Safety circuit
  component estop as @button 
    type: "emergency-stop NC"
    labeled: "Emergency Stop"
  component valve_safety as @valve_2_2 
    connected: P
    type: "solenoid NC"
    labeled: "Main Safety Valve"
  
  estop -> valve_safety label: "E-stop cuts power"
  P -> valve_safety -> valve_main label: "Safety interlock"

  # Light curtain safety
  component light_curtain as @safety_sensor 
    type: "light curtain"
    labeled: "Operator Protection"
  
  light_curtain -> controller label: "Safety zone violation"
  controller -> valve_safety label: "Emergency retract"

  note "Specifications:\n- Tonnage: 400 tons (4000 kN)\n- Stroke: 1000 mm\n- Rapid approach: 300 mm/s\n- Work speed: 5-50 mm/s (variable)\n- Dwell time: 0-30 sec\n- Cycle time: 25 seconds\n- Daylight: 1500 mm\n- Bed size: 1500 × 1200 mm" at: cylinder_main
}
```

### Construction Equipment: Excavator

```runiq
hydraulic "Excavator Hydraulic System - 20 Ton Class" {
  tank T capacity: "200 L" labeled: "Hydraulic Reservoir"

  # Power source
  component engine as @diesel_engine 
    power: "110 kW"
    speed: "2000 RPM"
    labeled: "Diesel Engine"
  component pump_main as @pump_piston_axial 
    connected: T
    displacement: "2 × 90 cc/rev"
    output: P
    type: "load-sensing"
    pressure: "350 bar"
    flow: "2 × 180 L/min"
    labeled: "Tandem Load-Sensing Pump"
  component pump_pilot as @pump_gear 
    connected: T
    displacement: "10 cc/rev"
    output: P_pilot
    pressure: "30 bar"
    flow: "20 L/min"
    labeled: "Pilot Pump"

  engine -> pump_main label: "Mechanical drive"
  engine -> pump_pilot label: "Pilot system"

  # Main relief
  component relief_main as @relief_pilot 
    connected: P
    setting: "350 bar"
    labeled: "Main Relief"
  
  relief_main.return -> T

  # Boom circuit
  component valve_boom as @valve_prop_ls 
    connected: P
    type: "load-sensing proportional"
    flow: "180 L/min"
    labeled: "Boom Valve Section"
  component cylinder_boom as @cylinder_single_rod 
    bore: "160 mm"
    rod: "90 mm"
    stroke: "1400 mm"
    force: "200 kN @ 250 bar"
    labeled: "Boom Cylinder"
  component counterbalance_boom as @counterbalance 
    setting: "200 bar"
    ratio: "4:1"
    labeled: "Boom Counterbalance"
  component joystick_boom as @joystick_pilot 
    connected: P_pilot
    labeled: "Boom Control"

  joystick_boom.pilot_a -> valve_boom.pilot_a label: "Raise boom"
  joystick_boom.pilot_b -> valve_boom.pilot_b label: "Lower boom"
  valve_boom.portA -> cylinder_boom.portA label: "Extend (raise)"
  valve_boom.portB -> counterbalance_boom -> cylinder_boom.portA label: "Controlled lower"
  cylinder_boom.portB -> valve_boom.portT -> T label: "Return"

  # Arm (stick) circuit
  component valve_arm as @valve_prop_ls 
    connected: P
    type: "load-sensing proportional"
    flow: "180 L/min"
    labeled: "Arm Valve Section"
  component cylinder_arm as @cylinder_single_rod 
    bore: "140 mm"
    rod: "80 mm"
    stroke: "1100 mm"
    force: "150 kN @ 250 bar"
    labeled: "Arm Cylinder"
  component counterbalance_arm as @counterbalance 
    setting: "180 bar"
    ratio: "3:1"
    labeled: "Arm Counterbalance"
  component joystick_arm as @joystick_pilot 
    connected: P_pilot
    labeled: "Arm Control"

  joystick_arm.pilot_a -> valve_arm.pilot_a label: "Curl in"
  joystick_arm.pilot_b -> valve_arm.pilot_b label: "Extend out"
  valve_arm -> cylinder_arm
  cylinder_arm.portA -> counterbalance_arm

  # Bucket circuit
  component valve_bucket as @valve_prop_ls 
    connected: P
    type: "load-sensing proportional"
    flow: "120 L/min"
    labeled: "Bucket Valve Section"
  component cylinder_bucket as @cylinder_single_rod 
    bore: "110 mm"
    rod: "63 mm"
    stroke: "700 mm"
    force: "90 kN @ 250 bar"
    labeled: "Bucket Cylinder"
  component joystick_bucket as @joystick_pilot 
    connected: P_pilot
    labeled: "Bucket Control"

  joystick_bucket.pilot_a -> valve_bucket.pilot_a label: "Curl"
  joystick_bucket.pilot_b -> valve_bucket.pilot_b label: "Dump"
  valve_bucket -> cylinder_bucket

  # Swing motor circuit
  component valve_swing as @valve_prop_ls 
    connected: P
    type: "load-sensing proportional"
    flow: "160 L/min"
    labeled: "Swing Valve"
  component motor_swing as @motor_piston_axial 
    displacement: "180 cc/rev"
    speed: "0-12 RPM"
    torque: "25 kNm"
    labeled: "Swing Motor + Gearbox"
  component brake_swing as @brake 
    connected: motor_swing
    setting: "150 bar"
    labeled: "Swing Brake"
  component joystick_swing as @joystick_pilot 
    connected: P_pilot
    labeled: "Swing Control"

  joystick_swing.pilot_a -> valve_swing.pilot_a label: "Swing left"
  joystick_swing.pilot_b -> valve_swing.pilot_b label: "Swing right"
  valve_swing.portA -> motor_swing.portA
  valve_swing.portB -> motor_swing.portB
  motor_swing.drain -> T label: "Case drain"

  # Travel motors (left and right tracks)
  component valve_travel_left as @valve_prop_ls 
    connected: P
    type: "load-sensing proportional"
    flow: "140 L/min"
    labeled: "Left Travel Valve"
  component motor_travel_left as @motor_piston_axial 
    displacement: "160 cc/rev"
    speed: "0-45 RPM"
    labeled: "Left Track Motor + Final Drive"
  component brake_travel_left as @brake 
    connected: motor_travel_left
    type: "spring-applied"
    labeled: "Left Parking Brake"
  component pedal_travel_left as @pedal_pilot 
    connected: P_pilot
    labeled: "Left Travel Pedal"

  pedal_travel_left.pilot_a -> valve_travel_left.pilot_a label: "Forward"
  pedal_travel_left.pilot_b -> valve_travel_left.pilot_b label: "Reverse"
  valve_travel_left -> motor_travel_left

  component valve_travel_right as @valve_prop_ls 
    connected: P
    flow: "140 L/min"
    labeled: "Right Travel Valve"
  component motor_travel_right as @motor_piston_axial 
    displacement: "160 cc/rev"
    labeled: "Right Track Motor"
  component pedal_travel_right as @pedal_pilot 
    connected: P_pilot
    labeled: "Right Travel Pedal"

  pedal_travel_right -> valve_travel_right
  valve_travel_right -> motor_travel_right

  # Auxiliary hydraulics (attachment)
  component valve_aux as @valve_prop_ls 
    connected: P
    flow: "100 L/min"
    labeled: "Auxiliary Valve (Attachment)"
  component quick_coupler as @quick_coupling 
    connected: valve_aux
    type: "flat-face"
    labeled: "Hydraulic Quick Coupler"

  valve_aux -> quick_coupler label: "Hammer/Grapple/Auger"

  # Cooling system
  component cooler_main as @cooler_oil_air 
    connected: T
    capacity: "40 kW"
    fan_speed: "Variable"
    labeled: "Hydraulic Oil Cooler"
  component temp_sensor as @temperature_sensor 
    connected: T
    alarm: "90°C"
    labeled: "Oil Temperature"

  temp_sensor -> engine label: "Adjust fan speed"

  # Filtration
  component filter_return as @filter_return 
    connected: T
    rating: "10 micron"
    flow: "400 L/min"
    labeled: "Main Return Filter"
  component filter_pilot as @filter_pressure 
    connected: P_pilot
    rating: "5 micron"
    labeled: "Pilot Filter"

  valve_boom.portT -> filter_return -> T
  valve_arm.portT -> filter_return -> T
  valve_bucket.portT -> filter_return -> T
  valve_swing.portT -> filter_return -> T

  # Makeup charge pump for closed-loop circuits
  component pump_charge as @pump_gear 
    connected: T
    displacement: "15 cc/rev"
    pressure: "20 bar"
    labeled: "Charge Pump (Swing/Travel)"

  pump_charge -> motor_swing.case_drain label: "Makeup flow"
  pump_charge -> motor_travel_left.case_drain
  pump_charge -> motor_travel_right.case_drain

  note "Excavator Specifications:\n- Operating weight: 20 tons\n- Bucket capacity: 0.9 m³\n- Digging force (bucket): 90 kN\n- Digging force (arm): 150 kN\n- Max reach: 9.5 m\n- Dig depth: 6.5 m\n- Swing speed: 12 RPM\n- Travel speed: 5.5 km/h\n- Hydraulic flow: 360 L/min (2 pumps)\n- System pressure: 350 bar" at: pump_main
}
```

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
