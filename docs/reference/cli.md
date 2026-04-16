---
title: CLI Usage
---

# CLI Usage

The CLI supports rendering `.runiq` files to SVG and export formats. Usage and options will be documented here as the CLI stabilizes.

**Quick SVG render:**

```bash
runiq render diagram.runiq -o diagram.svg
```

The CLI renders SVG in Node.js without a browser. It is the simplest option for build scripts, CI jobs, and static documentation pipelines.

For programmatic server-side rendering, use `@runiq/web`:

```ts
import { renderRuniqToSvg } from '@runiq/web';

const { svg } = await renderRuniqToSvg(source);
```

See [Server-Side SVG Rendering](/guide/server-side-rendering) for a full guide.
