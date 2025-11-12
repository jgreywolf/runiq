import type { DiagramAst, NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

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
 *   step "Plan"
 *   step "Do"
 *   step "Check"
 *   step "Act"
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
  ],

  minItems: 3,
  maxItems: 8,

  tags: ['process', 'cycle', 'circular', 'iterative', 'loop'],

  generator: (params) => {
    const steps = params.steps as string[] | undefined;

    // Validation
    if (!steps || !Array.isArray(steps)) {
      throw new GlyphSetError('cycle', 'steps', 'Parameter "steps" must be an array of strings');
    }

    if (steps.length < 3) {
      throw new GlyphSetError(
        'cycle',
        'steps',
        'Cycle requires at least 3 steps to form a meaningful cycle'
      );
    }

    if (steps.length > 8) {
      throw new GlyphSetError(
        'cycle',
        'steps',
        'Cycle supports maximum 8 steps (for readability)'
      );
    }

    // Generate a single node using the cycle shape
    // The cycle shape renders steps in a circular arrangement internally
    const cycleData = {
      steps,
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
