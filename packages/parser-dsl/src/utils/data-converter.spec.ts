import { describe, expect, it } from 'vitest';
import * as Langium from '../generated/ast.js';
import { convertDataProperty } from './data-converter.js';

describe('data-converter', () => {
  describe('convertDataProperty', () => {
    describe('Number Arrays', () => {
      it('should convert array of numbers', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [
            { $type: 'DataValue', value: '10' },
            { $type: 'DataValue', value: '20' },
            { $type: 'DataValue', value: '30' },
          ],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result).toEqual({ values: [10, 20, 30] });
      });

      it('should handle decimal numbers', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [
            { $type: 'DataValue', value: '1.5' },
            { $type: 'DataValue', value: '2.7' },
            { $type: 'DataValue', value: '3.14' },
          ],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result).toEqual({ values: [1.5, 2.7, 3.14] });
      });

      it('should handle negative numbers', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [
            { $type: 'DataValue', value: '-10' },
            { $type: 'DataValue', value: '0' },
            { $type: 'DataValue', value: '10' },
          ],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result).toEqual({ values: [-10, 0, 10] });
      });

      it('should handle single number', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [{ $type: 'DataValue', value: '42' }],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result).toEqual({ values: [42] });
      });

      it('should handle empty array', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result).toEqual({ values: [] });
      });
    });

    describe('Object Arrays', () => {
      it('should convert array of objects with string properties', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [
            {
              $type: 'DataObject',
              properties: [
                { key: 'name', value: '"Alice"' },
                { key: 'age', value: '30' },
              ],
            },
            {
              $type: 'DataObject',
              properties: [
                { key: 'name', value: '"Bob"' },
                { key: 'age', value: '25' },
              ],
            },
          ],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result).toEqual({
          values: [
            { name: 'Alice', age: 30 },
            { name: 'Bob', age: 25 },
          ],
        });
      });

      it('should remove quotes from string values', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [
            {
              $type: 'DataObject',
              properties: [
                { key: 'city', value: '"New York"' },
                { key: 'country', value: '"USA"' },
              ],
            },
          ],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result).toEqual({
          values: [{ city: 'New York', country: 'USA' }],
        });
      });

      it('should detect numeric strings as numbers', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [
            {
              $type: 'DataObject',
              properties: [
                { key: 'id', value: '"123"' },
                { key: 'score', value: '456' },
              ],
            },
          ],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result.values[0]).toEqual({ id: 123, score: 456 });
      });

      it('should handle mixed type properties', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [
            {
              $type: 'DataObject',
              properties: [
                { key: 'name', value: '"Product"' },
                { key: 'price', value: '99.99' },
                { key: 'inStock', value: 'true' },
              ],
            },
          ],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result.values[0]).toHaveProperty('name', 'Product');
        expect(result.values[0]).toHaveProperty('price', 99.99);
      });

      it('should handle empty object', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [
            {
              $type: 'DataObject',
              properties: [],
            },
          ],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result).toEqual({ values: [{}] });
      });
    });

    describe('Nested Arrays in Objects', () => {
      it('should convert DataArray properties to number arrays', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [
            {
              $type: 'DataObject',
              properties: [
                { key: 'name', value: '"Series A"' },
                {
                  key: 'values',
                  value: {
                    $type: 'DataArray',
                    items: ['10', '20', '30'],
                  },
                },
              ],
            },
          ],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result).toEqual({
          values: [{ name: 'Series A', values: [10, 20, 30] }],
        });
      });

      it('should handle multiple arrays in one object', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [
            {
              $type: 'DataObject',
              properties: [
                { key: 'name', value: '"Dataset"' },
                {
                  key: 'x',
                  value: {
                    $type: 'DataArray',
                    items: ['1', '2', '3'],
                  },
                },
                {
                  key: 'y',
                  value: {
                    $type: 'DataArray',
                    items: ['10', '20', '30'],
                  },
                },
              ],
            },
          ],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result).toEqual({
          values: [
            {
              name: 'Dataset',
              x: [1, 2, 3],
              y: [10, 20, 30],
            },
          ],
        });
      });

      it('should handle decimal numbers in arrays', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [
            {
              $type: 'DataObject',
              properties: [
                {
                  key: 'measurements',
                  value: {
                    $type: 'DataArray',
                    items: ['1.5', '2.7', '3.14'],
                  },
                },
              ],
            },
          ],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result.values[0]).toEqual({
          measurements: [1.5, 2.7, 3.14],
        });
      });

      it('should handle empty nested arrays', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [
            {
              $type: 'DataObject',
              properties: [
                { key: 'name', value: '"Empty"' },
                {
                  key: 'values',
                  value: {
                    $type: 'DataArray',
                    items: [],
                  },
                },
              ],
            },
          ],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result).toEqual({
          values: [{ name: 'Empty', values: [] }],
        });
      });
    });

    describe('Mixed Arrays (Objects and Numbers)', () => {
      it('should handle objects and numbers in same array', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [
            { $type: 'DataValue', value: '100' },
            {
              $type: 'DataObject',
              properties: [{ key: 'x', value: '10' }],
            },
            { $type: 'DataValue', value: '200' },
          ],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result.values).toHaveLength(3);
        expect(result.values[0]).toBe(100);
        expect(result.values[1]).toEqual({ x: 10 });
        expect(result.values[2]).toBe(200);
      });

      it('should handle multiple objects', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [
            {
              $type: 'DataObject',
              properties: [{ key: 'a', value: '1' }],
            },
            {
              $type: 'DataObject',
              properties: [{ key: 'b', value: '2' }],
            },
          ],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result).toEqual({
          values: [{ a: 1 }, { b: 2 }],
        });
      });
    });

    describe('String Type Detection', () => {
      it('should detect pure numeric strings as numbers', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [
            {
              $type: 'DataObject',
              properties: [{ key: 'value', value: '"123"' }],
            },
          ],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result.values[0].value).toBe(123);
        expect(typeof result.values[0].value).toBe('number');
      });

      it('should keep non-numeric strings as strings', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [
            {
              $type: 'DataObject',
              properties: [{ key: 'name', value: '"abc123"' }],
            },
          ],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result.values[0].name).toBe('abc123');
        expect(typeof result.values[0].name).toBe('string');
      });

      it('should detect decimal strings as numbers', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [
            {
              $type: 'DataObject',
              properties: [{ key: 'rate', value: '"0.5"' }],
            },
          ],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result.values[0].rate).toBe(0.5);
        expect(typeof result.values[0].rate).toBe('number');
      });

      it('should handle string that starts with number', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [
            {
              $type: 'DataObject',
              properties: [{ key: 'code', value: '"123abc"' }],
            },
          ],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(typeof result.values[0].code).toBe('string');
      });
    });

    describe('Edge Cases', () => {
      it('should handle zero values', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [{ $type: 'DataValue', value: '0' }],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result).toEqual({ values: [0] });
      });

      it('should handle very large numbers', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [{ $type: 'DataValue', value: '999999999' }],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result).toEqual({ values: [999999999] });
      });

      it('should handle scientific notation', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [{ $type: 'DataValue', value: '1e5' }],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result).toEqual({ values: [100000] });
      });

      it('should handle special characters in string values', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [
            {
              $type: 'DataObject',
              properties: [{ key: 'email', value: '"user@example.com"' }],
            },
          ],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result.values[0].email).toBe('user@example.com');
      });
    });

    describe('Real-world Chart Data Scenarios', () => {
      it('should convert line chart data', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [
            {
              $type: 'DataObject',
              properties: [
                { key: 'label', value: '"Sales"' },
                {
                  key: 'data',
                  value: {
                    $type: 'DataArray',
                    items: ['100', '150', '200', '180'],
                  },
                },
              ],
            },
          ],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result.values[0]).toEqual({
          label: 'Sales',
          data: [100, 150, 200, 180],
        });
      });

      it('should convert bar chart data with multiple series', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [
            {
              $type: 'DataObject',
              properties: [
                { key: 'name', value: '"Q1"' },
                { key: 'revenue', value: '1000' },
                { key: 'expenses', value: '800' },
              ],
            },
            {
              $type: 'DataObject',
              properties: [
                { key: 'name', value: '"Q2"' },
                { key: 'revenue', value: '1200' },
                { key: 'expenses', value: '900' },
              ],
            },
          ],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result.values).toEqual([
          { name: 'Q1', revenue: 1000, expenses: 800 },
          { name: 'Q2', revenue: 1200, expenses: 900 },
        ]);
      });

      it('should convert scatter plot data', () => {
        const prop: Langium.DataProperty = {
          key: 'data',
          items: [
            {
              $type: 'DataObject',
              properties: [
                { key: 'x', value: '10' },
                { key: 'y', value: '20' },
              ],
            },
            {
              $type: 'DataObject',
              properties: [
                { key: 'x', value: '15' },
                { key: 'y', value: '25' },
              ],
            },
          ],
          $type: 'DataProperty',
        };

        const result = convertDataProperty(prop);
        expect(result.values).toEqual([
          { x: 10, y: 20 },
          { x: 15, y: 25 },
        ]);
      });
    });
  });
});
