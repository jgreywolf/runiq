import type { GlyphSetDefinition } from '../types.js';
import type { DiagramAst, Direction } from '@runiq/core';
import { GlyphSetError } from '../types.js';
import { getThemeColor, type ColorTheme } from '../themes.js';

/**
 * Horizontal Organization Chart GlyphSet
 *
 * Generates a left-to-right hierarchical tree structure.
 * Uses a custom composite shape to render the entire org chart with themed colors.
 *
 * @example
 * ```runiq
 * diagram "Engineering Team" glyphset:horizontalOrgChart {
 *   structure: {
 *     name: "CTO"
 *     reports: [
 *       { name: "Backend Team", reports: [
 *         { name: "Senior Dev" }
 *         { name: "Junior Dev" }
 *       ]}
 *       { name: "Frontend Team", reports: [
 *         { name: "UI Lead" }
 *       ]}
 *     ]
 *   }
 *   theme: "professional"
 * }
 * ```
 */
export const horizontalOrgChartGlyphSet: GlyphSetDefinition = {
  id: 'horizontalOrgChart',
  name: 'Horizontal Organization Chart',
  category: 'hierarchy',
  description:
    'Hierarchical tree structure showing reporting relationships (left-to-right)',

  parameters: [
    {
      name: 'structure',
      type: 'array',
      required: true,
      description: 'Hierarchical structure with roles and reports',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      default: 'professional',
      description: 'Color theme',
    },
    {
      name: 'nodeShape',
      type: 'string',
      required: false,
      default: 'rounded',
      description: 'Shape for each person/role (rect, rounded, hexagon)',
    },
  ],

  minItems: 2,
  maxItems: 50,

  tags: [
    'hierarchy',
    'org-chart',
    'organization',
    'horizontal',
    'left-to-right',
  ],

  generator: (params) => {
    // Handle structure as array (from DSL) or single object
    let structure: OrgNode | undefined;
    if (Array.isArray(params.structure)) {
      if (params.structure.length === 0) {
        throw new GlyphSetError(
          'horizontalOrgChart',
          'structure',
          'Horizontal org chart requires at least one root node with a name'
        );
      }
      structure = params.structure[0] as OrgNode;
    } else {
      structure = params.structure as OrgNode | undefined;
    }

    const theme = (params.theme as ColorTheme | undefined) || 'professional';
    const nodeShape = (params.nodeShape as string | undefined) || 'rounded';

    // Validation
    if (!structure || typeof structure !== 'object') {
      throw new GlyphSetError(
        'horizontalOrgChart',
        'structure',
        'Parameter "structure" must be a hierarchical org node object'
      );
    }

    if (!structure.name) {
      throw new GlyphSetError(
        'horizontalOrgChart',
        'structure',
        'Horizontal org chart requires at least one root node with a name'
      );
    }

    // Count nodes for validation
    const nodeCount = countNodes(structure);
    if (nodeCount < 2) {
      throw new GlyphSetError(
        'horizontalOrgChart',
        'structure',
        'Horizontal org chart requires at least 2 people'
      );
    }

    if (nodeCount > 50) {
      throw new GlyphSetError(
        'horizontalOrgChart',
        'structure',
        'Horizontal org chart supports maximum 50 people'
      );
    }

    // Generate theme colors
    const colors = [0, 1, 2, 3, 4, 5].map((idx) => getThemeColor(theme, idx));

    const ast: DiagramAst = {
      astVersion: '1.0',
      direction: 'LR' as Direction,
      nodes: [
        {
          id: 'horizontalOrgChart',
          shape: 'horizontalOrgChart',
          label: '',
          data: {
            hierarchy: structure,
            colors,
            nodeShape,
          },
        },
      ],
      edges: [],
    };

    return ast;
  },
};

/**
 * Count total nodes in hierarchy
 */
function countNodes(node: OrgNode): number {
  let count = 1;
  if (node.reports && Array.isArray(node.reports)) {
    for (const report of node.reports) {
      count += countNodes(report);
    }
  }
  return count;
}

/**
 * Organization node structure
 */
interface OrgNode {
  name: string;
  role?: string;
  reports?: OrgNode[];
}
