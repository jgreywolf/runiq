import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { awsApiGatewayShape } from './apiGateway.js';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'awsApiGateway',
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

describe('AWS API Gateway', () => {
  it('should have correct shape id', () => {
    expect(awsApiGatewayShape.id).toBe('awsApiGateway');
  });

  it('should calculate bounds with label', () => {
    const ctx = createMockContext('REST API');
    const bounds = awsApiGatewayShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should have 4 anchor points', () => {
    const ctx = createMockContext('API');
    const anchors = awsApiGatewayShape.anchors(ctx);

    expect(anchors).toHaveLength(4);
  });

  it('should render API Gateway icon', () => {
    const ctx = createMockContext('Public API');
    const svg = awsApiGatewayShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('Public API');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = awsApiGatewayShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const ctx = createMockContext('API & <Gateway>');
    const svg = awsApiGatewayShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
