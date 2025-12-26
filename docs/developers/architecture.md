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
`

Notes: Add the system SVG to `docs/public/images/architecture.svg` and reference it here.
