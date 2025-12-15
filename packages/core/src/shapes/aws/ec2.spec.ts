import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { awsEc2Shape } from './ec2.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'awsEc2',
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

describe('AWS EC2', () => {
  it('should have correct shape id', () => {
    expect(awsEc2Shape.id).toBe('awsEc2');
  });

  it('should calculate bounds with label', () => {
    const ctx = createMockContext('Web Server');
    const bounds = awsEc2Shape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('Instance');
    const anchors = awsEc2Shape.anchors(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render EC2 cube icon', () => {
    const ctx = createMockContext('t3.micro');
    const svg = awsEc2Shape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('t3.micro');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = awsEc2Shape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('EC2 & <Instance>');
    const svg = awsEc2Shape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
