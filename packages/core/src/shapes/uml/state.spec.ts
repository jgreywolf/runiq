import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { stateShape } from './state.js';

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

describe('UML State', () => {
  it('should have correct id', () => {
    expect(stateShape.id).toBe('state');
  });

  it('should calculate bounds with rounded corners', () => {
    const ctx = createMockContext('Idle');
    const bounds = stateShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(60);
    expect(bounds.height).toBeGreaterThan(30);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Processing');
    const anchors = stateShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
    expect(anchors?.[0].name).toBe('top');
    expect(anchors?.[1].name).toBe('right');
    expect(anchors?.[2].name).toBe('bottom');
    expect(anchors?.[3].name).toBe('left');
  });

  it('should render rounded rectangle with state name', () => {
    const ctx = createMockContext('Active');
    const svg = stateShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect');
    expect(svg).toContain('rx=');
    expect(svg).toContain('Active');
  });

  it('should support internal activities', () => {
    const ctx = createMockContext('Processing', {
      activities: [
        'entry / startTimer()',
        'do / process()',
        'exit / stopTimer()',
      ],
    });
    const svg = stateShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('entry / startTimer()');
    expect(svg).toContain('do / process()');
    expect(svg).toContain('exit / stopTimer()');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = stateShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
