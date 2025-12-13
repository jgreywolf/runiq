import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types';
import { artifactShape } from './artifact';

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

describe('UML Artifact', () => {
  it('should have correct shape id', () => {
    expect(artifactShape.id).toBe('artifact');
  });

  it('should calculate bounds with label', () => {
    const ctx = createMockContext('config.xml');
    const bounds = artifactShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('config.xml');
    const anchors = artifactShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render rectangle with dog-eared corner', () => {
    const ctx = createMockContext('config.xml');
    const svg = artifactShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path'); // Dog-eared corner uses path
    expect(svg).toContain('config.xml');
    expect(svg).toContain('«artifact»'); // Stereotype
  });

  it('should handle empty label', () => {
    const ctx = createMockContext('');
    const bounds = artifactShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should include stereotype in rendering', () => {
    const ctx = createMockContext('library.jar');
    const svg = artifactShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('«artifact»');
    expect(svg).toContain('library.jar');
  });

  it('should apply style properties', () => {
    const ctx = createMockContext('file.xml', {
      fillColor: '#fff8e1',
      strokeColor: '#f57f17',
    });
    const svg = artifactShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('#fff8e1');
    expect(svg).toContain('#f57f17');
  });
});
