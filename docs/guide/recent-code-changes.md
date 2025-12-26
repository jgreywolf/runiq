# Recent Code Changes (Dec 2025)

This short guide documents recent engineering changes that affect example generation, parser behavior, and shape compatibility. It's intended for docs authors and maintainers who need to keep guides and examples accurate.

What changed

- Shapes: `gauge` and `monitor` added to `packages/core/src/shapes/` to restore missing examples.
- Aliases: legacy aliases added in `packages/core/src/shape-aliases.ts` so older example DSLs still work.
- Parser: `packages/parser-dsl/src/runiq.langium` updated to accept more flexible IDs (`FlexibleID`) used in glyphsets and parts. If you edit grammar, regenerate Langium artifacts.
- Generator scripts: `scripts/run-one-example.mjs` and `scripts/generate-example-svgs.mjs` were hardened to:
  - Strip Markdown fences from `.runiq` files
  - Call `registerDefaultShapes()` before layout/render
  - Coerce the Langium AST to plain JSON before layout/render
  - Route profile types to dedicated renderers (see mapping below)

Renderer routing (important)

- `sequence` → `renderSequenceDiagram` (packages/renderer-svg)
- `timeline` → `renderTimeline` (packages/renderer-svg)
- `wardley` → `renderWardleyMap` (packages/renderer-svg)
- `pid` → `renderPID` (packages/renderer-schematic)
- schematic types (`hydraulic`, `pneumatic`, `electrical`) → `renderSchematic` (packages/renderer-schematic)

Why this matters

- Some profile types are not ELK-style node/edge graphs. Sending them through ELK caused runtime errors (e.g., undefined `.length`). The routing ensures the correct renderer receives the expected AST shape.

Developer commands

```powershell
# Diagnostic: render one example (shows logs and errors)
node .\scripts\run-one-example.mjs .\examples\pid\01-simple-tank-pump.runiq

# Bulk generate all example SVGs
node .\scripts\generate-example-svgs.mjs

# Rebuild parser after grammar edits (if project has a generate script)
cd packages\parser-dsl
pnpm run generate # (if present)
pnpm build
```

Files to document if you edit behavior

- `scripts/generate-example-svgs.mjs`
- `scripts/run-one-example.mjs`
- `packages/parser-dsl/src/runiq.langium`
- `packages/core/src/shape-aliases.ts`
- `packages/core/src/shapes/`

Notes for docs authors

- If adding a new profile type, update the generator docs and add routing to `generate-example-svgs.mjs` so the new profile uses the correct renderer.
- If adding a new shape, ensure it's registered by calling `registerDefaultShapes()` in scripts that run headless.

If you want, I can expand this into a full doc page with examples, AST snippets, and a small troubleshooting checklist.
