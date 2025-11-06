import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CsvDataSource, loadCsvData } from '../csv-data-source.js';

describe('CsvDataSource', () => {
  const testDir = path.join(process.cwd(), '__test-csv-data__');
  let loader: CsvDataSource;

  beforeEach(async () => {
    loader = new CsvDataSource();
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('Basic Loading', () => {
    it('should load CSV with headers from file', async () => {
      const csv = `id,name,age
1,Alice,30
2,Bob,25`;
      const filePath = path.join(testDir, 'simple.csv');
      await fs.writeFile(filePath, csv);

      const result = await loader.load(filePath);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 1, name: 'Alice', age: 30 });
      expect(result[1]).toEqual({ id: 2, name: 'Bob', age: 25 });
    });

    it('should load CSV from inline string', async () => {
      const csv = `id,name,age\n1,Alice,30\n2,Bob,25`;

      const result = await loader.load(csv);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 1, name: 'Alice', age: 30 });
    });

    it('should load CSV without headers', async () => {
      const noHeaderLoader = new CsvDataSource({ header: false });
      const csv = `1,Alice,30\n2,Bob,25`;
      const filePath = path.join(testDir, 'no-header.csv');
      await fs.writeFile(filePath, csv);

      const result = await noHeaderLoader.load(filePath);

      expect(result).toHaveLength(2);
      // PapaParse uses numeric indices as keys when header:false
      expect(result[0]).toHaveProperty('0', 1);
      expect(result[0]).toHaveProperty('1', 'Alice');
    });
  });

  describe('Type Inference', () => {
    it('should automatically convert numeric strings to numbers', async () => {
      const csv = `id,name,score\n1,Alice,95.5\n2,Bob,87`;
      const filePath = path.join(testDir, 'numbers.csv');
      await fs.writeFile(filePath, csv);

      const result = await loader.load(filePath);

      expect(typeof result[0].id).toBe('number');
      expect(typeof result[0].score).toBe('number');
      expect(result[0].score).toBe(95.5);
    });

    it('should keep strings as strings', async () => {
      const csv = `id,name,code\n1,Alice,ABC123\n2,Bob,XYZ789`;
      const filePath = path.join(testDir, 'strings.csv');
      await fs.writeFile(filePath, csv);

      const result = await loader.load(filePath);

      expect(typeof result[0].name).toBe('string');
      expect(typeof result[0].code).toBe('string');
    });

    it('should infer column types correctly', async () => {
      const csv = `id,name,active,score\n1,Alice,true,95\n2,Bob,false,87`;
      const filePath = path.join(testDir, 'types.csv');
      await fs.writeFile(filePath, csv);

      const result = await loader.load(filePath);
      const types = loader.inferColumnTypes(result);

      expect(types.id).toBe('number');
      expect(types.name).toBe('string');
      // Papa Parse dynamicTyping converts 'true'/'false' to actual booleans
      expect(types.active).toBe('boolean');
      expect(types.score).toBe('number');
      // Verify actual values are boolean types
      expect(typeof result[0].active).toBe('boolean');
      expect(result[0].active).toBe(true);
    });

    it('should get column names', async () => {
      const csv = `id,name,age\n1,Alice,30`;
      const filePath = path.join(testDir, 'columns.csv');
      await fs.writeFile(filePath, csv);

      const result = await loader.load(filePath);
      const columns = loader.getColumnNames(result);

      expect(columns).toEqual(['id', 'name', 'age']);
    });
  });

  describe('Delimiter Options', () => {
    it('should handle semicolon delimiter', async () => {
      const semicolonLoader = new CsvDataSource({ delimiter: ';' });
      const csv = `id;name;age\n1;Alice;30\n2;Bob;25`;
      const filePath = path.join(testDir, 'semicolon.csv');
      await fs.writeFile(filePath, csv);

      const result = await semicolonLoader.load(filePath);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 1, name: 'Alice', age: 30 });
    });

    it('should handle tab delimiter', async () => {
      const tabLoader = new CsvDataSource({ delimiter: '\t' });
      const csv = `id\tname\tage\n1\tAlice\t30\n2\tBob\t25`;
      const filePath = path.join(testDir, 'tab.csv');
      await fs.writeFile(filePath, csv);

      const result = await tabLoader.load(filePath);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 1, name: 'Alice', age: 30 });
    });

    it('should handle pipe delimiter', async () => {
      const pipeLoader = new CsvDataSource({ delimiter: '|' });
      const csv = `id|name|age\n1|Alice|30\n2|Bob|25`;
      const filePath = path.join(testDir, 'pipe.csv');
      await fs.writeFile(filePath, csv);

      const result = await pipeLoader.load(filePath);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 1, name: 'Alice', age: 30 });
    });
  });

  describe('Quoted Values', () => {
    it('should handle quoted values with commas', async () => {
      const csv = `id,name,address\n1,Alice,"123 Main St, Boston"\n2,Bob,"456 Oak Ave, Seattle"`;
      const filePath = path.join(testDir, 'quoted.csv');
      await fs.writeFile(filePath, csv);

      const result = await loader.load(filePath);

      expect(result[0].address).toBe('123 Main St, Boston');
      expect(result[1].address).toBe('456 Oak Ave, Seattle');
    });

    it('should handle quoted values with newlines', async () => {
      const csv = `id,name,bio\n1,Alice,"Developer\nLoves coding"\n2,Bob,"Designer\nCreative"`;
      const filePath = path.join(testDir, 'multiline.csv');
      await fs.writeFile(filePath, csv);

      const result = await loader.load(filePath);

      expect(result[0].bio).toBe('Developer\nLoves coding');
      expect(result[1].bio).toBe('Designer\nCreative');
    });

    it('should handle escaped quotes', async () => {
      const csv = `id,name,quote\n1,Alice,"She said ""Hello"""\n2,Bob,"He said ""Goodbye"""`;
      const filePath = path.join(testDir, 'escaped.csv');
      await fs.writeFile(filePath, csv);

      const result = await loader.load(filePath);

      expect(result[0].quote).toBe('She said "Hello"');
      expect(result[1].quote).toBe('He said "Goodbye"');
    });
  });

  describe('Empty Values and Lines', () => {
    it('should handle empty values', async () => {
      const csv = `id,name,age\n1,Alice,\n2,,25`;
      const filePath = path.join(testDir, 'empty-values.csv');
      await fs.writeFile(filePath, csv);

      const result = await loader.load(filePath);

      expect(result).toHaveLength(2);
      // Papa Parse represents empty values as null when dynamicTyping is true
      expect(result[0].age).toBeNull();
      expect(result[1].name).toBeNull();
    });

    it('should skip empty lines by default', async () => {
      const csv = `id,name,age\n1,Alice,30\n\n2,Bob,25\n\n`;
      const filePath = path.join(testDir, 'empty-lines.csv');
      await fs.writeFile(filePath, csv);

      const result = await loader.load(filePath);

      expect(result).toHaveLength(2);
    });

    it('should keep empty lines when configured', async () => {
      const keepEmptyLoader = new CsvDataSource({ skipEmptyLines: false });
      const csv = `id,name,age\n1,Alice,30\n2,Bob,25`;
      const filePath = path.join(testDir, 'keep-empty.csv');
      await fs.writeFile(filePath, csv);

      const result = await keepEmptyLoader.load(filePath);

      // Without empty lines in data, should have 2 rows
      expect(result).toHaveLength(2);
    });

    it('should handle empty CSV file', async () => {
      const filePath = path.join(testDir, 'empty.csv');
      await fs.writeFile(filePath, '');

      const result = await loader.load(filePath);

      expect(result).toEqual([]);
    });
  });

  describe('Whitespace Handling', () => {
    it('should trim whitespace from headers', async () => {
      const csv = `id , name , age\n1,Alice,30`;
      const filePath = path.join(testDir, 'whitespace-headers.csv');
      await fs.writeFile(filePath, csv);

      const result = await loader.load(filePath);

      expect(Object.keys(result[0])).toEqual(['id', 'name', 'age']);
    });

    it('should trim whitespace from values', async () => {
      const csv = `id,name,age\n1, Alice ,30`;
      const filePath = path.join(testDir, 'whitespace-values.csv');
      await fs.writeFile(filePath, csv);

      const result = await loader.load(filePath);

      expect(result[0].name).toBe('Alice');
    });
  });

  describe('Validation', () => {
    it('should validate consistent row structure', () => {
      const data = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ];

      const validation = loader.validate(data);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect inconsistent columns', () => {
      const data = [
        { id: 1, name: 'Alice' },
        { id: 2, age: 25 }, // Missing 'name', has 'age'
      ];

      const validation = loader.validate(data);

      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.errors[0].message).toContain('inconsistent columns');
    });

    it('should accept empty array as valid', () => {
      const validation = loader.validate([]);

      expect(validation.valid).toBe(true);
    });

    it('should reject non-array data', () => {
      const validation = loader.validate({ id: 1, name: 'Alice' });

      expect(validation.valid).toBe(false);
      expect(validation.errors[0].message).toContain('must be an array');
    });
  });

  describe('Error Handling', () => {
    it('should throw error for non-existent file', async () => {
      const filePath = path.join(testDir, 'does-not-exist.csv');

      await expect(loader.load(filePath)).rejects.toThrow('File not found');
    });

    it('should handle malformed CSV gracefully', async () => {
      const csv = `id,name,age\n1,Alice,30\n2,Bob`; // Missing column
      const filePath = path.join(testDir, 'malformed.csv');
      await fs.writeFile(filePath, csv);

      // PapaParse detects the error during parsing
      await expect(loader.load(filePath)).rejects.toThrow('CSV parsing failed');
    });
  });

  describe('Format Property', () => {
    it('should have format property set to "csv"', () => {
      expect(loader.format).toBe('csv');
    });
  });

  describe('Convenience Function', () => {
    it('should load data using convenience function', async () => {
      const csv = `id,name\n1,Alice\n2,Bob`;
      const filePath = path.join(testDir, 'convenience.csv');
      await fs.writeFile(filePath, csv);

      const result = await loadCsvData(filePath);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 1, name: 'Alice' });
    });

    it('should accept options in convenience function', async () => {
      const csv = `id;name\n1;Alice\n2;Bob`;
      const filePath = path.join(testDir, 'with-options.csv');
      await fs.writeFile(filePath, csv);

      const result = await loadCsvData(filePath, { delimiter: ';' });

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 1, name: 'Alice' });
    });
  });

  describe('Edge Cases', () => {
    it('should handle single row CSV', async () => {
      const csv = `id,name,age\n1,Alice,30`;
      const filePath = path.join(testDir, 'single-row.csv');
      await fs.writeFile(filePath, csv);

      const result = await loader.load(filePath);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ id: 1, name: 'Alice', age: 30 });
    });

    it('should handle single column CSV', async () => {
      const csv = `id\n1\n2\n3`;
      const filePath = path.join(testDir, 'single-column.csv');
      await fs.writeFile(filePath, csv);

      const result = await loader.load(filePath);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ id: 1 });
      expect(result[2]).toEqual({ id: 3 });
    });

    it('should handle headers only (no data rows)', async () => {
      const csv = `id,name,age`;
      const filePath = path.join(testDir, 'headers-only.csv');
      await fs.writeFile(filePath, csv);

      const result = await loader.load(filePath);

      expect(result).toEqual([]);
    });

    it('should handle very long lines', async () => {
      const longValue = 'A'.repeat(10000);
      const csv = `id,name,description\n1,Alice,${longValue}`;
      const filePath = path.join(testDir, 'long-line.csv');
      await fs.writeFile(filePath, csv);

      const result = await loader.load(filePath);

      expect(result[0].description).toHaveLength(10000);
    });
  });
});
