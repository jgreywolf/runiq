import type { GlyphSetDefinition } from '../types.js';
import { GlyphSetError } from '../types.js';
import { getThemeColor } from '../themes.js';

/**
 * Table Hierarchy Glyphset - Tabular rows
 * Shows hierarchical data in table format with connections
 */
export const tableHierarchyGlyphSet: GlyphSetDefinition = {
  id: 'tableHierarchy',
  name: 'Table Hierarchy',
  category: 'hierarchy',
  description:
    'Hierarchical data presented in tabular rows with fan-out connections between levels',
  parameters: [
    {
      name: 'theme',
      type: 'string',
      required: false,
      default: 'blue',
      description: 'Color theme (blue, green, red, purple, orange)',
    },
    {
      name: 'showConnections',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show connections between levels',
    },
  ],
  minItems: 3,
  maxItems: 15,
  generator: (params) => {
    const levels = (params.levels as string[]) || [];
    const theme = (params.theme as string) || 'professional';
    const showConnections = (params.showConnections as boolean) !== false;

    if (levels.length < 3) {
      throw new GlyphSetError(
        'tableHierarchy',
        `Table hierarchy requires at least 3 levels, got ${levels.length}`
      );
    }

    // Parse levels - format can be "Label" or "Label:Category"
    // The relationship field (after colon) is the category/group
    const levelData = levels.map((level) => {
      const parts = level.split(':');
      return {
        label: parts[0].trim(),
        category: parts.length > 1 ? parts[1].trim() : '',
      };
    });

    // Group into hierarchical structure
    // Items with same category go in same level
    const groupedLevels: Array<{ label: string; items: string[] }> = [];

    levelData.forEach((item) => {
      if (item.category) {
        // Find or create level with this category
        let levelGroup = groupedLevels.find((l) => l.label === item.category);
        if (!levelGroup) {
          levelGroup = { label: item.category, items: [] };
          groupedLevels.push(levelGroup);
        }
        levelGroup.items.push(item.label);
      } else {
        // Standalone item - create its own level
        groupedLevels.push({
          label: item.label,
          items: [item.label],
        });
      }
    });

    const colors = [0, 1, 2, 3].map((idx) =>
      getThemeColor(theme as Parameters<typeof getThemeColor>[0], idx)
    );

    return {
      astVersion: '1.0',
      nodes: [
        {
          id: 'tableHierarchy',
          shape: 'tableHierarchy',
          label: '',
          data: {
            levels: groupedLevels,
            colors,
            showConnections,
          },
        },
      ],
      edges: [],
    };
  },
};
