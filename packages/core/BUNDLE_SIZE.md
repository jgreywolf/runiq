# Bundle Size Optimization Guide

## Overview

The `@runiq/core` package supports **selective shape registration** to reduce bundle size for applications that don't need all 52 shapes.

## Bundle Sizes

- **Full package (minified)**: 165 KB
- **Full package (unminified)**: 305 KB
- **Core only (no shapes)**: ~35 KB
- **With selective registration**: 50-150 KB (depending on shapes used)
- **Validation (optional)**: ~25 KB (Zod dependency)
- **Text measurement**: Auto-detects (browser: ~5 KB, Node.js: ~2 KB)

## Usage

### Option 1: Register All Shapes (Default)

```typescript
import { registerDefaultShapes } from '@runiq/core';

// Registers all 52 shapes (~165 KB minified)
registerDefaultShapes();
```

### Option 2: Selective Registration Functions

```typescript
import {
  registerBasicShapes,
  registerFlowchartShapes,
  registerUMLShapes,
} from '@runiq/core';

// Only register what you need (~70 KB minified)
registerBasicShapes(); // Rectangle, circle, triangle, etc.
registerFlowchartShapes(); // Process, decision, document, etc.
registerUMLShapes(); // Class, actor, package, etc.
```

### Option 3: Direct Category Imports (Recommended for Smallest Bundles)

```typescript
import { rectangleShape, circleShape } from '@runiq/core/shapes/basic';
import { docShape, processShape } from '@runiq/core/shapes/flowchart';
import { shapeRegistry } from '@runiq/core';

// Import only specific shapes from categories (~15-30 KB minified)
shapeRegistry.register(rectangleShape);
shapeRegistry.register(circleShape);
shapeRegistry.register(docShape);
shapeRegistry.register(processShape);
```

### Option 4: Manual Registration (Maximum Control)

```typescript
import { shapeRegistry } from '@runiq/core';
import { rectangleShape, circleShape } from '@runiq/core/shapes/basic';

// Register individual shapes with full control
shapeRegistry.register(rectangleShape);
shapeRegistry.register(circleShape);
```

## Available Registration Functions

| Function                        | Shapes Included                                 | Approx Size |
| ------------------------------- | ----------------------------------------------- | ----------- |
| `registerBasicShapes()`         | Rectangle, Circle, Triangle, Hexagon, etc. (17) | ~25 KB      |
| `registerFlowchartShapes()`     | Document, Process, Decision, etc. (14)          | ~20 KB      |
| `registerStorageShapes()`       | Cylinder, Disk, Database, etc. (7)              | ~10 KB      |
| `registerRectVariantShapes()`   | Framed, Multi, Divided rectangles (7)           | ~8 KB       |
| `registerControlSystemShapes()` | Transfer function, Gain, Integrator, etc. (10)  | ~12 KB      |
| `registerSpecialShapes()`       | Text, Brace, Lightning, etc. (7)                | ~8 KB       |
| `registerChartShapes()`         | Pie, Bar, Venn, Pyramid (7)                     | ~15 KB      |
| `registerNetworkShapes()`       | Server, Router, Cloud, etc. (7)                 | ~10 KB      |
| `registerQuantumShapes()`       | Quantum gates, CNOT, etc. (12)                  | ~12 KB      |
| `registerUMLShapes()`           | Class, Actor, Package, etc. (23)                | ~35 KB      |
| `registerPedigreeShapes()`      | Family tree shapes (3)                          | ~4 KB       |
| `registerC4Shapes()`            | C4 model shapes (4)                             | ~5 KB       |
| `registerBPMNShapes()`          | BPMN process shapes (6)                         | ~12 KB      |
| `registerAWSShapes()`           | AWS cloud shapes (6)                            | ~10 KB      |
| `registerERDShapes()`           | Entity-relationship diagrams (6)                | ~8 KB       |

_Sizes are approximate and include dependencies_

## Examples

### Minimal Flowchart App

```typescript
import {
  shapeRegistry,
  registerBasicShapes,
  registerFlowchartShapes,
} from '@runiq/core';

registerBasicShapes();
registerFlowchartShapes();

// ~45 KB bundle (73% smaller than full)
```

### UML Class Diagram Tool

```typescript
import { registerBasicShapes, registerUMLShapes } from '@runiq/core';

registerBasicShapes();
registerUMLShapes();

// ~60 KB bundle (64% smaller than full)
```

### Cloud Architecture Diagrams

```typescript
import {
  registerBasicShapes,
  registerNetworkShapes,
  registerAWSShapes,
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
  "sideEffects": ["./src/shapes/index.ts", "./dist/shapes/index.js"]
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
import { registerBasicShapes, registerFlowchartShapes } from '@runiq/core';

registerBasicShapes();
registerFlowchartShapes();
// Only needed shapes
```

No breaking changes - `registerDefaultShapes()` still works!

## Optional Validation

AST validation with Zod is now optional. Import only if needed:

```typescript
// Without validation (saves ~25 KB)
import { shapeRegistry } from '@runiq/core';

// With validation
import { validateDiagram } from '@runiq/core/validation';

const result = validateDiagram(data);
if (result.success) {
  // Use validated data
}
```

**Note**: If you use validation, install Zod as a dependency:

```bash
pnpm add zod
```

## Platform-Specific Text Measurement

Text measurement automatically detects your environment:

```typescript
// Auto-detection (recommended)
import { measureText } from '@runiq/core';
// Browser: Uses Canvas API (~5 KB, accurate)
// Node.js: Uses heuristics (~2 KB, fast)

// Force browser implementation (accurate, browser-only)
import { measureText } from '@runiq/core/text-measurement/browser';

// Force Node.js implementation (smaller bundle)
import { measureText } from '@runiq/core/text-measurement/node';
```

**SSR Pattern**: Use Node.js implementation on both server and client for consistent hydration:

```typescript
import { measureText } from '@runiq/core/text-measurement/node';
```

## Measuring Your Bundle

```bash
# Build with bundle analysis
npx vite-bundle-visualizer

# Or with Webpack
npx webpack-bundle-analyzer stats.json
```

## Optimizations Completed

✅ **Phase 1**: Selective shape registration (45% reduction)  
✅ **Phase 2**: Subpath exports for tree-shaking  
✅ **Phase 3**: Optional Zod validation (~25 KB savings)  
✅ **Phase 4**: Platform-specific text measurement (~3-5 KB savings)

See [BUNDLE_OPTIMIZATION_ANALYSIS.md](../../BUNDLE_OPTIMIZATION_ANALYSIS.md) for details.
