import type { DiagramAst, NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';
import { getThemeColor, type ColorTheme } from '../themes.js';

/**
 * Venn Diagram GlyphSet
 *
 * Generates a Venn diagram with 2, 3, or 4 overlapping circles to show relationships.
 * Uses the existing venn shape for rendering beautiful, SmartArt-style Venn diagrams.
 * Similar to PowerPoint SmartArt "Basic Venn" pattern.
 *
 * @example
 * ```runiq
 * glyphset venn "Product Features" {
 *   circle "Essential"
 *   circle "Valuable"
 *   circle "Delightful"
 * }
 * ```
 */
export const vennGlyphSet: GlyphSetDefinition = {
  id: 'venn',
  name: 'Venn Diagram',
  category: 'comparison',
  description:
    'Venn diagram with overlapping circles to show relationships and intersections',

  parameters: [
    {
      name: 'circles',
      type: 'array',
      required: true,
      description: 'Array of circle labels (2, 3, or 4 circles)',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      default: 'professional',
      description: 'Color theme for circles',
    },
  ],

  minItems: 2,
  maxItems: 4,

  tags: ['venn', 'comparison', 'overlap', 'intersection', 'relationship'],

  generator: (params) => {
    const circles = params.circles as string[] | undefined;
    const theme = (params.theme as ColorTheme | undefined) || 'professional';

    // Validation
    if (!circles || !Array.isArray(circles)) {
      throw new GlyphSetError(
        'venn',
        'circles',
        'Parameter "circles" must be an array of strings'
      );
    }

    if (circles.length < 2 || circles.length > 4) {
      throw new GlyphSetError(
        'venn',
        'circles',
        'Venn diagram requires 2, 3, or 4 circles'
      );
    }

    // Generate a single node using the venn shape
    // The venn shape automatically determines 2, 3, or 4 circle layout
    const vennData = {
      labels: circles,
      colors: circles.map((_, index) => getThemeColor(theme, index)),
    };

    const nodes: NodeAst[] = [
      {
        id: 'venn',
        shape: 'venn', // Use existing venn shape for rendering!
        label: '', // Label handled by shape rendering
        data: vennData,
      },
    ];

    return {
      astVersion: '1.0',
      nodes,
      edges: [], // No edges - venn shape is self-contained
    };
  },
};
