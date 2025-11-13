import type { NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * PhasedProcess GlyphSet
 *
 * Creates a phased process with milestone markers between phases.
 * Each phase is a box with diamond milestone markers in between showing progression.
 * Similar to PowerPoint SmartArt "Phased Process".
 *
 * @example
 * ```runiq
 * glyphset phasedProcess "Project Phases" {
 *   item "Planning"
 *   item "Execution"
 *   item "Review"
 *   item "Deployment"
 *
 *   direction "LR"
 * }
 * ```
 */
export const phasedProcessGlyphSet: GlyphSetDefinition = {
  id: 'phasedProcess',
  name: 'Phased Process',
  category: 'process',
  description:
    'Sequential process phases with milestone markers between them. Ideal for project phases or staged workflows.',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of phase names (minimum 2 phases)',
    },
    {
      name: 'direction',
      type: 'string',
      required: false,
      description: 'Layout direction: "LR" (horizontal) or "TB" (vertical)',
    },
  ],

  minItems: 2,
  maxItems: 6,

  tags: ['process', 'phased', 'milestone', 'project', 'stages'],

  generator: (params) => {
    const items = params.items as string[] | undefined;
    const direction = (params.direction as string) || 'LR';

    // Validation
    if (!items || !Array.isArray(items)) {
      throw new GlyphSetError(
        'phasedProcess',
        'items',
        'Parameter "items" must be an array of strings'
      );
    }

    if (items.length < 2) {
      throw new GlyphSetError(
        'phasedProcess',
        'items',
        'Phased process requires at least 2 phases'
      );
    }

    if (items.length > 6) {
      throw new GlyphSetError(
        'phasedProcess',
        'items',
        'Phased process supports maximum 6 phases (for readability)'
      );
    }

    if (direction !== 'LR' && direction !== 'TB') {
      throw new GlyphSetError(
        'phasedProcess',
        'direction',
        'Direction must be "LR" (horizontal) or "TB" (vertical)'
      );
    }

    // Create a single node that will render the entire phased process
    const nodes: NodeAst[] = [
      {
        id: 'phasedProcess',
        shape: 'phasedProcess',
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
