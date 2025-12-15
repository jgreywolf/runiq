import { ProfileType } from '@runiq/core';
import { describe, expect, it } from 'vitest';
import { parse } from './langium-parser.js';

describe('langium-parser', () => {
  describe('parse() - Basic Functionality', () => {
    it('should parse valid diagram DSL', () => {
      const dsl = `
        diagram "Test Diagram" {
          A -> B
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.document).toBeDefined();
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it('should return RuniqDocument with correct structure', () => {
      const dsl = `diagram "Test" { A -> B }`;
      const result = parse(dsl);

      expect(result.document).toBeDefined();
      expect(result.document?.astVersion).toBe('1.0');
      expect(result.document?.profiles).toBeInstanceOf(Array);
    });

    it('should parse empty diagram', () => {
      const dsl = `diagram "Empty" {}`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.document?.profiles).toHaveLength(1);
    });

    it('should parse diagram with multiple nodes and edges', () => {
      const dsl = `
        diagram "Multi" {
          A -> B
          B -> C
          C -> D
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.document?.profiles[0]).toBeDefined();
    });
  });

  describe('parse() - Error Handling', () => {
    it('should return errors for invalid syntax', () => {
      const dsl = `diagram "Bad" { @@@ }`;
      const result = parse(dsl);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return errors for unclosed braces', () => {
      const dsl = `diagram "Unclosed" { A -> B`;
      const result = parse(dsl);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should report lexer errors with location', () => {
      const dsl = `diagram "Test" { A -> $invalid }`;
      const result = parse(dsl);

      expect(result.success).toBe(false);
      expect(result.errors.some((e) => e.includes('line'))).toBe(true);
    });

    it('should handle empty input', () => {
      const dsl = '';
      const result = parse(dsl);

      // Empty input is valid - just has no profiles
      expect(result.success).toBe(true);
      expect(result.document?.profiles).toHaveLength(0);
    });

    it('should handle whitespace-only input', () => {
      const dsl = '   \n  \t  \n  ';
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.document?.profiles).toHaveLength(0);
    });
  });

  describe('parse() - Profile Type Routing', () => {
    it('should route diagram profile correctly', () => {
      const dsl = `diagram "Test" { A -> B }`;
      const result = parse(dsl);

      expect(result.document?.profiles[0]?.type).toBe(ProfileType.DIAGRAM);
    });

    it('should route sequence profile correctly', () => {
      const dsl = `
        sequence "Test Sequence" {
          participant "User" as actor
          participant "System" as entity
        }
      `;
      const result = parse(dsl);

      expect(result.document?.profiles[0]?.type).toBe(ProfileType.SEQUENCE);
    });

    it('should route electrical profile correctly', () => {
      const dsl = `
        electrical "Circuit" {
          net VCC, GND
        }
      `;
      const result = parse(dsl);

      expect(result.document?.profiles[0]?.type).toBe(ProfileType.ELECTRICAL);
    });

    it('should route timeline profile correctly', () => {
      const dsl = `
        timeline "Project Timeline" {
          event E1 date:"2024-01-01" label:"Start"
        }
      `;
      const result = parse(dsl);

      expect(result.document?.profiles[0]?.type).toBe(ProfileType.TIMELINE);
    });

    it('should route wardley profile correctly', () => {
      const dsl = `
        wardley "Strategy Map" {
          anchor "Customer" value:0.95
          component "Product" evolution:0.5 value:0.8
        }
      `;
      const result = parse(dsl);

      expect(result.document?.profiles[0]?.type).toBe(ProfileType.WARDLEY);
    });

    it('should route digital profile correctly', () => {
      const dsl = `
        digital "Logic Circuit" {
          net A, B, OUT
        }
      `;
      const result = parse(dsl);

      expect(result.document?.profiles[0]?.type).toBe(ProfileType.DIGITAL);
    });
  });

  describe('parse() - Multi-Profile Documents', () => {
    it('should parse document with multiple diagram profiles', () => {
      const dsl = `
        diagram "First" { A -> B }
        diagram "Second" { C -> D }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.document?.profiles).toHaveLength(2);
      expect(result.document?.profiles[0]?.name).toBe('First');
      expect(result.document?.profiles[1]?.name).toBe('Second');
    });

    it('should parse document with mixed profile types', () => {
      const dsl = `
        diagram "Architecture" { A -> B }
        sequence "Flow" {
          participant "User" as actor
        }
        timeline "Schedule" {
          event E1 date:"2024-01-01" label:"M1"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.document?.profiles).toHaveLength(3);
      expect(result.document?.profiles[0]?.type).toBe(ProfileType.DIAGRAM);
      expect(result.document?.profiles[1]?.type).toBe(ProfileType.SEQUENCE);
      expect(result.document?.profiles[2]?.type).toBe(ProfileType.TIMELINE);
    });

    it('should maintain profile order', () => {
      const dsl = `
        diagram "D1" {}
        diagram "D2" {}
        diagram "D3" {}
      `;
      const result = parse(dsl);

      const names = result.document?.profiles.map((p) => p.name) ?? [];
      expect(names).toEqual(['D1', 'D2', 'D3']);
    });
  });

  describe('parse() - GlyphSet Expansion', () => {
    it('should expand glyphset to diagram profile', () => {
      const dsl = `
        glyphset basicList "Task List" {
          item "Task 1"
          item "Task 2"
          item "Task 3"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.document?.profiles).toHaveLength(1);
      expect(result.document?.profiles[0]?.type).toBe(ProfileType.DIAGRAM);
      expect(result.document?.profiles[0]?.name).toBe('Task List');
    });

    it('should expand glyphset with theme parameter', () => {
      const dsl = `
        glyphset basicList "Styled List" {
          item "A"
          item "B"
          theme "ocean"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.document?.profiles[0]?.type).toBe(ProfileType.DIAGRAM);
    });
  });

  describe('parse() - Backwards Compatibility', () => {
    it('should expose first diagram profile as diagram property', () => {
      const dsl = `diagram "Test" { A -> B }`;
      const result = parse(dsl);

      expect(result.diagram).toBeDefined();
      expect(result.diagram?.title).toBe('Test');
      expect(result.diagram?.astVersion).toBe('1.0');
    });

    it('should not expose diagram if first profile is not diagram', () => {
      const dsl = `
        sequence "Seq" {
          actor A
        }
      `;
      const result = parse(dsl);

      expect(result.diagram).toBeUndefined();
    });

    it('should expose only first diagram even with multiple diagrams', () => {
      const dsl = `
        diagram "First" { A -> B }
        diagram "Second" { C -> D }
      `;
      const result = parse(dsl);

      expect(result.diagram).toBeDefined();
      expect(result.diagram?.title).toBe('First');
    });

    it('should map name to title in diagram property', () => {
      const dsl = `diagram "My Diagram" { A -> B }`;
      const result = parse(dsl);

      expect(result.diagram?.title).toBe('My Diagram');
      expect(result.document?.profiles[0]?.name).toBe('My Diagram');
    });
  });

  describe('parse() - Node Locations', () => {
    it('should extract node locations from CST', () => {
      const dsl = `diagram "Test" { A -> B }`;
      const result = parse(dsl);

      expect(result.nodeLocations).toBeDefined();
      expect(result.nodeLocations).toBeInstanceOf(Map);
    });

    it('should track multiple node locations', () => {
      const dsl = `
        diagram "Test" {
          A -> B
          B -> C
          C -> D
        }
      `;
      const result = parse(dsl);

      expect(result.nodeLocations).toBeDefined();
      // Node locations should include A, B, C, D
      expect(result.nodeLocations!.size).toBeGreaterThan(0);
    });
  });

  describe('parse() - Complex Scenarios', () => {
    it('should parse diagram with direction declaration', () => {
      const dsl = `
        diagram "Test" {
          direction LR
          A -> B
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const profile = result.document?.profiles[0];
      if (profile && profile.type === ProfileType.DIAGRAM) {
        expect(profile.direction).toBe('LR');
      }
    });

    it('should parse diagram with routing declaration', () => {
      const dsl = `
        diagram "Test" {
          routing orthogonal
          A -> B
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
    });

    it('should parse diagram with containers', () => {
      const dsl = `
        diagram "Test" {
          container "System" {
            shape A
            shape B
            A -> B
          }
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
    });

    it('should parse diagram with groups', () => {
      const dsl = `
        diagram "Test" {
          group "Layer1" {
            shape A
            shape B
          }
          A -> B
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
    });

    it('should parse comments without errors', () => {
      const dsl = `
        // This is a comment
        diagram "Test" {
          // Another comment
          A -> B // Inline comment
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
    });
  });

  describe('parse() - Return Values', () => {
    it('should always return success flag', () => {
      const result = parse('diagram "Test" {}');
      expect(result).toHaveProperty('success');
      expect(typeof result.success).toBe('boolean');
    });

    it('should always return errors array', () => {
      const result = parse('diagram "Test" {}');
      expect(result.errors).toBeInstanceOf(Array);
    });

    it('should always return warnings array', () => {
      const result = parse('diagram "Test" {}');
      expect(result.warnings).toBeInstanceOf(Array);
    });

    it('should return document on success', () => {
      const result = parse('diagram "Test" {}');
      expect(result.document).toBeDefined();
    });

    it('should not return document on failure', () => {
      const result = parse('invalid @@@');
      expect(result.document).toBeUndefined();
    });
  });
});
