import type { NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * SegmentedCycle GlyphSet
 *
 * Creates a pie chart with segments representing parts of a whole cycle.
 * Each segment shows a phase or component that makes up the complete process.
 * Useful for showing time distribution, resource allocation, or phase breakdown.
 * Similar to PowerPoint SmartArt "Segmented Cycle".
 *
 * @example
 * ```runiq
 * glyphset segmentedCycle "Project Lifecycle" {
 *   item "Planning"
 *   item "Development"
 *   item "Testing"
 *   item "Deployment"
 *   item "Maintenance"
 *
 *   showPercentages true
 * }
 * ```
 */
export const segmentedCycleGlyphSet: GlyphSetDefinition = {
  id: 'segmentedCycle',
  name: 'Segmented Cycle',
  category: 'process',
  description:
    'Pie chart segments in circular arrangement. Shows how items make up parts of a whole cycle or process with percentage distribution.',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of segment labels (minimum 2 segments)',
    },
    {
      name: 'showPercentages',
      type: 'boolean',
      required: false,
      description: 'Show percentage for each segment (default: true)',
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
  maxItems: 6,

  tags: ['cycle', 'segmented', 'pie', 'chart', 'percentage', 'distribution'],

  generator: (params) => {
    const items = params.items as string[] | undefined;
    const showPercentages = (params.showPercentages as boolean) ?? true;
    const theme = params.theme as string | undefined;

    // Validation
    if (!items || !Array.isArray(items)) {
      throw new GlyphSetError(
        'segmentedCycle',
        'items',
        'Parameter "items" must be an array of strings'
      );
    }

    if (items.length < 2) {
      throw new GlyphSetError(
        'segmentedCycle',
        'items',
        'Segmented cycle requires at least 2 segments'
      );
    }

    if (items.length > 6) {
      throw new GlyphSetError(
        'segmentedCycle',
        'items',
        'Segmented cycle supports maximum 6 segments (for readability)'
      );
    }

    // Create a single node that will render the entire segmented cycle
    const nodes: NodeAst[] = [
      {
        id: 'segmentedCycle',
        shape: 'segmentedCycle',
        label: '',
        data: {
          items,
          showPercentages,
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
