import { describe, it, expect } from 'vitest';
import { parse } from '../langium-parser.js';

describe('Wardley Map Parser', () => {
  it('should parse a simple Wardley Map', () => {
    const input = `
wardley "Tea Shop" {
  anchor "Customer" value:0.95
  component "Cup of Tea" evolution:0.8 value:0.9
  component "Water" evolution:1.0 value:0.5
  dependency from:"Customer" to:"Cup of Tea"
  dependency from:"Cup of Tea" to:"Water"
}`;

    const result = parse(input);

    expect(result.success).toBe(true);
    expect(result.document).toBeDefined();
    expect(result.document?.profiles).toHaveLength(1);

    const profile = result.document?.profiles[0];
    expect(profile?.type).toBe('wardley');

    if (profile?.type === 'wardley') {
      expect(profile.name).toBe('Tea Shop');
      expect(profile.anchors).toHaveLength(1);
      expect(profile.components).toHaveLength(2);
      expect(profile.dependencies).toHaveLength(2);

      // Check anchor
      expect(profile.anchors[0].name).toBe('Customer');
      expect(profile.anchors[0].value).toBe(0.95);

      // Check components
      expect(profile.components[0].name).toBe('Cup of Tea');
      expect(profile.components[0].evolution).toBe(0.8);
      expect(profile.components[0].value).toBe(0.9);

      expect(profile.components[1].name).toBe('Water');
      expect(profile.components[1].evolution).toBe(1.0);
      expect(profile.components[1].value).toBe(0.5);

      // Check dependencies
      expect(profile.dependencies[0].from).toBe('Customer');
      expect(profile.dependencies[0].to).toBe('Cup of Tea');
      expect(profile.dependencies[1].from).toBe('Cup of Tea');
      expect(profile.dependencies[1].to).toBe('Water');
    }
  });

  it('should parse components with inertia', () => {
    const input = `
wardley "Inertia Test" {
  component "Old Platform" evolution:0.4 value:0.7 inertia:true
}`;

    const result = parse(input);

    expect(result.success).toBe(true);

    const profile = result.document?.profiles[0];
    expect(profile?.type).toBe('wardley');

    if (profile?.type === 'wardley') {
      expect(profile.components).toHaveLength(1);
      expect(profile.components[0].inertia).toBe(true);
    }
  });

  it('should parse evolution statements', () => {
    const input = `
wardley "Evolution Test" {
  component "Legacy System" evolution:0.3 value:0.6
  evolve "Legacy System" to evolution:0.7
}`;

    const result = parse(input);

    expect(result.success).toBe(true);

    const profile = result.document?.profiles[0];
    expect(profile?.type).toBe('wardley');

    if (profile?.type === 'wardley') {
      expect(profile.components).toHaveLength(1);
      expect(profile.evolutions).toHaveLength(1);

      expect(profile.evolutions[0].component).toBe('Legacy System');
      expect(profile.evolutions[0].toEvolution).toBe(0.7);
    }
  });

  it('should parse components with labels', () => {
    const input = `
wardley "Label Test" {
  component "Service" evolution:0.7 value:0.8 label:"Customer-facing service"
}`;

    const result = parse(input);

    expect(result.success).toBe(true);

    const profile = result.document?.profiles[0];
    expect(profile?.type).toBe('wardley');

    if (profile?.type === 'wardley') {
      expect(profile.components[0].label).toBe('Customer-facing service');
    }
  });

  it('should parse complete Tea Shop example', () => {
    const input = `
wardley "Tea Shop" {
  anchor "Cup of Tea" value:0.9

  component "Cup of Tea" evolution:0.8 value:0.9 label:"What customer sees"
  component "Tea" evolution:0.9 value:0.8
  component "Cup" evolution:1.0 value:0.7
  component "Hot Water" evolution:0.95 value:0.6
  component "Water" evolution:1.0 value:0.3
  component "Kettle" evolution:0.9 value:0.4
  component "Power" evolution:1.0 value:0.1

  dependency from:"Cup of Tea" to:"Tea"
  dependency from:"Cup of Tea" to:"Cup"
  dependency from:"Cup of Tea" to:"Hot Water"
  dependency from:"Hot Water" to:"Water"
  dependency from:"Hot Water" to:"Kettle"
  dependency from:"Kettle" to:"Power"
}`;

    const result = parse(input);

    expect(result.success).toBe(true);

    const profile = result.document?.profiles[0];
    expect(profile?.type).toBe('wardley');

    if (profile?.type === 'wardley') {
      expect(profile.name).toBe('Tea Shop');
      expect(profile.components).toHaveLength(7);
      expect(profile.dependencies).toHaveLength(6);
      expect(profile.anchors).toHaveLength(1);

      // Check commodity components (evolution = 1.0)
      const commodities = profile.components.filter((c) => c.evolution === 1.0);
      expect(commodities).toHaveLength(3); // Cup, Water, Power
    }
  });
});
