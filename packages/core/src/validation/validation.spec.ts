import { describe, expect, it } from 'vitest';
import type { DiagramAst } from '../types/index.js';
import {
  DIAGRAM_TYPE_CONSTRAINTS,
  listDiagramTypes,
  validateDiagramType,
} from './validation.js';

describe('validation', () => {
  describe('DIAGRAM_TYPE_CONSTRAINTS', () => {
    it('should define flowchart constraints', () => {
      expect(DIAGRAM_TYPE_CONSTRAINTS.flowchart).toBeDefined();
      expect(DIAGRAM_TYPE_CONSTRAINTS.flowchart.type).toBe('flowchart');
      expect(DIAGRAM_TYPE_CONSTRAINTS.flowchart.allowedShapes).toContain(
        'rounded'
      );
    });

    it('should define sequence constraints', () => {
      expect(DIAGRAM_TYPE_CONSTRAINTS.sequence).toBeDefined();
      expect(DIAGRAM_TYPE_CONSTRAINTS.sequence.type).toBe('sequence');
    });

    it('should define entity-relationship constraints', () => {
      expect(DIAGRAM_TYPE_CONSTRAINTS['entity-relationship']).toBeDefined();
    });

    it('should have descriptions for all types', () => {
      Object.values(DIAGRAM_TYPE_CONSTRAINTS).forEach((constraint) => {
        expect(constraint.description).toBeDefined();
        expect(constraint.description.length).toBeGreaterThan(0);
      });
    });

    it('should have allowedShapes for all types', () => {
      Object.values(DIAGRAM_TYPE_CONSTRAINTS).forEach((constraint) => {
        expect(Array.isArray(constraint.allowedShapes)).toBe(true);
      });
    });
  });

  describe('validateDiagramType', () => {
    const createBasicAst = (): DiagramAst => ({
      astVersion: '1.0',
      nodes: [],
      edges: [],
    });

    describe('generic type', () => {
      it('should always be valid for generic type', () => {
        const ast = createBasicAst();
        ast.nodes = [
          { id: 'n1', shape: 'any-shape', label: 'Test' },
          { id: 'n2', shape: 'another-shape', label: 'Test 2' },
        ];
        const result = validateDiagramType(ast, 'generic');
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should be valid when no type specified', () => {
        const ast = createBasicAst();
        ast.nodes = [{ id: 'n1', shape: 'unknown', label: 'Test' }];
        const result = validateDiagramType(ast);
        expect(result.valid).toBe(true);
      });
    });

    describe('unknown diagram type', () => {
      it('should return error for unknown type', () => {
        const ast = createBasicAst();
        const result = validateDiagramType(ast, 'unknown-type' as any);
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].message).toContain('Unknown diagram type');
      });
    });

    describe('shape validation', () => {
      it('should accept allowed shapes for flowchart', () => {
        const ast = createBasicAst();
        ast.nodes = [{ id: 'n1', shape: 'rounded', label: 'Process' }];
        const result = validateDiagramType(ast, 'flowchart');
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should reject disallowed shapes for flowchart', () => {
        const ast = createBasicAst();
        ast.nodes = [{ id: 'n1', shape: 'invalid-shape', label: 'Test' }];
        const result = validateDiagramType(ast, 'flowchart');
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].message).toContain('not allowed');
        expect(result.errors[0].nodeId).toBe('n1');
      });

      it('should validate multiple nodes', () => {
        const ast = createBasicAst();
        ast.nodes = [
          { id: 'n1', shape: 'rounded', label: 'Valid' },
          { id: 'n2', shape: 'invalid', label: 'Invalid' },
          { id: 'n3', shape: 'rhombus', label: 'Valid' },
        ];
        const result = validateDiagramType(ast, 'flowchart');
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].nodeId).toBe('n2');
      });
    });

    describe('duplicate node ID validation', () => {
      it('should detect duplicate node IDs', () => {
        const ast = createBasicAst();
        ast.nodes = [
          { id: 'n1', shape: 'rounded', label: 'First' },
          { id: 'n1', shape: 'rounded', label: 'Duplicate' },
        ];
        const result = validateDiagramType(ast, 'flowchart');
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.message.includes('Duplicate'))).toBe(
          true
        );
      });

      it('should accept unique node IDs', () => {
        const ast = createBasicAst();
        ast.nodes = [
          { id: 'n1', shape: 'rounded', label: 'First' },
          { id: 'n2', shape: 'rounded', label: 'Second' },
        ];
        const result = validateDiagramType(ast, 'flowchart');
        expect(result.valid).toBe(true);
      });
    });

    describe('edge validation', () => {
      it('should warn about edges referencing non-existent nodes', () => {
        const ast = createBasicAst();
        ast.nodes = [{ id: 'n1', shape: 'rounded', label: 'Node 1' }];
        ast.edges = [{ from: 'n1', to: 'n2' }];
        const result = validateDiagramType(ast, 'flowchart');
        expect(result.warnings).toHaveLength(1);
        expect(result.warnings[0].message).toContain('non-existent node: n2');
      });

      it('should warn about edges with non-existent from node', () => {
        const ast = createBasicAst();
        ast.nodes = [{ id: 'n1', shape: 'rounded', label: 'Node 1' }];
        ast.edges = [{ from: 'n0', to: 'n1' }];
        const result = validateDiagramType(ast, 'flowchart');
        expect(result.warnings).toHaveLength(1);
        expect(result.warnings[0].message).toContain('non-existent node: n0');
      });

      it('should accept valid edges', () => {
        const ast = createBasicAst();
        ast.nodes = [
          { id: 'n1', shape: 'rounded', label: 'Node 1' },
          { id: 'n2', shape: 'rounded', label: 'Node 2' },
        ];
        ast.edges = [{ from: 'n1', to: 'n2' }];
        const result = validateDiagramType(ast, 'flowchart');
        expect(result.warnings).toHaveLength(0);
      });
    });

    describe('group validation', () => {
      it('should validate groups reference existing nodes', () => {
        const ast = createBasicAst();
        ast.nodes = [{ id: 'n1', shape: 'rounded', label: 'Node 1' }];
        ast.groups = [{ id: 'g1', label: 'Group 1', children: ['n1', 'n2'] }];
        const result = validateDiagramType(ast, 'flowchart');
        expect(result.valid).toBe(false);
        expect(
          result.errors.some((e) =>
            e.message.includes('references non-existent node: n2')
          )
        ).toBe(true);
      });

      it('should accept valid groups', () => {
        const ast = createBasicAst();
        ast.nodes = [
          { id: 'n1', shape: 'rounded', label: 'Node 1' },
          { id: 'n2', shape: 'rounded', label: 'Node 2' },
        ];
        ast.groups = [{ id: 'g1', label: 'Group 1', children: ['n1', 'n2'] }];
        const result = validateDiagramType(ast, 'flowchart');
        expect(result.errors).toHaveLength(0);
      });

      it('should handle multiple groups', () => {
        const ast = createBasicAst();
        ast.nodes = [
          { id: 'n1', shape: 'rounded', label: 'Node 1' },
          { id: 'n2', shape: 'rounded', label: 'Node 2' },
        ];
        ast.groups = [
          { id: 'g1', label: 'Group 1', children: ['n1'] },
          { id: 'g2', label: 'Group 2', children: ['n2', 'n3'] },
        ];
        const result = validateDiagramType(ast, 'flowchart');
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.message.includes('Group 2'))).toBe(
          true
        );
      });
    });

    describe('combined validation', () => {
      it('should accumulate multiple errors and warnings', () => {
        const ast = createBasicAst();
        ast.nodes = [
          { id: 'n1', shape: 'invalid-shape', label: 'Invalid' },
          { id: 'n1', shape: 'rounded', label: 'Duplicate' },
        ];
        ast.edges = [{ from: 'n1', to: 'n2' }];
        const result = validateDiagramType(ast, 'flowchart');
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.warnings.length).toBeGreaterThan(0);
      });
    });
  });

  describe('listDiagramTypes', () => {
    it('should return array of diagram type constraints', () => {
      const types = listDiagramTypes();
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBeGreaterThan(0);
    });

    it('should include all defined types', () => {
      const types = listDiagramTypes();
      const typeIds = types.map((t) => t.type);
      expect(typeIds).toContain('flowchart');
      expect(typeIds).toContain('sequence');
      expect(typeIds).toContain('entity-relationship');
    });

    it('should return complete constraint objects', () => {
      const types = listDiagramTypes();
      types.forEach((type) => {
        expect(type).toHaveProperty('type');
        expect(type).toHaveProperty('description');
        expect(type).toHaveProperty('allowedShapes');
      });
    });
  });
});
