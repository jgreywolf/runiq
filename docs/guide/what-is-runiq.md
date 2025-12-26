---
title: What is Runiq?
description: Learn about Runiq, the text-based diagramming tool that combines the simplicity of Markdown with the power of visual design.
lastUpdated: 2025-01-09
---

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

**142+ shapes** across 17 categories:

- **Actors** (8) - User representations for use case diagrams
- **Circles** (10) - Various circle styles and sizes
- **UML** (2) - Use case ovals, system boundaries
- **Data & Docs** (7) - Documents, notes, stored data
- **Data I/O** (6) - Input, output, manual input
- **Storage** (6) - Databases, cylinders, tape
- **Process** (9) - Rectangles, subroutines, loops
- **Specialized** (3) - Cloud, delay, off-page connector
- **Annotations** (3) - Comments and notes
- **Electrical** (30+) - Resistors, capacitors, transistors
- **Digital Logic** (15+) - Gates, flip-flops, multiplexers
- **And more** - AWS, quantum gates, pneumatic, hydraulic

[View all shapes →](/reference/shapes)

### 5. "Smart Art" Glyphsets (60+)

**Glyphsets** are pre-built diagram templates similar to **PowerPoint SmartArt**. Perfect for quick visualizations without manual layout:

```runiq
glyphset basicProcess "Development Pipeline" {
  step "Plan"
  step "Code"
  step "Test"
  step "Deploy"
  step "Monitor"

  theme ocean
  orientation "horizontal"
}
```

Produces a professional horizontal process flow instantly!

**6 categories** of glyphsets:

- **Process** (17) - Linear flows, cycles, alternating, stepped
- **List** (6) - Basic lists, picture lists, framed items
- **Hierarchy** (1) - Organization charts, pyramids
- **Comparison** (4) - Matrices, Venn diagrams, balances
- **Visualization** (8) - Funnels, timelines, picture grids
- **Relationship** (24) - Convergence, divergence, clusters, targets

**When to use glyphsets:**

- ✅ Quick diagrams and presentations
- ✅ Standard patterns (process flows, org charts)
- ✅ Data-driven visualizations
- ✅ Consistency across documents

**When to use diagram profiles:**

- ✅ Detailed technical diagrams
- ✅ Custom layouts and connections
- ✅ Complex relationships
- ✅ Fine-grained control

[Learn more about glyphsets →](/guide/glyphsets)

### 6. Web SDK for browsers

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

### 7. UML Relationships

Full support for UML stereotypes and line styles:

```runiq
diagram "Stereotypes" {

  A -> B stereotype: "include" lineStyle: "dashed" arrowType: open

  # Line styles: solid, dashed, dotted
  # Arrow types: standard, hollow, open, none
}
```

### 8. Hierarchical Containers

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

### 9. Electrical & Digital Circuits

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

### 10. Control system Diagrams

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

- Control system diagrams with transfer functions
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

## Comparison with Other Tools

### Text-Based & Code Tools

