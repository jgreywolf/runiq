import { ProfileType } from '@runiq/core';
import { describe, expect, it } from 'vitest';
import { parse } from '../langium-parser.js';

describe('Schematic Profile Parsing', () => {
  it('should parse a simple schematic profile with nets', () => {
    const input = `
electrical "RC Filter" {
  net IN, OUT, GND
}`;

    const result = parse(input);

    expect(result.success).toBe(true);
    expect(result.document).toBeDefined();
    expect(result.document?.profiles).toHaveLength(1);

    const profile = result.document!.profiles[0];
    expect(profile.type).toBe(ProfileType.ELECTRICAL);
    expect(profile.name).toBe('RC Filter');

    if (profile.type === ProfileType.ELECTRICAL) {
      expect(profile.nets).toHaveLength(3);
      expect(profile.nets[0].name).toBe('IN');
      expect(profile.nets[1].name).toBe('OUT');
      expect(profile.nets[2].name).toBe('GND');
    }
  });

  it('should parse schematic profile with parts and analysis', () => {
    const input = `
electrical "RC Lowpass" {
  net IN, OUT, GND
  part R1 type:R value:"10k" pins:(IN,OUT)
  part C1 type:C value:"1n" pins:(OUT,GND)
  analysis tran "0 5m"
}`;

    const result = parse(input);

    expect(result.success).toBe(true);
    const profile = result.document!.profiles[0];

    if (profile.type === ProfileType.ELECTRICAL) {
      expect(profile.parts).toHaveLength(2);
      expect(profile.analyses).toBeDefined();
      expect(profile.analyses![0].kind).toBe('tran');
    }
  });

  it('should parse HVAC profile with equipment and ducts', () => {
    const input = `
hvac "Office HVAC System" {
  equipment AHU1 type:air-handling-unit cfm:5000
  equipment VAV1 type:vav-box cfm-max:1000
  equipment Diff1 type:diffuser-supply

  duct Supply type:supply size:"16x12"
  duct Return type:return size:"20x14"

  connect AHU1.out -> Supply -> VAV1.in
  connect VAV1.out -> Diff1.in
  connect Diff1.out -> Return -> AHU1.in
}`;

    const result = parse(input);

    expect(result.success).toBe(true);
    expect(result.document).toBeDefined();

    const profile = result.document!.profiles[0];
    expect(profile.type).toBe(ProfileType.HVAC);
    expect(profile.name).toBe('Office HVAC System');

    if (profile.type === ProfileType.HVAC) {
      expect(profile.parts).toHaveLength(5);
      expect(profile.nets.length).toBeGreaterThan(0);
    }
  });

  it('should parse control profile with parts and nets', () => {
    const input = `
control "Motor Start-Stop" {
  variant ladder
  net L1, L2, M1
  part Start type:NO_CONTACT pins:(L1,M1)
  part Motor type:COIL pins:(M1,L2)
}`;

    const result = parse(input);

    expect(result.success).toBe(true);
    const profile = result.document!.profiles[0];
    expect(profile.type).toBe(ProfileType.CONTROL);

    if (profile.type === ProfileType.CONTROL) {
      expect(profile.variant).toBe('ladder');
      expect(profile.parts).toHaveLength(2);
      expect(profile.nets).toHaveLength(3);
    }
  });
});
