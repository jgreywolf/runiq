import type { NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * Continuous Block Process GlyphSet
 *
 * Generates a process with solid connected blocks and arrows showing continuous flow.
 * Blocks are tightly connected with prominent arrows between them.
 * Similar to PowerPoint SmartArt "Continuous Block Process".
 *
 * @example
 * ```runiq
 * glyphset continuousBlockProcess "Manufacturing Flow" {
 *   item "Raw Materials"
 *   item "Processing"
 *   item "Assembly"
 *   item "Quality Check"
 *   item "Shipping"
 *
 *   direction "LR"
 * }
 * ```
 */
export const continuousBlockProcessGlyphSet: GlyphSetDefinition = {
  id: 'continuousBlockProcess',
  name: 'Continuous Block Process',
  category: 'process',
  description:
    'Process with solid connected blocks and arrows showing continuous flow',

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
      description: 'Flow direction: LR (default) or TB',
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

  tags: ['process', 'continuous', 'blocks', 'arrows', 'flow', 'manufacturing'],

  generator: (params) => {
    const items = params.items as string[] | undefined;
    const direction = (params.direction as string) || 'LR';
    const theme = params.theme as string | undefined;

    // Validation
    if (!items || !Array.isArray(items)) {
      throw new GlyphSetError(
        'continuousBlockProcess',
        'items',
        'Parameter "items" must be an array of strings'
      );
    }

    if (items.length < 3) {
      throw new GlyphSetError(
        'continuousBlockProcess',
        'items',
        'Continuous block process requires at least 3 steps'
      );
    }

    if (items.length > 8) {
      throw new GlyphSetError(
        'continuousBlockProcess',
        'items',
        'Continuous block process supports maximum 8 steps (for readability)'
      );
    }

    // Create a single node that will render the entire process
    const nodes: NodeAst[] = [
      {
        id: 'continuousBlockProcess',
        shape: 'continuousBlockProcess',
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
      nodes,
      edges: [],
    };
  },
};
