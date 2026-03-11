import type { Direction, NodeAst } from '@runiq/core';
import type { GlyphSetDefinition } from '../types.js';
import { validateArrayParameter } from '../utils/validation.js';
import { extractStringParam } from '../utils/parameters.js';
import { getThemeColor, type ColorTheme } from '../themes.js';

/**
 * Step Process GlyphSet
 *
 * Generates a process with steps arranged diagonally like stairs,
 * showing upward or downward progression. Visual metaphor for climbing
 * steps toward a goal or descending through stages.
 * Similar to PowerPoint SmartArt "Step Up Process" or "Step Down Process".
 *
 * @example
 * ```runiq
 * glyphset stepProcess "Career Growth" {
 *   item "Junior"
 *   item "Mid-Level"
 *   item "Senior"
 *   item "Lead"
 *   item "Principal"
 *
 *   direction "up"
 * }
 * ```
 */
export const stepProcessGlyphSet: GlyphSetDefinition = {
  id: 'stepProcess',
  name: 'Step Process',
  category: 'process',
  description:
    'Process steps arranged diagonally in a staircase pattern, showing progression',

  parameters: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of process steps (minimum 3 steps)',
    },
    {
      name: 'direction',
      type: 'string',
      required: false,
      description: 'Step direction: up (default) or down',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      description:
        'Color theme (professional, forest, sunset, ocean, monochrome)',
    },
  ],

  minItems: 3,
  maxItems: 8,

  tags: ['process', 'steps', 'stairs', 'progression', 'growth', 'stages'],

  generator: (params) => {
    const items = params.items as string[] | undefined;
    const direction = extractStringParam(params, 'direction', 'up');
    const theme = extractStringParam(params, 'theme');

    // Validation - validateArrayParameter checks both required and array constraints
    validateArrayParameter('stepProcess', 'items', items, {
      minItems: 3,
      maxItems: 8,
      itemType: 'string',
    });

    // Generate explicit staircase nodes so each step is individually interactive
    // in the visual editor (selection, drag/reorder, inline label editing).
    const stepWidth = 140;
    const stepHeight = 60;
    const horizontalOffset = 100;
    const verticalOffset = 70;
    const themeName = (theme || 'professional') as ColorTheme | string;

    const nodes: NodeAst[] = items.map((item, index) => {
      const x = index * horizontalOffset;
      const y =
        direction === 'up'
          ? (items.length - 1 - index) * verticalOffset
          : index * verticalOffset;
      return {
        id: `step${index + 1}`,
        shape: 'processBox',
        label: item,
        position: { x, y },
        data: {
          fillColor: getThemeColor(themeName, index),
          width: stepWidth,
          height: stepHeight,
          theme: themeName,
        },
      };
    });

    const edges = items.slice(0, -1).map((_, index) => ({
      from: `step${index + 1}`,
      to: `step${index + 2}`,
    }));

    return {
      astVersion: '1.0',
      direction: 'LR' as Direction,
      nodes,
      edges,
    };
  },
};
