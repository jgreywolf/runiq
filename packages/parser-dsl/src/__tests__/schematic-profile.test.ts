import { describe, it, expect } from 'vitest';
import { parse } from '../langium-parser.js';

describe('Schematic Profile Parsing (alias of electrical)', () => {
  it('should parse a simple schematic profile with nets', () => {
    const input = `
schematic "RC Filter" {
  net IN, OUT, GND
}`;

    const result = parse(input);

    expect(result.success).toBe(true);
    expect(result.document).toBeDefined();
    expect(result.document?.profiles).toHaveLength(1);

    const profile = result.document!.profiles[0];
    // Core type remains 'electrical' for compatibility
    expect(profile.type).toBe('electrical');
    expect(profile.name).toBe('RC Filter');

    if (profile.type === 'electrical') {
      expect(profile.nets).toHaveLength(3);
      expect(profile.nets[0].name).toBe('IN');
      expect(profile.nets[1].name).toBe('OUT');
      expect(profile.nets[2].name).toBe('GND');
    }
  });

  it('should parse schematic profile with parts and analysis', () => {
    const input = `
schematic "RC Lowpass" {
  net IN, OUT, GND
  part R1 type:R value:"10k" pins:(IN,OUT)
  part C1 type:C value:"1n" pins:(OUT,GND)
  analysis tran "0 5m"
}`;

    const result = parse(input);

    expect(result.success).toBe(true);
    const profile = result.document!.profiles[0];

    if (profile.type === 'electrical') {
      expect(profile.parts).toHaveLength(2);
      expect(profile.analyses).toBeDefined();
      expect(profile.analyses![0].kind).toBe('tran');
    }
  });
});
