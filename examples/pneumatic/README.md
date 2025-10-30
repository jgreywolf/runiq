# Pneumatic Circuit Examples

This directory contains example pneumatic circuits demonstrating various control strategies and common industrial applications.

## Examples

### 1. FRL Unit (`frl-unit.runiq`)

**Filter-Regulator-Lubricator Air Preparation System**

A complete air preparation system that conditions compressed air before distribution:

- Air filter removes particulates
- Pressure regulator maintains constant output pressure
- Lubricator adds oil mist for pneumatic tool lubrication
- Pressure gauge for monitoring
- Manual shutoff valve

**Typical Applications:** Workshop air supply, pneumatic tool stations, production line air preparation

---

### 2. Cylinder Control (`cylinder-control.runiq`)

**Single-Acting Cylinder Control Circuit**

Basic cylinder control using a 3/2-way valve:

- Manual push button activation
- Single-acting cylinder with spring return
- Simple extend/retract operation

**Typical Applications:** Stamping operations, ejector systems, simple clamping

---

### 3. Double-Acting Cylinder (`double-acting-cylinder.runiq`)

**Complete Extend/Retract Control**

Advanced cylinder control with:

- 5/2-way double solenoid valve
- Double-acting cylinder for powered extend and retract
- Position sensors (extended/retracted)
- Flow control valves for speed regulation

**Typical Applications:** Pick-and-place systems, material handling, automated assembly

---

### 4. Sequential Control (`sequence-control.runiq`)

**Two-Cylinder Sequential Operation**

Complex sequencing circuit demonstrating:

- Two double-acting cylinders (A and B)
- Defined sequence: A+ B+ B- A- (cylinder A extends, B extends, B retracts, A retracts)
- Four proximity sensors for position detection
- Automated cycle control

**Typical Applications:** Assembly stations, packaging machines, multi-step processing

---

## Pneumatic Circuit Conventions

### Pressure Specifications

- **Operating Pressure:** 6 bar (87 psi) - Standard industrial pneumatic pressure
- **Flow Rate:** 500-1200 L/min depending on application

### Component Types

- `VALVE_3_2` - 3-port, 2-position valve
- `VALVE_5_2` - 5-port, 2-position valve
- `CYL_SA` - Single-acting cylinder
- `CYL_DA` - Double-acting cylinder
- `SENSOR_PROX` - Proximity sensor
- `VALVE_CHECK` - Check valve / flow restrictor
- `FILTER_AIR` - Compressed air filter
- `REGULATOR_PRESS` - Pressure regulator
- `LUBRICATOR` - Air line lubricator
- `GAUGE_PRESS` - Pressure gauge

### Net Naming Conventions

- `SUPPLY` - Main air supply line
- `PORT_A`, `PORT_B` - Cylinder ports
- `EXHAUST` - Exhaust to atmosphere
- `PILOT` - Pilot control signal

---

## Running Examples

To parse and validate these examples:

```bash
# From project root
pnpm cli parse examples/pneumatic/frl-unit.runiq

# Generate SVG output
pnpm cli render examples/pneumatic/cylinder-control.runiq -o output/pneumatic-cylinder.svg
```

## Standards Reference

These examples follow **ISO 1219-1** (Pneumatic fluid power — Symbols).

See `docs/ISO-1219-SYMBOL-REFERENCE.md` for complete symbol reference.
