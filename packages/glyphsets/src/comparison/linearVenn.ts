import type { GlyphSetDefinition } from '../types.js';
import { GlyphSetError } from '../types.js';
import { getThemeColor } from '../themes.js';

/**
 * Linear Venn Glyphset - Horizontal overlapping circles
 * Shows progressive relationship between sets
 */
export const linearVennGlyphSet: GlyphSetDefinition = {
  id: 'linearVenn',
  name: 'Linear Venn Diagram',
  category: 'comparison',
  description:
    'Horizontally arranged overlapping circles showing progressive relationships between sets',
  parameters: [
    {
      name: 'theme',
      type: 'string',
      required: false,
      default: 'blue',
      description: 'Color theme (blue, green, red, purple, orange)',
    },
    {
      name: 'overlap',
      type: 'number',
      required: false,
      default: 0.3,
      description: 'Overlap amount (0-1)',
    },
  ],
  minItems: 2,
  maxItems: 4,
  generator: (params) => {
    const circles = (params.circles as string[]) || [];
    const theme = (params.theme as string) || 'professional';
    const overlap = (params.overlap as number) || 0.3;

    if (circles.length < 2 || circles.length > 4) {
      throw new GlyphSetError(
        'linearVenn',
        `Linear Venn requires 2-4 circles, got ${circles.length}`
      );
    }

    const colors = circles.map((_, idx) =>
      getThemeColor(theme as Parameters<typeof getThemeColor>[0], idx)
    );

    return {
      astVersion: '1.0',
      nodes: [
        {
          id: 'linearVenn',
          shape: 'linearVenn',
          label: '',
          data: {
            labels: circles,
            colors,
            overlap,
          },
        },
      ],
      edges: [],
    };
  },
};
