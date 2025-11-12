import type { DiagramAst, NodeAst, EdgeAst, ContainerDeclaration, ContainerTemplate } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';
import { getThemeColor, type ColorTheme } from '../themes.js';

/**
 * Horizontal Process GlyphSet
 *
 * Generates a linear left-to-right process flow with steps connected sequentially.
 * Similar to PowerPoint SmartArt "Basic Process" pattern.
 *
 * @example
 * ```runiq
 * diagram "Software Development" glyphset:horizontal-process {
 *   step "Research"
 *   step "Design"
 *   step "Develop"
 *   step "Test"
 *   step "Deploy"
 * }
 * ```
 */
export const horizontalProcessGlyphSet: GlyphSetDefinition = {
  id: 'horizontalProcess',
  name: 'Horizontal Process',
  category: 'process',
  description: 'Linear process flow from left to right with sequential steps',

  parameters: [
    {
      name: 'steps',
      type: 'array',
      required: true,
      description: 'Array of step labels (minimum 2 steps)',
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

  tags: ['process', 'workflow', 'sequential', 'linear'],

  generator: (params) => {
    // Extract and validate parameters
    const steps = params.steps as string[] | undefined;
    const theme = (params.theme as ColorTheme | undefined) || 'colorful';
    const shape = (params.shape as string | undefined) || 'rect';
    const useContainers = (params.useContainers as boolean | undefined) ?? false; // Default to false - simple nodes work better

    // Validation
    if (!steps || !Array.isArray(steps)) {
      throw new GlyphSetError(
        'horizontal-process',
        'steps',
        'Parameter "steps" must be an array of strings'
      );
    }

    if (steps.length < 2) {
      throw new GlyphSetError(
        'horizontal-process',
        'steps',
        'Horizontal process requires at least 2 steps'
      );
    }

    if (steps.length > 10) {
      throw new GlyphSetError(
        'horizontal-process',
        'steps',
        'Horizontal process supports maximum 10 steps (for readability)'
      );
    }

    // Generate using simple nodes (default - works better with ELK)
    if (!useContainers) {
      return generateWithNodes(steps, shape, theme);
    }

    // Generate using containers with styling (opt-in)
    return generateWithContainers(steps);
  },
};

/**
 * Generate diagram using simple nodes
 */
function generateWithNodes(steps: string[], shape: string, theme: ColorTheme): DiagramAst {
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
    direction: 'LR', // Left-to-right
    nodes,
    edges,
  };
}

/**
 * Generate diagram using containers with template styling
 * This creates SmartArt-style visual appearance
 */
function generateWithContainers(steps: string[]): DiagramAst {
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
    direction: 'LR', // Left-to-right
    nodes: [],
    edges,
    containers,
    templates, // Include container templates
  };
}
