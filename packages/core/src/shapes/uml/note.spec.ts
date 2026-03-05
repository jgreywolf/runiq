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

  it('should enforce minimum width of 100px', () => {
    const ctx = createMockContext('X'); // Very short text
    const bounds = noteShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThanOrEqual(100);
  });

  it('should enforce maximum width of 500px', () => {
    // Create a very long text that would exceed 500px
    const longText = 'A'.repeat(200); // 200 characters * 8px/char = 1600px without constraint
    const ctx = createMockContext(longText);
    const bounds = noteShape.bounds(ctx);

    expect(bounds.width).toBeLessThanOrEqual(500);
  });

  it('should wrap text when it exceeds maximum width', () => {
    // Text that would be ~800px wide (100 chars * 8px) without wrapping
    // Need text long enough: (500px - 24px padding) / 8px per char = ~60 chars before wrapping
    const longText = 'A'.repeat(70) + ' ' + 'B'.repeat(70); // 140 chars total, will wrap
    const ctx = createMockContext(longText);

    const bounds = noteShape.bounds(ctx);

    // Width should be constrained to MAX_WIDTH
    expect(bounds.width).toBeLessThanOrEqual(500);

    // Height should increase due to wrapping (multiple lines)
    const lineHeight = 18; // fontSize 14 + 4
    const minHeightForTwoLines = 12 * 2 + lineHeight * 2; // padding + 2 lines
    expect(bounds.height).toBeGreaterThanOrEqual(minHeightForTwoLines);

    // Check that wrappedLines were created
    expect(ctx.node.data?.wrappedLines).toBeDefined();
    expect((ctx.node.data?.wrappedLines as string[]).length).toBeGreaterThan(1);
  });

  it('should not wrap text that fits within maximum width', () => {
    const shortText = 'Short note';
    const ctx = createMockContext(shortText);

    const bounds = noteShape.bounds(ctx);

    // Should not create wrappedLines for short text
    expect(ctx.node.data?.wrappedLines).toBeUndefined();
  });

  it('should render wrapped text with newlines', () => {
    // Need enough text to trigger wrapping: > 60 chars
    const longText = 'A'.repeat(70) + ' ' + 'B'.repeat(70);
    const ctx = createMockContext(longText);

    // Calculate bounds first (this triggers wrapping)
    noteShape.bounds(ctx);

    const svg = noteShape.render(ctx, { x: 0, y: 0 });

    // Should contain tspan elements for multiline text
    expect(svg).toContain('<tspan');
  });
});
