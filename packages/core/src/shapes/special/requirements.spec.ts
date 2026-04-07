import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import {
  requirementPackageShape,
  requirementShape,
  testCaseShape,
} from './requirements.js';

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

describe('requirements shapes', () => {
  it('should render requirement package container', () => {
    const svg = requirementPackageShape.render(
      ctx('System Requirements', { width: 320, height: 220 }),
      { x: 0, y: 0 }
    );

    expect(svg).toContain('requirement-package');
    expect(svg).toContain('System Requirements');
  });

  it('should render requirement with requirement id', () => {
    const svg = requirementShape.render(
      ctx('Stopping distance under 40m', { title: 'REQ-001' }),
      { x: 0, y: 0 }
    );

    expect(svg).toContain('requirement-shape');
    expect(svg).toContain('«requirement»');
    expect(svg).toContain('REQ-001');
    expect(svg).toContain('Stopping distance under 40m');
  });

  it('should render test case shape', () => {
    const svg = testCaseShape.render(ctx('BrakeBenchTest'), { x: 0, y: 0 });

    expect(svg).toContain('test-case-shape');
    expect(svg).toContain('«testCase»');
    expect(svg).toContain('BrakeBenchTest');
  });
});
