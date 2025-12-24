---
title: Web SDK Integration
description: Integrate Runiq diagrams into your web applications with the browser SDK for React, Vue, Svelte, and vanilla JavaScript.
lastUpdated: 2025-11-17
---

# Web SDK Integration

The `@runiq/web` package provides a browser-friendly SDK to parse, layout, and render Runiq diagrams to SVG in your web applications.

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

### One-Line Rendering

The simplest way to render a diagram:

```typescript
import { renderRuniqToSvg } from '@runiq/web';

const dslText = `diagram "Hello World" {
  shape A as @rect label:"Hello"
  shape B as @rect label:"World"
  A -> B
}`;

const { svg, warnings } = await renderRuniqToSvg(dslText);

// Insert SVG into DOM
document.getElementById('diagram').innerHTML = svg;
```

### With Layout Options

```typescript
const { svg } = await renderRuniqToSvg(dslText, {
  direction: 'LR', // Left-to-right
  spacing: 100, // 100px spacing
  algorithm: 'layered', // Hierarchical layout
});
```

### With Render Options

```typescript
const { svg, warnings } = await renderRuniqToSvg(
  dslText,
  { direction: 'TB' },
  {
    title: 'My Diagram',
    strict: false, // Don't throw on warnings
  }
);

// Check for warnings
if (warnings.length > 0) {
  console.warn('Rendering warnings:', warnings);
}
```

## Advanced Usage

### Step-by-Step Pipeline

For more control over parsing, layout, and rendering:

```typescript
import { parseRuniq, layoutRuniq, renderRuniq } from '@runiq/web';

// Step 1: Parse DSL to AST
const ast = parseRuniq(dslText);

if (!ast) {
  console.error('Failed to parse diagram');
  return;
}

// Step 2: Layout the diagram
const layout = await layoutRuniq(ast, {
  algorithm: 'force', // Force-directed layout
  spacing: 120,
  direction: 'TB',
});

// Step 3: Render to SVG
const { svg, warnings } = renderRuniq(ast, layout, {
  title: 'Custom Title',
  strict: false,
});
```

### Error Handling

```typescript
try {
  const { svg, warnings } = await renderRuniqToSvg(
    dslText,
    {},
    { strict: true }
  );

  if (warnings.length > 0) {
    console.warn('Non-fatal warnings:', warnings);
  }

  document.getElementById('output').innerHTML = svg;
} catch (error) {
  console.error('Failed to render diagram:', error);
  // Show error to user
}
```

## Framework Integration

### React

#### Basic Component

```tsx
import { useEffect, useState } from 'react';
import { renderRuniqToSvg } from '@runiq/web';

interface DiagramProps {
  dsl: string;
  direction?: 'TB' | 'LR' | 'BT' | 'RL';
}

export function RuniqDiagram({ dsl, direction = 'TB' }: DiagramProps) {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    renderRuniqToSvg(dsl, { direction })
      .then(({ svg }) => {
        setSvg(svg);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setSvg('');
      });
  }, [dsl, direction]);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="runiq-diagram" dangerouslySetInnerHTML={{ __html: svg }} />
  );
}
```

#### Usage

```tsx
function App() {
  const diagram = `diagram "Example" {
    shape A as @rect label:"Start"
    shape B as @rect label:"End"
    A -> B
  }`;

  return <RuniqDiagram dsl={diagram} direction="LR" />;
}
```

#### With Loading State

```tsx
export function RuniqDiagram({ dsl, direction = 'TB' }: DiagramProps) {
  const [svg, setSvg] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    renderRuniqToSvg(dsl, { direction })
      .then(({ svg }) => {
        setSvg(svg);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [dsl, direction]);

  if (loading) return <div>Loading diagram...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}
```

### Vue 3

#### Composition API

```vue
<template>
  <div>
    <div v-if="loading">Loading diagram...</div>
    <div v-else-if="error" class="error">Error: {{ error }}</div>
    <div v-else v-html="svg" class="runiq-diagram"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { renderRuniqToSvg } from '@runiq/web';

interface Props {
  dsl: string;
  direction?: 'TB' | 'LR' | 'BT' | 'RL';
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'TB',
});

const svg = ref('');
const loading = ref(true);
const error = ref<string | null>(null);

async function renderDiagram() {
  loading.value = true;
  error.value = null;

  try {
    const result = await renderRuniqToSvg(props.dsl, {
      direction: props.direction,
    });
    svg.value = result.svg;
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

watch(() => [props.dsl, props.direction], renderDiagram, { immediate: true });
</script>

<style scoped>
.runiq-diagram {
  width: 100%;
  height: auto;
}

.error {
  color: red;
  padding: 1rem;
  border: 1px solid red;
  border-radius: 4px;
}
</style>
```

#### Usage

```vue
<template>
  <RuniqDiagram :dsl="diagramDsl" direction="LR" />
</template>

<script setup lang="ts">
import RuniqDiagram from './RuniqDiagram.vue';

const diagramDsl = `diagram "Example" {
  shape A as @rect label:"Start"
  shape B as @rect label:"End"
  A -> B
}`;
</script>
```

