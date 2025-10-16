import { describe, it, expect } from 'vitest';
import type { ShapeRenderContext } from '../types.js';
import { cloudShape } from '../shapes/cloud.js';

// Mock context helper
function createMockContext(label: string): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'cloud',
      label,
    },
    style: {
      fill: '#f0f0f0',
      stroke: '#333',
      strokeWidth: 1,
      font: 'sans-serif',
      fontSize: 14,
      padding: 12,
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('Cloud Shape (TDD)', () => {
  describe('ID and Basics', () => {
    it('should have id "cloud"', () => {
      expect(cloudShape.id).toBe('cloud');
    });
  });

  describe('Bounds Calculation', () => {
    it('should calculate bounds with extra space for cloud bumps', () => {
      const ctx = createMockContext('Cloud Storage');
      const bounds = cloudShape.bounds(ctx);

      // Cloud needs extra space for the bumpy outline
      const textWidth = 'Cloud Storage'.length * 8;
      expect(bounds.width).toBeGreaterThan(textWidth);
      expect(bounds.width).toBeGreaterThanOrEqual(100);
      expect(bounds.height).toBeGreaterThanOrEqual(70);
    });

    it('should have minimum size even with short labels', () => {
      const ctx = createMockContext('C');
      const bounds = cloudShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(100);
      expect(bounds.height).toBeGreaterThanOrEqual(70);
    });
  });

  describe('Anchor Points', () => {
    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('AWS');
      const anchors = cloudShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should position anchors at edge centers', () => {
      const ctx = createMockContext('Cloud');
      const bounds = cloudShape.bounds(ctx);
      const anchors = cloudShape.anchors!(ctx);

      // Top anchor
      expect(anchors[0].x).toBe(bounds.width / 2);
      expect(anchors[0].y).toBe(0);

      // Right anchor
      expect(anchors[1].x).toBe(bounds.width);
      expect(anchors[1].y).toBe(bounds.height / 2);

      // Bottom anchor
      expect(anchors[2].x).toBe(bounds.width / 2);
      expect(anchors[2].y).toBe(bounds.height);

      // Left anchor
      expect(anchors[3].x).toBe(0);
      expect(anchors[3].y).toBe(bounds.height / 2);
    });
  });

  describe('SVG Rendering', () => {
    it('should render SVG path element', () => {
      const ctx = createMockContext('Cloud');
      const svg = cloudShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path');
      expect(svg).toContain('d=');
    });

    it('should use cubic Bezier curves for cloud bumps', () => {
      const ctx = createMockContext('Service');
      const svg = cloudShape.render(ctx, { x: 0, y: 0 });

      // Cloud outline uses cubic Bezier curves (C command)
      expect(svg).toContain('C');
    });

    it('should apply fill and stroke styles', () => {
      const ctx = createMockContext('Cloud');
      const svg = cloudShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('fill="#f0f0f0"');
      expect(svg).toContain('stroke="#333"');
      expect(svg).toContain('stroke-width="1"');
    });

    it('should render centered text label', () => {
      const ctx = createMockContext('AWS Cloud');
      const bounds = cloudShape.bounds(ctx);
      const svg = cloudShape.render(ctx, { x: 0, y: 0 });

      const cx = bounds.width / 2;
      const cy = bounds.height / 2;

      expect(svg).toContain('<text');
      expect(svg).toContain(`x="${cx}"`);
      expect(svg).toContain(`y="${cy}"`);
      expect(svg).toContain('text-anchor="middle"');
      expect(svg).toContain('AWS Cloud');
    });

    it('should position cloud at specified coordinates', () => {
      const ctx = createMockContext('Cloud');
      const svg = cloudShape.render(ctx, { x: 100, y: 50 });

      // Path should start at or near the specified position
      expect(svg).toMatch(/M\s+\d+/);
    });
  });

  describe('Cloud Shape Characteristics', () => {
    it('should have distinctive cloud-like outline', () => {
      const ctx = createMockContext('Cloud');
      const svg = cloudShape.render(ctx, { x: 0, y: 0 });

      // Cloud should have multiple curve segments
      const curveCount = (svg.match(/C/g) || []).length;
      expect(curveCount).toBeGreaterThanOrEqual(6); // At least 6 bumps
    });

    it('should be wider than it is tall (typical cloud proportion)', () => {
      const ctx = createMockContext('Cloud');
      const bounds = cloudShape.bounds(ctx);

      // Clouds are typically wider than tall
      expect(bounds.width).toBeGreaterThan(bounds.height);
    });
  });
});
