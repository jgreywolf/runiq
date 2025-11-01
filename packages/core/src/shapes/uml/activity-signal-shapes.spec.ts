import { describe, it, expect } from 'vitest';
import {
  sendSignalShape,
  receiveSignalShape,
  acceptEventShape,
} from './activity-signal-shapes';
import type { ShapeRenderContext } from '../../types';

describe('Activity Signal Shapes', () => {
  const mockContext: ShapeRenderContext = {
    node: { id: 'test', label: 'TestSignal' },
    style: {
      fontSize: 14,
      font: 'Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 1,
      padding: 10,
    },
    measureText: (text: string) => ({ width: text.length * 8, height: 14 }),
  };

  describe('sendSignalShape', () => {
    it('should have correct id', () => {
      expect(sendSignalShape.id).toBe('sendSignal');
    });

    it('should calculate bounds correctly', () => {
      const bounds = sendSignalShape.bounds(mockContext);
      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
      expect(bounds.width).toBeGreaterThanOrEqual(100); // Min width
      expect(bounds.height).toBeGreaterThanOrEqual(50); // Min height
    });

    it('should provide 4 anchor points', () => {
      const anchors = sendSignalShape.anchors(mockContext);
      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render convex pentagon pointing right', () => {
      const svg = sendSignalShape.render(mockContext, { x: 0, y: 0 });
      expect(svg).toContain('<g class="send-signal-shape">');
      expect(svg).toContain('<path');
      expect(svg).toContain('TestSignal');
      expect(svg).toContain('</g>');
    });

    it('should use custom styles', () => {
      const customContext = {
        ...mockContext,
        style: {
          ...mockContext.style,
          fill: '#ff0000',
          stroke: '#0000ff',
          strokeWidth: 2,
        },
      };
      const svg = sendSignalShape.render(customContext, { x: 10, y: 20 });
      expect(svg).toContain('fill="#ff0000"');
      expect(svg).toContain('stroke="#0000ff"');
      expect(svg).toContain('stroke-width="2"');
    });

    it('should handle default label', () => {
      const contextWithoutLabel = {
        ...mockContext,
        node: { id: 'test' },
      };
      const svg = sendSignalShape.render(contextWithoutLabel, { x: 0, y: 0 });
      expect(svg).toContain('Send');
    });
  });

  describe('receiveSignalShape', () => {
    it('should have correct id', () => {
      expect(receiveSignalShape.id).toBe('receiveSignal');
    });

    it('should calculate bounds correctly', () => {
      const bounds = receiveSignalShape.bounds(mockContext);
      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
      expect(bounds.width).toBeGreaterThanOrEqual(100);
      expect(bounds.height).toBeGreaterThanOrEqual(50);
    });

    it('should provide 4 anchor points', () => {
      const anchors = receiveSignalShape.anchors(mockContext);
      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render concave pentagon with left notch', () => {
      const svg = receiveSignalShape.render(mockContext, { x: 0, y: 0 });
      expect(svg).toContain('<g class="receive-signal-shape">');
      expect(svg).toContain('<path');
      expect(svg).toContain('TestSignal');
      expect(svg).toContain('</g>');
    });

    it('should use custom styles', () => {
      const customContext = {
        ...mockContext,
        style: {
          ...mockContext.style,
          fill: '#00ff00',
          stroke: '#ff00ff',
          strokeWidth: 3,
        },
      };
      const svg = receiveSignalShape.render(customContext, { x: 5, y: 10 });
      expect(svg).toContain('fill="#00ff00"');
      expect(svg).toContain('stroke="#ff00ff"');
      expect(svg).toContain('stroke-width="3"');
    });

    it('should handle default label', () => {
      const contextWithoutLabel = {
        ...mockContext,
        node: { id: 'test' },
      };
      const svg = receiveSignalShape.render(contextWithoutLabel, {
        x: 0,
        y: 0,
      });
      expect(svg).toContain('Receive');
    });
  });

  describe('acceptEventShape', () => {
    it('should have correct id', () => {
      expect(acceptEventShape.id).toBe('acceptEvent');
    });

    it('should calculate bounds correctly', () => {
      const bounds = acceptEventShape.bounds(mockContext);
      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
      expect(bounds.width).toBeGreaterThanOrEqual(100);
      expect(bounds.height).toBeGreaterThanOrEqual(50);
    });

    it('should provide 4 anchor points', () => {
      const anchors = acceptEventShape.anchors(mockContext);
      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render concave pentagon (same as receive)', () => {
      const svg = acceptEventShape.render(mockContext, { x: 0, y: 0 });
      expect(svg).toContain('<g class="accept-event-shape">');
      expect(svg).toContain('<path');
      expect(svg).toContain('TestSignal');
      expect(svg).toContain('</g>');
    });

    it('should use custom styles', () => {
      const customContext = {
        ...mockContext,
        style: {
          ...mockContext.style,
          fill: '#ffff00',
          stroke: '#00ffff',
          strokeWidth: 4,
        },
      };
      const svg = acceptEventShape.render(customContext, { x: 15, y: 25 });
      expect(svg).toContain('fill="#ffff00"');
      expect(svg).toContain('stroke="#00ffff"');
      expect(svg).toContain('stroke-width="4"');
    });

    it('should handle default label', () => {
      const contextWithoutLabel = {
        ...mockContext,
        node: { id: 'test' },
      };
      const svg = acceptEventShape.render(contextWithoutLabel, { x: 0, y: 0 });
      expect(svg).toContain('Wait');
    });
  });

  describe('Shape differences', () => {
    it('sendSignal should have convex right side (pointing right)', () => {
      const bounds = sendSignalShape.bounds(mockContext);
      const anchors = sendSignalShape.anchors(mockContext);
      const rightAnchor = anchors.find((a) => a.name === 'right');
      // Right anchor should be further right due to the convex point
      expect(rightAnchor?.x).toBeGreaterThan(bounds.width * 0.8);
    });

    it('receiveSignal should have concave left side (notched left)', () => {
      const bounds = receiveSignalShape.bounds(mockContext);
      const anchors = receiveSignalShape.anchors(mockContext);
      const leftAnchor = anchors.find((a) => a.name === 'left');
      // Left anchor should be indented due to the concave notch
      expect(leftAnchor?.x).toBeGreaterThan(0);
      expect(leftAnchor?.x).toBeLessThan(bounds.width * 0.3);
    });

    it('acceptEvent should have same shape as receiveSignal', () => {
      const receiveBounds = receiveSignalShape.bounds(mockContext);
      const acceptBounds = acceptEventShape.bounds(mockContext);
      expect(acceptBounds).toEqual(receiveBounds);

      const receiveAnchors = receiveSignalShape.anchors(mockContext);
      const acceptAnchors = acceptEventShape.anchors(mockContext);
      expect(acceptAnchors).toEqual(receiveAnchors);
    });
  });
});
