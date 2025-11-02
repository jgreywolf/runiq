import { parse } from './dist/index.js';
import fs from 'fs';

const examples = [
  'activity-swimlanes-horizontal',
  'activity-swimlanes-vertical',
  'activity-swimlanes-release-pipeline'
];

examples.forEach(name => {
  const dsl = fs.readFileSync(`examples/${name}.runiq`, 'utf8');
  const result = parse(dsl);
  console.log(`${name}:`);
  console.log(`  Success: ${result.success}`);
  console.log(`  Errors: ${result.errors.length}`);
  console.log(`  Nodes: ${result.diagram?.nodes?.length || 0}`);
  console.log(`  Edges: ${result.diagram?.edges?.length || 0}`);
  console.log(`  Containers: ${result.diagram?.containers?.length || 0}`);
  if (result.errors.length > 0) {
    result.errors.forEach(err => console.log(`    Error: ${err.message}`));
  }
  console.log('');
});
