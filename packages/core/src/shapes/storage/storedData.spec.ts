import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { storedDataShape } from './storedData.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'storedData',
      label,
      data,
    },
    style: {
      padding: 12,
      fontSize: 14,
      fontFamily: 'Arial',
      fill: '#f0f0f0',
      stroke: '#333',
      strokeWidth: 1,
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('Stored Data (Bow-tie)', () => {
  it('should have correct shape id', () => {
    expect(storedDataShape.id).toBe('storedData');
  });

  it('should calculate bounds for curved sides', () => {
    const ctx = createMockContext('Tape');
    const bounds = storedDataShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(80);
    expect(bounds.height).toBeGreaterThanOrEqual(60);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Data');
    const anchors = storedDataShape.anchors(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render bow-tie shape with inward curves', () => {
    const ctx = createMockContext('Sequential');
    const svg = storedDataShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path');
    expect(svg).toContain('Q'); // Quadratic curves
    expect(svg).toContain('d="M'); // Path definition
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = storedDataShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Tape & <Storage>');
    const svg = storedDataShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
