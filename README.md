# Runiq

A text-based diagram language that parses `.runiq` files and renders them to SVG.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Docs](https://img.shields.io/badge/docs-runiq.org-blue)](https://runiq.org)
[![npm: @runiq/web](https://img.shields.io/npm/v/@runiq/web?label=%40runiq%2Fweb)](https://www.npmjs.com/package/@runiq/web)
[![npm: @runiq/cli](https://img.shields.io/npm/v/@runiq/cli?label=%40runiq%2Fcli)](https://www.npmjs.com/package/@runiq/cli)

Runiq is for keeping diagrams in source control. Write a diagram as text, render it as SVG, and use the same source in docs, build scripts, web apps, or editor tooling.

## Links

- [Documentation](https://runiq.org)
- [Guide](https://runiq.org/guide/getting-started)
- [Examples](https://runiq.org/examples/)
- [DSL Reference](https://runiq.org/reference/dsl)
- [Web SDK](./packages/web)
- [CLI](./packages/cli)

## What It Supports

Runiq has a general `diagram` profile plus specialized profiles for common diagram domains.

- Flowcharts, architecture diagrams, containers, C4, UML-style diagrams, data flow diagrams, ERDs, requirements diagrams, threat models
- Sequence diagrams, state machines, activity diagrams, BPMN, railroad diagrams
- Mindmaps, timelines, Wardley maps, kanban boards, Git graphs, treemaps, pedigrees
- Charts, Sankey diagrams, Venn diagrams, pyramid diagrams, weighted/force-directed graphs
- Electrical, digital, pneumatic, hydraulic, HVAC, control, P&ID, block, kinematic, and quantum diagrams
- Glyphsets: SmartArt-style templates such as funnels, cycles, pyramids, matrices, org charts, and process layouts

Output is SVG. Some profiles also export to domain formats such as SPICE, Verilog, BPMN XML, LaTeX/TikZ, and Simulink MDL.

## Install

For web apps:

```bash
pnpm add @runiq/web
```

For CLI use:

```bash
pnpm add -g @runiq/cli
```

For local repo development:

```bash
git clone https://github.com/quipolabs/runiq.git
cd runiq
pnpm install
pnpm build
pnpm test
```

Requirements: Node.js `>=20.13.0 <21 || >=22.12.0`, pnpm `8.15.0`.

## Quick Start

Create a `.runiq` file:

```runiq
diagram "Auth Flow" {
  direction LR

  style decision fillColor:"#fff7e6" strokeColor:"#aa7700"

  shape user as @actor label:"Visitor"
  shape landing as @rounded label:"Landing Page"
  shape check as @rhombus label:"Signed up?" style:decision
  shape welcome as @hexagon label:"Welcome"

  user -> landing label:"visits"
  landing -> check
  check -yes-> welcome
}
```

Render it with the CLI:

```bash
runiq render auth-flow.runiq -o auth-flow.svg
```

Or render it from TypeScript:

```ts
import { renderRuniqToSvg } from '@runiq/web';

const { svg, warnings } = await renderRuniqToSvg(source);
```

`@runiq/web` can run in the browser or on the server. See [Server-Side SVG Rendering](https://runiq.org/guide/server-side-rendering) for Node/API route examples.

## Specialized Example

```runiq
sequence "Login" {
  participant "User" as actor
  participant "API" as control
  participant "Database" as database

  User -> API: "POST /login"
  API -> Database: "lookup user"
  Database --> API: "user record"
  API --> User: "200 OK"
}
```

Use the same `renderRuniqToSvg` helper for supported specialized profiles.

## Packages

| Package                                                      | npm                                                                                                                           | Purpose                                      |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| [`@runiq/web`](./packages/web)                               | [![npm](https://img.shields.io/npm/v/@runiq/web.svg)](https://www.npmjs.com/package/@runiq/web)                               | Browser/server SDK for parsing and rendering |
| [`@runiq/cli`](./packages/cli)                               | [![npm](https://img.shields.io/npm/v/@runiq/cli.svg)](https://www.npmjs.com/package/@runiq/cli)                               | Command-line rendering and export            |
| [`@runiq/core`](./packages/core)                             | [![npm](https://img.shields.io/npm/v/@runiq/core.svg)](https://www.npmjs.com/package/@runiq/core)                             | Core AST types, registries, shapes, themes   |
| [`@runiq/parser-dsl`](./packages/parser-dsl)                 | [![npm](https://img.shields.io/npm/v/@runiq/parser-dsl.svg)](https://www.npmjs.com/package/@runiq/parser-dsl)                 | Langium-based DSL parser                     |
| [`@runiq/layout-base`](./packages/layout-base)               | [![npm](https://img.shields.io/npm/v/@runiq/layout-base.svg)](https://www.npmjs.com/package/@runiq/layout-base)               | Layout interfaces and ELK adapter            |
| [`@runiq/renderer-svg`](./packages/renderer-svg)             | [![npm](https://img.shields.io/npm/v/@runiq/renderer-svg.svg)](https://www.npmjs.com/package/@runiq/renderer-svg)             | SVG renderer for diagram profiles            |
| [`@runiq/renderer-schematic`](./packages/renderer-schematic) | [![npm](https://img.shields.io/npm/v/@runiq/renderer-schematic.svg)](https://www.npmjs.com/package/@runiq/renderer-schematic) | Schematic renderer for engineering profiles  |
| [`@runiq/io-json`](./packages/io-json)                       | [![npm](https://img.shields.io/npm/v/@runiq/io-json.svg)](https://www.npmjs.com/package/@runiq/io-json)                       | JSON import/export helpers                   |
| [`@runiq/glyphsets`](./packages/glyphsets)                   | [![npm](https://img.shields.io/npm/v/@runiq/glyphsets.svg)](https://www.npmjs.com/package/@runiq/glyphsets)                   | Built-in SmartArt-style diagram patterns     |
| [`@runiq/icons-brand`](./packages/icons-brand)               | [![npm](https://img.shields.io/npm/v/@runiq/icons-brand.svg)](https://www.npmjs.com/package/@runiq/icons-brand)               | Brand icon provider                          |
| [`@runiq/icons-fontawesome`](./packages/icons-fontawesome)   | [![npm](https://img.shields.io/npm/v/@runiq/icons-fontawesome.svg)](https://www.npmjs.com/package/@runiq/icons-fontawesome)   | Font Awesome icon provider                   |
| [`@runiq/icons-iconify`](./packages/icons-iconify)           | [![npm](https://img.shields.io/npm/v/@runiq/icons-iconify.svg)](https://www.npmjs.com/package/@runiq/icons-iconify)           | Iconify-style icon provider                  |
| [`@runiq/data-loader`](./packages/data-loader)               | [![npm](https://img.shields.io/npm/v/@runiq/data-loader.svg)](https://www.npmjs.com/package/@runiq/data-loader)               | JSON/CSV data loading                        |
| [`@runiq/export-spice`](./packages/export-spice)             | [![npm](https://img.shields.io/npm/v/@runiq/export-spice.svg)](https://www.npmjs.com/package/@runiq/export-spice)             | SPICE netlist export                         |
| [`@runiq/export-verilog`](./packages/export-verilog)         | [![npm](https://img.shields.io/npm/v/@runiq/export-verilog.svg)](https://www.npmjs.com/package/@runiq/export-verilog)         | Verilog export                               |
| [`@runiq/export-bpmn`](./packages/export-bpmn)               | [![npm](https://img.shields.io/npm/v/@runiq/export-bpmn.svg)](https://www.npmjs.com/package/@runiq/export-bpmn)               | BPMN XML export/import                       |
| [`@runiq/export-latex`](./packages/export-latex)             | [![npm](https://img.shields.io/npm/v/@runiq/export-latex.svg)](https://www.npmjs.com/package/@runiq/export-latex)             | LaTeX/TikZ export                            |
| [`@runiq/export-simulink`](./packages/export-simulink)       | [![npm](https://img.shields.io/npm/v/@runiq/export-simulink.svg)](https://www.npmjs.com/package/@runiq/export-simulink)       | Simulink MDL export                          |

## Development

```bash
pnpm install
pnpm build
pnpm test
pnpm docs:dev
pnpm dev
```

Useful scripts:

- `pnpm build` builds all packages.
- `pnpm test` builds and runs the package test suites.
- `pnpm docs:dev` starts the VitePress docs site.
- `pnpm dev` starts the editor app.
- `pnpm generate-svgs` regenerates example SVG outputs.

## Project Layout

```txt
apps/editor                 SvelteKit editor
docs                        VitePress documentation
examples                    Example .runiq files
packages/core               Shared types, registries, shapes, themes
packages/parser-dsl         Langium parser
packages/layout-base        Layout engine adapter
packages/renderer-svg       SVG renderers
packages/renderer-schematic Schematic renderers
packages/web                Browser/server SDK
packages/cli                CLI
packages/export-*           Domain export packages
```

## License

MIT. See [LICENSE](./LICENSE).

## Acknowledgments

- [Langium](https://langium.org/) for language tooling
- [Eclipse Layout Kernel](https://www.eclipse.org/elk/) for graph layout
- [VitePress](https://vitepress.dev/) for documentation
- [Vitest](https://vitest.dev/) for testing
