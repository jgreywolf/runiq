---
title: Web SDK Integration
description: Integrate Runiq diagrams into browser and server-rendered web applications with @runiq/web.
lastUpdated: 2026-04-15
---

# Web SDK Integration

The `@runiq/web` package parses Runiq DSL and returns SVG strings. It is intended for browser apps, component frameworks, docs sites, and server-rendered web routes.

The package registers the built-in shapes and icon providers automatically, so diagrams can use the same common shapes and icon labels that work in the editor and CLI.

## Installation

::: code-group

```bash [npm]
npm install @runiq/web
```

```bash [pnpm]
pnpm add @runiq/web
```

```bash [yarn]
yarn add @runiq/web
```

:::

## Quick Start

```ts
import { renderRuniqToSvg } from '@runiq/web';

const dsl = `diagram "Hello World" {
  direction LR
  shape A as @server label:"API"
  shape B as @database label:"Database"
  A -> B label:"reads"
}`;

const { svg, warnings } = await renderRuniqToSvg(dsl);

document.getElementById('diagram')!.innerHTML = svg;
```

`renderRuniqToSvg` is the shortest path for rendering the first profile in a source file. For the standard `diagram` profile, it also runs graph layout before rendering.

## Specialized Profiles

Use `renderRuniqToSvg` when the source may contain a profile-specific diagram such as `sequence`, `timeline`, `electrical`, `pid`, or `kanban`.

```ts
import { renderRuniqToSvg } from '@runiq/web';

const dsl = `sequence "Login" {
  participant "User" as actor
  participant "API" as control

  User -> API: "POST /login"
  API --> User: "200 OK"
}`;

const { svg } = await renderRuniqToSvg(dsl);
```

Supported render targets:

| Profile         | Renderer                   |
| --------------- | -------------------------- |
| `diagram`       | layout + SVG renderer      |
| `sequence`      | sequence renderer          |
| `timeline`      | timeline renderer          |
| `faultTree`     | fault tree renderer        |
| `wardley`       | Wardley map renderer       |
| `railroad`      | railroad diagram renderer  |
| `kanban`        | kanban renderer            |
| `gitgraph`      | Git graph renderer         |
| `treemap`       | treemap renderer           |
| `pedigree`      | pedigree renderer          |
| `electrical`    | schematic renderer         |
| `digital`       | digital schematic renderer |
| `pneumatic`     | schematic renderer         |
| `hydraulic`     | schematic renderer         |
| `hvac`          | schematic renderer         |
| `control`       | schematic renderer         |
| `pid`           | P&ID renderer              |
| `block-diagram` | schematic renderer         |

## Multi-Profile Documents

Use the document helpers when a `.runiq` source contains more than one profile.

```ts
import { parseRuniqDocument, renderRuniqDocumentToSvg } from '@runiq/web';

const document = parseRuniqDocument(dsl);
const rendered = [];

for (let index = 0; index < document.profiles.length; index++) {
  rendered.push(await renderRuniqDocumentToSvg(document, {}, index));
}
```

To render a specific profile by index:

```ts
import { parseRuniqProfile, renderRuniqProfileToSvg } from '@runiq/web';

const profile = parseRuniqProfile(dsl, 1);
const { svg } = await renderRuniqProfileToSvg(profile);
```

## Diagram Pipeline

The lower-level helpers are useful when you want control over layout options or want to inspect the parsed diagram AST.

```ts
import { parseRuniq, layoutRuniq, renderRuniq } from '@runiq/web';

const diagram = parseRuniq(dsl);
const layout = await layoutRuniq(diagram, {
  direction: 'TB',
  spacing: 100,
});
const { svg } = renderRuniq(diagram, layout, {
  title: 'Custom title',
});
```

## Framework Usage

### React

```tsx
import { useEffect, useState } from 'react';
import { renderRuniqToSvg } from '@runiq/web';

export function RuniqDiagram({ dsl }: { dsl: string }) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    renderRuniqToSvg(dsl)
      .then((result) => {
        if (!cancelled) {
          setSvg(result.svg);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setSvg('');
          setError(err instanceof Error ? err.message : String(err));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dsl]);

  if (error) return <p>{error}</p>;

  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}
```

### Vue

