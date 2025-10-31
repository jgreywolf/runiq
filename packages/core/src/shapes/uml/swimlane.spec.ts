import { describe, expect, it } from 'vitest';
import { swimlaneShape } from './swimlane.js';
import type { ShapeRenderContext } from '../../types.js';

// Mock shape context for testing
function createMockContext(data?: Record<string, unknown>): ShapeRenderContext {
  return {
    node: {
      id: 'test',
      shape: '@swimlane',
      label: 'Test Swimlane',
      data,
    },
    style: {
      stroke: '#000000',
      strokeWidth: 1.5,
      fill: '#f0f0f0',
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  } as ShapeRenderContext;
}

describe('Swimlane Shape', () => {
  describe('Basic properties', () => {
    it('should have correct shape ID', () => {
      expect(swimlaneShape.id).toBe('swimlane');
    });

    it('should have minimum dimensions', () => {
      const ctx = createMockContext();
      const bounds = swimlaneShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(150);
      expect(bounds.height).toBeGreaterThanOrEqual(40);
    });

    it('should calculate bounds based on label text', () => {
      const ctx = createMockContext();
      ctx.node.label = 'Very Long Swimlane Label That Needs More Space';

      const bounds = swimlaneShape.bounds(ctx);

      // Width should accommodate text + padding
      expect(bounds.width).toBeGreaterThan(150);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext();
      const anchors = swimlaneShape.anchors?.(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors!.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });
  });

  describe('Vertical orientation (default)', () => {
    it('should render vertical swimlane by default', () => {
      const ctx = createMockContext();
      const svg = swimlaneShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('class="swimlane-shape"');
      expect(svg).toContain('<rect');

      // Vertical swimlane has horizontal separator at y=40
      expect(svg).toContain('y1="40"');
      expect(svg).toContain('y2="40"');
    });

    it('should place label on top for vertical swimlane', () => {
      const ctx = createMockContext();
      const svg = swimlaneShape.render(ctx, { x: 0, y: 0 });

      // Label should be centered horizontally, positioned at y=20 (top area)
      expect(svg).toMatch(/text-anchor="middle"/);
      expect(svg).toMatch(/y="20"/);
    });

    it('should draw horizontal separator line', () => {
      const ctx = createMockContext();
      const svg = swimlaneShape.render(ctx, { x: 10, y: 20 });

      // Should have a line element for separator
      expect(svg).toMatch(/<line.*y1="60".*y2="60"/); // y + 40
    });
  });

  describe('Horizontal orientation', () => {
    it('should render horizontal swimlane when orientation is specified', () => {
      const ctx = createMockContext({ orientation: 'horizontal' });
      const svg = swimlaneShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('class="swimlane-shape"');

      // Horizontal swimlane has vertical separator at x=100
      expect(svg).toContain('x1="100"');
      expect(svg).toContain('x2="100"');
    });

    it('should place label on left for horizontal swimlane', () => {
      const ctx = createMockContext({ orientation: 'horizontal' });
      const svg = swimlaneShape.render(ctx, { x: 0, y: 0 });

      // Label should be centered at x=50 (left area)
      expect(svg).toMatch(/x="50"/);
      expect(svg).toMatch(/text-anchor="middle"/);
    });

    it('should draw vertical separator line', () => {
      const ctx = createMockContext({ orientation: 'horizontal' });
      const svg = swimlaneShape.render(ctx, { x: 10, y: 20 });

      // Should have a line element for vertical separator
      expect(svg).toMatch(/<line.*x1="110".*x2="110"/); // x + 100
    });
  });

  describe('Styling', () => {
    it('should use custom stroke color', () => {
      const ctx = createMockContext();
      ctx.style.stroke = '#ff0000';

      const svg = swimlaneShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('stroke="#ff0000"');
    });

    it('should use custom fill color', () => {
      const ctx = createMockContext();
      ctx.style.fill = '#e0e0ff';

      const svg = swimlaneShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('fill="#e0e0ff"');
    });

    it('should use custom stroke width', () => {
      const ctx = createMockContext();
      ctx.style.strokeWidth = 2;

      const svg = swimlaneShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('stroke-width="2"');
    });

    it('should use custom font size', () => {
      const ctx = createMockContext();
      ctx.style.fontSize = 16;

      const svg = swimlaneShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('font-size="16"');
    });
  });

  describe('Label rendering', () => {
    it('should render label text', () => {
      const ctx = createMockContext();
      ctx.node.label = 'Customer Service';

      const svg = swimlaneShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Customer Service');
    });

    it('should handle empty label', () => {
      const ctx = createMockContext();
      ctx.node.label = '';

      const svg = swimlaneShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<text');
      expect(svg).toContain('</text>');
    });

    it('should handle missing label', () => {
      const ctx = createMockContext();
      delete ctx.node.label;

      const svg = swimlaneShape.render(ctx, { x: 0, y: 0 });

      // Should not throw, should render empty text
      expect(svg).toContain('<text');
    });
  });

  describe('Position handling', () => {
    it('should position rectangle at specified coordinates', () => {
      const ctx = createMockContext();
      const svg = swimlaneShape.render(ctx, { x: 100, y: 200 });

      expect(svg).toContain('x="100"');
      expect(svg).toContain('y="200"');
    });

    it('should position separator relative to swimlane position (vertical)', () => {
      const ctx = createMockContext();
      const svg = swimlaneShape.render(ctx, { x: 50, y: 60 });

      // Horizontal separator should be at y + 40 = 100
      expect(svg).toMatch(/y1="100"/);
      expect(svg).toMatch(/y2="100"/);
    });

    it('should position separator relative to swimlane position (horizontal)', () => {
      const ctx = createMockContext({ orientation: 'horizontal' });
      const svg = swimlaneShape.render(ctx, { x: 50, y: 60 });

      // Vertical separator should be at x + 100 = 150
      expect(svg).toMatch(/x1="150"/);
      expect(svg).toMatch(/x2="150"/);
    });
  });

  describe('UML 2.5 semantics', () => {
    it('should represent activity partition (swimlane)', () => {
      // Swimlanes partition activities by responsibility
      const ctx = createMockContext();
      expect(swimlaneShape.id).toBe('swimlane');
      expect(swimlaneShape.bounds(ctx).width).toBeGreaterThanOrEqual(150);
    });

    it('should support both orientations as per UML 2.5', () => {
      const ctxV = createMockContext({ orientation: 'vertical' });
      const ctxH = createMockContext({ orientation: 'horizontal' });

      const svgV = swimlaneShape.render(ctxV, { x: 0, y: 0 });
      const svgH = swimlaneShape.render(ctxH, { x: 0, y: 0 });

      // Both should render successfully but differently
      expect(svgV).not.toBe(svgH);
      expect(svgV).toContain('swimlane-shape');
      expect(svgH).toContain('swimlane-shape');
    });
  });
});
