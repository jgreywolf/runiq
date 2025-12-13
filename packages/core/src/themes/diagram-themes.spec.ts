import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  diagramThemes,
  getAvailableDiagramThemes,
  getDiagramTheme,
  getThemeNodeColor,
} from './diagram-themes.js';

describe('diagram-themes', () => {
  describe('diagramThemes', () => {
    it('should have runiq theme', () => {
      expect(diagramThemes.runiq).toBeDefined();
      expect(diagramThemes.runiq.id).toBe('runiq');
    });

    it('should have professional theme', () => {
      expect(diagramThemes.professional).toBeDefined();
      expect(diagramThemes.professional.id).toBe('professional');
    });

    it('should have all required properties', () => {
      Object.values(diagramThemes).forEach((theme) => {
        expect(theme).toHaveProperty('id');
        expect(theme).toHaveProperty('name');
        expect(theme).toHaveProperty('description');
        expect(theme).toHaveProperty('nodeColors');
        expect(theme).toHaveProperty('edgeColor');
        expect(theme).toHaveProperty('accentColor');
        expect(theme).toHaveProperty('backgroundColor');
        expect(theme).toHaveProperty('textColor');
      });
    });

    it('should have nodeColors array', () => {
      Object.values(diagramThemes).forEach((theme) => {
        expect(Array.isArray(theme.nodeColors)).toBe(true);
        expect(theme.nodeColors.length).toBeGreaterThan(0);
      });
    });

    it('should have valid hex colors', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

      Object.values(diagramThemes).forEach((theme) => {
        expect(theme.edgeColor).toMatch(hexColorRegex);
        expect(theme.accentColor).toMatch(hexColorRegex);
        expect(theme.backgroundColor).toMatch(hexColorRegex);
        expect(theme.textColor).toMatch(hexColorRegex);

        theme.nodeColors.forEach((color) => {
          expect(color).toMatch(hexColorRegex);
        });
      });
    });
  });

  describe('getDiagramTheme', () => {
    let consoleWarnSpy: any;

    beforeEach(() => {
      consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it('should return runiq theme when no ID provided', () => {
      const theme = getDiagramTheme();
      expect(theme.id).toBe('runiq');
    });

    it('should return runiq theme when undefined passed', () => {
      const theme = getDiagramTheme(undefined);
      expect(theme.id).toBe('runiq');
    });

    it('should return correct theme by ID', () => {
      const theme = getDiagramTheme('professional');
      expect(theme.id).toBe('professional');
    });

    it('should be case-insensitive', () => {
      const theme1 = getDiagramTheme('PROFESSIONAL');
      const theme2 = getDiagramTheme('Professional');
      const theme3 = getDiagramTheme('professional');

      expect(theme1.id).toBe('professional');
      expect(theme2.id).toBe('professional');
      expect(theme3.id).toBe('professional');
    });

    it('should return runiq theme for unknown ID', () => {
      const theme = getDiagramTheme('nonexistent');
      expect(theme.id).toBe('runiq');
    });

    it('should warn when theme not found', () => {
      getDiagramTheme('unknown-theme');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Theme 'unknown-theme' not found, using 'runiq' theme instead"
      );
    });

    it('should return all known themes', () => {
      expect(getDiagramTheme('runiq')).toBeDefined();
      expect(getDiagramTheme('professional')).toBeDefined();
      expect(getDiagramTheme('forest')).toBeDefined();
      expect(getDiagramTheme('sunset')).toBeDefined();
      expect(getDiagramTheme('ocean')).toBeDefined();
      expect(getDiagramTheme('monochrome')).toBeDefined();
    });
  });

  describe('getThemeNodeColor', () => {
    it('should return first color for index 0', () => {
      const theme = diagramThemes.runiq;
      const color = getThemeNodeColor(theme, 0);
      expect(color).toBe(theme.nodeColors[0]);
    });

    it('should return correct color for valid index', () => {
      const theme = diagramThemes.professional;
      const color = getThemeNodeColor(theme, 2);
      expect(color).toBe(theme.nodeColors[2]);
    });

    it('should cycle through colors when index exceeds array length', () => {
      const theme = diagramThemes.runiq;
      const colorCount = theme.nodeColors.length;
      const color1 = getThemeNodeColor(theme, 0);
      const color2 = getThemeNodeColor(theme, colorCount);

      expect(color1).toBe(color2);
    });

    it('should handle large indices', () => {
      const theme = diagramThemes.professional;
      const color = getThemeNodeColor(theme, 100);
      expect(color).toBeDefined();
      expect(theme.nodeColors).toContain(color);
    });

    it('should work with all themes', () => {
      Object.values(diagramThemes).forEach((theme) => {
        const color = getThemeNodeColor(theme, 0);
        expect(color).toBeDefined();
        expect(theme.nodeColors).toContain(color);
      });
    });
  });

  describe('getAvailableDiagramThemes', () => {
    it('should return array of theme IDs', () => {
      const themes = getAvailableDiagramThemes();
      expect(Array.isArray(themes)).toBe(true);
      expect(themes.length).toBeGreaterThan(0);
    });

    it('should include runiq theme', () => {
      const themes = getAvailableDiagramThemes();
      expect(themes).toContain('runiq');
    });

    it('should include professional theme', () => {
      const themes = getAvailableDiagramThemes();
      expect(themes).toContain('professional');
    });

    it('should return all theme IDs', () => {
      const themes = getAvailableDiagramThemes();
      const expectedThemes = Object.keys(diagramThemes);
      expect(themes).toEqual(expectedThemes);
    });

    it('should have at least 6 themes', () => {
      const themes = getAvailableDiagramThemes();
      expect(themes.length).toBeGreaterThanOrEqual(6);
    });
  });
});
