import { describe, it, expect } from 'vitest';
import { parse } from './langium-parser.js';
import type { EdgeAst } from '@runiq/core';

describe('UML Class Diagram Relationships', () => {
  describe('Multiplicity and Role Names', () => {
    it('should parse multiplicitySource and multiplicityTarget', async () => {
      const input = `
        diagram "Test" {
          shape A as @rect
          shape B as @rect
          A -> B
            multiplicitySource: "1"
            multiplicityTarget: "0..*"
        }
      `;

      const result = await parse(input);
      expect(result.errors).toHaveLength(0);
      expect(result.diagram?.edges).toHaveLength(1);

      const edge = result.diagram?.edges[0] as EdgeAst;
      expect(edge.multiplicitySource).toBe('1');
      expect(edge.multiplicityTarget).toBe('0..*');
    });

    it('should parse roleSource and roleTarget', async () => {
      const input = `
        diagram "Test" {
          shape A as @rect
          shape B as @rect
          A -> B
            roleSource: "employer"
            roleTarget: "employee"
        }
      `;

      const result = await parse(input);
      expect(result.errors).toHaveLength(0);
      expect(result.diagram?.edges).toHaveLength(1);

      const edge = result.diagram?.edges[0] as EdgeAst;
      expect(edge.roleSource).toBe('employer');
      expect(edge.roleTarget).toBe('employee');
    });

    it('should parse all multiplicity, roles, and label together', async () => {
      const input = `
        diagram "Test" {
          shape Company as @rect
          shape Employee as @rect
          Company -> Employee
            edgeType: association
            multiplicitySource: "1"
            multiplicityTarget: "1..*"
            roleSource: "employer"
            roleTarget: "worker"
            label: "employs"
        }
      `;

      const result = await parse(input);
      expect(result.errors).toHaveLength(0);
      expect(result.diagram?.edges).toHaveLength(1);

      const edge = result.diagram?.edges[0] as EdgeAst;
      expect(edge.edgeType).toBe('association');
      expect(edge.multiplicitySource).toBe('1');
      expect(edge.multiplicityTarget).toBe('1..*');
      expect(edge.roleSource).toBe('employer');
      expect(edge.roleTarget).toBe('worker');
      expect(edge.label).toBe('employs');
    });

    it('should support various multiplicity patterns', async () => {
      const testCases = [
        { mult: '1', expected: '1' },
        { mult: '0..1', expected: '0..1' },
        { mult: '1..*', expected: '1..*' },
        { mult: '0..*', expected: '0..*' },
        { mult: '*', expected: '*' },
        { mult: '1..5', expected: '1..5' },
      ];

      for (const testCase of testCases) {
        const input = `
          diagram "Test" {
            shape A as @rect
            shape B as @rect
            A -> B multiplicityTarget: "${testCase.mult}"
          }
        `;

        const result = await parse(input);
        expect(result.errors).toHaveLength(0);
        const edge = result.diagram?.edges[0] as EdgeAst;
        expect(edge.multiplicityTarget).toBe(testCase.expected);
      }
    });
  });

  describe('Edge Types - Aggregation and Composition', () => {
    it('should parse aggregation edge type', async () => {
      const input = `
        diagram "Test" {
          shape Container as @rect
          shape Part as @rect
          Container -> Part
            edgeType: aggregation
            multiplicitySource: "1"
            multiplicityTarget: "0..*"
        }
      `;

      const result = await parse(input);
      expect(result.errors).toHaveLength(0);
      expect(result.diagram?.edges).toHaveLength(1);

      const edge = result.diagram?.edges[0] as EdgeAst;
      expect(edge.edgeType).toBe('aggregation');
      expect(edge.multiplicitySource).toBe('1');
      expect(edge.multiplicityTarget).toBe('0..*');
    });

    it('should parse composition edge type', async () => {
      const input = `
        diagram "Test" {
          shape Whole as @rect
          shape Part as @rect
          Whole -> Part
            edgeType: composition
            multiplicitySource: "1"
            multiplicityTarget: "1..*"
        }
      `;

      const result = await parse(input);
      expect(result.errors).toHaveLength(0);
      expect(result.diagram?.edges).toHaveLength(1);

      const edge = result.diagram?.edges[0] as EdgeAst;
      expect(edge.edgeType).toBe('composition');
      expect(edge.multiplicitySource).toBe('1');
      expect(edge.multiplicityTarget).toBe('1..*');
    });

    it('should parse association edge type', async () => {
      const input = `
        diagram "Test" {
          shape A as @rect
          shape B as @rect
          A -> B
            edgeType: association
            label: "associates with"
        }
      `;

      const result = await parse(input);
      expect(result.errors).toHaveLength(0);
      expect(result.diagram?.edges).toHaveLength(1);

      const edge = result.diagram?.edges[0] as EdgeAst;
      expect(edge.edgeType).toBe('association');
      expect(edge.label).toBe('associates with');
    });

    it('should parse all UML edge types', async () => {
      const edgeTypes = [
        'association',
        'aggregation',
        'composition',
        'dependency',
        'generalization',
        'realization',
      ];

      for (const edgeType of edgeTypes) {
        const input = `
          diagram "Test" {
            shape A as @rect
            shape B as @rect
            A -> B edgeType: ${edgeType}
          }
        `;

        const result = await parse(input);
        expect(result.errors, `Failed for edgeType: ${edgeType}`).toHaveLength(
          0
        );
        const edge = result.diagram?.edges[0] as EdgeAst;
        expect(edge.edgeType).toBe(edgeType);
      }
    });
  });

  describe('Complex UML Relationships', () => {
    it('should parse a complete class diagram with multiple relationship types', async () => {
      const input = `
        diagram "Class Relationships" {
          shape Company as @rect
          shape Department as @rect
          shape Employee as @rect
          shape Address as @rect
          
          // Aggregation: Company has Departments
          Company -> Department
            edgeType: aggregation
            multiplicitySource: "1"
            multiplicityTarget: "1..*"
            roleSource: "parent"
            roleTarget: "division"
          
          // Composition: Employee has Address
          Employee -> Address
            edgeType: composition
            multiplicitySource: "1"
            multiplicityTarget: "1"
          
          // Association with multiplicity
          Department -> Employee
            edgeType: association
            multiplicitySource: "1"
            multiplicityTarget: "0..*"
            label: "manages"
        }
      `;

      const result = await parse(input);
      expect(result.errors).toHaveLength(0);
      expect(result.diagram?.edges).toHaveLength(3);

      // Verify aggregation
      const aggEdge = result.diagram?.edges[0] as EdgeAst;
      expect(aggEdge.from).toBe('Company');
      expect(aggEdge.to).toBe('Department');
      expect(aggEdge.edgeType).toBe('aggregation');
      expect(aggEdge.multiplicitySource).toBe('1');
      expect(aggEdge.multiplicityTarget).toBe('1..*');
      expect(aggEdge.roleSource).toBe('parent');
      expect(aggEdge.roleTarget).toBe('division');

      // Verify composition
      const compEdge = result.diagram?.edges[1] as EdgeAst;
      expect(compEdge.from).toBe('Employee');
      expect(compEdge.to).toBe('Address');
      expect(compEdge.edgeType).toBe('composition');
      expect(compEdge.multiplicitySource).toBe('1');
      expect(compEdge.multiplicityTarget).toBe('1');

      // Verify association
      const assocEdge = result.diagram?.edges[2] as EdgeAst;
      expect(assocEdge.from).toBe('Department');
      expect(assocEdge.to).toBe('Employee');
      expect(assocEdge.edgeType).toBe('association');
      expect(assocEdge.multiplicitySource).toBe('1');
      expect(assocEdge.multiplicityTarget).toBe('0..*');
      expect(assocEdge.label).toBe('manages');
    });
  });

  describe('Navigability', () => {
    it('should parse navigability property', async () => {
      const input = `
        diagram "Test" {
          shape A as @rect
          shape B as @rect
          A -> B
            navigability: target
        }
      `;

      const result = await parse(input);
      expect(result.errors).toHaveLength(0);
      expect(result.diagram?.edges).toHaveLength(1);

      const edge = result.diagram?.edges[0] as EdgeAst;
      expect(edge.navigability).toBe('target');
    });

    it('should parse all navigability directions', async () => {
      const directions = ['source', 'target', 'bidirectional', 'none'];

      for (const direction of directions) {
        const input = `
          diagram "Test" {
            shape A as @rect
            shape B as @rect
            A -> B navigability: ${direction}
          }
        `;

        const result = await parse(input);
        expect(
          result.errors,
          `Failed for navigability: ${direction}`
        ).toHaveLength(0);
        const edge = result.diagram?.edges[0] as EdgeAst;
        expect(edge.navigability).toBe(direction);
      }
    });
  });

  describe('Constraints', () => {
    it('should parse edge constraints', async () => {
      const input = `
        diagram "Test" {
          shape A as @rect
          shape B as @rect
          A -> B
            constraints: ["ordered", "unique"]
        }
      `;

      const result = await parse(input);
      expect(result.errors).toHaveLength(0);
      expect(result.diagram?.edges).toHaveLength(1);

      const edge = result.diagram?.edges[0] as EdgeAst;
      expect(edge.constraints).toEqual(['ordered', 'unique']);
    });

    it('should parse single constraint', async () => {
      const input = `
        diagram "Test" {
          shape A as @rect
          shape B as @rect
          A -> B constraints: ["readonly"]
        }
      `;

      const result = await parse(input);
      expect(result.errors).toHaveLength(0);
      const edge = result.diagram?.edges[0] as EdgeAst;
      expect(edge.constraints).toEqual(['readonly']);
    });
  });
});
