import type { NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';
import { getThemeColor, type ColorTheme } from '../themes.js';

/**
 * Opposing GlyphSet
 *
 * Generates a diagram showing opposing or conflicting items with tension/divergence.
 * Similar to PowerPoint SmartArt "Opposing" pattern.
 *
 * Use cases:
 * - Conflict representation (old vs new, tradition vs innovation)
 * - Opposing forces (supply vs demand, push vs pull)
 * - Contradictions or paradoxes
 * - Debate or argument structure
 */
export const opposingGlyphSet: GlyphSetDefinition = {
  id: 'opposing',
  name: 'Opposing Diagram',
  category: 'relationship',
  description:
    'Shows opposing or conflicting items with arrows pointing away from each other',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Items that oppose each other (2-4 items)',
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
  maxItems: 4,

  tags: [
    'relationship',
    'opposing',
    'conflict',
    'tension',
    'divergence',
    'debate',
  ],

  generator: (params) => {
    const items = params.items as string[] | undefined;
    const theme = (params.theme as ColorTheme | undefined) || 'professional';

    // Validation
    if (!items || !Array.isArray(items)) {
      throw new GlyphSetError(
        'opposing',
        'items',
        'Parameter "items" must be an array with 2-4 items'
      );
    }

    if (items.length < 2 || items.length > 4) {
      throw new GlyphSetError(
        'opposing',
        'items',
        'Opposing diagram requires 2-4 items'
      );
    }

    const nodes: NodeAst[] = [];

    // Create opposing data with colors from theme
    const opposingData = {
      items: items.map((item, index) => ({
        label: item,
        color: getThemeColor(theme, index),
      })),
      pattern: items.length, // 2, 3, or 4
    };

    // Single composite node that renders the entire opposing pattern
    nodes.push({
      id: 'opposing',
      shape: 'opposing',
      label: '', // Labels handled by shape rendering
      data: opposingData,
    });

    return {
      astVersion: '1.0',
      direction: 'TB',
      nodes,
      edges: [],
    };
  },
};
