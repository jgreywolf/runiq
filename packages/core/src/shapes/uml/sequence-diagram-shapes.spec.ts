import { describe, it, expect } from 'vitest';
import type { RenderContext } from '../../types.js';
import { lifelineShape } from './lifeline.js';
import { activationShape } from './activation.js';
import { fragmentShape } from './fragment.js';
import { deletionShape } from './deletion.js';

// Mock render context helper
function createMockContext(label: string = '', data: Record<string, unknown> = {}): RenderContext {
  return {
    node: {
      id: 'test-node',
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

describe('UML Sequence Diagram Shapes', () => {
  describe('lifelineShape', () => {
    it('should have correct id', () => {
      expect(lifelineShape.id).toBe('lifeline');
    });

    it('should calculate bounds with header box and line', () => {
      const ctx = createMockContext('UserService');
      const bounds = lifelineShape.bounds(ctx);

      // Should have width for the header box and height for the vertical line
      expect(bounds.width).toBeGreaterThan(80);
      expect(bounds.height).toBeGreaterThan(100);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Database');
      const anchors = lifelineShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors[0].name).toBe('top');
      expect(anchors[1].name).toBe('right');
      expect(anchors[2].name).toBe('bottom');
      expect(anchors[3].name).toBe('left');
    });

    it('should render lifeline with header box and dashed line', () => {
      const ctx = createMockContext(':Controller');
      const svg = lifelineShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect'); // Header box
      expect(svg).toContain('stroke-dasharray'); // Dashed line
      expect(svg).toContain(':Controller');
    });

    it('should support custom height', () => {
      const ctx = createMockContext('Service', { height: 300 });
      const bounds = lifelineShape.bounds(ctx);

      // Total height = header height + line height
      // Header is ~42px (padding + line height), so total should be 342
      expect(bounds.height).toBeGreaterThan(300);
      expect(bounds.height).toBeLessThan(360);
    });

    it('should support stereotype', () => {
      const ctx = createMockContext('API', { stereotype: 'boundary' });
      const svg = lifelineShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('«boundary»');
    });
  });

  describe('activationShape', () => {
    it('should have correct id', () => {
      expect(activationShape.id).toBe('activation');
    });

    it('should calculate bounds as thin vertical rectangle', () => {
      const ctx = createMockContext('', { height: 80 });
      const bounds = activationShape.bounds(ctx);

      // Activation boxes are narrow (typically 10-20 px)
      expect(bounds.width).toBeLessThan(30);
      expect(bounds.height).toBe(80);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext();
      const anchors = activationShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render thin rectangle', () => {
      const ctx = createMockContext('', { height: 100 });
      const svg = activationShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('width="16"'); // Thin activation box
    });

    it('should default to 60px height if not specified', () => {
      const ctx = createMockContext();
      const bounds = activationShape.bounds(ctx);

      expect(bounds.height).toBe(60);
    });
  });

  describe('fragmentShape', () => {
    it('should have correct id', () => {
      expect(fragmentShape.id).toBe('fragment');
    });

    it('should calculate bounds for interaction fragment', () => {
      const ctx = createMockContext('alt');
      const bounds = fragmentShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(100);
      expect(bounds.height).toBeGreaterThan(80);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('loop');
      const anchors = fragmentShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render fragment with operator in pentagon', () => {
      const ctx = createMockContext('alt', {
        condition: '[x > 0]',
      });
      const svg = fragmentShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect'); // Main frame
      expect(svg).toContain('<path'); // Pentagon for operator
      expect(svg).toContain('alt');
      expect(svg).toContain('[x > 0]');
    });

    it('should support different operators', () => {
      const operators = ['alt', 'opt', 'loop', 'par', 'break', 'critical', 'ref'];
      
      operators.forEach((op) => {
        const ctx = createMockContext(op);
        const svg = fragmentShape.render(ctx, { x: 0, y: 0 });
        expect(svg).toContain(op);
      });
    });

    it('should handle fragment without condition', () => {
      const ctx = createMockContext('opt');
      const svg = fragmentShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('opt');
    });

    it('should support custom width and height', () => {
      const ctx = createMockContext('loop', {
        width: 300,
        height: 200,
      });
      const bounds = fragmentShape.bounds(ctx);

      expect(bounds.width).toBe(300);
      expect(bounds.height).toBe(200);
    });
  });

  describe('deletionShape', () => {
    it('should have correct id', () => {
      expect(deletionShape.id).toBe('deletion');
    });

    it('should calculate bounds as small square', () => {
      const ctx = createMockContext();
      const bounds = deletionShape.bounds(ctx);

      // Deletion X is typically 20-30px
      expect(bounds.width).toBeLessThan(40);
      expect(bounds.height).toBeLessThan(40);
      expect(bounds.width).toBe(bounds.height); // Square
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext();
      const anchors = deletionShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render X mark', () => {
      const ctx = createMockContext();
      const svg = deletionShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<line'); // Two lines forming X
      // Should have at least 2 lines
      const lineCount = (svg.match(/<line/g) || []).length;
      expect(lineCount).toBeGreaterThanOrEqual(2);
    });

    it('should use thicker stroke for visibility', () => {
      const ctx = createMockContext();
      const svg = deletionShape.render(ctx, { x: 0, y: 0 });

      // Should use stroke-width of 2 or 3
      const hasThickStroke = svg.includes('stroke-width="2"') || svg.includes('stroke-width="3"');
      expect(hasThickStroke).toBe(true);
    });
  });
});
