import type { Direction, NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * Column List GlyphSet
 *
 * Generates a multi-column list distributing items evenly across columns.
 * Similar to PowerPoint SmartArt multi-column layouts.
 * Items are distributed evenly across 2-3 columns.
 *
 * @example
 * ```runiq
 * glyphset columnList "Team Skills" {
 *   item "TypeScript"
 *   item "React"
 *   item "Node.js"
 *   item "Python"
 *   item "AWS"
 *   item "Docker"
 * }
 * ```
 */
export const columnListGlyphSet: GlyphSetDefinition = {
  id: 'columnList',
  name: 'Column List',
  category: 'list',
  description: 'Multi-column list distributing items evenly across columns',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of list items (minimum 4 items)',
    },
    {
      name: 'columns',
      type: 'number',
      required: false,
      description: 'Number of columns (2 or 3, default: 2)',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      description:
        'Color theme (professional, forest, sunset, ocean, monochrome)',
    },
  ],

  minItems: 4,
  maxItems: 12,

  tags: ['list', 'columns', 'multi-column', 'grid', 'distributed'],

  generator: (params) => {
    const items = params.items as string[] | undefined;
    const columns = (params.columns as number) || 2;
    const theme = params.theme as string | undefined;

    // Validation
    if (!items || !Array.isArray(items)) {
      throw new GlyphSetError(
        'columnList',
        'items',
        'Parameter "items" must be an array of strings'
      );
    }

    if (items.length < 4) {
      throw new GlyphSetError(
        'columnList',
        'items',
        'Column list requires at least 4 items'
      );
    }

    if (items.length > 12) {
      throw new GlyphSetError(
        'columnList',
        'items',
        'Column list supports maximum 12 items (for readability)'
      );
    }

    if (columns < 2 || columns > 3) {
      throw new GlyphSetError(
        'columnList',
        'columns',
        'Number of columns must be 2 or 3'
      );
    }

    // Generate a single node with the columnList shape
    // Pass all items and column info as data
    const nodes: NodeAst[] = [
      {
        id: 'columnList',
        shape: 'columnList',
        label: '', // No label on the container
        data: {
          items,
          columns,
          theme,
        },
      },
    ];

    return {
      astVersion: '1.0',
      direction: 'TB' as Direction,
      nodes,
      edges: [],
    };
  },
};
