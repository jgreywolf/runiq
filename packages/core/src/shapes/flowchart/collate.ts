import type { ShapeDefinition } from '../../types/index.js';
import { hourglassShape } from '../special/hourglass.js';

/**
 * Collate - hourglass/bow-tie symbol for collation
 */
export const collateShape: ShapeDefinition = {
  ...hourglassShape,
  id: 'collate',
};
