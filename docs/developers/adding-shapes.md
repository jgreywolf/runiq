# Adding Shapes

````markdown
# Adding Shapes

Owner: `@jgreywolf`

Purpose: Step-by-step guide to implement, test, and register a new shape in Runiq.

See the full architecture guide for broader context: [ARCHITECTURE-GUIDE.md](../ARCHITECTURE-GUIDE.md)

Related developer docs: [architecture.md](architecture.md), [adding-diagram-types.md](adding-diagram-types.md)

Minimum acceptance criteria

- A new shape file in `packages/core/src/shapes/` exporting a `ShapeDefinition`.
- Unit tests covering `id`, `bounds()`, `anchors()` and `render()` behavior.
- The shape is registered (via `registerDefaultShapes` or a dedicated register function) and an example is added to `examples/`.

Recommended checklist

1. Create `packages/core/src/shapes/<category>/<name>.ts` and export a `ShapeDefinition` with:
   - `id` (unique)
   - `bounds(ctx)` — deterministic size calculation
   - `anchors(ctx)` — 4-point system (top, right, bottom, left)
   - `render(ctx, position)` — returns SVG markup string
2. Add unit tests in `packages/core/src/shapes/<category>/<name>.spec.ts` verifying:
   - `id` equals the expected string
   - `bounds()` returns expected width/height for sample inputs
   - `anchors()` includes four anchor points with stable coordinates
   - `render()` returns valid SVG fragments (string contains expected elements)
3. Add an example `examples/<category>/<name>.runiq` demonstrating common usage and edge cases.
4. Register the shape in `packages/core/src/shapes/index.ts` using the existing registration grouping (e.g., `registerBasicShapes()`), or add a new `registerXxxShapes()` and export it.
5. Run tests and examples locally:

```powershell
pnpm --filter @runiq/core test
node scripts/run-one-example.mjs examples/<category>/<name>.runiq
```
````

Testing expectations for PRs

- Unit tests: Every new shape must include unit tests; PRs that add shapes must have all new tests passing.
- Coverage and style: Keep changes small; follow existing style and avoid `any` types.
- Visual checks: If the shape affects renderer output, include a Playwright visual snapshot or at least provide rendered SVG sample in the PR description.

Notes

- We intentionally do not require a separate per-shape canonical docs page for every shape. Add docs only when the shape is complex or widely reused.
- Keep shapes focused and well-tested; prefer composition (glyphsets) over many near-duplicate shapes.

If a shape or example references an SVG that is missing from `examples/`, consult [Missing Documentation Assets](missing-assets.md) for the remediation workflow.

References

- `packages/core/src/registries.ts`
- `packages/core/src/shapes/` (existing shapes)

```

```
