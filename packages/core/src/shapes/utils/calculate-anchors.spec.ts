import { describe, expect, it, vi } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import {
  calculateCircularAnchors,
  calculateCustomAnchors,
  calculateDiamondAnchors,
  calculateOctagonalAnchors,
  calculateRectangularAnchors,
  type CustomAnchorConfig,
} from './calculate-anchors.js';

function createMockContext(label = 'Test'): ShapeRenderContext {
  const mockMeasureText = vi.fn(() => ({
    width: 100,
    height: 50,
  }));

  return {
    node: { id: 'test', label },
    style: {},
    measureText: mockMeasureText,
  } as unknown as ShapeRenderContext;
}

describe('calculate-anchors utilities', () => {
  describe('calculateRectangularAnchors', () => {
    it('should calculate 4-point anchors', () => {
      const ctx = createMockContext();
      const bounds = { width: 100, height: 50 };
      const anchors = calculateRectangularAnchors(ctx, bounds);

      expect(anchors).toHaveLength(4);
    });

    it('should place top anchor correctly', () => {
      const ctx = createMockContext();
      const bounds = { width: 100, height: 50 };
      const anchors = calculateRectangularAnchors(ctx, bounds);

      const top = anchors.find((a) => a.name === 'top');
      expect(top).toEqual({ x: 50, y: 0, name: 'top' });
    });

    it('should place right anchor correctly', () => {
      const ctx = createMockContext();
      const bounds = { width: 100, height: 50 };
      const anchors = calculateRectangularAnchors(ctx, bounds);

      const right = anchors.find((a) => a.name === 'right');
      expect(right).toEqual({ x: 100, y: 25, name: 'right' });
    });

    it('should place bottom anchor correctly', () => {
      const ctx = createMockContext();
      const bounds = { width: 100, height: 50 };
      const anchors = calculateRectangularAnchors(ctx, bounds);

      const bottom = anchors.find((a) => a.name === 'bottom');
      expect(bottom).toEqual({ x: 50, y: 50, name: 'bottom' });
    });

    it('should place left anchor correctly', () => {
      const ctx = createMockContext();
      const bounds = { width: 100, height: 50 };
      const anchors = calculateRectangularAnchors(ctx, bounds);

      const left = anchors.find((a) => a.name === 'left');
      expect(left).toEqual({ x: 0, y: 25, name: 'left' });
    });

    it('should use measureText if bounds not provided', () => {
      const ctx = createMockContext();
      const anchors = calculateRectangularAnchors(ctx);

      expect(anchors).toHaveLength(4);
      // Uses ctx.measureText result: width: 100, height: 50
      expect(anchors[0]).toEqual({ x: 50, y: 0, name: 'top' });
    });
  });

  describe('calculateOctagonalAnchors', () => {
    it('should calculate 8-point anchors', () => {
      const ctx = createMockContext();
      const bounds = { width: 100, height: 100 };
      const anchors = calculateOctagonalAnchors(ctx, bounds);

      expect(anchors).toHaveLength(8);
    });

    it('should include all cardinal directions', () => {
      const ctx = createMockContext();
      const bounds = { width: 100, height: 100 };
      const anchors = calculateOctagonalAnchors(ctx, bounds);

      const names = anchors.map((a) => a.name);
      expect(names).toContain('top');
      expect(names).toContain('right');
      expect(names).toContain('bottom');
      expect(names).toContain('left');
    });

    it('should include all diagonal directions', () => {
      const ctx = createMockContext();
      const bounds = { width: 100, height: 100 };
      const anchors = calculateOctagonalAnchors(ctx, bounds);

      const names = anchors.map((a) => a.name);
      expect(names).toContain('top-right');
      expect(names).toContain('bottom-right');
      expect(names).toContain('bottom-left');
      expect(names).toContain('top-left');
    });

    it('should place diagonal anchors at 0.85 offset', () => {
      const ctx = createMockContext();
      const bounds = { width: 100, height: 100 };
      const anchors = calculateOctagonalAnchors(ctx, bounds);

      const topRight = anchors.find((a) => a.name === 'top-right');
      expect(topRight).toEqual({ x: 85, y: 15, name: 'top-right' });
    });

    it('should place cardinal anchors at midpoints', () => {
      const ctx = createMockContext();
      const bounds = { width: 100, height: 100 };
      const anchors = calculateOctagonalAnchors(ctx, bounds);

      const right = anchors.find((a) => a.name === 'right');
      expect(right).toEqual({ x: 100, y: 50, name: 'right' });
    });
  });

  describe('calculateCircularAnchors', () => {
    it('should calculate anchors with default 4 points', () => {
      const ctx = createMockContext();
      const bounds = { width: 100, height: 100 };
      const anchors = calculateCircularAnchors(ctx, bounds);

      expect(anchors).toHaveLength(4);
    });

    it('should calculate custom number of points', () => {
      const ctx = createMockContext();
      const bounds = { width: 100, height: 100 };
      const anchors = calculateCircularAnchors(ctx, bounds, 8);

      expect(anchors).toHaveLength(8);
    });

    it('should start at top (0°)', () => {
      const ctx = createMockContext();
      const bounds = { width: 100, height: 100 };
      const anchors = calculateCircularAnchors(ctx, bounds);

      const top = anchors[0];
      expect(top.name).toBe('top');
      expect(top.x).toBeCloseTo(50, 1);
      expect(top.y).toBeCloseTo(0, 1);
    });

    it('should place 4 points at cardinal directions', () => {
      const ctx = createMockContext();
      const bounds = { width: 100, height: 100 };
      const anchors = calculateCircularAnchors(ctx, bounds, 4);

      const names = anchors.map((a) => a.name);
      expect(names).toEqual(['top', 'right', 'bottom', 'left']);
    });

    it('should handle elliptical bounds', () => {
      const ctx = createMockContext();
      const bounds = { width: 200, height: 100 };
      const anchors = calculateCircularAnchors(ctx, bounds, 4);

      // Right anchor should be at edge of ellipse
      const right = anchors[1];
      expect(right.x).toBeCloseTo(200, 1);
      expect(right.y).toBeCloseTo(50, 1);
    });

    it('should name additional points by angle', () => {
      const ctx = createMockContext();
      const bounds = { width: 100, height: 100 };
      const anchors = calculateCircularAnchors(ctx, bounds, 6);

      // 5th and 6th anchors should use angle naming
      expect(anchors[4].name).toContain('angle-');
      expect(anchors[5].name).toContain('angle-');
    });
  });

  describe('calculateDiamondAnchors', () => {
    it('should calculate 4-point anchors', () => {
      const ctx = createMockContext();
      const bounds = { width: 100, height: 100 };
      const anchors = calculateDiamondAnchors(ctx, bounds);

      expect(anchors).toHaveLength(4);
    });

    it('should place anchors at diamond points', () => {
      const ctx = createMockContext();
      const bounds = { width: 100, height: 50 };
      const anchors = calculateDiamondAnchors(ctx, bounds);

      expect(anchors).toEqual([
        { x: 50, y: 0, name: 'top' },
        { x: 100, y: 25, name: 'right' },
        { x: 50, y: 50, name: 'bottom' },
        { x: 0, y: 25, name: 'left' },
      ]);
    });

    it('should be identical to rectangular for diamond shapes', () => {
      const ctx = createMockContext();
      const bounds = { width: 100, height: 100 };
      const diamond = calculateDiamondAnchors(ctx, bounds);
      const rect = calculateRectangularAnchors(ctx, bounds);

      expect(diamond).toEqual(rect);
    });
  });

  describe('calculateCustomAnchors', () => {
    it('should calculate anchors from relative positions', () => {
      const bounds = { width: 100, height: 100 };
      const configs: CustomAnchorConfig[] = [
        { x: 0.5, y: 0, name: 'top' },
        { x: 1, y: 0.5, name: 'right' },
      ];

      const anchors = calculateCustomAnchors(bounds, configs);

      expect(anchors).toEqual([
        { x: 50, y: 0, name: 'top' },
        { x: 100, y: 50, name: 'right' },
      ]);
    });

    it('should calculate anchors from absolute positions', () => {
      const bounds = { width: 100, height: 100 };
      const configs: CustomAnchorConfig[] = [
        { x: 20, y: 30, name: 'custom1' },
        { x: 80, y: 70, name: 'custom2' },
      ];

      const anchors = calculateCustomAnchors(bounds, configs);

      expect(anchors).toEqual([
        { x: 20, y: 30, name: 'custom1' },
        { x: 80, y: 70, name: 'custom2' },
      ]);
    });

    it('should handle mixed relative and absolute positions', () => {
      const bounds = { width: 100, height: 100 };
      const configs: CustomAnchorConfig[] = [
        { x: 0.5, y: 0, name: 'relative' },
        { x: 25, y: 75, name: 'absolute' },
      ];

      const anchors = calculateCustomAnchors(bounds, configs);

      expect(anchors[0]).toEqual({ x: 50, y: 0, name: 'relative' });
      expect(anchors[1]).toEqual({ x: 25, y: 75, name: 'absolute' });
    });

    it('should handle string positions', () => {
      const bounds = { width: 100, height: 100 };
      const configs: CustomAnchorConfig[] = [
        { x: '50', y: '25', name: 'string' },
      ];

      const anchors = calculateCustomAnchors(bounds, configs);

      expect(anchors[0]).toEqual({ x: 50, y: 25, name: 'string' });
    });

    it('should handle empty config array', () => {
      const bounds = { width: 100, height: 100 };
      const anchors = calculateCustomAnchors(bounds, []);

      expect(anchors).toEqual([]);
    });

    it('should support any anchor names', () => {
      const bounds = { width: 100, height: 100 };
      const configs: CustomAnchorConfig[] = [
        { x: 0.5, y: 0.5, name: 'center' },
        { x: 0.25, y: 0.25, name: 'quarter' },
        { x: 0.75, y: 0.75, name: 'three-quarters' },
      ];

      const anchors = calculateCustomAnchors(bounds, configs);

      const names = anchors.map((a) => a.name);
      expect(names).toEqual(['center', 'quarter', 'three-quarters']);
    });
  });
});
