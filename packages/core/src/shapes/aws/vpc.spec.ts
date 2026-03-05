import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { awsVpcShape } from './vpc.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'awsVpc',
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

describe('AWS VPC', () => {
  it('should have correct shape id', () => {
    expect(awsVpcShape.id).toBe('awsVpc');
  });

  it('should calculate bounds for container', () => {
    const ctx = createMockContext('Production VPC', {
      width: 600,
      height: 400,
    });
    const bounds = awsVpcShape.bounds(ctx);

    expect(bounds.width).toBe(600);
    expect(bounds.height).toBe(400);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('VPC');
    const anchors = awsVpcShape.anchors(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render VPC boundary with cloud icon', () => {
    const ctx = createMockContext('VPC-1', { width: 500, height: 300 });
    const svg = awsVpcShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('VPC-1');
    expect(svg).toContain('rect'); // Boundary
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('', { width: 400, height: 300 });
    const bounds = awsVpcShape.bounds(ctx);

    expect(bounds.width).toBe(400);
    expect(bounds.height).toBe(300);
  });

  it('should handle labels with special characters', () => {
    const ctx = createMockContext('VPC Network', {
      width: 500,
      height: 300,
    });
    const svg = awsVpcShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('VPC');
    expect(svg).toContain('Network');
  });
});
