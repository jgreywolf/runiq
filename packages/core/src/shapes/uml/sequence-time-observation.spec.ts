import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { timeObservationShape } from './sequence-time-observation.js';

function createMockContext(label = ''): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'timeObservation',
      label,
    },
    style: {
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 1.5,
      fontSize: 12,
      fontFamily: 'Arial',
    },
    measureText: (text: string) => ({
      width: text.length * 7,
      height: 14,
    }),
  };
}

describe('Time Observation Shape', () => {
  describe('bounds', () => {
    it('should calculate minimum bounds without label', () => {
      const ctx = createMockContext();
      const bounds = timeObservationShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(40);
      expect(bounds.height).toBeGreaterThanOrEqual(40);
    });

    it('should expand bounds for label', () => {
      const ctx = createMockContext('t = 100ms');
      const bounds = timeObservationShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(40);
      expect(bounds.height).toBeGreaterThan(40);
    });

    it('should accommodate long timing labels', () => {
      const ctx = createMockContext('response time < 500ms');
      const bounds = timeObservationShape.bounds(ctx);

      const textSize = ctx.measureText('response time < 500ms', ctx.style);
      expect(bounds.width).toBeGreaterThanOrEqual(textSize.width);
    });
  });

  describe('anchors', () => {
    it('should provide 4 anchor points', () => {
      const ctx = createMockContext();
      const anchors = timeObservationShape.anchors?.(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors!.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should position anchors at shape boundaries', () => {
      const ctx = createMockContext();
      const bounds = timeObservationShape.bounds(ctx);
      const anchors = timeObservationShape.anchors?.(ctx);

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
      expect(timeObservationShape.id).toBe('timeObservation');
    });

    it('should render hourglass icon', () => {
      const ctx = createMockContext();
      const svg = timeObservationShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<g class="time-observation-shape">');
      expect(svg).toContain('<path d="M'); // Triangles
      expect(svg).toContain('<circle'); // Sand
    });

    it('should render two triangles for hourglass', () => {
      const ctx = createMockContext();
      const svg = timeObservationShape.render(ctx, { x: 0, y: 0 });

      // Should have two path elements (top and bottom triangles)
      const pathMatches = svg.match(/<path/g);
      expect(pathMatches).toHaveLength(2);
    });

    it('should render center line', () => {
      const ctx = createMockContext();
      const svg = timeObservationShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<line'); // Waist of hourglass
    });

    it('should render sand indicator', () => {
      const ctx = createMockContext();
      const svg = timeObservationShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<circle'); // Sand in bottom
    });

    it('should render label when provided', () => {
      const ctx = createMockContext('t1 = 50ms');
      const svg = timeObservationShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('t1 = 50ms');
      expect(svg).toContain('text-anchor="middle"');
    });

    it('should not render text element without label', () => {
      const ctx = createMockContext('');
      const svg = timeObservationShape.render(ctx, { x: 0, y: 0 });

      expect(svg).not.toContain('<text');
    });

    it('should apply custom fill color', () => {
      const ctx = createMockContext();
      ctx.style.fill = '#e3f2fd';
      const svg = timeObservationShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('fill="#e3f2fd"');
    });

    it('should apply custom stroke', () => {
      const ctx = createMockContext();
      ctx.style.stroke = '#1976d2';
      ctx.style.strokeWidth = 2;
      const svg = timeObservationShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('stroke="#1976d2"');
      expect(svg).toContain('stroke-width="2"');
    });

    it('should support positioning', () => {
      const ctx = createMockContext();
      const svg = timeObservationShape.render(ctx, { x: 100, y: 200 });

      // Check that coordinates include offset
      expect(svg).toMatch(/[MLxy]\s*=\s*"1\d{2}/);
    });
  });

  describe('UML 2.5 compliance', () => {
    it('should represent timing observation point', () => {
      const ctx = createMockContext('start');
      const svg = timeObservationShape.render(ctx, { x: 0, y: 0 });

      // Should have hourglass icon
      expect(svg).toContain('<path'); // Triangles
      expect(svg).toContain('start');
    });

    it('should support timing constraint labels', () => {
      const ctx = createMockContext('t < 100ms');
      const svg = timeObservationShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('t &lt; 100ms');
    });

    it('should support absolute time labels', () => {
      const ctx = createMockContext('2024-11-01 14:30:00');
      const svg = timeObservationShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('2024-11-01 14:30:00');
    });

    it('should render with appropriate default stroke width', () => {
      const ctx = createMockContext();
      const svg = timeObservationShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('stroke-width="1.5"');
    });
  });
});
