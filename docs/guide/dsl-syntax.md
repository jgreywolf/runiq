---
title: DSL Syntax Reference
description: Reference for the Runiq diagram DSL — declarations, shapes, edges, containers, and styles.
lastUpdated: 2025-12-22
---

# DSL Syntax Reference

This page documents the core Runiq DSL constructs used to author diagrams: `diagram` declarations, shapes, edges, containers, and styling options. Examples are runnable in the editor.

## Basic diagram

The top-level construct is a `diagram` block which contains shapes, edges, containers, and directives.

```runiq
diagram "Simple" {
  theme professional
  direction LR

  shape A as @rect label: "Start"
  shape B as @rect label: "End"

  A -> B
}
```

- `theme` and `direction` are optional diagram-level directives.
- `direction` accepts `LR` (left→right), `TB` (top→bottom), `RL`, `BT`.

## Shapes

Create shapes with the `shape` keyword. Each shape has an identifier, a shape type (by alias), and optional properties.

Syntax:

```runiq
shape <Id> as @<shapeId> [label: "..."] [width: 120] [height: 80] [style: { ... }]
```

Examples:

```runiq
shape node1 as @rect label: "Process"
shape node2 as @rounded label: "Decision" width: 160
shape iconNode as @rect label: "fa:fa-rocket Launch"  # inline icon example
```

Notes:

- Shape aliases like `@rect`, `@rounded`, `@rhombus`, `@hexagon` are defined in the shape registry.
- The `label` supports plain text and escaped characters. Newlines are supported using `\n`.
- Inline icon syntax is supported by the renderer: prefix an icon provider, e.g. `fa:fa-rocket`.

## Labels and alignment

Labels can be aligned using `textAlign` or by using layout helpers in shape properties.

```runiq
shape leftLabel as @rect label: "Left aligned" textAlign: left
shape centerLabel as @rect label: "Center" textAlign: center
```

The renderer maps `textAlign` to the appropriate SVG `text-anchor` and adjusts positioning for non-center anchors.

## Edges

Edges connect shapes. Basic arrow syntax:

```runiq
A -> B            # A to B (default arrow)
A -label-> B      # labeled edge
A -dashed-> B     # style alias
A <-> B           # bidirectional
```

Edge options (inline):

```runiq
A - label: "ok", style: { strokeDasharray: "4 2", stroke: "#333" } -> B
```

Runiq supports orthogonal routing by default for many layouts; you can influence routing with layout directives or by adding explicit waypoints in advanced cases.

## Containers

Containers group shapes and influence layout. Use `container` or `pool` (BPMN swimlane) constructs.

```runiq
container Services {
  shape svc1 as @rect label: "Service A"
  shape svc2 as @rect label: "Service B"
}

pool Sales {
  lane Frontend {
    shape web as @rect label: "Web"
  }
  lane Backend {
    shape api as @rect label: "API"
  }
}
```

Container styling and sizing are controlled by the layout engine; swimlane/pool widths are normalized for consistent visuals.

## Styling

Styles can be provided inline using `style: { ... }` or via named themes.

Supported style properties (partial):

- `fill`: fill color (e.g. `#fff`, `rgba(0,0,0,0.1)`)
- `stroke`: stroke color
- `strokeWidth`: numeric
- `strokeDasharray`: dashed/dotted borders (e.g. "4 2")
- `fontSize`, `fontFamily`, `fontWeight`
- `padding`, `margin`

Examples:

```runiq
shape styled as @rect label: "Note" style: { fillColor: "#fff3cd", stroke: "#ffc107", strokeDasharray: "3 2" }
```

Theme usage example:

```runiq
diagram "Themed" {
  theme ocean

  shape A as @rect label: "A"
  shape B as @rect label: "B"
  A -> B
}
```

## Advanced features

- Inline icons: `label: "fa:fa-user Name"` — renderer-aware icons are prefixed before the text.
- Multiline labels: include `\n` in the `label` string; renderer will create `tspan`s.
- Programmatic rendering: parse → layout → render pipeline is available through the packages:
  - `@runiq/parser-dsl` (parsing)
  - `@runiq/layout-base` (ELK adapter and layout options)
  - `@runiq/renderer-svg` (SVG rendering)

### Example: full flow (code)

```ts
import { parse } from '@runiq/parser-dsl';
import { layoutDiagram } from '@runiq/layout-base';
import { renderSvg } from '@runiq/renderer-svg';

const dsl = `diagram Test { shape A as @rect label: "A" shape B as @rect label: "B" A -> B }`;
const parsed = parse(dsl);
const diagram = parsed.document!.diagrams[0];
const layout = await layoutDiagram(diagram, { direction: 'LR' });
const svg = renderSvg(diagram, layout).svg;
```

## Comments and metadata

- Single-line comments use `//`.
- Files may include front-matter for docs examples when used in the gallery.

## Troubleshooting

- Parser errors: run `pnpm -w build` and check Langium artifacts in `packages/parser-dsl`.
- Label clipping: prefer using `width`/`height` on shapes or use `wrap` helpers in specific shapes (e.g., `@note`).

## Reference quick table

- `diagram`: container for a diagram
- `shape`: create a node
- `edge` / `->` / `<-` / `<->`: connectors
- `container`, `pool`, `lane`: grouping constructs
- `style`: inline styles or themes

---

For examples and deeper rules, see `docs/guide/diagram-types` and the generated `docs/shapes` catalog.
