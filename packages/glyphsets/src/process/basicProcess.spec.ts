import { describe, it, expect } from 'vitest';
import { basicProcessGlyphSet } from './basicProcess.js';
import { GlyphSetError } from '../types.js';

describe('BasicProcess GlyphSet', () => {
  describe('Metadata', () => {
    it('should have correct id', () => {
      expect(basicProcessGlyphSet.id).toBe('basicProcess');
    });

    it('should have correct name', () => {
      expect(basicProcessGlyphSet.name).toBe('Basic Process');
    });

    it('should have correct category', () => {
      expect(basicProcessGlyphSet.category).toBe('process');
    });

    it('should have correct minItems and maxItems', () => {
      expect(basicProcessGlyphSet.minItems).toBe(2);
      expect(basicProcessGlyphSet.maxItems).toBe(10);
    });

    it('should have correct parameters', () => {
      expect(basicProcessGlyphSet.parameters).toHaveLength(5);
      expect(basicProcessGlyphSet.parameters[0].name).toBe('steps');
      expect(basicProcessGlyphSet.parameters[1].name).toBe('orientation');
      expect(basicProcessGlyphSet.parameters[2].name).toBe('theme');
      expect(basicProcessGlyphSet.parameters[3].name).toBe('shape');
      expect(basicProcessGlyphSet.parameters[4].name).toBe('useContainers');
    });
  });

  describe('Horizontal Orientation', () => {
    it('should generate horizontal process with default orientation', () => {
      const diagram = basicProcessGlyphSet.generator({
        steps: ['Step 1', 'Step 2', 'Step 3'],
      });

      expect(diagram.direction).toBe('LR');
      expect(diagram.nodes).toHaveLength(3);
      expect(diagram.edges).toHaveLength(2);
    });

    it('should generate horizontal process with explicit orientation', () => {
      const diagram = basicProcessGlyphSet.generator({
        steps: ['Step 1', 'Step 2', 'Step 3'],
        orientation: 'horizontal',
      });

      expect(diagram.direction).toBe('LR');
      expect(diagram.nodes).toHaveLength(3);
      expect(diagram.edges).toHaveLength(2);
    });

    it('should apply theme colors in horizontal mode', () => {
      const diagram = basicProcessGlyphSet.generator({
        steps: ['Step 1', 'Step 2', 'Step 3'],
        orientation: 'horizontal',
        theme: 'colorful',
      });

      expect(diagram.nodes[0].data?.fillColor).toBeDefined();
      expect(diagram.nodes[1].data?.fillColor).toBeDefined();
      expect(diagram.nodes[2].data?.fillColor).toBeDefined();
    });

    it('should use processBox shape in horizontal mode', () => {
      const diagram = basicProcessGlyphSet.generator({
        steps: ['Step 1', 'Step 2'],
        orientation: 'horizontal',
      });

      expect(diagram.nodes[0].shape).toBe('processBox');
      expect(diagram.nodes[1].shape).toBe('processBox');
    });
  });

  describe('Vertical Orientation', () => {
    it('should generate vertical process', () => {
      const diagram = basicProcessGlyphSet.generator({
        steps: ['Step 1', 'Step 2', 'Step 3'],
        orientation: 'vertical',
      });

      expect(diagram.direction).toBe('TB');
      expect(diagram.nodes).toHaveLength(3);
      expect(diagram.edges).toHaveLength(2);
    });

    it('should apply theme colors in vertical mode', () => {
      const diagram = basicProcessGlyphSet.generator({
        steps: ['Step 1', 'Step 2', 'Step 3'],
        orientation: 'vertical',
        theme: 'monochrome',
      });

      expect(diagram.nodes[0].data?.fillColor).toBeDefined();
      expect(diagram.nodes[1].data?.fillColor).toBeDefined();
      expect(diagram.nodes[2].data?.fillColor).toBeDefined();
    });

    it('should use processBox shape in vertical mode', () => {
      const diagram = basicProcessGlyphSet.generator({
        steps: ['Step 1', 'Step 2'],
        orientation: 'vertical',
      });

      expect(diagram.nodes[0].shape).toBe('processBox');
      expect(diagram.nodes[1].shape).toBe('processBox');
    });

    it('validates minimum steps', () => {
      expect(() => {
        basicProcessGlyphSet.generator({ steps: ['Only One'] });
      }).toThrow(GlyphSetError);
    });
  });

  describe('Container Mode', () => {
    it('should generate containers when useContainers is true (horizontal)', () => {
      const diagram = basicProcessGlyphSet.generator({
        steps: ['Step 1', 'Step 2'],
        orientation: 'horizontal',
        useContainers: true,
      });

      expect(diagram.direction).toBe('LR');
      expect(diagram.containers).toHaveLength(2);
      expect(diagram.templates).toHaveLength(1);
      expect(diagram.nodes).toHaveLength(0); // Containers instead of nodes
      expect(diagram.edges).toHaveLength(1);
    });

    it('should generate containers when useContainers is true (vertical)', () => {
      const diagram = basicProcessGlyphSet.generator({
        steps: ['Step 1', 'Step 2'],
        orientation: 'vertical',
        useContainers: true,
      });

      expect(diagram.direction).toBe('TB');
      expect(diagram.containers).toHaveLength(2);
      expect(diagram.templates).toHaveLength(1);
      expect(diagram.nodes).toHaveLength(0);
      expect(diagram.edges).toHaveLength(1);
    });
  });

  describe('Edge Generation', () => {
    it('should generate sequential edges', () => {
      const diagram = basicProcessGlyphSet.generator({
        steps: ['A', 'B', 'C', 'D'],
      });

      expect(diagram.edges).toHaveLength(3);
      expect(diagram.edges[0].from).toBe('step1');
      expect(diagram.edges[0].to).toBe('step2');
      expect(diagram.edges[1].from).toBe('step2');
      expect(diagram.edges[1].to).toBe('step3');
      expect(diagram.edges[2].from).toBe('step3');
      expect(diagram.edges[2].to).toBe('step4');
    });
  });

  describe('Validation', () => {
    it('should throw error if steps is not an array', () => {
      expect(() => {
        basicProcessGlyphSet.generator({ steps: 'not an array' });
      }).toThrow(GlyphSetError);
    });

    it('should throw error if steps is missing', () => {
      expect(() => {
        basicProcessGlyphSet.generator({});
      }).toThrow(GlyphSetError);
    });

    it('should throw error if less than 2 steps', () => {
      expect(() => {
        basicProcessGlyphSet.generator({ steps: ['Only one'] });
      }).toThrow(GlyphSetError);
      expect(() => {
        basicProcessGlyphSet.generator({ steps: ['Only one'] });
      }).toThrow('at least 2 steps');
    });

    it('should throw error if more than 10 steps', () => {
      const manySteps = Array.from({ length: 11 }, (_, i) => `Step ${i + 1}`);
      expect(() => {
        basicProcessGlyphSet.generator({ steps: manySteps });
      }).toThrow(GlyphSetError);
      expect(() => {
        basicProcessGlyphSet.generator({ steps: manySteps });
      }).toThrow('maximum 10 steps');
    });

    it('should throw error for invalid orientation', () => {
      expect(() => {
        basicProcessGlyphSet.generator({
          steps: ['Step 1', 'Step 2'],
          orientation: 'diagonal',
        });
      }).toThrow(GlyphSetError);
      expect(() => {
        basicProcessGlyphSet.generator({
          steps: ['Step 1', 'Step 2'],
          orientation: 'diagonal',
        });
      }).toThrow('must be one of: horizontal, vertical');
    });

    it('should accept valid orientation values', () => {
      expect(() => {
        basicProcessGlyphSet.generator({
          steps: ['Step 1', 'Step 2'],
          orientation: 'horizontal',
        });
      }).not.toThrow();

      expect(() => {
        basicProcessGlyphSet.generator({
          steps: ['Step 1', 'Step 2'],
          orientation: 'vertical',
        });
      }).not.toThrow();
    });
  });

  describe('Theme Support', () => {
    it('should apply different themes', () => {
      const colorful = basicProcessGlyphSet.generator({
        steps: ['Step 1', 'Step 2', 'Step 3'],
        theme: 'colorful',
      });

      const warm = basicProcessGlyphSet.generator({
        steps: ['Step 1', 'Step 2', 'Step 3'],
        theme: 'warm',
      });

      // Colors should be different between themes (check second color to avoid coincidental matches)
      expect(colorful.nodes[1].data?.fillColor).not.toBe(
        warm.nodes[1].data?.fillColor
      );
    });

    it('should default to colorful theme', () => {
      const diagram = basicProcessGlyphSet.generator({
        steps: ['Step 1', 'Step 2'],
      });

      expect(diagram.nodes[0].data?.fillColor).toBeDefined();
    });
  });

  describe('Backward Compatibility', () => {
    it('should work like old horizontalProcess with default orientation', () => {
      const diagram = basicProcessGlyphSet.generator({
        steps: ['Research', 'Design', 'Develop', 'Test', 'Deploy'],
        theme: 'colorful',
        shape: 'rounded',
      });

      expect(diagram.direction).toBe('LR');
      expect(diagram.nodes).toHaveLength(5);
      expect(diagram.edges).toHaveLength(4);
      expect(diagram.nodes[0].shape).toBe('processBox');
    });

    it('should work like old verticalProcess with vertical orientation', () => {
      const diagram = basicProcessGlyphSet.generator({
        steps: ['Initiation', 'Planning', 'Execution', 'Monitoring', 'Closure'],
        orientation: 'vertical',
      });

      expect(diagram.direction).toBe('TB');
      expect(diagram.nodes).toHaveLength(5);
      expect(diagram.edges).toHaveLength(4);
      expect(diagram.nodes[0].shape).toBe('processBox');
    });
  });
});
