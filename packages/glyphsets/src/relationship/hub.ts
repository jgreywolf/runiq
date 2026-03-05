import type { GlyphSetDefinition } from '../types.js';
import { GlyphSetError } from '../types.js';
import { getThemeColor } from '../themes.js';

/**
 * Hub Glyphset - Hub-and-spoke diagram
 * Shows central concept with connected peripheral elements
 */
export const hubGlyphSet: GlyphSetDefinition = {
  id: 'hub',
  name: 'Hub and Spoke',
  category: 'relationship',
  description:
    'Central hub with radiating spokes showing connections to peripheral elements',
  parameters: [
    {
      name: 'theme',
      type: 'string',
      required: false,
      default: 'blue',
      description: 'Color theme (blue, green, red, purple, orange)',
    },
    {
      name: 'bidirectional',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Show bidirectional arrows',
    },
  ],
  minItems: 3,
  maxItems: 12,
  generator: (params) => {
    const centers = (params.centers as string[]) || [];
    const spokes = (params.spokes as string[]) || [];
    const theme = (params.theme as string) || 'professional';
    const bidirectional =
      typeof params.bidirectional === 'boolean' ? params.bidirectional : true;

    if (centers.length === 0 || spokes.length < 2) {
      throw new GlyphSetError(
        'hub',
        `Hub requires 1 center and at least 2 spokes, got ${centers.length} center(s) and ${spokes.length} spoke(s)`
      );
    }

    const center = centers[0];
    const colors = spokes.map((_, idx) =>
      getThemeColor(theme as Parameters<typeof getThemeColor>[0], idx)
    );

    return {
      astVersion: '1.0',
      nodes: [
        {
          id: 'hub',
          shape: 'hub',
          label: '',
          data: {
            center,
            spokes,
            colors,
            bidirectional,
          },
        },
      ],
      edges: [],
    };
  },
};
