import type { DiagramAst, Direction } from '@runiq/core';
import { getThemeColor, type ColorTheme } from '../themes.js';
import type { GlyphSetDefinition } from '../types.js';

/**
 * Cluster Glyphset
 *
 * Displays a central concept surrounded by related items in a radial pattern.
 * Perfect for showing:
 * - Central idea with supporting concepts
 * - Hub-and-spoke relationships
 * - Topic clustering
 * - Category grouping
 * - Team structure with central leader
 *
 * Visual: Center circle with 3-8 satellite circles arranged radially
 *
 * @example
 * ```typescript
 * glyphset cluster "Product Features" {
 *   item "Fast Performance"
 *   item "Easy to Use"
 *   item "Secure"
 *   item "Scalable"
 * }
 * ```
 */
export const clusterGlyphSet: GlyphSetDefinition = {
  id: 'cluster',
  name: 'Cluster Diagram',
  category: 'relationship',
  description:
    'Central concept with related items arranged in a radial pattern around it',
  parameters: [
    {
      name: 'center',
      type: 'string',
      required: false,
      default: 'Central Concept',
      description: 'The central concept or hub',
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Related items surrounding the center (3-8 items)',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      default: 'professional',
      description: 'Color theme for the diagram',
    },
  ],
  minItems: 3,
  maxItems: 8,
  tags: [
    'relationship',
    'cluster',
    'radial',
    'hub',
    'grouping',
    'centered',
    'surrounding',
  ],
  generator: (params) => {
    const center = (params.center as string | undefined) || 'Central Concept';
    const items = params.items as string[] | undefined;
    const theme = (params.theme as ColorTheme | undefined) || 'professional';

    if (!items || !Array.isArray(items)) {
      throw new Error('cluster glyphset requires an items array');
    }

    if (items.length < 3) {
      throw new Error('cluster glyphset requires at least 3 items');
    }

    if (items.length > 8) {
      throw new Error('cluster glyphset supports maximum 8 items');
    }

    // Create cluster data structure
    const clusterData = {
      center: {
        label: center,
        color: getThemeColor(theme, 0), // Center gets first theme color
      },
      satellites: items.map((item, index) => ({
        label: item,
        color: getThemeColor(theme, index + 1), // Satellites get subsequent colors
      })),
    };

    // Create a single composite node that renders the entire cluster
    const compositeNode = {
      id: 'cluster-composite',
      shape: 'cluster',
      label: center,
      data: clusterData,
    };

    const ast: DiagramAst = {
      astVersion: '1.0',
      direction: 'LR' as Direction, // Not really used since cluster is radial, but required
      nodes: [compositeNode],
      edges: [],
    };

    return ast;
  },
};
