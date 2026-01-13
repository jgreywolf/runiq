import { describe, expect, it } from 'vitest';
import type { RailroadProfile } from '@runiq/core';
import { renderRailroadDiagram } from './railroad-renderer.js';

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
});
