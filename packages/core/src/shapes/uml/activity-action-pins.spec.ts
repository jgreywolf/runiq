import { describe, expect, it } from 'vitest';
import { activityShape } from './activity.js';
import type { ShapeRenderContext } from '../../types.js';

// Mock shape context for testing
function createMockContext(
  label: string,
  options?: {
    inputPins?: string[];
    outputPins?: string[];
  }
): ShapeRenderContext {
  return {
    node: {
      id: 'test',
      shape: '@activity',
      label,
      inputPins: options?.inputPins,
      outputPins: options?.outputPins,
    },
    style: {
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 1,
      fontSize: 14,
      font: 'Arial',
      padding: 12,
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  } as ShapeRenderContext;
}

describe('Activity Shape with Action Pins', () => {
  describe('Basic activity shape', () => {
    it('should have correct shape ID', () => {
      expect(activityShape.id).toBe('activity');
    });

    it('should render without pins', () => {
      const ctx = createMockContext('Process Data');
      const svg = activityShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<g class="activity-shape">');
      expect(svg).toContain('Process Data');
      expect(svg).toContain('rx="10"'); // Rounded corners
    });
  });

  describe('Input pins', () => {
    it('should render input pins on left side', () => {
      const ctx = createMockContext('Validate', {
        inputPins: ['order', 'customer'],
      });
      const svg = activityShape.render(ctx, { x: 100, y: 100 });

      expect(svg).toContain('order');
      expect(svg).toContain('customer');
      // Input pins should have pin squares (counting all rects)
      const rectCount = (svg.match(/<rect/g) || []).length;
      expect(rectCount).toBeGreaterThanOrEqual(3); // 2 pins + 1 main rect
    });

    it('should render single input pin', () => {
      const ctx = createMockContext('Process', {
        inputPins: ['data'],
      });
      const svg = activityShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('data');
      expect(svg).toContain('text-anchor="end"'); // Input pin labels are right-aligned (left of shape)
    });

    it('should handle multiple input pins with proper spacing', () => {
      const ctx = createMockContext('Complex Action', {
        inputPins: ['input1', 'input2', 'input3'],
      });
      const svg = activityShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('input1');
      expect(svg).toContain('input2');
      expect(svg).toContain('input3');
      // Should have 3 pin squares (inputs) + main rect = 4 rect elements
      expect(svg.match(/<rect/g)?.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Output pins', () => {
    it('should render output pins on right side', () => {
      const ctx = createMockContext('Calculate', {
        outputPins: ['result', 'status'],
      });
      const svg = activityShape.render(ctx, { x: 100, y: 100 });

      expect(svg).toContain('result');
      expect(svg).toContain('status');
      // Output pins should have pin squares (counting all rects)
      const rectCount = (svg.match(/<rect/g) || []).length;
      expect(rectCount).toBeGreaterThanOrEqual(3); // 2 pins + 1 main rect
    });

    it('should render single output pin', () => {
      const ctx = createMockContext('Generate', {
        outputPins: ['report'],
      });
      const svg = activityShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('report');
      expect(svg).toContain('text-anchor="start"'); // Output pin labels are left-aligned (right of shape)
    });
  });

  describe('Input and output pins together', () => {
    it('should render both input and output pins', () => {
      const ctx = createMockContext('Transform', {
        inputPins: ['rawData'],
        outputPins: ['cleanData'],
      });
      const svg = activityShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('rawData');
      expect(svg).toContain('cleanData');
      expect(svg).toContain('text-anchor="end"'); // Input
      expect(svg).toContain('text-anchor="start"'); // Output
    });

    it('should handle multiple pins on both sides', () => {
      const ctx = createMockContext('Process Payment', {
        inputPins: ['order', 'payment', 'customer'],
        outputPins: ['receipt', 'confirmation', 'status'],
      });
      const svg = activityShape.render(ctx, { x: 0, y: 0 });

      // Check all input pins
      expect(svg).toContain('order');
      expect(svg).toContain('payment');
      expect(svg).toContain('customer');

      // Check all output pins
      expect(svg).toContain('receipt');
      expect(svg).toContain('confirmation');
      expect(svg).toContain('status');

      // Should have 6 pin squares + 1 main rect = 7 rect elements
      expect(svg.match(/<rect/g)?.length).toBe(7);
    });
  });

  describe('Bounds calculation with pins', () => {
    it('should calculate bounds without pins', () => {
      const ctx = createMockContext('Simple Action');
      const bounds = activityShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(100);
      expect(bounds.height).toBeGreaterThanOrEqual(50);
    });

    it('should maintain minimum bounds with pins', () => {
      const ctx = createMockContext('Act', {
        inputPins: ['in'],
        outputPins: ['out'],
      });
      const bounds = activityShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(100);
      expect(bounds.height).toBeGreaterThanOrEqual(50);
    });

    it('should account for long pin names', () => {
      const ctx = createMockContext('Action', {
        inputPins: ['veryLongInputPinName'],
        outputPins: ['anotherVeryLongOutputPinName'],
      });
      const bounds = activityShape.bounds(ctx);

      // Bounds should be wider to accommodate long pin names
      expect(bounds.width).toBeGreaterThan(150);
    });
  });

  describe('Pin rendering details', () => {
    it('should use smaller font for pins', () => {
      const ctx = createMockContext('Action', {
        inputPins: ['input'],
        outputPins: ['output'],
      });
      const svg = activityShape.render(ctx, { x: 0, y: 0 });

      // Pin labels should use fontSize-2 (12)
      expect(svg).toContain('font-size="12"');
    });

    it('should render pin squares with correct size', () => {
      const ctx = createMockContext('Action', {
        inputPins: ['in'],
      });
      const svg = activityShape.render(ctx, { x: 0, y: 0 });

      // Pin squares are 10x10
      expect(svg).toContain('width="10" height="10"');
    });

    it('should apply correct styling to pins', () => {
      const ctx = createMockContext('Action', {
        outputPins: ['out'],
      });
      ctx.style.fill = '#e3f2fd';
      ctx.style.stroke = '#1976d2';

      const svg = activityShape.render(ctx, { x: 0, y: 0 });

      // Pins should use same fill and stroke as main shape
      expect(svg).toContain('fill="#e3f2fd"');
      expect(svg).toContain('stroke="#1976d2"');
    });
  });

  describe('Anchor points', () => {
    it('should provide 4 standard anchor points', () => {
      const ctx = createMockContext('Action');
      const anchors = activityShape.anchors?.(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors!.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should maintain anchor points with pins', () => {
      const ctx = createMockContext('Action', {
        inputPins: ['in1', 'in2'],
        outputPins: ['out1', 'out2'],
      });
      const anchors = activityShape.anchors?.(ctx);

      // Anchors should remain the same regardless of pins
      expect(anchors).toHaveLength(4);
      expect(anchors!.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });
  });
});
