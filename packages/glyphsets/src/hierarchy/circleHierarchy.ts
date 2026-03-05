import type { GlyphSetDefinition } from '../types.js';
import { GlyphSetError } from '../types.js';
import { getThemeColor } from '../themes.js';

/**
 * Circle Hierarchy Glyphset - Concentric circles
 * Shows hierarchical levels as nested circles
 */
export const circleHierarchyGlyphSet: GlyphSetDefinition = {
  id: 'circleHierarchy',
  name: 'Circle Hierarchy',
  category: 'hierarchy',
  description:
    'Hierarchical levels shown as concentric circles with nodes distributed in rings',
  parameters: [
    {
      name: 'theme',
      type: 'string',
      required: false,
      default: 'blue',
      description: 'Color theme (blue, green, red, purple, orange)',
    },
  ],
  minItems: 3,
  maxItems: 15,
  generator: (params) => {
    const roots = (params.roots as string[]) || [];
    const children = (params.children as string[]) || [];
    const theme = (params.theme as string) || 'professional';

    if (roots.length === 0 || children.length < 2) {
      throw new GlyphSetError(
        'circleHierarchy',
        `Circle hierarchy requires 1 root and at least 2 children, got ${roots.length} root(s) and ${children.length} child(ren)`
      );
    }

    // First root is the center
    const root = roots[0];

    // Group children into levels (simple: every 3-4 items per level)
    const levels: Array<{ label: string; items: string[] }> = [];

    let currentLevel = 0;
    let itemsPerLevel = 3;
    let idx = 0;

    while (idx < children.length) {
      const levelItems = children.slice(idx, idx + itemsPerLevel);
      levels.push({
        label: `Level ${currentLevel + 1}`,
        items: levelItems,
      });
      idx += itemsPerLevel;
      currentLevel++;
      itemsPerLevel = Math.min(itemsPerLevel + 1, 4); // Increase items per level
    }

    const colors = [0, 1, 2, 3, 4].map((idx) =>
      getThemeColor(theme as Parameters<typeof getThemeColor>[0], idx)
    );

    return {
      astVersion: '1.0',
      nodes: [
        {
          id: 'circleHierarchy',
          shape: 'circleHierarchy',
          label: '',
          data: {
            root,
            levels,
            colors,
          },
        },
      ],
      edges: [],
    };
  },
};
