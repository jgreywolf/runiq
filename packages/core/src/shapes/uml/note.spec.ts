import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { noteShape } from './note.js';

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

describe('UML Note', () => {
  it('should have correct id', () => {
    expect(noteShape.id).toBe('note');
  });

  it('should calculate bounds for note text', () => {
    const ctx = createMockContext('This is a note');
    const bounds = noteShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(80);
    expect(bounds.height).toBeGreaterThan(30);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Note');
    const anchors = noteShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render note with dog-eared corner', () => {
    const ctx = createMockContext('Important: Check constraints');
    const svg = noteShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path'); // Dog-eared shape
    expect(svg).toContain('Important: Check constraints');
  });

  it('should handle multi-line notes', () => {
    const ctx = createMockContext('Line 1', {
      lines: ['Line 1', 'Line 2', 'Line 3'],
    });
    const svg = noteShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('Line 1');
    expect(svg).toContain('Line 2');
    expect(svg).toContain('Line 3');
  });

  it('should use light yellow background by default', () => {
    const ctx = createMockContext('Note');
    const svg = noteShape.render(ctx, { x: 0, y: 0 });

    expect(
      svg.includes('fill="#ffffcc"') || svg.includes('fill="#fffacd"')
    ).toBe(true);
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = noteShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
