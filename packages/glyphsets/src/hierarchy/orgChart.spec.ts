import { describe, it, expect } from 'vitest';
import { orgChartGlyphSet } from './orgChart.js';
import { horizontalOrgChartGlyphSet } from './horizontalOrgChart.js';
import { matrixOrgChartGlyphSet } from './matrixOrgChart.js';
import { GlyphSetError } from '../types.js';

describe('Organization Chart GlyphSets', () => {
  describe('orgChart - Vertical Organization Chart', () => {
    describe('metadata', () => {
      it('should have correct id', () => {
        expect(orgChartGlyphSet.id).toBe('orgChart');
      });

      it('should have correct name', () => {
        expect(orgChartGlyphSet.name).toBe('Organization Chart');
      });

      it('should have correct category', () => {
        expect(orgChartGlyphSet.category).toBe('hierarchy');
      });

      it('should have correct minItems and maxItems', () => {
        expect(orgChartGlyphSet.minItems).toBe(2);
        expect(orgChartGlyphSet.maxItems).toBe(50);
      });

      it('should have required parameters defined', () => {
        expect(orgChartGlyphSet.parameters).toBeDefined();

        const structureParam = orgChartGlyphSet.parameters.find(
          (p) => p.name === 'structure'
        );
        expect(structureParam).toBeDefined();
        expect(structureParam?.required).toBe(true);
        expect(structureParam?.type).toBe('array');

        const themeParam = orgChartGlyphSet.parameters.find(
          (p) => p.name === 'theme'
        );
        expect(themeParam).toBeDefined();
        expect(themeParam?.required).toBe(false);
        expect(themeParam?.default).toBe('professional');
      });
    });

    describe('basic generation', () => {
      it('should generate single composite node with hierarchy data', () => {
        const diagram = orgChartGlyphSet.generator({
          structure: [
            {
              name: 'CEO',
              reports: [{ name: 'VP Engineering' }, { name: 'VP Sales' }],
            },
          ],
        });

        // Single composite node pattern
        expect(diagram.nodes).toHaveLength(1);
        expect(diagram.edges).toHaveLength(0);
        expect(diagram.direction).toBe('TB');
      });

      it('should use orgChart shape', () => {
        const diagram = orgChartGlyphSet.generator({
          structure: [
            {
              name: 'CEO',
              reports: [{ name: 'VP' }],
            },
          ],
        });

        expect(diagram.nodes[0].shape).toBe('orgChart');
      });

      it('should pass hierarchy data to composite node', () => {
        const diagram = orgChartGlyphSet.generator({
          structure: [
            {
              name: 'CEO',
              reports: [{ name: 'VP Engineering' }, { name: 'VP Sales' }],
            },
          ],
        });

        const node = diagram.nodes[0];
        const data = node.data as any;
        expect(data).toBeDefined();
        expect(data.hierarchy).toBeDefined();
        expect(data.hierarchy.name).toBe('CEO');
        expect(data.hierarchy.reports).toHaveLength(2);
      });

      it('should support nested hierarchy structure', () => {
        const diagram = orgChartGlyphSet.generator({
          structure: [
            {
              name: 'CEO',
              reports: [
                {
                  name: 'VP Engineering',
                  reports: [
                    { name: 'Dev Manager' },
                    { name: 'QA Manager' },
                  ],
                },
              ],
            },
          ],
        });

        const hierarchy = (diagram.nodes[0].data as any)?.hierarchy;
        expect(hierarchy?.reports).toHaveLength(1);
        expect(hierarchy?.reports[0].reports).toHaveLength(2);
      });

      it('should support role property', () => {
        const diagram = orgChartGlyphSet.generator({
          structure: [
            {
              name: 'Sarah Chen',
              role: 'Chief Executive Officer',
              reports: [{ name: 'John Smith', role: 'CTO' }],
            },
          ],
        });

        const hierarchy = (diagram.nodes[0].data as any)?.hierarchy;
        expect(hierarchy?.role).toBe('Chief Executive Officer');
        expect(hierarchy?.reports[0].role).toBe('CTO');
      });
    });

    describe('parameter validation', () => {
      it('should throw error for empty structure array', () => {
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

      it('should throw error for structure without name', () => {
        expect(() => {
          orgChartGlyphSet.generator({
            structure: [{ reports: [{ name: 'VP' }] }],
          });
        }).toThrow(GlyphSetError);
      });

      it('should throw error for single node (no hierarchy)', () => {
        expect(() => {
          orgChartGlyphSet.generator({
            structure: [{ name: 'CEO' }], // No reports
          });
        }).toThrow(GlyphSetError);

        expect(() => {
          orgChartGlyphSet.generator({
            structure: [{ name: 'CEO', reports: [] }], // Empty reports
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

      it('should validate minimum 2 people', () => {
        expect(() => {
          orgChartGlyphSet.generator({
            structure: [{ name: 'CEO' }],
          });
        }).toThrow(/at least 2 people/i);
      });

      it('should validate maximum 50 people', () => {
        // Create structure with 51 people (1 CEO + 50 reports)
        const tooManyPeople = {
          name: 'CEO',
          reports: Array.from({ length: 50 }, (_, i) => ({
            name: `Employee ${i}`,
          })),
        };

        expect(() => {
          orgChartGlyphSet.generator({
            structure: [tooManyPeople],
          });
        }).toThrow(/maximum 50 people/i);
      });
    });

    describe('theme support', () => {
      it('should apply default professional theme', () => {
        const diagram = orgChartGlyphSet.generator({
          structure: [
            {
              name: 'CEO',
              reports: [{ name: 'VP' }],
            },
          ],
        });

        const colors = (diagram.nodes[0].data as any)?.colors;
        expect(colors).toBeDefined();
        expect(Array.isArray(colors)).toBe(true);
        expect(colors.length).toBeGreaterThan(0);
      });

      it('should support custom theme', () => {
        const diagram = orgChartGlyphSet.generator({
          structure: [
            {
              name: 'CEO',
              reports: [{ name: 'VP' }],
            },
          ],
          theme: 'vibrant',
        });

        const colors = (diagram.nodes[0].data as any)?.colors;
        expect(colors).toBeDefined();
        expect(Array.isArray(colors)).toBe(true);
      });

      it('should generate colors for depth levels', () => {
        const diagram = orgChartGlyphSet.generator({
          structure: [
            {
              name: 'CEO',
              reports: [{ name: 'VP' }],
            },
          ],
        });

        // Should have colors for multiple depth levels (0-5)
        const colors = (diagram.nodes[0].data as any)?.colors;
        expect(colors).toHaveLength(6);
      });
    });

    describe('nodeShape parameter', () => {
      it('should use default rounded shape', () => {
        const diagram = orgChartGlyphSet.generator({
          structure: [
            {
              name: 'CEO',
              reports: [{ name: 'Manager' }],
            },
          ],
        });

        expect((diagram.nodes[0].data as any)?.nodeShape).toBe('rounded');
      });

      it('should support custom nodeShape parameter', () => {
        const diagram = orgChartGlyphSet.generator({
          structure: [
            {
              name: 'CEO',
              reports: [{ name: 'Manager' }],
            },
          ],
          nodeShape: 'hexagon',
        });

        expect((diagram.nodes[0].data as any)?.nodeShape).toBe('hexagon');
      });

      it('should support rect shape', () => {
        const diagram = orgChartGlyphSet.generator({
          structure: [
            {
              name: 'CEO',
              reports: [{ name: 'Manager' }],
            },
          ],
          nodeShape: 'rect',
        });

        expect((diagram.nodes[0].data as any)?.nodeShape).toBe('rect');
      });
    });

    describe('real-world use cases', () => {
      it('should handle small team structure', () => {
        const diagram = orgChartGlyphSet.generator({
          structure: [
            {
              name: 'Founder',
              role: 'CEO',
              reports: [
                { name: 'Lead Developer', role: 'Engineering' },
                { name: 'Lead Designer', role: 'Design' },
              ],
            },
          ],
        });

        expect(diagram.nodes).toHaveLength(1);
        expect((diagram.nodes[0].data as any)?.hierarchy?.reports).toHaveLength(2);
      });

      it('should handle medium company structure', () => {
        const diagram = orgChartGlyphSet.generator({
          structure: [
            {
              name: 'CEO',
              reports: [
                {
                  name: 'VP Engineering',
                  reports: [
                    { name: 'Backend Lead' },
                    { name: 'Frontend Lead' },
                    { name: 'DevOps Lead' },
                  ],
                },
                {
                  name: 'VP Product',
                  reports: [
                    { name: 'Product Manager' },
                    { name: 'UX Designer' },
                  ],
                },
              ],
            },
          ],
        });

        const hierarchy = (diagram.nodes[0].data as any)?.hierarchy;
        expect(hierarchy?.reports).toHaveLength(2);
        expect(hierarchy?.reports[0].reports).toHaveLength(3);
        expect(hierarchy?.reports[1].reports).toHaveLength(2);
      });

      it('should handle complex enterprise structure with deep nesting', () => {
        const diagram = orgChartGlyphSet.generator({
          structure: [
            {
              name: 'Sarah Chen',
              role: 'Chief Executive Officer',
              reports: [
                {
                  name: 'John Smith',
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
                  name: 'Frank Miller',
                  role: 'Chief Financial Officer',
                  reports: [{ name: 'Grace Taylor', role: 'Accountant' }],
                },
              ],
            },
          ],
        });

        const hierarchy = (diagram.nodes[0].data as any)?.hierarchy;
        expect(hierarchy).toBeDefined();
        expect(hierarchy.name).toBe('Sarah Chen');
        expect(hierarchy.reports).toHaveLength(2);

        // Verify deep nesting exists
        const cto = hierarchy.reports[0];
        expect(cto.name).toBe('John Smith');
        expect(cto.reports).toHaveLength(2);

        const engManager = cto.reports[0];
        expect(engManager.reports).toHaveLength(2);
      });

      it('should handle wide organization (many direct reports)', () => {
        const diagram = orgChartGlyphSet.generator({
          structure: [
            {
              name: 'CEO',
              reports: [
                { name: 'VP Engineering' },
                { name: 'VP Sales' },
                { name: 'VP Marketing' },
                { name: 'VP Finance' },
                { name: 'VP HR' },
                { name: 'VP Operations' },
              ],
            },
          ],
        });

        const hierarchy = (diagram.nodes[0].data as any)?.hierarchy;
        expect(hierarchy?.reports).toHaveLength(6);
      });

      it('should handle unbalanced tree structure', () => {
        const diagram = orgChartGlyphSet.generator({
          structure: [
            {
              name: 'CEO',
              reports: [
                {
                  name: 'VP Engineering',
                  reports: [
                    {
                      name: 'Engineering Manager',
                      reports: [
                        { name: 'Senior Dev' },
                        { name: 'Junior Dev' },
                      ],
                    },
                  ],
                },
                { name: 'VP Sales' }, // No reports - unbalanced
              ],
            },
          ],
        });

        const hierarchy = (diagram.nodes[0].data as any)?.hierarchy;
        expect(hierarchy?.reports).toHaveLength(2);
        expect(hierarchy?.reports[0].reports).toBeDefined();
        expect(hierarchy?.reports[1].reports).toBeUndefined();
      });
    });
  });

  describe('horizontalOrgChart - Horizontal Organization Chart', () => {
    describe('metadata', () => {
      it('should have correct id', () => {
        expect(horizontalOrgChartGlyphSet.id).toBe('horizontalOrgChart');
      });

      it('should have correct name', () => {
        expect(horizontalOrgChartGlyphSet.name).toBe(
          'Horizontal Organization Chart'
        );
      });

      it('should have correct category', () => {
        expect(horizontalOrgChartGlyphSet.category).toBe('hierarchy');
      });

      it('should have correct minItems and maxItems', () => {
        expect(horizontalOrgChartGlyphSet.minItems).toBe(2);
        expect(horizontalOrgChartGlyphSet.maxItems).toBe(50);
      });
    });

    describe('basic generation', () => {
      it('should generate left-to-right org chart (LR direction)', () => {
        const diagram = horizontalOrgChartGlyphSet.generator({
          structure: [
            {
              name: 'CTO',
              reports: [{ name: 'Backend Team' }, { name: 'Frontend Team' }],
            },
          ],
        });

        expect(diagram.nodes).toHaveLength(1);
        expect(diagram.edges).toHaveLength(0);
        expect(diagram.direction).toBe('LR'); // Left-to-right
      });

      it('should use horizontalOrgChart shape', () => {
        const diagram = horizontalOrgChartGlyphSet.generator({
          structure: [
            {
              name: 'Manager',
              reports: [{ name: 'Employee' }],
            },
          ],
        });

        expect(diagram.nodes[0].shape).toBe('horizontalOrgChart');
      });

      it('should pass hierarchy data to composite node', () => {
        const diagram = horizontalOrgChartGlyphSet.generator({
          structure: [
            {
              name: 'CTO',
              reports: [{ name: 'Backend Team' }, { name: 'Frontend Team' }],
            },
          ],
        });

        const hierarchy = (diagram.nodes[0].data as any)?.hierarchy;
        expect(hierarchy).toBeDefined();
        expect(hierarchy.name).toBe('CTO');
        expect(hierarchy.reports).toHaveLength(2);
      });
    });

    describe('parameter validation', () => {
      it('should throw error for empty structure', () => {
        expect(() => {
          horizontalOrgChartGlyphSet.generator({
            structure: [],
          });
        }).toThrow(GlyphSetError);
      });

      it('should throw error for single node', () => {
        expect(() => {
          horizontalOrgChartGlyphSet.generator({
            structure: [{ name: 'Manager' }],
          });
        }).toThrow(GlyphSetError);
      });

      it('should throw error for too many nodes', () => {
        const bigStructure = {
          name: 'Root',
          reports: Array.from({ length: 50 }, (_, i) => ({
            name: `Person ${i}`,
          })),
        };

        expect(() => {
          horizontalOrgChartGlyphSet.generator({
            structure: [bigStructure],
          });
        }).toThrow(GlyphSetError);
      });
    });

    describe('theme and shape support', () => {
      it('should use rounded shape by default', () => {
        const diagram = horizontalOrgChartGlyphSet.generator({
          structure: [
            {
              name: 'Manager',
              reports: [{ name: 'Employee' }],
            },
          ],
        });

        expect((diagram.nodes[0].data as any)?.nodeShape).toBe('rounded');
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

        const colors = (diagram.nodes[0].data as any)?.colors;
        expect(colors).toBeDefined();
        expect(Array.isArray(colors)).toBe(true);
      });

      it('should support custom theme', () => {
        const diagram = horizontalOrgChartGlyphSet.generator({
          structure: [
            {
              name: 'Manager',
              reports: [{ name: 'Employee' }],
            },
          ],
          theme: 'vibrant',
        });

        const colors = (diagram.nodes[0].data as any)?.colors;
        expect(colors).toBeDefined();
      });
    });

    describe('real-world use cases', () => {
      it('should handle engineering team hierarchy', () => {
        const diagram = horizontalOrgChartGlyphSet.generator({
          structure: [
            {
              name: 'CTO',
              reports: [
                {
                  name: 'Backend Team',
                  reports: [{ name: 'Senior Dev' }, { name: 'Junior Dev' }],
                },
                {
                  name: 'Frontend Team',
                  reports: [{ name: 'UI Lead' }],
                },
              ],
            },
          ],
        });

        const hierarchy = (diagram.nodes[0].data as any)?.hierarchy;
        expect(hierarchy?.reports).toHaveLength(2);
        expect(hierarchy?.reports[0].reports).toHaveLength(2);
        expect(hierarchy?.reports[1].reports).toHaveLength(1);
      });
    });
  });

  describe('matrixOrgChart - Matrix Organization Chart', () => {
    describe('metadata', () => {
      it('should have correct id', () => {
        expect(matrixOrgChartGlyphSet.id).toBe('matrixOrgChart');
      });

      it('should have correct name', () => {
        expect(matrixOrgChartGlyphSet.name).toBe('Matrix Organization Chart');
      });

      it('should have correct category', () => {
        expect(matrixOrgChartGlyphSet.category).toBe('hierarchy');
      });

      it('should have correct minItems and maxItems', () => {
        expect(matrixOrgChartGlyphSet.minItems).toBe(3);
        expect(matrixOrgChartGlyphSet.maxItems).toBe(40);
      });
    });

    describe('basic generation', () => {
      it('should generate matrix org chart with functional and project structure', () => {
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

        expect(diagram.nodes).toHaveLength(1);
        expect(diagram.edges).toHaveLength(0);
        expect(diagram.direction).toBe('TB');
      });

      it('should use matrixOrgChart shape', () => {
        const diagram = matrixOrgChartGlyphSet.generator({
          structure: {
            ceo: 'CEO',
            functional: [{ name: 'Manager', reports: ['Employee'] }],
          },
        });

        expect(diagram.nodes[0].shape).toBe('matrixOrgChart');
      });

      it('should pass complete structure to composite node', () => {
        const diagram = matrixOrgChartGlyphSet.generator({
          structure: {
            ceo: 'CEO',
            functional: [{ name: 'VP Engineering', reports: ['Dev Lead'] }],
            projects: [{ name: 'Project Alpha', team: ['Dev Lead'] }],
          },
        });

        const data = diagram.nodes[0].data as any;
        expect(data?.structure).toBeDefined();
        expect(data.structure.ceo).toBe('CEO');
        expect(data.structure.functional).toHaveLength(1);
        expect(data.structure.projects).toHaveLength(1);
      });
    });

    describe('parameter validation', () => {
      it('should throw error for empty structure', () => {
        expect(() => {
          matrixOrgChartGlyphSet.generator({
            structure: [],
          });
        }).toThrow(GlyphSetError);
      });

      it('should throw error for missing CEO', () => {
        expect(() => {
          matrixOrgChartGlyphSet.generator({
            structure: {
              functional: [{ name: 'Manager', reports: ['Employee'] }],
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
              functional: [{ name: 'Manager' }], // No employee reports
            },
          });
        }).toThrow(GlyphSetError);
      });

      it('should validate minimum 3 people', () => {
        expect(() => {
          matrixOrgChartGlyphSet.generator({
            structure: {
              ceo: 'CEO',
              functional: [{ name: 'VP' }],
            },
          });
        }).toThrow(/at least 3 people/i);
      });

      it('should validate maximum 40 people', () => {
        const bigStructure = {
          ceo: 'CEO',
          functional: [
            {
              name: 'VP',
              reports: Array.from({ length: 40 }, (_, i) => `Employee ${i}`),
            },
          ],
        };

        expect(() => {
          matrixOrgChartGlyphSet.generator({
            structure: bigStructure,
          });
        }).toThrow(/maximum 40 people/i);
      });
    });

    describe('showDottedLines parameter', () => {
      it('should enable dotted lines by default', () => {
        const diagram = matrixOrgChartGlyphSet.generator({
          structure: {
            ceo: 'CEO',
            functional: [{ name: 'Manager', reports: ['Employee'] }],
            projects: [{ name: 'Project X', team: ['Employee'] }],
          },
        });

        expect((diagram.nodes[0].data as any)?.showDottedLines).toBe(true);
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

        expect((diagram.nodes[0].data as any)?.showDottedLines).toBe(false);
      });
    });

    describe('theme support', () => {
      it('should apply default professional theme', () => {
        const diagram = matrixOrgChartGlyphSet.generator({
          structure: {
            ceo: 'CEO',
            functional: [{ name: 'Manager', reports: ['Employee'] }],
          },
        });

        const colors = (diagram.nodes[0].data as any)?.colors;
        expect(colors).toBeDefined();
        expect(Array.isArray(colors)).toBe(true);
      });

      it('should support custom theme', () => {
        const diagram = matrixOrgChartGlyphSet.generator({
          structure: {
            ceo: 'CEO',
            functional: [{ name: 'Manager', reports: ['Employee'] }],
          },
          theme: 'vibrant',
        });

        const colors = (diagram.nodes[0].data as any)?.colors;
        expect(colors).toBeDefined();
      });
    });

    describe('hierarchical input conversion', () => {
      it('should convert hierarchical OrgNode to MatrixStructure', () => {
        const diagram = matrixOrgChartGlyphSet.generator({
          structure: [
            {
              name: 'CEO',
              reports: [
                {
                  name: 'VP Engineering',
                  reports: [{ name: 'Dev Lead' }, { name: 'QA Lead' }],
                },
              ],
            },
          ],
        });

        const structure = (diagram.nodes[0].data as any)?.structure;
        expect(structure.ceo).toBe('CEO');
        expect(structure.functional).toHaveLength(1);
        expect(structure.functional[0].name).toBe('VP Engineering');
        expect(structure.functional[0].reports).toHaveLength(2);
      });
    });

    describe('real-world use cases', () => {
      it('should handle simple matrix organization', () => {
        const diagram = matrixOrgChartGlyphSet.generator({
          structure: {
            ceo: 'CEO',
            functional: [
              { name: 'Engineering', reports: ['Developer'] },
              { name: 'Product', reports: ['PM'] },
            ],
            projects: [{ name: 'Launch', team: ['Developer', 'PM'] }],
          },
        });

        const structure = (diagram.nodes[0].data as any)?.structure;
        expect(structure.functional).toHaveLength(2);
        expect(structure.projects).toHaveLength(1);
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

        const structure = (diagram.nodes[0].data as any)?.structure;
        expect(structure.functional).toHaveLength(2);
        expect(structure.functional[0].reports).toHaveLength(3);
        expect(structure.functional[1].reports).toHaveLength(3);
        expect(structure.projects).toHaveLength(2);
        expect(structure.projects[0].team).toHaveLength(3);
        expect(structure.projects[1].team).toHaveLength(3);
      });

      it('should handle matrix without projects', () => {
        const diagram = matrixOrgChartGlyphSet.generator({
          structure: {
            ceo: 'CEO',
            functional: [
              {
                name: 'VP Engineering',
                reports: ['Dev 1', 'Dev 2'],
              },
            ],
          },
        });

        const structure = (diagram.nodes[0].data as any)?.structure;
        expect(structure.functional).toHaveLength(1);
        expect(structure.projects).toBeUndefined();
      });

      it('should handle cross-functional teams', () => {
        const diagram = matrixOrgChartGlyphSet.generator({
          structure: {
            ceo: 'Sarah Chen',
            functional: [
              { name: 'Engineering', reports: ['Alice', 'Bob'] },
              { name: 'Design', reports: ['Carol', 'Dave'] },
              { name: 'Marketing', reports: ['Eve', 'Frank'] },
            ],
            projects: [
              { name: 'Website Redesign', team: ['Alice', 'Carol', 'Eve'] },
              { name: 'Mobile App', team: ['Bob', 'Dave', 'Frank'] },
            ],
          },
        });

        const structure = (diagram.nodes[0].data as any)?.structure;
        expect(structure.ceo).toBe('Sarah Chen');
        expect(structure.functional).toHaveLength(3);
        expect(structure.projects).toHaveLength(2);
      });
    });
  });
});
