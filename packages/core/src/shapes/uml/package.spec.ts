import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { packageShape } from './package.js';

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

describe('UML Package', () => {
  it('should have correct id', () => {
    expect(packageShape.id).toBe('umlPackage');
  });

  it('should calculate bounds for package', () => {
    const ctx = createMockContext('com.example.models');
    const bounds = packageShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(120);
    expect(bounds.height).toBeGreaterThan(80);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('util');
    const anchors = packageShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render package with tab', () => {
    const ctx = createMockContext('controllers');
    const svg = packageShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path'); // Folder shape with tab
    expect(svg).toContain('controllers');
    // Verify the path draws a folder shape (should have 8 points for the tab + body)
    expect(svg).toMatch(
      /M \d+ \d+ L \d+ \d+ L \d+ \d+ L \d+ \d+ L \d+ \d+ L \d+ \d+ L \d+ \d+ Z/
    );
  });

  it('should handle nested package names', () => {
    const ctx = createMockContext('com.example.domain.models');
    const svg = packageShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('com.example.domain.models');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = packageShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
