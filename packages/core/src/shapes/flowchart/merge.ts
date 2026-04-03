import type { ShapeDefinition } from '../../types/index.js';
import { flippedTriangleShape } from '../basic/flippedTriangle.js';

/**
 * Merge - downward-pointing triangle used to combine multiple paths
 */
export const mergeShape: ShapeDefinition = {
  ...flippedTriangleShape,
  id: 'merge',
};
