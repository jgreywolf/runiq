import type { NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';
import { validateArrayParameter } from '../utils/validation.js';
import { extractStringParam } from '../utils/parameters.js';

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
    const theme = extractStringParam(params, 'theme');

    // Validation - validateArrayParameter checks both required and array constraints
    validateArrayParameter('alternatingProcess', 'items', items, {
      minItems: 3,
      maxItems: 8,
      itemType: 'string',
    });

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
