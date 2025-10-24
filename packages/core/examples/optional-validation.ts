/**
 * Example: Using optional validation
 *
 * Phase 3 optimization makes Zod validation optional.
 * Import validation only when needed to save ~25 KB from bundle.
 */

// Example 1: Without validation (smallest bundle)
import { shapeRegistry, registerBasicShapes } from '@runiq/core';
import type { DiagramAst } from '@runiq/core';

registerBasicShapes();

// Manually construct AST without validation
const diagram: DiagramAst = {
  astVersion: '1.0',
  nodes: [
    { id: 'A', shape: 'rectangle', label: 'Start' },
    { id: 'B', shape: 'circle', label: 'End' },
  ],
  edges: [{ from: 'A', to: 'B' }],
};
// Bundle size: ~40 KB (core + basic shapes, no Zod)

// Example 2: With validation (when parsing untrusted data)
import { validateDiagram } from '@runiq/core/validation';

const untrustedData = {
  astVersion: '1.0',
  nodes: [{ id: 'A', shape: 'unknown' }],
  edges: [],
};

const result = validateDiagram(untrustedData);

if (result.success) {
  console.log('Valid diagram:', result.data);
} else {
  console.error('Validation errors:', result.problems);
}
// Bundle size: ~65 KB (core + basic shapes + Zod validation)

// Example 3: Conditional validation (development only)
const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment) {
  // Only validate in development
  const { validateDiagram } = await import('@runiq/core/validation');
  const result = validateDiagram(diagram);
  if (!result.success) {
    throw new Error(`Invalid diagram: ${result.problems.join(', ')}`);
  }
}
// Production bundle: ~40 KB (validation tree-shaken)
// Development: ~65 KB (validation included)

/**
 * When to use validation:
 *
 * ✅ Parsing user input or external data
 * ✅ API responses that might be malformed
 * ✅ Development/testing environments
 *
 * ❌ Statically-typed, internally-generated diagrams
 * ❌ Performance-critical rendering loops
 * ❌ Production bundles where you trust the data
 */
