# DSL Syntax Reference

This reference summarizes the core Runiq DSL constructs used in examples and docs. It focuses on the syntax you will most commonly use when creating diagrams, examples, and documentation.

Diagram declaration

- Basic form:

```runiq
diagram Name [profile] {
  // body: nodes, edges, containers, shapes, properties
}
```

- `profile` is optional (examples: `sequence`, `timeline`, `pid`, `hydraulic`, `pneumatic`, `wardley`). When present it selects a renderer and a profile-specific AST shape.

Nodes / shapes

- Create a simple node:

```runiq
node n1 as @rectangle label:"Hello"
```

- Pieces:
  - `node` or `shape` keyword (examples use `node`) followed by an identifier (e.g., `n1`).
  - `as @shapeId` picks a shape from the shape registry (e.g., `@rectangle`, `@server`, `@gauge`).
  - Optional `label:"..."` and other properties can be provided inline.

Edges

- Basic edge form:

```runiq
n1 -> n2 label:"calls"
```

- Variants may support styles, arrow heads, anchors, and labels. Use explicit anchor syntax if supported by the renderer (see specific guide pages for `renderSequenceDiagram` and `renderSvg`).

Containers

- Group nodes inside a container/block:

```runiq
container c1 as @box label:"Subsystem" {
  node a as @rectangle
  node b as @rectangle
}
```

Profiles & specialized constructs

- Certain profiles define custom top-level keys and block types. Examples:
  - `sequence` profiles declare `lifelines`, `messages`, `notes` and are rendered by `renderSequenceDiagram`.
  - `timeline` profiles declare `events` with `time` properties and are rendered by `renderTimeline`.
  - `pid` profiles include `equipment`, `instruments`, `lines`, `loops`, and `processSpecs` and are rendered by `renderPID` (see `examples/pid/*`).
  - `hydraulic`/`pneumatic`/`electrical` profiles are schematic-style and are rendered by `renderSchematic` (use `parts`/`nets` style data).

Properties & styles

- Inline properties use `key:value` or `key:"string"` syntax. Examples:

```runiq
node pump as @pump label:"P-101" flowRate:50 flowRateUnit:"m³/h"
```

- Styles (colors, stroke, fill, font) may be applied via a `style` block or inline attributes depending on the shape's API. See `docs/guide/cookbook` for style patterns.

IDs and tokens

- The parser supports flexible identifiers (`FlexibleID`) used for glyphsets, parts and many keys. This allows identifiers with dashes, underscores, and short tokens. If you modify grammar, update `packages/parser-dsl/src/runiq.langium` and regenerate artifacts.

AST / runtime shape notes

- Before layout/render the parser produces an AST. For most node/edge diagrams, the layout engine expects `nodes` and `edges` arrays.
- Profile-specific AST shapes (example for `pid`) include keys such as:

```json
{
  "type": "pid",
  "name": "...",
  "equipment": [...],
  "instruments": [...],
  "lines": [...],
  "loops": [...],
  "processSpecs": [...]
}
```

- Sequence/timeline/wardley/pid/schematic profiles are routed to specialized renderers in `scripts/generate-example-svgs.mjs`. Avoid sending those ASTs through ELK layout; instead use the profile renderer.

Best practices

- Use `@shapeId` rather than ad-hoc geometry when possible; shapes are themeable and consistent across renderers.
- Keep semantics of profile types intact: use `pid` blocks for process diagrams, `sequence` blocks for interaction flows, etc.
- When adding new shapes, register them via `registerDefaultShapes()` for headless scripts used by the docs generator.

Troubleshooting

- If an example fails during bulk generation with a `.length` TypeError, check whether the diagram was routed to ELK but lacks `nodes`/`edges` (common symptom when a profile-specific AST was sent to ELK). Update `scripts/generate-example-svgs.mjs` to route the profile to the correct renderer.
- If a glyphset or part identifier doesn't parse, check `FlexibleID` handling in `packages/parser-dsl/src/runiq.langium`.

Further reading

- See `packages/parser-dsl/src/runiq.langium` for concrete grammar rules.
- See `docs/guide/recent-code-changes.md` for renderer routing mappings and developer commands.

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
