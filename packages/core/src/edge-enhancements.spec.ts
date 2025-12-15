import { describe, it, expect } from 'vitest';
import type { EdgeAst, DiagramAst } from './types/index.js';

describe('Edge Enhancements - Stereotypes and Line Styles', () => {
  describe('Edge Type Definitions', () => {
    it('should support stereotype property', () => {
      const edge: EdgeAst = {
        from: 'A',
        to: 'B',
        stereotype: 'include',
      };

      expect(edge.stereotype).toBe('include');
    });

    it('should support common UML stereotypes', () => {
      const stereotypes = [
        'include',
        'extend',
        'uses',
        'implements',
        'creates',
      ];

      stereotypes.forEach((stereotype) => {
        const edge: EdgeAst = {
          from: 'A',
          to: 'B',
          stereotype,
        };
        expect(edge.stereotype).toBe(stereotype);
      });
    });

    it('should support lineStyle property', () => {
      const edge: EdgeAst = {
        from: 'A',
        to: 'B',
        lineStyle: 'dashed',
      };

      expect(edge.lineStyle).toBe('dashed');
    });

    it('should support all line styles', () => {
      const styles: Array<'solid' | 'dashed' | 'dotted'> = [
        'solid',
        'dashed',
        'dotted',
      ];

      styles.forEach((lineStyle) => {
        const edge: EdgeAst = {
          from: 'A',
          to: 'B',
          lineStyle,
        };
        expect(edge.lineStyle).toBe(lineStyle);
      });
    });

    it('should support arrowType property', () => {
      const edge: EdgeAst = {
        from: 'A',
        to: 'B',
        arrowType: 'hollow',
      };

      expect(edge.arrowType).toBe('hollow');
    });

    it('should support all arrow types', () => {
      const types: Array<'standard' | 'hollow' | 'open' | 'none'> = [
        'standard',
        'hollow',
        'open',
        'none',
      ];

      types.forEach((arrowType) => {
        const edge: EdgeAst = {
          from: 'A',
          to: 'B',
          arrowType,
        };
        expect(edge.arrowType).toBe(arrowType);
      });
    });

    it('should allow combining stereotype, lineStyle, and arrowType', () => {
      const edge: EdgeAst = {
        from: 'UseCase1',
        to: 'UseCase2',
        stereotype: 'include',
        lineStyle: 'dashed',
        arrowType: 'open',
        label: 'dependency',
      };

      expect(edge.stereotype).toBe('include');
      expect(edge.lineStyle).toBe('dashed');
      expect(edge.arrowType).toBe('open');
      expect(edge.label).toBe('dependency');
    });
  });

  describe('Use Case Diagram Relationships', () => {
    it('should model <<include>> relationship', () => {
      const edge: EdgeAst = {
        from: 'PlaceOrder',
        to: 'ValidatePayment',
        stereotype: 'include',
        lineStyle: 'dashed',
        arrowType: 'open',
      };

      expect(edge.stereotype).toBe('include');
      expect(edge.lineStyle).toBe('dashed');
      expect(edge.arrowType).toBe('open');
    });

    it('should model <<extend>> relationship', () => {
      const edge: EdgeAst = {
        from: 'PrintReceipt',
        to: 'CompletePurchase',
        stereotype: 'extend',
        lineStyle: 'dashed',
        arrowType: 'open',
      };

      expect(edge.stereotype).toBe('extend');
      expect(edge.lineStyle).toBe('dashed');
      expect(edge.arrowType).toBe('open');
    });

    it('should model actor-use case association (standard)', () => {
      const edge: EdgeAst = {
        from: 'Customer',
        to: 'PlaceOrder',
        lineStyle: 'solid',
        arrowType: 'standard',
      };

      expect(edge.lineStyle).toBe('solid');
      expect(edge.arrowType).toBe('standard');
      expect(edge.stereotype).toBeUndefined();
    });

    it('should model generalization (inheritance)', () => {
      const edge: EdgeAst = {
        from: 'OnlineCustomer',
        to: 'Customer',
        lineStyle: 'solid',
        arrowType: 'hollow',
      };

      expect(edge.arrowType).toBe('hollow');
      expect(edge.lineStyle).toBe('solid');
    });
  });

  describe('Class Diagram Relationships', () => {
    it('should model association', () => {
      const edge: EdgeAst = {
        from: 'Order',
        to: 'Customer',
        lineStyle: 'solid',
        arrowType: 'standard',
      };

      expect(edge.lineStyle).toBe('solid');
      expect(edge.arrowType).toBe('standard');
    });

    it('should model dependency with <<uses>>', () => {
      const edge: EdgeAst = {
        from: 'Controller',
        to: 'Service',
        stereotype: 'uses',
        lineStyle: 'dashed',
        arrowType: 'open',
      };

      expect(edge.stereotype).toBe('uses');
      expect(edge.lineStyle).toBe('dashed');
      expect(edge.arrowType).toBe('open');
    });

    it('should model inheritance/generalization', () => {
      const edge: EdgeAst = {
        from: 'Dog',
        to: 'Animal',
        lineStyle: 'solid',
        arrowType: 'hollow',
      };

      expect(edge.arrowType).toBe('hollow');
    });

    it('should model realization/implementation', () => {
      const edge: EdgeAst = {
        from: 'ArrayList',
        to: 'List',
        stereotype: 'implements',
        lineStyle: 'dashed',
        arrowType: 'hollow',
      };

      expect(edge.stereotype).toBe('implements');
      expect(edge.lineStyle).toBe('dashed');
      expect(edge.arrowType).toBe('hollow');
    });
  });

  describe('Diagram AST with Enhanced Edges', () => {
    it('should create complete use case diagram with stereotypes', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        title: 'E-Commerce Use Cases',
        nodes: [
          { id: 'customer', shape: 'actor', label: 'Customer' },
          { id: 'browse', shape: 'ellipse-wide', label: 'Browse Products' },
          { id: 'checkout', shape: 'ellipse-wide', label: 'Checkout' },
          { id: 'payment', shape: 'ellipse-wide', label: 'Process Payment' },
        ],
        edges: [
          {
            from: 'customer',
            to: 'browse',
            lineStyle: 'solid',
            arrowType: 'standard',
          },
          {
            from: 'customer',
            to: 'checkout',
            lineStyle: 'solid',
            arrowType: 'standard',
          },
          {
            from: 'checkout',
            to: 'payment',
            stereotype: 'include',
            lineStyle: 'dashed',
            arrowType: 'open',
          },
        ],
      };

      expect(diagram.edges).toHaveLength(3);
      expect(diagram.edges[0].lineStyle).toBe('solid');
      expect(diagram.edges[2].stereotype).toBe('include');
      expect(diagram.edges[2].lineStyle).toBe('dashed');
    });

    it('should create class diagram with multiple relationship types', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        title: 'Class Relationships',
        nodes: [
          { id: 'base', shape: 'rounded', label: 'BaseClass' },
          { id: 'derived', shape: 'rounded', label: 'DerivedClass' },
          { id: 'interface', shape: 'rounded', label: '<<Interface>>' },
          { id: 'client', shape: 'rounded', label: 'Client' },
        ],
        edges: [
          {
            from: 'derived',
            to: 'base',
            lineStyle: 'solid',
            arrowType: 'hollow',
            label: 'inherits',
          },
          {
            from: 'derived',
            to: 'interface',
            stereotype: 'implements',
            lineStyle: 'dashed',
            arrowType: 'hollow',
          },
          {
            from: 'client',
            to: 'base',
            stereotype: 'uses',
            lineStyle: 'dashed',
            arrowType: 'open',
          },
        ],
      };

      expect(diagram.edges).toHaveLength(3);

      // Inheritance
      expect(diagram.edges[0].arrowType).toBe('hollow');
      expect(diagram.edges[0].lineStyle).toBe('solid');

      // Implementation
      expect(diagram.edges[1].stereotype).toBe('implements');
      expect(diagram.edges[1].lineStyle).toBe('dashed');
      expect(diagram.edges[1].arrowType).toBe('hollow');

      // Dependency
      expect(diagram.edges[2].stereotype).toBe('uses');
      expect(diagram.edges[2].arrowType).toBe('open');
    });
  });

  describe('Edge Defaults', () => {
    it('should work without optional properties', () => {
      const edge: EdgeAst = {
        from: 'A',
        to: 'B',
      };

      expect(edge.stereotype).toBeUndefined();
      expect(edge.lineStyle).toBeUndefined();
      expect(edge.arrowType).toBeUndefined();
    });

    it('should default to solid line if not specified', () => {
      const edge: EdgeAst = {
        from: 'A',
        to: 'B',
        arrowType: 'standard',
      };

      // lineStyle is optional, should be undefined
      expect(edge.lineStyle).toBeUndefined();
      // Renderer should default to 'solid'
    });

    it('should work with partial specifications', () => {
      const edge: EdgeAst = {
        from: 'A',
        to: 'B',
        lineStyle: 'dashed',
        // No arrowType or stereotype
      };

      expect(edge.lineStyle).toBe('dashed');
      expect(edge.arrowType).toBeUndefined();
      expect(edge.stereotype).toBeUndefined();
    });
  });
});
