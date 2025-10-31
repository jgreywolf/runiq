# What is Runiq?

Runiq is a **diagram-as-code** tool that lets you create beautiful, standards-compliant diagrams using plain text.

## The Problem

Traditional diagramming tools are:

- **Not version control friendly** - Binary files, hard to diff
- **Vendor lock-in** - Proprietary formats, subscription requirements
- **Manual layout** - Click, drag, align, repeat...
- **Inconsistent** - Different styles across teams
- **Hard to automate** - No programmatic generation

## The Runiq Solution

Runiq provides:

- ✅ **Plain text format** - Easy diffs, Git-friendly
- ✅ **Two input formats** - DSL syntax + JSON (1:1 mapping)
- ✅ **Professional layouts** - Automatic with ELK layout engine
- ✅ **Pure SVG output** - Embed anywhere, no dependencies
- ✅ **Extensible** - Pluggable shapes, themes, exporters
- ✅ **Browser SDK** - Use in web apps via `@runiq/web`

## Key Features

### 1. Human-Friendly DSL

```runiq
diagram "My Process" {
  direction LR

  shape Start as @rounded label: "Start"
  shape Process as @rect label: "Process"
  shape End as @hexagon label: "End"

  Start -> Process -> End
}
```

### 2. Machine-Friendly JSON

```json
{
  "title": "My Process",
  "direction": "LR",
  "nodes": [
    { "id": "Start", "shape": "rounded", "label": "Start" },
    { "id": "Process", "shape": "rect", "label": "Process" },
    { "id": "End", "shape": "hex", "label": "End" }
  ],
  "edges": [
    { "from": "Start", "to": "Process" },
    { "from": "Process", "to": "End" }
  ]
}
```

Both produce the same diagram!

### 3. Professional Layouts

Runiq uses the **Eclipse Layout Kernel (ELK)** with 5 algorithms:

- **Layered** - Hierarchical, top-to-bottom or left-to-right
- **Force** - Physics-based, good for networks
- **Stress** - Optimization-based, minimizes edge crossings
- **Tree** - Hierarchical trees and org charts
- **Radial** - Circular layouts, good for mind maps

### 4. Rich Shape Library

**75+ shapes** across many categories:

- **Actors** (8) - User representations for use case diagrams
- **Circles** (10) - Various circle styles and sizes
- **UML** (2) - Use case ovals, system boundaries
- **Data & Docs** (7) - Documents, notes, stored data
- **Data I/O** (6) - Input, output, manual input
- **Storage** (6) - Databases, cylinders, tape
- **Process** (9) - Rectangles, subroutines, loops
- **Specialized** (3) - Cloud, delay, off-page connector
- **Annotations** (3) - Comments and notes

[View all shapes →](/reference/shapes)

### 9. Web SDK for browsers

Render Runiq DSL to SVG in the browser with a single call:

```ts
import { renderRuniqToSvg } from '@runiq/web';

const dsl = `diagram "My Diagram" {
  shape A as @rect label:"Hello"
  shape B as @rect label:"World"
  A -link-> B
}`;

const { svg } = await renderRuniqToSvg(dsl);
document.getElementById('output')!.innerHTML = svg;
```

[Try the live web demo →](/web-demo)

### 5. UML Relationships

Full support for UML stereotypes and line styles:

```runiq
diagram "Stereotypes" {

  A -> B stereotype: "include" lineStyle: dashed arrowType: open

  # Line styles: solid, dashed, dotted
  # Arrow types: standard, hollow, open, none
}
```

### 6. Hierarchical Containers

Build complex architectures:

```runiq
diagram "Containers" {
  container "Backend Services" {
    shape API as @hexagon label: "API"
    shape DB as @cylinder label: "Database"
    API -> DB
  }
}
```

Perfect for:

- C4 architecture diagrams
- BPMN processes with swim lanes
- Microservices architectures
- Multi-tier applications

### 7. Electrical & Digital Circuits

**Analog circuits** with SPICE export:

