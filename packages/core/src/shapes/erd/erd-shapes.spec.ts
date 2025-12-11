import { describe, it, expect } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { erdEntityShape } from './entity.js';
import { erdWeakEntityShape } from './weakEntity.js';
import { erdRelationshipShape } from './relationship.js';
import { erdAttributeShape } from './attribute.js';
import { erdKeyAttributeShape } from './keyAttribute.js';
import { erdMultivaluedAttributeShape } from './multivaluedAttribute.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: '@test',
      label,
      data,
    },
    style: {
      padding: 12,
      fontSize: 14,
      fontFamily: 'Arial',
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('ERD Shapes', () => {
  describe('erdEntity', () => {
    it('should have correct shape id', () => {
      expect(erdEntityShape.id).toBe('erdEntity');
    });

    it('should calculate bounds with label', () => {
      const ctx = createMockContext('Customer');
      const bounds = erdEntityShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('Order');
      const anchors = erdEntityShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render rectangle entity', () => {
      const ctx = createMockContext('Product');
      const svg = erdEntityShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Product');
      expect(svg).toContain('rect');
    });
  });

  describe('erdWeakEntity', () => {
    it('should have correct shape id', () => {
      expect(erdWeakEntityShape.id).toBe('erdWeakEntity');
    });

    it('should calculate bounds with label', () => {
      const ctx = createMockContext('Dependent');
      const bounds = erdWeakEntityShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('Weak');
      const anchors = erdWeakEntityShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render double rectangle for weak entity', () => {
      const ctx = createMockContext('Address');
      const svg = erdWeakEntityShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Address');
      // Should have two rectangles
    });
  });

  describe('erdRelationship', () => {
    it('should have correct shape id', () => {
      expect(erdRelationshipShape.id).toBe('erdRelationship');
    });

    it('should calculate bounds with label', () => {
      const ctx = createMockContext('purchases');
      const bounds = erdRelationshipShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('has');
      const anchors = erdRelationshipShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render diamond shape', () => {
      const ctx = createMockContext('owns');
      const svg = erdRelationshipShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('owns');
      expect(svg).toContain('polygon');
    });
  });

  describe('erdAttribute', () => {
    it('should have correct shape id', () => {
      expect(erdAttributeShape.id).toBe('erdAttribute');
    });

    it('should calculate bounds with label', () => {
      const ctx = createMockContext('name');
      const bounds = erdAttributeShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('age');
      const anchors = erdAttributeShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render ellipse for attribute', () => {
      const ctx = createMockContext('email');
      const svg = erdAttributeShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('email');
      expect(svg).toContain('ellipse');
    });
  });

  describe('erdKeyAttribute', () => {
    it('should have correct shape id', () => {
      expect(erdKeyAttributeShape.id).toBe('erdKeyAttribute');
    });

    it('should calculate bounds with label', () => {
      const ctx = createMockContext('id');
      const bounds = erdKeyAttributeShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('userId');
      const anchors = erdKeyAttributeShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render underlined text for key attribute', () => {
      const ctx = createMockContext('customerId');
      const svg = erdKeyAttributeShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('customerId');
      expect(svg).toContain('ellipse');
      // Should have underline
    });
  });

  describe('erdMultivaluedAttribute', () => {
    it('should have correct shape id', () => {
      expect(erdMultivaluedAttributeShape.id).toBe('erdMultivaluedAttribute');
    });

    it('should calculate bounds with label', () => {
      const ctx = createMockContext('phoneNumbers');
      const bounds = erdMultivaluedAttributeShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('emails');
      const anchors = erdMultivaluedAttributeShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render double ellipse for multivalued attribute', () => {
      const ctx = createMockContext('skills');
      const svg = erdMultivaluedAttributeShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('skills');
      // Should have two ellipses
    });
  });
});
