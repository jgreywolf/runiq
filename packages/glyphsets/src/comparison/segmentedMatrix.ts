import type { GlyphSetDefinition } from '../types.js';
import type { DiagramAst } from '@runiq/core';
import { getThemeColor, type ColorTheme } from '../themes.js';

/**
 * Segmented Matrix Glyphset
 *
 * Displays a matrix where each quadrant can be subdivided into smaller cells.
 * Perfect for showing:
 * - Detailed analysis with sub-categories
 * - Hierarchical classification
 * - Multi-level prioritization
 * - Complex decision frameworks
 * - Nested categorization
 *
 * Visual: Grid with subdivided quadrants
 *
 * @example
 * ```typescript
 * glyphset segmentedMatrix "Priority Matrix" {
 *   quadrant "Critical & Urgent"
 *   quadrant "Critical & Not Urgent"
 *   quadrant "Not Critical & Urgent"
 *   quadrant "Not Critical & Not Urgent"
 * }
 * ```
 */
export const segmentedMatrixGlyphSet: GlyphSetDefinition = {
  id: 'segmentedMatrix',
  name: 'Segmented Matrix',
  category: 'comparison',
  description: 'Matrix with subdivided quadrants for detailed analysis',
  parameters: [
    {
      name: 'quadrants',
      type: 'array',
      required: true,
      description: 'Main quadrant labels (4 quadrants)',
    },
    {
      name: 'segments',
      type: 'array',
      required: false,
      description: 'Optional sub-segment labels within each quadrant',
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
  minItems: 4,
  maxItems: 4,
  tags: [
    'comparison',
    'matrix',
    'segmented',
    'subdivided',
    'detailed',
    'nested',
  ],
  generator: (params) => {
    const quadrants = params.quadrants as
      | (
          | string
          | { label: string; color?: string; segments?: { label: string }[] }
        )[]
      | undefined;
    const segments = (params.segments as string[] | undefined) || [];
    const xAxis = (params.xAxis as string | undefined) || '';
    const yAxis = (params.yAxis as string | undefined) || '';
    const theme = (params.theme as ColorTheme | undefined) || 'professional';

    if (!quadrants || !Array.isArray(quadrants)) {
      throw new Error('segmentedMatrix glyphset requires a quadrants array');
    }

    if (quadrants.length !== 4) {
      throw new Error('segmentedMatrix glyphset requires exactly 4 quadrants');
    }

    // Create matrix data structure
    const matrixData = {
      quadrants: quadrants.map((item, index) => {
        if (typeof item === 'string') {
          return {
            label: item,
            color: getThemeColor(theme, index),
            segments:
              segments.length > 0
                ? segments
                    .filter((_, i) => Math.floor(i / 2) === index)
                    .slice(0, 4)
                : [],
          };
        }
        // Filter out empty labels and limit to 4 segments per quadrant
        const filteredSegments = (item.segments || [])
          .filter((seg) => seg.label && seg.label.trim() !== '')
          .slice(0, 4);
        return {
          label: item.label,
          color: item.color || getThemeColor(theme, index),
          segments: filteredSegments,
        };
      }),
      xAxis,
      yAxis,
    };

    // Create a single composite node that renders the entire matrix
    const compositeNode = {
      id: 'segmentedMatrix-composite',
      shape: 'segmentedMatrix',
      label: 'Segmented Matrix',
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
