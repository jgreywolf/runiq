import { getThemeColor } from '../themes.js';
import type { GlyphSetDefinition } from '../types.js';
import { GlyphSetError } from '../types.js';

/**
 * Counterbalance Glyphset - Weighted balance scale
 * Shows comparison with visual weight representation
 */
export const counterBalanceGlyphSet: GlyphSetDefinition = {
  id: 'counterBalance',
  name: 'Counterbalance',
  category: 'relationship',
  description:
    'Tilted balance scale comparing two options with adjustable weights showing relative importance',
  parameters: [
    {
      name: 'theme',
      type: 'string',
      required: false,
      default: 'blue',
      description: 'Color theme (blue, green, red, purple, orange)',
    },
    {
      name: 'leftWeight',
      type: 'number',
      required: false,
      default: 1,
      description: 'Weight for left side',
    },
    {
      name: 'rightWeight',
      type: 'number',
      required: false,
      default: 1,
      description: 'Weight for right side',
    },
  ],
  minItems: 2,
  maxItems: 2,
  generator: (params) => {
    const sides = (params.sides as string[]) || [];
    const theme = (params.theme as string) || 'professional';
    const leftWeight = (params.leftWeight as number) || 50;
    const rightWeight = (params.rightWeight as number) || 50;

    if (sides.length !== 2) {
      throw new GlyphSetError(
        'counterBalance',
        `Counterbalance requires exactly 2 sides, got ${sides.length}`
      );
    }

    return {
      astVersion: '1.0',
      nodes: [
        {
          id: 'counterBalance',
          shape: 'counterBalance',
          label: '',
          data: {
            left: {
              label: sides[0],
              weight: leftWeight,
              color: getThemeColor(
                theme as Parameters<typeof getThemeColor>[0],
                0
              ),
            },
            right: {
              label: sides[1],
              weight: rightWeight,
              color: getThemeColor(
                theme as Parameters<typeof getThemeColor>[0],
                1
              ),
            },
          },
        },
      ],
      edges: [],
    };
  },
};
