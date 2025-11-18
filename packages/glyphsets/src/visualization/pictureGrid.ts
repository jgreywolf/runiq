import type { DiagramAst, NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';
import { getThemeColor, type ColorTheme } from '../themes.js';
import { type ImageItem, validateImageItem } from '../utils/image.js';

/**
 * Picture Grid GlyphSet
 *
 * Generates a grid of images with captions in equal-sized cells.
 * Similar to PowerPoint SmartArt "Picture Grid" pattern.
 *
 * Perfect for photo galleries, product showcases, or any grid-based content.
 *
 * @example
 * ```runiq
 * glyphset pictureGrid "Product Gallery" {
 *   theme "colorful"
 *   columns 3
 *
 *   image "https://example.com/product1.jpg"
 *   image "https://example.com/product2.jpg"
 *   image "https://example.com/product3.jpg"
 *   image "https://example.com/product4.jpg"
 * }
 * ```
 */
export const pictureGridGlyphSet: GlyphSetDefinition = {
  id: 'pictureGrid',
  name: 'Picture Grid',
  category: 'visualization',
  description: 'Grid of images with captions in equal-sized cells',

  parameters: [
    {
      name: 'images',
      type: 'array',
      required: true,
      description: 'Array of image URLs (minimum 2 images)',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      description: 'Color theme (professional, colorful, vibrant, etc.)',
    },
    {
      name: 'columns',
      type: 'number',
      required: false,
      description: 'Number of columns in the grid (default: 3)',
    },
  ],

  minItems: 2,
  maxItems: 12,

  tags: ['grid', 'picture', 'image', 'gallery', 'showcase', 'visualization'],

  generator: (params) => {
    const images = params.images as string[] | ImageItem[] | undefined;
    const theme = (params.theme as ColorTheme | undefined) || 'professional';
    const columns = params.columns as number | undefined;

    // Validation
    if (!images || !Array.isArray(images)) {
      throw new GlyphSetError(
        'pictureGrid',
        'images',
        'Parameter "images" must be an array of image URLs or ImageItem objects'
      );
    }

    if (images.length < 2) {
      throw new GlyphSetError(
        'pictureGrid',
        'images',
        'Picture grid requires at least 2 images'
      );
    }

    if (images.length > 12) {
      throw new GlyphSetError(
        'pictureGrid',
        'images',
        'Picture grid supports maximum 12 images (for readability)'
      );
    }

    if (columns !== undefined && (columns < 1 || columns > 6)) {
      throw new GlyphSetError(
        'pictureGrid',
        'columns',
        'Columns must be between 1 and 6'
      );
    }

    // Default columns after validation
    const finalColumns = columns || 3;

    // Normalize images to ImageItem format
    const imageItems: ImageItem[] = images.map((item, index) => {
      if (typeof item === 'string') {
        return {
          image: item,
          label: `Item ${index + 1}`,
        };
      } else if (validateImageItem(item)) {
        return item;
      } else {
        throw new GlyphSetError(
          'pictureGrid',
          'images',
          `Invalid image item at index ${index}`
        );
      }
    });

    // Create a single custom node that will render the entire grid
    const nodes: NodeAst[] = [
      {
        id: 'pictureGrid',
        shape: 'pictureGrid',
        label: 'Picture Grid',
        data: {
          items: imageItems,
          theme,
          columns: finalColumns,
        },
      },
    ];

    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes,
      edges: [],
      direction: 'TB',
    };

    return diagram;
  },
};
