---
title: Renderer API
---

# Renderer API

Render laid-out diagrams to pure SVG.

The renderer returns SVG strings and does not require a browser DOM. Use it directly for low-level diagram rendering, or use `@runiq/web` for a higher-level profile-aware API.

## renderSvg(diagram, layout, options)

```ts
import { renderSvg } from '@runiq/renderer-svg';

const { svg, warnings } = renderSvg(diagram, laidOut, {
  title: diagram.title,
});
```

### Output

```ts
interface RenderResult {
  svg: string; // SVG markup
  warnings: string[];
}
```

The renderer orchestrates modular shape renderers and emits standards-compliant SVG with no HTML dependencies.

## Specialized Renderers

`@runiq/renderer-svg` also exports profile-specific renderers for sequence diagrams, timelines, Wardley maps, railroad diagrams, fault trees, kanban boards, Git graphs, treemaps, and pedigrees.

`@runiq/renderer-schematic` renders electrical, digital, pneumatic, hydraulic, HVAC, control, block-diagram, and P&ID profiles.

For application code that should accept source text containing any supported profile, prefer `renderRuniqToSvg` from `@runiq/web`.

## Server-Side Rendering

SVG generation works in Node.js:

```ts
import { writeFile } from 'node:fs/promises';
import { renderRuniqToSvg } from '@runiq/web';

const { svg } = await renderRuniqToSvg(source);
await writeFile('diagram.svg', svg, 'utf8');
```

See [Server-Side SVG Rendering](/guide/server-side-rendering) for API route and build-step examples.
