import { describe, it, expect } from 'vitest';
import { pictureCalloutGlyphSet } from './pictureCallout.js';

describe('pictureCallout glyphset', () => {
  describe('basic generation', () => {
    it('should generate callout from image URL and string callouts', () => {
      const result = pictureCalloutGlyphSet.generator({
        image: 'https://example.com/product.jpg',
        callouts: ['Feature 1', 'Feature 2', 'Feature 3'],
      });

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].shape).toBe('pictureCallout');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result.nodes[0].data as any;
      expect(data.image).toMatchObject({
        image: 'https://example.com/product.jpg',
        label: 'Main Image',
      });
      expect(data.callouts).toHaveLength(3);
      expect(data.callouts[0].label).toBe('Feature 1');
      expect(data.callouts[0].position).toBe('top'); // auto-distributed
    });

    it('should generate from ImageItem and CalloutItem objects', () => {
      const result = pictureCalloutGlyphSet.generator({
        image: {
          image: 'https://example.com/product.jpg',
          label: 'Premium Product',
        },
        callouts: [
          { label: 'Waterproof', position: 'top' },
          { label: 'Durable', position: 'right' },
        ],
      });

      expect(result.nodes).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result.nodes[0].data as any;
      expect(data.image.label).toBe('Premium Product');
      expect(data.callouts).toHaveLength(2);
      expect(data.callouts[0].position).toBe('top');
      expect(data.callouts[1].position).toBe('right');
    });

    it('should support theme', () => {
      const result = pictureCalloutGlyphSet.generator({
        image: 'product.jpg',
        callouts: ['A', 'B'],
        theme: 'vibrant',
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result.nodes[0].data as any;
      expect(data.theme).toBe('vibrant');
    });
  });

  describe('validation', () => {
    it('should reject missing image', () => {
      expect(() =>
        pictureCalloutGlyphSet.generator({
          callouts: ['A', 'B'],
        })
      ).toThrow(/image.*required/i);
    });

    it('should reject less than 2 callouts', () => {
      expect(() =>
        pictureCalloutGlyphSet.generator({
          image: 'test.jpg',
          callouts: ['Only One'],
        })
      ).toThrow(/at least 2 callouts/i);
    });

    it('should reject more than 8 callouts', () => {
      const tooMany = Array.from({ length: 9 }, (_, i) => `Callout ${i + 1}`);
      expect(() =>
        pictureCalloutGlyphSet.generator({
          image: 'test.jpg',
          callouts: tooMany,
        })
      ).toThrow(/maximum 8 callouts/i);
    });
  });

  describe('glyphset metadata', () => {
    it('should have correct id', () => {
      expect(pictureCalloutGlyphSet.id).toBe('pictureCallout');
    });

    it('should be in visualization category', () => {
      expect(pictureCalloutGlyphSet.category).toBe('visualization');
    });

    it('should have correct parameters', () => {
      const params = pictureCalloutGlyphSet.parameters;
      expect(params).toBeDefined();

      const imageParam = params?.find((p) => p.name === 'image');
      expect(imageParam).toBeDefined();
      expect(imageParam?.required).toBe(true);

      const calloutsParam = params?.find((p) => p.name === 'callouts');
      expect(calloutsParam).toBeDefined();
      expect(calloutsParam?.type).toBe('array');
      expect(calloutsParam?.required).toBe(true);

      const themeParam = params?.find((p) => p.name === 'theme');
      expect(themeParam).toBeDefined();
      expect(themeParam?.required).toBe(false);
    });

    it('should have correct item limits', () => {
      expect(pictureCalloutGlyphSet.minItems).toBe(2);
      expect(pictureCalloutGlyphSet.maxItems).toBe(8);
    });

    it('should have visualization and picture tags', () => {
      expect(pictureCalloutGlyphSet.tags).toContain('visualization');
      expect(pictureCalloutGlyphSet.tags).toContain('picture');
    });
  });
});
