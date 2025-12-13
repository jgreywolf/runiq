import { describe, expect, it } from 'vitest';
import { baseThemes } from './base-themes.js';

describe('base-themes', () => {
  describe('baseThemes', () => {
    it('should have runiq theme', () => {
      expect(baseThemes.runiq).toBeDefined();
      expect(baseThemes.runiq.id).toBe('runiq');
      expect(baseThemes.runiq.name).toBe('Runiq');
    });

    it('should have professional theme', () => {
      expect(baseThemes.professional).toBeDefined();
      expect(baseThemes.professional.id).toBe('professional');
    });

    it('should have forest theme', () => {
      expect(baseThemes.forest).toBeDefined();
      expect(baseThemes.forest.id).toBe('forest');
    });

    it('should have sunset theme', () => {
      expect(baseThemes.sunset).toBeDefined();
      expect(baseThemes.sunset.id).toBe('sunset');
    });

    it('should have ocean theme', () => {
      expect(baseThemes.ocean).toBeDefined();
      expect(baseThemes.ocean.id).toBe('ocean');
    });

    it('should have monochrome theme', () => {
      expect(baseThemes.monochrome).toBeDefined();
      expect(baseThemes.monochrome.id).toBe('monochrome');
    });

    it('should have all required properties on each theme', () => {
      Object.values(baseThemes).forEach((theme) => {
        expect(theme).toHaveProperty('id');
        expect(theme).toHaveProperty('name');
        expect(theme).toHaveProperty('description');
        expect(theme).toHaveProperty('colors');
        expect(theme).toHaveProperty('primaryColor');
        expect(theme).toHaveProperty('secondaryColor');
        expect(theme).toHaveProperty('edgeColor');
        expect(theme).toHaveProperty('textColor');
        expect(theme).toHaveProperty('backgroundColor');
        expect(theme).toHaveProperty('surfaceColor');
        expect(theme).toHaveProperty('strokeColor');
      });
    });

    it('should have color arrays with at least 3 colors', () => {
      Object.values(baseThemes).forEach((theme) => {
        expect(theme.colors.length).toBeGreaterThanOrEqual(3);
      });
    });

    it('should have valid hex color codes', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

      Object.values(baseThemes).forEach((theme) => {
        expect(theme.primaryColor).toMatch(hexColorRegex);
        expect(theme.secondaryColor).toMatch(hexColorRegex);
        expect(theme.edgeColor).toMatch(hexColorRegex);
        expect(theme.textColor).toMatch(hexColorRegex);
        expect(theme.backgroundColor).toMatch(hexColorRegex);
        expect(theme.surfaceColor).toMatch(hexColorRegex);
        expect(theme.strokeColor).toMatch(hexColorRegex);

        theme.colors.forEach((color) => {
          expect(color).toMatch(hexColorRegex);
        });
      });
    });

    it('should have unique ids', () => {
      const ids = Object.values(baseThemes).map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have descriptive names', () => {
      Object.values(baseThemes).forEach((theme) => {
        expect(theme.name.length).toBeGreaterThan(0);
        expect(theme.description.length).toBeGreaterThan(0);
      });
    });

    it('runiq theme should use brand colors', () => {
      const runiq = baseThemes.runiq;
      expect(runiq.primaryColor).toBe('#5a819e');
      expect(runiq.textColor).toBe('#FFFFFF');
    });

    it('professional theme should use classic blue', () => {
      const professional = baseThemes.professional;
      expect(professional.primaryColor).toBe('#5B9BD5');
      expect(professional.backgroundColor).toBe('#FFFFFF');
    });

    it('forest theme should use green tones', () => {
      const forest = baseThemes.forest;
      expect(forest.primaryColor).toContain('7C2C');
      expect(forest.textColor).toBe('#FFFFFF');
    });

    it('sunset theme should use warm colors', () => {
      const sunset = baseThemes.sunset;
      expect(sunset.colors).toContain('#E63946');
      expect(sunset.colors).toContain('#F77F00');
    });

    it('ocean theme should use blue tones', () => {
      const ocean = baseThemes.ocean;
      expect(ocean.primaryColor).toContain('496FF');
      expect(ocean.backgroundColor).toBe('#F0F8FF');
    });

    it('monochrome theme should use grayscale', () => {
      const monochrome = baseThemes.monochrome;
      expect(monochrome.textColor).toBe('#FFFFFF');
      expect(monochrome.primaryColor).toBe('#4D4D4D');
    });

    it('should have at least 6 themes', () => {
      const themeCount = Object.keys(baseThemes).length;
      expect(themeCount).toBeGreaterThanOrEqual(6);
    });

    it('should export themes as a record', () => {
      expect(typeof baseThemes).toBe('object');
      expect(baseThemes).not.toBeNull();
    });
  });
});
