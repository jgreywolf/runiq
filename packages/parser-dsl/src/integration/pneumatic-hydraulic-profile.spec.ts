import { describe, expect, it } from 'vitest';
import { parse } from '../langium-parser.js';
import {
  parseHydraulicProfile,
  parsePneumaticProfile,
} from '../test-utils/profile-helpers.js';

describe('Pneumatic Profile Parsing', () => {
  it('should parse a simple pneumatic profile with nets', () => {
    const input = `
pneumatic "Simple Cylinder Circuit" {
  net P, A, R
}`;

    const profile = parsePneumaticProfile(input);

    expect(profile?.name).toBe('Simple Cylinder Circuit');

    if (profile) {
      expect(profile.nets).toHaveLength(3);
      expect(profile.nets[0].name).toBe('P');
      expect(profile.nets[1].name).toBe('A');
      expect(profile.nets[2].name).toBe('R');
    }
  });

  it('should parse pneumatic profile with components', () => {
    const input = `
pneumatic "Cylinder with Valve" {
  net P, A, EXHAUST
  part CYL1 type:CYL_SA pins:(A,P,EXHAUST)
  part V1 type:VALVE_32 pins:(P,A,EXHAUST)
  part AIR type:AIR_SOURCE pins:(P)
}`;

    const profile = parsePneumaticProfile(input);

    if (profile) {
      expect(profile.parts).toHaveLength(3);
      expect(profile.parts[0].ref).toBe('CYL1');
      expect(profile.parts[0].type).toBe('CYL_SA');
      expect(profile.parts[1].ref).toBe('V1');
      expect(profile.parts[1].type).toBe('VALVE_32');
      expect(profile.parts[2].ref).toBe('AIR');
      expect(profile.parts[2].type).toBe('AIR_SOURCE');
    }
  });

  it('should parse pneumatic profile with pressure specification', () => {
    const input = `
pneumatic "Pressure Controlled System" {
  pressure 6 bar operating
  net P, A
  part CYL1 type:CYL_DA pins:(A,P)
}`;

    const profile = parsePneumaticProfile(input);

    if (profile) {
      expect(profile.pressure).toBeDefined();
      expect(profile.pressure?.value).toBe(6);
      expect(profile.pressure?.unit).toBe('bar');
      expect(profile.pressure?.type).toBe('operating');
    }
  });

  it('should parse pneumatic profile with flow rate specification', () => {
    const input = `
pneumatic "Flow Controlled Circuit" {
  flowRate 100 L/min
  net P, A
  part FLOW1 type:FLOW_CONTROL pins:(P,A)
}`;

    const profile = parsePneumaticProfile(input);

    if (profile) {
      expect(profile.flowRate).toBeDefined();
      expect(profile.flowRate?.value).toBe(100);
      expect(profile.flowRate?.unit).toBe('L/min');
    }
  });

  it('should parse complete pneumatic FRL circuit', () => {
    const input = `
pneumatic "FRL Unit with Cylinder" {
  pressure 6 bar operating
  flowRate 150 L/min
  
  net SUPPLY, REGULATED, FILTERED, LUBRICATED, CYL_A, EXHAUST
  
  part AIR type:AIR_SOURCE pins:(SUPPLY)
  part REG type:REGULATOR pins:(SUPPLY,REGULATED)
  part FILTER type:FILTER pins:(REGULATED,FILTERED)
  part LUB type:LUBRICATOR pins:(FILTERED,LUBRICATED)
  part V1 type:VALVE_52 pins:(LUBRICATED,CYL_A,EXHAUST,EXHAUST,EXHAUST)
  part CYL1 type:CYL_DA pins:(CYL_A,CYL_A)
  part GAUGE type:GAUGE_P pins:(REGULATED)
}`;

    const profile = parsePneumaticProfile(input);

    if (profile) {
      expect(profile.name).toBe('FRL Unit with Cylinder');
      expect(profile.nets).toHaveLength(6);
      expect(profile.parts).toHaveLength(7);
      expect(profile.pressure?.value).toBe(6);
      expect(profile.flowRate?.value).toBe(150);
    }
  });
});

