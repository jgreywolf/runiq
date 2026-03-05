import { describe, it, expect, beforeEach } from 'vitest';
import { shapeRegistry } from './registries.js';
import { registerDefaultShapes } from './shapes/index.js';
import { getAliasMap } from './shape-aliases.js';

describe('Shape Alias System', () => {
  beforeEach(() => {
    // Reset registry before each test
    const registry = shapeRegistry as any;
    registry.shapes.clear();
    registry.aliases.clear();
    registerDefaultShapes();
  });

  describe('Basic Aliases', () => {
    it('should resolve "rect" to rectangle shape', () => {
      const shape = shapeRegistry.get('rect');
      expect(shape).toBeDefined();
      expect(shape?.id).toBe('rectangle');
    });

    it('should resolve "box" to rectangle shape', () => {
      const shape = shapeRegistry.get('box');
      expect(shape).toBeDefined();
      expect(shape?.id).toBe('rectangle');
    });

    it('should resolve "diamond" to rhombus shape', () => {
      const shape = shapeRegistry.get('diamond');
      expect(shape).toBeDefined();
      expect(shape?.id).toBe('rhombus');
    });

    it('should resolve "decision" to rhombus shape', () => {
      const shape = shapeRegistry.get('decision');
      expect(shape).toBeDefined();
      expect(shape?.id).toBe('rhombus');
    });

    it('should resolve "rounded" to roundedRectangle shape', () => {
      const shape = shapeRegistry.get('rounded');
      expect(shape).toBeDefined();
      expect(shape?.id).toBe('roundedRectangle');
    });
  });

  describe('Database/Storage Aliases', () => {
    it('should resolve "db" to cylinder shape', () => {
      const shape = shapeRegistry.get('db');
      expect(shape).toBeDefined();
      expect(shape?.id).toBe('cylinder');
    });

    it('should resolve "database" to cylinder shape', () => {
      const shape = shapeRegistry.get('database');
      expect(shape).toBeDefined();
      expect(shape?.id).toBe('cylinder');
    });

    it('should resolve "disk" to diskStorage shape', () => {
      const shape = shapeRegistry.get('disk');
      expect(shape).toBeDefined();
      expect(shape?.id).toBe('diskStorage');
    });
  });

  describe('Network/Cloud Aliases', () => {
    it('should resolve "api" to server shape', () => {
      const shape = shapeRegistry.get('api');
      expect(shape).toBeDefined();
      expect(shape?.id).toBe('server');
    });

    it('should resolve "browser" to display shape', () => {
      const shape = shapeRegistry.get('browser');
      expect(shape).toBeDefined();
      expect(shape?.id).toBe('display');
    });
  });

  describe('AWS Aliases', () => {
    it('should resolve "s3" to awsS3 shape', () => {
      const shape = shapeRegistry.get('s3');
      expect(shape).toBeDefined();
      expect(shape?.id).toBe('awsS3');
    });

    it('should resolve "lambda" to awsLambda shape', () => {
      const shape = shapeRegistry.get('lambda');
      expect(shape).toBeDefined();
      expect(shape?.id).toBe('awsLambda');
    });

    it('should resolve "rds" to awsRds shape', () => {
      const shape = shapeRegistry.get('rds');
      expect(shape).toBeDefined();
      expect(shape?.id).toBe('awsRds');
    });
  });

  describe('Flowchart Aliases', () => {
    it('should resolve "process" to rectangle shape', () => {
      const shape = shapeRegistry.get('process');
      expect(shape).toBeDefined();
      expect(shape?.id).toBe('rectangle');
    });

    it('should resolve "start" to stadium shape', () => {
      const shape = shapeRegistry.get('start');
      expect(shape).toBeDefined();
      expect(shape?.id).toBe('stadium');
    });

    it('should resolve "doc" to document shape', () => {
      const shape = shapeRegistry.get('doc');
      expect(shape).toBeDefined();
      expect(shape?.id).toBe('document');
    });
  });

  describe('UML Aliases', () => {
    it('should resolve "class" to class shape', () => {
      const shape = shapeRegistry.get('class');
      expect(shape).toBeDefined();
      expect(shape?.id).toBe('class');
    });

    it('should resolve "actor" to user shape', () => {
      const shape = shapeRegistry.get('actor');
      expect(shape).toBeDefined();
      expect(shape?.id).toBe('user');
    });
  });

  describe('Registry Methods', () => {
    it('should check if alias exists with has()', () => {
      expect(shapeRegistry.has('rect')).toBe(true);
      expect(shapeRegistry.has('database')).toBe(true);
      expect(shapeRegistry.has('nonexistent')).toBe(false);
    });

    it('should resolve alias to canonical ID', () => {
      expect(shapeRegistry.resolveAlias('rect')).toBe('rectangle');
      expect(shapeRegistry.resolveAlias('database')).toBe('cylinder');
      expect(shapeRegistry.resolveAlias('rectangle')).toBe('rectangle'); // Already canonical
    });

    it('should get all aliases for a shape', () => {
      const aliases = shapeRegistry.getAliases('rectangle');
      expect(aliases).toContain('rect');
      expect(aliases).toContain('process');
      expect(aliases).toContain('box');
    });

    it('should list all identifiers including aliases', () => {
      const identifiers = shapeRegistry.listAllIdentifiers();
      expect(identifiers).toContain('rectangle');
      expect(identifiers).toContain('rect');
      expect(identifiers).toContain('box');
      expect(identifiers).toContain('database');
      expect(identifiers).toContain('cylinder');
    });
  });

  describe('Alias Map', () => {
    it('should generate alias map for documentation', () => {
      const aliasMap = getAliasMap();
      expect(aliasMap.size).toBeGreaterThan(0);

      const rectangleAliases = aliasMap.get('rectangle');
      expect(rectangleAliases).toBeDefined();
      expect(rectangleAliases).toContain('rect');
    });
  });

  describe('Error Handling', () => {
    it('should throw error when registering alias for non-existent shape', () => {
      expect(() => {
        shapeRegistry.registerAlias('fake-alias', 'non-existent-shape');
      }).toThrow(
        'Cannot create alias "fake-alias" for unknown shape "non-existent-shape"'
      );
    });

    it('should return undefined for unknown alias', () => {
      const shape = shapeRegistry.get('totally-fake-alias');
      expect(shape).toBeUndefined();
    });
  });

  describe('Backwards Compatibility', () => {
    it('should still work with direct shape IDs', () => {
      const shape = shapeRegistry.get('rectangle');
      expect(shape).toBeDefined();
      expect(shape?.id).toBe('rectangle');
    });

    it('should work with original camelCase IDs', () => {
      const shape = shapeRegistry.get('roundedRectangle');
      expect(shape).toBeDefined();
      expect(shape?.id).toBe('roundedRectangle');
    });
  });
});
