import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { manualInputShape } from '../index.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: { id: 'test-node', shape: 'manualInput', label, data },
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

describe('Manual Input Shape', () => {
  it('should have correct id', () => {
    expect(manualInputShape.id).toBe('manualInput');
  });

  it('should calculate bounds with extra height for slope', () => {
    const ctx = createMockContext('Enter Data');
    const bounds = manualInputShape.bounds(ctx);

    expect(bounds.height).toBeGreaterThan(16 + 24); // More than text + padding
  });

  it('should provide 4 anchor points accounting for slope', () => {
    const ctx = createMockContext('Manual');
    const anchors = manualInputShape.anchors!(ctx);

    expect(anchors).toHaveLength(4);
    // Top anchor should be offset down due to slope
    const bounds = manualInputShape.bounds(ctx);
    const slope = bounds.height * 0.2;
    expect(anchors[0].y).toBe(slope);
  });

  it('should render sloped top polygon', () => {
    const ctx = createMockContext('Input');
    const svg = manualInputShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path');
    expect(svg).toContain('d="M'); // Path should start with M command
    expect(svg).toContain('Z"'); // Path should close with Z
  });

  it('should have left side lower than right side at top', () => {
    const ctx = createMockContext('Slope');
    const bounds = manualInputShape.bounds(ctx);
    const slope = bounds.height * 0.2;
    const svg = manualInputShape.render(ctx, { x: 0, y: 0 });

    // Top left should be at y=slope, top right at y=0
    expect(svg).toContain(`0,${slope}`); // Top left lower
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = manualInputShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should handle long text', () => {
    const ctx = createMockContext('Very Long Manual Input Label');
    const bounds = manualInputShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(180);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Enter & <Input>');
    const svg = manualInputShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
