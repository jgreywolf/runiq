import { describe, it, expect } from 'vitest';
import { ellipseWideShape } from './ellipseWide.js';
import type { ShapeRenderContext } from '../../types/index.js';

function createMockContext(
  label = 'Test Use Case',
  extensionPoints?: string[]
): ShapeRenderContext {
  return {
    node: {
      id: 'test-usecase',
      shape: 'ellipseWide',
      label,
      extensionPoints,
    },
    style: {
      fill: '#f0f0f0',
      stroke: '#333',
      strokeWidth: 1,
      fontSize: 14,
      fontFamily: 'sans-serif',
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('ellipseWideShape - Extension Points', () => {
  it('should have correct id', () => {
    expect(ellipseWideShape.id).toBe('ellipseWide');
  });

  it('should render basic use case without extension points', () => {
    const ctx = createMockContext('Login');
    const svg = ellipseWideShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<ellipse');
    expect(svg).toContain('Login');
    expect(svg).not.toContain('extension points');
  });

  it('should render use case with single extension point', () => {
    const ctx = createMockContext('Process Payment', ['Payment Failed']);
    const svg = ellipseWideShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<ellipse');
    expect(svg).toContain('Process Payment');
    expect(svg).toContain('extension points');
    expect(svg).toContain('Payment Failed');
    expect(svg).toContain('<line'); // separator line
  });

  it('should render use case with multiple extension points', () => {
    const ctx = createMockContext('Checkout', [
      'Payment Failed',
      'Insufficient Funds',
      'Invalid Card',
    ]);
    const svg = ellipseWideShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('Checkout');
    expect(svg).toContain('extension points');
    expect(svg).toContain('Payment Failed');
    expect(svg).toContain('Insufficient Funds');
    expect(svg).toContain('Invalid Card');
  });

  it('should calculate larger bounds for use case with extension points', () => {
    const ctxWithout = createMockContext('Test');
    const ctxWith = createMockContext('Test', ['Extension 1', 'Extension 2']);

    const boundsWithout = ellipseWideShape.bounds(ctxWithout);
    const boundsWith = ellipseWideShape.bounds(ctxWith);

    // Use case with extension points should be taller
    expect(boundsWith.height).toBeGreaterThan(boundsWithout.height);
  });

  it('should include separator line for extension points section', () => {
    const ctx = createMockContext('Use Case', ['Point 1']);
    const svg = ellipseWideShape.render(ctx, { x: 0, y: 0 });

    // Should have a horizontal line separating label from extension points
    expect(svg).toContain('<line');
    expect(svg).toContain('x1=');
    expect(svg).toContain('y1=');
    expect(svg).toContain('x2=');
    expect(svg).toContain('y2=');
  });

  it('should render extension points with italic font for title', () => {
    const ctx = createMockContext('Use Case', ['Point 1']);
    const svg = ellipseWideShape.render(ctx, { x: 0, y: 0 });

    // The "extension points" title should be italic
    expect(svg).toContain('font-style="italic"');
    expect(svg).toContain('extension points');
  });

  it('should handle empty extension points array', () => {
    const ctx = createMockContext('Use Case', []);
    const svg = ellipseWideShape.render(ctx, { x: 0, y: 0 });

    // Empty array should behave like no extension points
    expect(svg).toContain('Use Case');
    expect(svg).not.toContain('extension points');
  });

  it('should maintain correct anchor points with extension points', () => {
    const ctx = createMockContext('Test', ['Point 1', 'Point 2']);
    const anchors = ellipseWideShape.anchors?.(ctx) || [];

    // Should still have 4 anchor points
    expect(anchors).toHaveLength(4);
    expect(anchors.map((a) => a.name)).toEqual([
      'top',
      'right',
      'bottom',
      'left',
    ]);

    // Anchors should be at the ellipse edges
    const bounds = ellipseWideShape.bounds(ctx);
    expect(anchors[0].x).toBe(bounds.width / 2); // top
    expect(anchors[0].y).toBe(0);
    expect(anchors[2].x).toBe(bounds.width / 2); // bottom
    expect(anchors[2].y).toBe(bounds.height);
  });
});
