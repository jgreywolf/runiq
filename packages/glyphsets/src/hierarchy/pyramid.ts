import type { Direction, NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * Pyramid GlyphSet
 *
 * Generates a hierarchical pyramid structure with levels from top to bottom.
 * Uses the existing pyramid shape for rendering beautiful, SmartArt-style pyramids.
 * Similar to PowerPoint SmartArt "Basic Pyramid" pattern.
 *
 * @example
 * ```runiq
 * glyphset pyramid "Maslow's Hierarchy" {
 *   level "Self-Actualization"
 *   level "Esteem"
 *   level "Love/Belonging"
 *   level "Safety"
 *   level "Physiological"
 * }
 * ```
 */
export const pyramidGlyphSet: GlyphSetDefinition = {
  id: 'pyramid',
  name: 'Pyramid',
  category: 'hierarchy',
  description: 'Hierarchical pyramid structure with levels from top to bottom',

  parameters: [
    {
      name: 'levels',
      type: 'array',
      required: true,
      description: 'Array of level labels (minimum 3 levels)',
    },
    {
      name: 'showValues',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Show numeric values on levels',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      description:
        'Color theme (professional, forest, sunset, ocean, monochrome)',
    },
  ],

  minItems: 3,
  maxItems: 8,

  tags: ['hierarchy', 'pyramid', 'levels', 'structure'],

  generator: (params) => {
    const levels = params.levels as string[] | undefined;
    const showValues = (params.showValues as boolean | undefined) ?? false;
    const theme = params.theme as string | undefined;

    // Validation
    if (!levels || !Array.isArray(levels)) {
      throw new GlyphSetError(
        'pyramid',
        'levels',
        'Parameter "levels" must be an array of strings'
      );
    }

    if (levels.length < 3) {
      throw new GlyphSetError(
        'pyramid',
        'levels',
        'Pyramid requires at least 3 levels to show hierarchy'
      );
    }

    if (levels.length > 8) {
      throw new GlyphSetError(
        'pyramid',
        'levels',
        'Pyramid supports maximum 8 levels (for readability)'
      );
    }

    // Generate a single node using the pyramid shape
    // The pyramid shape renders all levels internally with beautiful styling
    // For hierarchy: top level is smallest (narrow), bottom level is largest (wide)
    const pyramidData = {
      levels: levels.map((label, i) => ({
        label,
        value: i + 1, // Ascending values (top = 1 (narrow), bottom = n (wide))
      })),
      showValues,
      theme,
    };

    const nodes: NodeAst[] = [
      {
        id: 'pyramid',
        shape: 'pyramid', // Use existing pyramid shape for rendering!
        label: '', // Label handled by shape rendering
        data: pyramidData,
      },
    ];

    return {
      astVersion: '1.0',
      direction: 'TB' as Direction,
      nodes,
      edges: [], // No edges - pyramid shape is self-contained
    };
  },
};
