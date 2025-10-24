import { describe, it, expect } from 'vitest';
import type { ShapeRenderContext } from '../../types.js';
import { activityShape } from './activity.js';

// Mock render context helper
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
});
