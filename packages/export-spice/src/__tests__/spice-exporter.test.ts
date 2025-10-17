import { describe, it, expect } from 'vitest';
import { toSpice } from '../index.js';
import type { ElectricalProfile } from '@runiq/core';

describe('SPICE Exporter', () => {
  describe('Basic Components', () => {
    it('should export a simple resistor circuit', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Simple Resistor',
        nets: [
          { name: 'IN' },
          { name: 'OUT' },
          { name: '0' }
        ],
        parts: [
          { ref: 'V1', type: 'V', params: { value: '5' }, pins: ['IN', '0'] },
          { ref: 'R1', type: 'R', params: { value: '1k' }, pins: ['IN', 'OUT'] },
          { ref: 'R2', type: 'R', params: { value: '2k' }, pins: ['OUT', '0'] }
        ]
      };

      const spice = toSpice(profile);

      expect(spice).toContain('* Simple Resistor');
      expect(spice).toContain('V1 IN 0 5');
      expect(spice).toContain('R1 IN OUT 1k');
      expect(spice).toContain('R2 OUT 0 2k');
      expect(spice).toContain('.end');
    });

    it('should export RC lowpass filter', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'RC Lowpass Filter',
        nets: [
          { name: 'IN' },
          { name: 'OUT' },
          { name: 'GND' }
        ],
        parts: [
          { ref: 'V1', type: 'V', params: { source: 'SIN(0 1 1k)' }, pins: ['IN', 'GND'] },
          { ref: 'R1', type: 'R', params: { value: '10k' }, pins: ['IN', 'OUT'] },
          { ref: 'C1', type: 'C', params: { value: '1n' }, pins: ['OUT', 'GND'] }
        ]
      };

      const spice = toSpice(profile);

      expect(spice).toContain('* RC Lowpass Filter');
      expect(spice).toContain('V1 IN 0 SIN(0 1 1k)'); // GND normalized to 0
      expect(spice).toContain('R1 IN OUT 10k');
      expect(spice).toContain('C1 OUT 0 1n'); // GND normalized to 0
      expect(spice).toContain('.end');
    });

    it('should export inductor', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'RL Circuit',
        nets: [{ name: 'A' }, { name: 'B' }],
        parts: [
          { ref: 'L1', type: 'L', params: { value: '10m' }, pins: ['A', 'B'] }
        ]
      };

      const spice = toSpice(profile);

      expect(spice).toContain('L1 A B 10m');
    });

    it('should export current source', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Current Source',
        nets: [{ name: 'N1' }, { name: '0' }],
        parts: [
          { ref: 'I1', type: 'I', params: { value: '1m' }, pins: ['N1', '0'] }
        ]
      };

      const spice = toSpice(profile);

      expect(spice).toContain('I1 N1 0 1m');
    });
  });

  describe('Voltage Sources', () => {
    it('should handle DC voltage source', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'DC Source',
        nets: [{ name: 'VCC' }, { name: '0' }],
        parts: [
          { ref: 'VDD', type: 'V', params: { value: '5' }, pins: ['VCC', '0'] }
        ]
      };

      const spice = toSpice(profile);

      expect(spice).toContain('VDD VCC 0 5');
    });

    it('should handle AC source with source parameter', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'AC Source',
        nets: [{ name: 'IN' }, { name: '0' }],
        parts: [
          { ref: 'V1', type: 'V', params: { source: 'SIN(0 1 1k)' }, pins: ['IN', '0'] }
        ]
      };

      const spice = toSpice(profile);

      expect(spice).toContain('V1 IN 0 SIN(0 1 1k)');
    });

    it('should prefer source over value for voltage sources', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Source Priority',
        nets: [{ name: 'N' }, { name: '0' }],
        parts: [
          { 
            ref: 'V1', 
            type: 'V', 
            params: { value: '5', source: 'PULSE(0 5 0 1n 1n 1u 2u)' }, 
            pins: ['N', '0'] 
          }
        ]
      };

      const spice = toSpice(profile);

      expect(spice).toContain('V1 N 0 PULSE(0 5 0 1n 1n 1u 2u)');
      expect(spice).not.toContain('V1 N 0 5');
    });
  });

  describe('Ground Normalization', () => {
    it('should normalize GND to 0', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Ground Test',
        nets: [{ name: 'A' }, { name: 'GND' }],
        parts: [
          { ref: 'R1', type: 'R', params: { value: '1k' }, pins: ['A', 'GND'] }
        ]
      };

      const spice = toSpice(profile);

      expect(spice).toContain('R1 A 0 1k');
    });

    it('should keep numeric 0 as is', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Zero Test',
        nets: [{ name: 'A' }, { name: '0' }],
        parts: [
          { ref: 'R1', type: 'R', params: { value: '1k' }, pins: ['A', '0'] }
        ]
      };

      const spice = toSpice(profile);

      expect(spice).toContain('R1 A 0 1k');
    });
  });

  describe('Analyses', () => {
    it('should export transient analysis', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Transient',
        nets: [],
        parts: [],
        analyses: [
          { kind: 'tran', args: '0 5m' }
        ]
      };

      const spice = toSpice(profile);

      expect(spice).toContain('.tran 0 5m');
    });

    it('should export AC analysis', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'AC Analysis',
        nets: [],
        parts: [],
        analyses: [
          { kind: 'ac', args: 'dec 10 1 100k' }
        ]
      };

      const spice = toSpice(profile);

      expect(spice).toContain('.ac dec 10 1 100k');
    });

    it('should export DC analysis', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'DC Analysis',
        nets: [],
        parts: [],
        analyses: [
          { kind: 'dc', args: 'V1 0 5 0.1' }
        ]
      };

      const spice = toSpice(profile);

      expect(spice).toContain('.dc V1 0 5 0.1');
    });

    it('should export operating point analysis without args', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'OP Analysis',
        nets: [],
        parts: [],
        analyses: [
          { kind: 'op' }
        ]
      };

      const spice = toSpice(profile);

      expect(spice).toContain('.op');
      // Check .op doesn't have trailing content (just .op then newline or end)
      expect(spice).toMatch(/\.op\n/);
    });

    it('should export multiple analyses', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Multi-Analysis',
        nets: [{ name: 'IN' }, { name: '0' }],
        parts: [
          { ref: 'V1', type: 'V', params: { source: 'SIN(0 1 1k)' }, pins: ['IN', '0'] },
          { ref: 'R1', type: 'R', params: { value: '1k' }, pins: ['IN', '0'] }
        ],
        analyses: [
          { kind: 'tran', args: '0 10m' },
          { kind: 'ac', args: 'dec 10 1 100k' },
          { kind: 'op' }
        ]
      };

      const spice = toSpice(profile);

      expect(spice).toContain('.tran 0 10m');
      expect(spice).toContain('.ac dec 10 1 100k');
      expect(spice).toContain('.op');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty profile', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Empty',
        nets: [],
        parts: []
      };

      const spice = toSpice(profile);

      expect(spice).toContain('* Empty');
      expect(spice).toContain('.end');
    });

    it('should handle parts without params', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'No Params',
        nets: [{ name: 'A' }, { name: 'B' }],
        parts: [
          { ref: 'R1', type: 'R', pins: ['A', 'B'] }
        ]
      };

      const spice = toSpice(profile);

      // Should still output the part, just without value
      expect(spice).toContain('R1 A B');
    });

    it('should handle complex net names', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Complex Nets',
        nets: [{ name: 'VCC_3V3' }, { name: 'VSS' }],
        parts: [
          { ref: 'R1', type: 'R', params: { value: '10k' }, pins: ['VCC_3V3', 'VSS'] }
        ]
      };

      const spice = toSpice(profile);

      expect(spice).toContain('R1 VCC_3V3 0 10k'); // VSS normalized to 0
    });
  });

  describe('Complete Circuit', () => {
    it('should export complete RC filter with all elements', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'RC Lowpass Filter',
        nets: [
          { name: 'IN' },
          { name: 'OUT' },
          { name: 'GND' }
        ],
        parts: [
          { ref: 'V1', type: 'V', params: { source: 'SIN(0 1 1k)' }, pins: ['IN', 'GND'] },
          { ref: 'R1', type: 'R', params: { value: '10k' }, pins: ['IN', 'OUT'] },
          { ref: 'C1', type: 'C', params: { value: '1n' }, pins: ['OUT', 'GND'] }
        ],
        analyses: [
          { kind: 'tran', args: '0 5m' },
          { kind: 'ac', args: 'dec 10 1 100k' }
        ]
      };

      const spice = toSpice(profile);

      // Check structure
      const lines = spice.split('\n').filter((l: string) => l.trim());
      expect(lines[0]).toMatch(/^\*/); // Comment
      expect(lines[lines.length - 1]).toBe('.end');

      // Check content
      expect(spice).toContain('V1 IN 0 SIN(0 1 1k)');
      expect(spice).toContain('R1 IN OUT 10k');
      expect(spice).toContain('C1 OUT 0 1n');
      expect(spice).toContain('.tran 0 5m');
      expect(spice).toContain('.ac dec 10 1 100k');
    });
  });
});
