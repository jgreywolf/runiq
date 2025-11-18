import { describe, it, expect, beforeEach } from 'vitest';
import { glyphsetRegistry, GlyphSetRegistry } from './registry';
import type { GlyphSetDefinition } from './types';
import {
  basicProcessGlyphSet,
  cycleGlyphSet,
  eventsGlyphSet,
  funnelGlyphSet,
  matrixGlyphSet,
  pyramidGlyphSet,
  vennGlyphSet,
} from '.';

describe('GlyphSetRegistry', () => {
  let registry: GlyphSetRegistry;

  const mockGlyphSet: GlyphSetDefinition = {
    id: 'test-glyphset',
    name: 'Test GlyphSet',
    category: 'process',
    description: 'A test glyphset',
    parameters: [],
    generator: () => ({
      astVersion: '1.0',
      nodes: [],
      edges: [],
    }),
  };

  const mockGlyphSet2: GlyphSetDefinition = {
    id: 'test-glyphset-2',
    name: 'Test GlyphSet 2',
    category: 'hierarchy',
    description: 'Another test glyphset',
    parameters: [],
    generator: () => ({
      astVersion: '1.0',
      nodes: [],
      edges: [],
    }),
  };

  beforeEach(() => {
    registry = new GlyphSetRegistry();
  });

  describe('register', () => {
    it('registers a glyphset', () => {
      registry.register(mockGlyphSet);
      expect(registry.has('test-glyphset')).toBe(true);
    });

    it('registers multiple glyphsets', () => {
      registry.register(mockGlyphSet);
      registry.register(mockGlyphSet2);
      expect(registry.has('test-glyphset')).toBe(true);
      expect(registry.has('test-glyphset-2')).toBe(true);
    });

    it('overwrites existing glyphset with same ID', () => {
      registry.register(mockGlyphSet);
      const updated = { ...mockGlyphSet, name: 'Updated Name' };
      registry.register(updated);

      const retrieved = registry.get('test-glyphset');
      expect(retrieved?.name).toBe('Updated Name');
    });

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

  describe('get', () => {
    it('retrieves a registered glyphset', () => {
      registry.register(mockGlyphSet);
      const retrieved = registry.get('test-glyphset');

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe('test-glyphset');
      expect(retrieved?.name).toBe('Test GlyphSet');
    });

    it('returns undefined for unregistered glyphset', () => {
      const retrieved = registry.get('nonexistent');
      expect(retrieved).toBeUndefined();
    });
  });

  describe('has', () => {
    it('returns true for registered glyphset', () => {
      registry.register(mockGlyphSet);
      expect(registry.has('test-glyphset')).toBe(true);
    });

    it('returns false for unregistered glyphset', () => {
      expect(registry.has('nonexistent')).toBe(false);
    });
  });

  describe('list', () => {
    beforeEach(() => {
      registry.register(mockGlyphSet);
      registry.register(mockGlyphSet2);
    });

    it('lists all glyphsets when no category specified', () => {
      const all = registry.list();
      expect(all).toHaveLength(2);
      expect(all.map((g) => g.id)).toContain('test-glyphset');
      expect(all.map((g) => g.id)).toContain('test-glyphset-2');
    });

    it('filters by category', () => {
      const processGlyphSets = registry.list('process');
      expect(processGlyphSets).toHaveLength(1);
      expect(processGlyphSets[0].id).toBe('test-glyphset');
    });

    it('returns empty array for category with no glyphsets', () => {
      const visualizationGlyphSets = registry.list('visualization');
      expect(visualizationGlyphSets).toHaveLength(0);
    });

    it('returns empty array when registry is empty', () => {
      const emptyRegistry = new GlyphSetRegistry();
      expect(emptyRegistry.list()).toHaveLength(0);
    });
  });

  describe('getAllIds', () => {
    it('returns all registered IDs', () => {
      registry.register(mockGlyphSet);
      registry.register(mockGlyphSet2);

      const ids = registry.getAllIds();
      expect(ids).toHaveLength(2);
      expect(ids).toContain('test-glyphset');
      expect(ids).toContain('test-glyphset-2');
    });

    it('returns empty array when registry is empty', () => {
      expect(registry.getAllIds()).toHaveLength(0);
    });
  });

  describe('clear', () => {
    it('removes all registered glyphsets', () => {
      registry.register(mockGlyphSet);
      registry.register(mockGlyphSet2);

      expect(registry.list()).toHaveLength(2);

      registry.clear();

      expect(registry.list()).toHaveLength(0);
      expect(registry.has('test-glyphset')).toBe(false);
      expect(registry.has('test-glyphset-2')).toBe(false);
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
