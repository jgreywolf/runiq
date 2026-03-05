import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { bpmnDataObjectShape } from './dataObject.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'bpmnDataObject',
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

describe('BPMN Data Object', () => {
  it('should have correct shape id', () => {
    expect(bpmnDataObjectShape.id).toBe('bpmnDataObject');
  });

  it('should calculate bounds with label', () => {
    const ctx = createMockContext('Customer Data');
    const bounds = bpmnDataObjectShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('Data');
    const anchors = bpmnDataObjectShape.anchors?.(ctx);

    expect(anchors).toBeDefined();
    expect(anchors!).toHaveLength(4);
  });

  it('should render document with folded corner', () => {
    const ctx = createMockContext('Invoice');
    const svg = bpmnDataObjectShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path'); // Document shape with fold
    expect(svg).toContain('Invoice');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = bpmnDataObjectShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Data & <Object>');
    const svg = bpmnDataObjectShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
