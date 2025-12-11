import { describe, expect, it } from 'vitest';
import { activityFinalShape, flowFinalShape } from './activity-final-nodes.js';
import type { ShapeRenderContext } from '../../types/index.js';

// Mock shape context for testing
function createMockContext(): ShapeRenderContext {
  return {
    node: {
      id: 'test',
      shape: '@activityFinal',
      label: '',
    },
    style: {
      stroke: '#000000',
      strokeWidth: 1.5,
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  } as ShapeRenderContext;
}

describe('Activity Final Node Shapes', () => {
  describe('activityFinalShape', () => {
    it('should have correct shape ID', () => {
      expect(activityFinalShape.id).toBe('activityFinal');
    });

    it('should have fixed dimensions (24x24)', () => {
      const ctx = createMockContext();
      const bounds = activityFinalShape.bounds(ctx);

      expect(bounds.width).toBe(24);
      expect(bounds.height).toBe(24);
    });

    it("should render bull's eye (outer circle + filled inner circle)", () => {
      const ctx = createMockContext();
      const svg = activityFinalShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<g class="activity-final-shape">');

      // Should have two circles
      const circles = svg.match(/<circle/g);
      expect(circles).toHaveLength(2);

      // Outer circle should be unfilled
      expect(svg).toContain('fill="none"');

      // Inner circle should be filled
      expect(svg).toMatch(/fill="#000000"/);
    });

    it('should have outer circle with no fill', () => {
      const ctx = createMockContext();
      const svg = activityFinalShape.render(ctx, { x: 10, y: 10 });

      // Check for outer circle with no fill
      expect(svg).toMatch(/circle.*r="[\d.]+".*fill="none"/);
    });

    it('should have inner circle that is filled', () => {
      const ctx = createMockContext();
      const svg = activityFinalShape.render(ctx, { x: 10, y: 10 });

      // Inner circle should be filled (bull's eye effect)
      expect(svg).toMatch(/circle.*fill="#000000"/);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext();
      const anchors = activityFinalShape.anchors?.(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors!.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should use custom stroke color', () => {
      const ctx = createMockContext();
      ctx.style.stroke = '#ff0000';

      const svg = activityFinalShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('stroke="#ff0000"');
      expect(svg).toContain('fill="#ff0000"'); // Inner circle uses stroke color as fill
    });

    it('should center circles at position', () => {
      const ctx = createMockContext();
      const svg = activityFinalShape.render(ctx, { x: 100, y: 200 });

      // Center should be at x + width/2, y + height/2 = (112, 212)
      expect(svg).toContain('cx="112"');
      expect(svg).toContain('cy="212"');
    });
  });

  describe('flowFinalShape', () => {
    it('should have correct shape ID', () => {
      expect(flowFinalShape.id).toBe('flowFinal');
    });

    it('should have fixed dimensions (20x20)', () => {
      const ctx = createMockContext();
      const bounds = flowFinalShape.bounds(ctx);

      expect(bounds.width).toBe(20);
      expect(bounds.height).toBe(20);
    });

    it('should render circle with X inside', () => {
      const ctx = createMockContext();
      const svg = flowFinalShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<g class="flow-final-shape">');

      // Should have one circle
      const circles = svg.match(/<circle/g);
      expect(circles).toHaveLength(1);

      // Circle should be unfilled
      expect(svg).toContain('fill="none"');

      // Should have two lines forming X
      const lines = svg.match(/<line/g);
      expect(lines).toHaveLength(2);
    });

    it('should have unfilled circle', () => {
      const ctx = createMockContext();
      const svg = flowFinalShape.render(ctx, { x: 10, y: 10 });

      expect(svg).toMatch(/circle.*fill="none"/);
    });

    it('should have X formed by two diagonal lines', () => {
      const ctx = createMockContext();
      const svg = flowFinalShape.render(ctx, { x: 0, y: 0 });

      // Should have exactly 2 lines
      const lines = svg.match(/<line/g);
      expect(lines).toHaveLength(2);

      // Lines should have x1, y1, x2, y2 attributes
      expect(svg).toMatch(/x1="/);
      expect(svg).toMatch(/y1="/);
      expect(svg).toMatch(/x2="/);
      expect(svg).toMatch(/y2="/);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext();
      const anchors = flowFinalShape.anchors?.(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors!.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should use custom stroke color', () => {
      const ctx = createMockContext();
      ctx.style.stroke = '#0000ff';

      const svg = flowFinalShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('stroke="#0000ff"');
    });

    it('should center circle and X at position', () => {
      const ctx = createMockContext();
      const svg = flowFinalShape.render(ctx, { x: 50, y: 100 });

      // Center should be at x + width/2, y + height/2 = (60, 110)
      expect(svg).toContain('cx="60"');
      expect(svg).toContain('cy="110"');
    });

    it('should apply custom stroke width', () => {
      const ctx = createMockContext();
      ctx.style.strokeWidth = 2;

      const svg = flowFinalShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('stroke-width="2"');
    });
  });

  describe('Shape differences', () => {
    it("should distinguish activity final (bull's eye) from flow final (X)", () => {
      const ctx = createMockContext();

      const activitySvg = activityFinalShape.render(ctx, { x: 0, y: 0 });
      const flowSvg = flowFinalShape.render(ctx, { x: 0, y: 0 });

      // Activity final has 2 circles, no lines
      expect((activitySvg.match(/<circle/g) || []).length).toBe(2);
      expect(activitySvg).not.toContain('<line');

      // Flow final has 1 circle, 2 lines
      expect((flowSvg.match(/<circle/g) || []).length).toBe(1);
      expect((flowSvg.match(/<line/g) || []).length).toBe(2);
    });

    it('should have activity final larger than flow final', () => {
      const ctx = createMockContext();

      const activityBounds = activityFinalShape.bounds(ctx);
      const flowBounds = flowFinalShape.bounds(ctx);

      expect(activityBounds.width).toBeGreaterThan(flowBounds.width);
      expect(activityBounds.height).toBeGreaterThan(flowBounds.height);
    });

    it('should have different CSS classes', () => {
      const ctx = createMockContext();

      const activitySvg = activityFinalShape.render(ctx, { x: 0, y: 0 });
      const flowSvg = flowFinalShape.render(ctx, { x: 0, y: 0 });

      expect(activitySvg).toContain('activity-final-shape');
      expect(flowSvg).toContain('flow-final-shape');
    });
  });

  describe('UML 2.5 semantics', () => {
    it('activity final should represent termination of entire activity', () => {
      // Activity Final: All tokens are consumed, entire activity stops
      expect(activityFinalShape.id).toBe('activityFinal');
      expect(activityFinalShape.bounds({} as ShapeRenderContext).width).toBe(
        24
      );
    });

    it('flow final should represent termination of single flow', () => {
      // Flow Final: Only this flow stops, other concurrent flows can continue
      expect(flowFinalShape.id).toBe('flowFinal');
      expect(flowFinalShape.bounds({} as ShapeRenderContext).width).toBe(20);
    });
  });
});
