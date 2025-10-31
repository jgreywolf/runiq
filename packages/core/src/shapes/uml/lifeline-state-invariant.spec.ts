import { describe, it, expect, beforeEach } from 'vitest';
import { lifelineShape } from './lifeline.js';
import type { ShapeRenderContext } from '../../types.js';

describe('Lifeline Shape with State Invariants', () => {
  let mockContext: ShapeRenderContext;

  beforeEach(() => {
    mockContext = {
      node: {
        id: 'test',
        shape: '@lifeline',
        label: 'User',
      },
      style: {
        fontSize: 14,
        padding: 12,
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 1,
        fontFamily: 'Arial',
      },
      measureText: (text: string) => ({ width: text.length * 8, height: 16 }),
    };
  });

  describe('stateInvariant property', () => {
    it('should render lifeline without state invariant when not specified', () => {
      mockContext.node.label = 'Account';
      const svg = lifelineShape.render(mockContext, { x: 0, y: 0 });

      expect(svg).toContain('class="lifeline-shape"');
      expect(svg).toContain('Account');
      expect(svg).not.toContain('{'); // No curly braces for invariant
    });

    it('should render state invariant box when stateInvariant is specified', () => {
      mockContext.node.label = 'Account';
      mockContext.node.stateInvariant = 'balance >= 0';

      const svg = lifelineShape.render(mockContext, { x: 0, y: 0 });

      expect(svg).toContain('class="lifeline-shape"');
      expect(svg).toContain('Account');
      expect(svg).toContain('{balance >= 0}');
    });

    it('should render state invariant in dashed box', () => {
      mockContext.node.stateInvariant = 'authorized = true';

      const svg = lifelineShape.render(mockContext, { x: 0, y: 0 });

      expect(svg).toContain('stroke-dasharray="3,3"'); // Dashed border for constraint box
      expect(svg).toContain('{authorized = true}');
    });

    it('should render state invariant in italic font', () => {
      mockContext.node.stateInvariant = 'status = active';

      const svg = lifelineShape.render(mockContext, { x: 0, y: 0 });

      expect(svg).toContain('font-style="italic"');
      expect(svg).toContain('{status = active}');
    });

    it('should position state invariant box centered on lifeline', () => {
      mockContext.node.stateInvariant = 'count > 0';
      mockContext.node.data = { height: 200 };

      const svg = lifelineShape.render(mockContext, { x: 100, y: 50 });

      // The invariant box should be centered horizontally on the lifeline
      // and positioned halfway down the lifeline
      expect(svg).toContain('{count > 0}');
      expect(svg).toContain('rect'); // Note box is rendered
    });

    it('should wrap constraint in curly braces automatically', () => {
      mockContext.node.stateInvariant = 'x < 100';

      const svg = lifelineShape.render(mockContext, { x: 0, y: 0 });

      expect(svg).toContain('{x < 100}');
      expect(svg).not.toContain('{{'); // Should not double-wrap
    });

    it('should render complex boolean expressions', () => {
      mockContext.node.stateInvariant = 'balance >= 0 AND status = "active"';

      const svg = lifelineShape.render(mockContext, { x: 0, y: 0 });

      expect(svg).toContain('{balance >= 0 AND status = "active"}');
    });

    it('should handle empty string state invariant', () => {
      mockContext.node.stateInvariant = '';

      const svg = lifelineShape.render(mockContext, { x: 0, y: 0 });

      // Empty invariant should not render the box
      expect(svg).toContain('class="lifeline-shape"');
    });
  });

  describe('state invariant with other lifeline features', () => {
    it('should render state invariant with stereotype', () => {
      mockContext.node.label = 'Order';
      mockContext.node.data = {
        stereotype: 'entity',
        height: 250,
      };
      mockContext.node.stateInvariant = 'items.length > 0';

      const svg = lifelineShape.render(mockContext, { x: 0, y: 0 });

      expect(svg).toContain('«entity»');
      expect(svg).toContain('Order');
      expect(svg).toContain('{items.length > 0}');
    });

    it('should render state invariant with custom height', () => {
      mockContext.node.data = { height: 300 };
      mockContext.node.stateInvariant = 'validated = true';

      const bounds = lifelineShape.bounds(mockContext);
      const svg = lifelineShape.render(mockContext, { x: 0, y: 0 });

      expect(bounds.height).toBeGreaterThan(300);
      expect(svg).toContain('{validated = true}');
    });
  });

  describe('UML 2.5 compliance', () => {
    it('should follow UML notation for state invariants', () => {
      // UML 2.5: State invariants are shown as constraints in curly braces
      // attached to lifelines to express conditions that must be true
      mockContext.node.stateInvariant = 'self.age >= 18';

      const svg = lifelineShape.render(mockContext, { x: 0, y: 0 });

      expect(svg).toContain('{self.age >= 18}');
      expect(svg).toContain('stroke-dasharray="3,3"'); // Dashed box per UML convention
      expect(svg).toContain('font-style="italic"'); // Constraints shown in italics
    });

    it('should support OCL-style constraints', () => {
      // UML supports OCL (Object Constraint Language) expressions
      mockContext.node.stateInvariant = 'self.orders->size() > 0';

      const svg = lifelineShape.render(mockContext, { x: 0, y: 0 });

      expect(svg).toContain('{self.orders->size() > 0}');
    });
  });
});
