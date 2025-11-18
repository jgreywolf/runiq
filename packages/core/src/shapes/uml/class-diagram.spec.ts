import { describe, it, expect } from 'vitest';
import type { ShapeRenderContext, NodeAst, Style } from '../../types.js';
import { classShape } from './class.js';

// Mock text measurement function
const mockMeasureText = (text: string) => ({
  width: text.length * 8, // Approximate 8px per character
  height: 16, // Approximate line height
});

describe('Class Diagram Shape', () => {
  describe('Shape Registration', () => {
    it('should register @class shape', () => {
      const shape = classShape;
      expect(shape).toBeDefined();
      expect(shape?.id).toBe('class');
    });
  });

  describe('Simple Class (Name Only)', () => {
    it('should render class with name only', () => {
      const shape = classShape;
      expect(shape).toBeDefined();

      const node: NodeAst = {
        id: 'Person',
        shape: 'class',
        label: 'Person',
      };

      const style: Style = {
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 1,
      };

      const ctx: ShapeRenderContext = {
        node,
        style,
        measureText: mockMeasureText,
      };

      // Bounds should include padding for single compartment
      const bounds = shape.bounds(ctx);
      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);

      // Render should produce SVG
      const svg = shape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('rect'); // Main box
      expect(svg).toContain('Person'); // Class name
    });
  });

  describe('Class with Attributes', () => {
    it('should render class with attributes', () => {
      const shape = classShape;
      const node: NodeAst = {
        id: 'Person',
        shape: 'class',
        label: 'Person',
        data: {
          attributes: [
            { name: 'name', type: 'String', visibility: 'private' },
            { name: 'age', type: 'int', visibility: 'private' },
            { name: 'email', type: 'String', visibility: 'public' },
          ],
        },
      };

      const ctx: ShapeRenderContext = {
        node,
        style: { fill: '#fff', stroke: '#000', strokeWidth: 1 },
        measureText: mockMeasureText,
      };

      const bounds = shape.bounds(ctx);
      expect(bounds.height).toBeGreaterThan(50); // Should be tall enough for 3 attributes

      const svg = shape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('Person');
      expect(svg).toContain('-'); // Private visibility symbol
      expect(svg).toContain('+'); // Public visibility symbol
      expect(svg).toContain('name');
      expect(svg).toContain('String');
      expect(svg).toContain('age');
      expect(svg).toContain('int');
    });
  });

  describe('Class with Methods', () => {
    it('should render class with methods', () => {
      const shape = classShape;
      const node: NodeAst = {
        id: 'Calculator',
        shape: 'class',
        label: 'Calculator',
        data: {
          methods: [
            {
              name: 'add',
              params: [
                { name: 'a', type: 'int' },
                { name: 'b', type: 'int' },
              ],
              returnType: 'int',
              visibility: 'public',
            },
            {
              name: 'clear',
              params: [],
              returnType: 'void',
              visibility: 'public',
            },
          ],
        },
      };

      const ctx: ShapeRenderContext = {
        node,
        style: { fill: '#fff', stroke: '#000', strokeWidth: 1 },
        measureText: mockMeasureText,
      };

      const svg = shape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('Calculator');
      expect(svg).toContain('add');
      expect(svg).toContain('int');
      expect(svg).toContain('clear');
      expect(svg).toContain('void');
      expect(svg).toContain('+'); // Public visibility
    });
  });

  describe('Complete Class with Attributes and Methods', () => {
    it('should render 3-compartment class', () => {
      const shape = classShape;
      const node: NodeAst = {
        id: 'BankAccount',
        shape: 'class',
        label: 'BankAccount',
        data: {
          attributes: [
            { name: 'balance', type: 'decimal', visibility: 'private' },
            { name: 'accountNumber', type: 'String', visibility: 'private' },
          ],
          methods: [
            {
              name: 'deposit',
              params: [{ name: 'amount', type: 'decimal' }],
              returnType: 'void',
              visibility: 'public',
            },
            {
              name: 'withdraw',
              params: [{ name: 'amount', type: 'decimal' }],
              returnType: 'boolean',
              visibility: 'public',
            },
            {
              name: 'getBalance',
              params: [],
              returnType: 'decimal',
              visibility: 'public',
            },
          ],
        },
      };

      const ctx: ShapeRenderContext = {
        node,
        style: { fill: '#fff', stroke: '#000', strokeWidth: 1 },
        measureText: mockMeasureText,
      };

      const bounds = shape.bounds(ctx);
      expect(bounds.height).toBeGreaterThan(100); // Should be tall for 2 attrs + 3 methods

      const svg = shape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('BankAccount');
      expect(svg).toContain('balance');
      expect(svg).toContain('deposit');
      expect(svg).toContain('withdraw');
      expect(svg).toContain('getBalance');
    });
  });

  describe('Generic Classes', () => {
    it('should render class with single type parameter', () => {
      const shape = classShape;
      const node: NodeAst = {
        id: 'List',
        shape: 'class',
        label: 'List',
        data: {
          genericTypes: ['T'],
          methods: [
            {
              name: 'add',
              params: [{ name: 'item', type: 'T' }],
              returnType: 'void',
              visibility: 'public',
            },
            {
              name: 'get',
              params: [{ name: 'index', type: 'int' }],
              returnType: 'T',
              visibility: 'public',
            },
          ],
        },
      };

      const ctx: ShapeRenderContext = {
        node,
        style: { fill: '#fff', stroke: '#000', strokeWidth: 1 },
        measureText: mockMeasureText,
      };

      const svg = shape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('List');
      expect(svg).toContain('&lt;T&gt;'); // Generic type parameter (XML escaped)
      expect(svg).toContain('add');
      expect(svg).toContain('get');
    });

    it('should render class with multiple type parameters', () => {
      const shape = classShape;
      const node: NodeAst = {
        id: 'Map',
        shape: 'class',
        label: 'Map',
        data: {
          genericTypes: ['K', 'V'],
          methods: [
            {
              name: 'put',
              params: [
                { name: 'key', type: 'K' },
                { name: 'value', type: 'V' },
              ],
              returnType: 'void',
              visibility: 'public',
            },
            {
              name: 'get',
              params: [{ name: 'key', type: 'K' }],
              returnType: 'V',
              visibility: 'public',
            },
          ],
        },
      };

      const ctx: ShapeRenderContext = {
        node,
        style: { fill: '#fff', stroke: '#000', strokeWidth: 1 },
        measureText: mockMeasureText,
      };

      const svg = shape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('Map');
      expect(svg).toContain('&lt;K, V&gt;'); // Multiple type parameters (XML escaped)
    });

    it('should handle nested generic types in attributes', () => {
      const shape = classShape;
      const node: NodeAst = {
        id: 'Repository',
        shape: 'class',
        label: 'Repository',
        data: {
          attributes: [
            {
              name: 'items',
              type: 'List<Map<String, Value>>',
              visibility: 'private',
            },
          ],
        },
      };

      const ctx: ShapeRenderContext = {
        node,
        style: { fill: '#fff', stroke: '#000', strokeWidth: 1 },
        measureText: mockMeasureText,
      };

      const svg = shape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('List&lt;Map&lt;String, Value&gt;&gt;'); // Nested generics (XML escaped)
    });

    it('should handle bounded type parameters (extends)', () => {
      const shape = classShape;
      const node: NodeAst = {
        id: 'SortedList',
        shape: 'class',
        label: 'SortedList',
        data: {
          genericTypes: ['T extends Comparable<T>'],
        },
      };

      const ctx: ShapeRenderContext = {
        node,
        style: { fill: '#fff', stroke: '#000', strokeWidth: 1 },
        measureText: mockMeasureText,
      };

      const svg = shape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('&lt;T extends Comparable&lt;T&gt;&gt;'); // Bounded type (XML escaped)
    });
  });

  describe('Visibility Modifiers', () => {
    it('should render all visibility types', () => {
      const shape = classShape;
      const node: NodeAst = {
        id: 'AccessTest',
        shape: 'class',
        label: 'AccessTest',
        data: {
          attributes: [
            { name: 'publicField', type: 'String', visibility: 'public' },
            { name: 'privateField', type: 'String', visibility: 'private' },
            { name: 'protectedField', type: 'String', visibility: 'protected' },
            { name: 'packageField', type: 'String', visibility: 'package' },
          ],
        },
      };

      const ctx: ShapeRenderContext = {
        node,
        style: { fill: '#fff', stroke: '#000', strokeWidth: 1 },
        measureText: mockMeasureText,
      };

      const svg = shape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('+'); // public
      expect(svg).toContain('-'); // private
      expect(svg).toContain('#'); // protected
      expect(svg).toContain('~'); // package
    });
  });

  describe('Stereotypes', () => {
    it('should render interface stereotype', () => {
      const shape = classShape;
      const node: NodeAst = {
        id: 'IComparable',
        shape: 'class',
        label: 'IComparable',
        data: {
          stereotype: 'interface',
          methods: [
            {
              name: 'compareTo',
              params: [{ name: 'other', type: 'Object' }],
              returnType: 'int',
              visibility: 'public',
            },
          ],
        },
      };

      const ctx: ShapeRenderContext = {
        node,
        style: { fill: '#fff', stroke: '#000', strokeWidth: 1 },
        measureText: mockMeasureText,
      };

      const svg = shape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('«interface»');
      expect(svg).toContain('IComparable');
    });

    it('should render abstract class stereotype', () => {
      const shape = classShape;
      const node: NodeAst = {
        id: 'Animal',
        shape: 'class',
        label: 'Animal',
        data: {
          stereotype: 'abstract',
        },
      };

      const ctx: ShapeRenderContext = {
        node,
        style: { fill: '#fff', stroke: '#000', strokeWidth: 1 },
        measureText: mockMeasureText,
      };

      const svg = shape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('«abstract»');
      expect(svg).toContain('Animal');
    });
  });

  describe('Anchor Points for Member Connections', () => {
    it('should provide anchor point for class itself', () => {
      const shape = classShape;
      const node: NodeAst = {
        id: 'Person',
        shape: 'class',
        label: 'Person',
        data: {
          attributes: [{ name: 'id', type: 'int', visibility: 'private' }],
        },
      };

      const ctx: ShapeRenderContext = {
        node,
        style: { fill: '#fff', stroke: '#000', strokeWidth: 1 },
        measureText: mockMeasureText,
      };

      const anchors = shape.anchors!(ctx);
      expect(anchors).toBeDefined();
      expect(anchors.length).toBeGreaterThan(0);

      // Should have standard anchors (top, right, bottom, left)
      const topAnchor = anchors.find((a) => a.name === 'top');
      expect(topAnchor).toBeDefined();
    });

    it('should provide anchor points for each attribute', () => {
      const shape = classShape;
      const node: NodeAst = {
        id: 'Order',
        shape: 'class',
        label: 'Order',
        data: {
          attributes: [
            { name: 'orderId', type: 'int', visibility: 'private' },
            { name: 'customerId', type: 'int', visibility: 'private' },
            { name: 'total', type: 'decimal', visibility: 'private' },
          ],
        },
      };

      const ctx: ShapeRenderContext = {
        node,
        style: { fill: '#fff', stroke: '#000', strokeWidth: 1 },
        measureText: mockMeasureText,
      };

      const anchors = shape.anchors!(ctx);

      // Should have anchors for each attribute
      const orderIdAnchor = anchors.find((a) => a.name === 'Order.orderId');
      expect(orderIdAnchor).toBeDefined();
      expect(orderIdAnchor!.x).toBeGreaterThanOrEqual(0);
      expect(orderIdAnchor!.y).toBeGreaterThan(0);

      const customerIdAnchor = anchors.find(
        (a) => a.name === 'Order.customerId'
      );
      expect(customerIdAnchor).toBeDefined();

      const totalAnchor = anchors.find((a) => a.name === 'Order.total');
      expect(totalAnchor).toBeDefined();
    });

    it('should provide anchor points for each method', () => {
      const shape = classShape;
      const node: NodeAst = {
        id: 'Service',
        shape: 'class',
        label: 'Service',
        data: {
          methods: [
            {
              name: 'start',
              params: [],
              returnType: 'void',
              visibility: 'public',
            },
            {
              name: 'stop',
              params: [],
              returnType: 'void',
              visibility: 'public',
            },
          ],
        },
      };

      const ctx: ShapeRenderContext = {
        node,
        style: { fill: '#fff', stroke: '#000', strokeWidth: 1 },
        measureText: mockMeasureText,
      };

      const anchors = shape.anchors!(ctx);

      const startAnchor = anchors.find((a) => a.name === 'Service.start');
      expect(startAnchor).toBeDefined();

      const stopAnchor = anchors.find((a) => a.name === 'Service.stop');
      expect(stopAnchor).toBeDefined();
    });
  });

  describe('Hidden Compartments', () => {
    it('should not show attribute compartment when no attributes', () => {
      const shape = classShape;
      const node: NodeAst = {
        id: 'EmptyClass',
        shape: 'class',
        label: 'EmptyClass',
        data: {
          methods: [
            {
              name: 'doSomething',
              params: [],
              returnType: 'void',
              visibility: 'public',
            },
          ],
        },
      };

      const ctx: ShapeRenderContext = {
        node,
        style: { fill: '#fff', stroke: '#000', strokeWidth: 1 },
        measureText: mockMeasureText,
      };

      const svg = shape.render(ctx, { x: 0, y: 0 });

      // Should only have 2 compartments (name + methods)
      // Count horizontal divider lines - should be 1 (between name and methods)
      const lines = (svg.match(/<line/g) || []).length;
      expect(lines).toBe(1); // Only one divider line
    });

    it('should not show method compartment when no methods', () => {
      const shape = classShape;
      const node: NodeAst = {
        id: 'DataClass',
        shape: 'class',
        label: 'DataClass',
        data: {
          attributes: [{ name: 'value', type: 'String', visibility: 'public' }],
        },
      };

      const ctx: ShapeRenderContext = {
        node,
        style: { fill: '#fff', stroke: '#000', strokeWidth: 1 },
        measureText: mockMeasureText,
      };

      const svg = shape.render(ctx, { x: 0, y: 0 });

      // Should only have 2 compartments (name + attributes)
      const lines = (svg.match(/<line/g) || []).length;
      expect(lines).toBe(1); // Only one divider line
    });

    it('should show only name compartment when no attributes or methods', () => {
      const shape = classShape;
      const node: NodeAst = {
        id: 'EmptyClass',
        shape: 'class',
        label: 'EmptyClass',
      };

      const ctx: ShapeRenderContext = {
        node,
        style: { fill: '#fff', stroke: '#000', strokeWidth: 1 },
        measureText: mockMeasureText,
      };

      const svg = shape.render(ctx, { x: 0, y: 0 });

      // Should only have 1 compartment (name)
      const lines = (svg.match(/<line/g) || []).length;
      expect(lines).toBe(0); // No divider lines
    });
  });
});
