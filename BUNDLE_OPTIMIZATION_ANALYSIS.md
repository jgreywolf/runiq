# Bundle Size Optimization Analysis

## Current State

### Package Sizes (Unminified)

- **@runiq/core**: 303.61 KB (44.2 KB types)
- **@runiq/renderer-schematic**: 61.27 KB (1.25 KB types)
- **@runiq/layout-base**: 34.66 KB (4.44 KB types)

### Key Findings

## 🔴 Critical Issues

### 1. **No Tree-Shaking Support**

**Impact: HIGH** - All 52 shapes always bundled even if only using 1-2

**Current Situation:**

```typescript
// packages/core/src/index.ts
export * from './shapes/index.js'; // Exports ALL shapes

// packages/core/src/shapes/index.ts
export function registerDefaultShapes(): void {
  shapeRegistry.register(basic.rectangleShape);
  shapeRegistry.register(basic.roundedRectangleShape);
  // ... 50 more shapes
}
```

**Problem:**

- Single barrel export bundles all shapes
- `registerDefaultShapes()` is called unconditionally
- No way to import only needed shapes
- CLI using basic shapes pulls in UML, BPMN, AWS, etc.

**Recommendation:**

```typescript
// Option A: Separate entry points (BEST for bundle size)
{
  "exports": {
    ".": "./dist/index.js",
    "./shapes/basic": "./dist/shapes/basic/index.js",
    "./shapes/uml": "./dist/shapes/uml/index.js",
    "./shapes/bpmn": "./dist/shapes/bpmn/index.js",
    // ... etc
  }
}

// Usage:
import { rectangleShape } from '@runiq/core/shapes/basic';
import { classShape } from '@runiq/core/shapes/uml';

// Option B: Lazy registration
export function registerBasicShapes(): void { ... }
export function registerUMLShapes(): void { ... }
export function registerBPMNShapes(): void { ... }
```

**Estimated Savings:** 150-200 KB for apps using only basic shapes

---

### 2. **No Minification Enabled**

**Impact: MEDIUM** - 30-40% size reduction possible

**Current:**

```typescript
// tsup.config.ts
minify: false,
```

**Recommendation:**

```typescript
minify: true,
// OR for better debugging:
minify: process.env.NODE_ENV === 'production',
```

**Estimated Savings:** 100-120 KB (30-35%)

---

### 3. **Missing Side-Effect Annotations**

**Impact: MEDIUM** - Prevents tree-shaking

**Current:**

```json
// package.json
{
  "sideEffects": false // ❌ Not declared
}
```

**Recommendation:**

```json
{
  "sideEffects": [
    "*.css",
    "./src/shapes/index.ts" // Only file with side effects (registry)
  ]
}
```

---

### 4. **Large Text Measurement Implementation**

**Impact: LOW-MEDIUM** - 5-10 KB

**Current:**

```typescript
// text-measurement.ts - Uses canvas API
export function createTextMeasurer(): (
  text: string,
  style: Style
) => { width: number; height: number } {
  // Full canvas-based implementation
  // Includes font loading, caching, fallbacks
}
```

**Problem:**

- Canvas API not available in Node.js (CLI)
- Complex caching logic
- Font loading overhead

**Recommendation:**

```typescript
// Use platform-specific implementations
export function createTextMeasurer(
  platform?: 'browser' | 'node'
): TextMeasurer {
  if (platform === 'node' || typeof window === 'undefined') {
    // Simple heuristic-based (5x smaller)
    return createHeuristicMeasurer();
  }
  // Full canvas implementation for browser
  return createCanvasMeasurer();
}
```

**Estimated Savings:** 5-8 KB

---

## 🟡 Medium Priority Issues

### 5. **Zod Validation Overhead**

**Impact: MEDIUM** - 20-30 KB dependency

**Current:**

```json
"dependencies": {
  "zod": "^3.22.4"  // 25-30 KB min+gzip
}
```

**Context:**

- Used for schema validation
- Primarily needed in parser/validation, not rendering
- Not tree-shakable

**Recommendation:**

```typescript
// Option A: Make validation optional
export * from './validation.js'; // Only import if needed

// Option B: Split into separate package
@runiq/validation  // Includes Zod
@runiq/core        // No Zod, just types
```

**Estimated Savings:** 20-25 KB for renderer-only apps

---

### 6. **Duplicate Shape Metadata**

**Impact: LOW-MEDIUM** - 3-5 KB

**Current:**
Each shape includes comments, categories, descriptions:

```typescript
export const rectangleShape: ShapeDefinition = {
  id: 'rectangle',
  // Stored in bundle but only used in editor
  category: 'basic',
  description: 'Simple rectangle',
  ...
}
```

**Recommendation:**

```typescript
// Separate metadata for editor
export const shapeMetadata: Record<string, ShapeMetadata> = {
  rectangle: { category: 'basic', description: '...' }
};

// Core shape def (minimal)
export const rectangleShape: ShapeDefinition = {
  id: 'rectangle',
  bounds: (ctx) => ...,
  render: (ctx, pos) => ...
};
```

