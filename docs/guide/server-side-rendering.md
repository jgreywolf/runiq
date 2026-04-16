---
title: Server-Side SVG Rendering
description: Generate Runiq SVG on the server without a browser DOM.
lastUpdated: 2026-04-15
---

# Server-Side SVG Rendering

Runiq can generate SVG strings on the server. A browser is not required for parsing, layout, or SVG generation.

Use server-side rendering when you want to:

- generate static `.svg` files in a build step
- return SVG from an API route
- pre-render diagrams in documentation or content pipelines
- keep diagram rendering out of the client bundle

## Install

```bash
pnpm add @runiq/web
```

For lower-level package composition, use `@runiq/parser-dsl`, `@runiq/layout-base`, `@runiq/renderer-svg`, and `@runiq/renderer-schematic` directly. Most applications should start with `@runiq/web`.

## Render a File

```ts
import { readFile, writeFile } from 'node:fs/promises';
import { renderRuniqToSvg } from '@runiq/web';

const source = await readFile('diagram.runiq', 'utf8');
const { svg, warnings } = await renderRuniqToSvg(source);

for (const warning of warnings) {
  console.warn(warning);
}

await writeFile('diagram.svg', svg, 'utf8');
```

## Render Every Profile in a Document

```ts
import { readFile, writeFile } from 'node:fs/promises';
import { parseRuniqDocument, renderRuniqDocumentToSvg } from '@runiq/web';

const source = await readFile('system.runiq', 'utf8');
const document = parseRuniqDocument(source);

await Promise.all(
  document.profiles.map(async (_profile, index) => {
    const result = await renderRuniqDocumentToSvg(document, {}, index);
    return writeFile(`system-${index + 1}.svg`, result.svg, 'utf8');
  })
);
```

## Render an Already-Parsed Profile

```ts
import { parseRuniqProfile, renderRuniqProfileToSvg } from '@runiq/web';

const profile = parseRuniqProfile(source);
const { svg } = await renderRuniqProfileToSvg(profile);
```

## Return SVG From an API Route

```ts
import { renderRuniqToSvg } from '@runiq/web';

export async function GET() {
  const { svg } = await renderRuniqToSvg(`diagram "Status" {
    shape api as @server label:"API"
    shape db as @database label:"Database"
    api -> db label:"reads"
  }`);

  return new Response(svg, {
    headers: {
      'content-type': 'image/svg+xml; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  });
}
```

## Next.js Metadata Images

Use the same SVG string as the response body for dynamic image endpoints.

```ts
import { renderRuniqToSvg } from '@runiq/web';

export const runtime = 'nodejs';

export async function GET() {
  const { svg } = await renderRuniqToSvg(`sequence "Login" {
    participant "User" as actor
    participant "API" as control
    User -> API: "POST /login"
    API --> User: "200 OK"
  }`);

  return new Response(svg, {
    headers: { 'content-type': 'image/svg+xml; charset=utf-8' },
  });
}
```

## What Does Not Need a Browser

These operations run in Node.js:

- parsing `.runiq` text
- expanding profile syntax into internal structures
- registering built-in shapes and icons
- graph layout
- schematic rendering
- SVG string generation

The browser is only needed when you want to mount the generated SVG into a page, handle editor interactions, or perform browser-only measurements in an application shell.

## Choosing an Entry Point

| Need                                   | Use                                        |
| -------------------------------------- | ------------------------------------------ |
| Standard `diagram` profile             | `renderRuniqToSvg`                         |
| First supported profile in source text | `renderRuniqToSvg`                         |
| Already-parsed profile                 | `renderRuniqProfileToSvg`                  |
| Specific profile in parsed document    | `renderRuniqDocumentToSvg`                 |
| Inspect parsed profiles                | `parseRuniqDocument`                       |
| Custom diagram layout pipeline         | `parseRuniq`, `layoutRuniq`, `renderRuniq` |

## Supported Profiles

Server-side rendering supports the same profile renderers exposed by `@runiq/web`: diagrams, sequence diagrams, timelines, fault trees, Wardley maps, railroad diagrams, kanban boards, Git graphs, treemaps, pedigrees, electrical schematics, digital circuits, pneumatic circuits, hydraulic circuits, HVAC diagrams, control diagrams, P&ID diagrams, and block diagrams.

## Security

Generated SVG is markup. If users can submit arbitrary DSL, treat the result as untrusted content:

- serve generated SVG with the correct `image/svg+xml` content type
- avoid injecting untrusted SVG directly into privileged application DOM
- validate or restrict remote image/icon usage if your deployment allows it
- use CSP headers appropriate for your application

## Related

- [Web SDK Integration](/guide/web-sdk)
- [CLI Usage](/reference/cli)
- [Renderer API](/reference/api/renderer)
- [DSL Syntax Reference](/reference/dsl)
