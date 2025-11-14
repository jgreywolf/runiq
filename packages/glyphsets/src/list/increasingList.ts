import type { NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * Increasing List GlyphSet
 *
 * Generates a list where items progressively increase in size.
 * Similar to PowerPoint SmartArt "Increasing Circle Process" pattern.
 * Creates a visual emphasis progression from small to large.
 *
 * @example
 * ```runiq
 * glyphset increasingList "Priority Levels" {
 *   item "Minor"
 *   item "Moderate"
 *   item "Important"
 *   item "Critical"
 * }
 * ```
 */
export const increasingListGlyphSet: GlyphSetDefinition = {
  id: 'increasingList',
  name: 'Increasing List',
  category: 'list',
  description:
    'List with progressively larger items showing increasing emphasis',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of list items (minimum 3 items)',
    },
    {
      name: 'shape',
      type: 'string',
      required: false,
      description: 'Shape type: circle (default) or box',
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
  maxItems: 6,

  tags: ['list', 'increasing', 'progressive', 'emphasis', 'priority', 'growth'],

  generator: (params) => {
    const items = params.items as string[] | undefined;
    const shapeType = (params.shape as string) || 'circle';
    const theme = params.theme as string | undefined;

    // Validation
    if (!items || !Array.isArray(items)) {
      throw new GlyphSetError(
        'increasingList',
        'items',
        'Parameter "items" must be an array of strings'
      );
    }

    if (items.length < 3) {
      throw new GlyphSetError(
        'increasingList',
        'items',
        'Increasing list requires at least 3 items'
      );
    }

    if (items.length > 6) {
      throw new GlyphSetError(
        'increasingList',
        'items',
        'Increasing list supports maximum 6 items (for visual clarity)'
      );
    }

    if (shapeType !== 'circle' && shapeType !== 'box') {
      throw new GlyphSetError(
        'increasingList',
        'shape',
        'Shape must be either "circle" or "box"'
      );
    }

    // Generate a single node with the increasingList shape
    const nodes: NodeAst[] = [
      {
        id: 'increasingList',
        shape: 'increasingList',
        label: '',
        data: {
          items,
          shape: shapeType,
          theme,
        },
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
