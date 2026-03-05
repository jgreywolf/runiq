import type { DiagramAst, Direction, NodeAst } from '@runiq/core';
import { type ColorTheme } from '../themes.js';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';
import { validateImageItem, type ImageItem } from '../utils/image.js';

type FrameStyle = 'classic' | 'modern' | 'ornate' | 'minimal';

/**
 * Framed Picture GlyphSet
 *
 * Generates images with decorative frames in a gallery-style layout.
 * Similar to PowerPoint SmartArt "Picture with Caption" with frame styles.
 *
 * Perfect for photo galleries, portfolios, or showcasing artwork.
 *
 * @example
 * ```runiq
 * glyphset framedPicture "Gallery" {
 *   theme "professional"
 *   frameStyle "classic"
 *
 *   image "art1.jpg" label "Renaissance"
 *   image "art2.jpg" label "Modern Art"
 *   image "art3.jpg" label "Abstract"
 * }
 * ```
 */
export const framedPictureGlyphSet: GlyphSetDefinition = {
  id: 'framedPicture',
  name: 'Framed Picture',
  category: 'list',
  description: 'Images with decorative frames in gallery-style layout',

  parameters: [
    {
      name: 'images',
      type: 'array',
      required: true,
      description: 'Array of image URLs or ImageItem objects (minimum 2)',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      description: 'Color theme (professional, colorful, vibrant, etc.)',
    },
    {
      name: 'frameStyle',
      type: 'string',
      required: false,
      description:
        'Frame style: classic, modern, ornate, minimal (default: classic)',
    },
  ],

  minItems: 2,
  maxItems: 6,

  tags: ['list', 'picture', 'image', 'gallery', 'frame', 'showcase'],

  generator: (params) => {
    const images = params.images as string[] | ImageItem[] | undefined;
    const theme = (params.theme as ColorTheme | undefined) || 'professional';
    const frameStyle =
      (params.frameStyle as FrameStyle | undefined) || 'classic';

    // Validation
    if (!images || !Array.isArray(images)) {
      throw new GlyphSetError(
        'framedPicture',
        'images',
        'Parameter "images" must be an array of image URLs or ImageItem objects'
      );
    }

    if (images.length < 2) {
      throw new GlyphSetError(
        'framedPicture',
        'images',
        'Framed picture requires at least 2 images'
      );
    }

    if (images.length > 6) {
      throw new GlyphSetError(
        'framedPicture',
        'images',
        'Framed picture supports maximum 6 images (for readability)'
      );
    }

    const validFrameStyles: FrameStyle[] = [
      'classic',
      'modern',
      'ornate',
      'minimal',
    ];
    if (!validFrameStyles.includes(frameStyle)) {
      throw new GlyphSetError(
        'framedPicture',
        'frameStyle',
        `Frame style must be one of: ${validFrameStyles.join(', ')}`
      );
    }

    // Normalize images to ImageItem format
    const imageItems: ImageItem[] = images.map((item, index) => {
      if (typeof item === 'string') {
        return {
          image: item,
          label: `Image ${index + 1}`,
        };
      } else if (validateImageItem(item)) {
        return item;
      } else {
        throw new GlyphSetError(
          'framedPicture',
          'images',
          `Invalid image item at index ${index}`
        );
      }
    });

    // Create a single custom node
    const nodes: NodeAst[] = [
      {
        id: 'framedPicture',
        shape: 'framedPicture',
        label: 'Framed Picture',
        data: {
          items: imageItems,
          theme,
          frameStyle,
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
