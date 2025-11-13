import type { NodeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';

/**
 * Nested List GlyphSet
 *
 * Generates a hierarchical list with indented sub-items.
 * Similar to PowerPoint SmartArt "Hierarchy List" or indented bullet lists.
 * Supports nested level/item syntax for hierarchical structure.
 *
 * @example
 * ```runiq
 * glyphset nestedList "Features" {
 *   level "Core Features" {
 *     item "Fast performance"
 *     item "Easy to use"
 *   }
 *   level "Advanced Features" {
 *     item "Plugin system"
 *     item "Custom themes"
 *   }
 * }
 * ```
 */
export const nestedListGlyphSet: GlyphSetDefinition = {
  id: 'nestedList',
  name: 'Nested List',
  category: 'list',
  description: 'Hierarchical list with indented sub-items',

  parameters: [
    {
      name: 'levels',
      type: 'array',
      required: true,
      description: 'Array of level objects with label and optional items array',
    },
  ],

  minItems: 2,
  maxItems: 10,

  tags: ['list', 'nested', 'hierarchical', 'indented', 'sub-items', 'tree'],

  generator: (params) => {
    const levels = params.levels as
      | Array<{ label: string; items?: string[] }>
      | undefined;

    // Validation
    if (!levels || !Array.isArray(levels)) {
      throw new GlyphSetError(
        'nestedList',
        'levels',
        'Parameter "levels" must be an array of level objects'
      );
    }

    if (levels.length < 2) {
      throw new GlyphSetError(
        'nestedList',
        'levels',
        'Nested list requires at least 2 levels'
      );
    }

    const totalItems = levels.reduce(
      (sum, level) => sum + 1 + (level.items?.length || 0),
      0
    );
    if (totalItems > 20) {
      throw new GlyphSetError(
        'nestedList',
        'levels',
        'Nested list supports maximum 20 total items (for readability)'
      );
    }

    // Build flat array of items with indent information
    interface NestedItem {
      label: string;
      indent: number;
      isLevel: boolean;
    }

    const items: NestedItem[] = [];

    for (const level of levels) {
      // Add parent level
      items.push({
        label: level.label,
        indent: 0,
        isLevel: true,
      });

      // Add child items (indented)
      if (level.items && level.items.length > 0) {
        for (const item of level.items) {
          items.push({
            label: item,
            indent: 1,
            isLevel: false,
          });
        }
      }
    }

    // Generate a single node with the nestedList shape
    const nodes: NodeAst[] = [
      {
        id: 'nestedList',
        shape: 'nestedList',
        label: '',
        data: { items },
      },
    ];

    return {
      astVersion: '1.0',
      direction: 'TB',
      nodes,
      edges: [],
    };
  },
};
