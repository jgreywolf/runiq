---
title: Electrical Circuits
description: Design electrical circuits with standard schematic symbols, passive and active components, switches, indicators, and SPICE-oriented analysis statements.
lastUpdated: 2025-01-09
---

# Electrical Circuits

Use the `electrical` profile to draw IEEE-style schematics and export SPICE netlists for simulation. Runiq supports common passive and active components, switching and protection primitives, descriptive net naming, and multiple analysis types.

## Components

- Passive: `R`, `L`, `C`
- Sources: `V`, `I`, `BATTERY`
- Protection and switching: `FUSE`, `SW_SPST`, `SW_SPDT`
- Indicators and interconnect: `LAMP`, `LED`, `GND`, `JUNCTION`
- Diodes and transistors: `D`, `Q_NPN`, `Q_PNP`, `M_NMOS`, `M_PMOS`
- Analog and magnetic: `OPAMP`, `XFMR`

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

## Common Building Blocks

### Battery, Fuse, and Switch

```runiq
electrical "Battery Powered Lamp" {
	net POS, SW, LOAD, GND

	part B1 type:BATTERY value:"9V" pins:(GND,POS)
	part F1 type:FUSE value:"1A" pins:(POS,SW)
	part S1 type:SW_SPST pins:(SW,LOAD)
	part L1 type:LAMP value:"9V" pins:(LOAD,GND)

	analysis op
}
```

### Source Selection with SPDT

```runiq
electrical "Source Selector" {
	net COMMON, SRC_A, SRC_B, GND

	part V1 type:V value:"5" pins:(SRC_A,GND)
	part B1 type:BATTERY value:"9V" pins:(GND,SRC_B)
	part S1 type:SW_SPDT pins:(COMMON,SRC_A,SRC_B)
	part LOAD1 type:R value:"1k" pins:(COMMON,GND)

	analysis dc
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

| Feature                      | Runiq                     | Lucidchart         | Draw.io       | LTspice          | KiCad            |
| ---------------------------- | ------------------------- | ------------------ | ------------- | ---------------- | ---------------- |
| **Text-Based DSL**           | ?                        | ? GUI             | ? GUI        | ?? Netlist only  | ? GUI           |
| **Version Control Friendly** | ?                        | ?? Limited         | ?? Limited    | ?? Netlist only  | ?? Complex files |
| **Automatic Layout**         | ? ELK                    | ?? Manual          | ?? Manual     | ?? Manual        | ?? Manual        |
| **IEEE Standard Symbols**    | ?                        | ?                 | ?            | ?               | ?               |
| **SPICE Export**             | ? Native netlist         | ?                 | ?            | ?               | ?               |
| **Circuit Simulation**       | ?? Via SPICE export       | ?                 | ?            | ? Built-in      | ?? Via ngspice   |
| **Component Library**        | ? R, L, C, V, I, Battery, Fuse, Switches, Lamps, D, Q, M | ? Extensive       | ? Extensive  | ? Extensive     | ? Massive       |
| **Analysis Types**           | ? op, tran, ac, dc       | ?                 | ?            | ? All types     | ? All types     |
| **Net Naming**               | ? Descriptive names      | ? Manual          | ? Manual     | ? Node numbers  | ? Net names     |
| **PCB Design**               | ?                        | ?? Basic           | ?? Basic      | ?               | ? Full support  |
| **Schematic Capture**        | ? Text-based             | ? GUI             | ? GUI        | ? GUI           | ? GUI           |
| **Export Formats**           | ? SVG, PNG, SPICE        | ? Many formats    | ? Many       | ? PNG, PDF      | ? Many          |
| **Collaboration**            | ? Git-based              | ? Cloud (Paid)    | ? Cloud      | ? Desktop-based | ? Git-friendly  |
| **Learning Curve**           | ?? Moderate (DSL)         | ? Low (GUI)       | ? Low        | ?? Moderate      | ? High          |
| **Open Source**              | ? MIT License            | ? Commercial only | ? Apache 2.0 | ?? Freeware      | ? GPL           |

**Key Advantages of Runiq:**

- **Text-based schematic design** - Version control friendly, perfect for documentation
- **SPICE netlist export** - Seamless integration with simulation tools
- **Unified language** - Combine electrical schematics with block diagrams, flowcharts, and more
- **IEEE-style standard symbols** - Professional circuit notation for common schematic primitives
- **Net naming** - Descriptive names instead of node numbers
- **Auto-layout** - ELK engine for clean circuit layouts
- **Documentation focus** - Ideal for papers, tutorials, educational materials

**When to Use Alternatives:**

- **LTspice**: Interactive simulation with waveform analysis and deeper SPICE workflows
- **KiCad**: Schematic capture tied directly to PCB design and manufacturing workflows
- **Lucidchart / Draw.io**: GUI-first documentation for simpler visual communication with non-EDA users

## Examples

- RC Lowpass, Voltage Divider, Op-amp Amplifier, RLC Resonant, fused battery circuits
- See: `/examples/electrical`
