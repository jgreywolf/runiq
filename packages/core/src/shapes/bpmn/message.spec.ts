import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { bpmnMessageShape } from './message.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'bpmnMessage',
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

describe('BPMN Message', () => {
  it('should have correct shape id', () => {
    expect(bpmnMessageShape.id).toBe('bpmnMessage');
  });

  it('should calculate bounds for message', () => {
    const ctx = createMockContext('Email');
    const bounds = bpmnMessageShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('');
    const anchors = bpmnMessageShape.anchors?.(ctx);

    expect(anchors).toBeDefined();
    expect(anchors!).toHaveLength(4);
  });

  it('should render envelope shape', () => {
    const ctx = createMockContext('Notification');
    const svg = bpmnMessageShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect'); // Envelope body
    expect(svg).toContain('<path'); // Envelope flap
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = bpmnMessageShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Message & <Notification>');
    const svg = bpmnMessageShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
