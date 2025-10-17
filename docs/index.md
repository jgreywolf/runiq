---
layout: home

hero:
  name: Runiq
  text: Diagram DSL with JSON Twin
  tagline: Create beautiful, standards-compliant diagrams with plain text. Two inputs, one AST, pure SVG output.
  image:
    src: /logo.svg
    alt: Runiq
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View Examples
      link: /examples/
    - theme: alt
      text: Try Online
      link: /playground

features:
  - icon: 📝
    title: Two Input Formats
    details: Human-friendly DSL syntax and 1:1 JSON format. Choose the one that fits your workflow.

  - icon: 🎨
    title: Pure SVG Output
    details: Standards-compliant SVG with no HTML hacks. Embed-safe for PowerPoint, Keynote, Google Slides.

  - icon: 🔧
    title: 54 Shapes Across 9 Categories
    details: From flowcharts to UML diagrams, electrical circuits to block diagrams.

  - icon: 🏗️
    title: Hierarchical Containers
    details: Build complex architectures with nested containers. Perfect for C4, BPMN, and microservices diagrams.

  - icon: 🔗
    title: UML Relationships
    details: Stereotypes (<<include>>, <<extend>>), line styles (solid, dashed, dotted), arrow types (standard, hollow, open).

  - icon: ⚡
    title: Professional Layouts
    details: Eclipse Layout Kernel (ELK) with 5 algorithms - layered, force, stress, tree, radial.

  - icon: 🔌
    title: Electrical & Digital Circuits
    details: SPICE netlist and Verilog HDL export. IEEE-standard schematic rendering.

  - icon: 📊
    title: Block Diagrams
    details: Control systems with transfer functions. Export to LaTeX/TikZ and Simulink.

  - icon: 🧪
    title: 705+ Tests Passing
    details: Comprehensive test coverage with TDD approach. Production-ready quality.
---

## Quick Example

```runiq
diagram "Auth Flow" direction: LR

style default fill:#f7f7ff stroke:#444
style decision fill:#fff7e6 stroke:#aa7700

shape User     as @actor   label:"Visitor"
shape Landing  as @rounded label:"Landing Page"
shape Check    as @rhombus label:"Signed up?" style:decision
shape Welcome  as @hex     label:"Welcome"

User -> Landing : visits
Landing -> Check
Check[yes] -> Welcome
Check[no]  -> Pricing : reads
```

<div style="margin: 2rem 0;">
  <img src="/examples/auth-flow.svg" alt="Auth Flow Diagram" style="max-width: 600px; margin: 0 auto; display: block;">
</div>

## Use Cases

::: info Software Engineering
Create flowcharts, sequence diagrams, use case diagrams, class diagrams, state machines, ER diagrams, and architecture diagrams with clean, readable syntax.
:::

::: info Control Systems
Design PID controllers, feedback loops, and state-space models. Export to LaTeX for papers or Simulink for simulation.
:::

::: info Electrical Engineering
Define analog circuits and export SPICE netlists for simulation. Generate professional IEEE-standard schematics.
:::

::: info Digital Design
Create logic circuits with gates (AND, OR, XOR, etc.). Export Verilog HDL for synthesis and simulation.
:::

## Why Runiq?

**Version Control Friendly** - Plain text format means easy diffs, meaningful code reviews, and full Git history.

**No Vendor Lock-in** - Open source, open format. Your diagrams belong to you, forever.

**Extensible** - Pluggable shapes, icons, layout engines, and themes. Build custom exporters and renderers.

**Standards Compliant** - Pure SVG 1.1/2.0 output. Works everywhere SVG works.

**Developer First** - Built by developers, for developers. TypeScript all the way down.

## Recent Updates

**October 17, 2025** - v0.1.0 Released! 🎉

- ✅ 54 shapes across 9 categories
- ✅ UML relationship support (stereotypes, line styles, arrow types)
- ✅ Use case diagrams with actors and system boundaries
- ✅ Block diagrams with LaTeX and Simulink export
- ✅ Hierarchical containers for complex architectures
- ✅ 705+ tests passing

[View Full Changelog →](/CHANGELOG)

## Community & Support

- [GitHub Repository](https://github.com/jgreywolf/runiq)
- [Report Issues](https://github.com/jgreywolf/runiq/issues)
- [Contribute](https://github.com/jgreywolf/runiq/pulls)
- [Discussions](https://github.com/jgreywolf/runiq/discussions)

---

<div style="text-align: center; margin-top: 3rem; color: #666;">
  Built with ❤️ using Test-Driven Development
</div>
