import type { Direction, NodeAst } from '@runiq/core';
import { getThemeColor, type ColorTheme } from '../themes.js';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * Diverging GlyphSet
 *
 * Generates a diagram showing a single source diverging into multiple destinations.
 * Opposite of converging - one → multiple pattern.
 * Similar to PowerPoint SmartArt "Diverging" pattern.
 *
 * Use cases:
 * - Decision branching (one decision → multiple paths)
 * - Distribution (single source → multiple outputs)
 * - Broadcasting (message → multiple recipients)
 * - Delegation (manager → team members)
 * - River splitting into tributaries
 */
export const divergingGlyphSet: GlyphSetDefinition = {
  id: 'diverging',
  name: 'Diverging Diagram',
  category: 'relationship',
  description:
    'Shows a single source diverging into multiple destination points',

  parameters: [
    {
      name: 'source',
      type: 'string',
      required: false,
      default: 'Source',
      description: 'Source item that diverges',
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Destination items (2-5 items)',
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
  maxItems: 5,

  tags: [
    'relationship',
    'diverging',
    'branching',
    'split',
    'distribution',
    'broadcast',
  ],

  generator: (params) => {
    const source = (params.source as string | undefined) || 'Source';
    const items = params.items as string[] | undefined;
    const theme = (params.theme as ColorTheme | undefined) || 'professional';

    // Validation
    if (!items || !Array.isArray(items)) {
      throw new GlyphSetError(
        'diverging',
        'items',
        'Parameter "items" must be an array with 2-5 items'
      );
    }

    if (items.length < 2 || items.length > 5) {
      throw new GlyphSetError(
        'diverging',
        'items',
        'Diverging diagram requires 2-5 destination items'
      );
    }

    const nodes: NodeAst[] = [];

    // Create diverging data with colors from theme
    const divergingData = {
      source: {
        label: source,
        color: getThemeColor(theme, 0),
      },
      destinations: items.map((item, index) => ({
        label: item,
        color: getThemeColor(theme, index + 1),
      })),
    };

    // Single composite node that renders the entire diverging pattern
    nodes.push({
      id: 'diverging',
      shape: 'diverging',
      label: '', // Labels handled by shape rendering
      data: divergingData,
    });

    return {
      astVersion: '1.0',
      direction: 'LR' as Direction,
      nodes,
      edges: [],
    };
  },
};
