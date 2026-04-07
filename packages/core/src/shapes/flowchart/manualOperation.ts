import type { ShapeDefinition } from '../../types/index.js';
import { flippedTrapezoidShape } from '../basic/trapezoid.js';

/**
 * Manual Operation - trapezoid with wider top edge
 */
export const manualOperationShape: ShapeDefinition = {
  ...flippedTrapezoidShape,
  id: 'manualOperation',
};
