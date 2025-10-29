import { describe, it, expect } from 'vitest';
import { parse } from '../index.js';

describe('Wardley Map Parser', () => {
  it('should parse a simple Wardley Map', () => {
    const source = `
wardley "Tea Shop" {
  anchor "Customer" value:0.95
  component "Cup of Tea" evolution:0.8 value:0.9
  component "Water" evolution:1.0 value:0.5
  dependency from:"Customer" to:"Cup of Tea"
  dependency from:"Cup of Tea" to:"Water"
}`;

    const result = parse(source);

    expect(result.lexErrors).toHaveLength(0);
    expect(result.parseErrors).toHaveLength(0);
    expect(result.document).toBeDefined();
    expect(result.document.profiles).toHaveLength(1);

    const profile = result.document.profiles[0];
    expect(profile.$type).toBe('WardleyProfile');

    if (profile.$type === 'WardleyProfile') {
      expect(profile.name).toBe('Tea Shop');
      expect(profile.statements).toHaveLength(5);

      // Check anchor
      const anchor = profile.statements[0];
      expect(anchor.$type).toBe('WardleyAnchorStatement');

      // Check components
      const comp1 = profile.statements[1];
      expect(comp1.$type).toBe('WardleyComponentStatement');
      if (comp1.$type === 'WardleyComponentStatement') {
        expect(comp1.name).toBe('Cup of Tea');
      }

      // Check dependencies
      const dep1 = profile.statements[3];
      expect(dep1.$type).toBe('WardleyDependencyStatement');
      if (dep1.$type === 'WardleyDependencyStatement') {
        expect(dep1.from).toBe('Customer');
        expect(dep1.to).toBe('Cup of Tea');
      }
    }
  });

  it('should parse evolution statements', () => {
    const source = `
wardley "Evolution Test" {
  component "Legacy System" evolution:0.3 value:0.6
  evolve "Legacy System" to evolution:0.7
}`;

    const result = parse(source);

    expect(result.lexErrors).toHaveLength(0);
    expect(result.parseErrors).toHaveLength(0);

    const profile = result.document.profiles[0];
    if (profile.$type === 'WardleyProfile') {
      expect(profile.statements).toHaveLength(2);

      const evolve = profile.statements[1];
      expect(evolve.$type).toBe('WardleyEvolutionStatement');
    }
  });

  it('should parse components with inertia', () => {
    const source = `
wardley "Inertia Test" {
  component "Old Platform" evolution:0.4 value:0.7 inertia:true
}`;

    const result = parse(source);

    expect(result.lexErrors).toHaveLength(0);
    expect(result.parseErrors).toHaveLength(0);

    const profile = result.document.profiles[0];
    if (profile.$type === 'WardleyProfile') {
      const comp = profile.statements[0];
      if (comp.$type === 'WardleyComponentStatement') {
        const inertiaProp = comp.properties.find(
          (p) => p.$type === 'WardleyInertiaProperty'
        );
        expect(inertiaProp).toBeDefined();
      }
    }
  });
});
