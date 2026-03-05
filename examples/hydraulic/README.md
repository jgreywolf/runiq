# Hydraulic Circuit Examples

This directory contains example hydraulic circuits demonstrating various control strategies and common industrial applications.

## Examples

### 1. Power Unit (`power-unit.runiq`)

**Hydraulic Power Supply System**

A complete hydraulic power unit with:

- Fixed displacement pump
- Electric drive motor
- Pressure relief valve (210 bar)
- Reservoir with return filter
- System pressure monitoring

**Fluid Specification:** Mineral oil ISO VG 46, operating temperature 10-60°C

**Typical Applications:** Machine tool hydraulics, industrial presses, mobile equipment

---

### 2. Cylinder Control (`cylinder-control.runiq`)

**Hydraulic Cylinder Position Control**

Precision cylinder control featuring:

- 4/3-way proportional valve with closed center
- Double-acting hydraulic cylinder
- Pilot controls for extend/retract
- Counterbalance valve for load holding
- Meter-in flow control for speed regulation

**Pressure:** 160 bar | **Flow:** 30 L/min | **Fluid:** Mineral oil ISO VG 32

**Typical Applications:** Injection molding machines, lifting platforms, press brakes

---

### 3. Motor Control (`motor-control.runiq`)

**Variable Speed Hydraulic Motor**

Advanced motor control system with:

- Variable displacement pump
- Load sensing compensator
- Hydraulic motor with directional control
- Suction and return line filtration
- Comprehensive instrumentation (pressure, flow)

**Pressure:** 180 bar | **Flow:** 60 L/min | **Fluid:** Synthetic ISO VG 46, 5-70°C

**Typical Applications:** Conveyor drives, winch systems, industrial mixers

---

### 4. Press System (`press-system.runiq`)

**High-Force Hydraulic Press**

Heavy-duty press circuit featuring:

- Pressure intensifier (2:1 ratio, 250 bar)
- Main press cylinder (200mm bore)
- Workpiece clamp cylinder
- Sequence valve for controlled operation
- Dual relief valves (main and clamp)
- High-pressure filtration

**Fluid:** Phosphate-ester Type IV (fire-resistant), 15-80°C

**Typical Applications:** Metal forming, stamping operations, compression molding

---

## Hydraulic Circuit Conventions

### Pressure Specifications

- **Low Pressure:** 100-160 bar (1450-2320 psi)
- **Medium Pressure:** 160-210 bar (2320-3045 psi)
- **High Pressure:** 210-350 bar (3045-5075 psi)

### Flow Rate Ranges

- **Low Flow:** 10-40 L/min
- **Medium Flow:** 40-100 L/min
- **High Flow:** 100-200+ L/min

### Component Types

- `RESERVOIR` - Hydraulic fluid reservoir/tank
- `PUMP_FIXED` - Fixed displacement pump
- `PUMP_VAR` - Variable displacement pump
- `MOTOR_HYD` - Hydraulic motor
- `CYL_HYD` - Double-acting hydraulic cylinder
- `VALVE_43` - 4-port, 3-position valve
- `VALVE_32` - 3-port, 2-position valve
- `RELIEF_VALVE` - Pressure relief valve
- `CHECK_VALVE` - Check valve / flow control
- `ACCUMULATOR` - Hydraulic accumulator / intensifier
- `FILTER` - Hydraulic filter
- `GAUGE_P_HYD` - Pressure gauge
- `FLOW_CONTROL_HYD` - Flow meter
- `SENSOR_PROX` - Proximity sensor
- `SENSOR_PRESS` - Pressure Sensor

### Fluid Types

- `mineral` - Mineral-based hydraulic oil (most common)
- `synthetic` - Synthetic hydraulic fluid
- `biodegradable` - Environmentally friendly fluid
- `water-glycol` - Water-glycol mixture
- `phosphate-ester` - Fire-resistant fluid (high temperature)

### Net Naming Conventions

- `TANK` - Return to reservoir
- `PUMP`, `PUMP_OUT` - Pump discharge
- `PRESSURE`, `HIGH_PRESS` - Pressurized lines
- `PORT_A`, `PORT_B` - Actuator ports
- `RETURN` - Return line to tank

---

## Running Examples

To parse and validate these examples:

```bash
# From project root
pnpm cli parse examples/hydraulic/power-unit.runiq

# Generate SVG output
pnpm cli render examples/hydraulic/motor-control.runiq -o output/hydraulic-motor.svg
```

## Standards Reference

These examples follow **ISO 1219-2** (Hydraulic fluid power — Symbols).

See `docs/ISO-1219-SYMBOL-REFERENCE.md` for complete symbol reference.

## Safety Notes

⚠️ **High Pressure Warning:** Hydraulic systems operate at dangerous pressures. Always:

- Use proper pressure ratings for all components
- Include relief valves for overpressure protection
- Use appropriate seals and fittings
- Follow manufacturer specifications
- Implement proper lockout/tagout procedures

🔥 **Fluid Selection:** Choose hydraulic fluids based on:

- Operating temperature range
- Fire resistance requirements
- Environmental considerations
- Equipment compatibility
