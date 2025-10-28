---
title: Core API
---

# Core API

The Core package defines shared types, shape definitions, registries, and utilities used across parsing, layout, and rendering.

## Shapes

Shapes implement a common interface:

```ts
export interface ShapeDefinition {
  id: string;
  bounds(ctx): { width: number; height: number };
  anchors(ctx): Anchor[];
  render(ctx, position): string; // returns SVG fragment
}
```

- `bounds` calculates dimensions based on content and style
- `anchors` returns connection points (N/E/S/W)
- `render` emits SVG for the shape using computed layout

## Shape registry

```ts
import { shapeRegistry } from '@runiq/core';

const rect = shapeRegistry.get('rect');
```

Register custom shapes at runtime to extend the library.

## Utilities

- Style merging and defaults
- Text measurement helpers
- Color and stroke utilities
