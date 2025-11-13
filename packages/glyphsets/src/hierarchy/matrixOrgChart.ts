import type { NodeAst, EdgeAst } from '@runiq/core';
import { GlyphSetError, type GlyphSetDefinition } from '../types.js';
import { getThemeColor, type ColorTheme } from '../themes.js';

/**
 * Matrix Organization Chart GlyphSet
 *
 * Generates an organization chart with dual reporting relationships.
 * Shows both functional and project-based reporting lines.
 *
 * Use cases:
 * - Matrix organizations
 * - Dotted-line reporting
 * - Cross-functional teams
 * - Shared resources
 *
 * @example
 * ```runiq
 * diagram "Matrix Organization" glyphset:matrixOrgChart {
 *   node "CEO" {
 *     functional: [
 *       { name: "VP Engineering", reports: ["Dev Lead", "QA Lead"] }
 *       { name: "VP Product", reports: ["PM Lead", "Designer"] }
 *     ]
 *     projects: [
 *       { name: "Project Alpha", team: ["Dev Lead", "PM Lead"] }
 *       { name: "Project Beta", team: ["QA Lead", "Designer"] }
 *     ]
 *   }
 * }
 * ```
 */
export const matrixOrgChartGlyphSet: GlyphSetDefinition = {
  id: 'matrixOrgChart',
  name: 'Matrix Organization Chart',
  category: 'hierarchy',
  description:
    'Organization chart with dual reporting relationships (functional + project)',

  parameters: [
    {
      name: 'structure',
      type: 'array',
      required: true,
      description: 'Matrix structure with functional and project reporting',
    },
    {
      name: 'theme',
      type: 'string',
      required: false,
      default: 'professional',
      description: 'Color theme',
    },
    {
      name: 'showDottedLines',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Use dotted lines for secondary reporting relationships',
    },
  ],

  minItems: 3,
  maxItems: 40,

  tags: [
    'hierarchy',
    'matrix',
    'dual-reporting',
    'cross-functional',
    'organization',
  ],

  generator: (params) => {
    const structure = params.structure as MatrixStructure | undefined;
    const theme = (params.theme as ColorTheme | undefined) || 'professional';
    const showDottedLines =
      (params.showDottedLines as boolean | undefined) ?? true;

    // Validation
    if (!structure || typeof structure !== 'object') {
      throw new GlyphSetError(
        'matrixOrgChart',
        'structure',
        'Parameter "structure" must be a matrix organization structure'
      );
    }

    if (!structure.ceo) {
      throw new GlyphSetError(
        'matrixOrgChart',
        'structure',
        'Matrix org chart requires a CEO/root node'
      );
    }

    const nodes: NodeAst[] = [];
    const edges: EdgeAst[] = [];
    const nodeIdMap = new Map<string, string>(); // name -> nodeId
    let nodeCount = 0;

    // Helper to get or create node ID
    function getNodeId(name: string): string {
      if (!nodeIdMap.has(name)) {
        nodeCount++;
        nodeIdMap.set(name, `person${nodeCount}`);
      }
      return nodeIdMap.get(name)!;
    }

    // Create CEO node
    const ceoId = getNodeId(structure.ceo);
    nodes.push({
      id: ceoId,
      shape: 'rect',
      label: structure.ceo,
      data: {
        color: getThemeColor(theme, 0),
        level: 0,
        type: 'executive',
      },
    });

    // Create functional hierarchy
    if (structure.functional && Array.isArray(structure.functional)) {
      structure.functional.forEach((func, funcIndex) => {
        const funcId = getNodeId(func.name);

        nodes.push({
          id: funcId,
          shape: 'rounded',
          label: func.name,
          data: {
            color: getThemeColor(theme, 1),
            level: 1,
            type: 'functional',
          },
        });

        // Functional reporting line (solid)
        edges.push({
          from: ceoId,
          to: funcId,
        });

        // Direct reports
        if (func.reports && Array.isArray(func.reports)) {
          func.reports.forEach((reportName) => {
            const reportId = getNodeId(reportName);

            // Create node if doesn't exist
            if (!nodes.find((n) => n.id === reportId)) {
              nodes.push({
                id: reportId,
                shape: 'rect',
                label: reportName,
                data: {
                  color: getThemeColor(theme, 2 + funcIndex),
                  level: 2,
                  type: 'employee',
                },
              });
            }

            // Functional reporting line (solid)
            edges.push({
              from: funcId,
              to: reportId,
            });
          });
        }
      });
    }

    // Create project relationships
    if (structure.projects && Array.isArray(structure.projects)) {
      structure.projects.forEach((project) => {
        const projectId = getNodeId(project.name);

        // Project node
        nodes.push({
          id: projectId,
          shape: 'hexagon',
          label: project.name,
          data: {
            color: '#9C27B0', // Purple for projects
            type: 'project',
          },
        });

        // Project reports to CEO (dotted if enabled)
        edges.push({
          from: ceoId,
          to: projectId,
          style: showDottedLines ? 'dashed' : 'solid',
        });

        // Team members assigned to project (dotted)
        if (project.team && Array.isArray(project.team)) {
          project.team.forEach((memberName) => {
            const memberId = getNodeId(memberName);

            // Cross-functional assignment (dotted line)
            edges.push({
              from: projectId,
              to: memberId,
              style: showDottedLines ? 'dashed' : 'solid',
            });
          });
        }
      });
    }

    // Validate
    if (nodeCount < 3) {
      throw new GlyphSetError(
        'matrixOrgChart',
        'structure',
        'Matrix org chart requires at least 3 people (CEO + functional + employee)'
      );
    }

    if (nodeCount > 40) {
      throw new GlyphSetError(
        'matrixOrgChart',
        'structure',
        'Matrix org chart supports maximum 40 people'
      );
    }

    return {
      astVersion: '1.0',
      direction: 'TB',
      nodes,
      edges,
    };
  },
};

/**
 * Matrix organization structure
 */
interface MatrixStructure {
  /** CEO/Top executive */
  ceo: string;
  /** Functional departments */
  functional?: Array<{
    name: string;
    reports?: string[];
  }>;
  /** Project teams */
  projects?: Array<{
    name: string;
    team?: string[];
  }>;
}
