import { describe, it, expect } from 'vitest';
import { renderSchematic } from './index.js';
import type { PneumaticProfile, HydraulicProfile } from '@runiq/core';

describe('Pneumatic/Hydraulic Integration Tests', () => {
  describe('Pneumatic Circuit Rendering', () => {
    it('should render simple pneumatic FRL circuit', () => {
      const profile: PneumaticProfile = {
        type: 'pneumatic',
        name: 'FRL Unit Test',
        nets: [
          { name: 'SUPPLY' },
          { name: 'FILTERED' },
          { name: 'REGULATED' },
          { name: 'OUTPUT' },
        ],
        parts: [
          {
            ref: 'F1',
            type: 'FILTER',
            pins: ['SUPPLY', 'FILTERED'],
            doc: 'Air filter',
          },
          {
            ref: 'R1',
            type: 'REGULATOR',
            pins: ['FILTERED', 'REGULATED'],
            doc: 'Pressure regulator',
          },
          {
            ref: 'L1',
            type: 'LUBRICATOR',
            pins: ['REGULATED', 'OUTPUT'],
            doc: 'Lubricator',
          },
        ],
        pressure: { value: 6, unit: 'bar', type: 'operating' },
        flowRate: { value: 500, unit: 'L/min' },
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('<svg');
      expect(result.svg).toContain('</svg>');
      expect(result.svg).toContain('FRL Unit Test');
      expect(result.svg).toContain('data-ref="F1"');
      expect(result.svg).toContain('data-ref="R1"');
      expect(result.svg).toContain('data-ref="L1"');
      expect(result.svg).toContain('6 bar');
      expect(result.svg).toContain('500 L/min');
    });

    it('should render pneumatic cylinder control circuit', () => {
      const profile: PneumaticProfile = {
        type: 'pneumatic',
        name: 'Cylinder Control',
        nets: [
          { name: 'SUPPLY' },
          { name: 'PORT_A' },
          { name: 'PORT_B' },
          { name: 'EXHAUST' },
        ],
        parts: [
          {
            ref: 'V1',
            type: 'VALVE_52',
            pins: ['SUPPLY', 'PORT_A', 'PORT_B', 'EXHAUST'],
            doc: '5/2-way valve',
          },
          {
            ref: 'C1',
            type: 'CYL_DA',
            pins: ['PORT_A', 'PORT_B'],
            doc: 'Double-acting cylinder',
          },
        ],
        pressure: { value: 6, unit: 'bar', type: 'operating' },
        flowRate: { value: 800, unit: 'L/min' },
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('<svg');
      expect(result.svg).toContain('Cylinder Control');
      expect(result.svg).toContain('data-ref="V1"');
      expect(result.svg).toContain('data-ref="C1"');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render all 12 pneumatic symbol types', () => {
      const profile: PneumaticProfile = {
        type: 'pneumatic',
        name: 'All Pneumatic Symbols',
        nets: [{ name: 'NET1' }, { name: 'NET2' }],
        parts: [
          { ref: 'V32', type: 'VALVE_32', pins: ['NET1', 'NET2'] },
          { ref: 'V52', type: 'VALVE_52', pins: ['NET1', 'NET2'] },
          { ref: 'VC', type: 'CHECK_VALVE', pins: ['NET1', 'NET2'] },
          { ref: 'CSA', type: 'CYL_SA', pins: ['NET1'] },
          { ref: 'CDA', type: 'CYL_DA', pins: ['NET1', 'NET2'] },
          { ref: 'FA', type: 'FILTER', pins: ['NET1', 'NET2'] },
          { ref: 'RP', type: 'REGULATOR', pins: ['NET1', 'NET2'] },
          { ref: 'LUB', type: 'LUBRICATOR', pins: ['NET1', 'NET2'] },
          { ref: 'FC', type: 'FLOW_CONTROL', pins: ['NET1', 'NET2'] },
          { ref: 'EX', type: 'EXHAUST', pins: ['NET1'] },
          { ref: 'GP', type: 'GAUGE_P', pins: ['NET1'] },
          { ref: 'AS', type: 'AIR_SOURCE', pins: ['NET1'] },
        ],
        pressure: { value: 6, unit: 'bar', type: 'operating' },
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('<svg');
      expect(result.svg).toContain('All Pneumatic Symbols');
      // Verify all 12 symbols are rendered
      expect(result.svg).toContain('data-ref="V32"');
      expect(result.svg).toContain('data-ref="V52"');
      expect(result.svg).toContain('data-ref="VC"');
      expect(result.svg).toContain('data-ref="CSA"');
      expect(result.svg).toContain('data-ref="CDA"');
      expect(result.svg).toContain('data-ref="FA"');
      expect(result.svg).toContain('data-ref="RP"');
      expect(result.svg).toContain('data-ref="LUB"');
      expect(result.svg).toContain('data-ref="FC"');
      expect(result.svg).toContain('data-ref="EX"');
      expect(result.svg).toContain('data-ref="GP"');
      expect(result.svg).toContain('data-ref="AS"');
    });
  });

  describe('Hydraulic Circuit Rendering', () => {
    it('should render hydraulic power unit', () => {
      const profile: HydraulicProfile = {
        type: 'hydraulic',
        name: 'Hydraulic Power Unit',
        nets: [{ name: 'TANK' }, { name: 'PUMP_OUT' }, { name: 'RETURN' }],
        parts: [
          {
            ref: 'T1',
            type: 'RESERVOIR',
            pins: ['TANK', 'RETURN'],
            doc: 'Reservoir',
          },
          {
            ref: 'P1',
            type: 'PUMP_FIXED',
            pins: ['TANK', 'PUMP_OUT'],
            doc: 'Fixed pump',
          },
          {
            ref: 'RV1',
            type: 'RELIEF_VALVE',
            pins: ['PUMP_OUT', 'RETURN'],
            doc: 'Relief valve',
          },
          {
            ref: 'F1',
            type: 'FILTER_HYD',
            pins: ['RETURN', 'TANK'],
            doc: 'Return filter',
          },
        ],
        pressure: { value: 210, unit: 'bar', type: 'operating' },
        flowRate: { value: 40, unit: 'L/min' },
        fluid: {
          type: 'mineral',
          viscosity: 'ISO VG 46',
          temperature: { min: 10, max: 60, unit: 'C' },
        },
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('<svg');
      expect(result.svg).toContain('Hydraulic Power Unit');
      expect(result.svg).toContain('data-ref="T1"');
      expect(result.svg).toContain('data-ref="P1"');
      expect(result.svg).toContain('data-ref="RV1"');
      expect(result.svg).toContain('data-ref="F1"');
      expect(result.svg).toContain('210 bar');
      expect(result.svg).toContain('40 L/min');
      expect(result.svg).toContain('mineral');
      expect(result.svg).toContain('ISO VG 46');
    });

    it('should render hydraulic cylinder control', () => {
      const profile: HydraulicProfile = {
        type: 'hydraulic',
        name: 'Hydraulic Cylinder Control',
        nets: [
          { name: 'PUMP' },
          { name: 'PORT_A' },
          { name: 'PORT_B' },
          { name: 'TANK' },
        ],
        parts: [
          {
            ref: 'V1',
            type: 'VALVE_43',
            pins: ['PUMP', 'PORT_A', 'PORT_B', 'TANK'],
            doc: '4/3-way valve',
          },
          {
            ref: 'C1',
            type: 'CYL_HYD',
            pins: ['PORT_A', 'PORT_B'],
            doc: 'Hydraulic cylinder',
          },
        ],
        pressure: { value: 160, unit: 'bar', type: 'operating' },
        flowRate: { value: 30, unit: 'L/min' },
        fluid: { type: 'mineral', viscosity: 'ISO VG 32' },
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('<svg');
      expect(result.svg).toContain('Hydraulic Cylinder Control');
      expect(result.svg).toContain('data-ref="V1"');
      expect(result.svg).toContain('data-ref="C1"');
      expect(result.svg).toContain('160 bar');
    });

    it('should render all 13 hydraulic symbol types', () => {
      const profile: HydraulicProfile = {
        type: 'hydraulic',
        name: 'All Hydraulic Symbols',
        nets: [{ name: 'NET1' }, { name: 'NET2' }],
        parts: [
          { ref: 'RES', type: 'RESERVOIR', pins: ['NET1', 'NET2'] },
          { ref: 'PF', type: 'PUMP_FIXED', pins: ['NET1', 'NET2'] },
          { ref: 'PV', type: 'PUMP_VAR', pins: ['NET1', 'NET2'] },
          { ref: 'MH', type: 'MOTOR_HYD', pins: ['NET1', 'NET2'] },
          { ref: 'CH', type: 'CYL_HYD', pins: ['NET1', 'NET2'] },
          { ref: 'V43', type: 'VALVE_43', pins: ['NET1', 'NET2'] },
          { ref: 'VR', type: 'RELIEF_VALVE', pins: ['NET1', 'NET2'] },
          { ref: 'VRD', type: 'REDUCING_VALVE', pins: ['NET1', 'NET2'] },
          { ref: 'VC', type: 'CHECK_VALVE_HYD', pins: ['NET1', 'NET2'] },
          { ref: 'FC', type: 'FLOW_CONTROL_HYD', pins: ['NET1', 'NET2'] },
          { ref: 'ACC', type: 'ACCUMULATOR', pins: ['NET1'] },
          { ref: 'FLT', type: 'FILTER_HYD', pins: ['NET1', 'NET2'] },
          { ref: 'GP', type: 'GAUGE_P_HYD', pins: ['NET1'] },
        ],
        pressure: { value: 210, unit: 'bar', type: 'operating' },
        fluid: { type: 'mineral' },
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('<svg');
      expect(result.svg).toContain('All Hydraulic Symbols');
      // Verify all 13 symbols are rendered
      expect(result.svg).toContain('data-ref="RES"');
      expect(result.svg).toContain('data-ref="PF"');
      expect(result.svg).toContain('data-ref="PV"');
      expect(result.svg).toContain('data-ref="MH"');
      expect(result.svg).toContain('data-ref="CH"');
      expect(result.svg).toContain('data-ref="V43"');
      expect(result.svg).toContain('data-ref="VR"');
      expect(result.svg).toContain('data-ref="VRD"');
      expect(result.svg).toContain('data-ref="VC"');
      expect(result.svg).toContain('data-ref="FC"');
      expect(result.svg).toContain('data-ref="ACC"');
      expect(result.svg).toContain('data-ref="FLT"');
      expect(result.svg).toContain('data-ref="GP"');
    });

    it('should render hydraulic circuit with fluid specifications', () => {
      const profile: HydraulicProfile = {
        type: 'hydraulic',
        name: 'Fluid Spec Test',
        nets: [{ name: 'NET1' }],
        parts: [
          {
            ref: 'P1',
            type: 'PUMP_FIXED',
            pins: ['NET1'],
          },
        ],
        pressure: { value: 180, unit: 'bar', type: 'operating' },
        flowRate: { value: 60, unit: 'L/min' },
        fluid: {
          type: 'synthetic',
          viscosity: 'ISO VG 46',
          temperature: { min: 5, max: 70, unit: 'C' },
        },
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('<svg');
      expect(result.svg).toContain('synthetic');
      expect(result.svg).toContain('ISO VG 46');
      expect(result.svg).toContain('5');
      expect(result.svg).toContain('70');
    });
  });

  describe('Edge Cases and Validation', () => {
    it('should handle empty pneumatic circuit', () => {
      const profile: PneumaticProfile = {
        type: 'pneumatic',
        name: 'Empty Circuit',
        nets: [],
        parts: [],
        pressure: { value: 6, unit: 'bar', type: 'operating' },
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('<svg');
      expect(result.svg).toContain('Empty Circuit');
      expect(result.svg).toContain('6 bar');
    });

    it('should handle empty hydraulic circuit', () => {
      const profile: HydraulicProfile = {
        type: 'hydraulic',
        name: 'Empty Hydraulic',
        nets: [],
        parts: [],
        pressure: { value: 210, unit: 'bar', type: 'operating' },
        fluid: { type: 'mineral' },
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('<svg');
      expect(result.svg).toContain('Empty Hydraulic');
    });

    it('should handle different pressure units', () => {
      const profileBar: PneumaticProfile = {
        type: 'pneumatic',
        name: 'Bar Pressure',
        nets: [],
        parts: [{ ref: 'V1', type: 'VALVE_3_2', pins: [] }],
        pressure: { value: 6, unit: 'bar', type: 'operating' },
      };

      const profilePsi: PneumaticProfile = {
        type: 'pneumatic',
        name: 'PSI Pressure',
        nets: [],
        parts: [{ ref: 'V1', type: 'VALVE_3_2', pins: [] }],
        pressure: { value: 87, unit: 'psi', type: 'operating' },
      };

      const resultBar = renderSchematic(profileBar);
      const resultPsi = renderSchematic(profilePsi);

      expect(resultBar.svg).toContain('6 bar');
      expect(resultPsi.svg).toContain('87 psi');
    });

    it('should handle different flow rate units', () => {
      const profile1: HydraulicProfile = {
        type: 'hydraulic',
        name: 'Flow Rate Test',
        nets: [],
        parts: [{ ref: 'P1', type: 'PUMP_FIX', pins: [] }],
        pressure: { value: 210, unit: 'bar', type: 'operating' },
        flowRate: { value: 40, unit: 'L/min' },
        fluid: { type: 'mineral' },
      };

      const profile2: HydraulicProfile = {
        type: 'hydraulic',
        name: 'Flow Rate CFM',
        nets: [],
        parts: [{ ref: 'P1', type: 'PUMP_FIX', pins: [] }],
        pressure: { value: 210, unit: 'bar', type: 'operating' },
        flowRate: { value: 10, unit: 'CFM' },
        fluid: { type: 'mineral' },
      };

      const result1 = renderSchematic(profile1);
      const result2 = renderSchematic(profile2);

      expect(result1.svg).toContain('40 L/min');
      expect(result2.svg).toContain('10 CFM');
    });
  });

  describe('Complex Circuits', () => {
    it('should render sequential pneumatic control circuit', () => {
      const profile: PneumaticProfile = {
        type: 'pneumatic',
        name: 'Sequential Control A+ B+ B- A-',
        nets: [
          { name: 'SUPPLY' },
          { name: 'A_EXT' },
          { name: 'A_RET' },
          { name: 'B_EXT' },
          { name: 'B_RET' },
        ],
        parts: [
          {
            ref: 'VA',
            type: 'VALVE_52',
            pins: ['SUPPLY', 'A_EXT', 'A_RET'],
            doc: 'Valve A',
          },
          {
            ref: 'CA',
            type: 'CYL_DA',
            pins: ['A_EXT', 'A_RET'],
            doc: 'Cylinder A',
          },
          {
            ref: 'VB',
            type: 'VALVE_52',
            pins: ['SUPPLY', 'B_EXT', 'B_RET'],
            doc: 'Valve B',
          },
          {
            ref: 'CB',
            type: 'CYL_DA',
            pins: ['B_EXT', 'B_RET'],
            doc: 'Cylinder B',
          },
        ],
        pressure: { value: 6, unit: 'bar', type: 'operating' },
        flowRate: { value: 1200, unit: 'L/min' },
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('<svg');
      expect(result.svg).toContain('Sequential Control');
      expect(result.svg).toContain('data-ref="VA"');
      expect(result.svg).toContain('data-ref="CA"');
      expect(result.svg).toContain('data-ref="VB"');
      expect(result.svg).toContain('data-ref="CB"');
    });

    it('should render hydraulic press system', () => {
      const profile: HydraulicProfile = {
        type: 'hydraulic',
        name: 'Hydraulic Press',
        nets: [
          { name: 'PUMP' },
          { name: 'HIGH_PRESS' },
          { name: 'CYL_A' },
          { name: 'TANK' },
        ],
        parts: [
          {
            ref: 'RES',
            type: 'RESERVOIR',
            pins: ['TANK'],
            doc: 'Reservoir',
          },
          {
            ref: 'P1',
            type: 'PUMP_FIXED',
            pins: ['TANK', 'PUMP'],
            doc: 'Main pump',
          },
          {
            ref: 'INT',
            type: 'ACCUMULATOR',
            pins: ['PUMP', 'HIGH_PRESS'],
            doc: 'Intensifier',
          },
          {
            ref: 'V1',
            type: 'VALVE_43',
            pins: ['HIGH_PRESS', 'CYL_A', 'TANK'],
            doc: 'Main valve',
          },
          {
            ref: 'C1',
            type: 'CYL_HYD',
            pins: ['CYL_A'],
            doc: 'Press cylinder',
          },
          {
            ref: 'RV1',
            type: 'RELIEF_VALVE',
            pins: ['HIGH_PRESS', 'TANK'],
            doc: 'Relief valve',
          },
        ],
        pressure: { value: 250, unit: 'bar', type: 'operating' },
        flowRate: { value: 100, unit: 'L/min' },
        fluid: {
          type: 'phosphate-ester',
          viscosity: 'Type IV',
          temperature: { min: 15, max: 80, unit: 'C' },
        },
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('<svg');
      expect(result.svg).toContain('Hydraulic Press');
      expect(result.svg).toContain('data-ref="P1"');
      expect(result.svg).toContain('data-ref="INT"');
      expect(result.svg).toContain('data-ref="V1"');
      expect(result.svg).toContain('data-ref="C1"');
      expect(result.svg).toContain('data-ref="RV1"');
      expect(result.svg).toContain('250 bar');
      expect(result.svg).toContain('phosphate-ester');
    });
  });
});
