import type { NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';
import type { ColorTheme } from '../themes.js';

/**
 * Alternating List GlyphSet
 *
 * Generates a list with items alternating between left and right positions.
 * Similar to PowerPoint SmartArt "Alternating Flow" or zigzag layouts.
 * Creates a dynamic visual flow pattern.
 *
 * @example
 * ```runiq
 * glyphset alternatingList "Development Timeline" {
 *   item "Q1: Planning"
 *   item "Q2: Development"
 *   item "Q3: Testing"
 *   item "Q4: Launch"
 * }
 * ```
 */
export const alternatingListGlyphSet: GlyphSetDefinition = {
  id: 'alternatingList',
  name: 'Alternating List',
  category: 'list',
  description: 'List with items alternating left and right in a zigzag pattern',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of list items (minimum 3 items)',
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

  tags: ['list', 'alternating', 'zigzag', 'dynamic', 'timeline', 'flow'],

  generator: (params) => {
    const items = params.items as string[] | undefined;
    const theme = (params.theme as ColorTheme | undefined) || 'professional';

    // Validation
    if (!items || !Array.isArray(items)) {
      throw new GlyphSetError(
        'alternatingList',
        'items',
        'Parameter "items" must be an array of strings'
      );
    }

    if (items.length < 3) {
      throw new GlyphSetError(
        'alternatingList',
        'items',
        'Alternating list requires at least 3 items'
      );
    }

    if (items.length > 8) {
      throw new GlyphSetError(
        'alternatingList',
        'items',
        'Alternating list supports maximum 8 items (for readability)'
      );
    }

    // Generate a single node that will render the entire alternating list
    // Similar to alternatingProcess but without connecting arrows
    const nodes: NodeAst[] = [
      {
        id: 'alternatingList',
        shape: 'alternatingList',
        label: '',
        data: {
          items,
          theme,
        },
      },
    ];

    return {
      astVersion: '1.0',
      nodes,
      edges: [],
    };
  },
};
