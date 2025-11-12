import { describe, it, expect } from 'vitest';
import { parse } from '../src/index';

describe('GlyphSet Integration', () => {
  describe('Horizontal Process', () => {
    it('parses horizontal-process glyphset with steps', () => {
      const dsl = `
        diagram "Software Development" glyphset:horizontal-process {
          step "Research"
          step "Design"
          step "Develop"
          step "Test"
          step "Deploy"
        }
      `;

      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.document?.profiles).toHaveLength(1);
      const diagram = result.document?.profiles[0]!;

      expect(diagram.type).toBe('diagram');
      expect(diagram.name).toBe('Software Development');
      expect(diagram.nodes).toHaveLength(5);
      expect(diagram.edges).toHaveLength(4);
      expect(diagram.direction).toBe('LR'); // Horizontal

      // Check nodes
      expect(diagram.nodes?.[0].label).toBe('Research');
      expect(diagram.nodes?.[1].label).toBe('Design');
      expect(diagram.nodes?.[4].label).toBe('Deploy');

      // Check edges
      expect(diagram.edges?.[0]).toMatchObject({ from: 'step1', to: 'step2' });
      expect(diagram.edges?.[3]).toMatchObject({ from: 'step4', to: 'step5' });
    });

    it('validates minimum steps', () => {
      const dsl = `
        diagram "Too Few Steps" glyphset:horizontal-process {
          step "Only One"
        }
      `;

      const result = parse(dsl);
      expect(result.success).toBe(false);
      expect(result.errors.some((e) => e.message.includes('at least 2 steps'))).toBe(true);
    });
  });

  describe('Vertical Process', () => {
    it('parses vertical-process glyphset', () => {
      const dsl = `
        diagram "Project Phases" glyphset:vertical-process {
          step "Initiation"
          step "Planning"
          step "Execution"
          step "Closure"
        }
      `;

      const result = parse(dsl);
      const diagram = result.document?.profiles[0]!;

      expect(diagram.nodes).toHaveLength(4);
      expect(diagram.direction).toBe('TB'); // Vertical
    });
  });

  describe('Cycle', () => {
    it('parses cycle glyphset with cycle-back edge', () => {
      const dsl = `
        diagram "PDCA Cycle" glyphset:cycle {
          step "Plan"
          step "Do"
          step "Check"
          step "Act"
        }
      `;

      const result = parse(dsl);
      const diagram = result.document?.profiles[0]!;

      expect(diagram.nodes).toHaveLength(4);
      expect(diagram.edges).toHaveLength(4); // Including cycle back

      // Last edge should cycle back to first node
      expect(diagram.edges?.[3]).toMatchObject({ from: 'step4', to: 'step1' });
    });
  });

  describe('Pyramid', () => {
    it('parses pyramid glyphset with levels', () => {
      const dsl = `
        diagram "Maslow's Hierarchy" glyphset:pyramid {
          level "Self-Actualization"
          level "Esteem"
          level "Love/Belonging"
          level "Safety"
          level "Physiological"
        }
      `;

      const result = parse(dsl);
      const diagram = result.document?.profiles[0]!;

      expect(diagram.nodes).toHaveLength(5);
      expect(diagram.nodes?.[0].label).toBe('Self-Actualization');
      expect(diagram.nodes?.[4].label).toBe('Physiological');
      expect(diagram.direction).toBe('TB');
    });
  });

  describe('Matrix', () => {
    it('parses matrix glyphset with quadrants', () => {
      const dsl = `
        diagram "SWOT Analysis" glyphset:matrix {
          quadrant "Strengths"
          quadrant "Weaknesses"
          quadrant "Opportunities"
          quadrant "Threats"
        }
      `;

      const result = parse(dsl);
      const diagram = result.document?.profiles[0]!;

      expect(diagram.containers).toHaveLength(4);
      expect(diagram.containers?.[0].label).toBe('Strengths');
      expect(diagram.containers?.[1].label).toBe('Weaknesses');
      expect(diagram.containers?.[2].label).toBe('Opportunities');
      expect(diagram.containers?.[3].label).toBe('Threats');
    });

    it('validates exactly 4 quadrants', () => {
      const dsl = `
        diagram "Invalid Matrix" glyphset:matrix {
          quadrant "Q1"
          quadrant "Q2"
          quadrant "Q3"
        }
      `;

      const result = parse(dsl);
      expect(result.success).toBe(false);
      expect(result.errors.some((e) => e.message.includes('exactly 4 quadrants'))).toBe(true);
    });
  });

  describe('Venn', () => {
    it('parses venn glyphset with circles', () => {
      const dsl = `
        diagram "Feature Overlap" glyphset:venn {
          circle "Essential"
          circle "Valuable"
          circle "Delightful"
        }
      `;

      const result = parse(dsl);
      const diagram = result.document?.profiles[0]!;

      expect(diagram.nodes?.length).toBeGreaterThanOrEqual(3);
      expect(diagram.nodes?.[0].shape).toBe('circle');
    });
  });

  describe('Funnel', () => {
    it('parses funnel glyphset with stages', () => {
      const dsl = `
        diagram "Sales Funnel" glyphset:funnel {
          stage "Awareness"
          stage "Interest"
          stage "Decision"
          stage "Action"
        }
      `;

      const result = parse(dsl);
      const diagram = result.document?.profiles[0]!;

      expect(diagram.nodes).toHaveLength(4);
      expect(diagram.direction).toBe('TB');
    });
  });

  describe('Timeline', () => {
    it('parses timeline glyphset with events', () => {
      const dsl = `
        diagram "Project Roadmap" glyphset:timeline {
          event "Q1: Planning"
          event "Q2: Development"
          event "Q3: Testing"
          event "Q4: Launch"
        }
      `;

      const result = parse(dsl);
      const diagram = result.document?.profiles[0]!;

      expect(diagram.nodes).toHaveLength(4);
      expect(diagram.direction).toBe('LR');
    });
  });

  describe('Error Handling', () => {
    it('throws error for unknown glyphset', () => {
      const dsl = `
        diagram "Unknown" glyphset:nonexistent {
          step "A"
          step "B"
        }
      `;

      const result = parse(dsl);
      expect(result.success).toBe(false);
      expect(result.errors.some((e) => e.message.includes('Unknown glyphset "nonexistent"'))).toBe(true);
    });

    it('provides list of available glyphsets in error', () => {
      const dsl = `
        diagram "Unknown" glyphset:invalid-pattern {
          step "A"
          step "B"
        }
      `;

      const result = parse(dsl);
      expect(result.success).toBe(false);
      const errorMessage = result.errors.map((e) => e.message).join(' ');
      expect(errorMessage).toContain('Available glyphsets:');
      expect(errorMessage).toContain('horizontal-process');
      expect(errorMessage).toContain('vertical-process');
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
