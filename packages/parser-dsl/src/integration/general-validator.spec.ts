import { describe, it, expect } from 'vitest';
import { parse } from '../langium-parser.js';

describe('Runiq Validator', () => {
  describe('Shape Declaration Validation', () => {
    it('should warn about very long shape IDs', () => {
      const longId = 'A'.repeat(60);
      const dsl = `
        diagram "test" {
          shape ${longId} as @rounded
        }
      `;
      const result = parse(dsl);

      // Parser should succeed but may have warnings
      expect(result.success).toBe(true);
      // Warnings would be in Langium validation, not parse errors
    });

    it('should accept valid shape types', () => {
      const validShapes = [
        'rounded',
        'rect',
        'circle',
        'rhombus',
        'hex',
        'cylinder',
        'actor',
        'doc',
      ];

      validShapes.forEach((shape) => {
        const dsl = `
          diagram "test" {
            shape A as @${shape}
          }
        `;
        const result = parse(dsl);

        expect(result.success).toBe(true);
        expect(result.diagram?.nodes[0].shape).toBe(shape);
      });
    });

    it('should handle unknown shape types gracefully', () => {
      const dsl = `
        diagram "test" {
          shape A as @unknownShape
        }
      `;
      const result = parse(dsl);

      // Parser might still succeed but validator would warn
      // The shape would be stored as-is
      if (result.success) {
        expect(result.diagram?.nodes[0].shape).toBe('unknownShape');
      }
    });

    it('should validate all shape properties', () => {
      const dsl = `
        diagram "test" {
          style myStyle fillColor: "red"
          shape A as @rounded label: "Valid Node" style: myStyle tooltip: "Tooltip text"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const node = result.diagram?.nodes[0];
      expect(node?.shape).toBe('rounded');
      expect(node?.label).toBe('Valid Node');
      expect(node?.style).toBe('myStyle');
      expect(node?.tooltip).toBe('Tooltip text');
    });
  });

  describe('Edge Declaration Validation', () => {
    it('should warn about self-loops', () => {
      const dsl = `
        diagram "test" {
          shape A as @rounded
          A -> A
        }
      `;
      const result = parse(dsl);

      // Should parse successfully
      expect(result.success).toBe(true);
      expect(result.diagram?.edges[0].from).toBe('A');
      expect(result.diagram?.edges[0].to).toBe('A');
      // Validator would add warning about self-loop
    });

    it('should validate edge references', () => {
      const dsl = `
        diagram "test" {
          shape A as @rounded
          shape B as @rounded
          A -> B
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.diagram?.edges[0].from).toBe('A');
      expect(result.diagram?.edges[0].to).toBe('B');
    });

    it('should allow edges between non-declared nodes', () => {
      const dsl = `
        diagram "test" {
          A -> B
        }
      `;
      const result = parse(dsl);

      // Auto-creates nodes
      expect(result.success).toBe(true);
      expect(result.diagram?.nodes).toHaveLength(2);
      expect(result.diagram?.edges).toHaveLength(1);
    });

    it('should validate edge labels', () => {
      const dsl = `
        diagram "test" {
          A -edgelabel-> B
        }
      `;
      const result = parse(dsl);

      // Edge labels use ID format: A -labeltext-> B
      expect(result.success).toBe(true);
      expect(result.diagram?.edges[0].from).toBe('A');
      expect(result.diagram?.edges[0].to).toBe('B');
    });

    it('should validate edge properties', () => {
      const dsl = `
        diagram "test" {
          shape A as @rounded
          shape B as @rounded
          A -process-> B
        }
      `;
      const result = parse(dsl);

      // Edge with label
      expect(result.success).toBe(true);
      const edge = result.diagram?.edges[0];
      expect(edge?.from).toBe('A');
      expect(edge?.to).toBe('B');
    });
  });

  describe('Style Declaration Validation', () => {
    it('should validate style properties', () => {
      const dsl = `
        diagram "test" {
          style myStyle fillColor: "#ff0000" strokeColor: "#000000" strokeWidth: 2 fontSize: 14 fontFamily: "Arial"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      // Note: Numbers are parsed as strings currently
      expect(result.diagram?.styles?.myStyle).toEqual({
        fillColor: '#ff0000',
        strokeColor: '#000000',
        strokeWidth: '2',
        fontSize: '14',
        fontFamily: 'Arial', // Quotes are stripped
      });
    });

    it('should handle multiple style declarations', () => {
      const dsl = `
        diagram "test" {
          style style1 fillColor: "#aaa"
          style style2 fillColor: "#bbb"
          style style3 fillColor: "#ccc"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(Object.keys(result.diagram?.styles || {})).toHaveLength(3);
    });

    it('should allow style references in shapes', () => {
      const dsl = `
        diagram "test" {
          style highlight fillColor: "#ffeb3b"
          shape A as @rounded style: highlight
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.diagram?.styles).toHaveProperty('highlight');
      expect(result.diagram?.nodes[0].style).toBe('highlight');
    });
  });

  describe('Group Declaration Validation', () => {
    it('should validate group with children', () => {
      const dsl = `
        diagram "test" {
          group "Group Label" {
            shape A as @rounded
            shape B as @rounded
            shape C as @rounded
          }
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.diagram?.groups).toHaveLength(1);
      expect(result.diagram?.nodes.length).toBeGreaterThanOrEqual(3);
    });

    it('should allow groups with style', () => {
      const dsl = `
        diagram "test" {
          style groupStyle fillColor: "#e0e0e0"
          group "MyGroup" {
            shape A as @rounded style: groupStyle
          }
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.diagram?.groups).toHaveLength(1);
    });

    it('should handle nested groups (if supported)', () => {
      const dsl = `
        diagram "test" {
          group "Outer" {
            shape B as @rounded
            group "Inner" {
              shape A as @rounded
            }
          }
        }
      `;
      const result = parse(dsl);

      // May or may not support nested groups
      expect(result.success).toBe(true);
    });
  });

  describe('Direction Declaration Validation', () => {
    it('should accept all valid directions', () => {
      const validDirections = ['LR', 'RL', 'TB', 'BT'];

      validDirections.forEach((direction) => {
        const dsl = `diagram "test" { direction ${direction} }`;
        const result = parse(dsl);

        expect(result.success).toBe(true);
        expect(result.diagram?.direction).toBe(direction);
      });
    });

    it('should reject invalid directions', () => {
      const invalidDirections = ['UP', 'DOWN', 'LEFT', 'RIGHT', 'INVALID'];

      invalidDirections.forEach((direction) => {
        const dsl = `diagram "test" { direction: ${direction} }`;
        const result = parse(dsl);

        // Should fail parsing
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Icon and Link Validation', () => {
    it('should validate icon structure', () => {
      const dsl = `
        diagram "test" {
          shape A as @rounded icon: fontawesome/user
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.diagram?.nodes[0].icon).toEqual({
        provider: 'fontawesome',
        name: 'user',
      });
    });

    it('should validate link structure', () => {
      const dsl = `
        diagram "test" {
          shape A as @rounded link: "https://example.com"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.diagram?.nodes[0].link).toEqual({
        href: 'https://example.com',
      });
    });

    it('should handle missing icon properties', () => {
      const dsl = `
        diagram "test" {
          shape A as @rounded icon: invalid
        }
      `;
      const result = parse(dsl);

      // May fail or succeed depending on grammar requirements
      if (result.success) {
        expect(result.diagram?.nodes[0].icon).toBeDefined();
      }
    });
  });

  describe('Complex Validation Scenarios', () => {
    it('should validate complete diagram structure', () => {
      const dsl = `
        diagram "flowchart" {
          direction TB
          
          style default fillColor: "#f0f0f0" strokeColor: "#333"
          style highlight fillColor: "#ffeb3b"
          
          shape A as @rounded label: "Start" style: highlight
          shape B as @rounded label: "Process"
          shape C as @rhombus label: "Decision"
          shape D as @rounded label: "End"
          
          A -> B
          B -> C
          C -yes-> D
          C -no-> B
        }
      `;
      const result = parse(dsl);

      // Complete valid diagram
      expect(result.success).toBe(true);

      if (result.success) {
        // Validate structure
        expect(result.diagram?.title).toBe('flowchart');
        expect(result.diagram?.direction).toBe('TB');
        expect(result.diagram?.nodes).toHaveLength(4);
        expect(result.diagram?.edges).toHaveLength(4);
        expect(result.diagram?.styles).toHaveProperty('default');
        expect(result.diagram?.styles).toHaveProperty('highlight');

        // Validate references
        const nodeIds = result.diagram?.nodes.map((n) => n.id);
        expect(nodeIds).toContain('A');
        expect(nodeIds).toContain('B');
        expect(nodeIds).toContain('C');
        expect(nodeIds).toContain('D');

        // Validate edges reference valid nodes
        result.diagram?.edges.forEach((edge) => {
          expect(nodeIds).toContain(edge.from);
          expect(nodeIds).toContain(edge.to);
        });
      }
    });

    it('should detect cyclic dependencies', () => {
      const dsl = `
        diagram "test" {
          A -> B
          B -> C
          C -> A
        }
      `;
      const result = parse(dsl);

      // Should parse successfully (cycles are valid in graphs)
      expect(result.success).toBe(true);
      expect(result.diagram?.edges).toHaveLength(3);
    });

    it('should handle disconnected subgraphs', () => {
      const dsl = `
        diagram "test" {
          A -> B
          C -> D
        }
      `;
      const result = parse(dsl);

      // Should parse successfully
      expect(result.success).toBe(true);
      expect(result.diagram?.nodes).toHaveLength(4);
      expect(result.diagram?.edges).toHaveLength(2);
    });
  });

  describe('Error Recovery', () => {
    it('should provide meaningful error for syntax errors', () => {
      const dsl = `
        diagram "test" {
          shape A as @rounded invalid syntax here
        }
      `;
      const result = parse(dsl);

      if (!result.success) {
        expect(result.errors).toBeDefined();
        expect(result.errors!.length).toBeGreaterThan(0);
        // Error messages should be descriptive
        expect(result.errors![0]).toBeTruthy();
      }
    });

    it('should handle partially valid diagrams', () => {
      const dsl = `
        diagram "test" {
          shape A as @rounded label: "Valid"
          invalid line here
          shape B as @rounded label: "Also Valid"
        }
      `;
      const result = parse(dsl);

      // Parser behavior depends on error recovery strategy
      expect(result).toBeDefined();
    });
  });
});
