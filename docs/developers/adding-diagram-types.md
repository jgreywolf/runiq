````markdown
# Adding Diagram Types (Profiles)

Owner: `@jgreywolf`

Purpose: How to add a new profile (grammar + AST + renderer + examples + tests).

Full architecture reference: [ARCHITECTURE-GUIDE.md](../ARCHITECTURE-GUIDE.md)

Related developer docs: [architecture.md](architecture.md), [adding-shapes.md](adding-shapes.md)

Minimum acceptance criteria

- Grammar changes (if any) added to `packages/parser-dsl/src/runiq.langium` and Langium types regenerated.
- New AST types added to `packages/core/src/types.ts` where required.
- Renderer implemented and exported from an appropriate renderer package (usually `renderer-svg`).
- Smoke examples added to `examples/` and included in the examples metadata export.
- Unit tests for parser and renderer changes included.

High-level steps

1. Design AST: decide the AST shape and how it maps to nodes/edges/containers.
2. Update Langium grammar: edit `packages/parser-dsl/src/runiq.langium`.
3. Regenerate Langium artifacts & build:

````powershell
# Adding Diagram Types (Profiles)

Owner: `@jgreywolf`

Purpose: How to add a new profile (grammar + AST + renderer + examples + tests), plus guidance on routing profile types to the correct renderer.

See also: [architecture.md](architecture.md), [adding-shapes.md](adding-shapes.md)

Minimum acceptance criteria

- Grammar changes (if any) added to `packages/parser-dsl/src/runiq.langium` and Langium types regenerated.
- New AST types added to `packages/core/src/types.ts` where required.
- Renderer implemented and exported from an appropriate renderer package (usually `packages/renderer-svg`).
- Smoke examples added to `examples/` and included in the examples metadata export.
- Unit tests for parser and renderer changes included.

High-level steps

1. Design AST: decide the AST shape and how it maps to nodes/edges/containers.
2. Update Langium grammar: edit `packages/parser-dsl/src/runiq.langium`.
3. Regenerate Langium artifacts & build:

```powershell
cd packages\parser-dsl
pnpm run generate
cd ../../
pnpm -w build
````

4. Add/extend AST types in `packages/core/src/types.ts` and conversion helpers in `packages/parser-dsl/src/langium-parser.ts`.
5. Implement renderer: add `render<ProfileName>` in `packages/renderer-svg/src/` (or an appropriate renderer package). Keep renderer small and testable and export it from the package entrypoint.
6. Add smoke examples in `examples/<profile>/` and update examples metadata with `node scripts/export-gallery-lists.cjs`.

Profile routing guidance (why it matters)

Some profile types (sequence, timeline, wardley, pid, and schematic/profile types like `hydraulic`, `pneumatic`, `electrical`) require specialized rendering pipelines that do not conform to ELK-style node/edge layouts. Sending their AST through the ELK renderer produces runtime errors (e.g., reading `.length` of undefined). To avoid this, map each profile to the correct renderer function at the entrypoint that drives example generation and CI.

Recommended routing map

- `sequence` -> `renderSequenceDiagram(ast, opts)`
- `timeline` -> `renderTimeline(ast, opts)`
- `wardley` -> `renderWardleyMap(ast, opts)`
- `pid` -> `renderPID(ast, opts)`
- schematic types (`hydraulic`, `pneumatic`, `electrical`, etc.) -> `renderSchematic(ast, opts)`
- default / graph-like profiles -> ELK pipeline: `renderWithElk(ast, opts)`

Where to implement routing

- Example generator scripts: `scripts/run-one-example.mjs` and `scripts/generate-example-svgs.mjs` should call a single routing helper before attempting layout/render.
- The renderer package (`packages/renderer-svg`) should export the specialized render functions and a small routing helper for reuse in scripts and tests.

Example routing helper (JS/TS)

```js
// packages/renderer-svg/src/routeProfile.js
import { renderSequenceDiagram } from './sequence';
import { renderTimeline } from './timeline';
import { renderWardleyMap } from './wardley';
import { renderPID } from './pid';
import { renderSchematic } from './schematic';
import { renderWithElk } from './elk';

export function routeProfileToRenderer(profile, ast, opts) {
  switch (profile) {
    case 'sequence':
      return renderSequenceDiagram(ast, opts);
    case 'timeline':
      return renderTimeline(ast, opts);
    case 'wardley':
      return renderWardleyMap(ast, opts);
    case 'pid':
      return renderPID(ast, opts);
    case 'hydraulic':
    case 'pneumatic':
    case 'electrical':
      return renderSchematic(ast, opts);
    default:
      return renderWithElk(ast, opts);
  }
}
```

Generator script notes

- Ensure scripts call `registerDefaultShapes()` (or the runtime registration used by the app) before rendering so examples using shapes like `@gauge` or aliases resolve.
- Coerce Langium AST objects to plain JSON where necessary before layout/render (this prevents prototype/structure surprises).
- Example generator flow (high level): parse example -> coerce AST -> call `routeProfileToRenderer(profile, ast, opts)` -> write SVG output.

Testing and verification

- Add unit tests that exercise `routeProfileToRenderer` with small AST fixtures per profile type and assert that the returned output is an SVG string (or contains expected fragments), or at minimum that the renderer function runs without throwing.
- Add integration smoke tests for each new profile that run `node scripts/run-one-example.mjs examples/<profile>/<example>.runiq` and assert exit code 0 and an output file is produced.

Commands (PowerShell)

```powershell
# generate a single example SVG (diagnostic)
node .\scripts\run-one-example.mjs .\examples\pid\01-simple-tank-pump.runiq

# generate all example SVGs
node .\scripts\generate-example-svgs.mjs

# run parser generation (if you changed grammar)
cd packages\parser-dsl; pnpm run generate; cd ../../; pnpm -w build
```

PR checklist

- Update grammar & commit generated Langium artifacts if policy requires.
- Add/extend AST types and conversion helpers.
- Export the renderer(s) from `packages/renderer-svg`.
- Add smoke examples and update gallery metadata.
- Add unit & integration tests. CI must pass.

Notes and troubleshooting

- If an example fails during bulk generation, inspect the generator logs: they often indicate a profile mismatch or a renderer being used incorrectly (ELK vs specialized renderer).
- For new profile types, add routing entries early in the generator to avoid cascading failures across many examples.
- Keep renderers small and pure where possible so unit tests can run quickly.

References

- `scripts/generate-example-svgs.mjs` — bulk generator; use its routing and registration examples.
- `scripts/run-one-example.mjs` — helper for diagnostics.
- `packages/parser-dsl/src/runiq.langium` — grammar entrypoint.
- `packages/core/src/shapes/` — examples of shape implementations and runtime registration.
````
