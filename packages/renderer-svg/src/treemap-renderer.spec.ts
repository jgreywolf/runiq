import { describe, expect, it } from 'vitest';
import { renderTreemap } from './treemap-renderer.js';
import type { TreemapProfile } from '@runiq/core';

describe('renderTreemap', () => {
  it('renders empty state when there are no nodes', () => {
    const profile: TreemapProfile = {
      type: 'treemap',
      name: 'Empty',
      nodes: [],
    };

    const result = renderTreemap(profile);

    expect(result.svg).toContain('No treemap nodes defined');
    expect(result.warnings).toHaveLength(0);
  });

  it('renders values and legend when enabled', () => {
    const profile: TreemapProfile = {
      type: 'treemap',
      name: 'Product Usage',
      layout: 'squarify',
      showValues: true,
      showLegend: true,
      nodes: [
        { label: 'Analytics', value: 120 },
        { label: 'Billing', value: 80 },
        {
          label: 'Engagement',
          children: [
            { label: 'Email', value: 40 },
            { label: 'Push', value: 20 },
          ],
        },
      ],
    };

    const result = renderTreemap(profile);

    expect(result.svg).toContain('Analytics (120)');
    expect(result.svg).toContain('Billing (80)');
    expect(result.svg).toContain('Engagement');
  });
});
