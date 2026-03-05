import { describe, it, expect } from 'vitest';
import { matrix3x3GlyphSet } from './matrix3x3.js';

describe('matrix3x3 glyphset', () => {
  const nineQuadrants = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9'];

  describe('metadata', () => {
    it('should have correct id', () => {
      expect(matrix3x3GlyphSet.id).toBe('matrix3x3');
    });

    it('should require exactly 9 items', () => {
      expect(matrix3x3GlyphSet.minItems).toBe(9);
      expect(matrix3x3GlyphSet.maxItems).toBe(9);
    });

    it('should have correct category', () => {
      expect(matrix3x3GlyphSet.category).toBe('comparison');
    });

    it('should have correct tags', () => {
      expect(matrix3x3GlyphSet.tags).toContain('comparison');
      expect(matrix3x3GlyphSet.tags).toContain('matrix');
      expect(matrix3x3GlyphSet.tags).toContain('nine-box');
    });
  });

  describe('basic generation', () => {
    it('should generate 9-box matrix', () => {
      const result = matrix3x3GlyphSet.generator({
        quadrants: nineQuadrants,
      });

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].shape).toBe('matrix3x3');
      expect(result.edges).toHaveLength(0);
    });

    it('should generate matrix with custom colors', () => {
      const result = matrix3x3GlyphSet.generator({
        quadrants: [
          { label: 'Q1', color: '#FF0000' },
          { label: 'Q2', color: '#FF5500' },
          { label: 'Q3', color: '#FFAA00' },
          { label: 'Q4', color: '#FFFF00' },
          { label: 'Q5', color: '#AAFF00' },
          { label: 'Q6', color: '#55FF00' },
          { label: 'Q7', color: '#00FF00' },
          { label: 'Q8', color: '#00FF55' },
          { label: 'Q9', color: '#00FFAA' },
        ],
      });

      const quadrants = result.nodes[0].data?.quadrants;
      expect(quadrants[0].color).toBe('#FF0000');
      expect(quadrants[4].color).toBe('#AAFF00');
      expect(quadrants[8].color).toBe('#00FFAA');
    });

    it('should apply colorful theme colors', () => {
      const result = matrix3x3GlyphSet.generator({
        quadrants: [
          { label: 'Q1' },
          { label: 'Q2' },
          { label: 'Q3' },
          { label: 'Q4' },
          { label: 'Q5' },
          { label: 'Q6' },
          { label: 'Q7' },
          { label: 'Q8' },
          { label: 'Q9' },
        ],
        theme: 'colorful',
      });

      const colors = result.nodes[0].data?.quadrants.map((q: any) => q.color);
      expect(colors).toHaveLength(9);
      colors.forEach((color: string) => {
        expect(color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    it('should apply professional theme colors', () => {
      const result = matrix3x3GlyphSet.generator({
        quadrants: [
          { label: 'Q1' },
          { label: 'Q2' },
          { label: 'Q3' },
          { label: 'Q4' },
          { label: 'Q5' },
          { label: 'Q6' },
          { label: 'Q7' },
          { label: 'Q8' },
          { label: 'Q9' },
        ],
        theme: 'professional',
      });

      const colors = result.nodes[0].data?.quadrants.map((q: any) => q.color);
      expect(colors).toHaveLength(9);
    });
  });

  describe('axis labels', () => {
    it('should support optional xAxis label', () => {
      const result = matrix3x3GlyphSet.generator({
        quadrants: Array(9)
          .fill(0)
          .map((_, i) => ({ label: `Q${i + 1}` })),
        xAxis: 'Performance',
      });

      expect(result.nodes[0].data?.xAxis).toBe('Performance');
    });

    it('should support optional yAxis label', () => {
      const result = matrix3x3GlyphSet.generator({
        quadrants: Array(9)
          .fill(0)
          .map((_, i) => ({ label: `Q${i + 1}` })),
        yAxis: 'Potential',
      });

      expect(result.nodes[0].data?.yAxis).toBe('Potential');
    });

    it('should support both axis labels', () => {
      const result = matrix3x3GlyphSet.generator({
        quadrants: Array(9)
          .fill(0)
          .map((_, i) => ({ label: `Q${i + 1}` })),
        xAxis: 'Likelihood',
        yAxis: 'Impact',
      });

      expect(result.nodes[0].data?.xAxis).toBe('Likelihood');
      expect(result.nodes[0].data?.yAxis).toBe('Impact');
    });
  });

  describe('validation', () => {
    it('should throw error with fewer than 9 items', () => {
      expect(() => {
        matrix3x3GlyphSet.generator({
          quadrants: [
            { label: 'Q1' },
            { label: 'Q2' },
            { label: 'Q3' },
            { label: 'Q4' },
          ],
        });
      }).toThrow('matrix3x3 glyphset requires exactly 9 quadrants');
    });

    it('should throw error with more than 9 items', () => {
      expect(() => {
        matrix3x3GlyphSet.generator({
          quadrants: Array(10)
            .fill(0)
            .map((_, i) => ({ label: `Q${i + 1}` })),
        });
      }).toThrow('matrix3x3 glyphset requires exactly 9 quadrants');
    });
  });

  describe('node properties', () => {
    it('should set correct direction', () => {
      const result = matrix3x3GlyphSet.generator({
        quadrants: Array(9)
          .fill(0)
          .map((_, i) => ({ label: `Q${i + 1}` })),
      });

      expect(result.direction).toBe('LR');
    });

    it('should generate unique node IDs', () => {
      const result = matrix3x3GlyphSet.generator({
        quadrants: Array(9)
          .fill(0)
          .map((_, i) => ({ label: `Q${i + 1}` })),
      });

      expect(result.nodes[0].id).toBe('matrix3x3-composite');
    });

    it('should preserve item labels', () => {
      const labels = [
        'Low\nLow',
        'Low\nMed',
        'Low\nHigh',
        'Med\nLow',
        'Med\nMed',
        'Med\nHigh',
        'High\nLow',
        'High\nMed',
        'High\nHigh',
      ];

      const result = matrix3x3GlyphSet.generator({
        quadrants: labels.map((label) => ({ label })),
      });

      const quadrants = result.nodes[0].data?.quadrants;
      labels.forEach((label, i) => {
        expect(quadrants[i].label).toBe(label);
      });
    });
  });

  describe('theme support', () => {
    const quadrants = Array(9)
      .fill(0)
      .map((_, i) => ({ label: `Q${i + 1}` }));

    it('should support monochrome theme', () => {
      const result = matrix3x3GlyphSet.generator({
        quadrants,
        theme: 'monochrome',
      });

      expect(result.nodes[0].data?.quadrants).toHaveLength(9);
    });

    it('should support vibrant theme', () => {
      const result = matrix3x3GlyphSet.generator({
        quadrants,
        theme: 'vibrant',
      });

      expect(result.nodes[0].data?.quadrants).toHaveLength(9);
    });

    it('should default to professional theme', () => {
      const result = matrix3x3GlyphSet.generator({ quadrants });

      expect(result.nodes[0].data?.quadrants).toHaveLength(9);
    });
  });
});
