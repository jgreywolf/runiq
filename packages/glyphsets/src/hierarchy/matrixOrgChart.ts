import type { GlyphSetDefinition } from '../types.js';
import { GlyphSetError } from '../types.js';
import { getThemeColor, type ColorTheme } from '../themes.js';

/**
 * Matrix Organization Chart GlyphSet
 *
 * Generates an organization chart with dual reporting relationships.
 * Shows both functional and project-based reporting lines.
 * Uses a custom composite shape to render the entire matrix with themed colors.
 *
 * @example
 * ```runiq
 * diagram "Matrix Organization" glyphset:matrixOrgChart {
 *   structure: {
 *     ceo: "CEO"
 *     functional: [
 *       { name: "VP Engineering", reports: ["Dev Lead", "QA Lead"] }
 *       { name: "VP Product", reports: ["PM Lead", "Designer"] }
 *     ]
 *     projects: [
 *       { name: "Project Alpha", team: ["Dev Lead", "PM Lead"] }
 *       { name: "Project Beta", team: ["QA Lead", "Designer"] }
 *     ]
 *   }
 *   theme: "professional"
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
    // Handle structure as array (from DSL) or MatrixStructure object
    let structure: MatrixStructure;
    if (Array.isArray(params.structure)) {
      if (params.structure.length === 0) {
        throw new GlyphSetError(
          'matrixOrgChart',
          'structure',
          'Matrix org chart requires a CEO/root node'
        );
      }
      // Convert hierarchical OrgNode to MatrixStructure
      const rootNode = params.structure[0] as OrgNode;
      structure = convertToMatrixStructure(rootNode);
    } else if (params.structure && typeof params.structure === 'object') {
      structure = params.structure as MatrixStructure;
    } else {
      throw new GlyphSetError(
        'matrixOrgChart',
        'structure',
        'Parameter "structure" must be a matrix organization structure'
      );
    }
    
    const theme = (params.theme as ColorTheme | undefined) || 'professional';
    const showDottedLines =
      (params.showDottedLines as boolean | undefined) ?? true;

    // Validation
    if (!structure.ceo) {
      throw new GlyphSetError(
        'matrixOrgChart',
        'structure',
        'Matrix org chart requires a CEO/root node'
      );
    }

    // Count nodes
    let nodeCount = 1; // CEO
    if (structure.functional) {
      nodeCount += structure.functional.length;
      structure.functional.forEach((func) => {
        nodeCount += func.reports?.length || 0;
      });
    }
    if (structure.projects) {
      nodeCount += structure.projects.length;
    }

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

    // Generate theme colors
    const colors = [0, 1, 2, 3, 4, 5].map((idx) => getThemeColor(theme, idx));

    return {
      astVersion: '1.0',
      direction: 'TB',
      nodes: [
        {
          id: 'matrixOrgChart',
          shape: 'matrixOrgChart',
          label: '',
          data: {
            structure,
            colors,
            showDottedLines,
          },
        },
      ],
      edges: [],
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
  /** Project teams (cross-functional) */
  projects?: Array<{
    name: string;
    team?: string[];
  }>;
}

/**
 * Hierarchical org node (for DSL input)
 */
interface OrgNode {
  name: string;
  role?: string;
  reports?: OrgNode[];
}

/**
 * Convert hierarchical OrgNode structure to MatrixStructure
 * Treats top-level reports as functional departments
 */
function convertToMatrixStructure(root: OrgNode): MatrixStructure {
  const structure: MatrixStructure = {
    ceo: root.name,
  };

  if (root.reports && root.reports.length > 0) {
    structure.functional = root.reports.map((dept) => ({
      name: dept.name,
      reports: dept.reports?.map((emp) => emp.name) || [],
    }));
  }

  return structure;
}
