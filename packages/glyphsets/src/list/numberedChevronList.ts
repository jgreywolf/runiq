import type { NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * Numbered Chevron List GlyphSet
 *
 * Generates a vertical list of numbered chevrons with labels and optional descriptions.
 * Similar to PowerPoint SmartArt "Vertical Chevron List" pattern with numbers.
 * Each chevron displays a number (01, 02, 03...) with a label beside it,
 * and optionally a description text box to the right.
 *
 * @example
 * ```runiq
 * glyphset numberedChevronList "Process Steps" {
 *   item "Planning" "Define project scope and objectives"
 *   item "Design" "Create detailed technical specifications"
 *   item "Development" "Build and implement the solution"
 *   item "Testing" "Validate functionality and performance"
 * }
 * ```
 */
export const numberedChevronListGlyphSet: GlyphSetDefinition = {
  id: 'numberedChevronList',
  name: 'Numbered Chevron List',
  category: 'list',
  description:
    'Vertical list with numbered chevrons, labels, and optional descriptions',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description:
        'Array of list items with optional descriptions (minimum 2 items)',
    },
    {
      name: 'colorScheme',
      type: 'string',
      required: false,
      description:
        'Color scheme: multi (different colors per item, default) or single (one color)',
    },
  ],

  minItems: 2,
  maxItems: 8,

  tags: [
    'list',
    'chevron',
    'numbered',
    'steps',
    'process',
    'vertical',
    'descriptions',
  ],

  generator: (params) => {
    const items = params.items as string[] | undefined;
    const colorScheme = (params.colorScheme as string) || 'multi';

    // Validation
    if (!items || !Array.isArray(items)) {
      throw new GlyphSetError(
        'numberedChevronList',
        'items',
        'Parameter "items" must be an array of strings'
      );
    }

    if (items.length < 2) {
      throw new GlyphSetError(
        'numberedChevronList',
        'items',
        'Numbered chevron list requires at least 2 items'
      );
    }

    if (items.length > 8) {
      throw new GlyphSetError(
        'numberedChevronList',
        'items',
        'Numbered chevron list supports maximum 8 items (for readability)'
      );
    }

    // Parse items - each item can have format "Label" or "Label|Description"
    const parsedItems = items.map((item) => {
      const parts = item.split('|');
      return {
        label: parts[0].trim(),
        description: parts[1]?.trim() || '',
      };
    });

    // Create a single node that will render the entire numbered chevron list
    const nodes: NodeAst[] = [
      {
        id: 'numberedChevronList',
        shape: 'numberedChevronList',
        label: '',
        data: {
          items: parsedItems,
          colorScheme,
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
