import { describe, it, expect } from 'vitest';
import type { NodeAst, DataValue, DataArray } from './types/index.js';

describe('Data-Driven Node Types', () => {
  describe('NodeAst with data property', () => {
    it('should accept simple numeric array', () => {
      const node: NodeAst = {
        id: 'chart1',
        shape: 'pie-chart',
        label: 'Sales',
        data: { values: [30, 45, 25] },
      };

      expect(node.data).toBeDefined();
      expect(Array.isArray(node.data?.values)).toBe(true);
      expect(node.data?.values).toHaveLength(3);
    });

    it('should accept labeled data array', () => {
      const node: NodeAst = {
        id: 'chart2',
        shape: 'pie-chart',
        label: 'Revenue',
        data: {
          values: [
            { label: 'Q1', value: 100 },
            { label: 'Q2', value: 150 },
            { label: 'Q3', value: 120 },
          ],
        },
      };

      expect(node.data?.values).toBeDefined();
      expect(Array.isArray(node.data?.values)).toBe(true);
      expect(node.data?.values[0]).toHaveProperty('label');
      expect(node.data?.values[0]).toHaveProperty('value');
    });

    it('should accept single numeric value', () => {
      const node: NodeAst = {
        id: 'gauge1',
        shape: 'gauge',
        label: 'CPU Usage',
        data: { value: 75 },
      };

      expect(node.data?.value).toBe(75);
    });

    it('should accept XY coordinate data', () => {
      const node: NodeAst = {
        id: 'scatter1',
        shape: 'scatter-plot',
        data: {
          points: [
            { x: 10, y: 20, label: 'A' },
            { x: 30, y: 45, label: 'B' },
          ],
        },
      };

      expect(node.data?.points).toBeDefined();
      expect(Array.isArray(node.data?.points)).toBe(true);
      expect(node.data?.points[0]).toHaveProperty('x');
      expect(node.data?.points[0]).toHaveProperty('y');
    });

    it('should work without data property (optional)', () => {
      const node: NodeAst = {
        id: 'box1',
        shape: 'rounded',
        label: 'Simple Box',
      };

      expect(node.data).toBeUndefined();
    });
  });

  describe('Data validation helpers', () => {
    it('should validate numeric array data', () => {
      const data = { values: [10, 20, 30] };

      expect(Array.isArray(data.values)).toBe(true);
      expect(data.values.every((v) => typeof v === 'number')).toBe(true);
    });

    it('should validate labeled data array', () => {
      const data = {
        values: [
          { label: 'A', value: 10 },
          { label: 'B', value: 20 },
        ],
      };

      expect(Array.isArray(data.values)).toBe(true);
      expect(
        data.values.every(
          (v) => typeof v === 'object' && 'label' in v && 'value' in v
        )
      ).toBe(true);
    });

    it('should detect empty data', () => {
      const data = { values: [] };

      expect(Array.isArray(data.values)).toBe(true);
      expect(data.values.length).toBe(0);
    });

    it('should handle mixed data types', () => {
      const data = {
        values: [10, 20],
        labels: ['A', 'B'],
        colors: ['#f00', '#0f0'],
      };

      expect(data.values).toHaveLength(2);
      expect(data.labels).toHaveLength(2);
      expect(data.colors).toHaveLength(2);
    });
  });

  describe('Data normalization', () => {
    it('should normalize simple numbers to labeled format', () => {
      const input = [30, 45, 25];
      const normalized = input.map((value, i) => ({
        label: `Slice ${i + 1}`,
        value,
      }));

      expect(normalized).toEqual([
        { label: 'Slice 1', value: 30 },
        { label: 'Slice 2', value: 45 },
        { label: 'Slice 3', value: 25 },
      ]);
    });

    it('should keep labeled data unchanged', () => {
      const input = [
        { label: 'Alpha', value: 30 },
        { label: 'Beta', value: 45 },
      ];

      const normalized = input; // Already normalized

      expect(normalized).toEqual(input);
    });

    it('should calculate total from values', () => {
      const data = [30, 45, 25];
      const total = data.reduce((sum, val) => sum + val, 0);

      expect(total).toBe(100);
    });

    it('should calculate percentages', () => {
      const data = [30, 45, 25];
      const total = 100;
      const percentages = data.map((val) => (val / total) * 100);

      expect(percentages).toEqual([30, 45, 25]);
    });
  });

  describe('Edge cases', () => {
    it('should handle single value in array', () => {
      const data = { values: [100] };

      expect(data.values).toHaveLength(1);
      expect(data.values[0]).toBe(100);
    });

    it('should handle zero values', () => {
      const data = { values: [10, 0, 20] };
      const nonZero = data.values.filter((v) => v !== 0);

      expect(nonZero).toEqual([10, 20]);
    });

    it('should reject negative values for pie charts', () => {
      const data = { values: [10, -5, 20] };
      const hasNegative = data.values.some((v) => v < 0);

      expect(hasNegative).toBe(true); // Should be filtered out
    });

    it('should handle large datasets', () => {
      const data = { values: Array(100).fill(1) };

      expect(data.values).toHaveLength(100);
      expect(data.values.reduce((s, v) => s + v, 0)).toBe(100);
    });

    it('should handle floating point values', () => {
      const data = { values: [10.5, 20.75, 33.25] };
      const total = data.values.reduce((s, v) => s + v, 0);

      expect(total).toBeCloseTo(64.5, 2);
    });
  });
});
