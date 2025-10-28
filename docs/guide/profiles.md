---
title: Profiles
---

# Profiles: Diagram vs Schematic

Runiq supports two primary profiles:

- Diagram profile: general-purpose diagrams (flowcharts, UML, architecture, block diagrams, mind maps, org, etc.). You can freely mix any supported shapes in a single diagram.
- Schematic profile: schematic diagrams rendered with IEEE-style symbols and electrical rules. This profile unlocks exporters like SPICE and Verilog.

Most syntax is shared across profiles. The key differences are:

- Shape set and rendering style for schematic symbols
- Exporters available (SPICE/Verilog for schematic)
- Some layout defaults (e.g., orthogonal wiring)

To use the diagram profile (default):

```runiq
diagram "Mixed Diagram" direction: LR

shape Start as @terminator label:"Start"
shape Amp   as @amp        label:"Amplifier"
shape Box   as @rounded    label:"UI Screen"

Start -> Amp
Amp   -> Box
```

To use the schematic profile:

```runiq
schematic "Simple RC" direction: LR

shape V1 as @voltage-source label:"5V"
shape R1 as @resistor       label:"1kΩ"
shape C1 as @capacitor      label:"10µF"

V1 -> R1 -> C1
```

See the Reference for the full shape catalog and DSL syntax.
