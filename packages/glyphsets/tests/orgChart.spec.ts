import { describe, it, expect } from 'vitest';
import { orgChartGlyphSet } from '../src/hierarchy/orgChart.js';
import { horizontalOrgChartGlyphSet } from '../src/hierarchy/horizontalOrgChart.js';
import { matrixOrgChartGlyphSet } from '../src/hierarchy/matrixOrgChart.js';
import { GlyphSetError } from '../src/types.js';

describe('Organization Chart GlyphSets', () => {
  describe('orgChart - Vertical Organization Chart', () => {
    it('should generate basic org chart with CEO and reports', () => {
      const diagram = orgChartGlyphSet.generator({
        structure: [
          {
            name: 'CEO',
            reports: [{ name: 'VP Engineering' }, { name: 'VP Sales' }],
          },
        ],
      });

      expect(diagram.nodes).toHaveLength(3);
      expect(diagram.edges).toHaveLength(2);
      expect(diagram.direction).toBe('TB');

      // Check CEO node
      const ceo = diagram.nodes.find((n) => n.label === 'CEO');
      expect(ceo).toBeDefined();
      expect(ceo?.data.level).toBe(0);

      // Check VP nodes
      const vpEng = diagram.nodes.find((n) => n.label === 'VP Engineering');
      expect(vpEng).toBeDefined();
      expect(vpEng?.data.level).toBe(1);
    });

    it('should generate multi-level hierarchy', () => {
      const diagram = orgChartGlyphSet.generator({
        structure: [
          {
            name: 'CEO',
            reports: [
              {
                name: 'VP Engineering',
                reports: [{ name: 'Dev Manager' }, { name: 'QA Manager' }],
              },
            ],
          },
        ],
      });

      expect(diagram.nodes).toHaveLength(4);
      expect(diagram.edges).toHaveLength(3);

      // Check level assignment
      expect(diagram.nodes.find((n) => n.label === 'CEO')?.data.level).toBe(0);
      expect(
        diagram.nodes.find((n) => n.label === 'VP Engineering')?.data.level
      ).toBe(1);
      expect(
        diagram.nodes.find((n) => n.label === 'Dev Manager')?.data.level
      ).toBe(2);
    });

    it('should support multiple root nodes (co-founders)', () => {
      const diagram = orgChartGlyphSet.generator({
        structure: [
          { name: 'Co-Founder 1', reports: [{ name: 'Team A' }] },
          { name: 'Co-Founder 2', reports: [{ name: 'Team B' }] },
        ],
      });

      expect(diagram.nodes).toHaveLength(4);
      expect(diagram.edges).toHaveLength(2);

      // Both co-founders at level 0
      expect(diagram.nodes.filter((n) => n.data.level === 0)).toHaveLength(2);
    });

    it('should apply color themes based on level', () => {
      const diagram = orgChartGlyphSet.generator({
        structure: [
          {
            name: 'CEO',
            reports: [{ name: 'VP' }],
          },
        ],
        theme: 'professional',
      });

      const ceo = diagram.nodes.find((n) => n.label === 'CEO');
      const vp = diagram.nodes.find((n) => n.label === 'VP');

      expect(ceo?.data.color).toBeDefined();
      expect(vp?.data.color).toBeDefined();
      expect(ceo?.data.color).not.toBe(vp?.data.color); // Different levels, different colors
    });

    it('should support custom shape parameter', () => {
      const diagram = orgChartGlyphSet.generator({
        structure: [
          {
            name: 'CEO',
            reports: [{ name: 'Manager' }],
          },
        ],
        shape: 'hexagon',
      });

      expect(diagram.nodes[0].shape).toBe('hexagon');
      expect(diagram.nodes[1].shape).toBe('hexagon');
    });

    it('should support LR direction', () => {
      const diagram = orgChartGlyphSet.generator({
        structure: [
          {
            name: 'CEO',
            reports: [{ name: 'VP' }],
          },
        ],
        direction: 'LR',
      });

      expect(diagram.direction).toBe('LR');
    });

    it('should throw error for empty structure', () => {
      expect(() => {
        orgChartGlyphSet.generator({
          structure: [],
        });
      }).toThrow(GlyphSetError);
    });

    it('should throw error for invalid structure type', () => {
      expect(() => {
        orgChartGlyphSet.generator({
          structure: 'invalid',
        });
      }).toThrow(GlyphSetError);
    });

    it('should throw error for single node (no hierarchy)', () => {
      expect(() => {
        orgChartGlyphSet.generator({
          structure: [{ name: 'CEO' }], // No reports
        });
      }).toThrow(GlyphSetError);
    });

    it('should throw error for too many nodes', () => {
      const bigStructure = {
        name: 'CEO',
        reports: Array.from({ length: 50 }, (_, i) => ({
          name: `Person ${i}`,
        })),
      };

      expect(() => {
        orgChartGlyphSet.generator({
          structure: [bigStructure],
        });
      }).toThrow(GlyphSetError);
    });

    it('should handle complex real-world org structure', () => {
      const diagram = orgChartGlyphSet.generator({
        structure: [
          {
            name: 'Sarah Chen (CEO)',
            role: 'Chief Executive Officer',
            reports: [
              {
                name: 'John Smith (CTO)',
                role: 'Chief Technology Officer',
                reports: [
                  {
                    name: 'Alice Johnson',
                    role: 'Engineering Manager',
                    reports: [
                      { name: 'Bob Williams', role: 'Senior Developer' },
                      { name: 'Carol Davis', role: 'Developer' },
                    ],
                  },
                  {
                    name: 'David Brown',
                    role: 'QA Manager',
                    reports: [{ name: 'Eve Wilson', role: 'QA Lead' }],
                  },
                ],
              },
              {
                name: 'Frank Miller (CFO)',
                role: 'Chief Financial Officer',
                reports: [{ name: 'Grace Taylor', role: 'Accountant' }],
              },
            ],
          },
        ],
      });

      expect(diagram.nodes).toHaveLength(9);
      expect(diagram.edges).toHaveLength(8);

      // Verify hierarchy depth
      const levels = diagram.nodes.map((n) => n.data.level);
      expect(Math.max(...levels)).toBe(3); // 4 levels (0-3)
    });
  });

  describe('horizontalOrgChart - Horizontal Organization Chart', () => {
    it('should generate horizontal org chart (LR direction)', () => {
      const diagram = horizontalOrgChartGlyphSet.generator({
        structure: [
          {
            name: 'CTO',
            reports: [{ name: 'Backend Team' }, { name: 'Frontend Team' }],
          },
        ],
      });

      expect(diagram.nodes).toHaveLength(3);
      expect(diagram.direction).toBe('LR'); // Left-to-right
    });

    it('should use rounded shape by default', () => {
      const diagram = horizontalOrgChartGlyphSet.generator({
        structure: [
          {
            name: 'Manager',
            reports: [{ name: 'Employee' }],
          },
        ],
      });

      expect(diagram.nodes[0].shape).toBe('rounded');
    });

    it('should apply professional theme by default', () => {
      const diagram = horizontalOrgChartGlyphSet.generator({
        structure: [
          {
            name: 'Manager',
            reports: [{ name: 'Employee' }],
          },
        ],
      });

      const manager = diagram.nodes.find((n) => n.label === 'Manager');
      expect(manager?.data.color).toBeDefined();
    });
  });

  describe('matrixOrgChart - Matrix Organization Chart', () => {
    it('should generate matrix org chart with functional and project reporting', () => {
      const diagram = matrixOrgChartGlyphSet.generator({
        structure: {
          ceo: 'CEO',
          functional: [
            { name: 'VP Engineering', reports: ['Dev Lead', 'QA Lead'] },
            { name: 'VP Product', reports: ['PM Lead', 'Designer'] },
          ],
          projects: [
            { name: 'Project Alpha', team: ['Dev Lead', 'PM Lead'] },
            { name: 'Project Beta', team: ['QA Lead', 'Designer'] },
          ],
        },
      });

      // CEO + 2 VPs + 4 employees + 2 projects = 9 nodes
      expect(diagram.nodes).toHaveLength(9);

      // Check node types
      const ceo = diagram.nodes.find((n) => n.label === 'CEO');
      expect(ceo?.data.type).toBe('executive');

      const vp = diagram.nodes.find((n) => n.label === 'VP Engineering');
      expect(vp?.data.type).toBe('functional');

      const project = diagram.nodes.find((n) => n.label === 'Project Alpha');
      expect(project?.data.type).toBe('project');
      expect(project?.shape).toBe('hexagon'); // Projects use hexagon shape

      const employee = diagram.nodes.find((n) => n.label === 'Dev Lead');
      expect(employee?.data.type).toBe('employee');
    });

    it('should create solid lines for functional reporting', () => {
      const diagram = matrixOrgChartGlyphSet.generator({
        structure: {
          ceo: 'CEO',
          functional: [{ name: 'Manager', reports: ['Employee'] }],
        },
      });

      // Find functional reporting edge
      const ceoId = diagram.nodes.find((n) => n.label === 'CEO')?.id;
      const managerId = diagram.nodes.find((n) => n.label === 'Manager')?.id;

      const functionalEdge = diagram.edges.find(
        (e) => e.from === ceoId && e.to === managerId
      );

      expect(functionalEdge?.style).toBeUndefined(); // Solid (default)
    });

    it('should create dashed lines for project reporting by default', () => {
      const diagram = matrixOrgChartGlyphSet.generator({
        structure: {
          ceo: 'CEO',
          functional: [{ name: 'Manager', reports: ['Employee'] }],
          projects: [{ name: 'Project X', team: ['Employee'] }],
        },
      });

      // Find project reporting edge
      const projectId = diagram.nodes.find((n) => n.label === 'Project X')?.id;
      const employeeId = diagram.nodes.find((n) => n.label === 'Employee')?.id;

      const projectEdge = diagram.edges.find(
        (e) => e.from === projectId && e.to === employeeId
      );

      expect(projectEdge?.style).toBe('dashed');
    });

    it('should support disabling dotted lines', () => {
      const diagram = matrixOrgChartGlyphSet.generator({
        structure: {
          ceo: 'CEO',
          functional: [{ name: 'Manager', reports: ['Employee'] }],
          projects: [{ name: 'Project X', team: ['Employee'] }],
        },
        showDottedLines: false,
      });

      // All edges should be solid
      const projectEdges = diagram.edges.filter((e) => e.style === 'dashed');

      expect(projectEdges).toHaveLength(0);
    });

    it('should throw error for missing CEO', () => {
      expect(() => {
        matrixOrgChartGlyphSet.generator({
          structure: {
            functional: [{ name: 'Manager' }],
          },
        });
      }).toThrow(GlyphSetError);
    });

    it('should throw error for invalid structure type', () => {
      expect(() => {
        matrixOrgChartGlyphSet.generator({
          structure: 'invalid',
        });
      }).toThrow(GlyphSetError);
    });

    it('should throw error for too few nodes', () => {
      expect(() => {
        matrixOrgChartGlyphSet.generator({
          structure: {
            ceo: 'CEO',
            functional: [{ name: 'Manager' }],
          },
        });
      }).toThrow(GlyphSetError);
    });

    it('should handle complex matrix organization', () => {
      const diagram = matrixOrgChartGlyphSet.generator({
        structure: {
          ceo: 'CEO',
          functional: [
            {
              name: 'VP Engineering',
              reports: ['Backend Dev', 'Frontend Dev', 'DevOps'],
            },
            {
              name: 'VP Product',
              reports: ['PM', 'Designer', 'Researcher'],
            },
          ],
          projects: [
            { name: 'Project A', team: ['Backend Dev', 'PM', 'Designer'] },
            {
              name: 'Project B',
              team: ['Frontend Dev', 'DevOps', 'Researcher'],
            },
          ],
        },
      });

      // CEO + 2 VPs + 6 employees + 2 projects = 11 nodes
      expect(diagram.nodes).toHaveLength(11);

      // Functional edges: 2 (CEO->VPs) + 6 (VPs->employees) = 8
      // Project edges: 2 (CEO->projects) + 6 (projects->team) = 8
      // Total: 16 edges
      expect(diagram.edges).toHaveLength(16);
    });
  });
});
