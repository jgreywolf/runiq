import { describe, expect, it } from 'vitest';
import { getDiagramTheme } from '@runiq/core';
import type { RailroadProfile } from '@runiq/core';
import { renderRailroadDiagram } from './railroad-renderer.js';

function luminance(color: string): number | null {
  const hex = color.trim().replace('#', '');
  if (hex.length !== 3 && hex.length !== 6) return null;
  const normalized =
    hex.length === 3
      ? hex
          .split('')
          .map((c) => c + c)
          .join('')
      : hex;
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function contrastRatio(a: string, b: string): number {
  const lumA = luminance(a);
  const lumB = luminance(b);
  if (lumA === null || lumB === null) return 1;
  const [hi, lo] = lumA > lumB ? [lumA, lumB] : [lumB, lumA];
  return (hi + 0.05) / (lo + 0.05);
}

function bestForeground(background: string): string {
  const lum = luminance(background);
  if (lum === null) return '#0f172a';
  return lum > 0.6 ? '#0f172a' : '#ffffff';
}

function ensureContrast(color: string, background: string): string {
  return contrastRatio(color, background) < 3
    ? bestForeground(background)
    : color;
}

describe('Railroad renderer', () => {
  const baseProfile: RailroadProfile = {
    type: 'railroad',
    name: 'Railroad Tests',
    diagrams: [],
  };

  it('renders an empty profile scaffold', () => {
    const result = renderRailroadDiagram(baseProfile);
    expect(result.svg).toContain('Empty railroad profile');
  });

  it('renders a simple sequence', () => {
    const profile: RailroadProfile = {
      ...baseProfile,
      diagrams: [
        {
          name: 'Expr',
          expression: {
            type: 'sequence',
            items: [
              { type: 'token', value: 'a' },
              { type: 'token', value: 'b' },
            ],
          },
        },
      ],
    };

    const result = renderRailroadDiagram(profile, { width: 400, height: 160 });
    expect(result.svg).toContain('Expr');
    expect(result.svg).toContain('a');
    expect(result.svg).toContain('b');
  });

  it('uses theme colors when provided', () => {
    const profile: RailroadProfile = {
      ...baseProfile,
      theme: 'ocean',
      diagrams: [
        {
          name: 'Token',
          expression: { type: 'token', value: 'x' },
        },
      ],
    };

    const result = renderRailroadDiagram(profile, { width: 200, height: 120 });
    expect(result.svg).toContain('Token');
    expect(result.svg).toContain('x');
  });

  it('renders start/end markers with themed color', () => {
    const profile: RailroadProfile = {
      ...baseProfile,
      theme: 'ocean',
      diagrams: [
        {
          name: 'MarkerTest',
          expression: { type: 'token', value: 'a' },
        },
      ],
    };

    const result = renderRailroadDiagram(profile, { width: 240, height: 140 });
    expect(result.svg).toContain('railroad-arrow');

    const markerFillMatch = result.svg.match(
      /marker id="railroad-arrow"[\s\S]*?<path d="M0,0 L8,3 L0,6 Z" fill="([^"]+)"/
    );
    const circleFillMatch = result.svg.match(
      /<circle[^>]*r="4"[^>]*fill="([^"]+)"/
    );

    expect(markerFillMatch).not.toBeNull();
    expect(circleFillMatch).not.toBeNull();
    expect(markerFillMatch![1]).toBe(circleFillMatch![1]);
  });

  it('warns on missing diagram references', () => {
    const profile: RailroadProfile = {
      ...baseProfile,
      diagrams: [
        {
          name: 'Expr',
          expression: {
            type: 'sequence',
            items: [
              { type: 'reference', name: 'Term' },
              { type: 'token', value: '+' },
              { type: 'reference', name: 'Missing' },
            ],
          },
        },
        {
          name: 'Term',
          expression: { type: 'token', value: 'x' },
        },
      ],
    };

    const result = renderRailroadDiagram(profile, { width: 300, height: 160 });
    expect(result.warnings.join('\n')).toContain(
      'Missing railroad diagram references: Missing'
    );
  });

  it('renders rounded connector paths', () => {
    const profile: RailroadProfile = {
      ...baseProfile,
      diagrams: [
        {
          name: 'Choice',
          expression: {
            type: 'choice',
            options: [
              { type: 'token', value: 'a' },
              { type: 'token', value: 'b' },
            ],
          },
        },
      ],
    };

    const result = renderRailroadDiagram(profile, { width: 280, height: 160 });
    expect(result.svg).toContain('A 6 6');
  });

  it('supports circle end markers via options', () => {
    const profile: RailroadProfile = {
      ...baseProfile,
      diagrams: [
        {
          name: 'EndCircle',
          expression: { type: 'token', value: 'x' },
        },
      ],
    };

    const result = renderRailroadDiagram(profile, {
      width: 240,
      height: 140,
      endMarker: 'circle',
    });

    expect(result.svg).not.toContain('railroad-arrow');
    expect(result.svg).toContain('<circle');
  });

  it('styles operator tokens differently from terminals', () => {
    const profile: RailroadProfile = {
      ...baseProfile,
      theme: 'professional',
      diagrams: [
        {
          name: 'Ops',
          expression: {
            type: 'sequence',
            items: [
              { type: 'token', value: 'a' },
              { type: 'token', value: '+' },
            ],
          },
        },
      ],
    };

    const result = renderRailroadDiagram(profile, { width: 240, height: 140 });
    const fills = Array.from(result.svg.matchAll(/<rect[^>]*fill="([^"]+)"/g)).map(
      (match) => match[1]
    );
    const tokenFills = fills.slice(1, 3);
    expect(tokenFills.length).toBe(2);
    expect(new Set(tokenFills).size).toBe(2);
  });

  it('uses tighter spacing in compact mode', () => {
    const profile: RailroadProfile = {
      ...baseProfile,
      diagrams: [
        {
          name: 'Compact',
          expression: {
            type: 'sequence',
            items: [
              { type: 'token', value: 'alpha' },
              { type: 'token', value: 'bravo' },
              { type: 'token', value: 'charlie' },
              { type: 'token', value: 'delta' },
              { type: 'token', value: 'echo' },
              { type: 'token', value: 'foxtrot' },
            ],
          },
        },
      ],
    };

    const regular = renderRailroadDiagram(profile);
    const compact = renderRailroadDiagram(profile, {
      compact: true,
    });

    const widthRegex = /<svg[^>]*width="([^"]+)"/;
    const regularWidth = Number(regular.svg.match(widthRegex)?.[1]);
    const compactWidth = Number(compact.svg.match(widthRegex)?.[1]);

    expect(regularWidth).toBeGreaterThan(0);
    expect(compactWidth).toBeGreaterThan(0);
    expect(compactWidth).toBeLessThan(regularWidth);
  });

  it('applies profile option overrides', () => {
    const profile: RailroadProfile = {
      ...baseProfile,
      options: {
        startMarker: 'none',
        endMarker: 'circle',
        markerColor: '#ff0000',
      },
      diagrams: [
        {
          name: 'Overrides',
          expression: { type: 'token', value: 'x' },
        },
      ],
    };

    const result = renderRailroadDiagram(profile);
    expect(result.svg).not.toContain('railroad-arrow');
    const theme = getDiagramTheme();
    const expectedFill = ensureContrast('#ff0000', theme.backgroundColor);
    const circleFillMatch = result.svg.match(
      /<circle[^>]*fill="([^"]+)"/
    );
    expect(circleFillMatch).not.toBeNull();
    expect(circleFillMatch![1]).toBe(expectedFill);
  });

  it('applies spacing overrides from options', () => {
    const profile: RailroadProfile = {
      ...baseProfile,
      options: {
        gap: 6,
        branchPad: 10,
        vGap: 6,
        loop: 10,
        boxPadX: 6,
        boxPadY: 4,
      },
      diagrams: [
        {
          name: 'Spacing',
          expression: {
            type: 'sequence',
            items: [
              { type: 'token', value: 'alpha' },
              { type: 'token', value: 'bravo' },
              { type: 'token', value: 'charlie' },
              { type: 'token', value: 'delta' },
              { type: 'token', value: 'echo' },
              { type: 'token', value: 'foxtrot' },
            ],
          },
        },
      ],
    };

    const defaultRender = renderRailroadDiagram({
      ...profile,
      options: undefined,
    });
    const tunedRender = renderRailroadDiagram(profile);

    const widthRegex = /<svg[^>]*width="([^"]+)"/;
    const defaultWidth = Number(defaultRender.svg.match(widthRegex)?.[1]);
    const tunedWidth = Number(tunedRender.svg.match(widthRegex)?.[1]);

    expect(defaultWidth).toBeGreaterThan(0);
    expect(tunedWidth).toBeGreaterThan(0);
    expect(tunedWidth).toBeLessThan(defaultWidth);
  });
});
