import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { bpmnEventShape } from './event.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'bpmnEvent',
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

describe('BPMN Event', () => {
  it('should have correct shape id', () => {
    expect(bpmnEventShape.id).toBe('bpmnEvent');
  });

  it('should calculate bounds for event', () => {
    const ctx = createMockContext('Start');
    const bounds = bpmnEventShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
    expect(bounds.width).toBe(bounds.height); // Should be circular
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('');
    const anchors = bpmnEventShape.anchors?.(ctx);

    expect(anchors).toBeDefined();
    expect(anchors!).toHaveLength(4);
  });

  it('should render start event (single circle)', () => {
    const ctx = createMockContext('Start', { eventType: 'start' });
    const svg = bpmnEventShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<circle');
  });

  it('should render end event (thick circle)', () => {
    const ctx = createMockContext('End', { eventType: 'end' });
    const svg = bpmnEventShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('stroke-width="5"'); // Thick border for end events
  });

  it('should render intermediate event (double circle)', () => {
    const ctx = createMockContext('', { eventType: 'intermediate' });
    const svg = bpmnEventShape.render(ctx, { x: 0, y: 0 });

    // Should have two circles for intermediate events
    const circleMatches = svg.match(/<circle/g);
    expect(circleMatches).toBeTruthy();
    expect(circleMatches!.length).toBeGreaterThanOrEqual(2);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Start & <Event>');
    const svg = bpmnEventShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
