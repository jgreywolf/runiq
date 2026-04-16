# @runiq/web

Browser-friendly SDK to parse, layout, and render Runiq DSL to SVG.

- ESM package for modern bundlers
- High-level helpers for parse -> layout -> render
- Automatic registration for built-in shapes and icon providers
- Profile-aware rendering for diagrams, sequence diagrams, timelines, schematics, and other specialized profiles
- Works in browsers and in Node.js server-side rendering environments

## Install

```bash
npm i @runiq/web
pnpm add @runiq/web
yarn add @runiq/web
```

## Quick Start

```ts
import { renderRuniqToSvg } from '@runiq/web';

const text = `diagram "My Diagram" {
  direction TB
  style s1 fillColor: "#eef"
  shape A as @rectangle label:"Hello" style: s1
  shape B as @rectangle label:"World"
  A -link-> B
}`;

const { svg, warnings } = await renderRuniqToSvg(
  text,
  { direction: 'TB' },
  { title: 'Sample' }
);
```

`svg` is a complete `<svg>` string. `warnings` contains non-fatal renderer notes.

## Render Any Supported Profile

Use `renderRuniqToSvg` when the input may be a specialized profile instead of a plain `diagram` profile.

```ts
import { renderRuniqToSvg } from '@runiq/web';

const text = `sequence "Login" {
  participant "User" as actor
  participant "API" as control
  User -> API: "POST /login"
  API --> User: "200 OK"
}`;

const { svg } = await renderRuniqToSvg(text);
```

Supported render targets include:

- `diagram`
- `sequence`
- `timeline`
- `faultTree`
- `wardley`
- `railroad`
- `kanban`
- `gitgraph`
- `treemap`
- `pedigree`
- `electrical`
- `digital`
- `pneumatic`
- `hydraulic`
- `hvac`
- `control`
- `pid`
- `block-diagram`

## Full Documents

Use `parseRuniqDocument` when you need all profiles from a source file.

```ts
import { parseRuniqDocument, renderRuniqDocumentToSvg } from '@runiq/web';

const document = parseRuniqDocument(text);
const first = await renderRuniqDocumentToSvg(document);
const second = await renderRuniqDocumentToSvg(document, {}, 1);
```

Use `parseRuniqProfile` and `renderRuniqProfileToSvg` when you already know which profile to render.

```ts
import { parseRuniqProfile, renderRuniqProfileToSvg } from '@runiq/web';

const profile = parseRuniqProfile(text, 1);
const { svg } = await renderRuniqProfileToSvg(profile);
```

## Lower-Level Diagram Control

The lower-level helpers target the standard `diagram` profile.

```ts
import { parseRuniq, layoutRuniq, renderRuniq } from '@runiq/web';

const ast = parseRuniq(text);
const layout = await layoutRuniq(ast, { spacing: 100, direction: 'LR' });
const { svg } = renderRuniq(ast, layout, { title: 'Custom Title' });
```

## API

- `parseRuniq(text): DiagramAst`
- `parseRuniqDocument(text): RuniqDocument`
- `parseRuniqProfile(text, index?): Profile`
- `layoutRuniq(ast, options?): Promise<LaidOutDiagram>`
- `renderRuniq(ast, layout, options?): RenderResult`
- `renderRuniqToSvg(text, layoutOptions?, renderOptions?): Promise<RenderResult>`
- `renderRuniqProfileToSvg(profile, options?, astVersion?): Promise<RenderResult>`
- `renderRuniqDocumentToSvg(document, options?, profileIndex?): Promise<RenderResult>`

Specialized renderers from `@runiq/renderer-svg` and `@runiq/renderer-schematic` are also re-exported for advanced use.

## Server-Side Rendering

The SDK can generate SVG strings without a browser DOM.

```ts
import { writeFile } from 'node:fs/promises';
import { renderRuniqToSvg } from '@runiq/web';

const { svg } = await renderRuniqToSvg(text);
await writeFile('diagram.svg', svg, 'utf8');
```

See the server-side rendering guide in the main docs for framework examples.

## License

MIT (c) Runiq Team
