import { describe, it, expect } from 'vitest';
import { segmentedMatrixGlyphSet } from './segmentedMatrix.js';

describe('segmentedMatrix glyphset', () => {
  describe('basic functionality', () => {
    it('should have correct id', () => {
      expect(segmentedMatrixGlyphSet.id).toBe('segmentedMatrix');
    });

    it('should require exactly 4 items', () => {
      expect(segmentedMatrixGlyphSet.minItems).toBe(4);
      expect(segmentedMatrixGlyphSet.maxItems).toBe(4);
    });

    it('should have correct category', () => {
      expect(segmentedMatrixGlyphSet.category).toBe('comparison');
    });

    it('should have correct tags', () => {
      expect(segmentedMatrixGlyphSet.tags).toContain('comparison');
      expect(segmentedMatrixGlyphSet.tags).toContain('matrix');
      expect(segmentedMatrixGlyphSet.tags).toContain('segmented');
      expect(segmentedMatrixGlyphSet.tags).toContain('subdivided');
    });
  });

  describe('generation without segments', () => {
    it('should generate basic 2x2 matrix without segments', () => {
      const result = segmentedMatrixGlyphSet.generator({
        quadrants: [
          { label: 'Quadrant 1' },
          { label: 'Quadrant 2' },
          { label: 'Quadrant 3' },
          { label: 'Quadrant 4' },
        ],
      });

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].shape).toBe('segmentedMatrix');
      expect(result.nodes[0].data?.quadrants).toHaveLength(4);
      expect(result.edges).toHaveLength(0);
    });

    it('should apply default theme colors', () => {
      const result = segmentedMatrixGlyphSet.generator({
        quadrants: [
          { label: 'Q1' },
          { label: 'Q2' },
          { label: 'Q3' },
          { label: 'Q4' },
        ],
      });

      const colors = result.nodes[0].data?.quadrants.map((q: any) => q.color);
      expect(colors).toHaveLength(4);
      colors.forEach((color: string) => {
        expect(color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });
  });

  describe('generation with segments', () => {
    it('should generate matrix with segments in all quadrants', () => {
      const result = segmentedMatrixGlyphSet.generator({
        quadrants: [
          {
            label: 'Q1',
            segments: [{ label: 'Task 1' }, { label: 'Task 2' }],
          },
          {
            label: 'Q2',
            segments: [{ label: 'Task 3' }],
          },
          {
            label: 'Q3',
            segments: [{ label: 'Task 4' }, { label: 'Task 5' }],
          },
          {
            label: 'Q4',
            segments: [{ label: 'Task 6' }],
          },
        ],
      });

      const quadrants = result.nodes[0].data?.quadrants;
      expect(quadrants[0].segments).toHaveLength(2);
      expect(quadrants[1].segments).toHaveLength(1);
      expect(quadrants[2].segments).toHaveLength(2);
      expect(quadrants[3].segments).toHaveLength(1);
    });

    it('should limit segments to 4 per quadrant', () => {
      const result = segmentedMatrixGlyphSet.generator({
        quadrants: [
          {
            label: 'Q1',
            segments: [
              { label: 'S1' },
              { label: 'S2' },
              { label: 'S3' },
              { label: 'S4' },
              { label: 'S5' },
              { label: 'S6' },
            ],
          },
          { label: 'Q2' },
          { label: 'Q3' },
          { label: 'Q4' },
        ],
      });

      const quadrants = result.nodes[0].data?.quadrants;
      expect(quadrants[0].segments).toHaveLength(4);
      expect(quadrants[0].segments[0].label).toBe('S1');
      expect(quadrants[0].segments[3].label).toBe('S4');
    });

    it('should handle empty segments array', () => {
      const result = segmentedMatrixGlyphSet.generator({
        quadrants: [
          { label: 'Q1', segments: [] },
          { label: 'Q2' },
          { label: 'Q3' },
          { label: 'Q4' },
        ],
      });

      const quadrants = result.nodes[0].data?.quadrants;
      expect(quadrants[0].segments).toHaveLength(0);
    });

    it('should filter out segments without labels', () => {
      const result = segmentedMatrixGlyphSet.generator({
        quadrants: [
          {
            label: 'Q1',
            segments: [
              { label: 'Valid' },
              { label: '' },
              { label: 'Also Valid' },
            ],
          },
          { label: 'Q2' },
          { label: 'Q3' },
          { label: 'Q4' },
        ],
      });

      const quadrants = result.nodes[0].data?.quadrants;
      expect(quadrants[0].segments).toHaveLength(2);
      expect(quadrants[0].segments[0].label).toBe('Valid');
      expect(quadrants[0].segments[1].label).toBe('Also Valid');
    });
  });

  describe('axis labels', () => {
    it('should support optional xAxis label', () => {
      const result = segmentedMatrixGlyphSet.generator({
        quadrants: [
          { label: 'Q1' },
          { label: 'Q2' },
          { label: 'Q3' },
          { label: 'Q4' },
        ],
        xAxis: 'Urgency',
      });

      expect(result.nodes[0].data?.xAxis).toBe('Urgency');
    });

    it('should support optional yAxis label', () => {
      const result = segmentedMatrixGlyphSet.generator({
        quadrants: [
          { label: 'Q1' },
          { label: 'Q2' },
          { label: 'Q3' },
          { label: 'Q4' },
        ],
        yAxis: 'Importance',
      });

      expect(result.nodes[0].data?.yAxis).toBe('Importance');
    });

    it('should support both axis labels', () => {
      const result = segmentedMatrixGlyphSet.generator({
        quadrants: [
          { label: 'Q1' },
          { label: 'Q2' },
          { label: 'Q3' },
          { label: 'Q4' },
        ],
        xAxis: 'Complexity',
        yAxis: 'Value',
      });

      expect(result.nodes[0].data?.xAxis).toBe('Complexity');
      expect(result.nodes[0].data?.yAxis).toBe('Value');
    });
  });

  describe('custom colors', () => {
    it('should apply custom colors to quadrants', () => {
      const result = segmentedMatrixGlyphSet.generator({
        quadrants: [
          { label: 'Q1', color: '#EF5350' },
          { label: 'Q2', color: '#42A5F5' },
          { label: 'Q3', color: '#FFB74D' },
          { label: 'Q4', color: '#9E9E9E' },
        ],
      });

      const quadrants = result.nodes[0].data?.quadrants;
      expect(quadrants[0].color).toBe('#EF5350');
      expect(quadrants[1].color).toBe('#42A5F5');
      expect(quadrants[2].color).toBe('#FFB74D');
      expect(quadrants[3].color).toBe('#9E9E9E');
    });

    it('should mix custom and theme colors', () => {
      const result = segmentedMatrixGlyphSet.generator({
        quadrants: [
          { label: 'Q1', color: '#FF0000' },
          { label: 'Q2' },
          { label: 'Q3', color: '#00FF00' },
          { label: 'Q4' },
        ],
        theme: 'professional',
      });

      const quadrants = result.nodes[0].data?.quadrants;
      expect(quadrants[0].color).toBe('#FF0000');
      expect(quadrants[1].color).toMatch(/^#[0-9A-F]{6}$/i);
      expect(quadrants[2].color).toBe('#00FF00');
      expect(quadrants[3].color).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  describe('validation', () => {
    it('should throw error with fewer than 4 items', () => {
      expect(() => {
        segmentedMatrixGlyphSet.generator({
          quadrants: [{ label: 'Q1' }, { label: 'Q2' }],
        });
      }).toThrow('segmentedMatrix glyphset requires exactly 4');
    });

    it('should throw error with more than 4 items', () => {
      expect(() => {
        segmentedMatrixGlyphSet.generator({
          quadrants: [
            { label: 'Q1' },
            { label: 'Q2' },
            { label: 'Q3' },
            { label: 'Q4' },
            { label: 'Q5' },
          ],
        });
      }).toThrow('segmentedMatrix glyphset requires exactly 4');
    });
  });

  describe('node properties', () => {
    it('should set correct direction', () => {
      const result = segmentedMatrixGlyphSet.generator({
        quadrants: [
          { label: 'Q1' },
          { label: 'Q2' },
          { label: 'Q3' },
          { label: 'Q4' },
        ],
      });

      expect(result.direction).toBe('LR');
    });

    it('should generate unique node IDs', () => {
      const result = segmentedMatrixGlyphSet.generator({
        quadrants: [
          { label: 'Q1' },
          { label: 'Q2' },
          { label: 'Q3' },
          { label: 'Q4' },
        ],
      });

      expect(result.nodes[0].id).toBe('segmentedMatrix-composite');
    });

    it('should preserve item labels', () => {
      const labels = ['Do First', 'Schedule', 'Delegate', 'Eliminate'];

      const result = segmentedMatrixGlyphSet.generator({
        quadrants: labels.map((label) => ({ label })),
      });

      const quadrants = result.nodes[0].data?.quadrants;
      labels.forEach((label, i) => {
        expect(quadrants[i].label).toBe(label);
      });
    });

    it('should preserve segment labels', () => {
      const result = segmentedMatrixGlyphSet.generator({
        quadrants: [
          {
            label: 'Q1',
            segments: [
              { label: 'Client Proposal' },
              { label: 'Bug Fix' },
              { label: 'Team Meeting' },
            ],
          },
          { label: 'Q2' },
          { label: 'Q3' },
          { label: 'Q4' },
        ],
      });

      const segments = result.nodes[0].data?.quadrants[0].segments;
      expect(segments[0].label).toBe('Client Proposal');
      expect(segments[1].label).toBe('Bug Fix');
      expect(segments[2].label).toBe('Team Meeting');
    });
  });

  describe('theme support', () => {
    const quadrants = [
      { label: 'Q1' },
      { label: 'Q2' },
      { label: 'Q3' },
      { label: 'Q4' },
    ];

    it('should support professional theme', () => {
      const result = segmentedMatrixGlyphSet.generator({
        quadrants,
        theme: 'professional',
      });

      expect(result.nodes[0].data?.quadrants).toHaveLength(4);
    });

    it('should support colorful theme', () => {
      const result = segmentedMatrixGlyphSet.generator({
        quadrants,
        theme: 'colorful',
      });

      expect(result.nodes[0].data?.quadrants).toHaveLength(4);
    });

    it('should support monochrome theme', () => {
      const result = segmentedMatrixGlyphSet.generator({
        quadrants,
        theme: 'monochrome',
      });

      expect(result.nodes[0].data?.quadrants).toHaveLength(4);
    });

    it('should default to professional theme', () => {
      const result = segmentedMatrixGlyphSet.generator({ quadrants });

      expect(result.nodes[0].data?.quadrants).toHaveLength(4);
    });
  });
});