| Feature                   | Runiq                              | Mermaid         | PlantUML          | Graphviz      | D2            | Draw.io          |
| ------------------------- | ---------------------------------- | --------------- | ----------------- | ------------- | ------------- | ---------------- |
| **Format**                | DSL + JSON                         | Markdown        | Text              | DOT           | Text          | GUI + XML        |
| **Output**                | Pure SVG                           | SVG + HTML      | PNG/SVG           | SVG/PNG       | SVG/PNG       | SVG/PNG/XML      |
| **Layout Engine**         | ELK (5 algorithms)                 | Dagre/ELK       | GraphViz          | Built-in      | Custom        | Manual + Auto    |
| **Version Control**       | ✅ Text-based                      | ✅ Text-based   | ✅ Text-based     | ✅ Text-based | ✅ Text-based | ⚠️ XML binary    |
| **Glyphsets/SmartArt**    | ✅ 60+ templates                   | ❌              | ❌                | ❌            | ❌            | ⚠️ Limited       |
| **Shape Library**         | ✅ 142+ shapes                     | ⚠️ ~30 shapes   | ⚠️ ~50 shapes     | ⚠️ Basic      | ⚠️ ~40 shapes | ✅ Thousands     |
| **Containers**            | ✅ Full support                    | ⚠️ Limited      | ✅ Subgraphs      | ⚠️ Limited    | ✅ Yes        | ✅ Full          |
| **UML Support**           | ✅ Most types                      | ✅ Most types   | ✅ Full UML suite | ❌            | ⚠️ Basic      | ✅ Via templates |
| **Flowcharts**            | ✅ ISO 5807                        | ✅ Yes          | ✅ Yes            | ✅ Yes        | ✅ Yes        | ✅ Full          |
| **BPMN**                  | ✅ Full support                    | ⚠️ Basic        | ⚠️ Limited        | ❌            | ❌            | ✅ Full          |
| **Electrical Circuits**   | ✅ Analog + Digital                | ❌              | ❌                | ❌            | ❌            | ⚠️ Basic         |
| **Wardley Maps**          | ✅ Native                          | ⚠️ Plugin       | ❌                | ❌            | ⚠️ Manual     | ⚠️ Manual        |
| **Network Diagrams**      | ✅ Weighted, Force, Stress         | ✅ Basic        | ✅ Basic          | ✅ Strong     | ✅ Yes        | ✅ Full          |
| **Timeline/Gantt**        | ⚠️ Timeline                        | ⚠️ Gantt        | ✅ Gantt          | ❌            | ⚠️ Limited    | ✅ Gantt         |
| **Git Graphs**            | ❌                                 | ✅ Yes          | ❌                | ❌            | ❌            | ❌               |
| **User Journey**          | ❌                                 | ✅ Yes          | ❌                | ❌            | ❌            | ❌               |
| **Quadrant Charts**       | ❌                                 | ✅ Yes          | ❌                | ❌            | ❌            | ❌               |
| **Requirement Diagrams**  | ❌                                 | ✅ Yes          | ❌                | ❌            | ❌            | ❌               |
| **ZenUML**                | ❌                                 | ✅ Yes          | ❌                | ❌            | ❌            | ❌               |
| **Data Viz**              | ✅ Sankey, Pyramid, Venn           | ⚠️ Sankey, Pie  | ❌                | ❌            | ❌            | ⚠️ Charts        |
| **C4 Architecture**       | ✅ Full C4                         | ✅ Yes          | ✅ Yes            | ❌            | ✅ Yes        | ⚠️ Manual        |
| **Mind Maps**             | ✅ Radial layout                   | ✅ Yes          | ✅ Yes            | ❌            | ❌            | ✅ Yes           |
| **Deployment Diagrams**   | ❌                                 | ❌              | ✅ Yes            | ❌            | ❌            | ⚠️ Manual        |
| **Object Diagrams**       | ❌                                 | ❌              | ✅ Yes            | ❌            | ❌            | ⚠️ Manual        |
| **Timing Diagrams**       | ❌                                 | ❌              | ✅ Yes            | ❌            | ❌            | ❌               |
| **ER Diagrams**           | ✅ Crow's foot                     | ✅ Yes          | ✅ Yes            | ❌            | ⚠️ Basic      | ✅ Full          |
| **Control Systems**       | ✅ control diagrams                | ❌              | ❌                | ❌            | ❌            | ⚠️ Basic         |
| **Styling**               | ✅ Themes + inline                 | ✅ CSS + themes | ⚠️ Limited        | ⚠️ Attrs      | ✅ Strong     | ✅ Full GUI      |
| **Export Formats**        | ✅ SPICE, Verilog, LaTeX, Simulink | ❌ Code         | ❌ Code           | ❌ Code       | ❌ Code       | ⚠️ Limited       |
| **TypeScript/JavaScript** | ✅ Native                          | ✅ Yes          | ❌ Java           | ❌ C          | ❌ Go         | ✅ Web only      |
| **Browser SDK**           | ✅ @runiq/web                      | ✅ Yes          | ⚠️ Via server     | ❌            | ✅ WASM       | ✅ Embed         |
| **CLI Tool**              | ✅ Yes                             | ✅ Yes          | ✅ Yes            | ✅ Yes        | ✅ Yes        | ⚠️ Desktop       |
| **Extensibility**         | ✅ Plugin system                   | ⚠️ Limited      | ⚠️ Macros         | ❌            | ⚠️ Limited    | ✅ Plugins       |
| **Real-time Collab**      | ❌ (planned)                       | ❌              | ❌                | ❌            | ❌            | ❌               |
| **License**               | MIT                                | MIT             | GPL/Commercial    | EPL           | MPL-2.0       | Apache 2.0       |

### Visual & Commercial Tools

