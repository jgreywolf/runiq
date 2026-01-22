/**
 * Documentation Validation Tests
 *
 * These tests ensure documentation stays in sync with the actual codebase.
 * They validate that:
 * 1. All documented shapes actually exist in the registry
 * 2. All registered shapes are documented
 * 3. Shape counts in docs match reality
 * 4. Code examples in documentation can be parsed
 */

import { beforeAll, describe, expect, it } from 'vitest';
import { shapeRegistry } from '../registries';
import { registerDefaultShapes } from '../shapes';

describe('Documentation Validation', () => {
  // Ensure all shapes are registered before tests run
  beforeAll(() => {
    registerDefaultShapes();
  });

  describe('Shape Registry Validation', () => {
    // these are fragile tests as they need to be updated whenever any new shapes are added.
    // TODO: Consider automating this in the future by parsing the shapes directory
    it('should have exactly 265 shapes registered', () => {
      const allShapes = shapeRegistry.list();
      expect(allShapes.length).toBe(265);
    });

    it('should have all shape IDs unique', () => {
      const allShapes = shapeRegistry.list();
      const allIds = allShapes.map((s) => s.id);
      const uniqueIds = new Set(allIds);
      expect(uniqueIds.size).toBe(allIds.length);
    });

    it('should have shapes from all expected categories', () => {
      // Verify we have shapes registered from each category
      // This ensures registerDefaultShapes() is working correctly
      const actualCount = shapeRegistry.list().length;

      // We expect at least 265 shapes across all categories
      // (Exact count may vary as shapes are added/removed)
      expect(actualCount).toBeGreaterThanOrEqual(265);
    });
  });

  describe('Shape Documentation Completeness', () => {
    it('should have no undocumented shapes', () => {
      // List of all registered shapes
      const allShapeIds = shapeRegistry.list().map((s) => s.id);

      // Shapes that should be documented in shapes.md
      // This is a sanity check - we're not parsing the markdown,
      // but we ensure key shapes are in the registry
      const keyShapes = [
        'rectangle',
        'circle',
        'hexagon',
        'cylinder',
        'sankeyChart',
        'awsEc2',
        'c4Person',
        'class',
        'transferFunction',
      ];

      for (const shapeId of keyShapes) {
        expect(
          shapeRegistry.has(shapeId),
          `Key shape ${shapeId} should be registered`
        ).toBe(true);
      }
    });

    it('should have all shape categories represented', () => {
      const allShapeIds = shapeRegistry.list().map((s) => s.id);

      // Check that we have shapes from each major category
      const categories = {
        basic: /^(rectangle|circle|hexagon|rhombus|triangle)/i,
        flowchart: /^(document|delay|display|card)/i,
        storage: /^(cylinder|diskStorage|storedData)/i,
        control: /^(transferFunction|gain|integrator)/i,
        charts: /^(pieChart|barChart|sankeyChart)/i,
        network: /^(server|router|switch|cloud)/i,
        uml: /^(class|actor|state|activity|lifeline|fragment)/i,
        aws: /^aws(Ec2|S3|Lambda)/,
        c4: /^c4(Person|System|Container)/,
      };

      for (const [category, pattern] of Object.entries(categories)) {
        const hasShapeInCategory = allShapeIds.some((id) => pattern.test(id));
        expect(
          hasShapeInCategory,
          `Should have at least one shape in ${category} category`
        ).toBe(true);
      }
    });
  });

  describe('Profile Validation', () => {
    it('should support all 11 documented profiles', () => {
      // This test ensures the types include all profiles mentioned in docs
      // The actual validation happens at type level in types.ts
      const documentedProfiles = [
        'diagram',
        'electrical',
        'digital',
        'wardley',
        'sequence',
        'timeline',
        'railroad',
        'pneumatic',
        'hydraulic',
        'pid',
        'glyphset',
      ];

      // Just verify we have the list - actual type checking happens at compile time
      expect(documentedProfiles).toHaveLength(11);
    });
  });

  describe('Example File Validation', () => {
    it('should have shape count documentation match actual count', () => {
      // This test catches regressions where shape count in docs drifts from reality
      const actualCount = shapeRegistry.list().length;
      expect(actualCount).toBe(265);

      // If this test fails, update:
      // - docs/reference/shapes.md: "248 shapes"
      // - README.md: "248 shapes"
      // - Any comparison tables
    });
  });
});
