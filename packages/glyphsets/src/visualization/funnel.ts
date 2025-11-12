import type { DiagramAst, NodeAst, EdgeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * Funnel GlyphSet
 *
 * Generates a funnel visualization showing progressive filtering or conversion.
 * Similar to PowerPoint SmartArt "Basic Funnel" pattern.
 *
 * @example
 * ```runiq
 * diagram "Sales Funnel" glyphset:funnel {
 *   stage "Awareness (1000)"
 *   stage "Interest (500)"
 *   stage "Consideration (200)"
 *   stage "Purchase (50)"
 * }
 * ```
 */
export const funnelGlyphSet: GlyphSetDefinition = {
  id: 'funnel',
  name: 'Funnel',
  category: 'visualization',
  description: 'Funnel visualization showing progressive filtering or conversion stages',

  parameters: [
    {
      name: 'stages',
      type: 'array',
      required: true,
      description: 'Array of stage labels (typically with quantities)',
    },
    {
      name: 'shape',
      type: 'string',
      required: false,
      default: 'trapezoid',
      description: 'Shape for each stage',
    },
  ],

  minItems: 3,
  maxItems: 7,

  tags: ['funnel', 'conversion', 'stages', 'filter', 'pipeline'],

  generator: (params) => {
    const stages = params.stages as string[] | undefined;
    const shape = (params.shape as string | undefined) || 'trapezoid';

    // Validation
    if (!stages || !Array.isArray(stages)) {
      throw new GlyphSetError('funnel', 'stages', 'Parameter "stages" must be an array of strings');
    }

    if (stages.length < 3) {
      throw new GlyphSetError(
        'funnel',
        'stages',
        'Funnel requires at least 3 stages to show progression'
      );
    }

    if (stages.length > 7) {
      throw new GlyphSetError(
        'funnel',
        'stages',
        'Funnel supports maximum 7 stages (for readability)'
      );
    }

    // Generate a single node using the pyramid shape (which looks like a funnel!)
    // The pyramid shape has the perfect narrowing trapezoid visual for funnels
    const funnelData = {
      levels: stages.map((label, i) => ({
        label,
        value: stages.length - i, // Descending values (top = widest, bottom = narrowest)
      })),
      showValues: false,
    };

    const nodes: NodeAst[] = [
      {
        id: 'funnel',
        shape: 'pyramid', // Use pyramid shape - it's perfect for funnels!
        label: '',
        data: funnelData,
      },
    ];

    return {
      astVersion: '1.0',
      direction: 'TB',
      nodes,
      edges: [], // No edges - pyramid shape is self-contained
    };
  },
};
