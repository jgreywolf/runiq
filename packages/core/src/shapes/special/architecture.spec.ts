import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import {
  architectureLayerShape,
  externalSystemBlockShape,
  platformBlockShape,
  subsystemBlockShape,
} from './architecture.js';

const ctx = (label: string, data?: Record<string, unknown>): ShapeRenderContext => ({
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
} as unknown as ShapeRenderContext);

describe('architecture shapes', () => {
  it('should render architecture layer header and label', () => {
    const svg = architectureLayerShape.render(
      ctx('Kernel mode', { width: 640, height: 180 }),
      { x: 0, y: 0 }
    );

    expect(svg).toContain('architecture-layer');
    expect(svg).toContain('Kernel mode');
    expect(svg).toContain('<line');
  });

  it('should render subsystem block label', () => {
    const svg = subsystemBlockShape.render(ctx('Subsystem'), { x: 0, y: 0 });
    expect(svg).toContain('subsystem-block');
    expect(svg).toContain('Subsystem');
  });

  it('should render platform block label', () => {
    const svg = platformBlockShape.render(ctx('Platform Service'), { x: 0, y: 0 });
    expect(svg).toContain('platform-block');
    expect(svg).toContain('Platform Service');
  });

  it('should render external system block with label', () => {
    const svg = externalSystemBlockShape.render(ctx('Hardware'), { x: 0, y: 0 });
    expect(svg).toContain('external-system-block');
    expect(svg).toContain('Hardware');
  });
});
