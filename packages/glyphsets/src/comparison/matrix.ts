import type { DiagramAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';
import { getThemeColor, type ColorTheme } from '../themes.js';

/**
 * Matrix GlyphSet
 *
 * Generates a 2x2 comparison matrix for analyzing four items across two dimensions.
 * Similar to PowerPoint SmartArt "Matrix" pattern (e.g., SWOT, Eisenhower Matrix).
 *
 * @example
 * ```runiq
 * diagram "SWOT Analysis" glyphset:matrix {
 *   quadrant "Strengths"
 *   quadrant "Weaknesses"
 *   quadrant "Opportunities"
 *   quadrant "Threats"
 * }
 * ```
 */
export const matrixGlyphSet: GlyphSetDefinition = {
  id: 'matrix',
  name: 'Matrix (2x2)',
  category: 'comparison',
  description:
    '2x2 comparison matrix for analyzing four items across two dimensions',

  parameters: [
    {
      name: 'quadrants',
      type: 'array',
      required: true,
      description:
        'Array of 4 quadrant labels [top-left, top-right, bottom-left, bottom-right]',
    },
    {
      name: 'horizontalAxis',
      type: 'string',
      required: false,
      description: 'Label for horizontal axis',
    },
    {
      name: 'verticalAxis',
      type: 'string',
      required: false,
      description: 'Label for vertical axis',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      default: 'professional',
      description: 'Color theme for quadrants',
    },
  ],

  minItems: 4,
  maxItems: 4,

  tags: ['matrix', 'comparison', 'quadrant', 'swot', '2x2'],

  generator: (params) => {
    const quadrants = params.quadrants as
      | (string | { label: string; color?: string })[]
      | undefined;
    const horizontalAxis = params.horizontalAxis as string | undefined;
    const verticalAxis = params.verticalAxis as string | undefined;
    const theme = (params.theme as ColorTheme | undefined) || 'professional';

    // Validation
    if (!quadrants || !Array.isArray(quadrants)) {
      throw new GlyphSetError(
        'matrix',
        'quadrants',
        'Parameter "quadrants" must be an array of strings'
      );
    }

    if (quadrants.length !== 4) {
      throw new GlyphSetError(
        'matrix',
        'quadrants',
        'Matrix requires exactly 4 quadrants [top-left, top-right, bottom-left, bottom-right]'
      );
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
      horizontalAxis: horizontalAxis || '',
      verticalAxis: verticalAxis || '',
    };

    // Create a single composite node that renders the entire matrix
    const compositeNode = {
      id: 'matrix-composite',
      shape: 'matrix',
      label: '2x2 Matrix',
      data: matrixData,
    };

    const ast: DiagramAst = {
      astVersion: '1.0',
      direction: 'LR',
      nodes: [compositeNode],
      edges: [],
    };

    return ast;
  },
};
