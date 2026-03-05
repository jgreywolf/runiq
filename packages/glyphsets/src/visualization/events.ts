import type { Direction } from '@runiq/core';
import { type ColorTheme } from '../themes.js';
import { type GlyphSetDefinition } from '../types.js';
import { generateLinearProcess } from '../utils/generators.js';
import {
  extractBooleanParam,
  extractStringParam,
} from '../utils/parameters.js';
import { validateArrayParameter } from '../utils/validation.js';

/**
 * Events GlyphSet
 *
 * Generates a horizontal sequence of events connected in order.
 * Similar to PowerPoint SmartArt "Basic Process" pattern with events.
 * Note: For date-based timelines with periods, use the `timeline` profile instead.
 *
 * @example
 * ```runiq
 * glyphset events "Project Roadmap" {
 *   event "Q1: Planning"
 *   event "Q2: Development"
 *   event "Q3: Testing"
 *   event "Q4: Launch"
 * }
 * ```
 */
export const eventsGlyphSet: GlyphSetDefinition = {
  id: 'events',
  name: 'Events',
  category: 'visualization',
  description: 'Horizontal sequence of events connected in order',

  parameters: [
    {
      name: 'events',
      type: 'array',
      required: true,
      description: 'Array of event labels (chronological order)',
    },
    {
      name: 'shape',
      type: 'string',
      required: false,
      default: 'rounded',
      description: 'Shape for each event marker',
    },
    {
      name: 'showConnections',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show connections between events',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      default: 'professional',
      description: 'Color theme for events',
    },
  ],

  minItems: 2,
  maxItems: 10,

  tags: ['events', 'sequence', 'roadmap', 'milestones', 'steps'],

  generator: (params) => {
    const events = params.events as string[] | undefined;
    const shape = extractStringParam(params, 'shape', 'rounded');
    const showConnections = extractBooleanParam(
      params,
      'showConnections',
      true
    );
    const theme = extractStringParam(
      params,
      'theme',
      'professional'
    ) as ColorTheme;

    // Validation - validateArrayParameter checks both required and array constraints
    validateArrayParameter('events', 'events', events, {
      minItems: 2,
      maxItems: 10,
      itemType: 'string',
    });

    // Generate using linear process utility
    const result = generateLinearProcess(events, {
      shape: 'processBox', // Use SmartArt-style processBox!
      theme,
      direction: 'LR' as Direction, // Left-to-right for timeline
      idPrefix: 'event',
    });

    // Remove edges if connections not requested
    if (!showConnections) {
      result.edges = [];
    }

    return result;
  },
};
