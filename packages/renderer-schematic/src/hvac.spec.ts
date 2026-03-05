import { describe, expect, it } from 'vitest';
import type { HvacProfile } from '@runiq/core';
import { renderSchematic } from './index.js';

describe('HVAC schematic rendering', () => {
  it('should render HVAC metadata values', () => {
    const profile: HvacProfile = {
      type: 'hvac',
      name: 'Value Labels',
      parts: [
        {
          ref: 'AHU1',
          type: 'AIR_HANDLING_UNIT',
          pins: ['SUPPLY', 'RETURN'],
          params: { cfm: 5000 },
        },
        {
          ref: 'VAV1',
          type: 'VAV_BOX',
          pins: ['SUPPLY', 'RETURN'],
          params: { 'cfm-max': 1200 },
        },
      ],
      nets: [{ name: 'SUPPLY' }, { name: 'RETURN' }],
    };

    const result = renderSchematic(profile, { showValues: true });

    expect(result.svg).toContain('CFM: 5000');
    expect(result.svg).toContain('CFM MAX: 1200');
  });
});
