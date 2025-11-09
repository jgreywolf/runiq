---
title: Layout
---

---
title: Layout & Direction
description: Control diagram layout with automatic ELK algorithms, manual positioning, direction options (TB/LR/BT/RL), and node separation settings.
lastUpdated: 2025-01-09
---

# Layout & Direction

Runiq uses ELK (Eclipse Layout Kernel) under the hood for automatic layout. You can tune algorithms, directions, spacing, and container behavior.

## Quick usage

```typescript
import { parse } from '@runiq/parser-dsl';
import { layoutDiagram } from '@runiq/layout-base';

const parseResult = parse(dsl);
const diagram = parseResult.document!.diagrams[0];
const laidOut = await layoutDiagram(diagram, {
  algorithm: 'layered', // layered | force | stress | tree | radial
  direction: 'TB', // TB | BT | LR | RL
  spacing: 80,
});
```

## Algorithms

- layered (default): Hierarchical layered layout (great for flowcharts)
- force: Force-directed (organic)
- stress: Stress-minimization (multi-dimensional scaling-like)
- tree: Tree layout (radial trees supported by ELK too)
- radial: Radial variants (depending on ELK config)

## Directions

- TB (top-to-bottom), BT (bottom-to-top)
- LR (left-to-right), RL (right-to-left)

## Spacing

- `spacing`: high-level control for node/edge spacing (px)
- Fine-tuning via ELK options is planned for advanced scenarios

## Containers

Containers group nodes visually and influence layout. Nested containers are supported. The adapter expands parent bounds to include nested containers so labels and content aren't clipped.

## Container Layout

:::tip Nested Container Support
Nested containers are fully supported with automatic sizing and positioning! The layout engine uses a two-pass algorithm to calculate accurate container dimensions before positioning, ensuring containers never overlap.
:::

### Example (DSL)

```runiq
diagram "Service" {
	direction LR

	container "Frontend" {
		shape UI as @rounded label: "UI"
	}

	container "Backend" {
		shape API as @rect label: "API"
		container "DBLayer" {
			shape DB as @cylinder label: "Database"
		}
	}

	UI -> API
	API -> DB
}
```

## Tips

- Prefer `layered` for process flows and use case diagrams
- Use `LR` when labels are wide (western languages)
- Increase `spacing` if edges overlap labels
- Group related elements in containers for clarity
