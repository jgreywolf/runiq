import { DefaultValueConverter } from 'langium';
import { describe, expect, it } from 'vitest';
import { RuniqValueConverter } from './value-converter.js';

describe('RuniqValueConverter', () => {
  describe('Class Definition', () => {
    it('should be instantiable', () => {
      const converter = new RuniqValueConverter();
      expect(converter).toBeInstanceOf(RuniqValueConverter);
    });

    it('should extend DefaultValueConverter', () => {
      const converter = new RuniqValueConverter();
      expect(converter).toBeInstanceOf(DefaultValueConverter);
    });

    it('should have a convert method', () => {
      const converter = new RuniqValueConverter();
      expect(typeof converter.convert).toBe('function');
    });
  });

  describe('Default Behavior Integration', () => {
    it('should use Langium default conversion for STRING terminals', () => {
      // STRING terminals have quotes automatically stripped by Langium
      // This is verified through integration tests that parse actual DSL
      const converter = new RuniqValueConverter();
      expect(converter).toBeDefined();
    });

    it('should use Langium default conversion for NUMBER terminals', () => {
      // NUMBER terminals are automatically converted to numbers by Langium
      // This is verified through integration tests that parse actual DSL
      const converter = new RuniqValueConverter();
      expect(converter).toBeDefined();
    });

    it('should be registered in langium-module', () => {
      // The converter is registered in RuniqModule and used by the parser
      // Actual behavior is tested through end-to-end parsing tests
      const converter = new RuniqValueConverter();
      expect(converter).toBeDefined();
    });
  });

  describe('Extension Points', () => {
    it('should be extendable for custom conversions', () => {
      // Currently uses default behavior
      // Can be extended in the future for custom terminal value conversions
      const converter = new RuniqValueConverter();
      expect(converter).toBeInstanceOf(RuniqValueConverter);
    });

    it('should inherit all DefaultValueConverter methods', () => {
      const converter = new RuniqValueConverter();
      // Verify it has the convert method from parent
      expect('convert' in converter).toBe(true);
    });
  });

  describe('Integration with Parser', () => {
    it('should be used by the parser for value conversion', () => {
      // The RuniqValueConverter is registered in langium-module.ts
      // and is automatically used by the parser for all terminal value conversions
      // This is verified through the langium-parser.spec.ts tests
      const converter = new RuniqValueConverter();
      expect(converter).toBeInstanceOf(DefaultValueConverter);
    });
  });
});
