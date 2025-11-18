import type { GlyphSetDefinition } from '../types.js';
import { GlyphSetError } from '../types.js';
import { getThemeColor } from '../themes.js';

/**
 * Interconnected Glyphset - Mesh network
 * Shows complex interdependencies between elements
 */
export const interconnectedGlyphSet: GlyphSetDefinition = {
  id: 'interconnected',
  name: 'Interconnected',
  category: 'relationship',
  description:
    'Circular mesh network showing all-to-all connections between nodes in a ring layout',
  parameters: [
    {
      name: 'theme',
      type: 'string',
      required: false,
      default: 'blue',
      description: 'Color theme (blue, green, red, purple, orange)',
    },
    {
      name: 'showAllConnections',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show all-to-all connections',
    },
  ],
  minItems: 3,
  maxItems: 8,
  generator: (params) => {
    const items = (params.items as string[]) || [];
    const theme = (params.theme as string) || 'professional';
    const showAllConnections = (params.showAllConnections as boolean) !== false;

    if (items.length < 3 || items.length > 8) {
      throw new GlyphSetError(
        'interconnected',
        `Interconnected requires 3-8 items, got ${items.length}`
      );
    }

    const colors = items.map((_, idx) =>
      getThemeColor(theme as Parameters<typeof getThemeColor>[0], idx)
    );

    return {
      astVersion: '1.0',
      nodes: [
        {
          id: 'interconnected',
          shape: 'interconnected',
          label: '',
          data: {
            items,
            colors,
            showAllConnections,
          },
        },
      ],
      edges: [],
    };
  },
};
