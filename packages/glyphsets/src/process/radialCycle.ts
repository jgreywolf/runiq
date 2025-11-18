import type { NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * RadialCycle GlyphSet
 *
 * Creates a radial diagram with a center hub and spokes to surrounding items.
 * Shows how multiple items relate to a central concept or how a central hub
 * connects to various components.
 * Similar to PowerPoint SmartArt "Radial Cycle".
 *
 * @example
 * ```runiq
 * glyphset radialCycle "Product Features" {
 *   item "Performance"
 *   item "Security"
 *   item "Usability"
 *   item "Scalability"
 *   item "Reliability"
 *
 *   centerLabel "Product"
 * }
 * ```
 */
export const radialCycleGlyphSet: GlyphSetDefinition = {
  id: 'radialCycle',
  name: 'Radial Cycle',
  category: 'process',
  description:
    'Center hub with spokes radiating to surrounding items. Shows relationship between central concept and related components.',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of items radiating from center (minimum 3 items)',
    },
    {
      name: 'centerLabel',
      type: 'string',
      required: false,
      description: 'Label for the center hub (default: "Center")',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      description:
        'Color theme (professional, forest, sunset, ocean, monochrome)',
    },
  ],

  minItems: 3,
  maxItems: 8,

  tags: ['cycle', 'radial', 'hub', 'spokes', 'center', 'relationship'],

  generator: (params) => {
    const items = params.items as string[] | undefined;
    const centerLabel = (params.centerLabel as string) || 'Center';
    const theme = params.theme as string | undefined;

    // Validation
    if (!items || !Array.isArray(items)) {
      throw new GlyphSetError(
        'radialCycle',
        'items',
        'Parameter "items" must be an array of strings'
      );
    }

    if (items.length < 3) {
      throw new GlyphSetError(
        'radialCycle',
        'items',
        'Radial cycle requires at least 3 items'
      );
    }

    if (items.length > 8) {
      throw new GlyphSetError(
        'radialCycle',
        'items',
        'Radial cycle supports maximum 8 items (for readability)'
      );
    }

    // Create a single node that will render the entire radial cycle
    const nodes: NodeAst[] = [
      {
        id: 'radialCycle',
        shape: 'radialCycle',
        label: '',
        data: {
          items,
          centerLabel,
          theme,
        },
      },
    ];

    return {
      astVersion: '1.0',
      nodes,
      edges: [],
    };
  },
};
