import { describe, it, expect } from 'vitest';
import { glyphsetRegistry } from '../src/registry';
import {
  basicProcessGlyphSet,
  cycleGlyphSet,
  pyramidGlyphSet,
  matrixGlyphSet,
  vennGlyphSet,
  funnelGlyphSet,
  eventsGlyphSet,
} from '../src/index';
import { GlyphSetError } from '../src/types';

describe('All GlyphSets', () => {
  describe('Registry Integration', () => {
    it('registers all glyphsets on import', () => {
      const allIds = glyphsetRegistry.getAllIds();

      expect(allIds).toContain('basicProcess');
      expect(allIds).toContain('cycle');
      expect(allIds).toContain('pyramid');
      expect(allIds).toContain('matrix');
      expect(allIds).toContain('venn');
      expect(allIds).toContain('funnel');
      expect(allIds).toContain('events');
      expect(allIds.length).toBeGreaterThanOrEqual(7);
    });

    it('lists glyphsets by category', () => {
      const processGlyphSets = glyphsetRegistry.list('process');
      const hierarchyGlyphSets = glyphsetRegistry.list('hierarchy');
      const comparisonGlyphSets = glyphsetRegistry.list('comparison');
      const visualizationGlyphSets = glyphsetRegistry.list('visualization');

      expect(processGlyphSets.length).toBeGreaterThanOrEqual(3);
      expect(hierarchyGlyphSets.length).toBeGreaterThanOrEqual(1);
      expect(comparisonGlyphSets.length).toBeGreaterThanOrEqual(2);
      expect(visualizationGlyphSets.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Basic Process', () => {
    it('generates horizontal process by default', () => {
      const result = basicProcessGlyphSet.generator({
        steps: ['Start', 'Process', 'End'],
      });

      expect(result.direction).toBe('LR');
      expect(result.nodes).toHaveLength(3);
      expect(result.edges).toHaveLength(2);
    });

    it('generates vertical process with orientation parameter', () => {
      const result = basicProcessGlyphSet.generator({
        steps: ['Start', 'Process', 'End'],
        orientation: 'vertical',
      });

      expect(result.direction).toBe('TB');
      expect(result.nodes).toHaveLength(3);
      expect(result.edges).toHaveLength(2);
    });

    it('validates minimum steps', () => {
      expect(() => {
        basicProcessGlyphSet.generator({ steps: ['Only One'] });
      }).toThrow(GlyphSetError);
    });
  });

  describe('Cycle', () => {
    it('generates circular process with cycle back', () => {
      const result = cycleGlyphSet.generator({
        steps: ['Plan', 'Do', 'Check', 'Act'],
      });

      // Cycle glyphset creates a single node with cycle shape
      expect(result.nodes).toHaveLength(1);
      expect(result.nodes?.[0].shape).toBe('cycle');
      expect(result.nodes?.[0].data).toHaveProperty('steps');
    });

    it('requires minimum 3 steps for meaningful cycle', () => {
      expect(() => {
        cycleGlyphSet.generator({ steps: ['A', 'B'] });
      }).toThrow('at least 3 steps');
    });

    it('handles 8 steps (max)', () => {
      const steps = Array.from({ length: 8 }, (_, i) => `Step ${i + 1}`);
      const result = cycleGlyphSet.generator({ steps });

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes?.[0].data).toHaveProperty('steps');
    });
  });

  describe('Pyramid', () => {
    it('generates hierarchical pyramid', () => {
      const result = pyramidGlyphSet.generator({
        levels: ['Top', 'Middle', 'Bottom'],
      });

      expect(result.direction).toBe('TB');
      // Pyramid glyphset creates a single node with pyramid shape
      expect(result.nodes).toHaveLength(1);
      expect(result.nodes?.[0].shape).toBe('pyramid');
      expect(result.edges).toHaveLength(0); // No edges - self-contained shape
    });

    it('respects showValues parameter', () => {
      const result = pyramidGlyphSet.generator({
        levels: ['Level 1', 'Level 2', 'Level 3'],
        showValues: true,
      });

      expect(result.nodes?.[0].data).toHaveProperty('showValues', true);
    });

    it('validates minimum levels', () => {
      expect(() => {
        pyramidGlyphSet.generator({ levels: ['Only', 'Two'] });
      }).toThrow('at least 3 levels');
    });
  });

  describe('Matrix', () => {
    it('generates 2x2 matrix with 4 quadrants', () => {
      const result = matrixGlyphSet.generator({
        quadrants: ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'],
      });

      expect(result.containers).toHaveLength(4);
      expect(result.containers?.[0].label).toBe('Strengths');
      expect(result.containers?.[1].label).toBe('Weaknesses');
      expect(result.containers?.[2].label).toBe('Opportunities');
      expect(result.containers?.[3].label).toBe('Threats');
    });

    it('requires exactly 4 quadrants', () => {
      expect(() => {
        matrixGlyphSet.generator({ quadrants: ['A', 'B', 'C'] });
      }).toThrow('exactly 4 quadrants');
    });

    it('applies distinct colors to each quadrant', () => {
      const result = matrixGlyphSet.generator({
        quadrants: ['Q1', 'Q2', 'Q3', 'Q4'],
      });

      const colors = result.containers?.map(
        (c) => c.containerStyle?.backgroundColor
      );
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(4); // Each quadrant has unique color
    });

    it('supports axis labels', () => {
      const result = matrixGlyphSet.generator({
        quadrants: ['Q1', 'Q2', 'Q3', 'Q4'],
        horizontalAxis: 'Urgency',
        verticalAxis: 'Importance',
      });

      expect(result.nodes).toHaveLength(2);
      expect(result.nodes?.[0].label).toBe('Urgency');
      expect(result.nodes?.[1].label).toBe('Importance');
    });
  });

  describe('Venn', () => {
    it('generates 2-circle venn diagram', () => {
      const result = vennGlyphSet.generator({
        circles: ['Set A', 'Set B'],
      });

      // Venn glyphset creates a single node with venn shape
      expect(result.nodes?.length).toBe(1);
      expect(result.nodes?.[0].shape).toBe('venn');
      expect(result.nodes?.[0].data).toHaveProperty('labels');
    });

    it('generates 3-circle venn diagram', () => {
      const result = vennGlyphSet.generator({
        circles: ['Essential', 'Valuable', 'Delightful'],
      });

      expect(result.nodes?.length).toBe(1);
      expect(result.nodes?.[0].shape).toBe('venn');
    });

    it('generates 4-circle venn diagram', () => {
      const result = vennGlyphSet.generator({
        circles: ['A', 'B', 'C', 'D'],
      });

      expect(result.nodes?.length).toBe(1);
      expect(result.nodes?.[0].data).toHaveProperty('labels');
    });

    it('validates circle count', () => {
      expect(() => {
        vennGlyphSet.generator({ circles: ['Only One'] });
      }).toThrow('2, 3, or 4 circles');

      expect(() => {
        vennGlyphSet.generator({ circles: ['A', 'B', 'C', 'D', 'E'] });
      }).toThrow('2, 3, or 4 circles');
    });
  });

  describe('Funnel', () => {
    it('generates top-to-bottom funnel', () => {
      const result = funnelGlyphSet.generator({
        stages: ['Awareness', 'Interest', 'Decision', 'Action'],
      });

      expect(result.direction).toBe('TB');
      // Funnel glyphset creates a single node using invertedPyramid shape
      expect(result.nodes).toHaveLength(1);
      expect(result.nodes?.[0].shape).toBe('invertedPyramid');
      expect(result.edges).toHaveLength(0); // No edges - self-contained shape
    });

    it('uses invertedPyramid shape for funnel visualization', () => {
      const result = funnelGlyphSet.generator({
        stages: ['Top', 'Middle', 'Bottom'],
      });

      expect(result.nodes?.[0].shape).toBe('invertedPyramid');
    });

    it('validates minimum stages', () => {
      expect(() => {
        funnelGlyphSet.generator({ stages: ['A', 'B'] });
      }).toThrow('Inverted pyramid requires at least 3');
    });
  });

  describe('Events', () => {
    it('generates horizontal event sequence', () => {
      const result = eventsGlyphSet.generator({
        events: ['Q1', 'Q2', 'Q3', 'Q4'],
      });

      expect(result.direction).toBe('LR');
      expect(result.nodes).toHaveLength(4);
      expect(result.edges).toHaveLength(3);
    });

    it('respects showConnections parameter', () => {
      const result = eventsGlyphSet.generator({
        events: ['Event 1', 'Event 2', 'Event 3'],
        showConnections: false,
      });

      expect(result.edges).toHaveLength(0);
    });

    it('validates minimum events', () => {
      expect(() => {
        eventsGlyphSet.generator({ events: ['Only One'] });
      }).toThrow('at least 2 events');
    });

    it('handles maximum events', () => {
      const events = Array.from({ length: 10 }, (_, i) => `Event ${i + 1}`);
      const result = eventsGlyphSet.generator({ events });

      expect(result.nodes).toHaveLength(10);
    });
  });

  describe('Metadata Consistency', () => {
    const allGlyphSets = [
      basicProcessGlyphSet,
      cycleGlyphSet,
      pyramidGlyphSet,
      matrixGlyphSet,
      vennGlyphSet,
      funnelGlyphSet,
      eventsGlyphSet,
    ];

    it('all glyphsets have required metadata', () => {
      allGlyphSets.forEach((glyphset) => {
        expect(glyphset.id).toBeDefined();
        expect(glyphset.name).toBeDefined();
        expect(glyphset.category).toBeDefined();
        expect(glyphset.description).toBeDefined();
        expect(glyphset.parameters).toBeDefined();
        expect(glyphset.generator).toBeDefined();
      });
    });

    it('all glyphsets have valid categories', () => {
      const validCategories = [
        'process',
        'hierarchy',
        'comparison',
        'visualization',
      ];

      allGlyphSets.forEach((glyphset) => {
        expect(validCategories).toContain(glyphset.category);
      });
    });

    it('all glyphsets have at least one parameter', () => {
      allGlyphSets.forEach((glyphset) => {
        expect(glyphset.parameters.length).toBeGreaterThan(0);
      });
    });

    it('all glyphsets have min/max item constraints', () => {
      allGlyphSets.forEach((glyphset) => {
        expect(glyphset.minItems).toBeDefined();
        expect(glyphset.maxItems).toBeDefined();
        expect(glyphset.minItems!).toBeLessThanOrEqual(glyphset.maxItems!);
      });
    });
  });
});
