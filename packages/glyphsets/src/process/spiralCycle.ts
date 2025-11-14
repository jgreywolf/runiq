import type { NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * SpiralCycle GlyphSet
 *
 * Creates a spiral progression showing growth, evolution, or iterative improvement.
 * Items are arranged along an expanding spiral path, with each item representing
 * a stage in an evolving process. Visual metaphor for continuous improvement,
 * maturity growth, or iterative development.
 * Similar to PowerPoint SmartArt "Spiral" concepts.
 *
 * @example
 * ```runiq
 * glyphset spiralCycle "Maturity Model" {
 *   item "Initial"
 *   item "Managed"
 *   item "Defined"
 *   item "Quantified"
 *   item "Optimizing"
 * }
 * ```
 */
export const spiralCycleGlyphSet: GlyphSetDefinition = {
  id: 'spiralCycle',
  name: 'Spiral Cycle',
  category: 'process',
  description:
    'Spiral progression showing growth, evolution, or iterative improvement. Each item represents a stage in an expanding, evolving process.',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of stage labels along the spiral (minimum 3 stages)',
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

  tags: [
    'cycle',
    'spiral',
    'growth',
    'evolution',
    'iterative',
    'improvement',
    'maturity',
  ],

  generator: (params) => {
    const items = params.items as string[] | undefined;
    const theme = params.theme as string | undefined;

    // Validation
    if (!items || !Array.isArray(items)) {
      throw new GlyphSetError(
        'spiralCycle',
        'items',
        'Parameter "items" must be an array of strings'
      );
    }

    if (items.length < 3) {
      throw new GlyphSetError(
        'spiralCycle',
        'items',
        'Spiral cycle requires at least 3 stages'
      );
    }

    if (items.length > 8) {
      throw new GlyphSetError(
        'spiralCycle',
        'items',
        'Spiral cycle supports maximum 8 stages (for clarity)'
      );
    }

    // Create a single node that will render the entire spiral cycle
    const nodes: NodeAst[] = [
      {
        id: 'spiralCycle',
        shape: 'spiralCycle',
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
