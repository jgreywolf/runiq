import type { GlyphSetDefinition } from '../types.js';
import { GlyphSetError } from '../types.js';
import { getThemeColor } from '../themes.js';

/**
 * Stepped Venn Glyphset - 3D stacked Venn circles
 * Shows overlapping concepts with depth perception
 */
export const steppedVennGlyphSet: GlyphSetDefinition = {
  id: 'steppedVenn',
  name: 'Stepped Venn Diagram',
  category: 'comparison',
  description:
    'Three-dimensional stacked circles creating a stepped pyramid effect for hierarchical comparison',
  parameters: [
    {
      name: 'theme',
      type: 'string',
      required: false,
      default: 'blue',
      description: 'Color theme (blue, green, red, purple, orange)',
    },
  ],
  minItems: 2,
  maxItems: 4,
  generator: (params) => {
    const circles = (params.circles as string[]) || [];
    const theme = (params.theme as string) || 'professional';

    if (circles.length < 2 || circles.length > 4) {
      throw new GlyphSetError(
        'steppedVenn',
        `Stepped Venn requires 2-4 circles, got ${circles.length}`
      );
    }

    const colors = circles.map((_, idx) =>
      getThemeColor(theme as Parameters<typeof getThemeColor>[0], idx)
    );

    return {
      astVersion: '1.0',
      nodes: [
        {
          id: 'steppedVenn',
          shape: 'steppedVenn',
          label: '',
          data: {
            labels: circles,
            colors,
          },
        },
      ],
      edges: [],
    };
  },
};
