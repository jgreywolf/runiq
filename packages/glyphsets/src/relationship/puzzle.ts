import type { DiagramAst, Direction } from '@runiq/core';
import { getThemeColor, type ColorTheme } from '../themes.js';
import type { GlyphSetDefinition } from '../types.js';

/**
 * Puzzle Glyphset
 *
 * Displays interlocking puzzle pieces showing how parts fit together.
 * Perfect for showing:
 * - Components that integrate together
 * - Interdependent parts
 * - System integration
 * - Teamwork and collaboration
 * - Problem-solving steps
 *
 * Visual: 2-6 puzzle pieces arranged in a grid pattern
 *
 * @example
 * ```typescript
 * glyphset puzzle "System Components" {
 *   item "Frontend"
 *   item "Backend"
 *   item "Database"
 *   item "API"
 * }
 * ```
 */
export const puzzleGlyphSet: GlyphSetDefinition = {
  id: 'puzzle',
  name: 'Puzzle Diagram',
  category: 'relationship',
  description: 'Interlocking puzzle pieces showing how components fit together',
  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Puzzle pieces to display (2-6 items)',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      default: 'colorful',
      description: 'Color theme for the puzzle pieces',
    },
  ],
  minItems: 2,
  maxItems: 6,
  tags: [
    'relationship',
    'puzzle',
    'integration',
    'interlocking',
    'components',
    'fit',
  ],
  generator: (params) => {
    const items = params.items as string[] | undefined;
    const theme = (params.theme as ColorTheme | undefined) || 'colorful';

    if (!items || !Array.isArray(items)) {
      throw new Error('puzzle glyphset requires an items array');
    }

    if (items.length < 2) {
      throw new Error('puzzle glyphset requires at least 2 items');
    }

    if (items.length > 6) {
      throw new Error('puzzle glyphset supports maximum 6 items');
    }

    // Create puzzle data structure
    const puzzleData = {
      pieces: items.map((item, index) => ({
        label: item,
        color: getThemeColor(theme, index),
      })),
    };

    // Create a single composite node that renders the entire puzzle
    const compositeNode = {
      id: 'puzzle-composite',
      shape: 'puzzle',
      label: items.join(' + '),
      data: puzzleData,
    };

    const ast: DiagramAst = {
      astVersion: '1.0',
      direction: 'LR' as Direction,
      nodes: [compositeNode],
      edges: [],
    };

    return ast;
  },
};
