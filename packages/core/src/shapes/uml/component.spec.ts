import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types';
import { componentShape } from './component';

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

describe('UML Component', () => {
  it('should have correct shape id', () => {
    expect(componentShape.id).toBe('umlComponent');
  });

  it('should calculate bounds with label', () => {
    const ctx = createMockContext('UserService');
    const bounds = componentShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('UserService');
    const anchors = componentShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render rectangle with component symbol', () => {
    const ctx = createMockContext('UserService');
    const svg = componentShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect');
    expect(svg).toContain('rx="4"'); // Rounded corners
    expect(svg).toContain('UserService');
    // Should have small rectangles for component symbol
    expect(svg).toContain('width="16"');
    expect(svg).toContain('height="8"');
  });

  it('should handle empty label', () => {
    const ctx = createMockContext('');
    const bounds = componentShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should apply style properties', () => {
    const ctx = createMockContext('Service', {
      fillColor: '#e3f2fd',
      strokeColor: '#1976d2',
    });
    const svg = componentShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('#e3f2fd');
    expect(svg).toContain('#1976d2');
  });
});
