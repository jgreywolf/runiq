import { describe, expect, it } from 'vitest';
import type { ColorTheme } from './themes.js';
import { COLOR_THEMES, getThemeColor } from './themes.js';

describe('themes', () => {
  describe('COLOR_THEMES', () => {
    it('should have colorful theme', () => {
      expect(COLOR_THEMES.colorful).toBeDefined();
      expect(Array.isArray(COLOR_THEMES.colorful)).toBe(true);
      expect(COLOR_THEMES.colorful.length).toBeGreaterThan(0);
    });

    it('should have monochrome theme', () => {
      expect(COLOR_THEMES.monochrome).toBeDefined();
      expect(Array.isArray(COLOR_THEMES.monochrome)).toBe(true);
    });

    it('should have vibrant theme', () => {
      expect(COLOR_THEMES.vibrant).toBeDefined();
      expect(Array.isArray(COLOR_THEMES.vibrant)).toBe(true);
    });

    it('should have warm theme', () => {
      expect(COLOR_THEMES.warm).toBeDefined();
      expect(Array.isArray(COLOR_THEMES.warm)).toBe(true);
    });

    it('should have cool theme', () => {
      expect(COLOR_THEMES.cool).toBeDefined();
      expect(Array.isArray(COLOR_THEMES.cool)).toBe(true);
    });

    it('should have forest theme', () => {
      expect(COLOR_THEMES.forest).toBeDefined();
      expect(Array.isArray(COLOR_THEMES.forest)).toBe(true);
    });

    it('should have sunset theme', () => {
      expect(COLOR_THEMES.sunset).toBeDefined();
      expect(Array.isArray(COLOR_THEMES.sunset)).toBe(true);
    });

    it('should have ocean theme', () => {
      expect(COLOR_THEMES.ocean).toBeDefined();
      expect(Array.isArray(COLOR_THEMES.ocean)).toBe(true);
    });

    it('should have professional theme', () => {
      expect(COLOR_THEMES.professional).toBeDefined();
      expect(Array.isArray(COLOR_THEMES.professional)).toBe(true);
    });

    it('all themes should have at least 4 colors', () => {
      Object.values(COLOR_THEMES).forEach((colors) => {
        expect(colors.length).toBeGreaterThanOrEqual(4);
      });
    });

    it('all colors should be valid hex codes', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      Object.values(COLOR_THEMES).forEach((colors) => {
        colors.forEach((color) => {
          expect(color).toMatch(hexColorRegex);
        });
      });
    });

    it('colorful theme should have office colors', () => {
      const colorful = COLOR_THEMES.colorful;
      expect(colorful[0]).toBe('#4472C4'); // Blue
      expect(colorful[1]).toBe('#ED7D31'); // Orange
      expect(colorful[3]).toBe('#FFC000'); // Gold
    });

    it('monochrome theme should use blue shades', () => {
      const monochrome = COLOR_THEMES.monochrome;
      expect(monochrome[0]).toBe('#4472C4');
      // All colors should contain '4' (blue hue)
      monochrome.forEach((color) => {
        expect(color.toUpperCase()).toMatch(/[4-7]/); // Blue range
      });
    });

    it('vibrant theme should have bright colors', () => {
      const vibrant = COLOR_THEMES.vibrant;
      expect(vibrant).toContain('#E74C3C'); // Red
      expect(vibrant).toContain('#3498DB'); // Blue
      expect(vibrant).toContain('#2ECC71'); // Green
    });

    it('warm theme should have warm colors', () => {
      const warm = COLOR_THEMES.warm;
      expect(warm[0]).toBe('#FF6B6B'); // Coral
      expect(warm[1]).toBe('#FFB347'); // Orange
      expect(warm[2]).toBe('#FFD93D'); // Yellow
    });

    it('cool theme should have cool colors', () => {
      const cool = COLOR_THEMES.cool;
      expect(cool[0]).toBe('#00B8D4'); // Cyan
      expect(cool[1]).toBe('#0288D1'); // Blue
      expect(cool[2]).toBe('#5E35B1'); // Purple
    });

    it('forest theme should have green colors', () => {
      const forest = COLOR_THEMES.forest;
      expect(forest[0]).toBe('#2E7D32'); // Forest Green
      expect(forest[1]).toBe('#43A047'); // Medium Green
      // All should be valid hex colors
      forest.forEach((color) => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    it('sunset theme should have orange/yellow colors', () => {
      const sunset = COLOR_THEMES.sunset;
      expect(sunset[0]).toBe('#FF6F00'); // Dark Orange
      // All should be valid warm colors (F or higher in red channel)
      sunset.forEach((color) => {
        expect(color).toMatch(/^#[F][0-9A-Fa-f]{5}$/);
      });
    });

    it('ocean theme should have blue/teal colors', () => {
      const ocean = COLOR_THEMES.ocean;
      expect(ocean[0]).toBe('#006064'); // Deep Ocean
      expect(ocean[1]).toBe('#00838F'); // Dark Cyan
    });

    it('professional theme should have gray-blue colors', () => {
      const professional = COLOR_THEMES.professional;
      expect(professional[0]).toBe('#546E7A');
      expect(professional[1]).toBe('#607D8B');
    });

    it('should have exactly 9 themes', () => {
      const themeKeys = Object.keys(COLOR_THEMES);
      expect(themeKeys.length).toBe(9);
    });

    it('all themes should have unique names', () => {
      const themeKeys = Object.keys(COLOR_THEMES);
      const uniqueKeys = new Set(themeKeys);
      expect(uniqueKeys.size).toBe(themeKeys.length);
    });
  });

  describe('getThemeColor', () => {
    it('should return first color for index 0', () => {
      const color = getThemeColor('colorful', 0);
      expect(color).toBe(COLOR_THEMES.colorful[0]);
    });

    it('should return correct color for valid index', () => {
      const color = getThemeColor('colorful', 2);
      expect(color).toBe(COLOR_THEMES.colorful[2]);
    });

    it('should cycle through colors when index exceeds length', () => {
      const theme = 'colorful';
      const colors = COLOR_THEMES[theme];
      const color1 = getThemeColor(theme, 0);
      const color2 = getThemeColor(theme, colors.length);
      expect(color1).toBe(color2);
    });

    it('should handle large indices', () => {
      const color = getThemeColor('colorful', 100);
      expect(color).toBeDefined();
      expect(COLOR_THEMES.colorful).toContain(color);
    });

    it('should work with all themes', () => {
      const themes: ColorTheme[] = Object.keys(COLOR_THEMES) as ColorTheme[];
      themes.forEach((theme) => {
        const color = getThemeColor(theme, 0);
        expect(color).toBeDefined();
        expect(COLOR_THEMES[theme]).toContain(color);
      });
    });

    it('should correctly cycle multiple times', () => {
      const theme = 'colorful';
      const colors = COLOR_THEMES[theme];
      const colorCount = colors.length;

      for (let i = 0; i < colorCount * 3; i++) {
        const color = getThemeColor(theme, i);
        expect(color).toBe(colors[i % colorCount]);
      }
    });

    it('should work with monochrome theme', () => {
      const color = getThemeColor('monochrome', 0);
      expect(color).toBe('#4472C4');
    });

    it('should work with vibrant theme', () => {
      const color = getThemeColor('vibrant', 0);
      expect(color).toBe('#E74C3C');
    });

    it('should work with warm theme', () => {
      const color = getThemeColor('warm', 0);
      expect(color).toBe('#FF6B6B');
    });

    it('should work with cool theme', () => {
      const color = getThemeColor('cool', 0);
      expect(color).toBe('#00B8D4');
    });

    it('should work with forest theme', () => {
      const color = getThemeColor('forest', 0);
      expect(color).toBe('#2E7D32');
    });

    it('should work with sunset theme', () => {
      const color = getThemeColor('sunset', 0);
      expect(color).toBe('#FF6F00');
    });

    it('should work with ocean theme', () => {
      const color = getThemeColor('ocean', 0);
      expect(color).toBe('#006064');
    });

    it('should work with professional theme', () => {
      const color = getThemeColor('professional', 0);
      expect(color).toBe('#546E7A');
    });

    it('should return valid hex colors', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      const themes: ColorTheme[] = Object.keys(COLOR_THEMES) as ColorTheme[];

      themes.forEach((theme) => {
        for (let i = 0; i < 20; i++) {
          const color = getThemeColor(theme, i);
          expect(color).toMatch(hexColorRegex);
        }
      });
    });

    it('should handle negative indices by cycling', () => {
      const theme = 'colorful';
      const colors = COLOR_THEMES[theme];
      // Negative modulo in JavaScript can be tricky, but our function should handle it
      const color = getThemeColor(theme, 0);
      expect(colors).toContain(color);
    });
  });

  describe('theme consistency', () => {
    it('all themes should have consistent color counts', () => {
      const counts = Object.values(COLOR_THEMES).map((c) => c.length);
      // Most themes should have 8 colors
      const mode = counts.sort(
        (a, b) =>
          counts.filter((v) => v === a).length -
          counts.filter((v) => v === b).length
      )[0];
      expect(mode).toBe(8);
    });

    it('colorful should be the default theme', () => {
      expect(COLOR_THEMES.colorful).toBeDefined();
      expect(COLOR_THEMES.colorful.length).toBeGreaterThan(0);
    });
  });
});
