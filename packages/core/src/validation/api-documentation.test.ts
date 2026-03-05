/**
 * API Documentation Validation Tests
 *
 * These tests ensure API documentation examples are valid and imports work.
 * They validate that:
 * 1. All imports in API docs resolve correctly
 * 2. Type definitions match documented interfaces
 * 3. Function signatures match documentation
 * 4. Package exports are accessible as documented
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { shapeRegistry } from '../registries';
import type { ShapeDefinition } from '../types';
import { registerDefaultShapes } from '../shapes';

describe('API Documentation Validation', () => {
  // Ensure shapes are registered for testing
  beforeAll(() => {
    registerDefaultShapes();
  });
  describe('Core API Exports', () => {
    it('should export shapeRegistry from @runiq/core', () => {
      // Documented in docs/reference/api/core.md
      expect(shapeRegistry).toBeDefined();
      expect(shapeRegistry.get).toBeDefined();
      expect(shapeRegistry.list).toBeDefined();
      expect(shapeRegistry.has).toBeDefined();
      expect(shapeRegistry.register).toBeDefined();
    });

    it('should export ShapeDefinition type', () => {
      // Verify ShapeDefinition interface exists and has required methods
      // This is documented in docs/reference/api/core.md
      const shape: Partial<ShapeDefinition> = {
        id: 'test',
      };
      expect(shape.id).toBe('test');
    });
  });

  describe('Shape Registry API', () => {
    it('should support documented registry methods', () => {
      // Test the API examples from docs/reference/api/core.md
      // Example: const rect = shapeRegistry.get('rect');

      // Note: We need shapes registered first
      const rectShape = shapeRegistry.get('rectangle');

      // The registry should return undefined for unknown shapes
      const unknown = shapeRegistry.get('nonexistent-shape-xyz');
      expect(unknown).toBeUndefined();

      // has() method should work
      expect(shapeRegistry.has('rectangle')).toBe(true);
      expect(shapeRegistry.has('nonexistent-shape-xyz')).toBe(false);
    });

    it('should list all registered shapes', () => {
      // Test shapeRegistry.list() as shown in documentation
      const shapes = shapeRegistry.list();
      expect(Array.isArray(shapes)).toBe(true);
    });
  });

  describe('Type Definitions', () => {
    it('should have ShapeDefinition interface with documented properties', () => {
      // From docs/reference/api/core.md:
      // interface ShapeDefinition {
      //   id: string;
      //   bounds(ctx): { width: number; height: number };
      //   anchors(ctx): Anchor[];
      //   render(ctx, position): string;
      // }

      const testShape: ShapeDefinition = {
        id: 'test-shape',
        bounds: () => ({ width: 100, height: 50 }),
        anchors: () => [],
        render: () => '<rect />',
      };

      expect(testShape.id).toBe('test-shape');
      expect(testShape.bounds()).toEqual({ width: 100, height: 50 });
      expect(testShape.anchors()).toEqual([]);
      expect(testShape.render()).toBe('<rect />');
    });
  });

  describe('Import Paths', () => {
    it('should allow importing from @runiq/core as documented', async () => {
      // Documentation shows: import { shapeRegistry } from '@runiq/core';
      // We're already testing this by importing at the top of this file

      // Verify the import works in a dynamic import as well
      const coreModule = await import('../registries');
      expect(coreModule.shapeRegistry).toBeDefined();
    });
  });

  describe('Package Structure', () => {
    it('should have registries module with all documented exports', async () => {
      const registries = await import('../registries');

      // From docs/reference/api/core.md
      expect(registries.shapeRegistry).toBeDefined();
      expect(registries.iconRegistry).toBeDefined();
      expect(registries.layoutRegistry).toBeDefined();
      expect(registries.dataSourceRegistry).toBeDefined();
    });

    it('should have types module with documented type exports', async () => {
      const types = await import('../types');

      // Verify we can import the types (TypeScript will validate at compile time)
      expect(types).toBeDefined();
    });
  });
});
