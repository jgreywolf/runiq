import { describe, it, expect } from 'vitest';
import { parse } from '../langium-parser.js';

describe('Data Property Parser', () => {
  describe('Simple numeric arrays', () => {
    it('should parse simple numeric array', () => {
      const dsl = `
        diagram "Test" {
          shape chart1 as @pie-chart label: "Sales" data: [30, 45, 25]
        }
      `;

      const result = parse(dsl);
      expect(result.success).toBe(true);
      expect(result.diagram?.nodes).toHaveLength(1);
      expect(result.diagram?.nodes[0].id).toBe('chart1');
      expect(result.diagram?.nodes[0].data).toBeDefined();
      expect(result.diagram?.nodes[0].data?.values).toEqual([30, 45, 25]);
    });

    it('should parse array with floating point values', () => {
      const dsl = `
        diagram "Test" {
          shape chart2 as @pie-chart data: [10.5, 20.75, 33.25]
        }
      `;

      const result = parse(dsl);
      expect(result.success).toBe(true);
      expect(result.diagram?.nodes[0].data?.values).toEqual([
        10.5, 20.75, 33.25,
      ]);
    });

    it('should parse array with single value', () => {
      const dsl = `
        diagram "Test" {
          shape gauge1 as @gauge data: [100]
        }
      `;

      const result = parse(dsl);
      expect(result.success).toBe(true);
      expect(result.diagram?.nodes[0].data?.values).toEqual([100]);
    });

    it('should parse empty array', () => {
      const dsl = `
        diagram "Test" {
          shape empty as @pie-chart data: []
        }
      `;

      const result = parse(dsl);
      expect(result.success).toBe(true);
      expect(result.diagram?.nodes[0].data?.values).toEqual([]);
    });
  });

  describe('Labeled data arrays', () => {
    it('should parse labeled data with curly braces', () => {
      const dsl = `
        diagram "Test" {
          shape chart3 as @pie-chart data: [
            {"label": "Q1", "value": 100},
            {"label": "Q2", "value": 150}
          ]
        }
      `;

      const result = parse(dsl);
      expect(result.success).toBe(true);
      expect(result.diagram?.nodes[0].data?.values).toEqual([
        { label: 'Q1', value: 100 },
        { label: 'Q2', value: 150 },
      ]);
    });

    it('should parse labeled data on single line', () => {
      const dsl = `
        diagram "Test" {
          shape chart4 as @pie-chart data: [{"label": "A", "value": 60}, {"label": "B", "value": 40}]
        }
      `;

      const result = parse(dsl);
      expect(result.success).toBe(true);
      expect(result.diagram?.nodes[0].data?.values).toHaveLength(2);
      expect(result.diagram?.nodes[0].data?.values[0]).toEqual({
        label: 'A',
        value: 60,
      });
    });

    it('should parse many labeled items', () => {
      const dsl = `
        diagram "Browser Share" {
          shape browsers as @pie-chart data: [
            {"label": "Chrome", "value": 65},
            {"label": "Safari", "value": 18},
            {"label": "Edge", "value": 8},
            {"label": "Firefox", "value": 6},
            {"label": "Other", "value": 3}
          ]
        }
      `;

      const result = parse(dsl);
      expect(result.success).toBe(true);
      expect(result.diagram?.nodes[0].data?.values).toHaveLength(5);
      expect(result.diagram?.nodes[0].data?.values[0].label).toBe('Chrome');
    });
  });

  describe('XY coordinate data', () => {
    it('should parse XY points for scatter plots', () => {
      const dsl = `
        diagram "Scatter" {
          shape plot as @scatter-plot data: [
            {"x": 10, "y": 20, "label": "A"},
            {"x": 30, "y": 45, "label": "B"}
          ]
        }
      `;

      const result = parse(dsl);
      expect(result.success).toBe(true);
      expect(result.diagram?.nodes[0].data?.values).toHaveLength(2);
      expect(result.diagram?.nodes[0].data?.values[0]).toEqual({
        x: 10,
        y: 20,
        label: 'A',
      });
    });

    it('should parse XY points without labels', () => {
      const dsl = `
        diagram "Points" {
          shape dots as @scatter-plot data: [
            {"x": 10, "y": 20},
            {"x": 30, "y": 45}
          ]
        }
      `;

      const result = parse(dsl);
      expect(result.success).toBe(true);
      expect(result.diagram?.nodes[0].data?.values[0]).toEqual({
        x: 10,
        y: 20,
      });
    });
  });

  describe('Data with other properties', () => {
    it('should parse data alongside label', () => {
      const dsl = `
        diagram "Test" {
          shape chart5 as @pie-chart label: "Q4 Sales" data: [30, 45, 25]
        }
      `;

      const result = parse(dsl);
      expect(result.success).toBe(true);
      expect(result.diagram?.nodes[0].label).toBe('Q4 Sales');
      expect(result.diagram?.nodes[0].data?.values).toEqual([30, 45, 25]);
    });

    it('should parse data with style and icon', () => {
      const dsl = `
        diagram "Test" {
          style myStyle fillColor: "#fff"
          shape chart6 as @pie-chart 
            label: "Revenue" 
            style: myStyle 
            data: [100, 200]
        }
      `;

      const result = parse(dsl);
      expect(result.success).toBe(true);
      expect(result.diagram?.nodes[0].label).toBe('Revenue');
      expect(result.diagram?.nodes[0].style).toBe('myStyle');
      expect(result.diagram?.nodes[0].data?.values).toEqual([100, 200]);
    });
  });

  describe('Edge cases', () => {
    it('should handle data with negative values', () => {
      const dsl = `
        diagram "Test" {
          shape temp as @gauge data: [-10, 0, 25]
        }
      `;

      const result = parse(dsl);
      expect(result.success).toBe(true);
      expect(result.diagram?.nodes[0].data?.values).toEqual([-10, 0, 25]);
    });

    it('should handle data with zeros', () => {
      const dsl = `
        diagram "Test" {
          shape zeros as @pie-chart data: [10, 0, 20]
        }
      `;

      const result = parse(dsl);
      expect(result.success).toBe(true);
      expect(result.diagram?.nodes[0].data?.values).toEqual([10, 0, 20]);
    });

    it('should handle large arrays', () => {
      const values = Array(50).fill(1).join(', ');
      const dsl = `
        diagram "Test" {
          shape large as @pie-chart data: [${values}]
        }
      `;

      const result = parse(dsl);
      expect(result.success).toBe(true);
      expect(result.diagram?.nodes[0].data?.values).toHaveLength(50);
    });
  });

  describe('Optional data property', () => {
    it('should work without data property', () => {
      const dsl = `
        diagram "Test" {
          shape box as @rounded label: "No Data"
        }
      `;

      const result = parse(dsl);
      expect(result.success).toBe(true);
      expect(result.diagram?.nodes[0].data).toEqual({});
    });

    it('should handle mixed nodes with and without data', () => {
      const dsl = `
        diagram "Test" {
          shape box as @rounded label: "Box"
          shape chart as @pie-chart data: [30, 70]
          box -> chart
        }
      `;

      const result = parse(dsl);
      expect(result.success).toBe(true);
      expect(result.diagram?.nodes).toHaveLength(2);
      expect(result.diagram?.nodes[0].data).toEqual({});
      expect(result.diagram?.nodes[1].data?.values).toEqual([30, 70]);
    });
  });
});
