import type { DiagramAst, Direction } from '@runiq/core';
import { getThemeColor, type ColorTheme } from '../themes.js';
import type { GlyphSetDefinition } from '../types.js';

/**
 * 3x3 Matrix Glyphset
 *
 * Displays a 3x3 grid for analyzing items across 9 categories.
 * Perfect for showing:
 * - 9-box talent grid (performance vs potential)
 * - Risk assessment matrix (likelihood vs impact)
 * - Product portfolio analysis
 * - Feature prioritization
 * - Strategic positioning
 *
 * Visual: 3x3 grid with labeled quadrants
 *
 * @example
 * ```typescript
 * glyphset matrix3x3 "Risk Matrix" {
 *   quadrant "Low Risk"
 *   quadrant "Medium Risk"
 *   quadrant "High Risk"
 *   // ... 6 more quadrants
 * }
 * ```
 */
export const matrix3x3GlyphSet: GlyphSetDefinition = {
  id: 'matrix3x3',
  name: '3x3 Matrix',
  category: 'comparison',
  description: 'Nine-quadrant grid for comprehensive analysis',
  parameters: [
    {
      name: 'quadrants',
      type: 'array',
      required: true,
      description: '9 quadrant labels (top-left to bottom-right, row by row)',
    },
    {
      name: 'xAxis',
      type: 'string',
      required: false,
      description: 'X-axis label (horizontal)',
    },
    {
      name: 'yAxis',
      type: 'string',
      required: false,
      description: 'Y-axis label (vertical)',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      default: 'professional',
      description: 'Color theme for quadrants',
    },
  ],
  minItems: 9,
  maxItems: 9,
  tags: [
    'comparison',
    'matrix',
    'grid',
    'quadrants',
    'analysis',
    'nine-box',
    '3x3',
  ],
  generator: (params) => {
    const quadrants = params.quadrants as
      | (string | { label: string; color?: string })[]
      | undefined;
    const xAxis = (params.xAxis as string | undefined) || '';
    const yAxis = (params.yAxis as string | undefined) || '';
    const theme = (params.theme as ColorTheme | undefined) || 'professional';

    if (!quadrants || !Array.isArray(quadrants)) {
      throw new Error('matrix3x3 glyphset requires a quadrants array');
    }

    if (quadrants.length !== 9) {
      throw new Error('matrix3x3 glyphset requires exactly 9 quadrants');
    }

    // Create matrix data structure
    const matrixData = {
      quadrants: quadrants.map((item, index) => {
        if (typeof item === 'string') {
          return {
            label: item,
            color: getThemeColor(theme, index),
          };
        }
        return {
          label: item.label,
          color: item.color || getThemeColor(theme, index),
        };
      }),
      xAxis,
      yAxis,
    };

    // Create a single composite node that renders the entire matrix
    const compositeNode = {
      id: 'matrix3x3-composite',
      shape: 'matrix3x3',
      label: '3x3 Matrix',
      data: matrixData,
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
