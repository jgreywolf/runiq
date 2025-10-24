/**
 * Example: Platform-specific text measurement
 * 
 * Phase 4 optimization provides separate implementations for browser and Node.js
 */

// Example 1: Auto-detection (default behavior)
import { measureText } from '@runiq/core';

// Automatically uses:
// - Browser: Canvas API (accurate, ~5-8 KB)  
// - Node.js: Heuristic (fast, ~2-3 KB)
const size = measureText('Hello World', { fontSize: 16 });
console.log(size); // { width: number, height: number }

// Example 2: Explicit browser implementation (for SSR hydration consistency)
import { measureText as browserMeasureText } from '@runiq/core/text-measurement/browser';

// Always use canvas measurement (browser-only!)
const browserSize = browserMeasureText('Hello', { fontSize: 14 });
// Throws error in Node.js environment

// Example 3: Explicit Node.js implementation (for predictable SSR)
import { measureText as nodeMeasureText } from '@runiq/core/text-measurement/node';

// Lightweight heuristic-based measurement
// Works in both browser and Node.js, but less accurate in browser
const nodeSize = nodeMeasureText('Hello', { fontSize: 14 });
// Bundle size: ~2-3 KB (much smaller than canvas)

/**
 * Use Cases:
 * 
 * Auto-detection (default):
 * ✅ Most applications
 * ✅ Client-side rendering
 * ✅ Simple Node.js usage
 * 
 * Browser explicit:
 * ✅ When you need maximum accuracy
 * ✅ Browser-only applications
 * ✅ SSR hydration matching (client-side)
 * 
 * Node.js explicit:
 * ✅ Server-side rendering (smaller bundle)
 * ✅ CLI tools
 * ✅ When speed > accuracy
 * ✅ Smaller bundle size critical
 */

// Example 4: SSR pattern with both implementations
// Server (Node.js)
import { measureText as serverMeasure } from '@runiq/core/text-measurement/node';
const serverSize = serverMeasure('Title', { fontSize: 20 });

// Client (Browser) - matches server for hydration
import { measureText as clientMeasure } from '@runiq/core/text-measurement/node';
// Use same implementation for consistent measurements
const clientSize = clientMeasure('Title', { fontSize: 20 });
// serverSize === clientSize (pixel-perfect match)
