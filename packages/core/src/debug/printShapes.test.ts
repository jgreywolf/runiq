import { test } from 'vitest';
import { shapeRegistry } from '../registries';
import { registerDefaultShapes } from '../shapes';

test.skip('print registered shapes', () => {
  registerDefaultShapes();
  const ids = shapeRegistry
    .list()
    .map((s) => s.id)
    .sort();
  // Print to stdout for manual inspection in test output
  // eslint-disable-next-line no-console
  console.log('REGISTERED_SHAPE_IDS_START');
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(ids, null, 2));
  // eslint-disable-next-line no-console
  console.log('REGISTERED_SHAPE_IDS_END');
});
