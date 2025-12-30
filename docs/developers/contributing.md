# Contributing

This guide explains how to set up a development environment, run tests, follow coding standards, and open PRs for Runiq.

Prerequisites

- Node.js LTS (20+ recommended)
- pnpm (use corepack or install globally)
- Git

Local setup (Windows PowerShell)

```powershell
cd C:\source\repos\Runiq
corepack enable
pnpm install --frozen-lockfile
pnpm -w build
```

Running the app and tests

- Start the editor (dev server): `pnpm dev:editor`
- Run all tests: `pnpm -w test`
- Run core package tests only: `pnpm --filter @runiq/core test`
- Run visual tests for renderer: `pnpm --filter @runiq/renderer-svg test:visual`

Coding standards

- TypeScript strict mode enabled across packages — avoid `any`.
- Prefer descriptive names; avoid one-letter variables.
- Keep changes scoped to the affected package(s).
- Run `pnpm -w lint` (when available) before committing.

Testing requirements

- Add unit tests (Vitest) for new shapes, utilities, and parser changes.
- For new shapes: include tests for ID correctness, bounds, anchors, and SVG rendering where practical.
- For parser or grammar changes: update Langium artifacts in `packages/parser-dsl` and add grammar tests.

PR checklist

Before opening a PR, ensure:

- All relevant tests pass locally (`pnpm -w test`).
- New shapes include unit tests and at least one example in `examples/`.
- Documentation updates (docs/) are included for public API or behavior changes.
- Changelog entry added when applicable.

PR process

- Branch naming: `feature/<short>` or `fix/<short>`.
- Provide a clear description, test plan, and any screenshots or generated SVGs if relevant.
- Tag the package owner or `@jgreywolf` for review.

Committing generated assets

- If you add or change examples, prefer to include the generated `examples/*.svg` files in the PR only if the change affects documentation rendering and the team agrees.
- If you choose not to commit generated assets, document regeneration steps in `docs/developers/missing-assets.md` and ensure CI verifies references.

Developer utilities

- Generate a single example SVG (diagnostic):
  - `node ./scripts/run-one-example.mjs ./examples/<path>.runiq`
- Generate all example SVGs:
  - `node ./scripts/generate-example-svgs.mjs`
- Copy normalized SVG filenames into `examples/`:
  - `node ./scripts/copy-missing-svgs.mjs`
- Verify doc image references:
  - `node ./scripts/list-missing-svgs.mjs`

Where to get help

- Open an issue or mention `@jgreywolf` on PRs for guidance.
