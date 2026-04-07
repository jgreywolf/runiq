import type { ShapeDefinition } from '../../types/index.js';
import { triangleShape } from '../basic/triangle.js';

/**
 * Extract - upward-pointing triangle for extraction or separation
 */
export const extractShape: ShapeDefinition = {
  ...triangleShape,
  id: 'extract',
};
