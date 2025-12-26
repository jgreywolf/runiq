# Adding Shapes

Owner: `@jgreywolf`

Purpose: Step-by-step guide to implement, test, and register a new shape in Runiq.

Minimum acceptance criteria:

- A new shape file in `packages/core/src/shapes/` with exported `ShapeDefinition`.
- Unit tests for bounds/anchors/render placed under the package tests.
- Shape registered via `shapeRegistry` and example added to `examples/`.

Checklist:

1. Create `packages/core/src/shapes/<name>.ts` exporting `id`, `bounds()`, `anchors()`, `render()`.
2. Add unit tests and run `pnpm -w test`.
3. Add an example `examples/<category>/<name>.runiq` demonstrating usage.
4. Add shape page reference (when ready) under `docs/reference/shapes/`.

Commands:

`powershell
pnpm -w test --filter packages/core
node scripts/run-one-example.mjs examples/<category>/<name>.runiq
`

References:

- `packages/core/src/registries.ts`
- `packages/core/src/shapes` (existing shapes)
