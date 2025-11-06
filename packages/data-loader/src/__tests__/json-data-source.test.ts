import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import { JsonDataSource, loadJsonData } from '../json-data-source.js';
import type { DataObject } from '../types.js';

describe('JsonDataSource', () => {
  const testDir = path.join(process.cwd(), '__test-data__');
  let loader: JsonDataSource;

  beforeEach(async () => {
    loader = new JsonDataSource();
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('Basic Loading', () => {
    it('should load array of objects from file', async () => {
      const data = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ];
      const filePath = path.join(testDir, 'array.json');
      await fs.writeFile(filePath, JSON.stringify(data));

      const result = await loader.load(filePath);

      expect(result).toEqual(data);
      expect(result).toHaveLength(2);
    });

    it('should load single object from file', async () => {
      const data = { id: 1, name: 'Alice', age: 30 };
      const filePath = path.join(testDir, 'object.json');
      await fs.writeFile(filePath, JSON.stringify(data));

      const result = await loader.load(filePath);

      expect(result).toEqual([data]);
      expect(result).toHaveLength(1);
    });

    it('should load inline JSON string (array)', async () => {
      const jsonString = '[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]';

      const result = await loader.load(jsonString);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 1, name: 'Alice' });
    });

    it('should load inline JSON string (object)', async () => {
      const jsonString = '{"id":1,"name":"Alice"}';

      const result = await loader.load(jsonString);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ id: 1, name: 'Alice' });
    });
  });

  describe('Nested Data Extraction', () => {
    it('should extract array from "data" property', async () => {
      const wrapper = {
        metadata: { version: '1.0' },
        data: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ],
      };
      const filePath = path.join(testDir, 'wrapped-data.json');
      await fs.writeFile(filePath, JSON.stringify(wrapper));

      const result = await loader.load(filePath);

      expect(result).toEqual(wrapper.data);
      expect(result).toHaveLength(2);
    });

    it('should extract array from "items" property', async () => {
      const wrapper = {
        total: 3,
        items: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
          { id: 3, name: 'Charlie' },
        ],
      };
      const filePath = path.join(testDir, 'wrapped-items.json');
      await fs.writeFile(filePath, JSON.stringify(wrapper));

      const result = await loader.load(filePath);

      expect(result).toEqual(wrapper.items);
      expect(result).toHaveLength(3);
    });

    it('should extract array from "records" property', async () => {
      const wrapper = {
        records: [{ id: 1 }, { id: 2 }],
      };
      const filePath = path.join(testDir, 'wrapped-records.json');
      await fs.writeFile(filePath, JSON.stringify(wrapper));

      const result = await loader.load(filePath);

      expect(result).toEqual(wrapper.records);
    });

    it('should extract array from "rows" property', async () => {
      const wrapper = {
        rows: [{ id: 1 }, { id: 2 }],
      };
      const filePath = path.join(testDir, 'wrapped-rows.json');
      await fs.writeFile(filePath, JSON.stringify(wrapper));

      const result = await loader.load(filePath);

      expect(result).toEqual(wrapper.rows);
    });
  });

  describe('Hierarchical/Nested Data', () => {
    it('should load deeply nested objects', async () => {
      const data = {
        level1: {
          level2: {
            level3: {
              value: 'deep',
            },
          },
        },
      };
      const filePath = path.join(testDir, 'nested.json');
      await fs.writeFile(filePath, JSON.stringify(data));

      const result = await loader.load(filePath);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(data);
    });

    it('should load array with nested objects', async () => {
      const data = [
        {
          id: 1,
          address: {
            street: '123 Main St',
            city: 'Boston',
            coordinates: { lat: 42.36, lon: -71.06 },
          },
        },
        {
          id: 2,
          address: {
            street: '456 Oak Ave',
            city: 'Seattle',
            coordinates: { lat: 47.61, lon: -122.33 },
          },
        },
      ];
      const filePath = path.join(testDir, 'nested-array.json');
      await fs.writeFile(filePath, JSON.stringify(data));

      const result = await loader.load(filePath);

      expect(result).toEqual(data);
      expect(result[0].address).toBeDefined();
      expect((result[0].address as any).coordinates).toBeDefined();
    });
  });

  describe('Validation', () => {
    it('should validate valid data', () => {
      const data = { id: 1, name: 'Alice' };

      const validation = loader.validate(data);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should reject null data', () => {
      const validation = loader.validate(null);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toHaveLength(1);
      expect(validation.errors[0].message).toContain('null or undefined');
    });

    it('should reject undefined data', () => {
      const validation = loader.validate(undefined);

      expect(validation.valid).toBe(false);
      expect(validation.errors[0].message).toContain('null or undefined');
    });

    it('should detect excessive nesting depth', () => {
      const shallowLoader = new JsonDataSource({ maxDepth: 2 });

      // Create nested object: level 0 > 1 > 2 > 3
      const deepData = {
        a: {
          b: {
            c: {
              value: 'too deep',
            },
          },
        },
      };

      const validation = shallowLoader.validate(deepData);

      expect(validation.valid).toBe(false);
      expect(validation.errors.some((e) => e.message.includes('Nesting depth'))).toBe(true);
    });

    it('should detect circular references', () => {
      const circular: any = { name: 'node' };
      circular.self = circular;

      const validation = loader.validate(circular);

      expect(validation.valid).toBe(false);
      expect(validation.errors.some((e) => e.message.includes('Circular reference'))).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should throw error for non-existent file', async () => {
      const filePath = path.join(testDir, 'does-not-exist.json');

      await expect(loader.load(filePath)).rejects.toThrow('File not found');
    });

    it('should throw error for malformed JSON file', async () => {
      const filePath = path.join(testDir, 'malformed.json');
      await fs.writeFile(filePath, '{ invalid json }');

      await expect(loader.load(filePath)).rejects.toThrow('Invalid JSON');
    });

    it('should throw error for malformed inline JSON', async () => {
      const invalidJson = '{ "name": "Alice", }'; // Trailing comma

      await expect(loader.load(invalidJson)).rejects.toThrow();
    });

    it('should throw validation error when validateOnLoad is true', async () => {
      const validatingLoader = new JsonDataSource({ validateOnLoad: true });
      const filePath = path.join(testDir, 'null-data.json');
      await fs.writeFile(filePath, 'null');

      await expect(validatingLoader.load(filePath)).rejects.toThrow('JSON validation failed');
    });
  });

  describe('Options', () => {
    it('should allow loading without validation when disabled', async () => {
      const noValidationLoader = new JsonDataSource({ validateOnLoad: false });
      const filePath = path.join(testDir, 'null.json');
      await fs.writeFile(filePath, 'null');

      // Should not throw even though data is null
      const result = await noValidationLoader.load(filePath);

      expect(result).toEqual([{ value: null }]);
    });

    it('should use custom maxDepth option', () => {
      const loader = new JsonDataSource({ maxDepth: 5 });

      // 6 levels deep
      const deepData = { l1: { l2: { l3: { l4: { l5: { l6: 'value' } } } } } };

      const validation = loader.validate(deepData);

      expect(validation.valid).toBe(false);
    });
  });

  describe('Format Property', () => {
    it('should have format property set to "json"', () => {
      expect(loader.format).toBe('json');
    });
  });

  describe('Convenience Function', () => {
    it('should load data using convenience function', async () => {
      const data = [{ id: 1 }, { id: 2 }];
      const filePath = path.join(testDir, 'convenience.json');
      await fs.writeFile(filePath, JSON.stringify(data));

      const result = await loadJsonData(filePath);

      expect(result).toEqual(data);
    });

    it('should accept options in convenience function', async () => {
      const data = [{ id: 1 }];
      const filePath = path.join(testDir, 'with-options.json');
      await fs.writeFile(filePath, JSON.stringify(data));

      const result = await loadJsonData(filePath, { maxDepth: 5 });

      expect(result).toEqual(data);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty array', async () => {
      const filePath = path.join(testDir, 'empty-array.json');
      await fs.writeFile(filePath, '[]');

      const result = await loader.load(filePath);

      expect(result).toEqual([]);
    });

    it('should handle empty object', async () => {
      const filePath = path.join(testDir, 'empty-object.json');
      await fs.writeFile(filePath, '{}');

      const result = await loader.load(filePath);

      expect(result).toEqual([{}]);
    });

    it('should wrap primitive values', async () => {
      const filePath = path.join(testDir, 'primitive.json');
      await fs.writeFile(filePath, '42');

      const result = await loader.load(filePath);

      expect(result).toEqual([{ value: 42 }]);
    });

    it('should handle string primitive', async () => {
      const filePath = path.join(testDir, 'string.json');
      await fs.writeFile(filePath, '"hello"');

      const result = await loader.load(filePath);

      expect(result).toEqual([{ value: 'hello' }]);
    });

    it('should handle boolean primitive', async () => {
      const filePath = path.join(testDir, 'boolean.json');
      await fs.writeFile(filePath, 'true');

      const result = await loader.load(filePath);

      expect(result).toEqual([{ value: true }]);
    });
  });
});
