import type { NodeAst } from '@runiq/core';
import { type GlyphSetDefinition } from '../types.js';
import { extractStringParam } from '../utils/parameters.js';
import { validateArrayParameter } from '../utils/validation.js';

/**
 * Cycle GlyphSet
 *
 * Generates a circular process flow where steps are arranged in a circle.
 * Uses the cycle shape for beautiful circular rendering.
 * Similar to PowerPoint SmartArt "Basic Cycle" pattern.
 *
 * @example
 * ```runiq
 * glyphset cycle "PDCA Cycle" {
 *   item "Plan"
 *   item "Do"
 *   item "Check"
 *   item "Act"
 * }
 * ```
 */
export const cycleGlyphSet: GlyphSetDefinition = {
  id: 'cycle',
  name: 'Cycle',
  category: 'process',
  description: 'Circular process flow where steps are arranged in a circle',

  parameters: [
    {
      name: 'steps',
      type: 'array',
      required: true,
      description: 'Array of step labels (minimum 3 steps)',
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

  tags: ['process', 'cycle', 'circular', 'iterative', 'loop'],

  generator: (params) => {
    const steps = params.steps as string[] | undefined;
    const theme = extractStringParam(params, 'theme');

    // Validation - validateArrayParameter checks both required and array constraints
    validateArrayParameter('cycle', 'steps', steps, {
      minItems: 3,
      maxItems: 8,
      itemType: 'string',
    });

    // Generate a single node using the cycle shape
    // The cycle shape renders steps in a circular arrangement internally
    const cycleData = {
      steps,
      theme,
    };

    const nodes: NodeAst[] = [
      {
        id: 'cycle',
        shape: 'cycle', // Use cycle shape for circular rendering!
        label: '',
        data: cycleData,
      },
    ];

    return {
      astVersion: '1.0',
      nodes,
      edges: [], // No edges - cycle shape handles everything
    };
  },
};
