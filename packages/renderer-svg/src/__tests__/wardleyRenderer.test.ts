import { describe, it, expect } from 'vitest';
import { renderWardleyMap } from '../wardley-renderer.js';
import type { WardleyProfile } from '@runiq/core';

describe('Wardley Map Renderer', () => {
  it('should render a simple Wardley map', () => {
    const profile: WardleyProfile = {
      type: 'wardley',
      name: 'Tea Shop',
      astVersion: '1.0',
      anchors: [{ name: 'Customer', value: 0.95 }],
      components: [
        { name: 'Cup of Tea', evolution: 0.8, value: 0.9 },
        { name: 'Water', evolution: 1.0, value: 0.5 },
      ],
      dependencies: [
        { from: 'Customer', to: 'Cup of Tea' },
        { from: 'Cup of Tea', to: 'Water' },
      ],
    };

    const result = renderWardleyMap(profile);

    expect(result.svg).toContain('<svg');
    expect(result.svg).toContain('</svg>');
    expect(result.svg).toContain('Customer');
    expect(result.svg).toContain('Cup of Tea');
    expect(result.svg).toContain('Water');
  });

  it('should render components at correct positions', () => {
    const profile: WardleyProfile = {
      type: 'wardley',
      name: 'Test',
      astVersion: '1.0',
      components: [
        { name: 'Genesis', evolution: 0.0, value: 0.5 },
        { name: 'Commodity', evolution: 1.0, value: 0.5 },
      ],
      dependencies: [],
    };

    const result = renderWardleyMap(profile);

    expect(result.svg).toContain('Genesis');
    expect(result.svg).toContain('Commodity');
  });

  it('should render dependencies as lines', () => {
    const profile: WardleyProfile = {
      type: 'wardley',
      name: 'Dependencies Test',
      astVersion: '1.0',
      components: [
        { name: 'A', evolution: 0.5, value: 0.8 },
        { name: 'B', evolution: 0.5, value: 0.4 },
      ],
      dependencies: [{ from: 'A', to: 'B' }],
    };

    const result = renderWardleyMap(profile);

    expect(result.svg).toContain('<line');
    expect(result.svg).toContain('A');
    expect(result.svg).toContain('B');
  });

  it('should render components with inertia', () => {
    const profile: WardleyProfile = {
      type: 'wardley',
      name: 'Inertia Test',
      astVersion: '1.0',
      components: [
        { name: 'Legacy', evolution: 0.3, value: 0.6, inertia: true },
      ],
      dependencies: [],
    };

    const result = renderWardleyMap(profile);

    expect(result.svg).toContain('Legacy');
    expect(result.svg).toBeDefined();
  });

  it('should render evolution lines', () => {
    const profile: WardleyProfile = {
      type: 'wardley',
      name: 'Evolution Test',
      astVersion: '1.0',
      components: [{ name: 'System', evolution: 0.4, value: 0.7 }],
      dependencies: [],
      evolutions: [{ component: 'System', toEvolution: 0.8 }],
    };

    const result = renderWardleyMap(profile);

    expect(result.svg).toContain('System');
    expect(result.svg).toContain('<');
  });

  it('should render component labels', () => {
    const profile: WardleyProfile = {
      type: 'wardley',
      name: 'Label Test',
      astVersion: '1.0',
      components: [
        {
          name: 'Service',
          evolution: 0.7,
          value: 0.8,
          label: 'Customer-facing service',
        },
      ],
      dependencies: [],
    };

    const result = renderWardleyMap(profile);

    expect(result.svg).toContain('Customer-facing service');
    expect(result.svg).toBeDefined();
  });

  it('should render the evolution axis', () => {
    const profile: WardleyProfile = {
      type: 'wardley',
      name: 'Axis Test',
      astVersion: '1.0',
      components: [],
      dependencies: [],
    };

    const result = renderWardleyMap(profile);

    expect(result.svg).toContain('Genesis');
    expect(result.svg).toContain('Custom');
    expect(result.svg).toContain('Product');
    expect(result.svg).toContain('Commodity');
  });

  it('should render the value chain axis', () => {
    const profile: WardleyProfile = {
      type: 'wardley',
      name: 'Value Axis Test',
      astVersion: '1.0',
      components: [],
      dependencies: [],
    };

    const result = renderWardleyMap(profile);

    expect(result.svg).toContain('Invisible');
    expect(result.svg).toContain('Visible');
  });

  it('should render complete Tea Shop example', () => {
    const profile: WardleyProfile = {
      type: 'wardley',
      name: 'Tea Shop',
      astVersion: '1.0',
      anchors: [{ name: 'Cup of Tea', value: 0.9 }],
      components: [
        {
          name: 'Cup of Tea',
          evolution: 0.8,
          value: 0.9,
          label: 'What customer sees',
        },
        { name: 'Tea', evolution: 0.9, value: 0.8 },
        { name: 'Cup', evolution: 1.0, value: 0.7 },
        { name: 'Hot Water', evolution: 0.95, value: 0.6 },
        { name: 'Water', evolution: 1.0, value: 0.3 },
        { name: 'Kettle', evolution: 0.9, value: 0.4 },
        { name: 'Power', evolution: 1.0, value: 0.1 },
      ],
      dependencies: [
        { from: 'Cup of Tea', to: 'Tea' },
        { from: 'Cup of Tea', to: 'Cup' },
        { from: 'Cup of Tea', to: 'Hot Water' },
        { from: 'Hot Water', to: 'Water' },
        { from: 'Hot Water', to: 'Kettle' },
        { from: 'Kettle', to: 'Power' },
      ],
    };

    const result = renderWardleyMap(profile);

    expect(result.svg).toContain('<svg');
    expect(result.svg).toContain('</svg>');

    expect(result.svg).toContain('Cup of Tea');
    expect(result.svg).toContain('Tea');
    expect(result.svg).toContain('Cup');
    expect(result.svg).toContain('Hot Water');
    expect(result.svg).toContain('Water');
    expect(result.svg).toContain('Kettle');
    expect(result.svg).toContain('Power');

    const lineCount = (result.svg.match(/<line/g) || []).length;
    expect(lineCount).toBeGreaterThan(5);
  });

  it('should handle edge case evolution values', () => {
    const profile: WardleyProfile = {
      type: 'wardley',
      name: 'Edge Cases',
      astVersion: '1.0',
      components: [
        { name: 'Novel', evolution: 0.0, value: 0.8 },
        { name: 'Utility', evolution: 1.0, value: 0.2 },
      ],
      dependencies: [],
    };

    const result = renderWardleyMap(profile);

    expect(result.svg).toContain('Novel');
    expect(result.svg).toContain('Utility');
  });

  it('should handle edge case value chain values', () => {
    const profile: WardleyProfile = {
      type: 'wardley',
      name: 'Value Edge Cases',
      astVersion: '1.0',
      components: [
        { name: 'Invisible', evolution: 0.5, value: 0.0 },
        { name: 'Very Visible', evolution: 0.5, value: 1.0 },
      ],
      dependencies: [],
    };

    const result = renderWardleyMap(profile);

    expect(result.svg).toContain('Invisible');
    expect(result.svg).toContain('Very Visible');
  });
});
