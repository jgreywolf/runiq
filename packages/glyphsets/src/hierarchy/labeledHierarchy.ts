import type { GlyphSetDefinition } from '../types.js';
import { GlyphSetError } from '../types.js';
import { getThemeColor } from '../themes.js';

/**
 * Labeled Hierarchy Glyphset - Tree with edge labels
 * Shows hierarchical relationships with labeled connections
 */
export const labeledHierarchyGlyphSet: GlyphSetDefinition = {
  id: 'labeledHierarchy',
  name: 'Labeled Hierarchy',
  category: 'hierarchy',
  description:
    'Tree hierarchy with labeled edges showing the nature of relationships between nodes',
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
  maxItems: 20,
  generator: (params) => {
    const roots = (params.roots as any[]) || [];
    const children = (params.children as any[]) || [];
    const theme = (params.theme as string) || 'professional';

    if (roots.length === 0) {
      throw new GlyphSetError(
        'labeledHierarchy',
        `Labeled hierarchy requires at least 1 root, got ${roots.length}`
      );
    }

    // Helper to parse node (can be string or object with children)
    const parseNode = (node: any): any => {
      if (typeof node === 'string') {
        const parts = node.split(':');
        return {
          label: parts[0],
          relationship: parts[1] || '',
          children: [],
        };
      } else {
        // Already an object with label, relationship, and children
        return {
          label: node.label,
          relationship: node.relationship || '',
          children: (node.children || []).map(parseNode),
        };
      }
    };

    const rootNode = parseNode(roots[0]);

    // Add any flat children to the root
    const flatChildren = children.map(parseNode);
    rootNode.children = [...rootNode.children, ...flatChildren];

    // Count total nodes for color array
    const countNodes = (node: any): number => {
      return (
        1 +
        (node.children || []).reduce(
          (sum: number, child: any) => sum + countNodes(child),
          0
        )
      );
    };

    const totalNodes = countNodes(rootNode);
    const colors = Array.from({ length: totalNodes }, (_, idx) =>
      getThemeColor(theme as Parameters<typeof getThemeColor>[0], idx)
    );

    return {
      astVersion: '1.0',
      nodes: [
        {
          id: 'labeledHierarchy',
          shape: 'labeledHierarchy',
          label: '',
          data: {
            root: rootNode,
            colors,
          },
        },
      ],
      edges: [],
    };
  },
};
