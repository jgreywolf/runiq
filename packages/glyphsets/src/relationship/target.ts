import type { NodeAst, Direction } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';
import { getThemeColor, type ColorTheme } from '../themes.js';

/**
 * Target (Bullseye) GlyphSet
 *
 * Generates concentric circles showing nested priorities, categories, or zones.
 * Similar to PowerPoint SmartArt "Basic Target" pattern.
 *
 * Use cases:
 * - Priority levels (Critical → Important → Nice-to-have)
 * - Market segmentation (Core → Secondary → Emerging)
 * - Influence zones (Direct → Moderate → Minimal)
 * - Product roadmap (MVP → V1 → V2 → Future)
 * - Risk assessment (High → Medium → Low)
 *
 * @example
 * ```runiq
 * glyphset target "Product Priorities" {
 *   circle "Core Features"
 *   circle "Key Features"
 *   circle "Nice to Have"
 * }
 * ```
 */
export const targetGlyphSet: GlyphSetDefinition = {
  id: 'target',
  name: 'Target Diagram',
  category: 'relationship',
  description:
    'Concentric circles showing nested priorities or categories (bullseye pattern)',

  parameters: [
    {
      name: 'circles',
      type: 'array',
      required: true,
      description: 'Array of circle labels from innermost to outermost',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      default: 'professional',
      description: 'Color theme',
    },
  ],

  minItems: 2,
  maxItems: 5,

  tags: [
    'relationship',
    'target',
    'bullseye',
    'concentric',
    'priorities',
    'nested',
    'zones',
  ],

  generator: (params) => {
    const circles = params.circles as string[] | undefined;
    const theme = (params.theme as ColorTheme | undefined) || 'professional';

    // Validation
    if (!circles || !Array.isArray(circles)) {
      throw new GlyphSetError(
        'target',
        'circles',
        'Parameter "circles" must be an array of circle labels'
      );
    }

    if (circles.length < 2) {
      throw new GlyphSetError(
        'target',
        'circles',
        'Target requires at least 2 circles (min 2, max 5)'
      );
    }

    if (circles.length > 5) {
      throw new GlyphSetError(
        'target',
        'circles',
        'Target supports maximum 5 circles'
      );
    }

    const nodes: NodeAst[] = [];

    // Base size for innermost circle
    const baseSize = 80;
    const sizeIncrement = 60;

    // Create a single composite node that will render all concentric circles
    // Similar to how venn diagram works
    const targetData = {
      circles: circles.map((label, index) => ({
        label,
        level: index,
        size: baseSize + index * sizeIncrement,
        color: getThemeColor(theme, index),
      })),
    };

    nodes.push({
      id: 'target',
      shape: 'target', // Will need to create this shape or use a workaround
      label: '', // Labels handled by shape rendering
      data: targetData,
    });

    return {
      astVersion: '1.0',
      direction: 'TB' as Direction,
      nodes,
      edges: [], // No edges in concentric circles
    };
  },
};