describe('Hydraulic Profile Parsing', () => {
  it('should parse a simple hydraulic profile with nets', () => {
    const input = `
hydraulic "Simple Hydraulic System" {
  net P, A, B, T
}`;

    const profile = parseHydraulicProfile(input);
    expect(profile.name).toBe('Simple Hydraulic System');

    if (profile) {
      expect(profile.nets).toHaveLength(4);
      expect(profile.nets[0].name).toBe('P');
      expect(profile.nets[1].name).toBe('A');
      expect(profile.nets[2].name).toBe('B');
      expect(profile.nets[3].name).toBe('T');
    }
  });

  it('should parse hydraulic profile with components', () => {
    const input = `
hydraulic "Pump and Motor Circuit" {
  net PRESSURE, RETURN, TANK
  part PUMP1 type:PUMP_FIXED pins:(TANK,PRESSURE)
  part MOTOR1 type:MOTOR_HYD pins:(PRESSURE,RETURN,SHAFT)
  part RES type:RESERVOIR pins:(RETURN,TANK,VENT)
}`;

    const profile = parseHydraulicProfile(input);

    if (profile) {
      expect(profile.parts).toHaveLength(3);
      expect(profile.parts[0].ref).toBe('PUMP1');
      expect(profile.parts[0].type).toBe('PUMP_FIXED');
      expect(profile.parts[1].ref).toBe('MOTOR1');
      expect(profile.parts[1].type).toBe('MOTOR_HYD');
      expect(profile.parts[2].ref).toBe('RES');
      expect(profile.parts[2].type).toBe('RESERVOIR');
    }
  });

  it('should parse hydraulic profile with pressure and flow specifications', () => {
    const input = `
hydraulic "High Pressure System" {
  pressure 200 bar max
  flowRate 50 L/min
  net P, T
  part PUMP type:PUMP_VAR pins:(T,P,CONTROL)
}`;

    const profile = parseHydraulicProfile(input);

    if (profile) {
      expect(profile.pressure).toBeDefined();
      expect(profile.pressure?.value).toBe(200);
      expect(profile.pressure?.unit).toBe('bar');
      expect(profile.pressure?.type).toBe('max');
      expect(profile.flowRate?.value).toBe(50);
      expect(profile.flowRate?.unit).toBe('L/min');
    }
  });

  it('should parse hydraulic profile with fluid specification', () => {
    const input = `
hydraulic "Industrial Hydraulic System" {
  pressure 150 bar operating
  fluid mineral "ISO VG 46" temp:(10,60,degC)
  net P, T
  part PUMP type:PUMP_FIXED pins:(T,P)
}`;

    const profile = parseHydraulicProfile(input);

    if (profile) {
      expect(profile.fluid).toBeDefined();
      expect(profile.fluid?.type).toBe('mineral');
      expect(profile.fluid?.viscosity).toBe('ISO VG 46');
      expect(profile.fluid?.temperature).toBeDefined();
      expect(profile.fluid?.temperature?.min).toBe(10);
      expect(profile.fluid?.temperature?.max).toBe(60);
      expect(profile.fluid?.temperature?.unit).toBe('degC');
    }
  });

  it('should parse complete hydraulic power unit circuit', () => {
    const input = `
hydraulic "Hydraulic Power Unit" {
  pressure 200 bar max
  flowRate 80 L/min
  fluid mineral "ISO VG 46" temp:(10,60,degC)
  
  net TANK, PUMP_OUT, FILTERED, PRESSURE, WORK_A, WORK_B, RETURN
  
  part RES type:RESERVOIR pins:(RETURN,TANK,VENT)
  part PUMP type:PUMP_FIXED pins:(TANK,PUMP_OUT)
  part FILTER type:FILTER_HYD pins:(PUMP_OUT,FILTERED)
  part RELIEF type:RELIEF_VALVE pins:(FILTERED,TANK)
  part VALVE type:VALVE_43 pins:(FILTERED,WORK_A,WORK_B,RETURN)
  part CYL type:CYL_HYD pins:(WORK_A,WORK_B)
  part GAUGE type:GAUGE_P_HYD pins:(FILTERED)
  part ACCUM type:ACCUMULATOR pins:(FILTERED)
}`;

    const profile = parseHydraulicProfile(input);

    if (profile) {
      expect(profile.name).toBe('Hydraulic Power Unit');
      expect(profile.nets).toHaveLength(7);
      expect(profile.parts).toHaveLength(8);
      expect(profile.pressure?.value).toBe(200);
      expect(profile.pressure?.type).toBe('max');
      expect(profile.flowRate?.value).toBe(80);
      expect(profile.fluid?.type).toBe('mineral');
      expect(profile.fluid?.viscosity).toBe('ISO VG 46');
    }
  });

  it('should parse hydraulic cylinder with different configurations', () => {
    const input = `
hydraulic "Cylinder Control" {
  net P, A, B, T
  part CYL1 type:CYL_HYD pins:(A,B) doc:"Double-acting cylinder"
  part CYL2 type:CYL_HYD pins:(A,B) doc:"Another cylinder"
}`;

    const profile = parseHydraulicProfile(input);

    if (profile) {
      expect(profile.parts).toHaveLength(2);
      expect(profile.parts[0].doc).toBe('Double-acting cylinder');
      expect(profile.parts[1].doc).toBe('Another cylinder');
    }
  });
});

