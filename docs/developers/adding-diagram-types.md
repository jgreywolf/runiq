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

```powershell
cd packages/parser-dsl
pnpm run generate
cd ../../
pnpm -w build
```
````

4. Add/extend AST types in `packages/core/src/types.ts` and conversion helpers in `packages/parser-dsl/src/langium-parser.ts`.
5. Implement renderer: add `render<ProfileName>` in `packages/renderer-svg/src/` (or an appropriate renderer package). Keep renderer small and testable.
6. Add smoke examples in `examples/<profile>/` and update examples metadata with `node scripts/export-gallery-lists.cjs`.

Verification and tests

- Parser tests: add unit tests next to the code being tested
- Renderer tests: add unit tests in `packages/renderer-svg` that invoke the renderer with a small AST and assert no exceptions and expected output fragments.
- Integration: add a runnable example under `examples/` and confirm `node scripts/run-one-example.mjs examples/<profile>/<example>.runiq` renders.

PR/test requirements

- Parser changes must include regenerated Langium artifacts (commit `packages/parser-dsl/src/generated/*` if project policy requires).
- Add unit tests covering new grammar branches and renderer logic.
- Provide at least one example demonstrating typical usage; add to examples metadata.

Notes

- Keep grammar additive and backward-compatible where possible.
- For large profile work, split into smaller PRs: grammar & types, renderer, examples/tests.

```

```
