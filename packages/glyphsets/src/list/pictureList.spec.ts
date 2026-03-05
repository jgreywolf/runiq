import { describe, it, expect } from 'vitest';
import { pictureListGlyphSet } from './pictureList.js';
import type { ImageItem } from '../utils/image.js';

describe('pictureList glyphset', () => {
  describe('basic generation', () => {
    it('should generate picture list with simple URL strings', () => {
      const result = pictureListGlyphSet.generator({
        images: [
          'https://example.com/photo1.jpg',
          'https://example.com/photo2.jpg',
          'https://example.com/photo3.jpg',
        ],
      });

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].shape).toBe('pictureList');
      expect(result.nodes[0].data?.items).toHaveLength(3);
      expect(result.direction).toBe('LR'); // Default horizontal
    });

    it('should generate picture list with ImageItem objects', () => {
      const images: ImageItem[] = [
        { image: 'https://example.com/alice.jpg', label: 'Alice' },
        { image: 'https://example.com/bob.jpg', label: 'Bob' },
        {
          image: 'https://example.com/carol.jpg',
          label: 'Carol',
          description: 'Team Lead',
        },
      ];

      const result = pictureListGlyphSet.generator({ images });

      expect(result.nodes).toHaveLength(1);
      const items = result.nodes[0].data?.items as ImageItem[];
      expect(items).toHaveLength(3);
      expect(items[0].label).toBe('Alice');
      expect(items[2].description).toBe('Team Lead');
    });

    it('should support vertical orientation', () => {
      const result = pictureListGlyphSet.generator({
        images: [
          'https://example.com/photo1.jpg',
          'https://example.com/photo2.jpg',
        ],
        orientation: 'vertical',
      });

      expect(result.direction).toBe('TB');
    });

    it('should apply theme', () => {
      const result = pictureListGlyphSet.generator({
        images: [
          'https://example.com/photo1.jpg',
          'https://example.com/photo2.jpg',
        ],
        theme: 'vibrant',
      });

      expect(result.nodes[0].data?.theme).toBe('vibrant');
    });
  });

  describe('validation', () => {
    it('should throw error with fewer than 2 images', () => {
      expect(() => {
        pictureListGlyphSet.generator({
          images: ['https://example.com/photo1.jpg'],
        });
      }).toThrow('Picture list requires at least 2 images');
    });

    it('should throw error with more than 8 images', () => {
      const images = Array(9)
        .fill(0)
        .map((_, i) => `https://example.com/photo${i}.jpg`);

      expect(() => {
        pictureListGlyphSet.generator({ images });
      }).toThrow('Picture list supports maximum 8 images');
    });

    it('should throw error with invalid images parameter', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pictureListGlyphSet.generator({ images: 'not-an-array' as any });
      }).toThrow('Parameter "images" must be an array');
    });
  });

  describe('data URLs', () => {
    it('should support data URLs for images', () => {
      const result = pictureListGlyphSet.generator({
        images: [
          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E',
          'data:image/png;base64,iVBORw0KGgoAAAANS',
        ],
      });

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].data?.items).toHaveLength(2);
    });
  });

  describe('metadata', () => {
    it('should have correct glyphset metadata', () => {
      expect(pictureListGlyphSet.id).toBe('pictureList');
      expect(pictureListGlyphSet.name).toBe('Picture List');
      expect(pictureListGlyphSet.category).toBe('list');
      expect(pictureListGlyphSet.minItems).toBe(2);
      expect(pictureListGlyphSet.maxItems).toBe(8);
    });

    it('should have correct parameters definition', () => {
      const imagesParam = pictureListGlyphSet.parameters.find(
        (p) => p.name === 'images'
      );
      expect(imagesParam).toBeDefined();
      expect(imagesParam?.required).toBe(true);
      expect(imagesParam?.type).toBe('array');
    });

    it('should have appropriate tags', () => {
      expect(pictureListGlyphSet.tags).toContain('picture');
      expect(pictureListGlyphSet.tags).toContain('image');
      expect(pictureListGlyphSet.tags).toContain('list');
    });
  });
});
