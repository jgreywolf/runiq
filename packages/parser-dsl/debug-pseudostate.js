import { parse } from './dist/index.js';
import { readFileSync } from 'fs';

const examples = [
  '../../examples/state-machine-media-player-history.runiq',
  '../../examples/state-machine-workflow-junction-entryexit.runiq',
  '../../examples/state-machine-terminate-error-handling.runiq',
];

examples.forEach((file) => {
  console.log(`\n=== Testing ${file} ===`);
  const dsl = readFileSync(file, 'utf8');
  const result = parse(dsl);
  console.log(`Errors: ${result.errors.length}`);
  if (result.errors.length > 0) {
    console.log('Error details:', JSON.stringify(result.errors, null, 2));
  }
  console.log(`Nodes: ${result.diagram?.nodes?.length}`);
  console.log(`Edges: ${result.diagram?.edges?.length}`);
});
