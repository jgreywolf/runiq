# Architecture Overview

Owner: @jgreywolf

This page gives a concise system overview for contributors: package responsibilities, the render pipeline, extension points, and where to find key code.

Canonical reference

For exhaustive architecture details and diagrams, see the canonical guide: [ARCHITECTURE-GUIDE.md](../ARCHITECTURE-GUIDE.md).

System overview

- `@runiq/core` — core types, the shape registry, validation helpers, and the canonical shape implementations.
- `@runiq/parser-dsl` — Langium-based grammar and parser that produces the project ASTs.
- `@runiq/renderer-svg` — SVG renderer and rendering primitives used by the editor and the generator.
- `@runiq/layout-base` — layout adapter layer (ELK integration and layout shims).
- `@runiq/renderer-schematic` — schematic-style renderer for electrical/hydraulic/pneumatic profiles.
- `@runiq/io-json` — import/export helpers for example interchange.
- `@runiq/web` / `apps/editor` — browser SDK and SvelteKit editor UI.

Render pipeline (high level)

1. Parse: `packages/parser-dsl` converts `.runiq` source into an AST.
2. Validate: core validators ensure required fields and shape IDs exist.
3. Register: `registerDefaultShapes()` or runtime registration ensures the `shapeRegistry` contains needed shapes.
4. Layout: `layout-base` (ELK) computes positions for node/edge diagrams — profile-specific renderers may skip ELK.
5. Render: profile-specific renderers in `renderer-svg` or `renderer-schematic` produce an SVG string.
6. Export: write SVG to `examples/` or `docs/public/examples/` for docs and gallery.

Extension points

- Shape registry: add `ShapeDefinition`s under `packages/core/src/shapes` and register via `shapeRegistry.register()`.
- Layout engines: implement or register new `LayoutEngine` adapters in `layout-base` and add to `layoutRegistry`.
- Renderer hooks: profile renderers (sequence, timeline, wardley, pid, schematic) register routing in the example generator — update `scripts/generate-example-svgs.mjs` when adding profiles.
- Icon providers & themes: register via `iconRegistry` and theme exports; renderer will resolve icons during render.

Where to look (quick links)

- Shape implementations: [packages/core/src/shapes/](packages/core/src/shapes/)
- Shape registry: [packages/core/src/registries.ts](packages/core/src/registries.ts) and [packages/core/src/shapes/index.ts](packages/core/src/shapes/index.ts)
- Parser grammar: [packages/parser-dsl/src/runiq.langium](packages/parser-dsl/src/runiq.langium)
- Renderer: [packages/renderer-svg/src/](packages/renderer-svg/src/)
- Layout adapters: [packages/layout-base/](packages/layout-base/)

Developer commands (Windows PowerShell)

```powershell
cd C:\source\repos\Runiq
corepack enable
pnpm install --frozen-lockfile
pnpm -w build
pnpm -w test
pnpm --filter @runiq/core test
```

Quick examples

Register a shape at runtime (for headless scripts):

```ts
import { shapeRegistry } from '@runiq/core';
import { myShape } from './packages/core/src/shapes/my-shape';

shapeRegistry.register(myShape);
```

Route a new profile in the generator (example note)

When adding a profile that must be rendered by a specialized renderer, update `scripts/generate-example-svgs.mjs` to map the profile name to the renderer function (see `scripts/generate-example-svgs.mjs` for examples such as `sequence`, `pid`, `wardley`).

Acceptance criteria for architecture docs

- Includes a system diagram in `docs/public/images/architecture.svg` or links to the canonical `ARCHITECTURE-GUIDE.md` diagram.
- Lists package responsibilities and primary extension points.
- Contains quick developer commands and pointers to code locations.

Notes

- For details about missing documentation assets or regenerating example SVGs, see [Missing Documentation Assets](missing-assets.md).
- If you change parser tokens or grammar, regenerate Langium artifacts under `packages/parser-dsl` and update docs accordingly.

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
````
