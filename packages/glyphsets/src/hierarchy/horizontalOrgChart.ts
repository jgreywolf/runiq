import type { NodeAst, EdgeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';
import { getThemeColor, type ColorTheme } from '../themes.js';

/**
 * Horizontal Organization Chart GlyphSet
 *
 * Generates a left-to-right hierarchical tree structure.
 * Similar to PowerPoint SmartArt "Horizontal Organization Chart" pattern.
 *
 * Better for:
 * - Wide organizations (many direct reports)
 * - Process-oriented views
 * - Presenting on wide screens
 * - Showing progression/seniority left-to-right
 *
 * @example
 * ```runiq
 * diagram "Engineering Team" glyphset:horizontalOrgChart {
 *   node "CTO" {
 *     node "Backend Team" {
 *       node "Senior Dev"
 *       node "Junior Dev"
 *     }
 *     node "Frontend Team" {
 *       node "UI Lead"
 *       node "Designer"
 *     }
 *   }
 * }
 * ```
 */
export const horizontalOrgChartGlyphSet: GlyphSetDefinition = {
  id: 'horizontalOrgChart',
  name: 'Horizontal Organization Chart',
  category: 'hierarchy',
  description:
    'Left-to-right hierarchical tree structure for wide organizations',

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
      description: 'Color theme for the org chart',
    },
    {
      name: 'shape',
      type: 'string',
      required: false,
      default: 'rounded',
      description: 'Shape for each person/role (rect, rounded, hexagon)',
    },
  ],

  minItems: 2,
  maxItems: 50,

  tags: ['hierarchy', 'org-chart', 'horizontal', 'left-to-right', 'tree'],

  generator: (params) => {
    const structure = params.structure as OrgNode[] | undefined;
    const theme = (params.theme as ColorTheme | undefined) || 'professional';
    const shape = (params.shape as string | undefined) || 'rounded';

    // Validation
    if (!structure || !Array.isArray(structure)) {
      throw new GlyphSetError(
        'horizontalOrgChart',
        'structure',
        'Parameter "structure" must be a hierarchical array of org nodes'
      );
    }

    if (structure.length === 0) {
      throw new GlyphSetError(
        'horizontalOrgChart',
        'structure',
        'Horizontal org chart requires at least one root node'
      );
    }

    // Generate nodes and edges
    const nodes: NodeAst[] = [];
    const edges: EdgeAst[] = [];
    let nodeCount = 0;

    /**
     * Recursively process org structure
     */
    function processNode(
      orgNode: OrgNode,
      parentId: string | null,
      level: number
    ): void {
      nodeCount++;
      const nodeId = `person${nodeCount}`;

      // Create node
      nodes.push({
        id: nodeId,
        shape,
        label: orgNode.name,
        data: {
          color: getThemeColor(theme, level),
          role: orgNode.role,
          level,
        },
      });

      // Create edge from parent
      if (parentId) {
        edges.push({
          from: parentId,
          to: nodeId,
        });
      }

      // Process reports
      if (orgNode.reports && Array.isArray(orgNode.reports)) {
        for (const report of orgNode.reports) {
          processNode(report, nodeId, level + 1);
        }
      }
    }

    // Process root nodes
    for (const rootNode of structure) {
      processNode(rootNode, null, 0);
    }

    // Validate
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

    return {
      astVersion: '1.0',
      direction: 'LR', // Left-to-right for horizontal layout
      nodes,
      edges,
    };
  },
};

/**
 * Organization node structure
 */
interface OrgNode {
  name: string;
  role?: string;
  reports?: OrgNode[];
}
