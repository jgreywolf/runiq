import type { NodeAst, Direction } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';
import { getThemeColor, type ColorTheme } from '../themes.js';

/**
 * Converging GlyphSet
 *
 * Generates a diagram showing multiple sources converging to a single destination.
 * Similar to PowerPoint SmartArt "Converging" pattern.
 *
 * Use cases:
 * - Multiple inputs to single output (data aggregation)
 * - Team collaboration converging to goal
 * - Resources flowing to central point
 * - Ideas merging into solution
 * - Streams joining into river
 */
export const convergingGlyphSet: GlyphSetDefinition = {
  id: 'converging',
  name: 'Converging Diagram',
  category: 'relationship',
  description:
    'Shows multiple sources converging to a single destination point',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Source items that converge (2-5 items)',
    },
    {
      name: 'target',
      type: 'string',
      required: false,
      default: 'Target',
      description: 'Target destination where sources converge',
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
    'converging',
    'funnel',
    'merge',
    'aggregation',
    'unity',
  ],

  generator: (params) => {
    const items = params.items as string[] | undefined;
    const target = (params.target as string | undefined) || 'Target';
    const theme = (params.theme as ColorTheme | undefined) || 'professional';

    // Validation
    if (!items || !Array.isArray(items)) {
      throw new GlyphSetError(
        'converging',
        'items',
        'Parameter "items" must be an array with 2-5 items'
      );
    }

    if (items.length < 2 || items.length > 5) {
      throw new GlyphSetError(
        'converging',
        'items',
        'Converging diagram requires 2-5 items'
      );
    }

    const nodes: NodeAst[] = [];

    // Create converging data with colors from theme
    const convergingData = {
      sources: items.map((source, index) => ({
        label: source,
        color: getThemeColor(theme, index),
      })),
      target: {
        label: target,
        color: getThemeColor(theme, items.length), // Different color for target
      },
    };

    // Single composite node that renders the entire converging pattern
    nodes.push({
      id: 'converging',
      shape: 'converging',
      label: '', // Labels handled by shape rendering
      data: convergingData,
    });

    return {
      astVersion: '1.0',
      direction: 'LR' as Direction,
      nodes,
      edges: [],
    };
  },
};
