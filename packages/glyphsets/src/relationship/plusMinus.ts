import type { GlyphSetDefinition } from '../types.js';
import type { DiagramAst } from '@runiq/core';
import { getThemeColor, type ColorTheme } from '../themes.js';

/**
 * Plus/Minus Glyphset
 *
 * Displays pros and cons, advantages and disadvantages side by side.
 * Perfect for showing:
 * - Pros and cons
 * - Advantages vs disadvantages
 * - Positive vs negative aspects
 * - Benefits vs drawbacks
 * - Decision analysis
 *
 * Visual: Left side (plus/pros) vs right side (minus/cons) with central divider
 *
 * @example
 * ```typescript
 * glyphset plusMinus "Cloud Migration" {
 *   item "Scalability"
 *   item "Cost Savings"
 *   item "High Initial Cost"
 *   item "Migration Risk"
 * }
 * ```
 */
export const plusMinusGlyphSet: GlyphSetDefinition = {
  id: 'plusMinus',
  name: 'Plus/Minus Diagram',
  category: 'relationship',
  description:
    'Compare pros and cons, advantages and disadvantages side by side',
  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description:
        'Items to compare (2-10 items, split evenly between pros/cons)',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      default: 'professional',
      description: 'Color theme for the diagram',
    },
  ],
  minItems: 2,
  maxItems: 10,
  tags: [
    'relationship',
    'comparison',
    'pros',
    'cons',
    'advantages',
    'disadvantages',
    'decision',
  ],
  generator: (params) => {
    const items = params.items as string[] | undefined;
    const theme = (params.theme as ColorTheme | undefined) || 'professional';

    if (!items || !Array.isArray(items)) {
      throw new Error('plusMinus glyphset requires an items array');
    }

    if (items.length < 2) {
      throw new Error('plusMinus glyphset requires at least 2 items');
    }

    if (items.length > 10) {
      throw new Error('plusMinus glyphset supports maximum 10 items');
    }

    // Items should be even number for balanced pros/cons
    // If odd, the plus side gets the extra item
    const midpoint = Math.ceil(items.length / 2);
    const plusItems = items.slice(0, midpoint);
    const minusItems = items.slice(midpoint);

    // Create plusMinus data structure
    const plusMinusData = {
      plus: plusItems.map((item, index) => ({
        label: item,
        color: getThemeColor(theme, index * 2), // Use even theme colors for plus
      })),
      minus: minusItems.map((item, index) => ({
        label: item,
        color: getThemeColor(theme, index * 2 + 1), // Use odd theme colors for minus
      })),
    };

    // Create a single composite node that renders the entire plus/minus diagram
    const compositeNode = {
      id: 'plusMinus-composite',
      shape: 'plusMinus',
      label: 'Pros vs Cons',
      data: plusMinusData,
    };

    const ast: DiagramAst = {
      astVersion: '1.0',
      direction: 'LR',
      nodes: [compositeNode],
      edges: [],
    };

    return ast;
  },
};
