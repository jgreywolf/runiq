---
title: Electrical Circuits
description: Design electrical circuits with resistors, capacitors, inductors, voltage sources, and export to SPICE netlists for simulation.
lastUpdated: 2025-01-09
---

# Electrical Circuits

Draw IEEE-style schematics and export SPICE netlists for simulation. Runiq supports common components, net naming, and multiple analysis types.

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

## Examples

- RC Lowpass, Voltage Divider, Op-amp Amplifier, RLC Resonant
- See: `/examples/electrical`
