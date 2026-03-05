import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getAvailableGlyphsetThemes,
  getGlyphsetTheme,
  getThemeColor,
  glyphsetThemes,
} from './glyphset-themes.js';

describe('glyphset-themes', () => {
  describe('glyphsetThemes', () => {
    it('should have runiq theme', () => {
      expect(glyphsetThemes.runiq).toBeDefined();
      expect(glyphsetThemes.runiq.id).toBe('runiq');
    });

    it('should have professional theme', () => {
      expect(glyphsetThemes.professional).toBeDefined();
      expect(glyphsetThemes.professional.id).toBe('professional');
    });

    it('should have all required properties', () => {
      Object.values(glyphsetThemes).forEach((theme) => {
        expect(theme).toHaveProperty('id');
        expect(theme).toHaveProperty('name');
        expect(theme).toHaveProperty('description');
        expect(theme).toHaveProperty('colors');
      });
    });

    it('should have colors array', () => {
      Object.values(glyphsetThemes).forEach((theme) => {
        expect(Array.isArray(theme.colors)).toBe(true);
        expect(theme.colors.length).toBeGreaterThan(0);
      });
    });

    it('should have optional accent, background, and text colors', () => {
      Object.values(glyphsetThemes).forEach((theme) => {
        if (theme.accentColor) {
          expect(typeof theme.accentColor).toBe('string');
        }
        if (theme.backgroundColor) {
          expect(typeof theme.backgroundColor).toBe('string');
        }
        if (theme.textColor) {
          expect(typeof theme.textColor).toBe('string');
        }
      });
    });

    it('should have valid hex colors', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

      Object.values(glyphsetThemes).forEach((theme) => {
        theme.colors.forEach((color) => {
          expect(color).toMatch(hexColorRegex);
        });

        if (theme.accentColor) {
          expect(theme.accentColor).toMatch(hexColorRegex);
        }
        if (theme.backgroundColor) {
          expect(theme.backgroundColor).toMatch(hexColorRegex);
        }
        if (theme.textColor) {
          expect(theme.textColor).toMatch(hexColorRegex);
        }
      });
    });
  });

  describe('getGlyphsetTheme', () => {
    let consoleWarnSpy: any;

    beforeEach(() => {
      consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it('should return runiq theme when no ID provided', () => {
      const theme = getGlyphsetTheme();
      expect(theme.id).toBe('runiq');
    });

    it('should return runiq theme when undefined passed', () => {
      const theme = getGlyphsetTheme(undefined);
      expect(theme.id).toBe('runiq');
    });

    it('should return correct theme by ID', () => {
      const theme = getGlyphsetTheme('professional');
      expect(theme.id).toBe('professional');
    });

    it('should be case-insensitive', () => {
      const theme1 = getGlyphsetTheme('FOREST');
      const theme2 = getGlyphsetTheme('Forest');
      const theme3 = getGlyphsetTheme('forest');

      expect(theme1.id).toBe('forest');
      expect(theme2.id).toBe('forest');
      expect(theme3.id).toBe('forest');
    });

    it('should return runiq theme for unknown ID', () => {
      const theme = getGlyphsetTheme('nonexistent');
      expect(theme.id).toBe('runiq');
    });

    it('should warn when theme not found', () => {
      getGlyphsetTheme('unknown-theme');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Theme 'unknown-theme' not found, using 'runiq' theme instead"
      );
    });

    it('should return all known themes', () => {
      expect(getGlyphsetTheme('runiq')).toBeDefined();
      expect(getGlyphsetTheme('professional')).toBeDefined();
      expect(getGlyphsetTheme('forest')).toBeDefined();
      expect(getGlyphsetTheme('sunset')).toBeDefined();
      expect(getGlyphsetTheme('ocean')).toBeDefined();
      expect(getGlyphsetTheme('monochrome')).toBeDefined();
    });
  });

  describe('getThemeColor', () => {
    it('should return first color for index 0', () => {
      const theme = glyphsetThemes.runiq;
      const color = getThemeColor(theme, 0);
      expect(color).toBe(theme.colors[0]);
    });

    it('should return correct color for valid index', () => {
      const theme = glyphsetThemes.professional;
      const color = getThemeColor(theme, 2);
      expect(color).toBe(theme.colors[2]);
    });

    it('should cycle through colors when index exceeds array length', () => {
      const theme = glyphsetThemes.runiq;
      const colorCount = theme.colors.length;
      const color1 = getThemeColor(theme, 0);
      const color2 = getThemeColor(theme, colorCount);

      expect(color1).toBe(color2);
    });

    it('should handle large indices', () => {
      const theme = glyphsetThemes.professional;
      const color = getThemeColor(theme, 100);
      expect(color).toBeDefined();
      expect(theme.colors).toContain(color);
    });

    it('should work with all themes', () => {
      Object.values(glyphsetThemes).forEach((theme) => {
        const color = getThemeColor(theme, 0);
        expect(color).toBeDefined();
        expect(theme.colors).toContain(color);
      });
    });

    it('should cycle correctly for multiple passes', () => {
      const theme = glyphsetThemes.runiq;
      const colorCount = theme.colors.length;

      for (let i = 0; i < colorCount * 3; i++) {
        const color = getThemeColor(theme, i);
        expect(color).toBe(theme.colors[i % colorCount]);
      }
    });
  });

  describe('getAvailableGlyphsetThemes', () => {
    it('should return array of theme IDs', () => {
      const themes = getAvailableGlyphsetThemes();
      expect(Array.isArray(themes)).toBe(true);
      expect(themes.length).toBeGreaterThan(0);
    });

    it('should include runiq theme', () => {
      const themes = getAvailableGlyphsetThemes();
      expect(themes).toContain('runiq');
    });

    it('should include professional theme', () => {
      const themes = getAvailableGlyphsetThemes();
      expect(themes).toContain('professional');
    });

    it('should return all theme IDs', () => {
      const themes = getAvailableGlyphsetThemes();
      const expectedThemes = Object.keys(glyphsetThemes);
      expect(themes).toEqual(expectedThemes);
    });

    it('should have at least 6 themes', () => {
      const themes = getAvailableGlyphsetThemes();
      expect(themes.length).toBeGreaterThanOrEqual(6);
    });

    it('should match glyphsetThemes keys', () => {
      const themes = getAvailableGlyphsetThemes();
      const themeKeys = Object.keys(glyphsetThemes);
      expect(themes.sort()).toEqual(themeKeys.sort());
    });
  });
});
