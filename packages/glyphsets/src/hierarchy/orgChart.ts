import type { NodeAst, EdgeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';
import { getThemeColor, type ColorTheme } from '../themes.js';

/**
 * Organization Chart GlyphSet
 *
 * Generates a hierarchical tree structure showing reporting relationships.
 * Similar to PowerPoint SmartArt "Organization Chart" pattern.
 *
 * Supports:
 * - Single or multiple root nodes (CEO, Co-Founders, etc.)
 * - Multiple levels of hierarchy
 * - Multiple reports per manager
 * - Auto-layout using tree algorithm
 *
 * @example
 * ```runiq
 * diagram "Company Org Chart" glyphset:orgChart {
 *   node "CEO" {
 *     node "VP Engineering" {
 *       node "Dev Manager"
 *       node "QA Manager"
 *     }
 *     node "VP Sales" {
 *       node "Sales Manager"
 *     }
 *   }
 * }
 * ```
 */
export const orgChartGlyphSet: GlyphSetDefinition = {
  id: 'orgChart',
  name: 'Organization Chart',
  category: 'hierarchy',
  description:
    'Hierarchical tree structure showing reporting relationships (top-down)',

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
      default: 'rect',
      description: 'Shape for each person/role (rect, rounded, hexagon)',
    },
    {
      name: 'direction',
      type: 'string',
      required: false,
      default: 'TB',
      description: 'Chart direction: TB (top-down) or LR (left-right)',
    },
  ],

  minItems: 2,
  maxItems: 50,

  tags: [
    'hierarchy',
    'org-chart',
    'organization',
    'reporting',
    'tree',
    'structure',
  ],

  generator: (params) => {
    const structure = params.structure as OrgNode[] | undefined;
    const theme = (params.theme as ColorTheme | undefined) || 'professional';
    const shape = (params.shape as string | undefined) || 'rect';
    const direction = (params.direction as string | undefined) || 'TB';

    // Validation
    if (!structure || !Array.isArray(structure)) {
      throw new GlyphSetError(
        'orgChart',
        'structure',
        'Parameter "structure" must be a hierarchical array of org nodes'
      );
    }

    if (structure.length === 0) {
      throw new GlyphSetError(
        'orgChart',
        'structure',
        'Organization chart requires at least one root node'
      );
    }

    // Generate nodes and edges from hierarchical structure
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

      // Create node for this person/role
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

      // Create edge from parent (manager)
      if (parentId) {
        edges.push({
          from: parentId,
          to: nodeId,
        });
      }

      // Process reports (children)
      if (orgNode.reports && Array.isArray(orgNode.reports)) {
        for (const report of orgNode.reports) {
          processNode(report, nodeId, level + 1);
        }
      }
    }

    // Process all root nodes (could be multiple for co-founders, etc.)
    for (const rootNode of structure) {
      processNode(rootNode, null, 0);
    }

    // Validate node count
    if (nodeCount < 2) {
      throw new GlyphSetError(
        'orgChart',
        'structure',
        'Organization chart requires at least 2 people (manager + report)'
      );
    }

    if (nodeCount > 50) {
      throw new GlyphSetError(
        'orgChart',
        'structure',
        'Organization chart supports maximum 50 people (for readability)'
      );
    }

    return {
      astVersion: '1.0',
      direction: direction as 'TB' | 'LR',
      nodes,
      edges,
    };
  },
};

/**
 * Organization node structure
 */
interface OrgNode {
  /** Person's name */
  name: string;
  /** Job title/role (optional) */
  role?: string;
  /** Direct reports */
  reports?: OrgNode[];
}