```vue
<script setup lang="ts">
import { ref, watch } from 'vue';
import { renderRuniqToSvg } from '@runiq/web';

const props = defineProps<{ dsl: string }>();
const svg = ref('');
const error = ref<string | null>(null);

watch(
  () => props.dsl,
  async (dsl) => {
    try {
      const result = await renderRuniqToSvg(dsl);
      svg.value = result.svg;
      error.value = null;
    } catch (err) {
      svg.value = '';
      error.value = err instanceof Error ? err.message : String(err);
    }
  },
  { immediate: true }
);
</script>

<template>
  <p v-if="error">{{ error }}</p>
  <div v-else v-html="svg" />
</template>
```

### Svelte

```svelte
<script lang="ts">
  import { renderRuniqToSvg } from '@runiq/web';

  export let dsl: string;

  let svg = '';
  let error: string | null = null;

  $: renderRuniqToSvg(dsl)
    .then((result) => {
      svg = result.svg;
      error = null;
    })
    .catch((err) => {
      svg = '';
      error = err instanceof Error ? err.message : String(err);
    });
</script>

{#if error}
  <p>{error}</p>
{:else}
  <div>{@html svg}</div>
{/if}
```

## Server Rendering

`@runiq/web` can generate SVG strings in Node.js without a browser DOM.

```ts
import { renderRuniqToSvg } from '@runiq/web';

export async function GET() {
  const { svg } = await renderRuniqToSvg(`diagram "API" {
    shape A as @server label:"Server"
  }`);

  return new Response(svg, {
    headers: { 'content-type': 'image/svg+xml; charset=utf-8' },
  });
}
```

For file generation, API routes, and framework-specific examples, see [Server-Side SVG Rendering](/guide/server-side-rendering).

## API

### `parseRuniqDocument(text)`

Parses the complete source and returns the full Runiq document.

```ts
function parseRuniqDocument(text: string): RuniqDocument;
```

### `parseRuniqProfile(text, index?)`

Parses a source file and returns one profile by index.

```ts
function parseRuniqProfile(text: string, index?: number): Profile;
```

### `renderRuniqProfileToSvg(profile, options?, astVersion?)`

Renders an already-parsed profile to SVG.

```ts
function renderRuniqProfileToSvg(
  profile: Profile,
  options?: ProfileRenderOptions,
  astVersion?: string
): Promise<{ svg: string; warnings: string[] }>;
```

### `renderRuniqDocumentToSvg(document, options?, profileIndex?)`

Renders one profile from a parsed document. The default `profileIndex` is `0`.

```ts
function renderRuniqDocumentToSvg(
  document: RuniqDocument,
  options?: ProfileRenderOptions,
  profileIndex?: number
): Promise<{ svg: string; warnings: string[] }>;
```

### `renderRuniqToSvg(text, layoutOptions?, renderOptions?)`

Parses the source and renders the first supported profile. For a standard `diagram` profile, layout and render options are applied.

```ts
function renderRuniqToSvg(
  text: string,
  layoutOptions?: LayoutOptions,
  renderOptions?: RenderOptions
): Promise<{ svg: string; warnings: string[] }>;
```

### `parseRuniq(text)`

Parses the first standard `diagram` profile.

```ts
function parseRuniq(text: string): DiagramAst;
```

### `layoutRuniq(diagram, options?)`

Computes node, container, and edge positions for a standard diagram profile.

```ts
function layoutRuniq(
  diagram: DiagramAst,
  options?: LayoutOptions
): Promise<LaidOutDiagram>;
```

### `renderRuniq(diagram, layout, options?)`

Renders an already-laid-out standard diagram profile.

```ts
function renderRuniq(
  diagram: DiagramAst,
  layout: LaidOutDiagram,
  options?: RenderOptions
): { svg: string; warnings: string[] };
```

## Notes

- Generated SVG is a string. Insert it into the DOM, return it from an API route, or write it to a file.
- Treat user-authored DSL as untrusted input. Sanitize or isolate rendered output if arbitrary users can provide source text.
- Debounce live editor rendering so parse/layout work does not run on every keystroke.
- Cache rendered SVG for static diagrams.

## Related

- [Server-Side SVG Rendering](/guide/server-side-rendering)
- [DSL Syntax Reference](/reference/dsl)
- [JSON Format](/reference/json)
- [Renderer API](/reference/api/renderer)
- [Troubleshooting](/guide/troubleshooting)
