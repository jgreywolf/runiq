---
title: Layout API
---

# Layout API

Compute positions and sizes for all shapes and edges.

## layoutDiagram(diagram, options)

```ts
import { layoutDiagram } from '@runiq/layout-base';

const laidOut = await layoutDiagram(diagram, {
  algorithm: 'layered', // 'layered' | 'force' | 'stress' | 'tree' | 'radial'
  direction: 'TB', // 'TB' | 'BT' | 'LR' | 'RL'
  spacing: 80, // number in px
});
```

### Return value

```ts
interface LayoutResult {
  nodes: Record<
    string,
    { x: number; y: number; width: number; height: number }
  >;
  edges: Record<string, { points: { x: number; y: number }[] }>;
  size: { width: number; height: number };
}
```

Nested containers are expanded automatically to fit their children.