### Svelte

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { renderRuniqToSvg } from '@runiq/web';

  export let dsl: string;
  export let direction: 'TB' | 'LR' | 'BT' | 'RL' = 'TB';

  let svg = '';
  let loading = true;
  let error: string | null = null;

  async function renderDiagram() {
    loading = true;
    error = null;

    try {
      const result = await renderRuniqToSvg(dsl, { direction });
      svg = result.svg;
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  $: dsl, direction, renderDiagram();
</script>

{#if loading}
  <div>Loading diagram...</div>
{:else if error}
  <div class="error">Error: {error}</div>
{:else}
  <div class="runiq-diagram">
    {@html svg}
  </div>
{/if}

<style>
  .runiq-diagram {
    width: 100%;
    height: auto;
  }

  .error {
    color: red;
    padding: 1rem;
    border: 1px solid red;
    border-radius: 4px;
  }
</style>
```

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Runiq Diagram</title>
  </head>
  <body>
    <div id="diagram"></div>

    <script type="module">
      import { renderRuniqToSvg } from 'https://cdn.jsdelivr.net/npm/@runiq/web/+esm';

      const dsl = `diagram "Example" {
      shape A as @rect label:"Start"
      shape B as @rect label:"End"
      A -> B
    }`;

      const { svg } = await renderRuniqToSvg(dsl, {
        direction: 'LR',
        spacing: 80,
      });

      document.getElementById('diagram').innerHTML = svg;
    </script>
  </body>
</html>
```

## API Reference

### `renderRuniqToSvg(text, layoutOptions?, renderOptions?)`

High-level function that handles parsing, layout, and rendering in one call.

**Parameters:**

```typescript
function renderRuniqToSvg(
  text: string,
  layoutOptions?: LayoutOptions,
  renderOptions?: RenderOptions
): Promise<{ svg: string; warnings: string[] }>;
```

**Layout Options:**

```typescript
interface LayoutOptions {
  algorithm?: 'layered' | 'force' | 'stress' | 'radial' | 'mrtree';
  direction?: 'TB' | 'BT' | 'LR' | 'RL';
  spacing?: number; // Distance between nodes (px)
}
```

**Render Options:**

```typescript
interface RenderOptions {
  title?: string; // SVG title attribute
  strict?: boolean; // Throw on warnings (default: false)
}
```

**Returns:**

```typescript
{
  svg: string;        // Complete SVG markup
  warnings: string[]; // Non-fatal rendering warnings
}
```

### `parseRuniq(text)`

Parse Runiq DSL to AST.

```typescript
function parseRuniq(text: string): DiagramAst | null;
```

Returns `null` if parsing fails.

### `layoutRuniq(ast, options?)`

Compute positions for all shapes and edges.

```typescript
function layoutRuniq(
  ast: DiagramAst,
  options?: LayoutOptions
): Promise<LaidOutDiagram>;
```

### `renderRuniq(ast, layout, options?)`

Render laid-out diagram to SVG.

```typescript
function renderRuniq(
  ast: DiagramAst,
  layout: LaidOutDiagram,
  options?: RenderOptions
): { svg: string; warnings: string[] };
```

## Performance Optimization

### Bundle Size

The `@runiq/web` package is tree-shakeable. Only import what you need:

```typescript
// Import only what you use
import { renderRuniqToSvg } from '@runiq/web';

// Avoid importing unused exports
// import * as runiq from '@runiq/web'; // ❌ Larger bundle
```

**Typical bundle sizes (minified + gzipped):**

- Core SDK: ~45 KB
- With all shapes: ~65 KB
- Parser only: ~25 KB
- Renderer only: ~15 KB

### Code Splitting

Load Runiq only when needed:

```typescript
// React lazy loading
const RuniqDiagram = lazy(() => import('./RuniqDiagram'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RuniqDiagram dsl={diagramText} />
    </Suspense>
  );
}
```

```typescript
// Vue async component
const RuniqDiagram = defineAsyncComponent(() => import('./RuniqDiagram.vue'));
```

### Caching Results

Cache rendered SVGs for static diagrams:

```typescript
const cache = new Map<string, string>();

async function getCachedSvg(dsl: string): Promise<string> {
  if (cache.has(dsl)) {
    return cache.get(dsl)!;
  }

  const { svg } = await renderRuniqToSvg(dsl);
  cache.set(dsl, svg);
  return svg;
}
```

### Debouncing Live Updates

For live editing, debounce rendering:

```typescript
import { debounce } from 'lodash-es';

const debouncedRender = debounce(async (dsl: string) => {
  const { svg } = await renderRuniqToSvg(dsl);
  setSvg(svg);
}, 300);

// In your component
useEffect(() => {
  debouncedRender(dsl);
}, [dsl]);
```

## Advanced Features

### Custom Shape Registration

Register custom shapes before rendering:

```typescript
import { shapeRegistry } from '@runiq/core';
import { renderRuniqToSvg } from '@runiq/web';

// Define custom shape
const customShape = {
  id: 'my-custom',
  bounds: (ctx) => ({ width: 100, height: 60 }),
  anchors: (ctx) => [
    /* anchor points */
  ],
  render: (ctx, pos) => `<rect x="${pos.x}" y="${pos.y}" ... />`,
};

// Register before rendering
shapeRegistry.register(customShape);

const { svg } = await renderRuniqToSvg(dslText);
```

### Dynamic Data Binding

Bind diagram data to application state:

```typescript
function DiagramWithData({ data }: { data: Node[] }) {
  const dsl = useMemo(() => {
    const shapes = data.map(node =>
      `shape ${node.id} as @rect label:"${node.label}"`
    ).join('\n');

    const edges = data
      .filter(node => node.parent)
      .map(node => `${node.parent} -> ${node.id}`)
      .join('\n');

    return `diagram "Dynamic" {\n${shapes}\n${edges}\n}`;
  }, [data]);

  return <RuniqDiagram dsl={dsl} />;
}
```

### Server-Side Rendering (SSR)

For Node.js environments (Next.js, Nuxt, SvelteKit):

```typescript
// pages/diagram.tsx (Next.js)
import { renderRuniqToSvg } from '@runiq/web';

export async function getServerSideProps() {
  const dsl = `diagram "SSR" {
    shape A as @rect label:"Server"
    shape B as @rect label:"Client"
    A -> B
  }`;

  const { svg } = await renderRuniqToSvg(dsl);

  return { props: { svg } };
}

export default function DiagramPage({ svg }: { svg: string }) {
  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}
```

## Styling SVG Output

### CSS Styling

Style the generated SVG with CSS:

```css
/* Container styling */
.runiq-diagram {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.runiq-diagram svg {
  width: 100%;
  height: auto;
  display: block;
}

/* Responsive sizing */
@media (max-width: 768px) {
  .runiq-diagram {
    padding: 1rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .runiq-diagram svg {
    filter: invert(1) hue-rotate(180deg);
  }
}
```

### Inline Styles

```typescript
const { svg } = await renderRuniqToSvg(dsl);

// Wrap in styled container
const styledSvg = `
  <div style="background: #f5f5f5; padding: 2rem; border-radius: 8px;">
    ${svg}
  </div>
`;
```

## Troubleshooting

### Common Issues

#### "Module not found" error

Ensure `@runiq/web` is installed:

```bash
npm install @runiq/web
```

#### Layout not working

Check that you're awaiting the async function:

```typescript
// ❌ Wrong
const { svg } = renderRuniqToSvg(dsl); // Missing await

// ✅ Correct
const { svg } = await renderRuniqToSvg(dsl);
```

#### SVG not displaying

Verify the SVG is being inserted into the DOM:

```typescript
console.log('SVG length:', svg.length);
console.log('Contains svg tag:', svg.includes('<svg'));
```

#### Type errors in TypeScript

Ensure types are installed:

```bash
npm install --save-dev @types/node
```

### Debug Mode

Enable verbose logging:

```typescript
import { renderRuniqToSvg } from '@runiq/web';

const { svg, warnings } = await renderRuniqToSvg(
  dsl,
  {},
  {
    strict: false,
  }
);

console.log('Render warnings:', warnings);
console.log('SVG dimensions:', svg.match(/width="(\d+)" height="(\d+)"/));
```

## Examples

### Live Editor

```typescript
import { useState } from 'react';
import { renderRuniqToSvg } from '@runiq/web';

export function LiveEditor() {
  const [dsl, setDsl] = useState('diagram "Live" {\n  shape A as @rect label:"Edit me"\n}');
  const [svg, setSvg] = useState('');

  const handleChange = async (text: string) => {
    setDsl(text);
    try {
      const { svg } = await renderRuniqToSvg(text);
      setSvg(svg);
    } catch (err) {
      console.error('Render error:', err);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      <textarea
        value={dsl}
        onChange={(e) => handleChange(e.target.value)}
        style={{ fontFamily: 'monospace' }}
      />
      <div dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
}
```

## Related Documentation

- [Getting Started](/guide/getting-started) - Basic Runiq concepts
- [DSL Syntax Reference](/reference/dsl) - Complete syntax guide
- [API Reference](/reference/api/parser) - Detailed API documentation
- [Troubleshooting](/guide/troubleshooting) - Common issues and solutions

## Support

- [GitHub Issues](https://github.com/jgreywolf/runiq/issues) - Report bugs
- [Discussions](https://github.com/jgreywolf/runiq/issues) - Ask questions
- [Examples](https://github.com/jgreywolf/runiq/tree/main/examples) - Sample code

---

**Next Steps**: Try integrating Runiq into your application with the framework examples above, then explore advanced features like custom shapes and dynamic data binding.
