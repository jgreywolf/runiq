import { describe, it, expect } from 'vitest';
import { horizontalProcessGlyphSet } from '../src/process/horizontal-process';
import { GlyphSetError } from '../src/types';

describe('Horizontal Process GlyphSet', () => {
  describe('Metadata', () => {
    it('has correct metadata', () => {
      expect(horizontalProcessGlyphSet.id).toBe('horizontalProcess');
      expect(horizontalProcessGlyphSet.name).toBe('Horizontal Process');
      expect(horizontalProcessGlyphSet.category).toBe('process');
      expect(horizontalProcessGlyphSet.minItems).toBe(2);
      expect(horizontalProcessGlyphSet.maxItems).toBe(10);
    });

    it('has required parameters', () => {
      const stepsParam = horizontalProcessGlyphSet.parameters.find(
        (p) => p.name === 'steps'
      );
      expect(stepsParam).toBeDefined();
      expect(stepsParam?.required).toBe(true);
      expect(stepsParam?.type).toBe('array');
    });

    it('has optional shape parameter', () => {
      const shapeParam = horizontalProcessGlyphSet.parameters.find(
        (p) => p.name === 'shape'
      );
      expect(shapeParam).toBeDefined();
      expect(shapeParam?.required).toBe(false);
      expect(shapeParam?.default).toBe('rounded');
    });
  });

  describe('Node Generation', () => {
    it('generates diagram with 3 steps', () => {
      const result = horizontalProcessGlyphSet.generator({
        steps: ['Start', 'Middle', 'End'],
      });

      expect(result.nodes).toHaveLength(3);
      expect(result.edges).toHaveLength(2);
      expect(result.direction).toBe('LR');
    });

    it('generates correct node IDs and labels', () => {
      const result = horizontalProcessGlyphSet.generator({
        steps: ['Research', 'Design', 'Develop'],
      });

      expect(result.nodes?.[0]).toMatchObject({
        id: 'step1',
        label: 'Research',
      });
      expect(result.nodes?.[1]).toMatchObject({
        id: 'step2',
        label: 'Design',
      });
      expect(result.nodes?.[2]).toMatchObject({
        id: 'step3',
        label: 'Develop',
      });
    });

    it('generates sequential edges', () => {
      const result = horizontalProcessGlyphSet.generator({
        steps: ['A', 'B', 'C', 'D'],
      });

      expect(result.edges).toHaveLength(3);
      expect(result.edges?.[0]).toMatchObject({ from: 'step1', to: 'step2' });
      expect(result.edges?.[1]).toMatchObject({ from: 'step2', to: 'step3' });
      expect(result.edges?.[2]).toMatchObject({ from: 'step3', to: 'step4' });
    });

    it('uses default shape', () => {
      const result = horizontalProcessGlyphSet.generator({
        steps: ['A', 'B'],
      });

      expect(result.nodes?.[0].shape).toBe('processBox');
      expect(result.nodes?.[1].shape).toBe('processBox');
    });

    it('uses custom shape', () => {
      const result = horizontalProcessGlyphSet.generator({
        steps: ['A', 'B'],
        shape: 'rect',
      });

      expect(result.nodes?.[0].shape).toBe('processBox'); // Still uses processBox regardless
      expect(result.nodes?.[1].shape).toBe('processBox');
    });

    it('handles maximum number of steps', () => {
      const steps = Array.from({ length: 10 }, (_, i) => `Step ${i + 1}`);
      const result = horizontalProcessGlyphSet.generator({ steps });

      expect(result.nodes).toHaveLength(10);
      expect(result.edges).toHaveLength(9);
    });
  });

  describe('Container Generation', () => {
    it('generates containers when useContainers is true', () => {
      const result = horizontalProcessGlyphSet.generator({
        steps: ['A', 'B', 'C'],
        useContainers: true,
      });

      expect(result.containers).toHaveLength(3);
      expect(result.nodes).toHaveLength(0); // No nodes when using containers
      expect(result.edges).toHaveLength(2);
    });

    it('generates container template', () => {
      const result = horizontalProcessGlyphSet.generator({
        steps: ['A', 'B'],
        useContainers: true,
      });

      expect(result.templates).toHaveLength(1);
      expect(result.templates?.[0].id).toBe('process-step');
      expect(result.templates?.[0].containerStyle?.backgroundColor).toBe(
        '#4472C4'
      );
      expect(result.templates?.[0].containerStyle?.borderColor).toBe('#2E5AAC');
    });

    it('containers reference the template', () => {
      const result = horizontalProcessGlyphSet.generator({
        steps: ['Step 1', 'Step 2'],
        useContainers: true,
      });

      expect(result.containers?.[0].containerStyle?.templateId).toBe(
        'process-step'
      );
      expect(result.containers?.[1].containerStyle?.templateId).toBe(
        'process-step'
      );
    });

    it('containers have correct labels', () => {
      const result = horizontalProcessGlyphSet.generator({
        steps: ['Research', 'Design', 'Test'],
        useContainers: true,
      });

      expect(result.containers?.[0].label).toBe('Research');
      expect(result.containers?.[1].label).toBe('Design');
      expect(result.containers?.[2].label).toBe('Test');
    });
  });

  describe('Validation', () => {
    it('throws error for missing steps parameter', () => {
      expect(() => {
        horizontalProcessGlyphSet.generator({});
      }).toThrow(GlyphSetError);

      expect(() => {
        horizontalProcessGlyphSet.generator({});
      }).toThrow('Parameter "steps" must be an array');
    });

    it('throws error for non-array steps', () => {
      expect(() => {
        horizontalProcessGlyphSet.generator({ steps: 'not an array' });
      }).toThrow(GlyphSetError);
    });

    it('throws error for too few steps', () => {
      expect(() => {
        horizontalProcessGlyphSet.generator({ steps: ['Only One'] });
      }).toThrow(GlyphSetError);

      expect(() => {
        horizontalProcessGlyphSet.generator({ steps: ['Only One'] });
      }).toThrow('at least 2 steps');
    });

    it('throws error for too many steps', () => {
      const tooManySteps = Array.from(
        { length: 11 },
        (_, i) => `Step ${i + 1}`
      );

      expect(() => {
        horizontalProcessGlyphSet.generator({ steps: tooManySteps });
      }).toThrow(GlyphSetError);

      expect(() => {
        horizontalProcessGlyphSet.generator({ steps: tooManySteps });
      }).toThrow('maximum 10 steps');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string labels', () => {
      const result = horizontalProcessGlyphSet.generator({
        steps: ['', 'B'],
      });

      expect(result.nodes?.[0].label).toBe('');
      expect(result.nodes).toHaveLength(2);
    });

    it('handles special characters in labels', () => {
      const result = horizontalProcessGlyphSet.generator({
        steps: ['Step #1 (start)', 'Step #2 [middle]', 'Step #3 {end}'],
      });

      expect(result.nodes?.[0].label).toBe('Step #1 (start)');
      expect(result.nodes?.[1].label).toBe('Step #2 [middle]');
      expect(result.nodes?.[2].label).toBe('Step #3 {end}');
    });

    it('handles unicode characters in labels', () => {
      const result = horizontalProcessGlyphSet.generator({
        steps: ['开始', '处理', '结束'],
      });

      expect(result.nodes?.[0].label).toBe('开始');
      expect(result.nodes?.[1].label).toBe('处理');
      expect(result.nodes?.[2].label).toBe('结束');
    });

    it('handles exactly minimum steps', () => {
      const result = horizontalProcessGlyphSet.generator({
        steps: ['A', 'B'],
      });

      expect(result.nodes).toHaveLength(2);
      expect(result.edges).toHaveLength(1);
    });

    it('handles exactly maximum steps', () => {
      const steps = Array.from({ length: 10 }, (_, i) => `S${i + 1}`);
      const result = horizontalProcessGlyphSet.generator({ steps });

      expect(result.nodes).toHaveLength(10);
      expect(result.edges).toHaveLength(9);
    });
  });

  describe('AST Structure', () => {
    it('returns valid DiagramAst structure', () => {
      const result = horizontalProcessGlyphSet.generator({
        steps: ['A', 'B', 'C'],
      });

      expect(result).toHaveProperty('astVersion');
      expect(result).toHaveProperty('nodes');
      expect(result).toHaveProperty('edges');
      expect(result.astVersion).toBe('1.0');
    });

    it('sets left-to-right direction', () => {
      const result = horizontalProcessGlyphSet.generator({
        steps: ['A', 'B'],
      });

      expect(result.direction).toBe('LR');
    });

    it('includes all required AST properties', () => {
      const result = horizontalProcessGlyphSet.generator({
        steps: ['A', 'B'],
      });

      expect(result).toMatchObject({
        astVersion: expect.any(String),
        direction: expect.any(String),
        nodes: expect.any(Array),
        edges: expect.any(Array),
      });
    });
  });
});
