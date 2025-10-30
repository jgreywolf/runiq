import { describe, it, expect } from 'vitest';
import { parse } from '../langium-parser.js';

describe('Schematic Profile Parsing', () => {
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
    expect(profile.type).toBe('electrical');
    expect(profile.name).toBe('RC Filter');

    if (profile.type === 'electrical') {
      expect(profile.nets).toHaveLength(3);
      expect(profile.nets[0].name).toBe('IN');
      expect(profile.nets[1].name).toBe('OUT');
      expect(profile.nets[2].name).toBe('GND');
    }
  });

  it('should parse schematic profile with parts', () => {
    const input = `
schematic "RC Lowpass" {
  net IN, OUT, GND
  part R1 type:R value:"10k" pins:(IN,OUT)
  part C1 type:C value:"1n" pins:(OUT,GND)
}`;

    const result = parse(input);

    if (!result.success) {
      console.log('Parse errors:', result.errors);
    }

    expect(result.success).toBe(true);
    const profile = result.document!.profiles[0];

    if (profile.type === 'electrical') {
      expect(profile.parts).toHaveLength(2);

      // Check R1
      expect(profile.parts[0].ref).toBe('R1');
      expect(profile.parts[0].type).toBe('R');
      expect(profile.parts[0].params?.value).toBe('10k');
      expect(profile.parts[0].pins).toEqual(['IN', 'OUT']);

      // Check C1
      expect(profile.parts[1].ref).toBe('C1');
      expect(profile.parts[1].type).toBe('C');
      expect(profile.parts[1].params?.value).toBe('1n');
      expect(profile.parts[1].pins).toEqual(['OUT', 'GND']);
    }
  });

  it('should parse schematic profile with voltage source', () => {
    const input = `
schematic "Test Circuit" {
  net IN, GND
  part V1 type:V source:"SIN(0 1 1k)" pins:(IN,GND)
}`;

    const result = parse(input);

    expect(result.success).toBe(true);
    const profile = result.document!.profiles[0];

    if (profile.type === 'electrical') {
      expect(profile.parts).toHaveLength(1);
      expect(profile.parts[0].ref).toBe('V1');
      expect(profile.parts[0].type).toBe('V');
      expect(profile.parts[0].params?.source).toBe('SIN(0 1 1k)');
      expect(profile.parts[0].pins).toEqual(['IN', 'GND']);
    }
  });

  it('should parse schematic profile with analysis', () => {
    const input = `
schematic "RC Filter" {
  net IN, OUT, GND
  part R1 type:R value:"10k" pins:(IN,OUT)
  part C1 type:C value:"1n" pins:(OUT,GND)
  part V1 type:V source:"SIN(0 1 1k)" pins:(IN,GND)
  analysis tran "0 5m"
}`;

    const result = parse(input);

    expect(result.success).toBe(true);
    const profile = result.document!.profiles[0];

    if (profile.type === 'electrical') {
      expect(profile.analyses).toBeDefined();
      expect(profile.analyses).toHaveLength(1);
      expect(profile.analyses![0].kind).toBe('tran');
      expect(profile.analyses![0].args).toBe('0 5m');
    }
  });

  it('should parse multiple analysis statements', () => {
    const input = `
schematic "Multi-Analysis" {
  net IN, OUT, GND
  part R1 type:R value:"10k" pins:(IN,OUT)
  analysis tran "0 5m"
  analysis ac "dec 10 1 100k"
  analysis dc
}`;

    const result = parse(input);

    expect(result.success).toBe(true);
    const profile = result.document!.profiles[0];

    if (profile.type === 'electrical') {
      expect(profile.analyses).toHaveLength(3);
      expect(profile.analyses![0].kind).toBe('tran');
      expect(profile.analyses![1].kind).toBe('ac');
      expect(profile.analyses![2].kind).toBe('dc');
      expect(profile.analyses![2].args).toBeUndefined();
    }
  });
});
