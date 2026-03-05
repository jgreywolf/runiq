import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { interfaceShape } from './interface.js';

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

describe('UML Interface', () => {
  it('should have correct id', () => {
    expect(interfaceShape.id).toBe('interface');
  });

  it('should calculate bounds with stereotype', () => {
    const ctx = createMockContext('Serializable');
    const bounds = interfaceShape.bounds(ctx);

    // Should have room for «interface» stereotype + interface name + methods
    expect(bounds.width).toBeGreaterThan(100);
    expect(bounds.height).toBeGreaterThan(40);
  });

  it('should provide 4 anchor points', () => {
    const ctx = createMockContext('Repository');
    const anchors = interfaceShape.anchors?.(ctx);

    expect(anchors).toHaveLength(4);
    expect(anchors?.[0].name).toBe('top');
    expect(anchors?.[1].name).toBe('right');
    expect(anchors?.[2].name).toBe('bottom');
    expect(anchors?.[3].name).toBe('left');
  });

  it('should render interface with stereotype and methods', () => {
    const ctx = createMockContext('IRepository', {
      methods: [
        { name: 'save', returnType: 'void', visibility: 'public' },
        { name: 'find', returnType: 'void', visibility: 'public' },
        { name: 'delete', returnType: 'void', visibility: 'public' },
      ],
    });
    const svg = interfaceShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<rect');
    expect(svg).toContain('«interface»');
    expect(svg).toContain('IRepository');
    expect(svg).toContain('+ save(): void');
    expect(svg).toContain('+ find(): void');
    expect(svg).toContain('+ delete(): void');
  });

  it('should handle interface without methods', () => {
    const ctx = createMockContext('Comparable');
    const svg = interfaceShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('«interface»');
    expect(svg).toContain('Comparable');
  });

  it('should handle empty labels', () => {
    const ctx = createMockContext('');
    const bounds = interfaceShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });
});
