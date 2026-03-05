import { describe, expect, it } from 'vitest';
import { pictureProcessGlyphSet } from './pictureProcess.js';

describe('pictureProcess glyphset', () => {
  describe('basic generation', () => {
    it('should generate horizontal process from image URLs', () => {
      const result = pictureProcessGlyphSet.generator({
        items: [
          'https://example.com/step1.jpg',
          'https://example.com/step2.jpg',
          'https://example.com/step3.jpg',
        ],
      });

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].shape).toBe('pictureProcess');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result.nodes[0].data as any;
      expect(data.items).toHaveLength(3);
      expect(data.items[0]).toMatchObject({
        image: 'https://example.com/step1.jpg',
        label: 'item 1',
      });
      expect(data.direction).toBe('horizontal'); // default
    });

    it('should generate from ImageItem objects', () => {
      const result = pictureProcessGlyphSet.generator({
        items: [
          { image: 'https://example.com/1.jpg', label: 'Prepare' },
          { image: 'https://example.com/2.jpg', label: 'Process' },
          { image: 'https://example.com/3.jpg', label: 'Complete' },
        ],
      });

      expect(result.nodes).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result.nodes[0].data as any;
      expect(data.items).toHaveLength(3);
      expect(data.items[0]).toMatchObject({
        image: 'https://example.com/1.jpg',
        label: 'Prepare',
      });
    });

    it('should support vertical direction', () => {
      const result = pictureProcessGlyphSet.generator({
        items: ['a.jpg', 'b.jpg', 'c.jpg'],
        direction: 'vertical',
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result.nodes[0].data as any;
      expect(data.direction).toBe('vertical');
    });

    it('should support theme', () => {
      const result = pictureProcessGlyphSet.generator({
        items: ['a.jpg', 'b.jpg'],
        theme: 'vibrant',
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result.nodes[0].data as any;
      expect(data.theme).toBe('vibrant');
    });
  });

  describe('validation', () => {
    it('should reject less than 2 items', () => {
      expect(() =>
        pictureProcessGlyphSet.generator({
          items: ['single.jpg'],
        })
      ).toThrow(/at least 2 steps/i);
    });

    it('should reject more than 8 items', () => {
      const tooMany = Array.from({ length: 9 }, (_, i) => `${i}.jpg`);
      expect(() =>
        pictureProcessGlyphSet.generator({
          items: tooMany,
        })
      ).toThrow(/maximum 8 steps/i);
    });

    it('should reject invalid direction', () => {
      expect(() =>
        pictureProcessGlyphSet.generator({
          items: ['a.jpg', 'b.jpg'],
          direction: 'diagonal',
        })
      ).toThrow(/horizontal.*vertical/i);
    });
  });

  describe('glyphset metadata', () => {
    it('should have correct id', () => {
      expect(pictureProcessGlyphSet.id).toBe('pictureProcess');
    });

    it('should be in process category', () => {
      expect(pictureProcessGlyphSet.category).toBe('process');
    });

    it('should have correct parameters', () => {
      const params = pictureProcessGlyphSet.parameters;
      expect(params).toBeDefined();

      const itemsParam = params?.find((p) => p.name === 'items');
      expect(itemsParam).toBeDefined();
      expect(itemsParam?.type).toBe('array');
      expect(itemsParam?.required).toBe(true);

      const themeParam = params?.find((p) => p.name === 'theme');
      expect(themeParam).toBeDefined();
      expect(themeParam?.type).toBe('string');
      expect(themeParam?.required).toBe(false);

      const directionParam = params?.find((p) => p.name === 'direction');
      expect(directionParam).toBeDefined();
      expect(directionParam?.type).toBe('string');
      expect(directionParam?.required).toBe(false);
    });

    it('should have correct item limits', () => {
      expect(pictureProcessGlyphSet.minItems).toBe(2);
      expect(pictureProcessGlyphSet.maxItems).toBe(8);
    });

    it('should have process and picture tags', () => {
      expect(pictureProcessGlyphSet.tags).toContain('process');
      expect(pictureProcessGlyphSet.tags).toContain('picture');
    });
  });
});
