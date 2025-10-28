import { describe, it, expect } from 'vitest';
import { rhombusShape } from './rhombus.js';
import type { ShapeRenderContext } from '../../types.js';

function createMockContext(label = 'Test'): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      label,
      shape: 'rhombus',
    },
    style: {
      fill: '#f0f0f0',
      stroke: '#333',
      strokeWidth: 1,
      fontSize: 14,
      font: 'sans-serif',
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('rhombusShape', () => {
  it('should have correct id', () => {
    expect(rhombusShape.id).toBe('rhombus');
  });

  it('should calculate bounds correctly', () => {
    const ctx = createMockContext('Decision');
    const bounds = rhombusShape.bounds(ctx);

    // Diamond shape needs extra space - minimum 80x60
    expect(bounds.width).toBeGreaterThanOrEqual(80);
    expect(bounds.height).toBeGreaterThanOrEqual(60);
  });

  it('should define anchor points at diamond vertices', () => {
    const ctx = createMockContext('Valid?');
    const anchors = rhombusShape.anchors?.(ctx);

    expect(anchors).toBeDefined();
    expect(anchors).toHaveLength(4);

    const bounds = rhombusShape.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;

    // Check anchor positions match diamond vertices
    expect(anchors).toEqual([
      { x: w / 2, y: 0, name: 'top' },
      { x: w, y: h / 2, name: 'right' },
      { x: w / 2, y: h, name: 'bottom' },
      { x: 0, y: h / 2, name: 'left' },
    ]);
  });

  it('should render diamond polygon with correct points', () => {
    const ctx = createMockContext('Decision');
    const svg = rhombusShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<polygon');
    expect(svg).toContain('points=');
    expect(svg).toContain('Decision');
  });

  it('should position text at center of diamond', () => {
    const ctx = createMockContext('Valid?');
    const bounds = rhombusShape.bounds(ctx);
    const svg = rhombusShape.render(ctx, { x: 10, y: 20 });

    const cx = 10 + bounds.width / 2;
    const cy = 20 + bounds.height / 2;

    expect(svg).toContain(`x="${cx}"`);
    expect(svg).toContain(`y="${cy}"`);
    expect(svg).toContain('text-anchor="middle"');
    expect(svg).toContain('dominant-baseline="middle"');
  });

  it('should apply custom fill and stroke styles', () => {
    const ctx = createMockContext('Test');
    ctx.style.fill = '#ffcc00';
    ctx.style.stroke = '#ff0000';
    ctx.style.strokeWidth = 3;

    const svg = rhombusShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('fill="#ffcc00"');
    expect(svg).toContain('stroke="#ff0000"');
    expect(svg).toContain('stroke-width="3"');
  });
});
