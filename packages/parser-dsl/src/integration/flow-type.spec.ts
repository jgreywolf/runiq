import { describe, it, expect } from 'vitest';
import { parse } from '../langium-parser';

describe('Activity Diagram Flow Types', () => {
  describe('Control Flow (default)', () => {
    it('should parse edge without flowType as control flow', () => {
      const dsl = `
        diagram "Test" {
          shape action1 as @activity label:"Process Order"
          shape action2 as @activity label:"Ship Order"
          action1 -> action2
        }
      `;

      const result = parse(dsl);
      expect(result.success).toBe(true);
      expect(result.diagram).toBeDefined();
      expect(result.diagram!.nodes).toHaveLength(2);
      expect(result.diagram!.edges).toHaveLength(1);
      expect(result.diagram!.edges[0].flowType).toBeUndefined(); // Default behavior
    });

    it('should parse explicit control flow', () => {
      const dsl = `
        diagram "Test" {
          shape action1 as @activity label:"Process Order"
          shape action2 as @activity label:"Ship Order"
          action1 -> action2 flowType:"control"
        }
      `;

      const result = parse(dsl);
      expect(result.diagram!.edges).toHaveLength(1);
      expect(result.diagram!.edges[0].flowType).toBe('control');
    });

    it('should parse control flow with other properties', () => {
      const dsl = `
        diagram "Test" {
          shape action1 as @activity label:"Process Order"
          shape action2 as @activity label:"Ship Order"
          action1 -> action2 label:"success" flowType:"control"
        }
      `;

      const result = parse(dsl);
      expect(result.diagram!.edges).toHaveLength(1);
      expect(result.diagram!.edges[0].flowType).toBe('control');
      expect(result.diagram!.edges[0].label).toBe('success');
    });
  });

  describe('Object Flow', () => {
    it('should parse object flow between activity and object node', () => {
      const dsl = `
        diagram "Test" {
          shape action1 as @activity label:"Create Order"
          shape obj1 as @objectNode label:"Order"
          action1 -> obj1 flowType:"object"
        }
      `;

      const result = parse(dsl);
      expect(result.diagram!.edges).toHaveLength(1);
      expect(result.diagram!.edges[0].flowType).toBe('object');
    });

    it('should parse object flow with label', () => {
      const dsl = `
        diagram "Test" {
          shape obj1 as @objectNode label:"Input"
          shape action1 as @activity label:"Process"
          shape obj2 as @objectNode label:"Output"
          obj1 -> action1 flowType:"object"
          action1 -> obj2 flowType:"object" label:"result"
        }
      `;

      const result = parse(dsl);
      expect(result.diagram!.edges).toHaveLength(2);
      expect(result.diagram!.edges[0].flowType).toBe('object');
      expect(result.diagram!.edges[1].flowType).toBe('object');
      expect(result.diagram!.edges[1].label).toBe('result');
    });

    it('should parse object flow through buffer', () => {
      const dsl = `
        diagram "Test" {
          shape action1 as @activity label:"Produce"
          shape buffer as @centralBuffer label:"Queue"
          shape action2 as @activity label:"Consume"
          action1 -> buffer flowType:"object"
          buffer -> action2 flowType:"object"
        }
      `;

      const result = parse(dsl);
      expect(result.diagram!.edges).toHaveLength(2);
      expect(result.diagram!.edges[0].flowType).toBe('object');
      expect(result.diagram!.edges[1].flowType).toBe('object');
    });
  });

  describe('Mixed Flow Types', () => {
    it('should parse diagram with both control and object flows', () => {
      const dsl = `
        diagram "Test" {
          shape action1 as @activity label:"Receive Order"
          shape obj1 as @objectNode label:"Order Data"
          shape action2 as @activity label:"Validate Order"
          shape action3 as @activity label:"Process Payment"
          
          action1 -> obj1 flowType:"object"
          action1 -> action2 flowType:"control"
          obj1 -> action2 flowType:"object"
          action2 -> action3 flowType:"control"
        }
      `;

      const result = parse(dsl);
      expect(result.diagram!.edges).toHaveLength(4);

      // Check first edge: object flow
      expect(result.diagram!.edges[0].from).toBe('action1');
      expect(result.diagram!.edges[0].to).toBe('obj1');
      expect(result.diagram!.edges[0].flowType).toBe('object');

      // Check second edge: control flow
      expect(result.diagram!.edges[1].from).toBe('action1');
      expect(result.diagram!.edges[1].to).toBe('action2');
      expect(result.diagram!.edges[1].flowType).toBe('control');

      // Check third edge: object flow
      expect(result.diagram!.edges[2].from).toBe('obj1');
      expect(result.diagram!.edges[2].to).toBe('action2');
      expect(result.diagram!.edges[2].flowType).toBe('object');

      // Check fourth edge: control flow
      expect(result.diagram!.edges[3].from).toBe('action2');
      expect(result.diagram!.edges[3].to).toBe('action3');
      expect(result.diagram!.edges[3].flowType).toBe('control');
    });

    it('should parse data store with object flows', () => {
      const dsl = `
        diagram "Test" {
          shape action1 as @activity label:"Save Data"
          shape store as @dataStore label:"Database"
          shape action2 as @activity label:"Load Data"
          
          action1 -> store flowType:"object" label:"write"
          store -> action2 flowType:"object" label:"read"
        }
      `;

      const result = parse(dsl);
      expect(result.diagram!.edges).toHaveLength(2);

      expect(result.diagram!.edges[0].flowType).toBe('object');
      expect(result.diagram!.edges[0].label).toBe('write');

      expect(result.diagram!.edges[1].flowType).toBe('object');
      expect(result.diagram!.edges[1].label).toBe('read');
    });
  });

  describe('Integration with other edge properties', () => {
    it('should parse flowType with guard condition', () => {
      const dsl = `
        diagram "Test" {
          shape action1 as @activity label:"Check Stock"
          shape obj1 as @objectNode label:"Product"
          action1 -> obj1 flowType:"object" guard:"[in stock]"
        }
      `;

      const result = parse(dsl);
      expect(result.diagram!.edges).toHaveLength(1);
      expect(result.diagram!.edges[0].flowType).toBe('object');
      expect(result.diagram!.edges[0].guard).toBe('[in stock]');
    });

    it('should parse flowType with stereotype', () => {
      const dsl = `
        diagram "Test" {
          shape action1 as @activity label:"Process"
          shape obj1 as @objectNode label:"Data"
          action1 -> obj1 flowType:"object" stereotype:"stream"
        }
      `;

      const result = parse(dsl);
      expect(result.diagram!.edges).toHaveLength(1);
      expect(result.diagram!.edges[0].flowType).toBe('object');
      expect(result.diagram!.edges[0].stereotype).toBe('stream');
    });

    it('should parse flowType with line style', () => {
      const dsl = `
        diagram "Test" {
          shape action1 as @activity label:"Optional Process"
          shape obj1 as @objectNode label:"Optional Data"
          action1 -> obj1 flowType:"object" lineStyle:"dashed"
        }
      `;

      const result = parse(dsl);
      expect(result.diagram!.edges).toHaveLength(1);
      expect(result.diagram!.edges[0].flowType).toBe('object');
      expect(result.diagram!.edges[0].lineStyle).toBe('dashed');
    });
  });
});
