# Documentation Audit Checklist

This file tracks the documentation cleanup needed before the next focused Studio pass.

## Goals

- Make supported features discoverable and accurate
- Keep profile pages structurally consistent
- Remove duplicate sections
- Keep tool comparisons apples-to-apples
- Avoid claiming unsupported behavior
- Improve sidebar grouping so related profiles are easier to find

## Standard Profile Page Structure

For profile-oriented guide pages, prefer this order where it fits:

1. `Overview`
2. `Key Shapes` or `Core Concepts`
3. `Basic Syntax` or `Quick Start`
4. `Examples`
5. `Advanced Features`
6. `Best Practices`
7. `Limitations` if needed
8. `Comparison with Other Tools`
9. `Related` / `Resources`

Not every page needs every section, but pages covering a full profile should generally follow this order.

## Comparison Rules

- Compare only against tools that solve the same problem space.
- Do not compare Mermaid or PlantUML against schematic/circuit profiles where they are not true peers.
- Prefer comparing circuit profiles against:
  - LTspice
  - KiCad
  - FluidSIM
  - Automation Studio
  - Logisim
  - Quartus
  - Vivado
- Prefer comparing UML-style profiles against:
  - Mermaid
  - PlantUML
  - Enterprise Architect
  - Visual Paradigm
  - Lucidchart
  - Draw.io
- Prefer comparing specialized strategy/business profiles against their actual niche tools.

## First-Pass Findings

### Supported Features That Must Be Reflected Clearly

- Node `link:` and `tooltip:` support already exists
- Markdown label rendering now supports:
  - `**bold**`
  - `*italic*`
  - `` `code` ``
- Class diagrams already support:
  - generic type parameters
  - default attribute values
  - tuple-friendly method signatures
  - member-level edges
  - lollipop/socket interface shapes
  - attribute cardinalities

### Pages With Structural Issues

- `docs/guide/class-diagrams.md`
  - supported features needed clearer coverage
  - contains mojibake in some stereotype examples
- `docs/guide/pneumatic-circuits.md`
  - alternatives section mentioned Mermaid/PlantUML even though they are not real peers

### Pages To Review Next For Comparison Accuracy

- `docs/guide/electrical.md`
- `docs/guide/hydraulic-circuits.md`
- `docs/guide/pid-diagrams.md`
- `docs/guide/network-diagrams.md`
- `docs/guide/quantum-circuits.md`
- `docs/guide/weighted-graphs.md`
- `docs/guide/charts.md`
- `docs/guide/glyphsets.md`

### Pages To Review Next For Consistency

- `docs/guide/activity-diagrams.md`
- `docs/guide/bpmn-diagrams.md`
- `docs/guide/component-diagrams.md`
- `docs/guide/erd-diagrams.md`
- `docs/guide/flowcharts.md`
- `docs/guide/mindmap-diagrams.md`
- `docs/guide/state-machine-diagrams.md`
- `docs/guide/use-case-diagrams.md`
- `docs/guide/wardley-maps.md`

## Progress

- [x] Add class-diagram docs for lollipop/socket aliases
- [x] Add class-diagram docs for member-level connections
- [x] Add class-diagram docs for tuple method signatures
- [x] Add class-diagram docs for attribute cardinalities and defaults
- [x] Remove Mermaid/PlantUML mention from pneumatic alternatives
- [x] Remove Mermaid/PlantUML mention from digital alternatives
- [x] Remove duplicate comparison section from sequence diagrams
- [x] Normalize comparison tables for touched circuit/schematic pages
- [x] Improve sidebar grouping for guide navigation
- [x] Normalize section ordering for the major UML/profile pages touched in this pass
- [x] Fix mojibake in the major touched guide pages
- [x] Normalize long-tail comparison sections for charts, network diagrams, and quantum circuits
- [x] Normalize legacy comparison wording in AWS, ERD, and C4 guides
