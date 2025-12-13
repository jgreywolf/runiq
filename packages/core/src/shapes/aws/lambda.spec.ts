import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { awsLambdaShape } from './lambda.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'awsLambda',
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

describe('AWS Lambda', () => {
  it('should have correct shape id', () => {
    expect(awsLambdaShape.id).toBe('awsLambda');
  });

  it('should calculate bounds with label', () => {
    const ctx = createMockContext('ProcessOrder');
    const bounds = awsLambdaShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('Function');
    const anchors = awsLambdaShape.anchors(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render Lambda λ symbol', () => {
    const ctx = createMockContext('Handler');
    const svg = awsLambdaShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('Handler');
    expect(svg).toContain('λ'); // Lambda symbol
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = awsLambdaShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('Lambda & <Function>');
    const svg = awsLambdaShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