```runiq
electrical "RC Filter" {
  part R1 type:R value:"10k"
  part C1 type:C value:"1nF"
}
```

**Digital logic** with Verilog export:

```runiq
electrical "Half Adder" {
  net A, B, SUM, CARRY

  part U1 type:XOR pins:(A,B,SUM)
  part U2 type:AND pins:(A,B,CARRY)
}
```

### 8. Block Diagrams

Control systems with export to LaTeX and Simulink:

```runiq
diagram: block-diagram {
  title: "PID Controller"

  shape Kp as @gain label: "Kp"
  shape Ki as @transferFunction label: "Ki/s"
  shape Kd as @transferFunction label: "Kd·s"
}
```

## Architecture

Runiq is built as a **monorepo** with modular packages:

```
@runiq/core           # Types, shapes, registries
@runiq/parser-dsl     # Langium-based parser
@runiq/layout-base    # ELK layout adapter
@runiq/renderer-svg   # SVG rendering
@runiq/renderer-schematic # IEEE-style schematic renderer
@runiq/io-json        # JSON import/export
@runiq/web            # Browser SDK (parse→layout→render)
@runiq/export-spice   # SPICE netlist exporter
@runiq/export-verilog # Verilog HDL exporter
@runiq/export-latex   # LaTeX/TikZ exporter
@runiq/export-simulink # Simulink MDL exporter
```

## Technology Stack

- **Language**: TypeScript (strict mode)
- **Parser**: Langium (modern language engineering)
- **Layout**: Eclipse Layout Kernel (ELK 0.9.3)
- **Testing**: Vitest (1000+ tests)
- **Build**: tsup (zero-config bundler)
- **Monorepo**: pnpm workspaces

## Comparison with Other Tools

| Feature        | Runiq                       | Mermaid    | PlantUML   | Graphviz |
| -------------- | --------------------------- | ---------- | ---------- | -------- |
| **Format**     | DSL + JSON                  | Markdown   | Text       | DOT      |
| **Output**     | Pure SVG                    | SVG + HTML | PNG/SVG    | SVG/PNG  |
| **Layout**     | ELK (5 algorithms)          | Dagre      | GraphViz   | Built-in |
| **Containers** | ✅ Full support             | ⚠️ Limited | ✅         | ❌       |
| **UML**        | ✅ Stereotypes, line styles | ⚠️ Basic   | ✅ Full    | ❌       |
| **Circuits**   | ✅ SPICE, Verilog           | ❌         | ❌         | ❌       |
| **Extensible** | ✅ Plugins                  | ⚠️ Limited | ⚠️ Limited | ❌       |
| **TypeScript** | ✅ Native                   | ❌         | ❌         | ❌       |

## Philosophy

1. **Code is the source of truth** - Diagrams are generated, not drawn
2. **Plain text forever** - No binary formats, no lock-in
3. **Standards compliant** - SVG that works everywhere
4. **Extensible by design** - Build your own shapes, themes, exporters
5. **Developer experience** - Fast, typed, well-tested

## Use Cases

### Software Engineering

- Architecture diagrams (C4, microservices)
- UML diagrams (use case, class, sequence, state)
- Process flows (BPMN, flowcharts)
- Database schemas (ER diagrams)

### Control Systems

- Block diagrams with transfer functions
- PID controllers, feedback loops
- State-space models
- Export to LaTeX papers or Simulink

### Electrical Engineering

- Analog circuit design
- SPICE netlist generation
- Professional IEEE schematics
- Power supplies, filters, amplifiers

### Digital Design

- Logic circuits (gates, flip-flops)
- Verilog HDL generation
- Combinational and sequential circuits
- Truth table validation

## Next Steps

- [Getting Started →](/guide/getting-started)
- [Quick Start Tutorial →](/guide/quick-start)
- [View Examples →](/examples/)
- [Shape Reference →](/reference/shapes)

---

::: tip Future Integration
The documentation site currently uses VitePress for speed and simplicity. In the future, we plan to integrate the **SvelteKit editor** for live, interactive diagram editing directly in the docs. Stay tuned!
:::
