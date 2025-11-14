import type { DiagramAst, NodeAst, EdgeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';
import { getThemeColor, type ColorTheme } from '../themes.js';

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
    const shape = (params.shape as string | undefined) || 'rounded';
    const showConnections =
      (params.showConnections as boolean | undefined) ?? true;
    const theme = (params.theme as ColorTheme | undefined) || 'professional';

    // Validation
    if (!events || !Array.isArray(events)) {
      throw new GlyphSetError(
        'events',
        'events',
        'Parameter "events" must be an array of strings'
      );
    }

    if (events.length < 2) {
      throw new GlyphSetError(
        'events',
        'events',
        'Events requires at least 2 events'
      );
    }

    if (events.length > 10) {
      throw new GlyphSetError(
        'events',
        'events',
        'Events supports maximum 10 events (for readability)'
      );
    }

    // Generate event nodes with SmartArt-style processBox shape
    const nodes: NodeAst[] = events.map((label, i) => ({
      id: `event${i + 1}`,
      shape: 'processBox', // Use SmartArt-style processBox!
      label,
      data: {
        color: getThemeColor(theme, i),
      },
    }));

    // Generate connections if requested
    const edges: EdgeAst[] = [];
    if (showConnections) {
      for (let i = 0; i < events.length - 1; i++) {
        edges.push({
          from: `event${i + 1}`,
          to: `event${i + 2}`,
        });
      }
    }

    return {
      astVersion: '1.0',
      direction: 'LR', // Left-to-right for timeline
      nodes,
      edges,
    };
  },
};
