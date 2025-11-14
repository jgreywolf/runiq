import { describe, it, expect } from 'vitest';
import { framedPictureGlyphSet } from './framedPicture.js';

describe('framedPicture glyphset', () => {
  describe('basic generation', () => {
    it('should generate framed pictures from image URLs', () => {
      const result = framedPictureGlyphSet.generator({
        images: [
          'https://example.com/art1.jpg',
          'https://example.com/art2.jpg',
          'https://example.com/art3.jpg',
        ],
      });

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].shape).toBe('framedPicture');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result.nodes[0].data as any;
      expect(data.items).toHaveLength(3);
      expect(data.items[0]).toMatchObject({
        image: 'https://example.com/art1.jpg',
        label: 'Image 1',
      });
      expect(data.frameStyle).toBe('classic'); // default
    });

    it('should generate from ImageItem objects', () => {
      const result = framedPictureGlyphSet.generator({
        images: [
          { image: 'https://example.com/art1.jpg', label: 'Renaissance' },
          { image: 'https://example.com/art2.jpg', label: 'Modern Art' },
        ],
      });

      expect(result.nodes).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result.nodes[0].data as any;
      expect(data.items).toHaveLength(2);
      expect(data.items[0].label).toBe('Renaissance');
    });

    it('should support different frame styles', () => {
      const styles = ['classic', 'modern', 'ornate', 'minimal'];
      styles.forEach((style) => {
        const result = framedPictureGlyphSet.generator({
          images: ['a.jpg', 'b.jpg'],
          frameStyle: style,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = result.nodes[0].data as any;
        expect(data.frameStyle).toBe(style);
      });
    });

    it('should support theme', () => {
      const result = framedPictureGlyphSet.generator({
        images: ['a.jpg', 'b.jpg'],
        theme: 'vibrant',
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result.nodes[0].data as any;
      expect(data.theme).toBe('vibrant');
    });
  });

  describe('validation', () => {
    it('should reject less than 2 images', () => {
      expect(() =>
        framedPictureGlyphSet.generator({
          images: ['single.jpg'],
        })
      ).toThrow(/at least 2 images/i);
    });

    it('should reject more than 6 images', () => {
      const tooMany = Array.from({ length: 7 }, (_, i) => `${i}.jpg`);
      expect(() =>
        framedPictureGlyphSet.generator({
          images: tooMany,
        })
      ).toThrow(/maximum 6 images/i);
    });

    it('should reject invalid frame style', () => {
      expect(() =>
        framedPictureGlyphSet.generator({
          images: ['a.jpg', 'b.jpg'],
          frameStyle: 'invalid',
        })
      ).toThrow(/classic.*modern.*ornate.*minimal/i);
    });
  });

  describe('glyphset metadata', () => {
    it('should have correct id', () => {
      expect(framedPictureGlyphSet.id).toBe('framedPicture');
    });

    it('should be in list category', () => {
      expect(framedPictureGlyphSet.category).toBe('list');
    });

    it('should have correct parameters', () => {
      const params = framedPictureGlyphSet.parameters;
      expect(params).toBeDefined();

      const imagesParam = params?.find((p) => p.name === 'images');
      expect(imagesParam).toBeDefined();
      expect(imagesParam?.type).toBe('array');
      expect(imagesParam?.required).toBe(true);

      const themeParam = params?.find((p) => p.name === 'theme');
      expect(themeParam).toBeDefined();
      expect(themeParam?.required).toBe(false);

      const frameStyleParam = params?.find((p) => p.name === 'frameStyle');
      expect(frameStyleParam).toBeDefined();
      expect(frameStyleParam?.required).toBe(false);
    });

    it('should have correct item limits', () => {
      expect(framedPictureGlyphSet.minItems).toBe(2);
      expect(framedPictureGlyphSet.maxItems).toBe(6);
    });

    it('should have list and picture tags', () => {
      expect(framedPictureGlyphSet.tags).toContain('list');
      expect(framedPictureGlyphSet.tags).toContain('picture');
    });
  });
});
