import { describe, it, expect } from 'vitest';
import { pictureBlocksGlyphSet } from './pictureBlocks.js';

describe('pictureBlocks glyphset', () => {
  describe('basic generation', () => {
    it('should generate blocks from image URLs', () => {
      const result = pictureBlocksGlyphSet.generator({
        items: [
          'https://example.com/1.jpg',
          'https://example.com/2.jpg',
          'https://example.com/3.jpg',
        ],
      });

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].shape).toBe('pictureBlocks');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result.nodes[0].data as any;
      expect(data.items).toHaveLength(3);
      expect(data.items[0]).toMatchObject({
        image: 'https://example.com/1.jpg',
        label: 'Feature 1',
      });
      expect(data.alternating).toBe(true); // default
    });

    it('should generate from ImageItem objects with descriptions', () => {
      const result = pictureBlocksGlyphSet.generator({
        items: [
          {
            image: 'https://example.com/1.jpg',
            label: 'Smart Design',
            description: 'Ergonomic and intuitive interface',
          },
          {
            image: 'https://example.com/2.jpg',
            label: 'High Performance',
            description: 'Fast and reliable',
          },
        ],
      });

      expect(result.nodes).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result.nodes[0].data as any;
      expect(data.items).toHaveLength(2);
      expect(data.items[0].label).toBe('Smart Design');
      expect(data.items[0].description).toBe(
        'Ergonomic and intuitive interface'
      );
    });

    it('should support non-alternating layout', () => {
      const result = pictureBlocksGlyphSet.generator({
        items: ['a.jpg', 'b.jpg'],
        alternating: false,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result.nodes[0].data as any;
      expect(data.alternating).toBe(false);
    });

    it('should support theme', () => {
      const result = pictureBlocksGlyphSet.generator({
        items: ['a.jpg', 'b.jpg'],
        theme: 'colorful',
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result.nodes[0].data as any;
      expect(data.theme).toBe('colorful');
    });
  });

  describe('validation', () => {
    it('should reject less than 2 items', () => {
      expect(() =>
        pictureBlocksGlyphSet.generator({
          items: ['single.jpg'],
        })
      ).toThrow(/at least 2 items/i);
    });

    it('should reject more than 6 items', () => {
      const tooMany = Array.from({ length: 7 }, (_, i) => `${i}.jpg`);
      expect(() =>
        pictureBlocksGlyphSet.generator({
          items: tooMany,
        })
      ).toThrow(/maximum 6 items/i);
    });
  });

  describe('glyphset metadata', () => {
    it('should have correct id', () => {
      expect(pictureBlocksGlyphSet.id).toBe('pictureBlocks');
    });

    it('should be in list category', () => {
      expect(pictureBlocksGlyphSet.category).toBe('list');
    });

    it('should have correct parameters', () => {
      const params = pictureBlocksGlyphSet.parameters;
      expect(params).toBeDefined();

      const itemsParam = params?.find((p) => p.name === 'items');
      expect(itemsParam).toBeDefined();
      expect(itemsParam?.type).toBe('array');
      expect(itemsParam?.required).toBe(true);

      const themeParam = params?.find((p) => p.name === 'theme');
      expect(themeParam).toBeDefined();
      expect(themeParam?.required).toBe(false);

      const alternatingParam = params?.find((p) => p.name === 'alternating');
      expect(alternatingParam).toBeDefined();
      expect(alternatingParam?.type).toBe('boolean');
      expect(alternatingParam?.required).toBe(false);
    });

    it('should have correct item limits', () => {
      expect(pictureBlocksGlyphSet.minItems).toBe(2);
      expect(pictureBlocksGlyphSet.maxItems).toBe(6);
    });

    it('should have list and picture tags', () => {
      expect(pictureBlocksGlyphSet.tags).toContain('list');
      expect(pictureBlocksGlyphSet.tags).toContain('picture');
    });
  });
});
