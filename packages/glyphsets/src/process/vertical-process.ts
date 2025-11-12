import type { DiagramAst, NodeAst, EdgeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * Vertical Process GlyphSet
 *
 * Generates a linear top-to-bottom process flow with steps connected sequentially.
 * Similar to PowerPoint SmartArt "Vertical Process" pattern.
 *
 * @example
 * ```runiq
 * diagram "Project Phases" glyphset:vertical-process {
 *   step "Initiation"
 *   step "Planning"
 *   step "Execution"
 *   step "Monitoring"
 *   step "Closure"
 * }
 * ```
 */
export const verticalProcessGlyphSet: GlyphSetDefinition = {
  id: 'verticalProcess',
  name: 'Vertical Process',
  category: 'process',
  description: 'Linear process flow from top to bottom with sequential steps',

  parameters: [
    {
      name: 'steps',
      type: 'array',
      required: true,
      description: 'Array of step labels (minimum 2 steps)',
    },
    {
      name: 'shape',
      type: 'string',
      required: false,
      default: 'rounded',
      description: 'Shape for each step (rounded, rect, hexagon)',
    },
  ],

  minItems: 2,
  maxItems: 10,

  tags: ['process', 'workflow', 'sequential', 'vertical'],

  generator: (params) => {
    const steps = params.steps as string[] | undefined;
    const shape = (params.shape as string | undefined) || 'rounded';

    // Validation
    if (!steps || !Array.isArray(steps)) {
      throw new GlyphSetError(
        'vertical-process',
        'steps',
        'Parameter "steps" must be an array of strings'
      );
    }

    if (steps.length < 2) {
      throw new GlyphSetError(
        'vertical-process',
        'steps',
        'Vertical process requires at least 2 steps'
      );
    }

    if (steps.length > 10) {
      throw new GlyphSetError(
        'vertical-process',
        'steps',
        'Vertical process supports maximum 10 steps (for readability)'
      );
    }

    // Generate nodes with SmartArt-style processBox shape
    const nodes: NodeAst[] = steps.map((label, i) => ({
      id: `step${i + 1}`,
      shape: 'processBox', // Use SmartArt-style processBox!
      label,
    }));

    // Generate edges (sequential connections)
    const edges: EdgeAst[] = [];
    for (let i = 0; i < steps.length - 1; i++) {
      edges.push({
        from: `step${i + 1}`,
        to: `step${i + 2}`,
      });
    }

    return {
      astVersion: '1.0',
      direction: 'TB', // Top-to-bottom
      nodes,
      edges,
    };
  },
};
