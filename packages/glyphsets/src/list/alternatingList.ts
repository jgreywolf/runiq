import type { NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

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
  ],

  minItems: 3,
  maxItems: 8,

  tags: ['list', 'alternating', 'zigzag', 'dynamic', 'timeline', 'flow'],

  generator: (params) => {
    const items = params.items as string[] | undefined;

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

    // Generate nodes with alternating position information
    // Even indices (0, 2, 4...) go left, odd indices (1, 3, 5...) go right
    const nodes: NodeAst[] = items.map((label, i) => {
      const position = i % 2 === 0 ? 'left' : 'right';

      return {
        id: `item${i + 1}`,
        shape: 'processBox',
        label,
        data: {
          position,
          index: i,
          total: items.length,
        },
      };
    });

    return {
      astVersion: '1.0',
      direction: 'TB', // Top-to-bottom with alternating left/right
      nodes,
      edges: [], // No connections - just a list
    };
  },
};
