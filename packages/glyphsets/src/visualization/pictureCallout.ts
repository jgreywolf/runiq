import type { DiagramAst, NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';
import { type ColorTheme } from '../themes.js';
import { type ImageItem, validateImageItem } from '../utils/image.js';

interface CalloutItem {
  label: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

/**
 * Picture Callout GlyphSet
 *
 * Generates a central image with callout annotations around it.
 * Similar to PowerPoint SmartArt "Picture Caption" patterns.
 *
 * Perfect for product features, photo annotations, or highlighting details.
 *
 * @example
 * ```runiq
 * glyphset pictureCallout "Product Features" {
 *   theme "professional"
 *   image "product.jpg"
 *
 *   callout "Premium Materials" position "top"
 *   callout "Ergonomic Design" position "right"
 *   callout "Long Battery Life" position "bottom"
 *   callout "Water Resistant" position "left"
 * }
 * ```
 */
export const pictureCalloutGlyphSet: GlyphSetDefinition = {
  id: 'pictureCallout',
  name: 'Picture Callout',
  category: 'visualization',
  description: 'Central image with callout annotations positioned around it',

  parameters: [
    {
      name: 'image',
      type: 'string',
      required: true,
      description: 'Main image URL or ImageItem object',
    },
    {
      name: 'callouts',
      type: 'array',
      required: true,
      description: 'Array of callout annotations (minimum 2)',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      description: 'Color theme (professional, colorful, vibrant, etc.)',
    },
  ],

  minItems: 2,
  maxItems: 8,

  tags: [
    'visualization',
    'picture',
    'image',
    'callout',
    'annotation',
    'features',
  ],

  generator: (params) => {
    const image = params.image as string | ImageItem | undefined;
    const callouts = params.callouts as (string | CalloutItem)[] | undefined;
    const theme = (params.theme as ColorTheme | undefined) || 'professional';

    // Validation
    if (!image) {
      throw new GlyphSetError(
        'pictureCallout',
        'image',
        'Parameter "image" is required'
      );
    }

    if (!callouts || !Array.isArray(callouts)) {
      throw new GlyphSetError(
        'pictureCallout',
        'callouts',
        'Parameter "callouts" must be an array'
      );
    }

    if (callouts.length < 2) {
      throw new GlyphSetError(
        'pictureCallout',
        'callouts',
        'Picture callout requires at least 2 callouts'
      );
    }

    if (callouts.length > 8) {
      throw new GlyphSetError(
        'pictureCallout',
        'callouts',
        'Picture callout supports maximum 8 callouts (for readability)'
      );
    }

    // Normalize image
    let imageItem: ImageItem;
    if (typeof image === 'string') {
      imageItem = {
        image: image,
        label: 'Main Image',
      };
    } else if (validateImageItem(image)) {
      imageItem = image;
    } else {
      throw new GlyphSetError('pictureCallout', 'image', 'Invalid image item');
    }

    // Normalize callouts
    const calloutItems: CalloutItem[] = callouts.map((item, index) => {
      if (typeof item === 'string') {
        // Auto-distribute positions: top, right, bottom, left, then repeat
        const positions: Array<'top' | 'right' | 'bottom' | 'left'> = [
          'top',
          'right',
          'bottom',
          'left',
        ];
        return {
          label: item,
          position: positions[index % 4],
        };
      } else if (typeof item === 'object' && item !== null) {
        const calloutItem = item as CalloutItem;
        if (!calloutItem.label) {
          throw new GlyphSetError(
            'pictureCallout',
            'callouts',
            `Callout at index ${index} must have a label`
          );
        }
        return {
          label: calloutItem.label,
          position: calloutItem.position || 'top',
        };
      } else {
        throw new GlyphSetError(
          'pictureCallout',
          'callouts',
          `Invalid callout item at index ${index}`
        );
      }
    });

    // Create a single custom node
    const nodes: NodeAst[] = [
      {
        id: 'pictureCallout',
        shape: 'pictureCallout',
        label: 'Picture Callout',
        data: {
          image: imageItem,
          callouts: calloutItems,
          theme,
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
