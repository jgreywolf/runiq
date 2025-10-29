---
title: Profiles
---

# Profiles: Diagram, Schematic, and Wardley

Runiq supports three primary profiles:

- **Diagram profile**: General-purpose diagrams (flowcharts, UML, architecture, block diagrams, mind maps, org charts, etc.). You can freely mix any supported shapes in a single diagram.
- **Schematic profile**: Technical schematics rendered with IEEE-style symbols and electrical rules. This profile unlocks exporters like SPICE and Verilog.
- **Wardley profile**: Strategic mapping with 2D axes (Evolution × Value Chain) for business analysis and technology planning.

Most syntax is shared across profiles. The key differences are:

- Shape set and rendering style
- Positioning system (auto-layout vs. manual coordinates)
- Exporters available (SPICE/Verilog for schematic, SVG for all)
- Layout defaults (e.g., orthogonal wiring for schematics)

## Diagram Profile (Default)

To use the diagram profile (default):

```runiq
diagram "Mixed Diagram" direction: LR

shape Start as @terminator label:"Start"
shape Amp   as @amp        label:"Amplifier"
shape Box   as @rounded    label:"UI Screen"

Start -> Amp
Amp   -> Box
```

## Schematic Profile

To use the schematic profile:

```runiq
schematic "Simple RC" direction: LR

shape V1 as @voltage-source label:"5V"
shape R1 as @resistor       label:"1kΩ"
shape C1 as @capacitor      label:"10µF"

V1 -> R1 -> C1
```

## Wardley Profile

To use the Wardley profile for strategic mapping:

```runiq
wardley "Strategic Map"

anchor "User Need" value:0.95

component "Visible Service" evolution:0.75 value:0.85
component "Infrastructure" evolution:0.95 value:0.3

dependency from:"Visible Service" to:"Infrastructure"
```

**Key Differences:**
- Uses 2D coordinate system (evolution: 0-1, value: 0-1)
- Manual positioning (no auto-layout)
- Different syntax: `component`, `dependency`, `anchor`, `evolve`
- Rendered with strategic mapping visuals (grid, axes, evolution arrows)

See [Wardley Maps Examples](/examples/wardley-maps) for detailed documentation.

---

See the Reference for the full shape catalog and DSL syntax.
