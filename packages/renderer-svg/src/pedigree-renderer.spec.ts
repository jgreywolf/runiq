import { describe, expect, it } from 'vitest';
import type { PedigreeProfile } from '@runiq/core';
import { renderPedigree } from './pedigree-renderer.js';

describe('Pedigree renderer', () => {
  const baseProfile: PedigreeProfile = {
    type: 'pedigree',
    name: 'Pedigree Tests',
    people: [],
    spouses: [],
    parentages: [],
  };

  it('renders people with labels', () => {
    const profile: PedigreeProfile = {
      ...baseProfile,
      people: [
        { id: 'p1', name: 'Alex Rivera', sex: 'male' },
        { id: 'p2', name: 'Jordan Lee', sex: 'female' },
      ],
    };

    const result = renderPedigree(profile);

    expect(result.svg).toContain('Alex Rivera');
    expect(result.svg).toContain('Jordan Lee');
    expect(result.svg).toContain('data-runiq-node="p1"');
  });

  it('renders adoption with dashed lines', () => {
    const profile: PedigreeProfile = {
      ...baseProfile,
      people: [
        { id: 'p1', name: 'Pat Lee', sex: 'male' },
        { id: 'p2', name: 'Dana Lee', sex: 'female' },
        { id: 'c1', name: 'Sky Lee', sex: 'unknown' },
      ],
      parentages: [
        { parents: ['p1', 'p2'], child: 'c1', type: 'adopted' },
      ],
    };

    const result = renderPedigree(profile);

    expect(result.svg).toContain('stroke-dasharray="6,4"');
  });

  it('renders step-parentage with dotted lines', () => {
    const profile: PedigreeProfile = {
      ...baseProfile,
      people: [
        { id: 'p1', name: 'Pat Lee', sex: 'male' },
        { id: 'p2', name: 'Dana Lee', sex: 'female' },
        { id: 'c1', name: 'Sky Lee', sex: 'unknown' },
      ],
      parentages: [
        { parents: ['p1', 'p2'], child: 'c1', type: 'step' },
      ],
    };

    const result = renderPedigree(profile);

    expect(result.svg).toContain('stroke-dasharray="2,4"');
  });

  it('adds warnings for missing references', () => {
    const profile: PedigreeProfile = {
      ...baseProfile,
      people: [{ id: 'p1', name: 'Alex' }],
      spouses: [{ left: 'p1', right: 'missing', date: '2001-01-01' }],
      parentages: [{ parents: ['p1'], child: 'missing', type: 'biological' }],
    };

    const result = renderPedigree(profile);

    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings.join(' ')).toContain('Missing');
  });
});
