---
title: Electrical Circuits
description: Design electrical circuits with resistors, capacitors, inductors, voltage sources, and export to SPICE netlists for simulation.
lastUpdated: 2025-01-09
---

# Electrical Circuits

Use the `electrical` profile to draw IEEE-style schematics and export SPICE netlists for simulation. Runiq supports common components, net naming, and multiple analysis types.

## Components

- Passive: R, L, C
- Sources: V (voltage), I (current)
- Diodes and Transistors: D, Q (BJT), M (MOSFET)
- Op-amp: OPAMP (symbolic)

Example:

```runiq
electrical "RC Lowpass Filter" {
	net IN, OUT, GND
	part V1 type:V source:"SIN(0 1 1k)" pins:(IN,GND)
	part R1 type:R value:"10k" pins:(IN,OUT)
	part C1 type:C value:"1n" pins:(OUT,GND)
	analysis tran "0 5m"
}
```

## Net naming

- Always define a reference node, e.g., `GND`
- Use descriptive names: `VCC`, `VIN`, `VOUT`

## Analysis types

- `op`: DC operating point
- `tran`: Transient (time-domain)
- `ac`: Frequency response (Bode)
- `dc`: Parameter sweeps

```runiq
analysis op
analysis tran "0 10m"
analysis ac "dec 50 100 10k"
analysis dc "VIN 0 10 0.1"
```

## Value suffixes

Standard SPICE suffixes: f, p, n, u, m, k, Meg, G

## Export

- CLI (planned): `runiq circuit.runiq --export spice -o circuit.cir`
- API: `io-json` and renderer hooks for SPICE

## Comparison with Other Tools

| Feature                      | Runiq                     | Mermaid | PlantUML | Lucidchart         | Draw.io       | LTspice          | KiCad            |
| ---------------------------- | ------------------------- | ------- | -------- | ------------------ | ------------- | ---------------- | ---------------- |
| **Text-Based DSL**           | ✅                        | ❌      | ❌       | ❌(GUI)            | ❌(GUI)       | ⚠️ Netlist only  | ❌(GUI)          |
| **Version Control Friendly** | ✅                        | ❌      | ❌       | ⚠️ Limited         | ⚠️ Limited    | ⚠️ Netlist only  | ⚠️ Complex files |
| **Automatic Layout**         | ✅ ELK                    | ❌      | ❌       | ⚠️ Manual          | ⚠️ Manual     | ⚠️ Manual        | ⚠️ Manual        |
| **IEEE Standard Symbols**    | ✅                        | ❌      | ❌       | ✅                 | ✅            | ✅               | ✅               |
| **SPICE Export**             | ✅ Native netlist         | ❌      | ❌       | ❌                 | ❌            | ✅               | ✅               |
| **Circuit Simulation**       | ⚠️ Via SPICE export       | ❌      | ❌       | ❌                 | ❌            | ✅ Built-in      | ⚠️ Via ngspice   |
| **Component Library**        | ✅ R, L, C, V, I, D, Q, M | ❌      | ❌       | ✅ Extensive       | ✅ Extensive  | ✅ Extensive     | ✅ Massive       |
| **Analysis Types**           | ✅ op, tran, ac, dc       | ❌      | ❌       | ❌                 | ❌            | ✅ All types     | ✅ All types     |
| **Net Naming**               | ✅ Descriptive names      | ❌      | ❌       | ✅ Manual          | ✅ Manual     | ✅ Node numbers  | ✅ Net names     |
| **PCB Design**               | ❌                        | ❌      | ❌       | ⚠️ Basic           | ⚠️ Basic      | ❌               | ✅ support       |
| **Schematic Capture**        | ✅ Text-based             | ❌      | ❌       | ✅ GUI             | ✅ GUI        | ✅ GUI           | ✅ GUI           |
| **Export Formats**           | ✅ SVG, PNG, SPICE        | ❌      | ❌       | ✅ Many formats    | ✅ Many       | ✅ PNG, PDF      | ✅ Many          |
| **Collaboration**            | ✅ Git-based              | ❌      | ❌       | ✅ Cloud (Paid)    | ✅ Cloud      | ❌ Desktop-based | ✅ Git-friendly  |
| **Learning Curve**           | ⚠️ Moderate (DSL)         | ❌      | ❌       | ✅ Low (GUI)       | ✅ Low        | ⚠️ Moderate      | ❌ High          |
| **Open Source**              | ✅ MIT License            | ✅ MIT  | ✅ GPL   | ❌ Commercial only | ✅ Apache 2.0 | ⚠️ Freeware      | ✅ GPL           |

**Runiq Advantages:**

- **Text-based schematic design** - Version control friendly, perfect for documentation
- **SPICE netlist export** - Seamless integration with simulation tools
- **Unified language** - Combine electrical schematics with block diagrams, flowcharts, and more
- **IEEE standard symbols** - Professional circuit notation
- **Net naming** - Descriptive names instead of node numbers
- **Auto-layout** - ELK engine for clean circuit layouts
- **Documentation focus** - Ideal for papers, tutorials, educational materials

**Use LTspice/KiCad when:**

- You need interactive simulation with waveform viewing
- PCB design is required
- Working with complex component libraries (thousands of parts)
- Professional EDA workflow needed

## Examples

- RC Lowpass, Voltage Divider, Op-amp Amplifier, RLC Resonant
- See: `/examples/electrical`
