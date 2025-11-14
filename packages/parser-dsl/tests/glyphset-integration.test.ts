import { describe, it, expect } from 'vitest';
import { parse } from '../src/index';

describe('GlyphSet Integration', () => {
  describe('Basic Process', () => {
    it('parses horizontal process glyphset with steps', () => {
      const dsl = `
        glyphset basicProcess "Software Development" {
          step "Research"
          step "Design"
          step "Develop"
          step "Test"
          step "Deploy"

          orientation "horizontal"
        }
      `;

      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.document?.profiles).toHaveLength(1);
      const diagram = result.document?.profiles[0]!;

      expect(diagram.type).toBe('diagram');
      expect(diagram.name).toBe('Software Development');
      // horizontalProcess generates multiple nodes
      expect(diagram.nodes).toHaveLength(5);
      expect(diagram.nodes?.[0].label).toBe('Research');
      expect(diagram.nodes?.[4].label).toBe('Deploy');
      expect(diagram.edges).toHaveLength(4);
    });

    describe('Vertical Process', () => {
      it('parses vertical process glyphset', () => {
        const dsl = `
        glyphset basicProcess "Project Phases" {
          step "Initiation"
          step "Planning"
          step "Execution"
          step "Closure"

          orientation "vertical"
        }
      `;

        const result = parse(dsl);
        const diagram = result.document?.profiles[0]!;

        // verticalProcess generates multiple nodes
        expect(diagram.nodes).toHaveLength(4);
        expect(diagram.nodes?.[0].label).toBe('Initiation');
        expect(diagram.nodes?.[3].label).toBe('Closure');
      });
    });

    it('validates minimum steps', () => {
      const dsl = `
        glyphset basicProcess "Too Few Steps" {
          step "Only One"
        }
      `;

      // Parse succeeds but generator throws validation error
      expect(() => parse(dsl)).toThrow('at least 2 steps');
    });
  });

  describe('Cycle', () => {
    it('parses cycle glyphset with cycle-back edge', () => {
      const dsl = `
        glyphset cycle "PDCA Cycle" {
          step "Plan"
          step "Do"
          step "Check"
          step "Act"
        }
      `;

      const result = parse(dsl);
      const diagram = result.document?.profiles[0]!;

      // cycle generates single custom shape node
      expect(diagram.nodes).toHaveLength(1);
      expect(diagram.nodes?.[0].shape).toBe('cycle');
      expect(diagram.nodes?.[0].data?.steps).toEqual([
        'Plan',
        'Do',
        'Check',
        'Act',
      ]);
    });
  });

  describe('Pyramid', () => {
    it('parses pyramid glyphset with levels', () => {
      const dsl = `
        glyphset pyramid "Maslow's Hierarchy" {
          level "Self-Actualization"
          level "Esteem"
          level "Love/Belonging"
          level "Safety"
          level "Physiological"
        }
      `;

      const result = parse(dsl);
      const diagram = result.document?.profiles[0]!;

      // pyramid generates single custom shape node with level objects
      expect(diagram.nodes).toHaveLength(1);
      expect(diagram.nodes?.[0].shape).toBe('pyramid');
      expect(diagram.nodes?.[0].data?.levels).toHaveLength(5);
      expect(diagram.nodes?.[0].data?.levels[0]).toMatchObject({
        label: 'Self-Actualization',
        value: 1,
      });
      expect(diagram.nodes?.[0].data?.levels[4]).toMatchObject({
        label: 'Physiological',
        value: 5,
      });
    });
  });

  describe('Matrix', () => {
    it('parses matrix glyphset with quadrants', () => {
      const dsl = `
        glyphset matrix "SWOT Analysis" {
          quadrant "Strengths"
          quadrant "Weaknesses"
          quadrant "Opportunities"
          quadrant "Threats"
        }
      `;

      const result = parse(dsl);
      const diagram = result.document?.profiles[0]!;

      // matrix generates containers, not nodes
      expect(diagram.containers).toHaveLength(4);
      expect(diagram.containers?.[0].label).toBe('Strengths');
      expect(diagram.containers?.[1].label).toBe('Weaknesses');
      expect(diagram.containers?.[2].label).toBe('Opportunities');
      expect(diagram.containers?.[3].label).toBe('Threats');
    });

    it('validates exactly 4 quadrants', () => {
      const dsl = `
        glyphset matrix "Invalid Matrix" {
          quadrant "Q1"
          quadrant "Q2"
          quadrant "Q3"
        }
      `;

      // Parse succeeds but generator throws validation error
      expect(() => parse(dsl)).toThrow('exactly 4 quadrants');
    });
  });

  describe('Venn', () => {
    it('parses venn glyphset with circles', () => {
      const dsl = `
        glyphset venn "Feature Overlap" {
          circle "Essential"
          circle "Valuable"
          circle "Delightful"
        }
      `;

      const result = parse(dsl);
      const diagram = result.document?.profiles[0]!;

      // venn generates single custom shape node
      expect(diagram.nodes).toHaveLength(1);
      expect(diagram.nodes?.[0].shape).toBe('venn');
      // venn uses 'labels' not 'circles' in data
      expect(diagram.nodes?.[0].data?.labels).toEqual([
        'Essential',
        'Valuable',
        'Delightful',
      ]);
    });
  });

  describe('Funnel', () => {
    it('parses funnel glyphset with stages', () => {
      const dsl = `
        glyphset funnel "Sales Funnel" {
          stage "Awareness"
          stage "Interest"
          stage "Decision"
          stage "Action"
        }
      `;

      const result = parse(dsl);
      const diagram = result.document?.profiles[0]!;

      // funnel generates single custom shape (invertedPyramid)
      expect(diagram.nodes).toHaveLength(1);
      expect(diagram.nodes?.[0].shape).toBe('invertedPyramid');
      expect(diagram.nodes?.[0].data?.levels).toHaveLength(4);
    });
  });

  describe('Timeline', () => {
    it('parses timeline glyphset with events', () => {
      const dsl = `
        glyphset events "Project Roadmap" {
          event "Q1: Planning"
          event "Q2: Development"
          event "Q3: Testing"
          event "Q4: Launch"
        }
      `;

      const result = parse(dsl);
      const diagram = result.document?.profiles[0]!;

      // events generates multiple nodes
      expect(diagram.nodes).toHaveLength(4);
      expect(diagram.nodes?.[0].label).toBe('Q1: Planning');
      expect(diagram.nodes?.[3].label).toBe('Q4: Launch');
    });
  });

  describe('Error Handling', () => {
    it('throws error for unknown glyphset', () => {
      const dsl = `
        glyphset nonexistent "Unknown" {
          step "A"
          step "B"
        }
      `;

      // Parser throws error for unknown glyphset
      expect(() => parse(dsl)).toThrow('Unknown glyphset "nonexistent"');
    });

    it('provides list of available glyphsets in error', () => {
      const dsl = `
        glyphset invalidPattern "Invalid" {
          item "A"
          item "B"
        }
      `;

      // Parser throws error with list of available glyphsets
      try {
        parse(dsl);
        expect.fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('Unknown glyphset');
        expect(error.message).toContain('Available glyphsets');
      }
    });
  });

  describe('Normal Diagrams (without glyphset)', () => {
    it('still parses normal diagrams correctly', () => {
      const dsl = `
        diagram "Regular Diagram" {
          shape A as @circle label: "Node A"
          shape B as @rectangle label: "Node B"
          A -> B
        }
      `;

      const result = parse(dsl);
      const diagram = result.document?.profiles[0]!;

      expect(diagram.type).toBe('diagram');
      expect(diagram.name).toBe('Regular Diagram');
      expect(diagram.nodes).toHaveLength(2);
      expect(diagram.edges).toHaveLength(1);
    });
  });
});
