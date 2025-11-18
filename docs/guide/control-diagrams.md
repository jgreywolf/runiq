---
title: Control Systems Diagrams
---

title: Control Systems Diagrams
description: Create hierarchical block diagrams for system architecture, signal flow, and functional decomposition.
lastUpdated: 2025-01-09

---

# Control Systems

Design control systems, signal chains, and feedback loops with readable syntax and clean SVG output. Export to LaTeX/TikZ or Simulink MDL (planned) for further analysis.

## Supported elements

- Blocks: generic processing blocks (`@rect`, `@rounded`)
- SISO components: Gain, Integrator, Summing Junction (shapes available in the catalog)
- Connectors: labeled edges with line style and color

## Example

```runiq
diagram "PI Controller" {
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
  Y -> Sum label: "feedback" lineStyle: dotted
}
```

## Layout tips

- Use `direction LR` for left-to-right signal flow
- Increase `spacing` if feedback arcs collide with labels

## Comparison with Other Tools

| Feature                      | Runiq          | Mermaid        | PlantUML       | Lucidchart  | MATLAB Simulink | LabVIEW    | Xcos           | Modelica       |
| ---------------------------- | -------------- | -------------- | -------------- | ----------- | --------------- | ---------- | -------------- | -------------- |
| **Text-based DSL**           | ✅             | ✅             | ✅             | ❌          | ⚠️ MDL          | ❌         | ⚠️ XML         | ✅             |
| **Version control friendly** | ✅             | ✅             | ✅             | ⚠️ Partial  | ⚠️ Partial      | ❌         | ⚠️ Partial     | ✅             |
| **Block diagrams**           | ✅             | ⚠️ Basic       | ⚠️ Basic       | ✅          | ✅              | ✅         | ✅             | ✅             |
| **Signal flow**              | ✅             | ⚠️ Basic       | ⚠️ Basic       | ✅          | ✅              | ✅         | ✅             | ✅             |
| **Feedback loops**           | ✅             | ⚠️ Manual      | ⚠️ Manual      | ✅          | ✅              | ✅         | ✅             | ✅             |
| **Control blocks**           | ✅             | ❌             | ❌             | ⚠️ Manual   | ✅              | ✅         | ✅             | ✅             |
| **Simulation**               | ❌             | ❌             | ❌             | ❌          | ✅              | ✅         | ✅             | ✅             |
| **Transfer functions**       | ⚠️ Labels      | ❌             | ❌             | ⚠️ Labels   | ✅              | ✅         | ✅             | ✅             |
| **Automatic layout**         | ✅             | ✅             | ✅             | ❌          | ⚠️ Limited      | ❌         | ⚠️ Limited     | ⚠️ Limited     |
| **Documentation generation** | ✅             | ✅             | ✅             | ⚠️ Partial  | ⚠️ Partial      | ⚠️ Partial | ❌             | ✅             |
| **Code generation**          | ❌             | ❌             | ❌             | ❌          | ✅              | ✅         | ⚠️ Limited     | ✅             |
| **Real-time execution**      | ❌             | ❌             | ❌             | ❌          | ✅              | ✅         | ✅             | ✅             |
| **Export formats**           | SVG, PNG       | SVG, PNG       | SVG, PNG       | Multiple    | Multiple        | Image      | Multiple       | Multiple       |
| **Learning curve**           | Low            | Low            | Medium         | Low         | High            | High       | Medium         | High           |
| **Cost**                     | Free           | Free           | Free           | Paid        | Paid            | Paid       | Free           | Free           |
| **Platform**                 | Cross-platform | Cross-platform | Cross-platform | Web/Desktop | Windows/Mac     | Windows    | Cross-platform | Cross-platform |

**Key Advantages of Runiq:**

- **Documentation-First**: Perfect for control system architecture documentation
- **Version Control**: Track control designs alongside code in Git
- **Lightweight**: Quick visualization without heavy simulation environments
- **Unified DSL**: Consistent syntax with other diagram types

**When to Use Alternatives:**

- **MATLAB Simulink**: Full simulation, analysis, and code generation for control systems
- **LabVIEW**: Hardware integration and real-time control with data acquisition
- **Modelica**: Open-standard modeling for multi-domain physical systems
- **Lucidchart**: Real-time collaboration with control engineers

## Export

- LaTeX/TikZ: Export paths suitable for papers (planned CLI)
- Simulink: Basic MDL generation (WIP)
