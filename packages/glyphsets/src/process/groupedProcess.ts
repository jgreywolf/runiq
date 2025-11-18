import type { NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

interface ProcessGroup {
  name: string;
  items: string[];
}

/**
 * GroupedProcess GlyphSet
 *
 * Creates parallel process streams that converge to a single merge point.
 * Shows multiple workflows running in parallel that combine into one output.
 * Similar to PowerPoint SmartArt "Grouped Process".
 *
 * @example
 * ```runiq
 * glyphset groupedProcess "Product Development" {
 *   group "Design Team" {
 *     item "Wireframes"
 *     item "Prototypes"
 *   }
 *   group "Engineering" {
 *     item "Backend API"
 *     item "Frontend"
 *     item "Database"
 *   }
 *   group "QA" {
 *     item "Test Plans"
 *     item "Automation"
 *   }
 *
 *   mergePoint "Launch"
 * }
 * ```
 */
export const groupedProcessGlyphSet: GlyphSetDefinition = {
  id: 'groupedProcess',
  name: 'Grouped Process',
  category: 'process',
  description:
    'Parallel process streams that converge to a single merge point. Shows concurrent workflows combining into one output.',

  parameters: [
    {
      name: 'groups',
      type: 'array',
      required: true,
      description: 'Array of process groups, each with name and items',
    },
    {
      name: 'mergePoint',
      type: 'string',
      required: false,
      description: 'Label for the convergence point (default: "Result")',
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
  maxItems: 4,

  tags: ['process', 'parallel', 'grouped', 'converging', 'streams'],

  generator: (params) => {
    const groups = params.groups as ProcessGroup[] | undefined;
    const mergePoint = (params.mergePoint as string) || 'Result';
    const theme = params.theme as string | undefined;

    // Validation
    if (!groups || !Array.isArray(groups)) {
      throw new GlyphSetError(
        'groupedProcess',
        'groups',
        'Parameter "groups" must be an array of group objects'
      );
    }

    if (groups.length < 2) {
      throw new GlyphSetError(
        'groupedProcess',
        'groups',
        'Grouped process requires at least 2 parallel groups'
      );
    }

    if (groups.length > 4) {
      throw new GlyphSetError(
        'groupedProcess',
        'groups',
        'Grouped process supports maximum 4 groups (for readability)'
      );
    }

    // Validate each group has name and items
    for (let i = 0; i < groups.length; i++) {
      if (!groups[i].name || typeof groups[i].name !== 'string') {
        throw new GlyphSetError(
          'groupedProcess',
          'groups',
          `Group ${i + 1} must have a "name" property`
        );
      }
      if (!groups[i].items || !Array.isArray(groups[i].items)) {
        throw new GlyphSetError(
          'groupedProcess',
          'groups',
          `Group ${i + 1} must have an "items" array`
        );
      }
      if (groups[i].items.length === 0) {
        throw new GlyphSetError(
          'groupedProcess',
          'groups',
          `Group ${i + 1} must have at least 1 item`
        );
      }
    }

    // Create a single node that will render the entire grouped process
    const nodes: NodeAst[] = [
      {
        id: 'groupedProcess',
        shape: 'groupedProcess',
        label: '',
        data: {
          groups,
          mergePoint,
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
