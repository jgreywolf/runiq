import { describe, it, expect } from 'vitest';
import { FontAwesomeProvider, fontAwesome } from '../index.js';

describe('icons-fontawesome', () => {
  describe('FontAwesomeProvider', () => {
    it('should have correct id', () => {
      const provider = new FontAwesomeProvider();
      expect(provider.id).toBe('fa');
    });

    it('should export singleton instance', () => {
      expect(fontAwesome).toBeInstanceOf(FontAwesomeProvider);
      expect(fontAwesome.id).toBe('fa');
    });

    it('should return icon path for user', () => {
      const provider = new FontAwesomeProvider();
      const icon = provider.getPath('user');

      expect(icon).toBeDefined();
      expect(icon?.d).toContain('M224 256A128 128');
      expect(icon?.viewBox).toBe('0 0 448 512');
    });

    it('should return icon path for dollar', () => {
      const provider = new FontAwesomeProvider();
      const icon = provider.getPath('dollar');

      expect(icon).toBeDefined();
      expect(icon?.d).toContain('M160 0c17.7 0 32');
      expect(icon?.viewBox).toBe('0 0 320 512');
    });

    it('should return icon path for home', () => {
      const provider = new FontAwesomeProvider();
      const icon = provider.getPath('home');

      expect(icon).toBeDefined();
      expect(icon?.d).toContain('M575.8 255.5c0 18');
      expect(icon?.viewBox).toBe('0 0 576 512');
    });

    it('should return icon path for check', () => {
      const provider = new FontAwesomeProvider();
      const icon = provider.getPath('check');

      expect(icon).toBeDefined();
      expect(icon?.d).toContain('M438.6 105.4c12.5');
      expect(icon?.viewBox).toBe('0 0 448 512');
    });

    it('should return undefined for unknown icon', () => {
      const provider = new FontAwesomeProvider();
      const icon = provider.getPath('nonexistent');

      expect(icon).toBeUndefined();
    });

    it('should have viewBox in correct format', () => {
      const provider = new FontAwesomeProvider();
      const icons = ['user', 'dollar', 'home', 'check'];

      icons.forEach((iconName) => {
        const icon = provider.getPath(iconName);
        expect(icon?.viewBox).toMatch(/^0 0 \d+ \d+$/);
      });
    });

    it('should have non-empty path data', () => {
      const provider = new FontAwesomeProvider();
      const icons = ['user', 'dollar', 'home', 'check'];

      icons.forEach((iconName) => {
        const icon = provider.getPath(iconName);
        expect(icon?.d.length).toBeGreaterThan(10);
      });
    });

    it('should implement IconProvider interface', () => {
      const provider = new FontAwesomeProvider();

      expect(provider.id).toBeDefined();
      expect(typeof provider.id).toBe('string');
      expect(typeof provider.getPath).toBe('function');
    });

    it('should return consistent results for same icon', () => {
      const provider = new FontAwesomeProvider();
      const icon1 = provider.getPath('user');
      const icon2 = provider.getPath('user');

      expect(icon1).toEqual(icon2);
    });
  });
});
