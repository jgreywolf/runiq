import type { Direction } from '@runiq/core';
import { type ColorTheme } from '../themes.js';
import { type GlyphSetDefinition } from '../types.js';
import { generateLinearProcess } from '../utils/generators.js';
import { extractStringParam } from '../utils/parameters.js';
import { validateArrayParameter } from '../utils/validation.js';

/**
 * Basic List GlyphSet
 *
 * Generates a vertical list of items with styled boxes.
 * Similar to PowerPoint SmartArt "Basic Block List" pattern.
 *
 * @example
 * ```runiq
 * glyphset basicList "Key Features" {
 *   item "Fast performance"
 *   item "Easy to use"
 *   item "Highly scalable"
 *   item "Open source"
 * }
 * ```
 */
export const basicListGlyphSet: GlyphSetDefinition = {
  id: 'basicList',
  name: 'Basic List',
  category: 'list',
  description: 'Vertical list of items with styled boxes',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of list items (minimum 2 items)',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      description:
        'Color theme (professional, forest, sunset, ocean, monochrome)',
    },
  ],

  minItems: 2,
  maxItems: 10,

  tags: ['list', 'bullet', 'items', 'features'],

  generator: (params) => {
    const items = params.items as string[] | undefined;
    const theme = extractStringParam(
      params,
      'theme',
      'professional'
    ) as ColorTheme;

    // Validation - validateArrayParameter checks both required and array constraints
    validateArrayParameter('basicList', 'items', items, {
      minItems: 2,
      maxItems: 10,
      itemType: 'string',
    });

    // Generate using linear process utility (no edges for list)
    const result = generateLinearProcess(items, {
      shape: 'processBox',
      theme,
      direction: 'TB' as Direction, // Top-to-bottom for list
      idPrefix: 'item',
    });

    // Remove edges - lists don't have connections
    result.edges = [];

    return result;
  },
};
