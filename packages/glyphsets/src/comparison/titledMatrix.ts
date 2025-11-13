import type { GlyphSetDefinition } from '../types.js';
import type { DiagramAst } from '@runiq/core';
import { getThemeColor, type ColorTheme } from '../themes.js';

/**
 * Titled Matrix Glyphset
 *
 * Displays a 2x2 or 3x3 matrix with row and column headers.
 * Perfect for showing:
 * - Decision matrices with criteria
 * - Feature comparison tables
 * - Cross-functional analysis
 * - Product-market fit
 * - Responsibility assignment (RACI)
 *
 * Visual: Grid with labeled rows and columns
 *
 * @example
 * ```typescript
 * glyphset titledMatrix "Feature Comparison" {
 *   quadrant "High Priority"
 *   quadrant "Medium Priority"
 *   quadrant "Low Priority"
 *   quadrant "Deferred"
 * }
 * ```
 */
export const titledMatrixGlyphSet: GlyphSetDefinition = {
  id: 'titledMatrix',
  name: 'Titled Matrix',
  category: 'comparison',
  description: 'Grid with row and column headers for structured comparison',
  parameters: [
    {
      name: 'quadrants',
      type: 'array',
      required: true,
      description: 'Quadrant labels (4 for 2x2, 9 for 3x3)',
    },
    {
      name: 'columnHeaders',
      type: 'array',
      required: false,
      description: 'Column header labels (2 or 3)',
    },
    {
      name: 'rowHeaders',
      type: 'array',
      required: false,
      description: 'Row header labels (2 or 3)',
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
  maxItems: 9,
  tags: [
    'comparison',
    'matrix',
    'grid',
    'titled',
    'headers',
    'table',
    'structured',
  ],
  generator: (params) => {
    const quadrants = params.quadrants as string[] | undefined;
    const columnHeaders = (params.columnHeaders as string[] | undefined) || [];
    const rowHeaders = (params.rowHeaders as string[] | undefined) || [];
    const theme = (params.theme as ColorTheme | undefined) || 'professional';

    if (!quadrants || !Array.isArray(quadrants)) {
      throw new Error('titledMatrix glyphset requires a quadrants array');
    }

    if (quadrants.length !== 4 && quadrants.length !== 9) {
      throw new Error('titledMatrix glyphset requires 4 or 9 quadrants');
    }

    const size = quadrants.length === 4 ? 2 : 3;

    // Use default headers if not provided
    const cols =
      columnHeaders.length === size
        ? columnHeaders
        : Array.from({ length: size }, (_, i) => `Col ${i + 1}`);
    const rows =
      rowHeaders.length === size
        ? rowHeaders
        : Array.from({ length: size }, (_, i) => `Row ${i + 1}`);

    // Create matrix data structure
    const matrixData = {
      quadrants: quadrants.map((label, index) => ({
        label,
        color: getThemeColor(theme, index),
      })),
      columnHeaders: cols,
      rowHeaders: rows,
      size,
    };

    // Create a single composite node that renders the entire matrix
    const compositeNode = {
      id: 'titledMatrix-composite',
      shape: 'titledMatrix',
      label: 'Titled Matrix',
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
