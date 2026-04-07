import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import {
  mitigationShape,
  securityControlShape,
  threatShape,
  trustBoundaryShape,
} from './threatModel.js';

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

describe('threat model shapes', () => {
  it('should render trust boundary with dashed outline and label', () => {
    const svg = trustBoundaryShape.render(
      ctx('Internet', { width: 320, height: 180 }),
      { x: 0, y: 0 }
    );

    expect(svg).toContain('trust-boundary');
    expect(svg).toContain('Internet');
    expect(svg).toContain('stroke-dasharray="8 6"');
  });

  it('should render threat shape', () => {
    const svg = threatShape.render(ctx('Credential Spoofing'), { x: 0, y: 0 });

    expect(svg).toContain('threat-shape');
    expect(svg).toContain('Credential Spoofing');
    expect(svg).toContain('<polygon');
  });

  it('should render mitigation shape', () => {
    const svg = mitigationShape.render(ctx('Enforce MFA'), { x: 0, y: 0 });

    expect(svg).toContain('mitigation-shape');
    expect(svg).toContain('Enforce MFA');
    expect(svg).toContain('<rect');
  });

  it('should render security control shape', () => {
    const svg = securityControlShape.render(ctx('WAF'), { x: 0, y: 0 });

    expect(svg).toContain('security-control-shape');
    expect(svg).toContain('WAF');
    expect(svg).toContain('<path');
  });
});
