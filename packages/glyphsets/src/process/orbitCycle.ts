import type { NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * OrbitCycle GlyphSet
 *
 * Creates a planetary orbit diagram with a central core and orbiting items.
 * Shows items revolving around or dependent on a central concept, system, or core.
 * Visual metaphor for satellites, dependencies, ecosystem, or hierarchical relationships
 * where multiple items orbit or relate to a central entity.
 * Similar to PowerPoint SmartArt orbital/planetary concepts.
 *
 * @example
 * ```runiq
 * glyphset orbitCycle "Enterprise System" {
 *   item "CRM"
 *   item "ERP"
 *   item "Analytics"
 *   item "Marketing"
 *   item "Support"
 *
 *   centerLabel "Core Platform"
 * }
 * ```
 */
export const orbitCycleGlyphSet: GlyphSetDefinition = {
  id: 'orbitCycle',
  name: 'Orbit Cycle',
  category: 'process',
  description:
    'Planetary orbit style with central core and orbiting items. Shows items revolving around or dependent on a central concept.',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of orbiting item labels (minimum 2 items)',
    },
    {
      name: 'centerLabel',
      type: 'string',
      required: false,
      description: 'Label for the central core (default: "Core")',
    },
  ],

  minItems: 2,
  maxItems: 9,

  tags: [
    'cycle',
    'orbit',
    'planetary',
    'central',
    'satellite',
    'ecosystem',
    'hub',
  ],

  generator: (params) => {
    const items = params.items as string[] | undefined;
    const centerLabel = (params.centerLabel as string) || 'Core';

    // Validation
    if (!items || !Array.isArray(items)) {
      throw new GlyphSetError(
        'orbitCycle',
        'items',
        'Parameter "items" must be an array of strings'
      );
    }

    if (items.length < 2) {
      throw new GlyphSetError(
        'orbitCycle',
        'items',
        'Orbit cycle requires at least 2 orbiting items'
      );
    }

    if (items.length > 9) {
      throw new GlyphSetError(
        'orbitCycle',
        'items',
        'Orbit cycle supports maximum 9 orbiting items (3 orbits × 3 items each)'
      );
    }

    // Create a single node that will render the entire orbit cycle
    const nodes: NodeAst[] = [
      {
        id: 'orbitCycle',
        shape: 'orbitCycle',
        label: '',
        data: {
          items,
          centerLabel,
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