describe('Pneumatic/Hydraulic Profile Component Types', () => {
  it('should parse all 12 pneumatic symbol types', () => {
    const input = `
pneumatic "All Pneumatic Symbols" {
  net N1, N2, N3, N4, N5
  part C1 type:CYL_SA pins:(N1,N2,N3)
  part C2 type:CYL_DA pins:(N1,N2,N3)
  part V1 type:VALVE_32 pins:(N1,N2,N3)
  part V2 type:VALVE_52 pins:(N1,N2,N3,N4,N5)
  part A1 type:AIR_SOURCE pins:(N1)
  part R1 type:REGULATOR pins:(N1,N2)
  part F1 type:FILTER pins:(N1,N2)
  part L1 type:LUBRICATOR pins:(N1,N2)
  part FC1 type:FLOW_CONTROL pins:(N1,N2)
  part CV1 type:CHECK_VALVE pins:(N1,N2)
  part EX1 type:EXHAUST pins:(N1)
  part G1 type:GAUGE_P pins:(N1)
}`;

    const profile = parsePneumaticProfile(input);

    if (profile) {
      expect(profile.parts).toHaveLength(12);
      const types = profile.parts.map((p) => p.type);
      expect(types).toContain('CYL_SA');
      expect(types).toContain('CYL_DA');
      expect(types).toContain('VALVE_32');
      expect(types).toContain('VALVE_52');
      expect(types).toContain('AIR_SOURCE');
      expect(types).toContain('REGULATOR');
      expect(types).toContain('FILTER');
      expect(types).toContain('LUBRICATOR');
      expect(types).toContain('FLOW_CONTROL');
      expect(types).toContain('CHECK_VALVE');
      expect(types).toContain('EXHAUST');
      expect(types).toContain('GAUGE_P');
    }
  });

  it('should parse all 13 hydraulic symbol types', () => {
    const input = `
hydraulic "All Hydraulic Symbols" {
  net N1, N2, N3, N4, N5
  part P1 type:PUMP_FIXED pins:(N1,N2)
  part P2 type:PUMP_VAR pins:(N1,N2,N3)
  part M1 type:MOTOR_HYD pins:(N1,N2,N3)
  part C1 type:CYL_HYD pins:(N1,N2)
  part V1 type:VALVE_43 pins:(N1,N2,N3,N4)
  part RV1 type:RELIEF_VALVE pins:(N1,N2)
  part RV2 type:REDUCING_VALVE pins:(N1,N2)
  part FC1 type:FLOW_CONTROL_HYD pins:(N1,N2)
  part CV1 type:CHECK_VALVE_HYD pins:(N1,N2)
  part F1 type:FILTER_HYD pins:(N1,N2)
  part R1 type:RESERVOIR pins:(N1,N2,N3)
  part A1 type:ACCUMULATOR pins:(N1)
  part G1 type:GAUGE_P_HYD pins:(N1)
}`;

    const profile = parseHydraulicProfile(input);

    if (profile) {
      expect(profile.parts).toHaveLength(13);
      const types = profile.parts.map((p) => p.type);
      expect(types).toContain('PUMP_FIXED');
      expect(types).toContain('PUMP_VAR');
      expect(types).toContain('MOTOR_HYD');
      expect(types).toContain('CYL_HYD');
      expect(types).toContain('VALVE_43');
      expect(types).toContain('RELIEF_VALVE');
      expect(types).toContain('REDUCING_VALVE');
      expect(types).toContain('FLOW_CONTROL_HYD');
      expect(types).toContain('CHECK_VALVE_HYD');
      expect(types).toContain('FILTER_HYD');
      expect(types).toContain('RESERVOIR');
      expect(types).toContain('ACCUMULATOR');
      expect(types).toContain('GAUGE_P_HYD');
    }
  });
});

describe('Pneumatic/Hydraulic Profile Edge Cases', () => {
  it('should handle empty pneumatic profile', () => {
    const input = `
pneumatic "Empty Circuit" {
}`;

    const profile = parsePneumaticProfile(input);
    if (profile) {
      expect(profile.nets).toHaveLength(0);
      expect(profile.parts).toHaveLength(0);
    }
  });

  it('should handle multiple pressure units', () => {
    const inputs = [
      'pneumatic "Test" { pressure 6 bar operating }',
      'pneumatic "Test" { pressure 87 psi operating }',
      'pneumatic "Test" { pressure 600 kPa operating }',
    ];

    inputs.forEach((input) => {
      const result = parse(input);
      expect(result.success).toBe(true);
    });
  });

  it('should handle multiple flow rate units', () => {
    const inputs = [
      'pneumatic "Test" { flowRate 100 L/min }',
      'hydraulic "Test" { flowRate 20 GPM }',
      'pneumatic "Test" { flowRate 50 CFM }',
    ];

    inputs.forEach((input) => {
      const result = parse(input);
      expect(result.success).toBe(true);
    });
  });

  it('should handle mixed profile document', () => {
    const input = `
pneumatic "Pneumatic Circuit" {
  net P, A
  part CYL type:CYL_SA pins:(P,A)
}

hydraulic "Hydraulic Circuit" {
  net P, T
  part PUMP type:PUMP_FIXED pins:(T,P)
}`;

    const result = parse(input);

    expect(result.success).toBe(true);
    expect(result.document?.profiles).toHaveLength(2);
    expect(result.document?.profiles[0].type).toBe('pneumatic');
    expect(result.document?.profiles[1].type).toBe('hydraulic');
  });
});
