---
title: Profiles
---

# Profiles: Diagram, Schematic, Wardley, and Sequence

Runiq supports four primary profiles:

- **Diagram profile**: General-purpose diagrams (flowcharts, UML, architecture, block diagrams, mind maps, org charts, etc.). You can freely mix any supported shapes in a single diagram.
- **Electrical profile**: Technical schematics rendered with IEEE-style symbols and electrical rules. This profile unlocks exporters like SPICE and Verilog.
- **Wardley profile**: Strategic mapping with 2D axes (Evolution × Value Chain) for business analysis and technology planning.
- **Sequence profile**: UML sequence diagrams showing interactions between participants over time. Perfect for documenting API flows, authentication sequences, and system interactions.

Most syntax is shared across profiles. The key differences are:

- Shape set and rendering style
- Positioning system (auto-layout vs. manual coordinates)
- Exporters available (SPICE/Verilog for electrical, SVG for all)
- Layout defaults (e.g., orthogonal wiring for electrical)

## Diagram Profile (Default)

To use the diagram profile (default):

```runiq
diagram "Mixed Diagram" {
  direction LR

  shape Start as @terminator label:"Start"
  shape Amp   as @gain       label:"Amplifier"
  shape Box   as @rounded    label:"UI Screen"

  Start -> Amp
  Amp   -> Box
}
```

## electrical Profile

To use the electrical profile:

```runiq
electrical"LED Circuit" {
  net VCC, GND, N1

  part V1 type:V value:"5V" pins:(VCC,GND)
  part R1 type:R value:"220" pins:(VCC,N1)
  part D1 type:LED pins:(N1,GND)
  part GND1 type:GND pins:(GND)
}
```

## Wardley Profile

To use the Wardley profile for strategic mapping:

```runiq
wardley "Strategic Map"{

  anchor "User Need" value:0.95

  component "Visible Service" evolution:0.75 value:0.85
  component "Infrastructure" evolution:0.95 value:0.3

  dependency from:"Visible Service" to:"Infrastructure"
}
```

**Key Differences:**

- Uses 2D coordinate system (evolution: 0-1, value: 0-1)
- Manual positioning (no auto-layout)
- Different syntax: `component`, `dependency`, `anchor`, `evolve`
- Rendered with strategic mapping visuals (grid, axes, evolution arrows)

See [Wardley Maps Examples](/examples/wardley-maps) for detailed documentation.

## Sequence Profile

To use the Sequence profile for interaction diagrams:

```runiq
sequence "User Login" {
  participant "User" as actor
  participant "Web App" as boundary
  participant "Auth Service" as control
  participant "Database" as database

  message from:"User" to:"Web App" label:"Enter credentials" type:sync
  message from:"Web App" to:"Auth Service" label:"Validate" type:sync activate:true
  message from:"Auth Service" to:"Database" label:"Query user" type:sync
  message from:"Database" to:"Auth Service" label:"User data" type:return
  message from:"Auth Service" to:"Web App" label:"Auth token" type:return
  message from:"Web App" to:"User" label:"Success" type:return
}
```

**Key Differences:**

- Timeline-based layout (time flows top to bottom)
- Uses participants instead of nodes: `participant "Name" as type`
- Messages instead of edges: `message from:"A" to:"B" label:"Text" type:sync`
- Supports fragments for control flow: `fragment loop "Retry" from:0 to:3`
- Rendered with lifelines, activation boxes, and UML-style arrows

See [Sequence Diagrams Examples](/examples/sequence-diagrams) for detailed documentation.

---

See the Reference for the full shape catalog and DSL syntax.
