# @runiq/web

Browser-friendly SDK to parse, layout, and render Runiq DSL to SVG.

- Tiny ESM bundle, tree-shakeable
- Works in modern bundlers (Vite, SvelteKit, Next.js, etc.)
- High-level helpers: parse → layout → render
- Powered by the same parser/layout/renderer used by the Runiq editor

## Install

```bash
# npm
npm i @runiq/web

# pnpm
pnpm add @runiq/web

# yarn
yarn add @runiq/web
```

## Quick start

```ts
import { renderRuniqToSvg } from '@runiq/web';

const text = `diagram "My Diagram" {
  direction: TB
  style s1 fill: "#eef"
  shape A as @rectangle label:"Hello" style: s1
  shape B as @rectangle label:"World"
  A -link-> B
}`;

const { svg, warnings } = await renderRuniqToSvg(
  text,
  { direction: 'TB' },
  { title: 'Sample' }
);

// svg is an <svg> string you can insert into the DOM
// warnings contains non-fatal renderer notes (e.g., missing layout nodes)
```

## Lower-level control

```ts
import { parseRuniq, layoutRuniq, renderRuniq } from '@runiq/web';

const ast = parseRuniq(text);
const layout = await layoutRuniq(ast, { spacing: 100, direction: 'LR' });
const { svg } = renderRuniq(ast, layout, { title: 'Custom Title' });
```

## API

- `parseRuniq(text: string): DiagramAst`
- `layoutRuniq(ast: DiagramAst, opts?: { direction?: 'TB'|'LR'|'BT'|'RL'; spacing?: number }): Promise<LaidOutDiagram>`
- `renderRuniq(ast: DiagramAst, layout: LaidOutDiagram, opts?: { strict?: boolean; title?: string }): { svg: string; warnings: string[] }`
- `renderRuniqToSvg(text: string, layoutOpts?, renderOpts?): Promise<{ svg: string; warnings: string[] }>`

## Notes

- Common shapes are registered automatically; for custom/advanced shapes, import and register from `@runiq/core` before calling layout.
- The layout engine uses ELK for high-quality graph layouts.

## License

MIT © Runiq Team
