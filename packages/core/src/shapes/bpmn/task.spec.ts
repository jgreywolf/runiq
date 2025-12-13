import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { bpmnTaskShape } from './task.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'bpmnTask',
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

describe('BPMN Task', () => {
  it('should have correct shape id', () => {
    expect(bpmnTaskShape.id).toBe('bpmnTask');
  });

  it('should calculate bounds with label', () => {
    const ctx = createMockContext('Process Order');
    const bounds = bpmnTaskShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('Task');
    const anchors = bpmnTaskShape.anchors?.(ctx);

    expect(anchors).toBeDefined();
    expect(anchors!).toHaveLength(4);
    expect(anchors![0].name).toBe('top');
    expect(anchors![1].name).toBe('right');
    expect(anchors![2].name).toBe('bottom');
    expect(anchors![3].name).toBe('left');
  });

  it('should render rounded rectangle', () => {
    const ctx = createMockContext('Send Email');
    const svg = bpmnTaskShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect');
    expect(svg).toContain('rx="8"'); // BPMN standard rounded corners
    expect(svg).toContain('Send Email');
  });

  it('should support task type markers', () => {
    const ctx = createMockContext('User Task', { taskType: 'user' });
    const svg = bpmnTaskShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('User Task');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = bpmnTaskShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Task & <Process>');
    const svg = bpmnTaskShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
