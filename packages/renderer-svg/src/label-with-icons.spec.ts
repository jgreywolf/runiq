import { describe, it, expect, beforeEach } from 'vitest';
import {
  parseLabelWithIcons,
  renderLabelWithIcons,
  measureLabelWithIcons,
} from './renderers/label-with-icons.js';
import { iconRegistry, type IconProvider } from '@runiq/core';

describe('Label with Icons', () => {
  // Mock icon provider for testing
  const mockProvider: IconProvider = {
    id: 'fa',
    getPath: (name: string) => {
      if (name === 'fa-twitter' || name === 'twitter') {
        return {
          viewBox: '0 0 512 512',
          d: 'M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z',
        };
      }
      return undefined;
    },
  };

  beforeEach(() => {
    // Register mock provider
    if (!iconRegistry.get('fa')) {
      iconRegistry.register(mockProvider);
    }
  });

  describe('parseLabelWithIcons', () => {
    it('should parse label without icons as plain text', () => {
      const segments = parseLabelWithIcons('Hello World');
      expect(segments).toHaveLength(1);
      expect(segments[0]).toEqual({
        type: 'text',
        content: 'Hello World',
      });
    });

    it('should parse label with icon at start', () => {
      const segments = parseLabelWithIcons('fa:fa-twitter for peace');
      expect(segments).toHaveLength(2);
      expect(segments[0]).toEqual({
        type: 'icon',
        content: 'fa:fa-twitter',
        iconRef: { provider: 'fa', name: 'fa-twitter' },
      });
      expect(segments[1]).toEqual({
        type: 'text',
        content: 'for peace',
      });
    });

    it('should parse label with icon in middle', () => {
      const segments = parseLabelWithIcons('Click fa:fa-twitter to share');
      expect(segments).toHaveLength(3);
      expect(segments[0]).toEqual({
        type: 'text',
        content: 'Click',
      });
      expect(segments[1]).toEqual({
        type: 'icon',
        content: 'fa:fa-twitter',
        iconRef: { provider: 'fa', name: 'fa-twitter' },
      });
      expect(segments[2]).toEqual({
        type: 'text',
        content: 'to share',
      });
    });

    it('should parse label with icon at end', () => {
      const segments = parseLabelWithIcons('Follow us fa:fa-twitter');
      expect(segments).toHaveLength(2);
      expect(segments[0]).toEqual({
        type: 'text',
        content: 'Follow us',
      });
      expect(segments[1]).toEqual({
        type: 'icon',
        content: 'fa:fa-twitter',
        iconRef: { provider: 'fa', name: 'fa-twitter' },
      });
    });

    it('should parse label with multiple icons', () => {
      const segments = parseLabelWithIcons(
        'fa:fa-twitter and fa:twitter icons'
      );
      expect(segments).toHaveLength(4);
      expect(segments[0].type).toBe('icon');
      expect(segments[1].type).toBe('text');
      expect(segments[2].type).toBe('icon');
      expect(segments[3].type).toBe('text');
    });

    it('should handle empty label', () => {
      const segments = parseLabelWithIcons('');
      expect(segments).toHaveLength(0);
    });

    it('should handle label with only icon', () => {
      const segments = parseLabelWithIcons('fa:fa-twitter');
      expect(segments).toHaveLength(1);
      expect(segments[0]).toEqual({
        type: 'icon',
        content: 'fa:fa-twitter',
        iconRef: { provider: 'fa', name: 'fa-twitter' },
      });
    });
  });

  describe('renderLabelWithIcons', () => {
    it('should render plain text without icons', () => {
      const warnings: string[] = [];
      const svg = renderLabelWithIcons(
        'Hello',
        100,
        50,
        { fontSize: 14 },
        warnings
      );

      expect(svg).toContain('<text');
      expect(svg).toContain('Hello');
      expect(svg).not.toContain('<svg'); // No nested SVG for icons
      expect(warnings).toHaveLength(0);
    });

    it('should render label with icon', () => {
      const warnings: string[] = [];
      const svg = renderLabelWithIcons(
        'fa:fa-twitter for peace',
        100,
        50,
        { fontSize: 14 },
        warnings
      );

      expect(svg).toContain('<g>'); // Grouped elements
      expect(svg).toContain('<svg'); // Icon rendered as SVG
      expect(svg).toContain('<path'); // Icon path
      expect(svg).toContain('for peace'); // Text after icon
      expect(warnings).toHaveLength(0);
    });

    it('should warn about missing icons', () => {
      const warnings: string[] = [];
      const svg = renderLabelWithIcons(
        'missing:unknown icon',
        100,
        50,
        { fontSize: 14 },
        warnings
      );

      expect(warnings).toHaveLength(1);
      expect(warnings[0]).toContain('Icon missing/unknown not found');
      expect(svg).toContain('[missing:unknown]'); // Fallback text
    });

    it('should apply text styling', () => {
      const warnings: string[] = [];
      const svg = renderLabelWithIcons(
        'Test',
        100,
        50,
        {
          fontSize: 16,
          fontFamily: 'Arial',
          fill: '#ff0000',
          textAnchor: 'start',
          dominantBaseline: 'hanging',
        },
        warnings
      );

      expect(svg).toContain('font-size="16"');
      expect(svg).toContain('font-family="Arial"');
      expect(svg).toContain('fill="#ff0000"');
      expect(svg).toContain('text-anchor="start"');
      expect(svg).toContain('dominant-baseline="hanging"');
    });
  });

  describe('measureLabelWithIcons', () => {
    it('should measure plain text', () => {
      const width = measureLabelWithIcons('Hello', 14);
      expect(width).toBeGreaterThan(0);
      expect(width).toBeCloseTo(5 * 14 * 0.6, 1); // ~42px for 5 chars
    });

    it('should account for icon width', () => {
      const textOnly = measureLabelWithIcons('Hello', 14);
      const withIcon = measureLabelWithIcons('fa:fa-twitter Hello', 14);

      expect(withIcon).toBeGreaterThan(textOnly);
      expect(withIcon - textOnly).toBeGreaterThan(14); // Icon size + padding
    });

    it('should handle multiple icons', () => {
      const single = measureLabelWithIcons('fa:fa-twitter text', 14);
      const double = measureLabelWithIcons('fa:fa-twitter text fa:twitter', 14);

      expect(double).toBeGreaterThan(single);
    });
  });
});
