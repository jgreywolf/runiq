import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import {
  hRuleShape,
  vRuleShape,
  sectionHeaderShape,
  badgeWarningShape,
  badgeNumberShape,
  titleBoxShape,
  watermarkTextShape,
} from './decorative.js';

const createContext = (label: string): ShapeRenderContext =>
  ({
    node: { id: 'node', label } as any,
    style: { padding: 8, fontSize: 14 },
    measureText: (text: string) => ({
      width: text.length * 7,
      height: 14,
    }),
  }) as ShapeRenderContext;

describe('decorative shapes', () => {
  it('renders horizontal and vertical rules', () => {
    const ctx = createContext('Rule');
    const h = hRuleShape.render(ctx, { x: 0, y: 0 });
    const v = vRuleShape.render(ctx, { x: 0, y: 0 });
    expect(h).toContain('<line');
    expect(v).toContain('<line');
  });

  it('renders section header with label', () => {
    const ctx = createContext('Section');
    const svg = sectionHeaderShape.render(ctx, { x: 0, y: 0 });
    expect(svg).toContain('Section');
    expect(svg).toContain('<line');
  });

  it('renders badge shapes', () => {
    const ctx = createContext('1');
    const warn = badgeWarningShape.render(ctx, { x: 0, y: 0 });
    const number = badgeNumberShape.render(ctx, { x: 0, y: 0 });
    expect(warn).toContain('<circle');
    expect(number).toContain('1');
  });

  it('renders title and watermark typography shapes', () => {
    const ctx = createContext('Title');
    const title = titleBoxShape.render(ctx, { x: 0, y: 0 });
    const watermark = watermarkTextShape.render(ctx, { x: 0, y: 0 });
    expect(title).toContain('<rect');
    expect(title).toContain('Title');
    expect(watermark).toContain('Title');
  });
});
