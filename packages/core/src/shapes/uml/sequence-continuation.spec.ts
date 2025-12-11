import { describe, it, expect } from 'vitest';
import { continuationShape } from './sequence-continuation.js';
import type { ShapeRenderContext } from '../../types/index.js';

function createMockContext(label = 'ref'): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'continuation',
      label,
    },
    style: {
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 1.5,
      fontSize: 14,
      fontFamily: 'Arial',
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('Continuation Shape', () => {
  describe('bounds', () => {
    it('should calculate bounds based on label', () => {
      const ctx = createMockContext('continue_flow');
      const bounds = continuationShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
      // Hexagon needs extra width for angled sides
      expect(bounds.width).toBeGreaterThan(
        ctx.measureText('continue_flow', ctx.style).width
      );
    });

    it('should have minimum dimensions', () => {
      const ctx = createMockContext('');
      const bounds = continuationShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(80);
      expect(bounds.height).toBeGreaterThanOrEqual(40);
    });
  });

  describe('anchors', () => {
    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('ref');
      const anchors = continuationShape.anchors?.(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors!.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should position anchors at hexagon boundaries', () => {
      const ctx = createMockContext('ref');
      const bounds = continuationShape.bounds(ctx);
      const anchors = continuationShape.anchors?.(ctx);

      expect(anchors![0]).toEqual({ x: bounds.width / 2, y: 0, name: 'top' });
      expect(anchors![1]).toEqual({
        x: bounds.width,
        y: bounds.height / 2,
        name: 'right',
      });
      expect(anchors![2]).toEqual({
        x: bounds.width / 2,
        y: bounds.height,
        name: 'bottom',
      });
      expect(anchors![3]).toEqual({ x: 0, y: bounds.height / 2, name: 'left' });
    });
  });

  describe('render', () => {
    it('should have correct shape id', () => {
      expect(continuationShape.id).toBe('continuation');
    });

    it('should render hexagon shape', () => {
      const ctx = createMockContext('ref');
      const svg = continuationShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<g class="continuation-shape">');
      expect(svg).toContain('<path d="M');
      expect(svg).toContain('Z"'); // Closed path
    });

    it('should render label centered', () => {
      const ctx = createMockContext('continue_here');
      const svg = continuationShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('continue_here');
      expect(svg).toContain('text-anchor="middle"');
    });

    it('should use default label "ref" when not provided', () => {
      const ctx = createMockContext('');
      const svg = continuationShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('ref');
    });

    it('should apply custom fill color', () => {
      const ctx = createMockContext('ref');
      ctx.style.fill = '#e3f2fd';
      const svg = continuationShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('fill="#e3f2fd"');
    });

    it('should apply custom stroke', () => {
      const ctx = createMockContext('ref');
      ctx.style.stroke = '#1976d2';
      ctx.style.strokeWidth = 2;
      const svg = continuationShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('stroke="#1976d2"');
      expect(svg).toContain('stroke-width="2"');
    });

    it('should render hexagon with angled sides', () => {
      const ctx = createMockContext('ref');
      const svg = continuationShape.render(ctx, { x: 0, y: 0 });

      // Hexagon has 6 points (M + 5L + Z)
      const pathMatch = svg.match(/M\s+[\d.]+\s+[\d.]+/);
      expect(pathMatch).toBeTruthy();

      // Should have L commands for each vertex
      const lineCommands = (svg.match(/L\s+[\d.]+\s+[\d.]+/g) || []).length;
      expect(lineCommands).toBe(5); // 5 L commands + initial M = 6 vertices
    });

    it('should support positioning', () => {
      const ctx = createMockContext('ref');
      const svg = continuationShape.render(ctx, { x: 100, y: 200 });

      // Check that coordinates include offset
      expect(svg).toMatch(/[ML]\s+1\d{2}(\.\d+)?\s+2\d{2}/);
    });
  });

  describe('UML 2.5 compliance', () => {
    it('should represent continuation for goto-like flow control', () => {
      const ctx = createMockContext('to_page2');
      const svg = continuationShape.render(ctx, { x: 0, y: 0 });

      // Continuation should be a closed hexagon
      expect(svg).toContain('Z"'); // Closed path
      expect(svg).toContain('to_page2');
    });

    it('should render with appropriate default stroke width', () => {
      const ctx = createMockContext('ref');
      const svg = continuationShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('stroke-width="1.5"');
    });
  });
});
