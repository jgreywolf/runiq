import type { NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * Alternating Process GlyphSet
 *
 * Generates a process with steps alternating between left and right positions,
 * creating a zigzag S-curve flow. Shows back-and-forth progression.
 * Similar to PowerPoint SmartArt "Alternating Flow" process.
 *
 * @example
 * ```runiq
 * glyphset alternatingProcess "Development Workflow" {
 *   item "Requirements"
 *   item "Design"
 *   item "Development"
 *   item "Testing"
 *   item "Deployment"
 * }
 * ```
 */
export const alternatingProcessGlyphSet: GlyphSetDefinition = {
  id: 'alternatingProcess',
  name: 'Alternating Process',
  category: 'process',
  description:
    'Process steps alternating left and right in a zigzag pattern with connecting arrows',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of process steps (minimum 3 steps)',
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

  tags: ['process', 'alternating', 'zigzag', 'flow', 's-curve', 'workflow'],

  generator: (params) => {
    const items = params.items as string[] | undefined;
    const theme = params.theme as string | undefined;

    // Validation
    if (!items || !Array.isArray(items)) {
      throw new GlyphSetError(
        'alternatingProcess',
        'items',
        'Parameter "items" must be an array of strings'
      );
    }

    if (items.length < 3) {
      throw new GlyphSetError(
        'alternatingProcess',
        'items',
        'Alternating process requires at least 3 steps'
      );
    }

    if (items.length > 8) {
      throw new GlyphSetError(
        'alternatingProcess',
        'items',
        'Alternating process supports maximum 8 steps (for readability)'
      );
    }

    // Create a single node that will render the entire alternating process
    const nodes: NodeAst[] = [
      {
        id: 'alternatingProcess',
        shape: 'alternatingProcess',
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
