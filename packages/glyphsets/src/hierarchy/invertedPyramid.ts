import type { Direction, NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * Inverted Pyramid GlyphSet
 *
 * Generates an upside-down pyramid (funnel shape) with levels from wide (top) to narrow (bottom).
 * Useful for filtering processes, conversion funnels, or diminishing hierarchies.
 * Similar to PowerPoint SmartArt "Inverted Pyramid" pattern.
 *
 * Visual: Wide trapezoid at top, progressively narrower levels below, ending in a point.
 * Use cases: Sales funnel, hiring pipeline, refinement process, elimination stages
 *
 * @example
 * ```runiq
 * glyphset invertedPyramid "Sales Funnel" {
 *   level "Leads"
 *   level "Qualified Prospects"
 *   level "Proposals"
 *   level "Closed Deals"
 * }
 * ```
 *
 * @example
 * ```runiq
 * glyphset invertedPyramid "Hiring Pipeline" {
 *   level "Applications"
 *   level "Phone Screens"
 *   level "Interviews"
 *   level "Offers"
 *   level "Hires"
 * }
 * ```
 */
export const invertedPyramidGlyphSet: GlyphSetDefinition = {
  id: 'invertedPyramid',
  name: 'Inverted Pyramid',
  category: 'hierarchy',
  description:
    'Upside-down pyramid (funnel) with levels from wide (top) to narrow (bottom)',

  parameters: [
    {
      name: 'levels',
      type: 'array',
      required: true,
      description: 'Array of level labels (minimum 3 levels)',
    },
    {
      name: 'showValues',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Show numeric values on levels',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      default: 'professional',
      description: 'Color theme: professional, colorful, warm, cool, vibrant',
    },
  ],

  minItems: 3,
  maxItems: 8,

  tags: ['hierarchy', 'pyramid', 'inverted', 'funnel', 'filter', 'conversion'],

  generator: (params) => {
    const levels = params.levels as string[] | undefined;
    const showValues = (params.showValues as boolean | undefined) ?? false;
    const theme = (params.theme as string | undefined) ?? 'professional';

    // Validation
    if (!levels || !Array.isArray(levels)) {
      throw new GlyphSetError(
        'invertedPyramid',
        'levels',
        'Parameter "levels" must be an array of strings'
      );
    }

    if (levels.length < 3) {
      throw new GlyphSetError(
        'invertedPyramid',
        'levels',
        'Inverted pyramid requires at least 3 levels'
      );
    }

    if (levels.length > 8) {
      throw new GlyphSetError(
        'invertedPyramid',
        'levels',
        'Inverted pyramid supports maximum 8 levels (for readability)'
      );
    }

    // Generate a single node using the invertedPyramid shape
    // For inverted pyramid: top level is largest (wide), bottom level is smallest (narrow)
    const pyramidData = {
      levels: levels.map((label, i) => ({
        label,
        value: levels.length - i, // Descending values (top = n (wide), bottom = 1 (narrow))
      })),
      showValues,
      theme,
    };

    const nodes: NodeAst[] = [
      {
        id: 'invertedPyramid',
        shape: 'invertedPyramid',
        label: '',
        data: pyramidData,
      },
    ];

    return {
      astVersion: '1.0',
      direction: 'TB' as Direction,
      nodes,
      edges: [],
    };
  },
};
