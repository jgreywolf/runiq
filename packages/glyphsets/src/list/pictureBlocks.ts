import type { DiagramAst, Direction, NodeAst } from '@runiq/core';
import { type ColorTheme } from '../themes.js';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';
import { validateImageItem, type ImageItem } from '../utils/image.js';

/**
 * Picture Blocks GlyphSet
 *
 * Generates alternating image and text blocks in a magazine-style layout.
 * Similar to PowerPoint SmartArt "Alternating Picture Blocks" pattern.
 *
 * Perfect for feature showcases, product descriptions, or storytelling layouts.
 *
 * @example
 * ```runiq
 * glyphset pictureBlocks "Product Features" {
 *   theme "professional"
 *   alternating true
 *
 *   image "feature1.jpg" label "Smart Design" description "Ergonomic and intuitive"
 *   image "feature2.jpg" label "Performance" description "Fast and efficient"
 *   image "feature3.jpg" label "Durability" description "Built to last"
 * }
 * ```
 */
export const pictureBlocksGlyphSet: GlyphSetDefinition = {
  id: 'pictureBlocks',
  name: 'Picture Blocks',
  category: 'list',
  description: 'Alternating image and text blocks in magazine-style layout',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description:
        'Array of items with image, label, and description (minimum 2)',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      description: 'Color theme (professional, colorful, vibrant, etc.)',
    },
    {
      name: 'alternating',
      type: 'boolean',
      required: false,
      description: 'Alternate image position left/right (default: true)',
    },
  ],

  minItems: 2,
  maxItems: 6,

  tags: ['list', 'picture', 'image', 'blocks', 'alternating', 'magazine'],

  generator: (params) => {
    const items = params.items as string[] | ImageItem[] | undefined;
    const theme = (params.theme as ColorTheme | undefined) || 'professional';
    const alternating = (params.alternating as boolean | undefined) ?? true;

    // Validation
    if (!items || !Array.isArray(items)) {
      throw new GlyphSetError(
        'pictureBlocks',
        'items',
        'Parameter "items" must be an array of image URLs or ImageItem objects'
      );
    }

    if (items.length < 2) {
      throw new GlyphSetError(
        'pictureBlocks',
        'items',
        'Picture blocks requires at least 2 items'
      );
    }

    if (items.length > 6) {
      throw new GlyphSetError(
        'pictureBlocks',
        'items',
        'Picture blocks supports maximum 6 items (for readability)'
      );
    }

    // Normalize items to ImageItem format
    const imageItems: ImageItem[] = items.map((item, index) => {
      if (typeof item === 'string') {
        return {
          image: item,
          label: `Feature ${index + 1}`,
          description: '',
        };
      } else if (validateImageItem(item)) {
        return item;
      } else {
        throw new GlyphSetError(
          'pictureBlocks',
          'items',
          `Invalid image item at index ${index}`
        );
      }
    });

    // Create a single custom node
    const nodes: NodeAst[] = [
      {
        id: 'pictureBlocks',
        shape: 'pictureBlocks',
        label: 'Picture Blocks',
        data: {
          items: imageItems,
          theme,
          alternating,
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
