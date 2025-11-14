import type { NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * GearCycle GlyphSet
 *
 * Creates interlocking gears showing interconnected processes.
 * Each gear represents a process step that depends on and drives other steps.
 * Visualizes mechanical or systematic relationships between components.
 * Similar to PowerPoint SmartArt "Gear" diagram.
 *
 * @example
 * ```runiq
 * glyphset gearCycle "Manufacturing Process" {
 *   item "Design"
 *   item "Production"
 *   item "Quality"
 *   item "Delivery"
 * }
 * ```
 */
export const gearCycleGlyphSet: GlyphSetDefinition = {
  id: 'gearCycle',
  name: 'Gear Cycle',
  category: 'process',
  description:
    'Interlocking gears showing interconnected processes. Represents mechanical or systematic relationships between process steps.',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of gear labels (minimum 2 gears)',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      description:
        'Color theme (professional, forest, sunset, ocean, monochrome)',
    },
  ],

  minItems: 2,
  maxItems: 6,

  tags: ['cycle', 'gear', 'mechanical', 'interconnected', 'process', 'system'],

  generator: (params) => {
    const items = params.items as string[] | undefined;
    const theme = params.theme as string | undefined;

    // Validation
    if (!items || !Array.isArray(items)) {
      throw new GlyphSetError(
        'gearCycle',
        'items',
        'Parameter "items" must be an array of strings'
      );
    }

    if (items.length < 2) {
      throw new GlyphSetError(
        'gearCycle',
        'items',
        'Gear cycle requires at least 2 gears'
      );
    }

    if (items.length > 6) {
      throw new GlyphSetError(
        'gearCycle',
        'items',
        'Gear cycle supports maximum 6 gears (for clarity)'
      );
    }

    // Create a single node that will render the entire gear cycle
    const nodes: NodeAst[] = [
      {
        id: 'gearCycle',
        shape: 'gearCycle',
        label: '',
        data: {
          items,
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
