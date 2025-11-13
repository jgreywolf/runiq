import type { NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * Step Process GlyphSet
 *
 * Generates a process with steps arranged diagonally like stairs,
 * showing upward or downward progression. Visual metaphor for climbing
 * steps toward a goal or descending through stages.
 * Similar to PowerPoint SmartArt "Step Up Process" or "Step Down Process".
 *
 * @example
 * ```runiq
 * glyphset stepProcess "Career Growth" {
 *   item "Junior"
 *   item "Mid-Level"
 *   item "Senior"
 *   item "Lead"
 *   item "Principal"
 *
 *   direction "up"
 * }
 * ```
 */
export const stepProcessGlyphSet: GlyphSetDefinition = {
  id: 'stepProcess',
  name: 'Step Process',
  category: 'process',
  description:
    'Process steps arranged diagonally in a staircase pattern, showing progression',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of process steps (minimum 3 steps)',
    },
    {
      name: 'direction',
      type: 'string',
      required: false,
      description: 'Step direction: up (default) or down',
    },
  ],

  minItems: 3,
  maxItems: 8,

  tags: ['process', 'steps', 'stairs', 'progression', 'growth', 'stages'],

  generator: (params) => {
    const items = params.items as string[] | undefined;
    const direction = (params.direction as string) || 'up';

    // Validation
    if (!items || !Array.isArray(items)) {
      throw new GlyphSetError(
        'stepProcess',
        'items',
        'Parameter "items" must be an array of strings'
      );
    }

    if (items.length < 3) {
      throw new GlyphSetError(
        'stepProcess',
        'items',
        'Step process requires at least 3 steps'
      );
    }

    if (items.length > 8) {
      throw new GlyphSetError(
        'stepProcess',
        'items',
        'Step process supports maximum 8 steps (for readability)'
      );
    }

    // Create a single node that will render the entire step process
    const nodes: NodeAst[] = [
      {
        id: 'stepProcess',
        shape: 'stepProcess',
        label: '',
        data: {
          items,
          direction,
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
