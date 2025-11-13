import type { NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

interface DetailedProcessStep {
  main: string;
  substeps: string[];
}

/**
 * DetailedProcess GlyphSet
 *
 * Creates a process with main steps and substeps beneath each.
 * Shows hierarchical relationship between main activities and supporting tasks.
 * Similar to PowerPoint SmartArt "Detailed Process".
 *
 * Uses a special format: "Main Step | Substep 1 | Substep 2 | ..."
 *
 * @example
 * ```runiq
 * glyphset detailedProcess "Development Process" {
 *   item "Design | Wireframes | Prototypes | User Testing"
 *   item "Build | Frontend | Backend | Integration"
 *   item "Test | Unit Tests | Integration Tests"
 *   item "Launch | Beta Release | Marketing"
 *
 *   direction "LR"
 * }
 * ```
 */
export const detailedProcessGlyphSet: GlyphSetDefinition = {
  id: 'detailedProcess',
  name: 'Detailed Process',
  category: 'process',
  description:
    'Process with main steps and substeps shown below each. Use pipe character | to separate main step from substeps.',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description:
        'Array of strings in format "Main | Substep1 | Substep2 | ..."',
    },
    {
      name: 'direction',
      type: 'string',
      required: false,
      description: 'Layout direction: "LR" (horizontal) or "TB" (vertical)',
    },
  ],

  minItems: 2,
  maxItems: 5,

  tags: ['process', 'detailed', 'substeps', 'hierarchical', 'breakdown'],

  generator: (params) => {
    const rawItems = params.items as string[] | undefined;
    const direction = (params.direction as string) || 'LR';

    // Validation
    if (!rawItems || !Array.isArray(rawItems)) {
      throw new GlyphSetError(
        'detailedProcess',
        'items',
        'Parameter "items" must be an array of strings'
      );
    }

    if (rawItems.length < 2) {
      throw new GlyphSetError(
        'detailedProcess',
        'items',
        'Detailed process requires at least 2 main steps'
      );
    }

    if (rawItems.length > 5) {
      throw new GlyphSetError(
        'detailedProcess',
        'items',
        'Detailed process supports maximum 5 main steps (for readability)'
      );
    }

    // Parse items into main step and substeps
    const items: DetailedProcessStep[] = [];
    for (let i = 0; i < rawItems.length; i++) {
      const parts = rawItems[i].split('|').map((s) => s.trim());

      if (parts.length < 2) {
        throw new GlyphSetError(
          'detailedProcess',
          'items',
          `Step ${i + 1} must have format "Main Step | Substep 1 | Substep 2 | ..."`
        );
      }

      items.push({
        main: parts[0],
        substeps: parts.slice(1),
      });
    }

    if (direction !== 'LR' && direction !== 'TB') {
      throw new GlyphSetError(
        'detailedProcess',
        'direction',
        'Direction must be "LR" (horizontal) or "TB" (vertical)'
      );
    }

    // Create a single node that will render the entire detailed process
    const nodes: NodeAst[] = [
      {
        id: 'detailedProcess',
        shape: 'detailedProcess',
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
