import type {
  ContainerDeclaration,
  ContainerTemplate,
  DiagramAst,
  EdgeAst,
  LineStyle,
  Direction,
} from '@runiq/core';
import { type GlyphSetDefinition } from '../types.js';
import { generateLinearProcess } from '../utils/generators.js';
import { extractArrayParam, extractCommonParams } from '../utils/parameters.js';
import {
  validateArrayParameter,
  validateStringParameter,
} from '../utils/validation.js';

/**
 * Basic Process GlyphSet
 *
 * Generates a linear process flow with steps connected sequentially.
 * Supports both horizontal (left-to-right) and vertical (top-to-bottom) orientations.
 * Similar to PowerPoint SmartArt "Basic Process" and "Vertical Process" patterns.
 *
 * @example
 * ```runiq
 * glyphset basicProcess "Software Development" {
 *   orientation "horizontal"
 *   theme "colorful"
 *   item "Research"
 *   item "Design"
 *   item "Develop"
 *   item "Test"
 *   item "Deploy"
 * }
 * ```
 *
 * @example
 * ```runiq
 * glyphset basicProcess "Project Phases"  {
 *   orientation "vertical"
 *   item "Initiation"
 *   item "Planning"
 *   item "Execution"
 *   item "Monitoring"
 *   item "Closure"
 * }
 * ```
 */
export const basicProcessGlyphSet: GlyphSetDefinition = {
  id: 'basicProcess',
  name: 'Basic Process',
  category: 'process',
  description: 'Linear process flow with horizontal or vertical orientation',

  parameters: [
    {
      name: 'steps',
      type: 'array',
      required: true,
      description: 'Array of step labels (minimum 2 steps)',
    },
    {
      name: 'orientation',
      type: 'string',
      required: false,
      default: 'horizontal',
      description:
        'Process orientation: "horizontal" (left-to-right) or "vertical" (top-to-bottom)',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      default: 'colorful',
      description:
        'Color theme (colorful, monochrome, vibrant, warm, cool, professional)',
    },
    {
      name: 'shape',
      type: 'string',
      required: false,
      default: 'rounded',
      description: 'Shape for each step (rounded, rect, hexagon)',
    },
    {
      name: 'useContainers',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Use containers instead of simple nodes for better styling',
    },
  ],

  minItems: 2,
  maxItems: 10,

  tags: [
    'process',
    'workflow',
    'sequential',
    'linear',
    'horizontal',
    'vertical',
  ],

  generator: (params) => {
    // Extract parameters using utilities
    const steps = extractArrayParam<string>(params, 'steps');
    const { theme, shape, useContainers, orientation } = extractCommonParams(
      params,
      {
        shape: 'rounded',
        orientation: 'horizontal',
      }
    );

    // Validation using utilities
    validateArrayParameter('basicProcess', 'steps', steps, {
      minItems: 2,
      maxItems: 10,
      itemType: 'string',
    });

    validateStringParameter('basicProcess', 'orientation', orientation, {
      allowedValues: ['horizontal', 'vertical'],
    });

    // Determine direction based on orientation
    const direction = (orientation === 'vertical' ? 'TB' : 'LR') as Direction;

    // Generate using simple nodes (default - works better with ELK)
    if (!useContainers) {
      return generateLinearProcess(steps, {
        shape: 'processBox',
        theme,
        direction,
        idPrefix: 'step',
      });
    }

    // Generate using containers with styling (opt-in)
    return generateWithContainers(steps, direction, theme);
  },
};

/**
 * Generate diagram using containers with template styling
 * This creates SmartArt-style visual appearance
 */
function generateWithContainers(
  steps: string[],
  direction: Direction,
  theme?: string
): DiagramAst {
  // Define a container template for process steps with SmartArt-inspired styling
  const templates: ContainerTemplate[] = [
    {
      id: 'process-step',
      label: 'Process Step',
      containerStyle: {
        fillColor: '#4472C4', // Office blue
        strokeColor: '#2E5AAC',
        strokeWidth: 0,
        padding: 20,
        shadow: true,
        borderStyle: 'solid' as LineStyle,
      },
    },
  ];

  // Generate containers using the template
  const containers: ContainerDeclaration[] = steps.map((label, i) => ({
    type: 'container' as const,
    id: `step${i + 1}`,
    label,
    children: [], // Empty - just styled containers
    containerStyle: {
      templateId: 'process-step', // ✅ Reuse container template!
    },
  }));

  // Connect containers with edges
  const edges: EdgeAst[] = [];
  for (let i = 0; i < steps.length - 1; i++) {
    edges.push({
      from: `step${i + 1}`,
      to: `step${i + 2}`,
    });
  }

  return {
    astVersion: '1.0',
    direction,
    theme,
    nodes: [],
    edges,
    containers,
    templates, // Include container templates
  };
}
