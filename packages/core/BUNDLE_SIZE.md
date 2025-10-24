# Bundle Size Optimization Guide

## Overview

The `@runiq/core` package supports **selective shape registration** to reduce bundle size for applications that don't need all 52 shapes.

## Bundle Sizes

- **Full package (minified)**: 165 KB
- **Full package (unminified)**: 305 KB
- **Core only (no shapes)**: ~35 KB
- **With selective registration**: 50-150 KB (depending on shapes used)

## Usage

### Option 1: Register All Shapes (Default)

```typescript
import { registerDefaultShapes } from '@runiq/core';

// Registers all 52 shapes (~165 KB minified)
registerDefaultShapes();
```

### Option 2: Selective Registration (Recommended)

```typescript
import { 
  registerBasicShapes,
  registerFlowchartShapes,
  registerUMLShapes 
} from '@runiq/core';

// Only register what you need (~70 KB minified)
registerBasicShapes();      // Rectangle, circle, triangle, etc.
registerFlowchartShapes();  // Process, decision, document, etc.
registerUMLShapes();        // Class, actor, package, etc.
```

### Option 3: Manual Registration (Smallest)

```typescript
import { shapeRegistry } from '@runiq/core';
import { rectangleShape, circleShape } from '@runiq/core';

// Register individual shapes (~40 KB minified)
shapeRegistry.register(rectangleShape);
shapeRegistry.register(circleShape);
```

## Available Registration Functions

| Function | Shapes Included | Approx Size |
|----------|----------------|-------------|
| `registerBasicShapes()` | Rectangle, Circle, Triangle, Hexagon, etc. (17) | ~25 KB |
| `registerFlowchartShapes()` | Document, Process, Decision, etc. (14) | ~20 KB |
| `registerStorageShapes()` | Cylinder, Disk, Database, etc. (7) | ~10 KB |
| `registerRectVariantShapes()` | Framed, Multi, Divided rectangles (7) | ~8 KB |
| `registerControlSystemShapes()` | Transfer function, Gain, Integrator, etc. (10) | ~12 KB |
| `registerSpecialShapes()` | Text, Brace, Lightning, etc. (7) | ~8 KB |
| `registerChartShapes()` | Pie, Bar, Venn, Pyramid (7) | ~15 KB |
| `registerNetworkShapes()` | Server, Router, Cloud, etc. (7) | ~10 KB |
| `registerQuantumShapes()` | Quantum gates, CNOT, etc. (12) | ~12 KB |
| `registerUMLShapes()` | Class, Actor, Package, etc. (23) | ~35 KB |
| `registerPedigreeShapes()` | Family tree shapes (3) | ~4 KB |
| `registerC4Shapes()` | C4 model shapes (4) | ~5 KB |
| `registerBPMNShapes()` | BPMN process shapes (6) | ~12 KB |
| `registerAWSShapes()` | AWS cloud shapes (6) | ~10 KB |
| `registerERDShapes()` | Entity-relationship diagrams (6) | ~8 KB |

*Sizes are approximate and include dependencies*

## Examples

### Minimal Flowchart App

```typescript
import { 
  shapeRegistry,
  registerBasicShapes,
  registerFlowchartShapes 
} from '@runiq/core';

registerBasicShapes();
registerFlowchartShapes();

// ~45 KB bundle (73% smaller than full)
```

### UML Class Diagram Tool

```typescript
import { 
  registerBasicShapes,
  registerUMLShapes 
} from '@runiq/core';

registerBasicShapes();
registerUMLShapes();

// ~60 KB bundle (64% smaller than full)
```

### Cloud Architecture Diagrams

```typescript
import { 
  registerBasicShapes,
  registerNetworkShapes,
  registerAWSShapes 
} from '@runiq/core';

registerBasicShapes();
registerNetworkShapes();
registerAWSShapes();

// ~45 KB bundle (73% smaller than full)
```

## Tree-Shaking

The package is configured for tree-shaking with modern bundlers (Webpack 5+, Rollup, Vite, esbuild):

```json
{
  "sideEffects": [
    "./src/shapes/index.ts",
    "./dist/shapes/index.js"
  ]
}
```

When using selective registration, unused shapes will be automatically removed from your bundle.

## Best Practices

1. **Import only what you need**: Use selective registration functions instead of `registerDefaultShapes()`
2. **Call registration once**: At app startup, not in every module
3. **Check bundle size**: Use tools like `webpack-bundle-analyzer` or `rollup-plugin-visualizer`
4. **Consider lazy loading**: For large apps, consider dynamic imports for rarely-used shapes

## Migration from v0.1.x

### Before:
```typescript
import { registerDefaultShapes } from '@runiq/core';
registerDefaultShapes(); // All shapes
```

### After:
```typescript
import { 
  registerBasicShapes,
  registerFlowchartShapes 
} from '@runiq/core';

registerBasicShapes();
registerFlowchartShapes();
// Only needed shapes
```

No breaking changes - `registerDefaultShapes()` still works!

## Measuring Your Bundle

```bash
# Build with bundle analysis
npx vite-bundle-visualizer

# Or with Webpack
npx webpack-bundle-analyzer stats.json
```

## Future Optimizations

Planned for future releases:
- Subpath exports (`@runiq/core/shapes/basic`)
- Separate validation package (remove Zod from core)
- Platform-specific text measurement (smaller Node.js bundle)

See [BUNDLE_OPTIMIZATION_ANALYSIS.md](../../BUNDLE_OPTIMIZATION_ANALYSIS.md) for details.
