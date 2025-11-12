import { describe, it, expect, beforeEach } from 'vitest';
import { GlyphSetRegistry } from '../src/registry';
import type { GlyphSetDefinition } from '../src/types';

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
});
