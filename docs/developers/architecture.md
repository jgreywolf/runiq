# Architecture Overview

Owner: `@jgreywolf`

Purpose: Describe high-level system architecture, package responsibilities, data flow, and extension points.

Acceptance criteria:

- Contains a system diagram (SVG) showing package interactions.
- Lists extension points and example code snippets for plugins.
- Includes commands to run the dev environment and where to find key source files.

Quick links:

- `packages/core` — core shapes, registries, rendering primitives
- `packages/parser-dsl` — Langium grammar and parser
- `packages/renderer-svg` — SVG renderer implementation
- `packages/layout-base` — layout adapters (ELK)

Dev commands:

`powershell
cd C:\source\repos\Runiq
pnpm -w build
pnpm -w test

````markdown
# Architecture Overview

Owner: `@jgreywolf`

Purpose: High-level architecture, package responsibilities, data flow, extension points, and contributor workflow.

Canonical guide

For the complete, canonical architecture reference (full details, diagrams, package lists, and examples), see the project root: [ARCHITECTURE-GUIDE.md](../ARCHITECTURE-GUIDE.md).

This developer doc is a concise summary and links into the canonical guide where appropriate.

Overview

- `@runiq/core` — types, registries, shapes, validation
- `@runiq/parser-dsl` — Langium grammar and parser
- `@runiq/renderer-svg` — SVG renderer and render pipeline
- `@runiq/layout-base` — layout adapters (ELK)

Key concepts

- Pipeline: Parse (Langium) → Validate → Layout (ELK) → Render (SVG)
- Shape registry: runtime registry of `ShapeDefinition`s used by the renderer
- Profiles: domain-specific parsing + rendering (sequence, timeline, electrical, etc.)

Where to look (quick)

- Shape implementations: packages/core/src/shapes/
- Shape registry: packages/core/src/registries.ts and packages/core/src/shapes/index.ts
- Parser grammar: packages/parser-dsl/src/runiq.langium
- Renderer: packages/renderer-svg/src/

Developer commands (Windows PowerShell)

```powershell
cd C:\source\repos\Runiq
pnpm install
pnpm -w build
pnpm -w test
pnpm --filter @runiq/core test
```
````

Run the editor locally (dev mode):

```powershell
pnpm --filter @runiq/apps dev:editor
```

Testing notes

- Unit tests: Vitest across packages (`pnpm -w test`).
- Visual tests: Playwright snapshots under renderer packages; run with `pnpm --filter @runiq/renderer-svg test:visual`.
- Pre-commit / CI: PRs must pass unit tests for affected packages.

PR & issue process (summary)

- Branch from `main` with descriptive name: `feature/<short>` or `bugfix/<short>`.
- Open PR with: summary, what changed, test plan, screenshots (for visual changes).
- Required checks before merge:
  - All unit tests for modified packages pass.
  - New shape/profile additions include unit tests and at least one example under `examples/`.
  - Update to changelog or docs if public API or behaviour changed.
- Review guidance: tag `@jgreywolf` or the package owner; keep PRs focused and small.

Extension points

- Shapes: implement `ShapeDefinition` in `packages/core/src/shapes` and register via `shapeRegistry`.
- Layout engines: implement `LayoutEngine` and register in `layoutRegistry`.
- Icon providers / themes: register via `iconRegistry` and `theme` exports.

Notes and next steps

- Add or update `docs/public/images/architecture.svg` for the system diagram and link it here.
- If documentation references images that are missing, see [Missing Documentation Assets](missing-assets.md) for the inventory and remediation steps.

```

```
