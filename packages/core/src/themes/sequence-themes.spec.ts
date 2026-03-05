import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getAvailableSequenceThemes,
  getSequenceTheme,
  sequenceThemes,
} from './sequence-themes.js';

describe('sequence-themes', () => {
  describe('sequenceThemes', () => {
    it('should have runiq theme', () => {
      expect(sequenceThemes.runiq).toBeDefined();
      expect(sequenceThemes.runiq.id).toBe('runiq');
    });

    it('should have professional theme', () => {
      expect(sequenceThemes.professional).toBeDefined();
      expect(sequenceThemes.professional.id).toBe('professional');
    });

    it('should have all required properties', () => {
      Object.values(sequenceThemes).forEach((theme) => {
        expect(theme).toHaveProperty('id');
        expect(theme).toHaveProperty('name');
        expect(theme).toHaveProperty('description');
        expect(theme).toHaveProperty('participantColor');
        expect(theme).toHaveProperty('participantTextColor');
        expect(theme).toHaveProperty('lifelineColor');
        expect(theme).toHaveProperty('messageColor');
        expect(theme).toHaveProperty('activationColor');
        expect(theme).toHaveProperty('noteColor');
        expect(theme).toHaveProperty('noteTextColor');
        expect(theme).toHaveProperty('fragmentColor');
        expect(theme).toHaveProperty('fragmentBorderColor');
        expect(theme).toHaveProperty('backgroundColor');
      });
    });

    it('should have valid hex colors', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

      Object.values(sequenceThemes).forEach((theme) => {
        expect(theme.participantColor).toMatch(hexColorRegex);
        expect(theme.participantTextColor).toMatch(hexColorRegex);
        expect(theme.lifelineColor).toMatch(hexColorRegex);
        expect(theme.messageColor).toMatch(hexColorRegex);
        expect(theme.activationColor).toMatch(hexColorRegex);
        expect(theme.noteColor).toMatch(hexColorRegex);
        expect(theme.noteTextColor).toMatch(hexColorRegex);
        expect(theme.fragmentColor).toMatch(hexColorRegex);
        expect(theme.fragmentBorderColor).toMatch(hexColorRegex);
        expect(theme.backgroundColor).toMatch(hexColorRegex);
      });
    });

    it('should have descriptive names', () => {
      Object.values(sequenceThemes).forEach((theme) => {
        expect(theme.name.length).toBeGreaterThan(0);
        expect(theme.description.length).toBeGreaterThan(0);
      });
    });

    it('runiq theme should use brand colors', () => {
      const runiq = sequenceThemes.runiq;
      expect(runiq.participantColor).toBe('#5a819e');
      expect(runiq.participantTextColor).toBe('#FFFFFF');
    });

    it('professional theme should use classic blue', () => {
      const professional = sequenceThemes.professional;
      expect(professional.participantColor).toBe('#5B9BD5');
      expect(professional.backgroundColor).toBe('#FFFFFF');
    });
  });

  describe('getSequenceTheme', () => {
    let consoleWarnSpy: any;

    beforeEach(() => {
      consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it('should return runiq theme when no ID provided', () => {
      const theme = getSequenceTheme();
      expect(theme.id).toBe('runiq');
    });

    it('should return runiq theme when undefined passed', () => {
      const theme = getSequenceTheme(undefined);
      expect(theme.id).toBe('runiq');
    });

    it('should return correct theme by ID', () => {
      const theme = getSequenceTheme('professional');
      expect(theme.id).toBe('professional');
    });

    it('should be case-insensitive', () => {
      const theme1 = getSequenceTheme('OCEAN');
      const theme2 = getSequenceTheme('Ocean');
      const theme3 = getSequenceTheme('ocean');

      expect(theme1.id).toBe('ocean');
      expect(theme2.id).toBe('ocean');
      expect(theme3.id).toBe('ocean');
    });

    it('should return runiq theme for unknown ID', () => {
      const theme = getSequenceTheme('nonexistent');
      expect(theme.id).toBe('runiq');
    });

    it('should warn when theme not found', () => {
      getSequenceTheme('unknown-theme');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Theme 'unknown-theme' not found, using 'runiq' theme instead"
      );
    });

    it('should return all known themes', () => {
      expect(getSequenceTheme('runiq')).toBeDefined();
      expect(getSequenceTheme('professional')).toBeDefined();
      expect(getSequenceTheme('forest')).toBeDefined();
      expect(getSequenceTheme('sunset')).toBeDefined();
      expect(getSequenceTheme('ocean')).toBeDefined();
      expect(getSequenceTheme('monochrome')).toBeDefined();
    });

    it('should have unique ids', () => {
      const ids = Object.values(sequenceThemes).map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('getAvailableSequenceThemes', () => {
    it('should return array of theme IDs', () => {
      const themes = getAvailableSequenceThemes();
      expect(Array.isArray(themes)).toBe(true);
      expect(themes.length).toBeGreaterThan(0);
    });

    it('should include runiq theme', () => {
      const themes = getAvailableSequenceThemes();
      expect(themes).toContain('runiq');
    });

    it('should include professional theme', () => {
      const themes = getAvailableSequenceThemes();
      expect(themes).toContain('professional');
    });

    it('should return all theme IDs', () => {
      const themes = getAvailableSequenceThemes();
      const expectedThemes = Object.keys(sequenceThemes);
      expect(themes).toEqual(expectedThemes);
    });

    it('should have at least 6 themes', () => {
      const themes = getAvailableSequenceThemes();
      expect(themes.length).toBeGreaterThanOrEqual(6);
    });

    it('should match sequenceThemes keys', () => {
      const themes = getAvailableSequenceThemes();
      const themeKeys = Object.keys(sequenceThemes);
      expect(themes.sort()).toEqual(themeKeys.sort());
    });
  });

  describe('theme consistency', () => {
    it('should have consistent theme IDs across record', () => {
      Object.entries(sequenceThemes).forEach(([key, theme]) => {
        expect(key).toBe(theme.id);
      });
    });

    it('should have unique participant colors', () => {
      const colors = Object.values(sequenceThemes).map(
        (t) => t.participantColor
      );
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(colors.length);
    });

    it('all themes should have white background', () => {
      Object.values(sequenceThemes).forEach((theme) => {
        expect(theme.backgroundColor).toBe('#FFFFFF');
      });
    });
  });
});
