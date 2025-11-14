import type { DiagramAst, NodeAst, EdgeAst, ContainerDeclaration, ContainerTemplate } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';
import { getThemeColor, type ColorTheme } from '../themes.js';

/**
 * Basic Process GlyphSet
 *
 * Generates a linear process flow with steps connected sequentially.
 * Supports both horizontal (left-to-right) and vertical (top-to-bottom) orientations.
 * Similar to PowerPoint SmartArt "Basic Process" and "Vertical Process" patterns.
 *
 * @example
 * ```runiq
 * diagram "Software Development" glyphset:basicProcess {
 *   orientation "horizontal"
 *   theme "colorful"
 *   step "Research"
 *   step "Design"
 *   step "Develop"
 *   step "Test"
 *   step "Deploy"
 * }
 * ```
 *
 * @example
 * ```runiq
 * diagram "Project Phases" glyphset:basicProcess {
 *   orientation "vertical"
 *   step "Initiation"
 *   step "Planning"
 *   step "Execution"
 *   step "Monitoring"
 *   step "Closure"
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
      description: 'Process orientation: "horizontal" (left-to-right) or "vertical" (top-to-bottom)',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      default: 'colorful',
      description: 'Color theme (colorful, monochrome, vibrant, warm, cool, professional)',
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

  tags: ['process', 'workflow', 'sequential', 'linear', 'horizontal', 'vertical'],

  generator: (params) => {
    // Extract and validate parameters
    const steps = params.steps as string[] | undefined;
    const orientation = (params.orientation as string | undefined) || 'horizontal';
    const theme = (params.theme as ColorTheme | undefined) || 'colorful';
    const shape = (params.shape as string | undefined) || 'rounded';
    const useContainers = (params.useContainers as boolean | undefined) ?? false;

    // Validation
    if (!steps || !Array.isArray(steps)) {
      throw new GlyphSetError(
        'basicProcess',
        'steps',
        'Parameter "steps" must be an array of strings'
      );
    }

    if (steps.length < 2) {
      throw new GlyphSetError(
        'basicProcess',
        'steps',
        'Basic process requires at least 2 steps'
      );
    }

    if (steps.length > 10) {
      throw new GlyphSetError(
        'basicProcess',
        'steps',
        'Basic process supports maximum 10 steps (for readability)'
      );
    }

    if (orientation !== 'horizontal' && orientation !== 'vertical') {
      throw new GlyphSetError(
        'basicProcess',
        'orientation',
        'Parameter "orientation" must be "horizontal" or "vertical"'
      );
    }

    // Determine direction based on orientation
    const direction = orientation === 'vertical' ? 'TB' : 'LR';

    // Generate using simple nodes (default - works better with ELK)
    if (!useContainers) {
      return generateWithNodes(steps, shape, theme, direction);
    }

    // Generate using containers with styling (opt-in)
    return generateWithContainers(steps, direction);
  },
};

/**
 * Generate diagram using simple nodes
 */
function generateWithNodes(
  steps: string[],
  shape: string,
  theme: ColorTheme,
  direction: 'TB' | 'LR'
): DiagramAst {
  // Generate nodes with SmartArt-style processBox shape and themed colors
  const nodes: NodeAst[] = steps.map((label, i) => ({
    id: `step${i + 1}`,
    shape: 'processBox', // Use SmartArt-style processBox!
    label,
    data: {
      color: getThemeColor(theme, i), // Apply theme color
    },
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
    direction,
    nodes,
    edges,
  };
}

/**
 * Generate diagram using containers with template styling
 * This creates SmartArt-style visual appearance
 */
function generateWithContainers(steps: string[], direction: 'TB' | 'LR'): DiagramAst {
  // Define a container template for process steps with SmartArt-inspired styling
  const templates: ContainerTemplate[] = [
    {
      id: 'process-step',
      label: 'Process Step',
      containerStyle: {
        backgroundColor: '#4472C4', // Office blue
        borderColor: '#2E5AAC',
        borderWidth: 0,
        padding: 20,
        shadow: true,
        borderStyle: 'solid',
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
    nodes: [],
    edges,
    containers,
    templates, // Include container templates
  };
}
