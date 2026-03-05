import type { NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * Equation Process GlyphSet
 *
 * Generates an equation-style process showing inputs combining to produce output.
 * Format: A + B + C = Result
 * Good for showing formulas, calculations, or component combination.
 * Similar to PowerPoint SmartArt "Equation" process.
 *
 * @example
 * ```runiq
 * glyphset equationProcess "Success Formula" {
 *   item "Talent"
 *   item "Effort"
 *   item "Opportunity"
 *   item "Success"
 * }
 * ```
 */
export const equationProcessGlyphSet: GlyphSetDefinition = {
  id: 'equationProcess',
  name: 'Equation Process',
  category: 'process',
  description:
    'Equation-style process showing inputs combining to produce output (A + B = C)',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of items (minimum 3: at least 2 inputs + 1 result)',
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
  maxItems: 6,

  tags: ['process', 'equation', 'formula', 'calculation', 'combination'],

  generator: (params) => {
    const items = params.items as string[] | undefined;
    const theme = params.theme as string | undefined;

    // Validation
    if (!items || !Array.isArray(items)) {
      throw new GlyphSetError(
        'equationProcess',
        'items',
        'Parameter "items" must be an array of strings'
      );
    }

    if (items.length < 3) {
      throw new GlyphSetError(
        'equationProcess',
        'items',
        'Equation process requires at least 3 items (2 inputs + 1 result)'
      );
    }

    if (items.length > 6) {
      throw new GlyphSetError(
        'equationProcess',
        'items',
        'Equation process supports maximum 6 items (5 inputs + 1 result)'
      );
    }

    // Last item is the result, all others are inputs
    const inputs = items.slice(0, -1);
    const result = items[items.length - 1];

    // Create a single node that will render the entire equation
    const nodes: NodeAst[] = [
      {
        id: 'equationProcess',
        shape: 'equationProcess',
        label: '',
        data: {
          inputs,
          result,
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
