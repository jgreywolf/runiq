import type { Direction, NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * Pyramid List GlyphSet
 *
 * Generates a split layout with a pyramid on the left and descriptive list items on the right.
 * Each pyramid level corresponds to one or more list items.
 * Similar to PowerPoint SmartArt "Pyramid List" pattern.
 *
 * Visual: Traditional pyramid shape on left, aligned text list on right
 * Use cases: Hierarchical concepts with descriptions, prioritized features with details
 *
 * @example
 * ```runiq
 * glyphset pyramidList "Feature Priority" {
 *   level "Must Have" {
 *     item "User Authentication"
 *     item "Data Persistence"
 *   }
 *   level "Should Have" {
 *     item "Email Notifications"
 *     item "Search Functionality"
 *   }
 *   level "Nice to Have" {
 *     item "Dark Mode"
 *     item "Export to PDF"
 *     item "Analytics Dashboard"
 *   }
 * }
 * ```
 *
 * @example
 * ```runiq
 * glyphset pyramidList "Learning Path" {
 *   level "Foundation" {
 *     item "HTML & CSS Basics"
 *     item "JavaScript Fundamentals"
 *   }
 *   level "Intermediate" {
 *     item "React Framework"
 *     item "State Management"
 *     item "API Integration"
 *   }
 *   level "Advanced" {
 *     item "Performance Optimization"
 *     item "Testing Strategies"
 *     item "CI/CD Pipeline"
 *     item "Cloud Deployment"
 *   }
 * }
 * ```
 */
export const pyramidListGlyphSet: GlyphSetDefinition = {
  id: 'pyramidList',
  name: 'Pyramid List',
  category: 'hierarchy',
  description:
    'Split layout with pyramid on left and descriptive list items on right',

  parameters: [
    {
      name: 'levels',
      type: 'array',
      required: true,
      description:
        'Array of level objects with label and items: [{label, items: [...]}]',
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

  tags: ['hierarchy', 'pyramid', 'list', 'descriptive', 'detailed'],

  generator: (params) => {
    const levels = params.levels as
      | Array<{ label: string; items?: string[] }>
      | undefined;
    const theme = (params.theme as string | undefined) ?? 'professional';

    // Validation
    if (!levels || !Array.isArray(levels)) {
      throw new GlyphSetError(
        'pyramidList',
        'levels',
        'Parameter "levels" must be an array of level objects with items'
      );
    }

    if (levels.length < 3) {
      throw new GlyphSetError(
        'pyramidList',
        'levels',
        'Pyramid list requires at least 3 levels'
      );
    }

    if (levels.length > 6) {
      throw new GlyphSetError(
        'pyramidList',
        'levels',
        'Pyramid list supports maximum 6 levels (for readability)'
      );
    }

    // Generate a single node using the pyramidList shape
    // Each level has a label and optional list items
    const pyramidData = {
      levels: levels.map((level, i) => ({
        label: level.label,
        value: i + 1, // Ascending (top small, bottom wide)
        items: level.items || [], // List items for this level
      })),
      theme,
    };

    const nodes: NodeAst[] = [
      {
        id: 'pyramidList',
        shape: 'pyramidList',
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
