/**
 * Showcase all available GlyphSets
 */

import { glyphsetRegistry } from '../src/index.js';

console.log('=== All GlyphSets Showcase ===\n');

// Get all registered glyphsets
const allGlyphSets = glyphsetRegistry.list();
console.log(`Total glyphsets registered: ${allGlyphSets.length}\n`);

// Group by category
const categories = ['process', 'hierarchy', 'comparison', 'visualization'];

categories.forEach((category) => {
  console.log(`\n📁 ${category.toUpperCase()}`);
  console.log('─'.repeat(50));

  const categoryGlyphSets = glyphsetRegistry.list(category as any);

  categoryGlyphSets.forEach((glyphset) => {
    console.log(`\n✨ ${glyphset.name} (${glyphset.id})`);
    console.log(`   ${glyphset.description}`);
    console.log(`   Items: ${glyphset.minItems}-${glyphset.maxItems}`);
    console.log(
      `   Parameters: ${glyphset.parameters.map((p) => p.name).join(', ')}`
    );

    // Show example
    console.log(`   Example:`);
    try {
      let result;
      switch (glyphset.id) {
        case 'basicProcess':
          result = glyphset.generator({
            steps: ['Step 1', 'Step 2', 'Step 3'],
          });
          console.log(
            `     → Generated ${result.nodes?.length} nodes, ${result.edges?.length} edges`
          );
          break;

        case 'cycle':
          result = glyphset.generator({
            steps: ['Plan', 'Do', 'Check', 'Act'],
          });
          console.log(
            `     → Generated ${result.nodes?.length} nodes (cyclic)`
          );
          break;

        case 'pyramid':
          result = glyphset.generator({
            levels: ['Top', 'Middle', 'Bottom'],
          });
          console.log(`     → Generated ${result.nodes?.length} levels`);
          break;

        case 'matrix':
          result = glyphset.generator({
            quadrants: ['Q1', 'Q2', 'Q3', 'Q4'],
          });
          console.log(
            `     → Generated ${result.containers?.length} quadrants`
          );
          break;

        case 'venn':
          result = glyphset.generator({
            circles: ['Set A', 'Set B', 'Set C'],
          });
          console.log(`     → Generated ${result.nodes?.length} circles`);
          break;

        case 'funnel':
          result = glyphset.generator({
            stages: ['Awareness', 'Interest', 'Decision'],
          });
          console.log(`     → Generated ${result.nodes?.length} stages`);
          break;

        case 'timeline':
          result = glyphset.generator({
            events: ['Q1', 'Q2', 'Q3', 'Q4'],
          });
          console.log(`     → Generated ${result.nodes?.length} events`);
          break;
      }
    } catch (err) {
      console.log(`     ⚠ ${(err as Error).message}`);
    }
  });
});

// Summary statistics
console.log('\n\n📊 SUMMARY');
console.log('─'.repeat(50));
console.log(
  `Process glyphsets:      ${glyphsetRegistry.list('process').length}`
);
console.log(
  `Hierarchy glyphsets:    ${glyphsetRegistry.list('hierarchy').length}`
);
console.log(
  `Comparison glyphsets:   ${glyphsetRegistry.list('comparison').length}`
);
console.log(
  `Visualization glyphsets: ${glyphsetRegistry.list('visualization').length}`
);
console.log(`\nTotal:                  ${allGlyphSets.length}`);

// Show all IDs
console.log('\n\n🔑 ALL GLYPHSET IDS:');
console.log(glyphsetRegistry.getAllIds().join(', '));
