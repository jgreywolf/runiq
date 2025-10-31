---
title: Block Diagrams
---

# Block Diagrams

Design control systems, signal chains, and feedback loops with readable syntax and clean SVG output. Export to LaTeX/TikZ or Simulink MDL (planned) for further analysis.

## Supported elements

- Blocks: generic processing blocks (`@rect`, `@rounded`)
- SISO components: Gain, Integrator, Summing Junction (shapes available in the catalog)
- Connectors: labeled edges with line style and color

## Example

```runiq
diagram "PI Controller"
direction LR

shape Ref as @doc label: "Reference"
shape Sum as @circle label: "+/−"  // summing junction
shape C as @rect label: "Controller (PI)"
shape P as @rect label: "Plant"
shape Y as @doc label: "Output"

Ref -> Sum
Sum -> C
C -> P
P -> Y
Y -.-> Sum label: "feedback" lineStyle: dotted
```

## Styling

```runiq
style default stroke:#444 fill:#f8f8ff
edge C -> P strokeColor:#1565c0
edge Y -.-> Sum strokeColor:#2e7d32 lineStyle:dotted
```

## Layout tips

- Use `direction LR` for left-to-right signal flow
- Increase `spacing` if feedback arcs collide with labels

## Export

- LaTeX/TikZ: Export paths suitable for papers (planned CLI)
- Simulink: Basic MDL generation (WIP)
