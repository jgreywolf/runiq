import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { enumShape } from './enum.js';

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

describe('UML Enum', () => {
  it('should have correct id', () => {
    expect(enumShape.id).toBe('enum');
  });

  it('should calculate bounds for enum values', () => {
    const ctx = createMockContext('Color', {
      values: ['RED', 'GREEN', 'BLUE'],
    });
    const bounds = enumShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(80);
    expect(bounds.height).toBeGreaterThan(60);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Status');
    const anchors = enumShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render enumeration with stereotype and values', () => {
    const ctx = createMockContext('Priority', {
      values: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    });
    const svg = enumShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect');
    expect(svg).toContain('«enumeration»');
    expect(svg).toContain('Priority');
    expect(svg).toContain('LOW');
    expect(svg).toContain('MEDIUM');
    expect(svg).toContain('HIGH');
    expect(svg).toContain('CRITICAL');
  });

  it('should handle enum without values', () => {
    const ctx = createMockContext('EmptyEnum');
    const svg = enumShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('«enumeration»');
    expect(svg).toContain('EmptyEnum');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = enumShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
