import { ProfileType } from '@runiq/core';
import { describe, expect, it } from 'vitest';
import { parse } from './langium-parser.js';

describe('Navigability and Constraints', () => {
  describe('Navigability Arrows', () => {
    it('should parse navigability property on edges', () => {
      const input = `
diagram "test" {
  shape Customer as @class
  shape Order as @class
  
  Customer -> Order
    navigability:target
}
`;

      const result = parse(input);
      if (!result.success) {
        console.log('Parse errors:', result.errors);
      }
      expect(result.success).toBe(true);

      const diagram = result.document!.profiles[0];
      if (diagram.type === ProfileType.DIAGRAM) {
        expect(diagram.edges).toHaveLength(1);
        const edge = diagram.edges[0];
        expect(edge.navigability).toBe('target'); // Only target end is navigable
      }
    });

    it('should parse all navigability directions', () => {
      const input = `
diagram "test" {
  shape A as @class
  shape B as @class
  shape C as @class
  shape D as @class
  shape E as @class
  
  A -> B navigability:source
  B -> C navigability:target
  C -> D navigability:bidirectional
  D -> E navigability:none
}
`;

      const result = parse(input);
      expect(result.success).toBe(true);

      const diagram = result.document!.profiles[0];
      if (diagram.type === ProfileType.DIAGRAM) {
        expect(diagram.edges).toHaveLength(4);
        expect(diagram.edges[0].navigability).toBe('source');
        expect(diagram.edges[1].navigability).toBe('target');
        expect(diagram.edges[2].navigability).toBe('bidirectional');
        expect(diagram.edges[3].navigability).toBe('none');
      }
    });

    it('should combine navigability with other edge properties', () => {
      const input = `
diagram "test" {
  shape Department as @class
  shape Employee as @class
  
  Department -> Employee
    edgeType:aggregation
    navigability:target
    multiplicitySource:"1"
    multiplicityTarget:"0..*"
    roleSource:"employer"
    roleTarget:"employee"
}
`;

      const result = parse(input);
      expect(result.success).toBe(true);

      const diagram = result.document!.profiles[0];
      if (diagram.type === ProfileType.DIAGRAM) {
        const edge = diagram.edges[0];
        expect(edge.edgeType).toBe('aggregation');
        expect(edge.navigability).toBe('target');
        expect(edge.multiplicitySource).toBe('1');
        expect(edge.multiplicityTarget).toBe('0..*');
        expect(edge.roleSource).toBe('employer');
        expect(edge.roleTarget).toBe('employee');
      }
    });
  });

  describe('Constraints', () => {
    it('should parse constraints on attributes', () => {
      const input = `
diagram "test" {
  shape Collection as @class
    attributes:[
      {name:"items" type:"List<Item>" constraints:["ordered", "unique"]}
    ]
}
`;

      const result = parse(input);
      expect(result.success).toBe(true);

      const diagram = result.document!.profiles[0];
      if (diagram.type === ProfileType.DIAGRAM) {
        const node = diagram.nodes[0];
        expect(node.data).toBeDefined();
        expect(node.data.attributes).toHaveLength(1);

        const attr = node.data.attributes[0];
        expect(attr.name).toBe('items');
        expect(attr.constraints).toEqual(['ordered', 'unique']);
      }
    });

    it('should parse constraints on methods', () => {
      const input = `
diagram "test" {
  shape Database as @class
    methods:[
      {name:"query" returnType:"Result" constraints:["readonly"]}
    ]
}
`;

      const result = parse(input);
      expect(result.success).toBe(true);

      const diagram = result.document!.profiles[0];
      if (diagram.type === ProfileType.DIAGRAM) {
        const node = diagram.nodes[0];
        const method = node.data.methods[0];
        expect(method.name).toBe('query');
        expect(method.constraints).toEqual(['readonly']);
      }
    });

    it('should parse constraints on edges', () => {
      const input = `
diagram "test" {
  shape Course as @class
  shape Student as @class
  
  Course -> Student
    constraints:["ordered"]
    multiplicityTarget:"1..*"
}
`;

      const result = parse(input);
      expect(result.success).toBe(true);

      const diagram = result.document!.profiles[0];
      if (diagram.type === ProfileType.DIAGRAM) {
        const edge = diagram.edges[0];
        expect(edge.constraints).toEqual(['ordered']);
      }
    });

    it('should parse multiple constraints', () => {
      const input = `
diagram "test" {
  shape SortedSet as @class
    attributes:[
      {name:"elements" type:"Set<T>" constraints:["ordered", "unique", "sorted"]}
    ]
}
`;

      const result = parse(input);
      expect(result.success).toBe(true);

      const diagram = result.document!.profiles[0];
      if (diagram.type === ProfileType.DIAGRAM) {
        const attr = diagram.nodes[0].data.attributes[0];
        expect(attr.constraints).toHaveLength(3);
        expect(attr.constraints).toContain('ordered');
        expect(attr.constraints).toContain('unique');
        expect(attr.constraints).toContain('sorted');
      }
    });
  });
});
