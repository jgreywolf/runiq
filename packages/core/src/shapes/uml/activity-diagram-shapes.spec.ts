import { describe, it, expect } from 'vitest';
import type { RenderContext } from '../../types.js';
import { activityShape } from './activity.js';
import { activityDecisionShape } from './activityDecision.js';
import { activityMergeShape } from './activityMerge.js';

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

describe('UML Activity Diagram Shapes', () => {
  describe('activityShape', () => {
    it('should have correct id', () => {
      expect(activityShape.id).toBe('activity');
    });

    it('should calculate bounds with rounded corners', () => {
      const ctx = createMockContext('Process Data');
      const bounds = activityShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(80);
      expect(bounds.height).toBeGreaterThan(30);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Validate Input');
      const anchors = activityShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors[0].name).toBe('top');
      expect(anchors[1].name).toBe('right');
      expect(anchors[2].name).toBe('bottom');
      expect(anchors[3].name).toBe('left');
    });

    it('should render rounded rectangle', () => {
      const ctx = createMockContext('Send Email');
      const svg = activityShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('rx=');
      expect(svg).toContain('Send Email');
    });
  });

  describe('activityDecisionShape', () => {
    it('should have correct id', () => {
      expect(activityDecisionShape.id).toBe('activityDecision');
    });

    it('should calculate bounds as diamond', () => {
      const ctx = createMockContext();
      const bounds = activityDecisionShape.bounds(ctx);

      expect(bounds.width).toBeLessThan(60);
      expect(bounds.height).toBeLessThan(60);
      expect(bounds.width).toBe(bounds.height);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext();
      const anchors = activityDecisionShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render diamond shape', () => {
      const ctx = createMockContext();
      const svg = activityDecisionShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path') || expect(svg).toContain('<polygon');
    });

    it('should support guard conditions', () => {
      const ctx = createMockContext('[x > 0]');
      const svg = activityDecisionShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('[x > 0]');
    });
  });

  describe('activityMergeShape', () => {
    it('should have correct id', () => {
      expect(activityMergeShape.id).toBe('activityMerge');
    });

    it('should calculate bounds as diamond', () => {
      const ctx = createMockContext();
      const bounds = activityMergeShape.bounds(ctx);

      expect(bounds.width).toBeLessThan(60);
      expect(bounds.height).toBeLessThan(60);
      expect(bounds.width).toBe(bounds.height);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext();
      const anchors = activityMergeShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render diamond shape', () => {
      const ctx = createMockContext();
      const svg = activityMergeShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path') || expect(svg).toContain('<polygon');
    });
  });
});
