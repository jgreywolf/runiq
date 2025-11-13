import { describe, it, expect } from 'vitest';
import { titledMatrixGlyphSet } from './titledMatrix.js';

describe('titledMatrix glyphset', () => {
  describe('basic functionality', () => {
    it('should have correct id', () => {
      expect(titledMatrixGlyphSet.id).toBe('titledMatrix');
    });

    it('should support 4 to 9 items', () => {
      expect(titledMatrixGlyphSet.minItems).toBe(4);
      expect(titledMatrixGlyphSet.maxItems).toBe(9);
    });

    it('should have correct category', () => {
      expect(titledMatrixGlyphSet.category).toBe('comparison');
    });

    it('should have correct tags', () => {
      expect(titledMatrixGlyphSet.tags).toContain('comparison');
      expect(titledMatrixGlyphSet.tags).toContain('matrix');
      expect(titledMatrixGlyphSet.tags).toContain('titled');
      expect(titledMatrixGlyphSet.tags).toContain('headers');
    });
  });

  describe('2x2 matrix generation', () => {
    it('should generate 2x2 matrix with 4 items', () => {
      const result = titledMatrixGlyphSet.generate({
        items: [
          { label: 'Cell 1' },
          { label: 'Cell 2' },
          { label: 'Cell 3' },
          { label: 'Cell 4' },
        ],
      });

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].shape).toBe('titledMatrix');
      expect(result.nodes[0].data?.quadrants).toHaveLength(4);
      expect(result.nodes[0].data?.size).toBe(2);
    });

    it('should generate default column headers for 2x2', () => {
      const result = titledMatrixGlyphSet.generate({
        items: [
          { label: 'Cell 1' },
          { label: 'Cell 2' },
          { label: 'Cell 3' },
          { label: 'Cell 4' },
        ],
      });

      expect(result.nodes[0].data?.columnHeaders).toEqual(['Col 1', 'Col 2']);
    });

    it('should generate default row headers for 2x2', () => {
      const result = titledMatrixGlyphSet.generate({
        items: [
          { label: 'Cell 1' },
          { label: 'Cell 2' },
          { label: 'Cell 3' },
          { label: 'Cell 4' },
        ],
      });

      expect(result.nodes[0].data?.rowHeaders).toEqual(['Row 1', 'Row 2']);
    });

    it('should support custom column headers', () => {
      const result = titledMatrixGlyphSet.generate({
        items: [
          { label: 'Cell 1' },
          { label: 'Cell 2' },
          { label: 'Cell 3' },
          { label: 'Cell 4' },
        ],
        columnHeaders: ['Basic', 'Premium'],
      });

      expect(result.nodes[0].data?.columnHeaders).toEqual(['Basic', 'Premium']);
    });

    it('should support custom row headers', () => {
      const result = titledMatrixGlyphSet.generate({
        items: [
          { label: 'Cell 1' },
          { label: 'Cell 2' },
          { label: 'Cell 3' },
          { label: 'Cell 4' },
        ],
        rowHeaders: ['Storage', 'Users'],
      });

      expect(result.nodes[0].data?.rowHeaders).toEqual(['Storage', 'Users']);
    });
  });

  describe('3x3 matrix generation', () => {
    it('should generate 3x3 matrix with 9 items', () => {
      const result = titledMatrixGlyphSet.generate({
        items: Array(9)
          .fill(0)
          .map((_, i) => ({ label: `Cell ${i + 1}` })),
      });

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].shape).toBe('titledMatrix');
      expect(result.nodes[0].data?.quadrants).toHaveLength(9);
      expect(result.nodes[0].data?.size).toBe(3);
    });

    it('should generate default column headers for 3x3', () => {
      const result = titledMatrixGlyphSet.generate({
        items: Array(9)
          .fill(0)
          .map((_, i) => ({ label: `Cell ${i + 1}` })),
      });

      expect(result.nodes[0].data?.columnHeaders).toEqual([
        'Col 1',
        'Col 2',
        'Col 3',
      ]);
    });

    it('should generate default row headers for 3x3', () => {
      const result = titledMatrixGlyphSet.generate({
        items: Array(9)
          .fill(0)
          .map((_, i) => ({ label: `Cell ${i + 1}` })),
      });

      expect(result.nodes[0].data?.rowHeaders).toEqual([
        'Row 1',
        'Row 2',
        'Row 3',
      ]);
    });

    it('should support custom column headers for 3x3', () => {
      const result = titledMatrixGlyphSet.generate({
        items: Array(9)
          .fill(0)
          .map((_, i) => ({ label: `Cell ${i + 1}` })),
        columnHeaders: ['Vendor A', 'Vendor B', 'Vendor C'],
      });

      expect(result.nodes[0].data?.columnHeaders).toEqual([
        'Vendor A',
        'Vendor B',
        'Vendor C',
      ]);
    });

    it('should support custom row headers for 3x3', () => {
      const result = titledMatrixGlyphSet.generate({
        items: Array(9)
          .fill(0)
          .map((_, i) => ({ label: `Cell ${i + 1}` })),
        rowHeaders: ['Price', 'Quality', 'Support'],
      });

      expect(result.nodes[0].data?.rowHeaders).toEqual([
        'Price',
        'Quality',
        'Support',
      ]);
    });
  });

  describe('custom colors', () => {
    it('should apply custom colors to 2x2 matrix', () => {
      const result = titledMatrixGlyphSet.generate({
        items: [
          { label: 'Cell 1', color: '#FF0000' },
          { label: 'Cell 2', color: '#00FF00' },
          { label: 'Cell 3', color: '#0000FF' },
          { label: 'Cell 4', color: '#FFFF00' },
        ],
      });

      const quadrants = result.nodes[0].data?.quadrants;
      expect(quadrants[0].color).toBe('#FF0000');
      expect(quadrants[1].color).toBe('#00FF00');
      expect(quadrants[2].color).toBe('#0000FF');
      expect(quadrants[3].color).toBe('#FFFF00');
    });

    it('should apply theme colors when no custom colors', () => {
      const result = titledMatrixGlyphSet.generate({
        items: [
          { label: 'Cell 1' },
          { label: 'Cell 2' },
          { label: 'Cell 3' },
          { label: 'Cell 4' },
        ],
        theme: 'colorful',
      });

      const colors = result.nodes[0].data?.quadrants.map((q: any) => q.color);
      colors.forEach((color: string) => {
        expect(color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });
  });

  describe('validation', () => {
    it('should throw error with fewer than 4 items', () => {
      expect(() => {
        titledMatrixGlyphSet.generate({
          items: [{ label: 'Cell 1' }, { label: 'Cell 2' }],
        });
      }).toThrow('titledMatrix glyphset requires 4 or 9 items');
    });

    it('should throw error with more than 9 items', () => {
      expect(() => {
        titledMatrixGlyphSet.generate({
          items: Array(10)
            .fill(0)
            .map((_, i) => ({ label: `Cell ${i + 1}` })),
        });
      }).toThrow('titledMatrix glyphset requires 4 or 9 items');
    });

    it('should throw error with invalid item count', () => {
      expect(() => {
        titledMatrixGlyphSet.generate({
          items: [
            { label: 'Cell 1' },
            { label: 'Cell 2' },
            { label: 'Cell 3' },
            { label: 'Cell 4' },
            { label: 'Cell 5' },
          ],
        });
      }).toThrow('titledMatrix glyphset requires 4 or 9 items');
    });
  });

  describe('node properties', () => {
    it('should set correct direction', () => {
      const result = titledMatrixGlyphSet.generate({
        items: [
          { label: 'Cell 1' },
          { label: 'Cell 2' },
          { label: 'Cell 3' },
          { label: 'Cell 4' },
        ],
      });

      expect(result.direction).toBe('LR');
    });

    it('should generate unique node IDs', () => {
      const result = titledMatrixGlyphSet.generate({
        items: [
          { label: 'Cell 1' },
          { label: 'Cell 2' },
          { label: 'Cell 3' },
          { label: 'Cell 4' },
        ],
      });

      expect(result.nodes[0].id).toMatch(/^titledMatrix_/);
    });

    it('should preserve item labels', () => {
      const labels = ['10 GB', '100 GB', '5 Users', 'Unlimited'];

      const result = titledMatrixGlyphSet.generate({
        items: labels.map((label) => ({ label })),
      });

      const quadrants = result.nodes[0].data?.quadrants;
      labels.forEach((label, i) => {
        expect(quadrants[i].label).toBe(label);
      });
    });
  });

  describe('theme support', () => {
    const items = [
      { label: 'Cell 1' },
      { label: 'Cell 2' },
      { label: 'Cell 3' },
      { label: 'Cell 4' },
    ];

    it('should support professional theme', () => {
      const result = titledMatrixGlyphSet.generate({
        items,
        theme: 'professional',
      });

      expect(result.nodes[0].data?.quadrants).toHaveLength(4);
    });

    it('should support colorful theme', () => {
      const result = titledMatrixGlyphSet.generate({
        items,
        theme: 'colorful',
      });

      expect(result.nodes[0].data?.quadrants).toHaveLength(4);
    });

    it('should support monochrome theme', () => {
      const result = titledMatrixGlyphSet.generate({
        items,
        theme: 'monochrome',
      });

      expect(result.nodes[0].data?.quadrants).toHaveLength(4);
    });
  });
});
