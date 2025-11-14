import type { DiagramAst, NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';
import { getThemeColor, type ColorTheme } from '../themes.js';
import {
  type ImageItem,
  validateImageItem,
  getImageUrl,
  renderImage,
  renderCircularClipPath,
} from '../utils/image.js';

/**
 * Picture List GlyphSet
 *
 * Generates a list of items with circular images and labels.
 * Similar to PowerPoint SmartArt "Picture Accent List" pattern.
 *
 * Images are displayed as circular thumbnails with text labels.
 * Perfect for team members, products, or any content with visual representation.
 *
 * @example
 * ```runiq
 * glyphset pictureList "Team Members" {
 *   theme "professional"
 *   orientation "horizontal"
 *
 *   image "https://example.com/alice.jpg"
 *   image "https://example.com/bob.jpg"
 *   image "https://example.com/carol.jpg"
 * }
 * ```
 */
export const pictureListGlyphSet: GlyphSetDefinition = {
  id: 'pictureList',
  name: 'Picture List',
  category: 'list',
  description: 'List of items with circular images and labels',

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
      description:
        'Color theme (professional, forest, sunset, ocean, monochrome, colorful, vibrant, warm, cool)',
    },
    {
      name: 'orientation',
      type: 'string',
      required: false,
      description: 'Layout orientation: "horizontal" (default) or "vertical"',
    },
  ],

  minItems: 2,
  maxItems: 8,

  tags: ['list', 'picture', 'image', 'profile', 'team', 'gallery'],

  generator: (params) => {
    const images = params.images as string[] | ImageItem[] | undefined;
    const theme = (params.theme as ColorTheme | undefined) || 'professional';
    const orientation =
      (params.orientation as string | undefined) || 'horizontal';

    // Validation
    if (!images || !Array.isArray(images)) {
      throw new GlyphSetError(
        'pictureList',
        'images',
        'Parameter "images" must be an array of image URLs or ImageItem objects'
      );
    }

    if (images.length < 2) {
      throw new GlyphSetError(
        'pictureList',
        'images',
        'Picture list requires at least 2 images'
      );
    }

    if (images.length > 8) {
      throw new GlyphSetError(
        'pictureList',
        'images',
        'Picture list supports maximum 8 images (for readability)'
      );
    }

    // Normalize images to ImageItem format
    const imageItems: ImageItem[] = images.map((item, index) => {
      if (typeof item === 'string') {
        // Simple string URL - create ImageItem with default label
        return {
          image: item,
          label: `Item ${index + 1}`,
        };
      } else if (validateImageItem(item)) {
        // Already an ImageItem
        return item as ImageItem;
      } else {
        throw new GlyphSetError(
          'pictureList',
          'images',
          `Invalid image item at index ${index}`
        );
      }
    });

    // Create a single custom node that will render the entire picture list
    const direction = orientation === 'vertical' ? 'TB' : 'LR';

    const nodes: NodeAst[] = [
      {
        id: 'pictureList',
        shape: 'pictureList',
        label: 'Picture List',
        data: {
          items: imageItems,
          theme,
          orientation,
        },
      },
    ];

    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes,
      edges: [],
      direction,
    };

    return diagram;
  },
};
