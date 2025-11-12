/**
 * Basic usage examples for @runiq/glyphsets
 */

import { glyphsetRegistry, horizontalProcessGlyphSet } from '../src/index.js';

console.log('=== GlyphSets Basic Usage Examples ===\n');

// Example 1: Direct generator usage
console.log('Example 1: Direct usage');
const diagram1 = horizontalProcessGlyphSet.generator({
  steps: ['Research', 'Design', 'Develop', 'Test', 'Deploy'],
});
console.log('Generated nodes:', diagram1.nodes?.length);
console.log('Generated edges:', diagram1.edges?.length);
console.log('Direction:', diagram1.direction);
console.log('First node:', diagram1.nodes?.[0]);
console.log();

// Example 2: Registry usage
console.log('Example 2: Via registry');
const glyphset = glyphsetRegistry.get('horizontal-process');
if (glyphset) {
  const diagram2 = glyphset.generator({
    steps: ['Plan', 'Execute', 'Review'],
  });
  console.log('Generated diagram with', diagram2.nodes?.length, 'nodes');
}
console.log();

// Example 3: Custom shape
console.log('Example 3: Custom shape');
const diagram3 = horizontalProcessGlyphSet.generator({
  steps: ['Start', 'Middle', 'End'],
  shape: 'hexagon',
});
console.log('Node shape:', diagram3.nodes?.[0].shape);
console.log();

// Example 4: Using containers (integrates with Container Templates)
console.log('Example 4: With containers and templates');
const diagram4 = horizontalProcessGlyphSet.generator({
  steps: ['Intake', 'Process', 'Output'],
  useContainers: true,
});
console.log('Generated containers:', diagram4.containers?.length);
console.log('Container templates defined:', diagram4.templates?.length);
console.log('Template ID:', diagram4.templates?.[0].id);
console.log('Container uses template:', diagram4.containers?.[0].containerStyle?.templateId);
console.log();

// Example 5: List all registered glyphsets
console.log('Example 5: Registry inspection');
console.log('All glyphsets:', glyphsetRegistry.getAllIds());
console.log('Process glyphsets:', glyphsetRegistry.list('process').map((g) => g.id));
console.log();

// Example 6: Glyphset metadata
console.log('Example 6: Glyphset metadata');
console.log('ID:', horizontalProcessGlyphSet.id);
console.log('Name:', horizontalProcessGlyphSet.name);
console.log('Category:', horizontalProcessGlyphSet.category);
console.log('Description:', horizontalProcessGlyphSet.description);
console.log('Min items:', horizontalProcessGlyphSet.minItems);
console.log('Max items:', horizontalProcessGlyphSet.maxItems);
console.log('Parameters:', horizontalProcessGlyphSet.parameters.map((p) => p.name));
