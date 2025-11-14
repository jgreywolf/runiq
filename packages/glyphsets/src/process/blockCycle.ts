import type { NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * BlockCycle GlyphSet
 *
 * Creates rectangular blocks arranged in a circular pattern with connecting arrows.
 * Shows a cyclical process with clear, distinct phases or steps.
 * Each block represents a major step that flows into the next in continuous cycle.
 * Similar to PowerPoint SmartArt "Block Cycle".
 *
 * @example
 * ```runiq
 * glyphset blockCycle "PDCA Cycle" {
 *   item "Plan"
 *   item "Do"
 *   item "Check"
 *   item "Act"
 * }
 * ```
 */
export const blockCycleGlyphSet: GlyphSetDefinition = {
  id: 'blockCycle',
  name: 'Block Cycle',
  category: 'process',
  description:
    'Rectangular blocks arranged in a circle with arrows. Shows cyclical process with clear sequential phases.',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of block labels (minimum 3 blocks)',
    },
  ],

  minItems: 3,
  maxItems: 8,

  tags: ['cycle', 'block', 'circular', 'sequential', 'process', 'pdca'],

  generator: (params) => {
    const items = params.items as string[] | undefined;

    // Validation
    if (!items || !Array.isArray(items)) {
      throw new GlyphSetError(
        'blockCycle',
        'items',
        'Parameter "items" must be an array of strings'
      );
    }

    if (items.length < 3) {
      throw new GlyphSetError(
        'blockCycle',
        'items',
        'Block cycle requires at least 3 blocks'
      );
    }

    if (items.length > 8) {
      throw new GlyphSetError(
        'blockCycle',
        'items',
        'Block cycle supports maximum 8 blocks (for readability)'
      );
    }

    // Create a single node that will render the entire block cycle
    const nodes: NodeAst[] = [
      {
        id: 'blockCycle',
        shape: 'blockCycle',
        label: '',
        data: {
          items,
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
