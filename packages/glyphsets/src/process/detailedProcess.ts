import type { NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';
import { validateArrayParameter, validateStringParameter } from '../utils/validation.js';
import { extractStringParam } from '../utils/parameters.js';

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
    {
      name: 'theme',
      type: 'string',
      required: false,
      description:
        'Color theme (professional, forest, sunset, ocean, monochrome)',
    },
  ],

  minItems: 2,
  maxItems: 5,

  tags: ['process', 'detailed', 'substeps', 'hierarchical', 'breakdown'],

  generator: (params) => {
    const rawItems = params.items as string[] | undefined;
    const direction = extractStringParam(params, 'direction', 'LR');
    const theme = extractStringParam(params, 'theme');

    // Validation - validateArrayParameter checks both required and array constraints
    validateArrayParameter('detailedProcess', 'items', rawItems, {
      minItems: 2,
      maxItems: 5,
      itemType: 'string',
    });

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

    validateStringParameter('detailedProcess', 'direction', direction, {
      allowedValues: ['LR', 'TB'],
    });

    // Create a single node that will render the entire detailed process
    const nodes: NodeAst[] = [
      {
        id: 'detailedProcess',
        shape: 'detailedProcess',
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
