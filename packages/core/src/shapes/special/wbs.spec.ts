import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import {
  wbsDeliverableShape,
  wbsShape,
  wbsWorkPackageShape,
} from './wbs.js';

const ctx = (label: string, data?: Record<string, unknown>): ShapeRenderContext =>
  ({
    node: {
      id: label.toLowerCase().replace(/\s+/g, '-'),
      type: 'shape',
      label,
      data,
    },
    styles: {},
    style: {},
    measureText: (text, style) => ({
      width: text.length * ((style?.fontSize as number) || 14) * 0.6,
      height: ((style?.fontSize as number) || 14) * 1.2,
    }),
  }) as unknown as ShapeRenderContext;

describe('wbs shapes', () => {
  it('should render wbs root container', () => {
    const svg = wbsShape.render(ctx('Website Launch', { width: 360, height: 220 }), {
      x: 0,
      y: 0,
    });

    expect(svg).toContain('wbs-root');
    expect(svg).toContain('Website Launch');
    expect(svg).toContain('<rect');
  });

  it('should render wbs deliverable container', () => {
    const svg = wbsDeliverableShape.render(ctx('Discovery'), { x: 0, y: 0 });

    expect(svg).toContain('wbs-deliverable');
    expect(svg).toContain('Discovery');
    expect(svg).toContain('<rect');
  });

  it('should render wbs work package node', () => {
    const svg = wbsWorkPackageShape.render(ctx('Wireframes'), { x: 0, y: 0 });

    expect(svg).toContain('wbs-work-package');
    expect(svg).toContain('Wireframes');
    expect(svg).toContain('<rect');
  });
});
