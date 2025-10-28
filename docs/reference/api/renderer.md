---
title: Renderer API
---

# Renderer API

Render laid-out diagrams to pure SVG.

## renderSvg(diagram, layout, options)

```ts
import { renderSvg } from '@runiq/renderer-svg';

const { svg, width, height } = renderSvg(diagram, laidOut, {
	title: diagram.title,
});
```

### Output

```ts
interface RenderResult {
	svg: string;     // SVG markup
	width: number;
	height: number;
}
```

The renderer orchestrates modular shape renderers and emits standards-compliant SVG with no HTML dependencies.