| Feature                 | Runiq                                | Visio         | Lucidchart    | Creately      | Gliffy      | Cacoo         |
| ----------------------- | ------------------------------------ | ------------- | ------------- | ------------- | ----------- | ------------- |
| **Editing**             | Code                                 | GUI           | GUI           | GUI           | GUI         | GUI           |
| **Pricing**             | Free (MIT)                           | $280/yr       | $7.95-20/mo   | $5-89/mo      | $8/mo       | $6-18/mo      |
| **Version Control**     | ✅ Native Git                        | ❌ Manual     | ⚠️ Built-in   | ⚠️ Built-in   | ⚠️ Cloud    | ⚠️ Cloud      |
| **Offline Mode**        | ✅ Full                              | ✅ Desktop    | ❌ Web only   | ⚠️ Limited    | ❌ Web only | ❌ Web only   |
| **Automation**          | ✅ CLI + SDK                         | ⚠️ VBA        | ⚠️ API        | ⚠️ API        | ⚠️ Limited  | ⚠️ API        |
| **Shape Library**       | ✅ 142+ shapes                       | ✅ Thousands  | ✅ Thousands  | ✅ Thousands  | ✅ Hundreds | ✅ Thousands  |
| **Templates**           | ✅ 60+ glyphsets                     | ✅ Hundreds   | ✅ Hundreds   | ✅ Hundreds   | ✅ Dozens   | ✅ Hundreds   |
| **UML**                 | ✅ 6 types                           | ✅ Full       | ✅ Full       | ✅ Full       | ✅ Full     | ✅ Full       |
| **BPMN**                | ✅ Yes                               | ✅ Full       | ✅ Full       | ✅ Full       | ✅ Yes      | ✅ Yes        |
| **Flowcharts**          | ✅ ISO 5807                          | ✅ Full       | ✅ Full       | ✅ Full       | ✅ Full     | ✅ Full       |
| **Network Diagrams**    | ✅ Yes                               | ✅ Full       | ✅ Full       | ✅ Full       | ✅ Yes      | ✅ Yes        |
| **ER Diagrams**         | ✅ Yes                               | ✅ Yes        | ✅ Yes        | ✅ Yes        | ✅ Yes      | ✅ Yes        |
| **Electrical Circuits** | ✅ SPICE + Verilog                   | ⚠️ Basic      | ⚠️ Basic      | ⚠️ Basic      | ❌          | ❌            |
| **Control Systems**     | ✅ LaTeX + Simulink                  | ❌            | ❌            | ❌            | ❌          | ❌            |
| **Code Generation**     | ✅ SPICE, Verilog, LaTeX, Simulink   | ❌            | ❌            | ❌            | ❌          | ❌            |
| **Data Import**         | ✅ JSON                              | ✅ CSV, DB    | ✅ CSV, API   | ✅ CSV        | ⚠️ Limited  | ⚠️ Limited    |
| **Real-time Collab**    | ❌ (planned)                         | ⚠️ Limited    | ✅ Yes        | ✅ Yes        | ✅ Yes      | ✅ Yes        |
| **Platform**            | Cross-platform                       | Windows/Mac   | Web           | Web           | Web         | Web           |
| **Export Formats**      | SVG, SPICE, Verilog, LaTeX, Simulink | PNG, SVG, PDF | PNG, PDF, SVG | PNG, PDF, SVG | PNG, SVG    | PNG, PDF, SVG |

### Why Choose Runiq?

**Choose Runiq if you need:**

- ✅ **Version control friendly** - Plain text, perfect for Git
- ✅ **Automation & CI/CD** - Generate diagrams in pipelines
- ✅ **Engineering exports** - SPICE netlists, Verilog HDL, LaTeX, Simulink
- ✅ **No vendor lock-in** - Open source, MIT license
- ✅ **Developer workflow** - TypeScript types, CLI tools, SDK
- ✅ **Quick diagrams** - 60+ SmartArt-style glyphsets
- ✅ **Technical diagrams** - Circuits, control systems

**Choose Mermaid if you need:**

- ✅ Markdown integration
- ✅ GitHub/GitLab native rendering
- ✅ Simple syntax for basic diagrams

**Choose PlantUML if you need:**

- ✅ Comprehensive UML suite
- ✅ Large community and examples
- ✅ Mature, stable tool

**Choose Visio/Lucidchart if you need:**

- ✅ Non-technical users
- ✅ Rich GUI editing
- ✅ Real-time collaboration
- ✅ Extensive template libraries
- ✅ Business diagrams over technical

**Choose Draw.io if you need:**

- ✅ Free GUI tool
- ✅ Desktop + web versions
- ✅ No subscription required
- ✅ Massive shape library

::: tip Future Integration
The documentation site currently uses VitePress for speed and simplicity. In the future, we plan to integrate the **SvelteKit editor** for live, interactive diagram editing directly in the docs. Stay tuned!
:::
