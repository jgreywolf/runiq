import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getAvailableTimelineThemes,
  getThemeEventColor,
  getTimelineTheme,
  timelineThemes,
} from './timeline-themes.js';

describe('timeline-themes', () => {
  describe('timelineThemes', () => {
    it('should have runiq theme', () => {
      expect(timelineThemes.runiq).toBeDefined();
      expect(timelineThemes.runiq.id).toBe('runiq');
    });

    it('should have professional theme', () => {
      expect(timelineThemes.professional).toBeDefined();
      expect(timelineThemes.professional.id).toBe('professional');
    });

    it('should have all required properties', () => {
      Object.values(timelineThemes).forEach((theme) => {
        expect(theme).toHaveProperty('id');
        expect(theme).toHaveProperty('name');
        expect(theme).toHaveProperty('description');
        expect(theme).toHaveProperty('eventColors');
        expect(theme).toHaveProperty('milestoneColor');
        expect(theme).toHaveProperty('periodColor');
        expect(theme).toHaveProperty('lineColor');
        expect(theme).toHaveProperty('textColor');
        expect(theme).toHaveProperty('backgroundColor');
        expect(theme).toHaveProperty('accentColor');
      });
    });

    it('should have eventColors array with multiple colors', () => {
      Object.values(timelineThemes).forEach((theme) => {
        expect(Array.isArray(theme.eventColors)).toBe(true);
        expect(theme.eventColors.length).toBeGreaterThanOrEqual(3);
      });
    });

    it('should have valid hex colors', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

      Object.values(timelineThemes).forEach((theme) => {
        theme.eventColors.forEach((color) => {
          expect(color).toMatch(hexColorRegex);
        });
        expect(theme.milestoneColor).toMatch(hexColorRegex);
        expect(theme.periodColor).toMatch(hexColorRegex);
        expect(theme.lineColor).toMatch(hexColorRegex);
        expect(theme.textColor).toMatch(hexColorRegex);
        expect(theme.backgroundColor).toMatch(hexColorRegex);
        expect(theme.accentColor).toMatch(hexColorRegex);
      });
    });

    it('should have descriptive names', () => {
      Object.values(timelineThemes).forEach((theme) => {
        expect(theme.name.length).toBeGreaterThan(0);
        expect(theme.description.length).toBeGreaterThan(0);
      });
    });

    it('runiq theme should use brand colors', () => {
      const runiq = timelineThemes.runiq;
      expect(runiq.eventColors).toContain('#5a819e');
      expect(runiq.textColor).toBe('#FFFFFF');
    });

    it('professional theme should use classic blue', () => {
      const professional = timelineThemes.professional;
      expect(professional.eventColors).toContain('#5B9BD5');
      expect(professional.backgroundColor).toBe('#FFFFFF');
    });
  });

  describe('getTimelineTheme', () => {
    let consoleWarnSpy: any;

    beforeEach(() => {
      consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it('should return runiq theme when no ID provided', () => {
      const theme = getTimelineTheme();
      expect(theme.id).toBe('runiq');
    });

    it('should return runiq theme when undefined passed', () => {
      const theme = getTimelineTheme(undefined);
      expect(theme.id).toBe('runiq');
    });

    it('should return correct theme by ID', () => {
      const theme = getTimelineTheme('professional');
      expect(theme.id).toBe('professional');
    });

    it('should be case-insensitive', () => {
      const theme1 = getTimelineTheme('SUNSET');
      const theme2 = getTimelineTheme('Sunset');
      const theme3 = getTimelineTheme('sunset');

      expect(theme1.id).toBe('sunset');
      expect(theme2.id).toBe('sunset');
      expect(theme3.id).toBe('sunset');
    });

    it('should return runiq theme for unknown ID', () => {
      const theme = getTimelineTheme('nonexistent');
      expect(theme.id).toBe('runiq');
    });

    it('should warn when theme not found', () => {
      getTimelineTheme('unknown-theme');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Theme 'unknown-theme' not found, using 'runiq' theme instead"
      );
    });

    it('should return all known themes', () => {
      expect(getTimelineTheme('runiq')).toBeDefined();
      expect(getTimelineTheme('professional')).toBeDefined();
      expect(getTimelineTheme('forest')).toBeDefined();
      expect(getTimelineTheme('sunset')).toBeDefined();
      expect(getTimelineTheme('ocean')).toBeDefined();
      expect(getTimelineTheme('monochrome')).toBeDefined();
    });

    it('should have unique ids', () => {
      const ids = Object.values(timelineThemes).map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('getTimelineEventColor', () => {
    it('should return first color for index 0', () => {
      const theme = timelineThemes.runiq;
      const color = getThemeEventColor(theme, 0);
      expect(color).toBe(theme.eventColors[0]);
    });

    it('should return correct color for valid index', () => {
      const theme = timelineThemes.professional;
      const color = getThemeEventColor(theme, 2);
      expect(color).toBe(theme.eventColors[2]);
    });

    it('should cycle through colors when index exceeds array length', () => {
      const theme = timelineThemes.runiq;
      const colorCount = theme.eventColors.length;
      const color1 = getThemeEventColor(theme, 0);
      const color2 = getThemeEventColor(theme, colorCount);

      expect(color1).toBe(color2);
    });

    it('should handle large indices', () => {
      const theme = timelineThemes.professional;
      const color = getThemeEventColor(theme, 100);
      expect(color).toBeDefined();
      expect(theme.eventColors).toContain(color);
    });

    it('should work with all themes', () => {
      Object.values(timelineThemes).forEach((theme) => {
        const color = getThemeEventColor(theme, 0);
        expect(color).toBeDefined();
        expect(theme.eventColors).toContain(color);
      });
    });

    it('should cycle correctly for multiple passes', () => {
      const theme = timelineThemes.runiq;
      const colorCount = theme.eventColors.length;

      for (let i = 0; i < colorCount * 3; i++) {
        const color = getThemeEventColor(theme, i);
        expect(color).toBe(theme.eventColors[i % colorCount]);
      }
    });
  });

  describe('getAvailableTimelineThemes', () => {
    it('should return array of theme IDs', () => {
      const themes = getAvailableTimelineThemes();
      expect(Array.isArray(themes)).toBe(true);
      expect(themes.length).toBeGreaterThan(0);
    });

    it('should include runiq theme', () => {
      const themes = getAvailableTimelineThemes();
      expect(themes).toContain('runiq');
    });

    it('should include professional theme', () => {
      const themes = getAvailableTimelineThemes();
      expect(themes).toContain('professional');
    });

    it('should return all theme IDs', () => {
      const themes = getAvailableTimelineThemes();
      const expectedThemes = Object.keys(timelineThemes);
      expect(themes).toEqual(expectedThemes);
    });

    it('should have at least 6 themes', () => {
      const themes = getAvailableTimelineThemes();
      expect(themes.length).toBeGreaterThanOrEqual(6);
    });

    it('should match timelineThemes keys', () => {
      const themes = getAvailableTimelineThemes();
      const themeKeys = Object.keys(timelineThemes);
      expect(themes.sort()).toEqual(themeKeys.sort());
    });
  });

  describe('theme consistency', () => {
    it('should have consistent theme IDs across record', () => {
      Object.entries(timelineThemes).forEach(([key, theme]) => {
        expect(key).toBe(theme.id);
      });
    });

    it('should have unique line colors', () => {
      const colors = Object.values(timelineThemes).map((t) => t.lineColor);
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(colors.length);
    });

    it('all themes should have defined backgrounds', () => {
      Object.values(timelineThemes).forEach((theme) => {
        expect(theme.backgroundColor).toBeDefined();
        expect(theme.backgroundColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    it('should have at least 5 event colors per theme', () => {
      Object.values(timelineThemes).forEach((theme) => {
        expect(theme.eventColors.length).toBeGreaterThanOrEqual(5);
      });
    });
  });
});
