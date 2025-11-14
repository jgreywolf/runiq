import type { NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * Chevron List GlyphSet
 *
 * Generates a list of items with chevron (arrow) shapes showing progression.
 * Similar to PowerPoint SmartArt "Vertical Chevron List" or "Chevron List" patterns.
 * Each item is an arrow pointing right, creating a sense of forward movement.
 *
 * @example
 * ```runiq
 * glyphset chevronList "Sales Pipeline" {
 *   item "Prospecting"
 *   item "Qualification"
 *   item "Proposal"
 *   item "Negotiation"
 *   item "Closing"
 * }
 * ```
 */
export const chevronListGlyphSet: GlyphSetDefinition = {
  id: 'chevronList',
  name: 'Chevron List',
  category: 'list',
  description:
    'Progressive list with chevron/arrow shapes showing directional flow',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of list items (minimum 2 items)',
    },
    {
      name: 'direction',
      type: 'string',
      required: false,
      description:
        'Layout direction: TB (vertical, default) or LR (horizontal)',
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
  maxItems: 8,

  tags: ['list', 'chevron', 'arrow', 'progressive', 'pipeline', 'stages'],

  generator: (params) => {
    const items = params.items as string[] | undefined;
    const direction = (params.direction as string) || 'TB';
    const theme = params.theme as string | undefined;

    // Validation
    if (!items || !Array.isArray(items)) {
      throw new GlyphSetError(
        'chevronList',
        'items',
        'Parameter "items" must be an array of strings'
      );
    }

    if (items.length < 2) {
      throw new GlyphSetError(
        'chevronList',
        'items',
        'Chevron list requires at least 2 items'
      );
    }

    if (items.length > 8) {
      throw new GlyphSetError(
        'chevronList',
        'items',
        'Chevron list supports maximum 8 items (for readability)'
      );
    }

    if (direction !== 'TB' && direction !== 'LR') {
      throw new GlyphSetError(
        'chevronList',
        'direction',
        'Direction must be either "TB" (vertical) or "LR" (horizontal)'
      );
    }

    // Generate a single node with the chevronList shape
    const nodes: NodeAst[] = [
      {
        id: 'chevronList',
        shape: 'chevronList',
        label: '',
        data: {
          items,
          direction,
          theme,
        },
      },
    ];

    return {
      astVersion: '1.0',
      direction,
      nodes,
      edges: [],
    };
  },
};