**Estimated Savings:** 3-5 KB

---

### 7. **Source Maps in Production**

**Impact: LOW** - Storage only, not bundle size

**Current:**

```typescript
sourcemap: true,  // Always generates
```

**Recommendation:**

```typescript
sourcemap: process.env.NODE_ENV !== 'production',
```

---

## 🟢 Low Priority / Future Optimizations

### 8. **Code Splitting for Large Packages**

Currently single bundles. Could split:

- Shapes by category (basic, uml, bpmn, etc.)
- Renderers (svg, schematic)
- Layout engines

### 9. **SVG Path Optimization**

Some shapes have verbose SVG paths that could be optimized

### 10. **Icon Registry**

FontAwesome icons add ~10 KB, could be optional

---

## Recommended Implementation Priority

### Phase 1: Quick Wins (1-2 hours)

1. ✅ Enable minification
2. ✅ Add sideEffects declaration
3. ✅ Split text measurement (platform-specific)

**Expected Savings:** 100-130 KB (33-40%)

### Phase 2: Tree-Shaking (4-6 hours)

1. ✅ Add subpath exports for shape categories
2. ✅ Create selective registration functions
3. ✅ Update documentation

**Expected Savings:** 150-200 KB for minimal apps

### Phase 3: Optional Dependencies (2-3 hours)

1. ✅ Make Zod optional / separate package
2. ✅ Lazy-load icon registry

**Expected Savings:** 20-30 KB

### Phase 4: Metadata Optimization (3-4 hours)

1. ✅ Separate shape metadata
2. ✅ Create editor-specific bundle

**Expected Savings:** 5-10 KB

---

## Example Package Structure (After Optimization)

```
@runiq/core/
├── dist/
│   ├── index.js (35 KB)         # Core types + registries only
│   ├── shapes/
│   │   ├── basic/index.js (15 KB)
│   │   ├── flowchart/index.js (18 KB)
│   │   ├── uml/index.js (25 KB)
│   │   ├── bpmn/index.js (20 KB)
│   │   ├── aws/index.js (12 KB)
│   │   └── ... (8 more categories)
│   ├── text-browser.js (8 KB)
│   └── text-node.js (2 KB)
```

**Total unminified:**

- Core only: ~35 KB
- With basic shapes: ~50 KB
- With all shapes: ~250 KB (minified)

**Current:** 303 KB unminified, everything bundled

---

## Comparison with Similar Libraries

| Library               | Core Size  | With All Features |
| --------------------- | ---------- | ----------------- |
| Mermaid               | ~150 KB    | ~800 KB           |
| D3.js                 | ~70 KB     | ~250 KB           |
| PlantUML (JS)         | ~200 KB    | ~2 MB             |
| **Runiq (current)**   | **304 KB** | **304 KB**        |
| **Runiq (optimized)** | **~35 KB** | **~250 KB**       |

---

## Testing Strategy

1. **Bundle Analysis:**

   ```bash
   pnpm add -D rollup-plugin-visualizer
   # Add to tsup config for visualization
   ```

2. **Size Regression Tests:**

   ```bash
   # Add to CI
   pnpm run build
   size=$(stat -f%z dist/index.js)
   if [ $size -gt 300000 ]; then
     echo "Bundle too large!"
     exit 1
   fi
   ```

3. **Tree-Shaking Verification:**
   ```bash
   # Test app that imports one shape
   # Verify bundle doesn't include others
   ```

---

## Migration Guide (For Phase 2)

### Before:

```typescript
import { registerDefaultShapes } from '@runiq/core';
registerDefaultShapes();
```

### After (Selective):

```typescript
import { registerBasicShapes } from '@runiq/core/shapes/basic';
import { registerUMLShapes } from '@runiq/core/shapes/uml';

registerBasicShapes();
registerUMLShapes();
```

### After (Individual):

```typescript
import { rectangleShape, circleShape } from '@runiq/core/shapes/basic';
import { shapeRegistry } from '@runiq/core';

shapeRegistry.register(rectangleShape);
shapeRegistry.register(circleShape);
```

---

## Additional Considerations

### Electrical/Schematic Shapes

These are currently in `@runiq/renderer-schematic` (61 KB). Good separation!
Could apply same optimization patterns.

### Parser Package

`@runiq/parser-dsl` likely the largest due to Langium. Consider:

- Lazy loading grammar
- WASM compilation for smaller bundle
- Separate parser worker for browser

### Documentation Impact

- Update getting-started guides
- Add "bundle size" section
- Show examples of minimal imports

---

## Conclusion

**Current bundle:** 304 KB unminified, no tree-shaking
**Optimized (Phase 1):** ~200 KB minified, tree-shakable
**Optimized (Phase 2-4):** 35-250 KB depending on usage

**Recommended approach:**

1. Start with Phase 1 (quick wins, minimal breaking changes)
2. Implement Phase 2 in v0.2.0 (breaking changes acceptable pre-1.0)
3. Phase 3-4 as continuous improvements

Would reduce bundle size by **60-88%** for typical applications while maintaining full functionality for those who need it.
