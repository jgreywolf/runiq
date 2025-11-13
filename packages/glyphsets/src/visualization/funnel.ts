import { GlyphSetError, type GlyphSetDefinition } from '../types.js';
import { invertedPyramidGlyphSet } from '../hierarchy/invertedPyramid.js';

/**
 * Funnel GlyphSet (Alias for Inverted Pyramid)
 *
 * Generates a funnel visualization showing progressive filtering or conversion.
 * This is an alias for invertedPyramid with 'stage' keyword support.
 * Similar to PowerPoint SmartArt "Basic Funnel" pattern.
 *
 * @example
 * ```runiq
 * glyphset funnel "Sales Funnel" {
 *   stage "Awareness (1000)"
 *   stage "Interest (500)"
 *   stage "Consideration (200)"
 *   stage "Purchase (50)"
 * }
 * ```
 */
export const funnelGlyphSet: GlyphSetDefinition = {
  id: 'funnel',
  name: 'Funnel',
  category: 'visualization',
  description:
    'Funnel visualization showing progressive filtering or conversion stages (alias for invertedPyramid)',

  parameters: [
    {
      name: 'stages',
      type: 'array',
      required: true,
      description:
        'Array of stage labels (supports both "stage" and "level" keywords)',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      default: 'professional',
      description: 'Color theme: professional, colorful, warm, cool, vibrant',
    },
  ],

  minItems: 3,
  maxItems: 8,

  tags: [
    'funnel',
    'conversion',
    'stages',
    'filter',
    'pipeline',
    'inverted',
    'pyramid',
  ],

  generator: (params) => {
    // Map 'stages' parameter to 'levels' for invertedPyramid compatibility
    const stages = params.stages as string[] | undefined;
    const levels = params.levels as string[] | undefined;

    // Use stages if provided, otherwise use levels
    const levelsArray = stages || levels;

    if (!levelsArray || !Array.isArray(levelsArray)) {
      throw new GlyphSetError(
        'funnel',
        'stages',
        'Parameter "stages" (or "levels") must be an array of strings'
      );
    }

    // Delegate to invertedPyramid generator with mapped parameters
    const invertedParams = {
      ...params,
      levels: levelsArray,
    };

    // Use the invertedPyramid generator
    const result = invertedPyramidGlyphSet.generator(invertedParams);

    // Update node ID to reflect funnel
    if (result.nodes && result.nodes.length > 0) {
      result.nodes[0].id = 'funnel';
    }

    return result;
  },
};
