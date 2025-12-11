import type { DiagramAst, Direction, NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * Segmented Pyramid GlyphSet
 *
 * Generates a pyramid where each level can be subdivided into multiple horizontal segments.
 * Shows both vertical hierarchy and horizontal categorization within each level.
 * Similar to PowerPoint SmartArt "Segmented Pyramid" pattern.
 *
 * Visual: Traditional pyramid shape with horizontal dividing lines creating segments within levels.
 * Use cases: Multi-dimensional hierarchies, categorized priorities, grouped stages
 *
 * @example
 * ```runiq
 * glyphset segmentedPyramid "Product Strategy" {
 *   level "Vision" {
 *     item "Mission"
 *     item "Goals"
 *   }
 *   level "Strategy" {
 *     item "Marketing"
 *     item "Sales"
 *     item "Product"
 *   }
 *   level "Tactics" {
 *     item "Campaigns"
 *     item "Channels"
 *     item "Features"
 *     item "Pricing"
 *   }
 * }
 * ```
 *
 * @example
 * ```runiq
 * glyphset segmentedPyramid "Organizational Layers" {
 *   level "Executive" {
 *     item "CEO"
 *   }
 *   level "Management" {
 *     item "VP Eng"
 *     item "VP Product"
 *     item "VP Sales"
 *   }
 *   level "Staff" {
 *     item "Engineering"
 *     item "Design"
 *     item "Marketing"
 *     item "Support"
 *   }
 * }
 * ```
 */
export const segmentedPyramidGlyphSet: GlyphSetDefinition = {
  id: 'segmentedPyramid',
  name: 'Segmented Pyramid',
  category: 'hierarchy',
  description:
    'Pyramid with subdivided levels showing both vertical and horizontal organization',

  parameters: [
    {
      name: 'levels',
      type: 'array',
      required: true,
      description:
        'Array of level objects with label and segments: [{label, segments: [...]}]',
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
  maxItems: 6,

  tags: [
    'hierarchy',
    'pyramid',
    'segmented',
    'categorized',
    'multi-dimensional',
  ],

  generator: (params) => {
    const levels = params.levels as
      | Array<{ label: string; segments?: string[] }>
      | undefined;
    const theme = (params.theme as string | undefined) ?? 'professional';

    // Validation
    if (!levels || !Array.isArray(levels)) {
      throw new GlyphSetError(
        'segmentedPyramid',
        'levels',
        'Parameter "levels" must be an array of level objects with optional segments'
      );
    }

    if (levels.length < 3) {
      throw new GlyphSetError(
        'segmentedPyramid',
        'levels',
        'Segmented pyramid requires at least 3 levels'
      );
    }

    if (levels.length > 6) {
      throw new GlyphSetError(
        'segmentedPyramid',
        'levels',
        'Segmented pyramid supports maximum 6 levels (for readability)'
      );
    }

    // Generate a single node using the segmentedPyramid shape
    // Each level can have multiple segments (subdivisions)
    const pyramidData = {
      levels: levels.map((level, i) => ({
        label: level.label,
        value: i + 1, // Ascending (top small, bottom wide)
        segments: level.segments || [], // Optional horizontal segments
      })),
      theme,
    };

    const nodes: NodeAst[] = [
      {
        id: 'segmentedPyramid',
        shape: 'segmentedPyramid',
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
