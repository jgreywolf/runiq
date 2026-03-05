import { describe, it, expect } from 'vitest';
import { pictureGridGlyphSet } from './pictureGrid.js';

describe('pictureGrid glyphset', () => {
  describe('basic generation', () => {
    it('should generate grid from image URLs', () => {
      const result = pictureGridGlyphSet.generator({
        images: [
          'https://example.com/1.jpg',
          'https://example.com/2.jpg',
          'https://example.com/3.jpg',
          'https://example.com/4.jpg',
        ],
      });

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].shape).toBe('pictureGrid');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result.nodes[0].data as any;
      expect(data.items).toHaveLength(4);
      expect(data.items[0]).toMatchObject({
        image: 'https://example.com/1.jpg',
        label: 'Item 1',
      });
      expect(data.columns).toBe(3); // default
    });

    it('should generate grid from ImageItem objects', () => {
      const result = pictureGridGlyphSet.generator({
        images: [
          { image: 'https://example.com/1.jpg', label: 'Item 1' },
          { image: 'https://example.com/2.jpg', label: 'Item 2' },
          { image: 'https://example.com/3.jpg', label: 'Item 3' },
        ],
      });

      expect(result.nodes).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result.nodes[0].data as any;
      expect(data.items).toHaveLength(3);
      expect(data.items[0]).toMatchObject({
        image: 'https://example.com/1.jpg',
        label: 'Item 1',
      });
    });

    it('should support custom columns', () => {
      const result = pictureGridGlyphSet.generator({
        images: ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg', 'e.jpg', 'f.jpg'],
        columns: 2,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result.nodes[0].data as any;
      expect(data.columns).toBe(2);
    });

    it('should support theme', () => {
      const result = pictureGridGlyphSet.generator({
        images: ['a.jpg', 'b.jpg', 'c.jpg'],
        theme: 'blues',
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result.nodes[0].data as any;
      expect(data.theme).toBe('blues');
    });
  });

  describe('validation', () => {
    it('should reject less than 2 images', () => {
      expect(() =>
        pictureGridGlyphSet.generator({
          images: ['single.jpg'],
        })
      ).toThrow(/at least 2 images/i);
    });

    it('should reject more than 12 images', () => {
      const tooMany = Array.from({ length: 13 }, (_, i) => `${i}.jpg`);
      expect(() =>
        pictureGridGlyphSet.generator({
          images: tooMany,
        })
      ).toThrow(/maximum 12 images/i);
    });

    it('should reject invalid columns', () => {
      expect(() =>
        pictureGridGlyphSet.generator({
          images: ['a.jpg', 'b.jpg', 'c.jpg'],
          columns: 0,
        })
      ).toThrow(/between 1 and 6/i);

      expect(() =>
        pictureGridGlyphSet.generator({
          images: ['a.jpg', 'b.jpg', 'c.jpg'],
          columns: 7,
        })
      ).toThrow(/between 1 and 6/i);
    });
  });

  describe('data URLs', () => {
    it('should support data URLs for images', () => {
      const dataUrl =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const result = pictureGridGlyphSet.generator({
        images: [dataUrl, dataUrl, dataUrl],
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result.nodes[0].data as any;
      expect(data.items[0].image).toBe(dataUrl);
    });
  });

  describe('glyphset metadata', () => {
    it('should have correct id', () => {
      expect(pictureGridGlyphSet.id).toBe('pictureGrid');
    });

    it('should be in visualization category', () => {
      expect(pictureGridGlyphSet.category).toBe('visualization');
    });

    it('should have correct parameters', () => {
      const params = pictureGridGlyphSet.parameters;
      expect(params).toBeDefined();

      const imagesParam = params?.find((p) => p.name === 'images');
      expect(imagesParam).toBeDefined();
      expect(imagesParam?.type).toBe('array');
      expect(imagesParam?.required).toBe(true);

      const themeParam = params?.find((p) => p.name === 'theme');
      expect(themeParam).toBeDefined();
      expect(themeParam?.type).toBe('string');
      expect(themeParam?.required).toBe(false);

      const columnsParam = params?.find((p) => p.name === 'columns');
      expect(columnsParam).toBeDefined();
      expect(columnsParam?.type).toBe('number');
      expect(columnsParam?.required).toBe(false);
    });

    it('should have correct item limits', () => {
      expect(pictureGridGlyphSet.minItems).toBe(2);
      expect(pictureGridGlyphSet.maxItems).toBe(12);
    });

    it('should have visualization and picture tags', () => {
      expect(pictureGridGlyphSet.tags).toContain('visualization');
      expect(pictureGridGlyphSet.tags).toContain('picture');
    });
  });
});
