import type { DiagramAst, Direction, NodeAst } from '@runiq/core';
import { type ColorTheme } from '../themes.js';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';
import { validateImageItem, type ImageItem } from '../utils/image.js';

/**
 * Picture Process GlyphSet
 *
 * Generates a sequential process flow with images for each step.
 * Similar to PowerPoint SmartArt "Picture Process" patterns.
 *
 * Perfect for workflows, tutorials, recipes, or step-by-step instructions.
 *
 * @example
 * ```runiq
 * glyphset pictureProcess "Recipe Steps" {
 *   theme "professional"
 *   direction "horizontal"
 *
 *   image "step1.jpg" label "Prep Ingredients"
 *   image "step2.jpg" label "Mix & Combine"
 *   image "step3.jpg" label "Bake"
 *   image "step4.jpg" label "Serve"
 * }
 * ```
 */
export const pictureProcessGlyphSet: GlyphSetDefinition = {
  id: 'pictureProcess',
  name: 'Picture Process',
  category: 'process',
  description: 'Sequential process flow with images for each step',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of process steps with images (minimum 2 steps)',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      description: 'Color theme (professional, colorful, vibrant, etc.)',
    },
    {
      name: 'direction',
      type: 'string',
      required: false,
      description:
        'Flow direction: horizontal or vertical (default: horizontal)',
    },
  ],

  minItems: 2,
  maxItems: 8,

  tags: ['process', 'workflow', 'steps', 'picture', 'image', 'sequential'],

  generator: (params) => {
    const items = params.items as string[] | ImageItem[] | undefined;
    const theme = (params.theme as ColorTheme | undefined) || 'professional';
    const direction = (params.direction as string | undefined) || 'horizontal';

    // Validation
    if (!items || !Array.isArray(items)) {
      throw new GlyphSetError(
        'pictureProcess',
        'items',
        'Parameter "items" must be an array of image URLs or ImageItem objects'
      );
    }

    if (items.length < 2) {
      throw new GlyphSetError(
        'pictureProcess',
        'items',
        'Picture process requires at least 2 steps'
      );
    }

    if (items.length > 8) {
      throw new GlyphSetError(
        'pictureProcess',
        'items',
        'Picture process supports maximum 8 steps (for readability)'
      );
    }

    if (direction !== 'horizontal' && direction !== 'vertical') {
      throw new GlyphSetError(
        'pictureProcess',
        'direction',
        'Direction must be "horizontal" or "vertical"'
      );
    }

    // Normalize items to ImageItem format
    const imageItems: ImageItem[] = items.map((item, index) => {
      if (typeof item === 'string') {
        return {
          image: item,
          label: `item ${index + 1}`,
        };
      } else if (validateImageItem(item)) {
        return item;
      } else {
        throw new GlyphSetError(
          'pictureProcess',
          'items',
          `Invalid image item at index ${index}`
        );
      }
    });

    // Create a single custom node that will render the entire process
    const nodes: NodeAst[] = [
      {
        id: 'pictureProcess',
        shape: 'pictureProcess',
        label: 'Picture Process',
        data: {
          items: imageItems,
          theme,
          direction,
        },
      },
    ];

    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes,
      edges: [],
      direction: 'TB' as Direction,
    };

    return diagram;
  },
};
