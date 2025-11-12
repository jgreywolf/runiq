import type { DiagramAst, NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * Basic List GlyphSet
 *
 * Generates a vertical list of items with styled boxes.
 * Similar to PowerPoint SmartArt "Basic Block List" pattern.
 *
 * @example
 * ```runiq
 * glyphset basicList "Key Features" {
 *   item "Fast performance"
 *   item "Easy to use"
 *   item "Highly scalable"
 *   item "Open source"
 * }
 * ```
 */
export const basicListGlyphSet: GlyphSetDefinition = {
  id: 'basicList',
  name: 'Basic List',
  category: 'list',
  description: 'Vertical list of items with styled boxes',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of list items (minimum 2 items)',
    },
  ],

  minItems: 2,
  maxItems: 10,

  tags: ['list', 'bullet', 'items', 'features'],

  generator: (params) => {
    const items = params.items as string[] | undefined;

    // Validation
    if (!items || !Array.isArray(items)) {
      throw new GlyphSetError('basicList', 'items', 'Parameter "items" must be an array of strings');
    }

    if (items.length < 2) {
      throw new GlyphSetError(
        'basicList',
        'items',
        'Basic list requires at least 2 items'
      );
    }

    if (items.length > 10) {
      throw new GlyphSetError(
        'basicList',
        'items',
        'Basic list supports maximum 10 items (for readability)'
      );
    }

    // Generate nodes with SmartArt-style processBox shape
    const nodes: NodeAst[] = items.map((label, i) => ({
      id: `item${i + 1}`,
      shape: 'processBox',
      label,
    }));

    return {
      astVersion: '1.0',
      direction: 'TB', // Top-to-bottom for list
      nodes,
      edges: [], // No connections - just a list
    };
  },
};
