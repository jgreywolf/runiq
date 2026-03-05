import { describe, it, expect } from 'vitest';
import {
  isValidImageUrl,
  getImageUrl,
  PLACEHOLDER_IMAGE,
  renderImage,
  renderCircularClipPath,
  renderRoundedRectClipPath,
  validateImageItem,
  type ImageItem,
} from './image';

describe('Image Utilities', () => {
  describe('isValidImageUrl', () => {
    it('should accept data URLs', () => {
      expect(isValidImageUrl('data:image/png;base64,iVBORw0KGgo=')).toBe(true);
      expect(isValidImageUrl('data:image/svg+xml,%3Csvg%3E%3C/svg%3E')).toBe(
        true
      );
      expect(isValidImageUrl('data:image/jpeg;base64,/9j/4AAQ')).toBe(true);
    });

    it('should accept HTTP/HTTPS URLs', () => {
      expect(isValidImageUrl('https://example.com/image.jpg')).toBe(true);
      expect(isValidImageUrl('http://example.com/photo.png')).toBe(true);
      expect(isValidImageUrl('https://cdn.example.com/path/to/image.svg')).toBe(
        true
      );
    });

    it('should reject invalid URLs', () => {
      expect(isValidImageUrl('')).toBe(false);
      expect(isValidImageUrl('not-a-url')).toBe(false);
      expect(isValidImageUrl('ftp://example.com/file.jpg')).toBe(false);
      expect(isValidImageUrl('javascript:alert(1)')).toBe(false);
    });

    it('should reject non-string values', () => {
      // Testing runtime validation with invalid types
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      expect(isValidImageUrl(null as any)).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      expect(isValidImageUrl(undefined as any)).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      expect(isValidImageUrl(123 as any)).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      expect(isValidImageUrl({} as any)).toBe(false);
    });
  });

  describe('getImageUrl', () => {
    it('should return valid URLs unchanged', () => {
      const url = 'https://example.com/image.jpg';
      expect(getImageUrl(url)).toBe(url);
    });

    it('should return valid data URLs unchanged', () => {
      const dataUrl = 'data:image/png;base64,iVBORw0KGgo=';
      expect(getImageUrl(dataUrl)).toBe(dataUrl);
    });

    it('should return placeholder for invalid URLs', () => {
      expect(getImageUrl('invalid')).toBe(PLACEHOLDER_IMAGE);
      expect(getImageUrl('')).toBe(PLACEHOLDER_IMAGE);
      expect(getImageUrl()).toBe(PLACEHOLDER_IMAGE);
    });

    it('should return placeholder for undefined', () => {
      expect(getImageUrl(undefined)).toBe(PLACEHOLDER_IMAGE);
    });
  });

  describe('renderImage', () => {
    it('should render basic image element', () => {
      const svg = renderImage(10, 20, 100, 80, 'https://example.com/image.jpg');

      expect(svg).toContain('<image');
      expect(svg).toContain('x="10"');
      expect(svg).toContain('y="20"');
      expect(svg).toContain('width="100"');
      expect(svg).toContain('height="80"');
      expect(svg).toContain('href="https://example.com/image.jpg"');
    });

    it('should include preserveAspectRatio', () => {
      const svg = renderImage(0, 0, 100, 100, 'https://example.com/image.jpg');
      expect(svg).toContain('preserveAspectRatio="xMidYMid slice"');
    });

    it('should support custom preserveAspectRatio', () => {
      const svg = renderImage(0, 0, 100, 100, 'https://example.com/image.jpg', {
        preserveAspectRatio: 'xMidYMid meet',
      });
      expect(svg).toContain('preserveAspectRatio="xMidYMid meet"');
    });

    it('should support clip path', () => {
      const svg = renderImage(0, 0, 100, 100, 'https://example.com/image.jpg', {
        clipPath: 'circleClip',
      });
      expect(svg).toContain('clip-path="url(#circleClip)"');
    });

    it('should support opacity', () => {
      const svg = renderImage(0, 0, 100, 100, 'https://example.com/image.jpg', {
        opacity: 0.5,
      });
      expect(svg).toContain('opacity="0.5"');
    });

    it('should use placeholder for invalid URLs', () => {
      const svg = renderImage(0, 0, 100, 100, 'invalid-url');
      expect(svg).toContain(`href="${PLACEHOLDER_IMAGE}"`);
    });
  });

  describe('renderCircularClipPath', () => {
    it('should render circular clip path definition', () => {
      const svg = renderCircularClipPath('myClip', 50, 50, 40);

      expect(svg).toContain('<defs>');
      expect(svg).toContain('<clipPath id="myClip">');
      expect(svg).toContain('<circle cx="50" cy="50" r="40"');
      expect(svg).toContain('</clipPath>');
      expect(svg).toContain('</defs>');
    });
  });

  describe('renderRoundedRectClipPath', () => {
    it('should render rounded rectangle clip path definition', () => {
      const svg = renderRoundedRectClipPath('roundedClip', 10, 20, 100, 80, 8);

      expect(svg).toContain('<defs>');
      expect(svg).toContain('<clipPath id="roundedClip">');
      expect(svg).toContain('<rect x="10" y="20" width="100" height="80"');
      expect(svg).toContain('rx="8" ry="8"');
      expect(svg).toContain('</clipPath>');
      expect(svg).toContain('</defs>');
    });
  });

  describe('validateImageItem', () => {
    it('should validate valid image item with image', () => {
      const item: ImageItem = {
        label: 'Test Item',
        image: 'https://example.com/image.jpg',
        description: 'Test description',
      };
      expect(validateImageItem(item)).toBe(true);
    });

    it('should validate valid image item without image', () => {
      const item: ImageItem = {
        label: 'Test Item',
        description: 'Test description',
      };
      expect(validateImageItem(item)).toBe(true);
    });

    it('should validate item with only label', () => {
      const item: ImageItem = {
        label: 'Test Item',
      };
      expect(validateImageItem(item)).toBe(true);
    });

    it('should reject item without label', () => {
      const item = {
        image: 'https://example.com/image.jpg',
      };
      expect(validateImageItem(item)).toBe(false);
    });

    it('should reject item with empty label', () => {
      const item = {
        label: '',
        image: 'https://example.com/image.jpg',
      };
      expect(validateImageItem(item)).toBe(false);
    });

    it('should reject item with non-string label', () => {
      const item = {
        label: 123,
        image: 'https://example.com/image.jpg',
      };
      expect(validateImageItem(item)).toBe(false);
    });

    it('should reject item with non-string image', () => {
      const item = {
        label: 'Test',
        image: 123,
      };
      expect(validateImageItem(item)).toBe(false);
    });

    it('should reject item with non-string description', () => {
      const item = {
        label: 'Test',
        description: 123,
      };
      expect(validateImageItem(item)).toBe(false);
    });

    it('should reject non-object values', () => {
      expect(validateImageItem(null)).toBe(false);
      expect(validateImageItem(undefined)).toBe(false);
      expect(validateImageItem('string')).toBe(false);
      expect(validateImageItem(123)).toBe(false);
      expect(validateImageItem([])).toBe(false);
    });
  });
});
