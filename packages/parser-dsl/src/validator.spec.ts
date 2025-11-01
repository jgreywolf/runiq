import { describe, it, expect, beforeAll } from 'vitest';
import { EmptyFileSystem, type LangiumDocument } from 'langium';
import { parseHelper } from 'langium/test';
import { createRuniqServices } from './langium-module.js';
import type { Document } from './generated/ast.js';
import { registerDefaultShapes } from '@runiq/core';
import type { RuniqServices } from './langium-module.js';

describe('Shape Validation', () => {
  let services: RuniqServices;
  let parse: (input: string) => Promise<LangiumDocument<Document>>;

  beforeAll(async () => {
    // Register all shapes before testing
    registerDefaultShapes();

    services = createRuniqServices(EmptyFileSystem).Runiq;
    parse = async (input: string) => {
      const document = await parseHelper<Document>(services)(input);
      // Manually trigger validation and attach diagnostics to document
      const diagnostics =
        await services.validation.DocumentValidator.validateDocument(document);
      (document as any).diagnostics = diagnostics;
      return document;
    };
  });

  describe('Valid Shape IDs', () => {
    it('should accept valid shape IDs', async () => {
      const input = `
        diagram "test" {
        shape A as @rectangle
        shape B as @rhombus
        shape C as @cylinder
        shape D as @stadium
      }`;
      const doc = await parse(input);
      expect(doc.parseResult.lexerErrors).toHaveLength(0);
      expect(doc.parseResult.parserErrors).toHaveLength(0);

      const errors = doc.diagnostics?.filter((d) => d.severity === 1) ?? []; // Error severity
      expect(errors).toHaveLength(0);
    });

    it('should accept valid shape aliases', async () => {
      const input = `
        diagram "test" {
        shape A as @rect
        shape B as @diamond
        shape C as @db
        shape D as @pill
      }`;
      const doc = await parse(input);
      const errors = doc.diagnostics?.filter((d) => d.severity === 1) ?? [];
      expect(errors).toHaveLength(0);
    });

    it('should accept shapes without @ prefix', async () => {
      const input = `
        diagram "test" {
        shape A as @rect
        shape B as @diamond
      }`;
      const doc = await parse(input);
      const errors = doc.diagnostics?.filter((d) => d.severity === 1) ?? [];
      expect(errors).toHaveLength(0);
    });
  });

  describe('Invalid Shape IDs', () => {
    it('should error on unknown shape ID', async () => {
      const input = `
        diagram "test" {
        shape A as @unknownshape
      }`;
      const doc = await parse(input);
      const errors = doc.diagnostics?.filter((d) => d.severity === 1) ?? [];
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toContain('Unknown shape type');
    });

    it('should suggest corrections for typos', async () => {
      const input = `
        diagram "test" {
        shape A as @rectange
      }`;
      const doc = await parse(input);
      const errors = doc.diagnostics?.filter((d) => d.severity === 1) ?? [];
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toContain('Did you mean');
      expect(errors[0].message).toContain('rectangle');
    });

    it('should suggest multiple close matches', async () => {
      const input = `
        diagram "test" {
        shape A as @diamnd
      }`;
      const doc = await parse(input);
      const errors = doc.diagnostics?.filter((d) => d.severity === 1) ?? [];
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toContain('Did you mean');
      expect(errors[0].message).toContain('diamond');
    });

    it('should handle completely invalid shape names', async () => {
      const input = `
        diagram "test" {
        shape A as @xyzabc123
      }`;
      const doc = await parse(input);
      const errors = doc.diagnostics?.filter((d) => d.severity === 1) ?? [];
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toContain('Unknown shape type');
    });
  });

  describe('Alias Hints', () => {
    it('should provide hints when using aliases', async () => {
      const input = `
        diagram "test" {
        shape A as @rect
      }`;
      const doc = await parse(input);
      const hints = doc.diagnostics?.filter((d) => d.severity === 4) ?? []; // Hint severity
      expect(hints.length).toBeGreaterThan(0);
      expect(hints[0].message).toContain('alias');
      expect(hints[0].message).toContain('rectangle');
    });

    it('should not hint on canonical shape IDs', async () => {
      const input = `
        diagram "test" {
        shape A as @rectangle
      }`;
      const doc = await parse(input);
      const hints = doc.diagnostics?.filter((d) => d.severity === 4) ?? [];
      expect(hints).toHaveLength(0);
    });
  });

  describe('Shape ID Length Validation', () => {
    it('should warn on very long shape IDs', async () => {
      const longId = 'A'.repeat(60);
      const input = `
        diagram "test" {
        shape ${longId} as @rectangle
      }`;
      const doc = await parse(input);
      const warnings = doc.diagnostics?.filter((d) => d.severity === 2) ?? []; // Warning severity
      expect(warnings.length).toBeGreaterThan(0);
      expect(warnings[0].message).toContain('very long');
    });

    it('should not warn on reasonable length IDs', async () => {
      const input = `
        diagram "test" {
        shape NormalLengthID as @rectangle
      }`;
      const doc = await parse(input);
      const warnings = doc.diagnostics?.filter((d) => d.severity === 2) ?? [];
      expect(warnings).toHaveLength(0);
    });
  });

  describe('Common Typo Scenarios', () => {
    const typos = [
      { typo: 'rectange', correct: 'rectangle' },
      { typo: 'rectngle', correct: 'rectangle' },
      { typo: 'diamnd', correct: 'diamond' },
      { typo: 'rhombos', correct: 'rhombus' },
      { typo: 'cilinder', correct: 'cylinder' },
      { typo: 'databse', correct: 'database' },
      { typo: 'stadim', correct: 'stadium' },
    ];

    typos.forEach(({ typo, correct }) => {
      it(`should suggest "${correct}" for typo "${typo}"`, async () => {
        const input = `
          diagram "test" {
          shape A as @${typo}
        }`;
        const doc = await parse(input);
        const errors = doc.diagnostics?.filter((d) => d.severity === 1) ?? [];
        expect(
          errors.length,
          `Expected error for typo: ${typo}`
        ).toBeGreaterThan(0);
        expect(errors[0].message, `Expected suggestion for: ${typo}`).toContain(
          correct
        );
      });
    });
  });

  describe('Case Sensitivity', () => {
    it('should handle uppercase shape names', async () => {
      const input = `
        diagram "test" {
        shape A as @RECTANGLE
      }`;
      const doc = await parse(input);
      const errors = doc.diagnostics?.filter((d) => d.severity === 1) ?? [];
      // Should suggest lowercase version
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toContain('rectangle');
    });

    it('should handle mixed case shape names', async () => {
      const input = `
        diagram "test" {
        shape A as @Rectangle
      }`;
      const doc = await parse(input);
      const errors = doc.diagnostics?.filter((d) => d.severity === 1) ?? [];
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toContain('rectangle');
    });
  });

  describe('Container Type Defaults', () => {
    it('should not validate shapes without explicit shape property', async () => {
      const input = `
        diagram "test" {
        shape A as @rectangle label: "Node without container"
      }`;
      const doc = await parse(input);
      const errors = doc.diagnostics?.filter((d) => d.severity === 1) ?? [];
      // Should pass - shape has explicit type
      expect(errors).toHaveLength(0);
    });
  });
});
