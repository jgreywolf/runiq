import type { NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * Horizontal List GlyphSet
 *
 * Generates a horizontal list of items with styled boxes arranged left-to-right.
 * Similar to PowerPoint SmartArt "Horizontal Bullet List" pattern.
 *
 * @example
 * ```runiq
 * glyphset horizontalList "Project Phases" {
 *   item "Planning"
 *   item "Development"
 *   item "Testing"
 *   item "Deployment"
 * }
 * ```
 */
export const horizontalListGlyphSet: GlyphSetDefinition = {
  id: 'horizontalList',
  name: 'Horizontal List',
  category: 'list',
  description:
    'Horizontal list of items with styled boxes arranged left-to-right',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of list items (minimum 2 items)',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      description:
        'Color theme (professional, forest, sunset, ocean, monochrome)',
    },
  ],

  minItems: 2,
  maxItems: 10,

  tags: ['list', 'horizontal', 'bullet', 'items', 'features'],

  generator: (params) => {
    const items = params.items as string[] | undefined;
    const theme = params.theme as string | undefined;

    // Validation
    if (!items || !Array.isArray(items)) {
      throw new GlyphSetError(
        'horizontalList',
        'items',
        'Parameter "items" must be an array of strings'
      );
    }

    if (items.length < 2) {
      throw new GlyphSetError(
        'horizontalList',
        'items',
        'Horizontal list requires at least 2 items'
      );
    }

    if (items.length > 10) {
      throw new GlyphSetError(
        'horizontalList',
        'items',
        'Horizontal list supports maximum 10 items (for readability)'
      );
    }

    // Generate a single node with the horizontalList shape
    const nodes: NodeAst[] = [
      {
        id: 'horizontalList',
        shape: 'horizontalList',
        label: '',
        data: { items, theme },
      },
    ];

    return {
      astVersion: '1.0',
      direction: 'LR',
      nodes,
      edges: [],
    };
  },
};
