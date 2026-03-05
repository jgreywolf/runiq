import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { awsS3Shape } from './s3.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'awsS3',
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

describe('AWS S3', () => {
  it('should have correct shape id', () => {
    expect(awsS3Shape.id).toBe('awsS3');
  });

  it('should calculate bounds with label', () => {
    const ctx = createMockContext('my-bucket');
    const bounds = awsS3Shape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('Bucket');
    const anchors = awsS3Shape.anchors(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render S3 bucket icon', () => {
    const ctx = createMockContext('assets-bucket');
    const svg = awsS3Shape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('assets-bucket');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = awsS3Shape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('S3 & <Bucket>');
    const svg = awsS3Shape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
