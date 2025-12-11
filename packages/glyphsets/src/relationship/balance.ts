import type { Direction, NodeAst } from '@runiq/core';
import { getThemeColor, type ColorTheme } from '../themes.js';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * Balance (Scale) GlyphSet
 *
 * Generates a balance/scale diagram showing two sides for comparison.
 * Similar to PowerPoint SmartArt "Balance" pattern.
 *
 * Use cases:
 * - Pros vs Cons
 * - Costs vs Benefits
 * - Risks vs Rewards
 * - Advantages vs Disadvantages
 * - Option A vs Option B
 *
 * @example
 * ```runiq
 * glyphset balance "Decision Analysis" {
 *   item"Pros"
 *   item"Cons"
 * }
 * ```
 */
export const balanceGlyphSet: GlyphSetDefinition = {
  id: 'balance',
  name: 'Balance Diagram',
  category: 'relationship',
  description: 'Balance scale showing two-sided comparison (left vs right)',

  parameters: [
    {
      name: 'sides',
      type: 'array',
      required: true,
      description: 'Exactly 2 labels for left and right sides',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      default: 'professional',
      description: 'Color theme',
    },
  ],

  minItems: 2,
  maxItems: 2,

  tags: [
    'relationship',
    'balance',
    'scale',
    'comparison',
    'pros-cons',
    'tradeoff',
  ],

  generator: (params) => {
    const sides = params.sides as string[] | undefined;
    const theme = (params.theme as ColorTheme | undefined) || 'professional';

    // Validation
    if (!sides || !Array.isArray(sides)) {
      throw new GlyphSetError(
        'balance',
        'sides',
        'Parameter "sides" must be an array with exactly 2 items'
      );
    }

    if (sides.length !== 2) {
      throw new GlyphSetError(
        'balance',
        'sides',
        'Balance diagram requires exactly 2 sides (left and right)'
      );
    }

    const nodes: NodeAst[] = [];

    // Get colors from theme
    const leftColor = getThemeColor(theme, 0);
    const rightColor = getThemeColor(theme, 1);

    // Create a single composite node that will render the balance scale
    const balanceData = {
      sides: [
        { label: sides[0], position: 'left', color: leftColor },
        { label: sides[1], position: 'right', color: rightColor },
      ],
    };

    nodes.push({
      id: 'balance',
      shape: 'balance',
      label: '', // Labels handled by shape rendering
      data: balanceData,
    });

    return {
      astVersion: '1.0',
      direction: 'TB' as Direction,
      nodes,
      edges: [],
    };
  },
};
